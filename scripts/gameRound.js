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
