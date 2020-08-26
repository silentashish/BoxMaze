import {StyleSheet} from 'react-native';
import {primaryColor, whiteColor} from '../utils/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: primaryColor,
  },
  gameOverText: {
    color: 'white',
    fontSize: 48,
  },
  gameScoreText: {
    color: 'white',
    fontSize: 35,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  scoreView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: whiteColor,
  },
  valueText: {
    textAlign: 'center',
    fontSize: 15,
    color: whiteColor,
  },
  menu: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default styles;
