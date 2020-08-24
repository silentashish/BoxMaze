import React from 'react';
import {View, Text} from 'react-native';
// import {Button} from 'native-base';
import {styles} from './styles';
import LottieView from 'lottie-react-native';
import {Button, Divider} from '../components';
import {secondaryColor} from '../utils';

export default (props) => {
  const {navigation} = props;
  return (
    <View style={styles.mainView}>
      <View style={styles.centerElement}>
        <Text style={[styles.bigText, {color: secondaryColor}]}>Box Maze</Text>

        <View style={styles.animationBox}>
          {/* <LottieView
            source={require('../assets/animations/plane.json')}
            autoPlay
            loop
            style={styles.animation}
          /> */}
        </View>

        <Text style={styles.smallText}>
          A fabolous game to start playing with boxes and mazes
        </Text>

        <Divider big />
        <Divider big />

        <Button onPress={() => navigation.navigate('GameScreen')}>
          Start Now
        </Button>
      </View>
    </View>
  );
};
