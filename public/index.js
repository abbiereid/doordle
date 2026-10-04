let guesses = {};

const guessesList = document.getElementById("guess-list");

async function getRank(word) {
    const response = await fetch("/guess", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ word })
    });
    const data = await response.json();
    return data.known ? data.score : null;
}

function pushGuess(guess, score) {
    guesses[guess] = score;
}

async function handleGuess(event) {
    event.preventDefault();

    const inputElement = document.getElementById("password-input");
    const guess = inputElement.value.trim().toLowerCase();

    inputElement.value = "";

    const guessScore = await getRank(guess);

    if (guessScore === null) {
        alert("Invalid guess. Please try again.");
        return;
    }

    pushGuess(guess, guessScore);
    render();

    if (guessScore === 1) {
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