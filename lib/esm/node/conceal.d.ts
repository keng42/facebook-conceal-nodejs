/// <reference types="node" />
export declare class Conceal {
    password: string;
    key: Buffer;
    encoding: 'base64' | 'hex';
    algo: 'aes-256-gcm' | 'aes-128-gcm';
    isBase64: boolean;
    versionBuf: Buffer;
    constructor(password: string, encoding?: 'base64' | 'hex', keyStr?: string, algo?: 'aes-256-gcm' | 'aes-128-gcm');
    encryptStr(text: string, password?: string): string;
    decryptStr(encrypted: string, password?: string): string;
    encryptFile(src: string, dst: string, password?: string): Promise<boolean>;
    decryptFile(src: string, dst: string, password?: string): Promise<boolean>;
}
