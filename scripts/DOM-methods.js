import {
  updateOutcomeIcons,
  updateGameState,
  updateScore,
  updateResultScreen,
  showGame,
} from './index.js';

import { setStorage, getStorage } from './storage.js';

const myCarouselElement = document.querySelector('#matchCarousel');

const usernameForm = document.forms['username'];

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

//
export const onGamemodeClick = (gamemode) => {
  if (!setUsername(usernameForm)) {
    window.alert('Please enter a username!');
  } else {
    setStorage('gamemode', gamemode);
    updateScore();
    showGame();
  }
};

// Function
export const onPlayClick = (userOutcome, matchHistoryCarousel) => {
  let roundNumber = getStorage('roundNumber');
  setStorage('roundNumber', ++roundNumber);

  const compOutcome = performCompRoll();
  updateOutcomeIcons(userOutcome, compOutcome);

  updateGameState(determineResult(userOutcome, compOutcome));
  updateScore();

  matchHistoryCarousel.append(
    createMatchHistoryDiv(
      createIcon(userOutcome, false),
      createIcon(compOutcome, true),
      matchHistoryCarousel.innerHTML === '',
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

// Creates a div to store a match history
export const createMatchHistoryDiv = (userImage, compImage, isFirst) => {
  const username = getStorage('username');
  const userScore = getStorage('userScore');
  const compScore = getStorage('compScore');
  const tieScore = getStorage('tieScore');

  // Make div for each match in match history
  const div = document.createElement('div');

  if (isFirst) {
    div.className = 'carousel-item round-score active';
  } else {
    div.className = 'carousel-item round-score';
  }

  // Make p for round score
  const roundNumber =
    parseInt(userScore) + parseInt(compScore) + parseInt(tieScore);
  const roundNumberP = document.createElement('p');
  roundNumberP.textContent = `Round ${roundNumber}`;
  div.append(roundNumberP);

  // Make p for user score, comp score and tie score
  const individualScoreP = document.createElement('p');
  individualScoreP.className = 'individual-score';
  individualScoreP.textContent = `${username}: ${userScore}  Comp: ${compScore}  Ties: ${tieScore}`;
  div.append(individualScoreP);

  // Make div and add user icon and comp icon
  const iconDiv = document.createElement('div');
  iconDiv.className = 'iconDiv';

  const iconsArray = [userImage, compImage];
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
