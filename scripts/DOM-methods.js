import {
  updateOutcomeIcons,
  updateGameState,
  updateScoreText,
  updateResultScreen,
  showGame,
} from './index.js';

import { setStorage, getStorage } from './storage.js';

import { GameRound, loadMatchHistory, saveGameRound } from './gameState.js';

const usernameForm = document.forms['username'];

const myCarouselElement = document.querySelector('#matchCarousel');

const carousel = new bootstrap.Carousel(myCarouselElement, {
  interval: 2000,
  touch: false,
});

// // Match object

// Sets up the gamemode user has selected
export const checkHasGameFinished = () => {
  const gamemode = getStorage('gamemode');
  const userScore = getStorage('userScore');
  const compScore = getStorage('compScore');

  if (gamemode == 3) {
    if (userScore > 1 || compScore > 1) {
      updateResultScreen();
    }
  } else if (gamemode == 5) {
    if (userScore > 2 || compScore > 2) {
      updateResultScreen();
    }
  } else if (gamemode == 7) {
    if (userScore > 3 || compScore > 3) {
      updateResultScreen();
    }
  }
};

// Disables form
usernameForm.addEventListener('submit', (e) => {
  e.preventDefault();
});

// Checks for a valid username and sets the username to local storage if necessary
const setUsername = (form) => {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const userInput = data.username.trim();
  if (userInput == '') {
    return false;
  } else {
    setStorage('username', data.username);
    form.reset();
    return true;
  }
};

export const onGamemodeClick = (gamemode) => {
  if (!setUsername(usernameForm)) {
    window.alert('Please enter a username!');
  } else {
    setStorage('gamemode', gamemode);
    updateScoreText();
    showGame();
  }
};

// Function
export const onPlayClick = (userOutcome, matchHistoryCarousel) => {
  let roundNumber = getStorage('roundNumber');
  setStorage('roundNumber', ++roundNumber);

  const compOutcome = performCompRoll();
  const result = determineResult(userOutcome, compOutcome);

  updateGameState(result);
  updateScoreText();

  const gameRound = new GameRound(
    roundNumber,
    getStorage('username'),
    getStorage('userScore'),
    getStorage('compScore'),
    getStorage('tieScore'),
    userOutcome,
    compOutcome,
  );
  saveGameRound(gameRound);

  updateOutcomeIcons(gameRound.userOutcome, gameRound.compOutcome);
  matchHistoryCarousel.append(
    generateGameRoundMatchHistoryDiv(
      gameRound,
      matchHistoryCarousel.innerHTML == '',
      false,
      result,
    ),
  );
  carousel.to(roundNumber - 1);
};

// Creates an icon that can be either rock paper or scissors
export const createIcon = (option, isSolid) => {
  const icon = document.createElement('i');
  icon.className = 'fa-5x';

  if (!isSolid) {
    icon.classList.add('fa-regular');
  } else {
    icon.classList.add('fa-solid');
  }

  if (option === 1) {
    icon.classList.add('fa-hand-back-fist');
  } else if (option === 2) {
    icon.classList.add('fa-hand');
  } else {
    icon.classList.add('fa-hand-scissors');
  }
  return icon;
};

export const loadPreviousMatchOutcome = () => {
  if (getStorage('matchHistory')) {
    const gameRound = loadMatchHistory();
    updateOutcomeIcons(
      gameRound[gameRound.length - 1].userOutcome,
      gameRound[gameRound.length - 1].compOutcome,
    );
  }
};

export const loadSavedMatchHistory = (matchHistoryCarousel) => {
  if (getStorage('matchHistory')) {
    const matchHistory = loadMatchHistory();
    for (let gameRound of matchHistory) {
      if (gameRound == matchHistory[matchHistory.length - 1]) {
        matchHistoryCarousel.append(
          generateGameRoundMatchHistoryDiv(gameRound, false, true),
        );
        carousel.to(matchHistory.length - 1);
      } else {
        matchHistoryCarousel.append(
          generateGameRoundMatchHistoryDiv(gameRound, false, false),
        );
      }
    }
  }
};

export const generateGameRoundMatchHistoryDiv = (
  gameRound,
  isFirst,
  isLast,
  gameOutcome,
) => {
  // Make div for each match in match history
  const div = document.createElement('div');

  // Check if it is the first or last game round to add the active class
  if (isFirst) {
    div.className = 'carousel-item round-score active';
  } else if (isLast) {
    div.className = 'carousel-item round-score active';
  } else {
    div.className = 'carousel-item round-score';
  }

  // Make p for round score
  const roundNumberP = document.createElement('p');
  roundNumberP.className = 'round-number';
  if (gameOutcome == 'win') {
    roundNumberP.classList.add('text-success');
  } else if (gameOutcome == 'loss') {
    roundNumberP.classList.add('text-danger');
  } else {
    roundNumberP.classList.add('text-warning');
  }
  roundNumberP.textContent = `Round ${gameRound.roundNumber}`;
  div.append(roundNumberP);

  // Make p for user score, comp score and tie score
  const individualScoreP = document.createElement('p');
  individualScoreP.className = 'individual-score';
  individualScoreP.textContent = `${gameRound.username}: ${gameRound.userScore}  Comp: ${gameRound.compScore}  Ties: ${gameRound.tieScore}`;
  div.append(individualScoreP);

  // Make div and add user icon and comp icon
  const iconDiv = document.createElement('div');
  iconDiv.className = 'iconDiv';

  const iconsArray = [
    createIcon(gameRound.userOutcome, false),
    createIcon(gameRound.compOutcome, true),
  ];
  for (const iconImage of iconsArray) {
    iconImage.classList.add = 'icon';
    iconDiv.append(iconImage);
  }

  div.append(iconDiv);

  return div;
};

// Calculation to randomise computer's choice
export const performCompRoll = () => {
  let compOption = Math.floor(Math.random() * 3 + 1);
  return compOption;
};

// Calculation to determine who wins
export const determineResult = (userOption, compOption) => {
  let result = '';
  if (userOption === 1 || userOption === 2) {
    if (userOption === compOption) {
      result = 'tie';
    } else if (userOption === compOption - 1) {
      result = 'loss';
    } else {
      result = 'win';
    }
  } else {
    if (userOption === compOption) {
      result = 'tie';
    } else if (userOption === compOption + 2) {
      result = 'loss';
    } else {
      result = 'win';
    }
  }
  return result;
};
