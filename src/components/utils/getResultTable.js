import { getItemResultTable } from '.';

export function getResultTable(answers) {
  let html = '';
  answers.forEach((answerIndex) => {
    html += getItemResultTable(answerIndex);
  });
  return html;
}
