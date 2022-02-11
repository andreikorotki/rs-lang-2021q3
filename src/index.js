/* eslint-disable no-console */
import '../assets/scss/base.scss';
import { App } from './components/app';
import { Router, isAuthorized } from './components/services';
import About from './components/views/about';
import { getWords } from './components/api/words';
import { Main, Book, Games, Stats } from './components/views';
import { LoginView } from './components/views/login';
import RegisterView from './components/views/register/register-view';
import { AudioCallStartView } from './components/views/audiocall/audiocall-start';
import { getWordsForGame } from './components/controllers/audiocall-controller';
import AudioCallGameView from './components/views/audiocall/audiocall-game-view';
import { NotEnoughWordsError } from './components/common/exceptions/not-enough-words-error';
import Audiocall from './components/views/games/audiocall';
import Sprint from './components/views/games/sprint';

const appPage = new App();
appPage.render();

const router = new Router({
  mode: 'hash'
});

router.add(/about/, async () => {
  const about = new About();
  about.render();
});

router.add(/book/, async () => {
  const book = new Book();
  book.run();
});

router.add(/games/, async () => {
  const games = new Games();
  games.run();
});

router.add(/audiocall/, async () => {
  const audiocall = new Audiocall();
  audiocall.run();
});

router.add(/sprint/, async () => {
  const sprint = new Sprint();
  sprint.run();
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

  router.add(/stats/, async () => {
  const games = new Stats();
  games.render();
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
  main.run();
  console.log(isAuthorized());
});
