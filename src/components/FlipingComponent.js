import React, { Component } from 'react';
import FlipComponent from 'react-native-flip-component';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default class FlipingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlipped: false
    };
  }
  render() {
    return(
      <View style = {{justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        backgroundColor: this.props.bgColor}}>
        <FlipComponent
          isFlipped={this.state.isFlipped}
          rotateDuration = {500}
          scale = {1}
          frontView={
            <TouchableOpacity onPress={() => {this.setState({ isFlipped: !this.state.isFlipped });
            this.props.verifyCharacter()}}>
              <View style = {styles.backFace}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold'}}>
                  {this.props.letterNumber}
                </Text>
              </View>
            </TouchableOpacity>
          }
          backView={
            <TouchableOpacity>
            <View style = {styles.face}>
            <Text style={{ textAlign: 'center', fontWeight: 'bold'}}>
            {this.props.character}
            </Text>
            </View>
            </TouchableOpacity>
          }
        />
       {/* <Button
          onPress={() => {
            this.setState({ isFlipped: !this.state.isFlipped })
          }}
          title="Flip"
        />*/}
      </View>
    )
  }
}

const squareSide = 50

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  face: {
    height: squareSide,
    width: squareSide,
    borderColor: 'blue',
    borderWidth: 2,
    justifyContent: 'center',
    borderRadius: 5
  },
  backFace: {
    height: squareSide,
    width: squareSide,
    borderColor: 'blue',
    borderWidth: 2,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    borderRadius: 5
  }
})
