export function randomString(): string {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let string = "";
  for (let i = 0; i < 50; i += 1) {
    string += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return string;
}
