export function drawMessageInSelector(querySelector, message) {
  const charts = document.querySelector(`${querySelector}`);
  charts.innerHTML = '';
  charts.innerHTML = `<p>${message}</p>`;
}
