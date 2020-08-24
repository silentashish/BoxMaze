import React, {Component} from 'react';
import {View, Image} from 'react-native';

const airplane = require('../assets/images/airplane.png');

const Plane = (props) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: '#F5f5f5',
        borderRadius: height / 2,
      }}
      // resizeMode="cover"
      // source={airplane}
    />
  );
};

export default Plane;
