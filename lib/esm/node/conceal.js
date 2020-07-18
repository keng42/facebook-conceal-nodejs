var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as crypto from 'crypto';
import * as fs from 'fs';
import { DEFAULT_KEY } from '../utilities';
function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename);
    const fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}
export class Conceal {
    constructor(password, encoding = 'base64', keyStr = DEFAULT_KEY, algo = 'aes-256-gcm') {
        this.password = password;
        this.key = Buffer.from(keyStr, keyStr === DEFAULT_KEY ? 'base64' : encoding);
        this.encoding = encoding;
        this.algo = algo;
        this.isBase64 = encoding === 'base64';
        this.versionBuf = Buffer.from('0102', 'hex');
    }
    encryptStr(text, password = this.password) {
        const iv = crypto.randomBytes(Math.ceil(12));
        const cipher = crypto.createCipheriv(this.algo, this.key, iv);
        cipher.setAAD(this.versionBuf);
        cipher.setAAD(Buffer.from(password, 'utf8'));
        const encryptedBuf1 = cipher.update(text, 'utf8');
        const encryptedBuf2 = cipher.final();
        const tag = cipher.getAuthTag();
        const buf = Buffer.concat([
            this.versionBuf,
            iv,
            encryptedBuf1,
            encryptedBuf2,
            tag,
        ]);
        return buf.toString(this.encoding);
    }
    decryptStr(encrypted, password = this.password) {
        const cipher = Buffer.from(encrypted, this.encoding);
        const iv = Buffer.alloc(12);
        const tag = Buffer.alloc(16);
        const enc = Buffer.alloc(cipher.length - 30);
        cipher.copy(iv, 0, 2);
        cipher.copy(tag, 0, cipher.length - 16);
        cipher.copy(enc, 0, 14);
        const decipher = crypto.createDecipheriv(this.algo, this.key, iv);
        decipher.setAuthTag(tag);
        decipher.setAAD(this.versionBuf);
        decipher.setAAD(Buffer.from(password, 'utf8'));
        let dec = decipher.update(enc, this.encoding, 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }
    encryptFile(src, dst, password = this.password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const input = fs.createReadStream(src);
                    const output = fs.createWriteStream(dst);
                    const iv = crypto.randomBytes(Math.ceil(12));
                    const cipher = crypto.createCipheriv(this.algo, this.key, iv);
                    cipher.setAAD(this.versionBuf);
                    cipher.setAAD(Buffer.from(password, 'utf8'));
                    cipher.on('error', (err) => {
                        reject(err);
                    });
                    output.write(this.versionBuf);
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
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    decryptFile(src, dst, password = this.password) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    decipher.setAAD(this.versionBuf);
                    decipher.setAAD(Buffer.from(password, 'utf8'));
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
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
