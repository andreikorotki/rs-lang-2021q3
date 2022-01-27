import './style.scss';
import { App } from './components/app';

window.onload = async () => {
  const app = new App();
  await app.render();
};
