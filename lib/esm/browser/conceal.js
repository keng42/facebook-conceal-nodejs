/**
 * 浏览器使用的字符串加密解密类
 * 兼容 Conceal 2.0
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DEFAULT_KEY } from '../utilities';
const { crypto } = window;
export function arrayBufferToHex(buffer) {
    return Array.prototype.map
        .call(new Uint8Array(buffer), (x) => `00${x.toString(16)}`.slice(-2))
        .join('');
}
export function hexToArrayBuffer(hex) {
    const typedArray = new Uint8Array((hex.match(/[\da-f]{2}/gi) || []).map((h) => parseInt(h, 16)));
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
export function concatArrayBuffer(c, ...arrays) {
    let totalLength = 0;
    arrays.forEach((arr) => {
        totalLength += arr.length;
    });
    const result = new c(totalLength);
    let offset = 0;
    arrays.forEach((arr) => {
        result.set(arr, offset);
        offset += arr.length;
    });
    return result;
}
export class Conceal {
    constructor(password, encoding = 'base64', keyStr = DEFAULT_KEY, algo = 'aes-256-gcm') {
        this.password = password;
        this.encoding = encoding;
        this.algo = algo;
        if (encoding === 'base64' || keyStr === DEFAULT_KEY) {
            this.key = base64ToArrayBuffer(keyStr);
        }
        else {
            this.key = hexToArrayBuffer(keyStr);
        }
        this.isBase64 = encoding === 'base64';
        this.versionBuf = new TextEncoder().encode('\u0001\u0002');
    }
    randomBytes(len = 12, isBase64 = this.isBase64) {
        const buf = crypto.getRandomValues(new Uint8Array(len));
        if (isBase64) {
            return arrayBufferToBase64(buf);
        }
        return arrayBufferToHex(buf);
    }
    encryptStr(text, password = this.password) {
        return __awaiter(this, void 0, void 0, function* () {
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const additionalData = concatArrayBuffer(Uint8Array, this.versionBuf, new TextEncoder().encode(password));
            const alg = {
                name: 'AES-GCM',
                iv,
                additionalData,
            };
            const key = yield crypto.subtle.importKey('raw', this.key, alg, false, [
                'encrypt',
            ]);
            const ptUint8 = new TextEncoder().encode(text);
            const encBuf = yield crypto.subtle.encrypt(alg, key, ptUint8);
            const resultBuf = concatArrayBuffer(Uint8Array, this.versionBuf, iv, new Uint8Array(encBuf));
            if (this.isBase64) {
                return arrayBufferToBase64(resultBuf);
            }
            return arrayBufferToHex(resultBuf);
        });
    }
    decryptStr(encrypted, password = this.password) {
        return __awaiter(this, void 0, void 0, function* () {
            let cipherBuf;
            if (this.isBase64) {
                cipherBuf = base64ToArrayBuffer(encrypted);
            }
            else {
                cipherBuf = hexToArrayBuffer(encrypted);
            }
            const versionBuf = new Uint8Array(cipherBuf.slice(0, 2));
            const iv = new Uint8Array(cipherBuf.slice(2, 14));
            const encBuf = new Uint8Array(cipherBuf.slice(14));
            const additionalData = concatArrayBuffer(Uint8Array, versionBuf, new TextEncoder().encode(password));
            const alg = { name: 'AES-GCM', iv: new Uint8Array(iv), additionalData };
            const key = yield crypto.subtle.importKey('raw', base64ToArrayBuffer(DEFAULT_KEY), alg, false, ['decrypt']);
            const plainBuffer = yield crypto.subtle.decrypt(alg, key, encBuf);
            const plaintext = new TextDecoder().decode(plainBuffer);
            return plaintext;
        });
    }
}
