let guesses = {};

const guessesList = document.getElementById("guess-list");
const hint = document.getElementById("hint");
const instruction = document.getElementById("instructions");

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

async function resetGame() {
    const response = await fetch("/reset", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();
    if (!data.success) {
        throw new Error("Failed to reset the game.");
    }
    hint.textContent = `If you want to get through the door, you must say the secret password. Hint, the 10th closest word is: ${data.hint}`;
    guesses = {};
    setPicture(50);
    render();
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
        instruction.textContent = "Unknown word. Please try again.";
        return;
    }

    pushGuess(guess, guessScore);
    setPicture(guessScore);
    render();

    if (guessScore === 1) {
        instruction.textContent = "Congratulations! You've guessed the secret password!";
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

function setPicture(rank) {
    var doorImage = document.getElementById("door-image");
    if (rank === 1) {
        doorImage.src = "assets/winner_bouncer.jpeg";
    } else if (rank <= 10) {
        doorImage.src = "assets/bouncer_happy.jpeg";
    } else if (rank <= 50) {
        doorImage.src = "assets/bouncer_neutral.jpeg";
    } else if (rank <= 100) {
        doorImage.src = "assets/bouncer_unhappy.jpeg";
    } else {
        doorImage.src = "assets/bouncer_angry.jpeg";
    }
}

const guessForm = document.getElementById("guess-form");
guessForm.addEventListener("submit", handleGuess);

resetGame().catch((error) => {
    console.error("Error resetting the game:", error);
    alert("Failed to reset the game. Please try again later.");
});