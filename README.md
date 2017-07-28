# Facebook Conceal for node.js

Compatible with [Facebook Conceal 2.0](https://github.com/facebook/conceal)

# Usage

## Conceal

```javascript
const Conceal = require('facebook-conceal');
const conceal = new Conceal('my-password');

// or
const conceal = new Conceal('my-password', myKey, encoding);
// encoding: hex or base64
// myKey: 32 bytes with ${encoding} encoded string
```

## String

```javascript
const plain = 'hello world @ 2017';
const encrypted = conceal.encryptStr(plain);
const decrypted = conceal.decryptStr(encrypted);
```

## File

```javascript
const srcFilePath = 'test/xxy007.png';
const encFilePath = `${srcFilePath}.enc`;
const decFilePath = `dec.${srcFilePath}`;

conceal.encryptFile(path, encFilePath)
  .then(() => conceal.decryptFile(encFilePath, decFilePath))
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
```
