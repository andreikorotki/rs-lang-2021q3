export function playAudio(url) {
  const audio = new Audio(url);
  audio.play().catch((error) => {
    console.log(error);
  });
}
