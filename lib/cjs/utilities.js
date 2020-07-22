"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_KEY = exports.calcMD5 = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
function calcMD5(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            try {
                const rs = fs_1.createReadStream(filepath);
                const hash = crypto_1.createHash('md5');
                rs.on('data', hash.update.bind(hash));
                rs.on('end', () => {
                    resolve(hash.digest('hex'));
                });
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
exports.calcMD5 = calcMD5;
exports.DEFAULT_KEY = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';
