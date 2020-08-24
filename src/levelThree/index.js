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

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      running: true,
      score: 50,
      level: 3,
    };

    this.gameEngine = null;

    this.entities = this.setupWorld();
  }

  setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;

    let plane = Matter.Bodies.rectangle(
      MAX_WIDTH / 4,
      MAX_HEIGHT / 2,
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
      // let a = event.pairs[0].bodyA.id;
      let b = event.pairs[0].bodyB.id;
      let g1 = event.source.world.bodies[7].id;
      let g2 = event.source.world.bodies[8].id;

      if (b === g1 || b === g2) {
        this.setState({score: this.state.score + 1});
      } else {
        this.gameEngine.dispatch({type: 'game-over'});
      }
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
    this.setState({
      running: true,
      score: 50,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <GameEngine
          ref={(ref) => {
            this.gameEngine = ref;
          }}
          systems={[Physics]}
          style={styles.gameContainer}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities}>
          <View style={styles.scoreView}>
            <Text style={styles.scoreText}>Score</Text>
            <Text style={styles.valueText}>{this.state.score}</Text>
          </View>
        </GameEngine>

        {!this.state.running && (
          <TouchableOpacity
            style={styles.fullScreenButton}
            onPress={this.reset}>
            <View style={styles.fullScreen}>
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
