module.exports = {
  env: process.env,
  argv: process.argv,
  preopens: {
    "./tests/sandbox": "./tests/sandbox"
  }
};
