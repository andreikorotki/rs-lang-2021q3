export function playAudio(url) {
  const audio = new Audio(url);
  audio.play().catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
}
