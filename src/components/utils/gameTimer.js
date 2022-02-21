import { store } from '../store';

export function gameTimer(countTime, endGameFunction) {
  const timer = document.querySelector('.timer');
  setTimeout(() => {
    if (timer) {
      const newCountTime = countTime - 1;
      timer.textContent = newCountTime;
      if (newCountTime === 0) {
        const { isEndGame } = store.getState().toolkit;
        if (!isEndGame) {
          endGameFunction();
        }
      } else {
        gameTimer(newCountTime, endGameFunction);
      }
    }
  }, 1000);
}
