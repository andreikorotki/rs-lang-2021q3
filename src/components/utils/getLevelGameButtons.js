import { Button } from '../common';

export function getLevelGameButtons(getGameData, buttonsGroupContainer) {
  const buttonsGroup = 6;
  [...Array(buttonsGroup).keys()].forEach((group) => {
    const button = new Button(
      ['button-group', `button-group_color-${group + 1}`],
      `${group + 1}`,
      'button',
      `${group + 1}`,
      getGameData
    );
    buttonsGroupContainer.append(button.element);
  });
}
