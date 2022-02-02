/* eslint-disable no-console */
import './style.scss';
import { App } from './components/app';
import { Router } from './components/services/router';
import About from './components/views/about';
import Main from './components/views/main';
import { getWords } from './components/api/words';
import LoginView from './components/views/login/login-view';
import RegisterView from './components/views/register/register-view';

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

router.add(/login/, async () => {
  const loginView = new LoginView();
  loginView.render();
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
  main.render();
});
