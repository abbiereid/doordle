const secret = "pier";
const scores = { sand: 60, bucket: 70, pier: 100 };

let guesses = {};

const guessesList = document.getElementById("guess-list");

function getScore(word) {
    return scores[word] || null;
}

function pushGuess(guess, score) {
    guesses[guess] = score;
}

function handleGuess(event) {
    event.preventDefault();

    const inputElement = document.getElementById("password-input");
    const guess = inputElement.value.trim().toLowerCase();

    inputElement.value = "";

    const guessScore = getScore(guess);

    if (guessScore === null) {
        alert("Invalid guess. Please try again.");
        return;
    }

    pushGuess(guess, guessScore);
    render();

    if (guessScore === 100) {
        alert("Congratulations! You've guessed the secret word!");
    }
}

function render() {
    guessesList.innerHTML = "";
    for (const [guess, score] of Object.entries(guesses)) {
        const listItem = document.createElement("li");
        listItem.textContent = `${guess}: ${score}`;
        guessesList.appendChild(listItem);
    }
}

const guessForm = document.getElementById("guess-form");
guessForm.addEventListener("submit", handleGuess);