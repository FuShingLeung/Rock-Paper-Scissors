import {
  createIcon,
  onPlayClick,
  checkHasGameFinished,
  onGamemodeClick,
} from './DOM-methods.js';

import { initialiseLocalStorage, setStorage, getStorage } from './storage.js';

// State

// Element

// Elements within gamemodes container
const gamemodesContainer = document.getElementById('gamemodes');
const bo3 = document.querySelector('.bo3');
const bo5 = document.querySelector('.bo5');
const bo7 = document.querySelector('.bo7');
const unlimited = document.querySelector('.unlimited');

// Elements within the game container
const gameContainer = document.getElementById('game-container');
let userScoreDisplay = document.getElementById('user-score');
let compScoreDisplay = document.getElementById('comp-score');
let tieScoreDisplay = document.getElementById('tie-score');

let alert = document.getElementById('alert-message');

const userImage = document.querySelector('.user');
const compImage = document.querySelector('.comp');

const userRock = document.querySelector('.rock');
const userPaper = document.querySelector('.paper');
const userScissors = document.querySelector('.scissors');
const resets = document.querySelectorAll('.reset');

const matchHistoryCarousel = document.querySelector('#carousel-inner');

// Elements within the results container
const gameResult = document.getElementById('result');
const gameCelebration = document.getElementById('celebration');

let resultMessage = document.querySelector('.result-message');
let resultMessageScore = document.querySelector('.result-message-score');

// Actions

const showGamemodeSelector = () => {
  gamemodesContainer.classList.remove('hide');
  gameContainer.classList.add('hide');

  gameResult.classList.remove('grid');
  gameResult.classList.add('hide');
  gameCelebration.classList.add('hide');
};

// Shows only the game container
export const showGame = () => {
  gamemodesContainer.classList.add('hide');
  gameContainer.classList.remove('hide');
  alert.textContent = getStorage('gameAlert');

  gameResult.classList.remove('grid');
  gameResult.classList.add('hide');
  gameCelebration.classList.add('hide');
};

// Shows only the result screen
const showResultScreen = () => {
  gameContainer.classList.add('hide');
  gameResult.classList.add('grid');
};

// Checks if user was in the middle of a game previously
const initialiseGame = () => {
  const gamemode = getStorage('gamemode');

  if (gamemode == null) {
    initialiseLocalStorage();
    showGamemodeSelector();
  } else {
    showGame();
    checkHasGameFinished();
  }
};

export const updateScore = () => {
  userScoreDisplay.replaceChildren(
    `${getStorage('username')}: ${getStorage('userScore')}`,
  );
  compScoreDisplay.replaceChildren(getStorage('compScore'));
  tieScoreDisplay.replaceChildren(getStorage('tieScore'));
};

// Determines who wins when user chooses an option
export const updateGameState = (result) => {
  let userScore = getStorage('userScore');
  let compScore = getStorage('compScore');
  let tieScore = getStorage('tieScore');

  if (result == 'win') {
    setStorage('userScore', ++userScore);
    alert.textContent = 'You won.';
    setStorage('gameAlert', 'You won.');
  } else if (result == 'loss') {
    setStorage('compScore', ++compScore);
    alert.textContent = 'You lost.';
    setStorage('gameAlert', 'You lost.');
  } else {
    setStorage('tieScore', ++tieScore);
    alert.textContent = 'You tied.';
    setStorage('gameAlert', 'You tied.');
  }

  checkHasGameFinished();
};

// Updates the state in the result screen
const updateResultState = (message, username, userScore, compScore) => {
  resultMessage.replaceChildren(message);
  resultMessageScore.replaceChildren(
    `${username}: ${userScore} | Comp: ${compScore}`,
  );
};

// Checks if the game should end
export const updateResultScreen = () => {
  const username = getStorage('username');
  const userScore = getStorage('userScore');
  const compScore = getStorage('compScore');

  showResultScreen();

  if (userScore < compScore) {
    updateResultState('You lost!', username, userScore, compScore);
  } else {
    gameCelebration.classList.remove('hide');
    updateResultState('You won!', username, userScore, compScore);
  }
};

// Updates the player and computer's images depending on what options they picked (rock, paper or scissors)
export const updateOutcomeIcons = (userOption, compOption) => {
  userImage.replaceChildren(createIcon(userOption, false));
  compImage.replaceChildren(createIcon(compOption, true));
};

// Resets everything
const resetGame = () => {
  matchHistoryCarousel.innerHTML = '';
  initialiseLocalStorage();
  updateScore();
  showGamemodeSelector();
};

// Checks if there was a previous game and renders it if there was
initialiseGame();
updateScore();

// Event Bindings

// Checks username and sets up game based on which gamemode chosen
bo3.addEventListener('click', () => {
  onGamemodeClick(3);
});

bo5.addEventListener('click', () => {
  onGamemodeClick(5);
});

bo7.addEventListener('click', () => {
  onGamemodeClick(7);
});

unlimited.addEventListener('click', () => {
  onGamemodeClick('unlimited');
});

// Updates game based on user's choice
userRock.addEventListener('click', () => {
  onPlayClick(1, matchHistoryCarousel);
});

userPaper.addEventListener('click', () => {
  onPlayClick(2, matchHistoryCarousel);
});

userScissors.addEventListener('click', () => {
  onPlayClick(3, matchHistoryCarousel);
});

// Resets game

for (const reset of resets) {
  reset.addEventListener('click', (e) => {
    resetGame();
  });
}
