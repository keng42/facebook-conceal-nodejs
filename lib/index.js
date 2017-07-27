const crypto = require('crypto');
const fs = require('fs');

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes;
}

const defaultKey = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';

class Conceal {
  constructor(pwd, key = defaultKey, algo = 'aes-256-gcm', encoding = 'base64') {
    this.pwd = pwd;
    this.encoding = encoding;
    this.key = new Buffer(key, encoding);
    this.algo = algo;
  }

  encryptStr(text) {
    const iv = crypto.randomBytes(Math.ceil(12));
    const cipher = crypto.createCipheriv(this.algo, this.key, iv);
    cipher.setAAD(new Buffer('0102', 'hex'));
    cipher.setAAD(new Buffer(this.pwd, 'utf8'));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    const c = `0102${iv.toString('hex')}${encrypted}${tag.toString('hex')}`;
    return new Buffer(c, 'hex').toString(this.encoding);
  }

  decryptStr(encrypted) {
    const cipher = new Buffer(encrypted, this.encoding);
    const iv = new Buffer(12);
    const tag = new Buffer(16);
    const enc = new Buffer(cipher.length - 30);
    cipher.copy(iv, 0, 2);
    cipher.copy(tag, 0, cipher.length - 16);
    cipher.copy(enc, 0, 14);

    const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(new Buffer('0102', 'hex'));
    decipher.setAAD(new Buffer(this.pwd, 'utf8'));

    let dec = decipher.update(enc, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  encryptFile(src, dst) {
    const input = fs.createReadStream(src);
    const output = fs.createWriteStream(dst);
    const iv = crypto.randomBytes(Math.ceil(12));
    const cipher = crypto.createCipheriv(this.algo, this.key, iv);
    cipher.setAAD(new Buffer('0102', 'hex'));
    cipher.setAAD(new Buffer(this.pwd, 'utf8'));
    output.write(new Buffer('0102', 'hex'));
    output.write(iv);

    input.pipe(cipher).pipe(output);
    input.on('end', () => {
      const tag = cipher.getAuthTag();
      output.write(tag);
    });
  }

  decryptFile(src, dst) {
    const fd = fs.openSync(src, 'r');
    const iv = new Buffer(12);
    const tag = new Buffer(16);
    const start = getFilesizeInBytes(src) - 16;
    fs.readSync(fd, iv, 0, 12, 2);
    fs.readSync(fd, tag, 0, 16, start);

    const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
    decipher.setAuthTag(tag);
    decipher.setAAD(new Buffer('0102', 'hex'));
    decipher.setAAD(new Buffer(this.pwd, 'utf8'));

    const input = fs.createReadStream(src, {
      start: 14,
      end: start - 1,
    });

    const output = fs.createWriteStream(dst);
    input.pipe(decipher).pipe(output);
  }
}

module.exports = Conceal;
