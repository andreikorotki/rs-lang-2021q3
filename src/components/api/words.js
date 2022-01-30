import { serverUrl } from '../services/settings';

export async function getWords(group, page) {
  const response = await fetch(`${serverUrl}/words?group=${group}&page=${page}`);
  return { items: await response.json(), count: response.headers.get('Etag') };
}
