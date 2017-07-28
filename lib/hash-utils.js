const crypto = require('crypto');
const fs = require('fs');

function md5(filepath) {
  return new Promise((resolve, reject) => {
    try {
      const rs = fs.createReadStream(filepath);
      const hash = crypto.createHash('md5');
      rs.on('data', hash.update.bind(hash));
      rs.on('end', () => {
        resolve(hash.digest('hex'));
      });
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  md5,
};
