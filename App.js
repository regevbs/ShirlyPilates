
import React, {Component} from 'react';
import {Alert,ListView, AppRegistry, Platform, StyleSheet, Text, View, Image,TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Card, ListItem, Button,ButtonGroup } from 'react-native-elements';
import * as firebase from 'firebase';
import HideableView from './app/components/HideableView/HideableView';

const firebaseConfig = {
    apiKey: "AIzaSyDbvELOADSFoylTLlzR5iV8zLDGRF1suls",
    authDomain: "shirlypilates-cfced.firebaseapp.com",
    databaseURL: "https://shirlypilates-cfced.firebaseio.com",
    projectId: "shirlypilates-cfced",
    storageBucket: "shirlypilates-cfced.appspot.com"
}

const firebaseApp = firebase.initializeApp(firebaseConfig);
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});
const styles = require('./app/style');

type Props = {};

export default class App extends Component<Props> {

  state = {
    index: 0,
    hideClassList: true,
    hideStudioInfo: true,
    hideMyInfo: true,
    hideMessages: true,
  }

  updateIndex = (index) => {
    this.setState({index});
    if(index == 0)
    {
      this.setState({hideClassList: true,hideStudioInfo: false,hideMyInfo: true,hideMessages: true});
    }
    else if(index == 1){
      this.setState({hideClassList: true,hideStudioInfo: true,hideMyInfo: false,hideMessages: true});
    }
    else if(index == 2){
      this.setState({hideClassList: false,hideStudioInfo: true,hideMyInfo: true,hideMessages: true});
    }
    else if(index == 3){
      this.setState({hideClassList: true,hideStudioInfo: true,hideMyInfo: true,hideMessages: false});
    }
    else {
      this.setState({hideClassList: true,hideStudioInfo: true,hideMyInfo: true,hideMessages: true});
    }
  }

  constructor()
  {
    super();
    let ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
    this.state = {
      itemDataSource: ds,
      hideClassList: true,
      hideStudioInfo: true,
      hideMyInfo: true,
      hideMessages: true
    }

    this.itemsRef = this.getRef().child('ClassList');
    
    this.renderRow = this.renderRow.bind(this);
    this.pressRow = this.pressRow.bind(this);
  }

  getRef()
  {
    return firebaseApp.database().ref();
  }

  componentWillMount(){
    this.getItems(this.itemsRef);
  }
  componentDidMount(){
    this.getItems(this.itemsRef);
  }
  getItems(itemsRef)
  {
    //let classes = [{title:'Class 1'},{title:'Class 2'}];
    itemsRef.on('value',(snap)=>
    {
      let items = [];
      snap.forEach((child) => {
        items.push({
            title: child.val().title,
            _key: child.key
          });
        });
        this.setState({
            itemDataSource: this.state.itemDataSource.cloneWithRows(items)
          });
      });

  }

  pressRow(item)
  {
    Alert.alert(
    'Signup ' + item,
    'Do you want to sign up for this class?',
    [
      {text: 'Always', onPress: () => console.log('Always sign for this lesson')},
      {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      {text: 'Yes', onPress: () => console.log('Yes Pressed')},
    ],
    { cancelable: false }
    );
    console.log(item);
  }

  renderRow(item)
  {
    return(
      <TouchableHighlight onPress = {()=> {
          this.pressRow(item);
        }}>
        <View style = {styles.li}>
          <Text style={styles.liText}>{item.title}</Text>
        </View>
      </TouchableHighlight>
      );
  }
  render() {
    let pic = {
      uri: 'https://en.wikipedia.org/wiki/Main_Page#/media/File:TSM350_2015_-_Joey_Logano_1_-_Stierch.jpg'
    };

    return (
      <View>
      <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={this.updateIndex}>
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
        textStyle = {styles2.welcome}

         />
         <HideableView hide = {this.state.hideClassList}>
           <ListView
            dataSource = {this.state.itemDataSource}
            renderRow = {this.renderRow}
           />
         </HideableView>
         <HideableView hide = {this.state.hideMyInfo}>
            <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#f18973"}}>My information</Text>
         </HideableView>
         <HideableView hide = {this.state.hideMessages}>
            <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#f18973"}}>Messages</Text>
         </HideableView>
         <HideableView hide = {this.state.hideStudioInfo}>
            <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#f18973"}}>Studio info</Text>
         </HideableView>


      </View>
    );


  }
}

const styles2 = StyleSheet.create({
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
