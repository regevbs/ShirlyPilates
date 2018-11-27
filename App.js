
import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, ListItem, Button,ButtonGroup } from 'react-native-elements';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


type Props = {};
export default class App extends Component<Props> {

  state = {
    index: 0
  }

  updateIndex = (index) => {
    this.setState({index})
  }

  render() {
    let pic = {
      uri: 'https://en.wikipedia.org/wiki/Main_Page#/media/File:TSM350_2015_-_Joey_Logano_1_-_Stierch.jpg'
    };
    return (
      <View>
      <Icon.Button name="facebook" backgroundColor="#3b5998">
        <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#3b5998"}}>Login with Facebook</Text>
      </Icon.Button>
      <Icon.Button name="google" backgroundColor="#f18973">
        <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#f18973"}}>Login with Google</Text>
      </Icon.Button>
      <ButtonGroup
        selectedBackgroundColor="blue"
        underlayColor = "blue"
        onPress={this.updateIndex}
        selectedIndex={this.state.index}
        buttons={['על הסטודיו','העמוד שלי','הרשמה לשיעורים','הודעות']}
        containerStyle={{height: 50}}
        textStyle = {styles.welcome}

         />


      </View>
    );


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
