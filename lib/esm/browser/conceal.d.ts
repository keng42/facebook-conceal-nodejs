/**
 * 浏览器使用的字符串加密解密类
 * 兼容 Conceal 2.0
 */
export declare function arrayBufferToHex(buffer: Uint8Array): string;
export declare function hexToArrayBuffer(hex: string): ArrayBufferLike;
export declare function base64ToArrayBuffer(base64: string): ArrayBufferLike;
export declare function arrayBufferToBase64(buffer: Uint8Array): string;
export declare function concatArrayBuffer<T extends Uint8Array>(c: {
    new (len: number): T;
}, ...arrays: T[]): T;
export declare class Conceal {
    password: string;
    key: ArrayBuffer;
    encoding: 'base64' | 'hex';
    algo: 'aes-256-gcm' | 'aes-128-gcm';
    isBase64: boolean;
    versionBuf: Uint8Array;
    constructor(password: string, encoding?: 'base64' | 'hex', keyStr?: string, algo?: 'aes-256-gcm' | 'aes-128-gcm');
    randomBytes(len?: number, isBase64?: boolean): string;
    encryptStr(text: string, password?: string): Promise<string>;
    decryptStr(encrypted: string, password?: string): Promise<string>;
}
