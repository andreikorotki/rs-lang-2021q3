/* eslint-disable no-console */
// import './style.scss';
import '../assets/scss/base.scss';
import { App } from './components/app';
import Router from './components/services/router';
import About from './components/views/about';
import Main from './components/views/main';
import { getWords } from './components/api/words';
import Book from './components/views/book';

const appPage = new App();
appPage.render();

const router = new Router({
  mode: 'hash',
  root: '/'
});

router.add(/about/, async () => {
  const about = new About();
  about.render();
});

router.add(/book/, async () => {
  const book = new Book();
  book.render();
});

router.add(/words\?group=(.*)&page=(.*)/, async (group, page) => {
  const words = await getWords(group, page);
  console.log(words.items);
});

router.add('', async () => {
  const main = new Main();
  main.render();
});
