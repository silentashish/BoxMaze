import React from 'react';
import {View, Text} from 'react-native';
// import {Button} from 'native-base';
import {styles} from './styles';
import LottieView from 'lottie-react-native';
import {Button, Divider} from '../components';
import {secondaryColor} from '../utils';

export default (props) => {
  const {navigation} = props;
  const {level} = props.route.params;
  return (
    <View style={styles.mainView}>
      <View style={styles.centerElement}>
        <Text style={[styles.bigText, {color: secondaryColor}]}>FlyHigh</Text>

        <View style={styles.animationBox}>
          <LottieView
            source={require('../assets/animations/success.json')}
            autoPlay
            loop
            style={styles.animation}
          />
        </View>

        <Text style={styles.smallText}>
          You successfully completed level {level}
        </Text>

        <Divider big />
        <Divider big />

        <Button
          onPress={() =>
            navigation.navigate(level == 1 ? 'GameScreen2' : 'GameScreen3')
          }>
          Play Next Level
        </Button>
      </View>
    </View>
  );
};
