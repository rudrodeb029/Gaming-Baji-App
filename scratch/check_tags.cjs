const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\ADMIN\\Desktop\\FreeFire App\\src\\pages\\Wallet.tsx', 'utf8');

function count(str, re) {
  return (str.match(re) || []).length;
}

const tags = ['div', 'span', 'button', 'h1', 'h2', 'h3', 'p', 'section', 'article', 'aside', 'header', 'footer'];

tags.forEach(tag => {
    const open = count(content, new RegExp(`<${tag}`, 'g'));
    const self = count(content, new RegExp(`<${tag}[^>]*\\/>`, 'g'));
    const close = count(content, new RegExp(`</${tag}>`, 'g'));
    const balance = open - self - close;
    if (balance !== 0) {
        console.log(`Tag <${tag}> is unbalanced: ${open} open, ${self} self, ${close} close (diff: ${balance})`);
    }
});
