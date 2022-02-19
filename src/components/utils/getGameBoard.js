export function getGameBoard({ countTime, result }) {
  return `
      <div class="game-board">
        <div class="table timer">${countTime}</div>
        <div class="table result">${result}</div>
        <div class="answers-container_trues">
          <div class="level-led on" id="1"></div>
          <div class="level-led" id="2"></div>
          <div class="level-led" id="3"></div>
        </div>
        <div class="answer-content">
        </div>
        <div class="buttons-container_answers" id="answers">
          <button class="button-answer false" id="0">Не верно</button>
          <button class="button-answer true" id="1">Верно</button>
        </div>
      </div>
    `;
}
