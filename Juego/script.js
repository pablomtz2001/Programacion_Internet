(function () {
	'use strict';

	// Elements
	const form = document.getElementById('guess-form');
	const input = document.getElementById('guess-input');
	const resultEl = document.getElementById('result');
	const hintEl = document.getElementById('hint');
	const attemptsEl = document.getElementById('attempts');
	const historyEl = document.getElementById('history');
	const restartBtn = document.getElementById('restart-button');

	// State
	let secretNumber = 0;
	let remainingAttempts = 10;
	let guesses = [];
	let gameOver = false;

	function generateSecretNumber() {
		// integer in [1,100]
		return Math.floor(Math.random() * 100) + 1;
	}

	function resetGame() {
		secretNumber = generateSecretNumber();
		remainingAttempts = 10;
		guesses = [];
		gameOver = false;

		// UI reset
		resultEl.textContent = '';
		hintEl.textContent = '';
		attemptsEl.textContent = `Intentos restantes: ${remainingAttempts}`;
		historyEl.textContent = 'Intentos previos: -';

		input.value = '';
		input.disabled = false;
		restartBtn.hidden = true;
	}

	function endGame(message) {
		gameOver = true;
		resultEl.textContent = message;
		input.disabled = true;
		restartBtn.hidden = false;
	}

	function handleGuessSubmit(event) {
		event.preventDefault();
		if (gameOver) return;

		const value = Number(input.value);
		if (!Number.isInteger(value) || value < 1 || value > 100) {
			resultEl.textContent = 'Ingresa un número válido entre 1 y 100.';
			return;
		}

		guesses.push(value);
		remainingAttempts -= 1;

		if (value === secretNumber) {
			endGame(`¡Correcto! El número era ${secretNumber}.`);
			hintEl.textContent = '';
		} else {
			const direction = value < secretNumber ? 'bajo' : 'alto';
			resultEl.textContent = 'No es correcto.';
			hintEl.textContent = `Tu intento fue demasiado ${direction}.`;

			if (remainingAttempts === 0) {
				endGame(`Se acabaron los intentos. El número era ${secretNumber}.`);
			}
		}

		attemptsEl.textContent = `Intentos restantes: ${remainingAttempts}`;
		historyEl.textContent = `Intentos previos: ${guesses.join(', ')}`;

		input.value = '';
		input.focus();
	}

	// Events
	form.addEventListener('submit', handleGuessSubmit);
	restartBtn.addEventListener('click', resetGame);

	// Init
	resetGame();
})(); 