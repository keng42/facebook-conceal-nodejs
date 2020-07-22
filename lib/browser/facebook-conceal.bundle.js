var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("facebook-conceal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Conceal = exports.concatArrayBuffer = exports.arrayBufferToBase64 = exports.base64ToArrayBuffer = exports.hexToArrayBuffer = exports.arrayBufferToHex = void 0;
    /**
     * 浏览器使用的字符串加密解密类
     * 兼容 Conceal 2.0
     */
    var crypto = window.crypto;
    var DEFAULT_KEY = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';
    function arrayBufferToHex(buffer) {
        return Array.prototype.map
            .call(new Uint8Array(buffer), function (x) { return ("00" + x.toString(16)).slice(-2); })
            .join('');
    }
    exports.arrayBufferToHex = arrayBufferToHex;
    function hexToArrayBuffer(hex) {
        var typedArray = new Uint8Array((hex.match(/[\da-f]{2}/gi) || []).map(function (h) { return parseInt(h, 16); }));
        return typedArray.buffer;
    }
    exports.hexToArrayBuffer = hexToArrayBuffer;
    function base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i += 1) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
    exports.base64ToArrayBuffer = base64ToArrayBuffer;
    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i += 1) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    exports.arrayBufferToBase64 = arrayBufferToBase64;
    function concatArrayBuffer(c) {
        var arrays = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arrays[_i - 1] = arguments[_i];
        }
        var totalLength = 0;
        arrays.forEach(function (arr) {
            totalLength += arr.length;
        });
        var result = new c(totalLength);
        var offset = 0;
        arrays.forEach(function (arr) {
            result.set(arr, offset);
            offset += arr.length;
        });
        return result;
    }
    exports.concatArrayBuffer = concatArrayBuffer;
    var Conceal = /** @class */ (function () {
        function Conceal(password, encoding, keyStr, algo) {
            if (encoding === void 0) { encoding = 'base64'; }
            if (keyStr === void 0) { keyStr = DEFAULT_KEY; }
            if (algo === void 0) { algo = 'aes-256-gcm'; }
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
        Conceal.prototype.randomBytes = function (len, isBase64) {
            if (len === void 0) { len = 12; }
            if (isBase64 === void 0) { isBase64 = this.isBase64; }
            var buf = crypto.getRandomValues(new Uint8Array(len));
            if (isBase64) {
                return arrayBufferToBase64(buf);
            }
            return arrayBufferToHex(buf);
        };
        Conceal.prototype.encryptStr = function (text, password) {
            if (password === void 0) { password = this.password; }
            return __awaiter(this, void 0, void 0, function () {
                var iv, additionalData, alg, key, ptUint8, encBuf, resultBuf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            iv = crypto.getRandomValues(new Uint8Array(12));
                            additionalData = concatArrayBuffer(Uint8Array, this.versionBuf, new TextEncoder().encode(password));
                            alg = {
                                name: 'AES-GCM',
                                iv: iv,
                                additionalData: additionalData,
                            };
                            return [4 /*yield*/, crypto.subtle.importKey('raw', this.key, alg, false, [
                                    'encrypt',
                                ])];
                        case 1:
                            key = _a.sent();
                            ptUint8 = new TextEncoder().encode(text);
                            return [4 /*yield*/, crypto.subtle.encrypt(alg, key, ptUint8)];
                        case 2:
                            encBuf = _a.sent();
                            resultBuf = concatArrayBuffer(Uint8Array, this.versionBuf, iv, new Uint8Array(encBuf));
                            if (this.isBase64) {
                                return [2 /*return*/, arrayBufferToBase64(resultBuf)];
                            }
                            return [2 /*return*/, arrayBufferToHex(resultBuf)];
                    }
                });
            });
        };
        Conceal.prototype.decryptStr = function (encrypted, password) {
            if (password === void 0) { password = this.password; }
            return __awaiter(this, void 0, void 0, function () {
                var cipherBuf, versionBuf, iv, encBuf, additionalData, alg, key, plainBuffer, plaintext;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.isBase64) {
                                cipherBuf = base64ToArrayBuffer(encrypted);
                            }
                            else {
                                cipherBuf = hexToArrayBuffer(encrypted);
                            }
                            versionBuf = new Uint8Array(cipherBuf.slice(0, 2));
                            iv = new Uint8Array(cipherBuf.slice(2, 14));
                            encBuf = new Uint8Array(cipherBuf.slice(14));
                            additionalData = concatArrayBuffer(Uint8Array, versionBuf, new TextEncoder().encode(password));
                            alg = { name: 'AES-GCM', iv: new Uint8Array(iv), additionalData: additionalData };
                            return [4 /*yield*/, crypto.subtle.importKey('raw', base64ToArrayBuffer(DEFAULT_KEY), alg, false, ['decrypt'])];
                        case 1:
                            key = _a.sent();
                            return [4 /*yield*/, crypto.subtle.decrypt(alg, key, encBuf)];
                        case 2:
                            plainBuffer = _a.sent();
                            plaintext = new TextDecoder().decode(plainBuffer);
                            return [2 /*return*/, plaintext];
                    }
                });
            });
        };
        return Conceal;
    }());
    exports.Conceal = Conceal;
});
//# sourceMappingURL=facebook-conceal.bundle.js.map