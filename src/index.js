/* eslint-disable no-console */
import '../assets/scss/base.scss';
import { App } from './components/app';
import { Router, isAuthorized } from './components/services';
import About from './components/views/about';
import { getWords } from './components/api/words';
import { Main, Book, Games, Stats } from './components/views';
import { LoginView } from './components/views/login';
import RegisterView from './components/views/register/register-view';
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

router.add(/stats/, async () => {
  const games = new Stats();
  games.render();
});

router.add(/register/, async () => {
  const registerView = new RegisterView();
  registerView.render();
});

router.add(/words\?group=(.*)&page=(.*)/, async (group, page) => {
  const words = await getWords(group, page);
  console.log(words.items);
});

router.add('', async () => {
  const main = new Main();
  main.run();
  console.log(isAuthorized());
});
