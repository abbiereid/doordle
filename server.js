const express = require("express");
const vectors = require("./data/vectors.json");
const { cosineSimilarity } = require("./similarity.js");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const words = Object.keys(vectors);
const secretPassword = words[Math.floor(Math.random() * words.length)];
console.log(`Secret password: ${secretPassword}`);

const ranked = words
    .map((word) => ({ word, score: cosineSimilarity(vectors[secretPassword], vectors[word]) }))
    .sort((a, b) => b.score - a.score);

const ranks = new Map();
ranked.forEach((entry, i) => ranks.set(entry.word, i + 1));

app.post("/guess", (req, res) => {
    const word = String(req.body.word).toLowerCase();
    if(!ranks.has(word)) {
        return res.json({known: false});
    }
    return res.json({known: true, score: ranks.get(word)});
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});