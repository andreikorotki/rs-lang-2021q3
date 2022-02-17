import '../assets/scss/base.scss';
import { App } from './components/app';
import { Router } from './components/services';
import About from './components/views/about/about';
import { getWords } from './components/api/words';
import { Main, Book, Games, Stats } from './components/views';
import { LoginView } from './components/views/login';
import RegisterView from './components/views/register/register-view';
import { AudioCallStartView } from './components/views/games/audiocall/audiocall-start';
import { getWordsForGame } from './components/controllers/audiocall-controller';
import AudioCallGameView from './components/views/games/audiocall/audiocall-game-view';
import { NotEnoughWordsError } from './components/common/exceptions/not-enough-words-error';
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
});

router.add(/stats/, async () => {
  const stats = new Stats();
  await stats.run();
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
});
