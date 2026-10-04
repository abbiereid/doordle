const express = require("express");
const vectors = require("./data/vectors.json");
const { cosineSimilarity } = require("./similarity.js");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const words = Object.keys(vectors);
var ranked = [];
var ranks = new Map();

function generatePassword() {
    const secretPassword = words[Math.floor(Math.random() * words.length)];

    ranked = words
        .map((word) => ({ word, score: cosineSimilarity(vectors[secretPassword], vectors[word]) }))
        .sort((a, b) => b.score - a.score);

    ranks = new Map();
    ranked.forEach((entry, i) => ranks.set(entry.word, i + 1));

    console.log(`Secret password: ${secretPassword}`);
    console.log(`Top 50 words by similarity to the secret password:`);
    ranked.slice(0, 50).forEach((entry, i) => {
        console.log(`${i + 1}. ${entry.word} (score: ${entry.score.toFixed(4)})`);
    });
}

app.post("/guess", (req, res) => {
    const word = String(req.body.word).toLowerCase();
    if(!ranks.has(word)) {
        return res.json({known: false});
    }
    return res.json({known: true, score: ranks.get(word)});
});

app.post("/reset", (req, res) => {
    generatePassword();
    return res.json({hint: ranked[9].word, success: true});
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});