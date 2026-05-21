const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ADMIN\\Desktop\\FreeFire App\\src\\pages\\Wallet.tsx', 'utf8');

let curly = 0;
let paren = 0;
let square = 0;

for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') curly++;
    if (content[i] === '}') curly--;
    if (content[i] === '(') paren++;
    if (content[i] === ')') paren--;
    if (content[i] === '[') square++;
    if (content[i] === ']') square--;
}

console.log(`Curly: ${curly}, Paren: ${paren}, Square: ${square}`);
