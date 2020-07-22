declare module "facebook-conceal" {
    export function arrayBufferToHex(buffer: Uint8Array): string;
    export function hexToArrayBuffer(hex: string): ArrayBufferLike;
    export function base64ToArrayBuffer(base64: string): ArrayBufferLike;
    export function arrayBufferToBase64(buffer: Uint8Array): string;
    export function concatArrayBuffer<T extends Uint8Array>(c: {
        new (len: number): T;
    }, ...arrays: T[]): T;
    export class Conceal {
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
}
