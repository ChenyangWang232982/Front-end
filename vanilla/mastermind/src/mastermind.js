// TODO: Implement the main Mastermind game application
//
// Requirements:
// 1. Set up state management using createState from util.js (suggested utility)
// 2. Create render function that updates the DOM based on current state
// 3. Implement components to render the game UI (form, selects, buttons, history)
// 4. Set up event delegation for button clicks and select changes
// 5. Initialize a new game when DOM is loaded
import {
  generateRandomNumbers,
  createState,
  isInCorrectPlace,
  isCorrect,
  getFeedback,
  celebrate,
  initializeAutoScroll
} from '../util.js';
const CODE_LENGTH = Number(import.meta.env.VITE_LENGTH || 4);  //import.meta.env.VITE_CODE_LENGTH: set env variable
const MAX_ATTEMPTS = 10;
export const main = () => {
    // TODO: Implement the Mastermind game
    const _Instructions = (row_nmb) => {
        return `<p>Guess the row numbers (0-9)</p>
        <p><span class="bold">⚫</span> = in place; <span class="bold">⚪️</span> = correct</p>
        <p>
            <span class="bold">All correct '${'⚫'.repeat(row_nmb)}'</span>
        </p>`;
    };

    const [getGameState, setGameState] = createState(
        {
        secretCode: generateRandomNumbers(CODE_LENGTH),
        guesses: [],
        remainingAttempts: MAX_ATTEMPTS,
        isWon: false,
        isGameOver: false
    }, render);

    function render() {
    const state = getGameState();
    const root = document.getElementById('root');
    if (!root) return;
    root.innerHTML = `
      <div class="mastermind">
        <div class="instructions">${_Instructions(CODE_LENGTH)}</div>
        <div class="status">
          <p>Remaining attempts: <strong>${state.remainingAttempts}</strong></p>
          ${state.isWon ? `<p class="win">🎉 Correct! You Won! 🎉</p>` : ''}
          ${state.isGameOver && !state.isWon ? `<p class="lose">Game Over! Code: ${state.secretCode.join('')}</p>` : ''}
        </div>

        <div class="guess-form">
          ${Array.from({ length: CODE_LENGTH }, (_, i) => `
            <select class="digit" data-id="${i}" ${state.isWon || state.isGameOver ? 'disabled' : ''}>
              ${Array.from({ length:10 }, (_,n) => `<option value="${n}">${n}</option>`)}
            </select>
          `).join('')}
          <button id="submit">Submit Guess</button>
          <button id="reset">Reset Game</button>
        </div>

        <div class="history">
          <h3>Guess History</h3>
          <div id="guessesDisplay">
            ${state.guesses.length === 0 ? '<p>No guesses yet</p>' : state.guesses.map((g, i) => `
              <div class="guess-item">
                <span>${i+1}. ${g.digits.join(' ')}</span>
                <span class="feedback">${g.feedback}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    initializeAutoScroll();

    bindEvents();
  }

  const getPlayerDigits = () => {
    return Array.from(document.querySelectorAll('.digit')).map(el => Number(el.value));
  };

  const handleSubmit = () => {
    const state = getGameState();
    if (state.isWon || state.isGameOver || state.remainingAttempts <= 0) return;

    const digits = getPlayerDigits();
    const correctPlace = isInCorrectPlace(digits, state.secretCode);
    const correctTotal = isCorrect(digits, state.secretCode);
    const feedback = getFeedback(correctPlace, correctTotal);

    const isWin = correctPlace === CODE_LENGTH;
    const newRemaining = state.remainingAttempts - 1;
    const isOver = newRemaining <= 0 && !isWin;
    setGameState(prev => ({
      ...prev,
      guesses: [...prev.guesses, { digits, feedback }],
      remainingAttempts: newRemaining,
      isWon: isWin,
      isGameOver: isOver
    }));

    if (isWin) celebrate();
  };

  const handleReset = () => {
    setGameState({
      secretCode: generateRandomNumbers(CODE_LENGTH),
      guesses: [],
      remainingAttempts: MAX_ATTEMPTS,
      isWon: false,
      isGameOver: false
    });
  };
  const bindEvents = () => {
  const root = document.getElementById('root');
  root.addEventListener('click', (e) => {
    const target = e.target;
    if (target.id === 'submit') handleSubmit();
    if (target.id === 'reset') handleReset();
  });
};
  render();

};
