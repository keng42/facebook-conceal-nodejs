import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export async function calcMD5(filepath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const rs = createReadStream(filepath);
      const hash = createHash('md5');
      rs.on('data', hash.update.bind(hash));
      rs.on('end', () => {
        resolve(hash.digest('hex'));
      });
    } catch (e) {
      reject(e);
    }
  });
}

export const DEFAULT_KEY = '7At16p/dyonmDW3ll9Pl1bmCsWEACxaIzLmyC0ZWGaE=';
