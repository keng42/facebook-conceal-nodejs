/**
 * 浏览器使用的字符串加密解密类
 * 兼容 Conceal 2.0
 */

const { crypto } = window;

const DEFAULT_KEY = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';

export function arrayBufferToHex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), x => `00${x.toString(16)}`.slice(-2))
    .join('');
}

export function hexToArrayBuffer(hex) {
  const typedArray = new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)),
  );
  return typedArray.buffer;
}

export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function concatArrayBuffer(Con, ...arrays) {
  let totalLength = 0;
  arrays.forEach((arr) => {
    totalLength += arr.length;
  });
  const result = new Con(totalLength);
  let offset = 0;
  arrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
}

export default class Conceal {
  constructor(encoding = 'base64', key = DEFAULT_KEY, keyEncoding = 'base64') {
    this.isBase64 = encoding === 'base64';
    this.versionBuf = new TextEncoder().encode('\u0001\u0002');
    if (keyEncoding === 'base64') {
      this.keyBuf = base64ToArrayBuffer(key);
    } else {
      this.keyBuf = hexToArrayBuffer(key);
    }
  }

  randomBytes(len = 12, isBase64 = this.isBase64) {
    const buf = crypto.getRandomValues(new Uint8Array(len));
    if (isBase64) {
      return arrayBufferToBase64(buf);
    }
    return arrayBufferToHex(buf);
  }

  async encrypt(text, pwd) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const additionalData = concatArrayBuffer(
      Uint8Array,
      this.versionBuf,
      new TextEncoder().encode(pwd),
    );
    const alg = {
      name: 'AES-GCM',
      iv,
      additionalData,
    };
    const key = await crypto.subtle.importKey('raw', this.keyBuf, alg, false, [
      'encrypt',
    ]);

    const ptUint8 = new TextEncoder().encode(text);
    const encBuf = await crypto.subtle.encrypt(alg, key, ptUint8);

    const resultBuf = concatArrayBuffer(
      Uint8Array,
      this.versionBuf,
      iv,
      new Uint8Array(encBuf),
    );

    if (this.isBase64) {
      return arrayBufferToBase64(resultBuf);
    }
    return arrayBufferToHex(resultBuf);
  }

  async decrypt(cipher, pwd) {
    let cipherBuf;
    if (this.isBase64) {
      cipherBuf = base64ToArrayBuffer(cipher);
    } else {
      cipherBuf = hexToArrayBuffer(cipher);
    }
    const versionBuf = new Uint8Array(cipherBuf.slice(0, 2));
    const iv = new Uint8Array(cipherBuf.slice(2, 14));
    const encBuf = new Uint8Array(cipherBuf.slice(14));

    const additionalData = concatArrayBuffer(
      Uint8Array,
      versionBuf,
      new TextEncoder().encode(pwd),
    );

    const alg = { name: 'AES-GCM', iv: new Uint8Array(iv), additionalData };
    const key = await crypto.subtle.importKey(
      'raw',
      base64ToArrayBuffer(DEFAULT_KEY),
      alg,
      false,
      ['decrypt'],
    );

    const plainBuffer = await crypto.subtle.decrypt(alg, key, encBuf);
    const plaintext = new TextDecoder().decode(plainBuffer);

    return plaintext;
  }
}
