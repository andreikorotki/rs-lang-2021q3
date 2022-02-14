import GameStatistic from './game-statistic';

export default class StatisticOptional {
  constructor() {
    const audiocall = new GameStatistic('audiocall');
    const sprint = new GameStatistic('sprint');
    this.audiocall = audiocall.getDateStatObject();
    this.sprint = sprint.getDateStatObject();
  }
}
