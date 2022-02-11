import { getAudioUrl } from '.';

export function playWord({ target: { id } }) {
  const url = getAudioUrl(id);
  const audioPlay = new Audio(url);
  audioPlay.play();
}
