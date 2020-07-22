import { expect } from 'chai';
import 'mocha';
import { Conceal } from '../src/node/conceal';
import { calcMD5 } from '../src/utilities';

describe('hash-utils', () => {
  it('compare file md5', () =>
    calcMD5('test/xxy007.png').then((str) => {
      expect(str).to.be.equal('389d8e336cfdf9eb9dc009cd4c790cee');
    }));
});

describe('facebook-conceal', () => {
  describe('#encrypt and decrypt string', () => {
    it('should return the same string', () => {
      const conceal = new Conceal('my-password');
      const plain = 'hello world @ 2020';
      const encrypted = conceal.encryptStr(plain);
      const decrypted = conceal.decryptStr(encrypted);
      expect(plain).to.be.equal(decrypted);
    });
  });

  describe('#encrypt and decrypt file', () => {
    it('should return the same file', async () => {
      const conceal = new Conceal('my-password');
      const path = 'test/xxy007.png';

      return conceal
        .encryptFile(path, `${path}.enc`)
        .then(() => conceal.decryptFile(`${path}.enc`, `${path}.enc.png`))
        .then(() => Promise.all([calcMD5(path), calcMD5(`${path}.enc.png`)]))
        .then((strs) => {
          expect(strs[0]).to.be.a('string');
          expect(strs[1]).to.be.a('string');
          expect(strs[0]).to.be.equal(strs[1]);
        });
    });
  });
});
