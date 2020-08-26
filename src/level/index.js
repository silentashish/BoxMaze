import React, {Component} from 'react';
import {View, TouchableOpacity, Alert, Text} from 'react-native';
import Matter from 'matter-js';
import {GameEngine} from 'react-native-game-engine';
import {Plane, Wall} from '../components';
import {
  MAX_HEIGHT,
  MAX_WIDTH,
  GAP_SIZE,
  PIPE_WIDTH,
  secondaryColor,
} from '../utils';
import {generatePipes} from '../Obstacle';
import styles from './style';
import Physics from '../Physics';

let boxIds = 0;

var ball_options = {
  // density: 0.04,
  restitution: 1, // 0 = no bouncing, 1 = 100% of kinetic energy bounce back
  friction: 0,
  frictionAir: 0,
  //frictionStatic: Infinity,
  inertia: Infinity,
};

const CreateBox = (entities, {touches, screen}) => {
  let world = entities['physics'].world;
  let boxSize = Math.trunc(Math.max(screen.width, screen.height) * 0.075);
  touches
    .filter((t) => t.type === 'press')
    .forEach((t) => {
      let body = Matter.Bodies.rectangle(
        t.event.pageX,
        t.event.pageY,
        boxSize,
        boxSize,
        ball_options,
      );
      Matter.World.add(world, [body]);
      let num = Math.random() > 0.4 ? -1 : 1;
      var vx = num * 4 * (Math.random() - 0.5);
      var vy = num * 4 * (Math.random() - 0.5);

      Matter.Body.applyForce(body, body.position, {x: vx, y: vy});

      entities[++boxIds] = {
        body: body,
        size: [boxSize, boxSize],
        color: boxIds % 2 == 0 ? 'pink' : 'white',
        renderer: Plane,
      };
    });
  return entities;
};

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
      score: 0,
      level: 1,
      time: 15,
    };

    this.gameEngine = null;

    this.entities = this.setupWorld();

    Matter.Resolver._restingThresh = 0.001;
  }

  componentDidMount() {
    this.timer = setInterval(
      () =>
        this.setState(
          (prevState) => ({time: prevState.time > 0 ? prevState.time - 1 : 0}),
          () => {
            if (this.state.time === 0) {
              this.gameEngine.dispatch({type: 'game-over'});
            }
          },
        ),
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;

    let plane = Matter.Bodies.rectangle(
      MAX_WIDTH / 4,
      MAX_HEIGHT - 100,
      100,
      100,
    );

    let floor = Matter.Bodies.rectangle(
      MAX_WIDTH / 2,
      MAX_HEIGHT - 25,
      MAX_WIDTH,
      50,
      {isStatic: true},
    );

    let ceiling = Matter.Bodies.rectangle(MAX_WIDTH / 2, 25, MAX_WIDTH, 50, {
      isStatic: true,
    });

    // pipe is a obstacle

    let [pipe1Height, pipe2Height] = generatePipes();

    let pipe1 = Matter.Bodies.rectangle(
      MAX_WIDTH - PIPE_WIDTH / 2,
      pipe1Height / 2,
      PIPE_WIDTH,
      pipe1Height,
      {isStatic: true},
    );
    let pipe2 = Matter.Bodies.rectangle(
      MAX_WIDTH - PIPE_WIDTH / 2,
      MAX_HEIGHT - pipe2Height / 2,
      PIPE_WIDTH,
      pipe2Height,
      {isStatic: true},
    );

    let gap1 = Matter.Bodies.rectangle(
      MAX_WIDTH - PIPE_WIDTH / 2,
      MAX_HEIGHT - (pipe2Height / 2 + GAP_SIZE),
      PIPE_WIDTH,
      GAP_SIZE,
      {isStatic: true, isSensor: true},
    );

    let [pipe3Height, pipe4Height] = generatePipes();

    let pipe3 = Matter.Bodies.rectangle(
      MAX_WIDTH * 2 - PIPE_WIDTH / 2,
      pipe3Height / 2,
      PIPE_WIDTH,
      pipe3Height,
      {isStatic: true},
    );

    let gap2 = Matter.Bodies.rectangle(
      MAX_WIDTH - PIPE_WIDTH / 2,
      MAX_HEIGHT - (pipe4Height / 2 + GAP_SIZE),
      PIPE_WIDTH,
      GAP_SIZE,
      {isStatic: true, isSensor: true},
    );

    let pipe4 = Matter.Bodies.rectangle(
      MAX_WIDTH * 2 - PIPE_WIDTH / 2,
      MAX_HEIGHT - pipe4Height / 2,
      PIPE_WIDTH,
      pipe4Height,
      {isStatic: true},
    );

    Matter.World.add(world, [
      plane,
      floor,
      ceiling,
      pipe1,
      pipe2,
      pipe3,
      pipe4,
      gap1,
      gap2,
    ]);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      let a = event.pairs[0].bodyA;
      let b = event.pairs[0].bodyB;
      this.setState({score: this.state.score + 1});
      // Matter.World.remove(world, a);
      // Matter.World.remove(world, b);
      // if (b === g1 || b === g2) {
      //   this.setState({score: this.state.score + 1});
      // } else {
      //   // this.gameEngine.dispatch({type: 'game-over'});
      // }
    });

    return {
      physics: {engine: engine, world: world},
      plane: {body: plane, size: [100, 65], color: 'red', renderer: Plane},
      floor: {
        body: floor,
        size: [MAX_WIDTH, 150],
        color: secondaryColor,
        renderer: Wall,
      },
      ceiling: {
        body: ceiling,
        size: [MAX_WIDTH, 50],
        color: secondaryColor,
        renderer: Wall,
      },
      pipe1: {
        body: pipe1,
        size: [PIPE_WIDTH, pipe1Height],
        color: secondaryColor,
        renderer: Wall,
      },
      gap1: {
        body: gap1,
        size: [PIPE_WIDTH, 270],
        color: 'transparent',
        renderer: Wall,
      },
      pipe2: {
        body: pipe2,
        size: [PIPE_WIDTH, pipe2Height],
        color: secondaryColor,
        renderer: Wall,
      },
      gap2: {
        body: gap2,
        size: [PIPE_WIDTH, 270],
        color: 'transparent',
        renderer: Wall,
      },
      pipe3: {
        body: pipe3,
        size: [PIPE_WIDTH, pipe3Height],
        color: secondaryColor,
        renderer: Wall,
      },
      pipe4: {
        body: pipe4,
        size: [PIPE_WIDTH, pipe4Height],
        color: secondaryColor,
        renderer: Wall,
      },
    };
  };

  onEvent = (e) => {
    if (e.type === 'game-over') {
      // Alert.alert('Game Over');
      this.setState({
        running: false,
      });
    }
  };

  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState((prevState) => ({
      running: true,
      score: 0,
      time: 16,
      level: prevState.score > 130 ? prevState.level + 1 : prevState.level,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => {
            this.gameEngine = ref;
          }}
          systems={[Physics, CreateBox]}
          style={styles.gameContainer}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}>
          <View style={styles.menu}>
            <View style={styles.scoreView}>
              <Text style={styles.scoreText}>Score</Text>
              <Text style={styles.valueText}>{this.state.score}</Text>
            </View>
            <View style={styles.scoreView}>
              <Text style={styles.scoreText}>Level</Text>
              <Text style={styles.valueText}>{this.state.level}</Text>
            </View>
            <View style={styles.scoreView}>
              <Text style={styles.scoreText}>Time</Text>
              <Text style={styles.valueText}>{this.state.time}</Text>
            </View>
          </View>
        </GameEngine>

        {!this.state.running && (
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={this.reset}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>
                {this.state.score > 120 ? 'You Win!!' : 'You Loose!!'}
              </Text>
              <View style={{height: 20}} />
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.gameScoreText}>
                Score : {this.state.score}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
