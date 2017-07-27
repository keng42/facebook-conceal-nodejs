# node.js 端使用的加密解密模块
兼容 [Facebook Conceal 2.0](https://github.com/facebook/conceal)  

# 使用
```js
const Conceal = require('facebook-conceal');

const conceal = new Conceal('my-password');
const plain = 'hello world @ 2017';
const encrypted = conceal.encryptStr(plain);
const decrypted = conceal.decryptStr(encrypted);
```
