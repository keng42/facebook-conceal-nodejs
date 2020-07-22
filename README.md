# Facebook Conceal for node.js

Compatible with [Facebook Conceal 2.0](https://github.com/facebook/conceal)

# Usage

## Conceal

```js
const { Conceal } = require('facebook-conceal');
const conceal = new Conceal('my-password');

// or
const conceal = new Conceal('my-password', myKey, encoding);
// encoding: hex or base64
// myKey: 32 bytes with ${encoding} encoded string
```

## String

```js
const plain = 'hello world @ 2020';
const encrypted = conceal.encryptStr(plain);
const decrypted = conceal.decryptStr(encrypted);
```

## File

```js
const srcFilePath = 'test/xxy007.png';
const encFilePath = `${srcFilePath}.enc`;
const decFilePath = `dec.${srcFilePath}`;

conceal
  .encryptFile(path, encFilePath)
  .then(() => conceal.decryptFile(encFilePath, decFilePath))
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });
```

## Using is Browser

```html
<script src="https://cdn.jsdelivr.net/npm/almond@0.3.3/almond.min.js"></script>
<script src="./facebook-conceal.bundle.js"></script>

<script>
  const { Conceal } = require('facebook-conceal');
  const conceal = new Conceal('my-password');

  (async () => {
    const plain = 'hello world @ 2020';
    const encrypted = await conceal.encryptStr(plain);
    const decrypted = await conceal.decryptStr(encrypted);
  })();
</script>
```
