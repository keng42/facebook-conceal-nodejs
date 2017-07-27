const Conceal = require('../index.js');

describe('facebook-conceal', () => {
  describe('#加密解密字符串', () => {
    it('加密解密之后应该返回相同字符串', () => {
      const conceal = new Conceal('ppww');
      const plain = 'hello world @ 2017';
      const encrypted = conceal.encryptStr(plain);
      const decrypted = conceal.decryptStr(encrypted);
      if (plain !== decrypted) {
        throw new Erorr('decrypt not right');
      }
    });
  });
});
