import { store } from '../store';

export function getItemResultTable(answerIndex) {
  const { id, word, wordTranslate, transcription } = store.getState().toolkit.words[answerIndex];
  return `
      <li class="result-item">
        <button class="button audio-button" id="${id}" title="Прослушать..."></button>
        <span class="word-english_result">${word}</span>
        <span class="word-transcription">${transcription}</span>
        <span class="word-russian_result">${wordTranslate}</span>
      </li>
    `;
}
