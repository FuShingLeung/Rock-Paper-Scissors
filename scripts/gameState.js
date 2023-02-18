import { setStorage, getStorage, removeStorage } from './storage.js';

export class GameRound {
  constructor(
    roundNumber,
    userScore,
    compScore,
    tieScore,
    userOutcome,
    compOutcome,
  ) {
    this.roundNumber = roundNumber;
    this.userScore = userScore;
    this.compScore = compScore;
    this.tieScore = tieScore;
    this.userOutcome = userOutcome;
    this.compOutcome = compOutcome;
  }
}

export const saveGameRound = (gameRound) => {
  const currentMatchHistoryString = getStorage('matchHistory');
  if (currentMatchHistoryString == '') {
    const newMatchHistory = [gameRound];
    setStorage('matchHistory', JSON.stringify(newMatchHistory));
  } else {
    const currentMatchHistory = JSON.parse(currentMatchHistoryString);
    currentMatchHistory.push(gameRound);
    setStorage('matchHistory', JSON.stringify(currentMatchHistory));
  }
};
