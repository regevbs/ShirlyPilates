
import React, {Component} from 'react';
import {KeyboardAvoidingView ,Alert,ListView, AppRegistry, Platform, StyleSheet, Text, View, Image,TouchableHighlight,TextInput, TouchableOpacity} from 'react-native';
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
  //Method invoked when clicking one of the buttons for selecting the part of the app to see
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
    let ds2 = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
    this.state = {
      itemDataSource: ds,
      itemDataSource2: ds2,
      hideClassList: true,
      hideStudioInfo: true,
      hideMyInfo: true,
      hideMessages: true,
      loading: true,
      loggedIn: false,
    }

    this.itemsRef = this.getRef().child('ClassList');
    this.itemsRef2 = this.getRef().child('Messages');
    this.renderRow = this.renderRow.bind(this);
    this.pressRow = this.pressRow.bind(this);
  }

  getRef()
  {
    return firebaseApp.database().ref();
  }

  componentWillMount(){
    this.getItems(this.itemsRef,this.itemsRef2);
  }
  componentDidMount(){
    this.getItems(this.itemsRef,this.itemsRef2);
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });

  }
  /**
   * Don't forget to stop listening for authentication state changes
   * when the component unmounts.
   */
  componentWillUnmount() {
    this.authSubscription();
  }

  getItems(itemsRef,itemsRef2)
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
      itemsRef2.on('value',(snap)=>
      {
        let items2 = [];
        snap.forEach((child) => {
          items2.push({
              title: child.val().title,
              _key: child.key
            });
          });
          this.setState({
              itemDataSource2: this.state.itemDataSource2.cloneWithRows(items2)
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
    // The application is initialising
    if (this.state.loading) return null;
    // The user is an Object, so they're logged in
    //if (this.state.user)
    else
    return (
      <View>


      <ButtonGroup
        selectedBackgroundColor="blue"
        underlayColor = "blue"
        onPress={this.updateIndex}
        selectedIndex={this.state.index}
        buttons={['על הסטודיו','העמוד שלי','הרשמה לשיעורים','הודעות']}
        containerStyle={{height: 50}}
        textStyle = {styles.liText}

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
           <ListView
            dataSource = {this.state.itemDataSource2}
            renderRow = {this.renderRow}
           />
            <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#f18973"}}>Messages</Text>
         </HideableView>
         <HideableView hide = {this.state.hideStudioInfo}>
            <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#f18973"}}>Studio info</Text>
         </HideableView>


      </View>
    );

    // The user is null, so they're logged out - show login screen
    return(
      <KeyboardAvoidingView behavior="padding" style={styles.container}>

                <View style={styles.loginContainer}>
                   <Image resizeMode="contain" style={styles.logo} source={require('./app/Images/shirly.jpg')} />

                   </View>
               <View style={styles.formContainer}>
                 <TextInput style = {styles.input}
                        autoCapitalize="none"
                        onSubmitEditing={() => this.passwordInput.focus()}
                        autoCorrect={false}
                        keyboardType='email-address'
                        returnKeyType="next"
                        placeholder='Email or Mobile Num'
                        placeholderTextColor='rgba(105,105,105,0.7)'
                        ref = "username"
                        onChangeText={(username) => this.setState({username})}/>

                 <TextInput style = {styles.input}
                       returnKeyType="go"
                       ref={(input)=> this.passwordInput = input}
                       placeholder='Password'
                       placeholderTextColor='rgba(105,105,105,0.7)'
                       secureTextEntry
                       ref = "password"
                       onChangeText={(password) => this.setState({password})}/>
                       <Icon.Button name="facebook" backgroundColor="#3b5998" onPress={this.updateIndex}>
                         <Text style={{fontFamily: 'Arial', fontSize: 18, backgroundColor:"#3b5998"}}>Login with Facebook</Text>
                       </Icon.Button>
                 <TouchableOpacity style={styles.buttonContainer}
                              onPress={() => {
                              //const { this.state.username, this.state.password } = this.state;
                              firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
                                .then((user) => {
                                  // If you need to do anything with the user, do it here
                                  // The user will be logged in automatically by the
                                  // `onAuthStateChanged` listener we set up in App.js earlier
                                })
                                .catch((error) => {
                                  const { code, message } = error;
                                  // For details of error codes, see the docs
                                  // The message contains the default Firebase string
                                  // representation of the error
                                });
                            }}>
                      <Text  style={styles.buttonText}>Login</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.buttonContainer}
                              onPress = {() => {
                                      //const { email, password } = this.state;
                                      firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password)
                                        .then((user) => {
                                          // If you need to do anything with the user, do it here
                                          // The user will be logged in automatically by the
                                          // `onAuthStateChanged` listener we set up in App.js earlier
                                        })
                                        .catch((error) => {
                                          const { code, message } = error;
                                          // For details of error codes, see the docs
                                          // The message contains the default Firebase string
                                          // representation of the error
                                        });
                                    }}>
                      <Text  style={styles.buttonText}>Register</Text>
                 </TouchableOpacity>
               </View>
           </KeyboardAvoidingView>
    /*  <View>
        <Image style={{width: 40, height: 40}} source={require('./app/Images/shirly.jpg')}  />
        <TextInput style = {styles.input}
               autoCapitalize="none"
               onSubmitEditing={() => this.passwordInput.focus()}
               autoCorrect={false}
               keyboardType='email-address'
               returnKeyType="next"
               placeholder='Email or Mobile Num'
               placeholderTextColor='rgba(105,105,105,0.7)'/>

        <TextInput style = {styles.input}
              returnKeyType="go"
              ref={(input)=> this.passwordInput = input}
              placeholder='Password'
              placeholderTextColor='rgba(105,105,105,0.7)'
              secureTextEntry/>

        <TouchableOpacity style={styles.buttonContainer}
                     onPress={() => Alert.alert()}>
             <Text  style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>*/
    )
  }
}
