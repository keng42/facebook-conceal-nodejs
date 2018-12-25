const crypto = require('crypto');
const fs = require('fs');

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

const defaultKey = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';

class Conceal {
  constructor(pwd, key = defaultKey, encoding = 'base64', algo = 'aes-256-gcm') {
    this.pwd = pwd;
    this.encoding = encoding;
    this.key = Buffer.from(key, encoding);
    this.algo = algo;
  }

  encryptStr(text) {
    const iv = crypto.randomBytes(Math.ceil(12));
    const cipher = crypto.createCipheriv(this.algo, this.key, iv);
    cipher.setAAD(Buffer.from('0102', 'hex'));
    cipher.setAAD(Buffer.from(this.pwd, 'utf8'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    const c = `0102${iv.toString('hex')}${encrypted}${tag.toString('hex')}`;
    return Buffer.from(c, 'hex').toString(this.encoding);
  }

  decryptStr(encrypted) {
    const cipher = Buffer.from(encrypted, this.encoding);
    const iv = Buffer.alloc(12);
    const tag = Buffer.alloc(16);
    const enc = Buffer.alloc(cipher.length - 30);
    cipher.copy(iv, 0, 2);
    cipher.copy(tag, 0, cipher.length - 16);
    cipher.copy(enc, 0, 14);

    const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(Buffer.from('0102', 'hex'));
    decipher.setAAD(Buffer.from(this.pwd, 'utf8'));

    let dec = decipher.update(enc, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  encryptFile(src, dst) {
    return new Promise((resolve, reject) => {
      try {
        const input = fs.createReadStream(src);
        const output = fs.createWriteStream(dst);
        const iv = crypto.randomBytes(Math.ceil(12));
        const cipher = crypto.createCipheriv(this.algo, this.key, iv);
        cipher.setAAD(Buffer.from('0102', 'hex'));
        cipher.setAAD(Buffer.from(this.pwd, 'utf8'));

        cipher.on('error', (err) => {
          reject(err);
        });

        output.write(Buffer.from('0102', 'hex'));
        output.write(iv);

        input.pipe(cipher).pipe(output);
        input.on('end', () => {
          const tag = cipher.getAuthTag();
          output.end(tag);
        });
        input.on('error', (err) => {
          reject(err);
        });
        output.on('finish', () => {
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  decryptFile(src, dst) {
    return new Promise((resolve, reject) => {
      try {
        const fd = fs.openSync(src, 'r');
        const iv = Buffer.alloc(12);
        const tag = Buffer.alloc(16);
        const start = getFilesizeInBytes(src) - 16;
        fs.readSync(fd, iv, 0, 12, 2);
        fs.readSync(fd, tag, 0, 16, start);

        const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
        decipher.setAuthTag(tag);
        decipher.setAAD(Buffer.from('0102', 'hex'));
        decipher.setAAD(Buffer.from(this.pwd, 'utf8'));

        decipher.on('error', (err) => {
          reject(err);
        });

        const input = fs.createReadStream(src, {
          start: 14,
          end: start - 1,
        });
        const output = fs.createWriteStream(dst);

        input.pipe(decipher).pipe(output);
        input.on('end', () => {
          output.end();
        });
        input.on('error', (err) => {
          reject(err);
        });
        output.on('finish', () => {
          resolve(true);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = Conceal;
