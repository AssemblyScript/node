const { randomFillSync } = require("crypto");

for (let i = 0; i < 10; i++) {
  let buffer = randomFillSync(Buffer.allocUnsafe(Math.floor(Math.random() * 100)));
  let result = buffer.toString("base64");
  console.log(Array.from(buffer), result);
}