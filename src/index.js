/* eslint-disable */
/* eslint-disable no-alert */
import './style.scss';
import { App } from './components/app';
import Router from './components/services/router';
import About from './components/views/about';
import Main from './components/views/main';
import { getWords } from './components/api/words';

const appPage = new App();
appPage.render();

const router = new Router({
  mode: 'hash',
  root: '/'
});

router
  .add(/about/, () => {
    const about = new About();
    console.log(about);
  })
  .add(/words\?group=(.*)&page=(.*)/, (group, page) => {
    console.log(group, page);

  })
  .add('', () => {
    const container = document.querySelector('.root');
    console.log(container);
    const main = new Main();
    console.log(main);
  });


  const words = await getWords(1, 1);
  console.log(words.items);
