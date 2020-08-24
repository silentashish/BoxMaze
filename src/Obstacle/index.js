import {MAX_HEIGHT, MAX_WIDTH, GAP_SIZE, PIPE_WIDTH} from '../utils';

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generatePipes = () => {
  let topPipeHeight = randomBetween(100, MAX_HEIGHT / 2 - 100);
  let bottomPipeHeight = MAX_HEIGHT - topPipeHeight - GAP_SIZE;

  let sizes = [topPipeHeight, bottomPipeHeight];

  if (Math.random() < 0.5) {
    sizes = sizes.reverse();
  }

  return sizes;
};
