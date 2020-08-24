import Matter from 'matter-js';
import {MAX_HEIGHT, MAX_WIDTH, PIPE_WIDTH} from '../utils';
import clone from 'clone';

const Physics = (entities, {touches, time}) => {
  let engine = entities.physics.engine;
  let plane = entities.plane.body;

  touches
    .filter((t) => t.type === 'press')
    .forEach((t) => {
      Matter.Body.applyForce(plane, plane.position, {x: 0.0, y: -0.25});
    });

  for (let i = 1; i <= 4; i++) {
    if (entities['pipe' + i].body.position.x <= -1 * (PIPE_WIDTH / 2)) {
      Matter.Body.setPosition(entities['pipe' + i].body, {
        x: MAX_WIDTH * 2 - PIPE_WIDTH / 2,
        y: entities['pipe' + i].body.position.y,
      });
      if (i == 1) {
        Matter.Body.setPosition(entities['gap' + i].body, {
          x: MAX_WIDTH * 2 - PIPE_WIDTH / 2,
          y: entities['gap' + i].body.position.y,
        });
      }
      if (i == 3) {
        Matter.Body.setPosition(entities['gap2'].body, {
          x: MAX_WIDTH * 2 - PIPE_WIDTH / 2,
          y: entities['gap2'].body.position.y,
        });
      }
    } else {
      Matter.Body.translate(entities['pipe' + i].body, {x: -4, y: 0});
      if (i == 1) {
        Matter.Body.translate(entities['gap' + i].body, {x: -4, y: 0});
      }
      if (i == 1) {
        Matter.Body.translate(entities['gap2'].body, {x: -4, y: 0});
      }
    }
  }

  Matter.Engine.update(engine, 10);

  return entities;
};

export default Physics;
