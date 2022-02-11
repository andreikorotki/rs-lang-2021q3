import { Button } from '../common';
import { getWordsForGame } from '../controllers/audiocall-controller';
import AudioCallGameView from '../views/audiocall/audiocall-game-view';

export function getLevelGameButtons(buttonsGroupContainer) {
  const buttonsGroup = 6;
  [...Array(buttonsGroup).keys()].forEach((group) => {
    const button = new Button(
      ['button-group', `button-group_color-${group + 1}`],
      `${group + 1}`,
      'button',
      `${group + 1}`,
      async () => {
        const words = await getWordsForGame(+group);
        const game = new AudioCallGameView(words);
        game.renderRound();
      }
    );
    buttonsGroupContainer.append(button.element);
  });
}
