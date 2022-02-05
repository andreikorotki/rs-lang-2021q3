import { serverUrl } from '../services/settings';

export async function getWords(group, page = 0) {
  const response = await fetch(`${serverUrl}/words?group=${group}&page=${page}`);
  return { items: await response.json() };
}

export async function getWord(id) {
  const response = await fetch(`${serverUrl}/words/${id}`);
  return { items: await response.json() };
}
