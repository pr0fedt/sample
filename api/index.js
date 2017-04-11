let m;

try {
  m = require('./build');
} catch (err) {
  console.error(err.stack);
  process.exit(1);
}

module.exports = m;
