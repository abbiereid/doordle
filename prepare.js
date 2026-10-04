const fs = require('fs');
const readline = require('readline');

const input_path = "data/raw/glove.6B.300d.txt";
const output_path = "data/vectors.json";
const max_words = 10000;

const vectors = {};
let keptWords = 0;

function parseLine(line) {
    const parts = line.split(' ');
    const word = parts[0];
    const vector = parts.slice(1).map(n => Math.round(Number(n) * 1000) / 1000);
    return { word, vector };
}

function isGoodWord(word) {
    const specialCharRegex = /^[a-z]+$/;
    if(specialCharRegex.test(word) && word.length >= 3) {
        return true;
    }
    return false;
}

const rl = readline.createInterface({
    input: fs.createReadStream(input_path),
});

rl.on('line', (line) => {
    if (keptWords >= max_words) {
        rl.close();
        return;
    }
    const { word, vector } = parseLine(line);
    if (!isGoodWord(word)) {
        return;
    }
    vectors[word] = vector;
    keptWords++;
});

rl.on('close', () => {
    fs.writeFileSync(output_path, JSON.stringify(vectors));
});