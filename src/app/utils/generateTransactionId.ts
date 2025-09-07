/* eslint-disable prefer-const */
export const generateTransactionId = (): string => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let chars: string[] = [];
  for (let i = 0; i < 5; i++) {
    chars.push(letters.charAt(Math.floor(Math.random() * letters.length)));
  }

  for (let i = 0; i < 3; i++) {
    chars.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};
