import {
  generateRandomNumbers,
  createState,
  isInCorrectPlace,
  isCorrect,
  getFeedback,
  celebrate,
  initializeAutoScroll
} from './util.js';
const CODE_LENGTH = Number(import.meta.env.VITE_LENGTH || 4);  //import.meta.env.VITE_CODE_LENGTH: set env variable
const MAX_ATTEMPTS = 10;
export const main = () => {
    const _Instructions = (row_nmb) => {
        return `<span class="bold">All correct '${'⚫'.repeat(row_nmb)}'</span></p>`;
    };

    const [getGameState, setGameState] = createState(   //define state
        {
        secretCode: generateRandomNumbers(CODE_LENGTH),
        guesses: [],
        remainingAttempts: MAX_ATTEMPTS,
        isWon: false,
        isGameOver: false
    }, render);

    function render() { //based on condition to change the content
    const state = getGameState();
    const root = document.getElementById('root');
    if (!root) return;
    root.innerHTML = `
      <div class="mastermind">
        <p>Guess the row numbers (0-9)</p>
        <p>⚫ = in place; ⚪️ = correct</p>
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
          <button class="submit" id="submit">Submit Guess</button>
          <button class="submit" id="reset">Reset Game</button>
        </div>

        <div class="space">
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
  }

  const getPlayerDigits = () => {  //get digits input by player
    return Array.from(document.querySelectorAll('.digit')).map(el => Number(el.value));
  };

  //validate digits
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
  //reset the game
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
  bindEvents();
  render();
};
