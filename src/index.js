/* eslint-disable no-console */
import '../assets/scss/base.scss';
import { App } from './components/app';
import { Router } from './components/services/router';
import About from './components/views/about';
import Main from './components/views/main';
import { getWords } from './components/api/words';
import Book from './components/views/book';
import LoginView from './components/views/login/login-view';
import RegisterView from './components/views/register/register-view';
import { AudioCallStartView } from './components/views/audiocall/audiocall-start';
import { getWordsForGame } from './components/controllers/audiocall-controller';
import AudioCallGameView from './components/views/audiocall/audiocall-game-view';
import { NotEnoughWordsError } from './components/common/exceptions/not-enough-words-error';

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

router.add(/login/, async () => {
  const loginView = new LoginView();
  loginView.render();
});

router.add(/audiocall-start/, async () => {
  const audioCallStartView = new AudioCallStartView();
  audioCallStartView.render();
});

router.add(/audiocall/, async () => {
  let words;
  try {
    words = await getWordsForGame();
  } catch (error) {
    if (error instanceof NotEnoughWordsError) {
      words = [];
    } else {
      throw error;
    }
  }
  const game = new AudioCallGameView(words);
  game.renderRound();
});

router.add(/register/, async () => {
  const registerView = new RegisterView();
  registerView.render();
});

router.add(/words\?group=(.*)&page=(.*)/, async (group, page) => {
  await getWords(group, page);
});

router.add('', async () => {
  const main = new Main();
  main.render();
});
