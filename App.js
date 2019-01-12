
import React, {Component} from 'react';
import {KeyboardAvoidingView ,Alert,ListView, AppRegistry, Platform, StyleSheet,FlatList, Text, View, Image,TouchableHighlight,TextInput, TouchableOpacity} from 'react-native';
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

//////////////////////////////////
var PushNotification = require('react-native-push-notification');

PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function(token) {
        console.log( 'TOKEN:', token );
    },

    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );

        // process the notification

        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
    senderID: "YOUR GCM (OR FCM) SENDER ID",

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,
});

///////////////////////////////


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
    //console.ignoredYellowBox = ['Setting a timer'];
    let ds = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
    let ds2 = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
    let ds3 = new ListView.DataSource({rowHasChanged:(r1,r2)=>r1 !== r2});
    this.state = {
      itemDataSource: ds,
      itemDataSource2: ds2,
      itemDataSource3: ds3,
      hideClassList: true,
      hideStudioInfo: true,
      hideMyInfo: true,
      hideMessages: true,
      loading: true,
      loggedIn: false,

    }

    ///let date2 = Date(this.getParsedDate('2016-01-04 10:34:23'));

    this.classesRef = this.getRef().child('ClassList');
    this.classesRef.push({title:'regev',participants:['2@3.com','dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                          waitForReplace:['mahud@gm.com'],slotsLeft: 1,date: "January 21, 2019 01:15:00",
                          isLocked: false,});

    this.messagesRef = this.getRef().child('Messages');

    this.usersRef = this.getRef().child('Users');
    this.usersRef.push({email:'dana@gmail.com',daysLeft:35,classesLeft:6,classPerWeek:1,classesThisWeek:0,classLeftDaysUntilExpire:[6,2]});
    this.renderRow = this.renderRow.bind(this);
    this.pressRow = this.pressRow.bind(this);
    this.signUpClass = this.signUpClass.bind(this);
    this.signOutClass = this.signOutClass.bind(this);
    this.signWaitingList = this.signWaitingList.bind(this);
    this.sayNotComing = this.sayNotComing.bind(this);

  }

  /*getParsedDate(date){
    date = String(date).split(' ');
    var days = String(date[0]).split('-');
    var hours = String(date[1]).split(':');
    return [parseInt(days[0]), parseInt(days[1])-1, parseInt(days[2]), parseInt(hours[0]), parseInt(hours[1]), parseInt(hours[2])];
  }*/

  getRef()
  {
    return firebaseApp.database().ref();
  }

  componentWillMount(){
    this.getItems(this.classesRef,this.messagesRef,this.usersRef);
  }
  componentDidMount(){
    this.getItems(this.classesRef,this.messagesRef,this.usersRef);
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

  getItems(classesRef,messagesRef,usersRef)
  {
    //let classes = [{title:'Class 1'},{title:'Class 2'}];
    classesRef.on('value',(snap)=>
    {

      let items = [];
      snap.forEach((child) => {
        items.push({
            title: child.val().title,
            _key: child.key,
            participants: child.val().participants,
            waiting: child.val().waiting,
            waitForReplace: child.val().waitForReplace,
            slotsLeft: child.val().slotsLeft,
            date: child.val().date,
            isLocked: child.val().isLocked,
          });
        });
        this.setState({
            itemDataSource: this.state.itemDataSource.cloneWithRows(items)
          });
      });
      messagesRef.on('value',(snap)=>
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
      usersRef.on('value',(snap)=>
      {
          let items3 = [];
          snap.forEach((child) => {
            items3.push({
              title: child.val().title,
              _key: child.key
            });
          });
          this.setState({
            itemDataSource3: this.state.itemDataSource3.cloneWithRows(items3)
          });
        });

  }


  signUpClass(item)
  {
    let slotsLeft = item.slotsLeft - 1;
    let mail = this.state.user.email.toString();
    let participants = [];
    for (let p in item.participants)
    {
      participants.push(item.participants[p]);
    }
    participants.push(mail);
    let waitForReplace = [];
    for (let w in item.waitForReplace)
    {
        waitForReplace.push(item.waitForReplace[w]);
    }

    Alert.alert(
    'Signup for class at\n' + item.date ,
    'Do you want to sign up for this class?' + item.slotsLeft,
    [
      //{text: 'Always', onPress: () => console.log('Always sign for this lesson')},
      {text: 'No', onPress: () => {let x = 1;}, style: 'cancel'},
      {text: 'Yes', onPress: () => {if(waitForReplace.length > 0)
        {
          waitForReplace.splice(0,1);
        }
         this.classesRef.child(item._key).update({slotsLeft,participants,waitForReplace});}},
      /*this.classesRef.push({title:'regev',participants:['2@3.com','dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                            waitForReplace:['mahud@gm.com'],slotsLeft: 1,day: 1,month:1,year: 2019,hr:19,
                            isLocked: false,dayBefore:false});*/
    ],
    { cancelable: false }
    );
  }

  signOutClass(item)
  {
    let slotsLeft = item.slotsLeft + 1;
    let mail = this.state.user.email.toString();
    let participants = [];
    for (let p in item.participants)
    {
      if(item.participants[p] != mail){
        participants.push(item.participants[p]);
      }

    }
    Alert.alert(
    'Cancel class at\n' + item.date ,
    'Are you sure you want to cancel?',
    [
      //{text: 'Always', onPress: () => console.log('Always sign for this lesson')},
      {text: 'No', onPress: () => {let x = 1;}, style: 'cancel'},
      {text: 'Yes', onPress: () => { this.classesRef.child(item._key).update({slotsLeft,participants,});}},
      /*this.classesRef.push({title:'regev',participants:['2@3.com','dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                            waitForReplace:['mahud@gm.com'],slotsLeft: 1,day: 1,month:1,year: 2019,hr:19,
                            isLocked: false,dayBefore:false});*/
    ],
    { cancelable: false }
    );

    ////
  /*  PushNotification.localNotification({
    //Android Only Properties
    id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
    ticker: "My Notification Ticker", // (optional)
    autoCancel: true, // (optional) default: true
    largeIcon: "ic_launcher", // (optional) default: "ic_launcher"
    smallIcon: "ic_notification", // (optional) default: "ic_notification" with fallback for "ic_launcher"
    bigText: "My big text that will be shown when notification is expanded", // (optional) default: "message" prop
    subText: "This is a subText", // (optional) default: none
    color: "red", // (optional) default: system default
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    tag: 'some_tag', // (optional) add tag to message
    group: "group", // (optional) add group to message
    ongoing: false, // (optional) set whether this is an "ongoing" notification
    priority: "high", // (optional) set notification priority, default: high
    visibility: "private", // (optional) set notification visibility, default: private
    importance: "high", // (optional) set notification importance, default: high

    // iOS only properties
    //alertAction: // (optional) default: view
    //category: // (optional) default: null
    //userInfo: // (optional) default: null (object containing additional notification data)

    // iOS and Android properties
    title: "My Notification Title", // (optional)
    message: "My Notification Message", // (required)
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
    number: '10', // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
    repeatType: 'day', // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
    actions: '["Yes", "No"]',  // (Android only) See the doc for notification actions to know more
});*/

    ///
    PushNotification.localNotificationSchedule({
  //... You can use all the options from localNotifications
  message: "My Notification Message2", // (required)
  date: new Date(Date.now() + (20 * 1000)) // in 60 secs
});
  }

  signWaitingList(item)
  {
    let mail = this.state.user.email.toString();
    let waiting = [];
    for (let p in item.waiting)
    {
      waiting.push(item.waiting[p]);
    }
    waiting.push(mail);
    Alert.alert(
    'Signup for waiting list for class at\n' + item.date ,
    'Do you want to sign up for this waiting list?' + item.slotsLeft,
    [
      //{text: 'Always', onPress: () => console.log('Always sign for this lesson')},
      {text: 'No', onPress: () => {let x = 1;}, style: 'cancel'},
      {text: 'Yes', onPress: () => { this.classesRef.child(item._key).update({waiting,});}},
      /*this.classesRef.push({title:'regev',participants:['2@3.com','dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                            waitForReplace:['mahud@gm.com'],slotsLeft: 1,day: 1,month:1,year: 2019,hr:19,
                            isLocked: false,dayBefore:false});*/
    ],
    { cancelable: false }
    );
  }

  sayNotComing(item)
  {
    let slotsLeft = item.slotsLeft + 1;
    let mail = this.state.user.email.toString();
    let participants = [];
    for (let p in item.participants)
    {
      if(item.participants[p] != mail){
        participants.push(item.participants[p]);
      }

    }
    let waitForReplace = [];
    for (let w in item.waitForReplace)
    {
        waitForReplace.push(item.waitForReplace[w]);
    }
    waitForReplace.push(mail);
    Alert.alert(
    'Youre not coming at\n' + item.date +"?" ,
    'You will pay unless someone else signs up',
    [
      //{text: 'Always', onPress: () => console.log('Always sign for this lesson')},
      {text: 'No', onPress: () => {let x = 1;}, style: 'cancel'},
      {text: 'Yes', onPress: () => { this.classesRef.child(item._key).update({slotsLeft,participants,waitForReplace,});}},
      /*this.classesRef.push({title:'regev',participants:['2@3.com','dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                            waitForReplace:['mahud@gm.com'],slotsLeft: 1,day: 1,month:1,year: 2019,hr:19,
                            isLocked: false,dayBefore:false});*/
    ],
    { cancelable: false }
    );
  }

  pressRow(item)
  {
    let title = "hi";
    //let title2 = "bye";
    Alert.alert(
    'Signup for class at\n' + item.date,
    'Do you want to sign up for this class?',
    [
      //{text: 'Always', onPress: () => console.log('Always sign for this lesson')},
      {text: 'No', onPress: () => this.classesRef.child(item._key).update({title,}), style: 'cancel'},
      {text: 'Yes', onPress: () => {let slotsLeft = this.slotsLeft - 1; this.classesRef.child(item._key).update({slotsLeft,});}},
      /*this.classesRef.push({title:'regev',participants:['2@3.com','dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                            waitForReplace:['mahud@gm.com'],slotsLeft: 1,day: 1,month:1,year: 2019,hr:19,
                            isLocked: false,dayBefore:false});*/
    ],
    { cancelable: false }
    );
  }

  renderRow(item)
  {
    //check if user is signed up for this lesson -
    ////
    /*this.classesRef.push({participants:['dana@gmail.com','gotcha@gmail.com','good@gmail.com'], waiting:['alex@gmail.com'],
                          waitForReplace:['mahud@gm.com'],slotsLeft: 1,day: 1,month:1,year: 2019,hr:19,
                          isLocked: false,dayBefore:false});*/

    let signedUp = false;
    let its24Before = false;
    let classFull = false;
    let mail = (this.state.user.email).toString();
    for (let userMail in item.participants)
    {
      if(mail == item.participants[userMail])
      {
        signedUp = true;
      }
    }
    var curDate = new Date();
    var classDate = new Date(item.date);
    let diff = (classDate.getTime() - curDate.getTime())/1000;
    //Alert.alert("Time diff is: " + diff);
    let secsIn24hrs = 24 * 60 * 60;
    if(diff < secsIn24hrs)
    {
      its24Before = true;
    }

    if(item.slotsLeft < 1)
    {
      classFull = true;
    }


    if(signedUp)
    {
        if(its24Before)
        {
          return(
            //<TouchableHighlight onPress = {()=> {
            //    this.pressRow(item);
            //  }}>
              <View style = {styles.li}>
                <Text style={styles.liText}>{this.state.user.email}</Text>
                <Text style={styles.liText}>{item.title}</Text>
                  <TouchableHighlight onPress = {()=> {
                      this.sayNotComing(item);
                    }}>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>I'm not coming!</Text>
                    </View>
                  </TouchableHighlight>
              </View>
            //</TouchableHighlight>
            );
        }
        else {//not 24 hrs before
          return(
            //<TouchableHighlight onPress = {()=> {
            //    this.pressRow(item);
            //  }}>

              <View style = {styles.li}>
                <Text style={styles.liText}>{this.state.user.email}</Text>
                <Text style={styles.liText}>{item.title}</Text>
                  <TouchableHighlight onPress = {()=> {
                      this.signOutClass(item);
                    }}>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>Cancel class</Text>
                    </View>
                  </TouchableHighlight>
              </View>
            //</TouchableHighlight>
            );
        }
    }
    else {//not signed up
        if(classFull)
        {
          //show waiting list button
          return(
            //<TouchableHighlight onPress = {()=> {
            //    this.pressRow(item);
            //  }}>
              <View style = {styles.li}>
                <Text style={styles.liText}>{this.state.user.email}</Text>
                <Text style={styles.liText}>{item.title}</Text>
                  <TouchableHighlight onPress = {()=> {
                      this.signWaitingList(item);
                    }}>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>Sign up for waiting list</Text>
                    </View>
                  </TouchableHighlight>
              </View>
            //</TouchableHighlight>
            );
        }
        else {
          //show sign up button
          return(
            //<TouchableHighlight onPress = {()=> {
            //    this.pressRow(item);
            //  }}>
              <View style = {styles.li}>
                <Text style={styles.liText}>{this.state.user.email}</Text>
                <Text style={styles.liText}>{item.title}</Text>
                  <TouchableHighlight onPress = {()=> {
                      this.signUpClass(item);
                    }}>
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>Sign up</Text>
                    </View>
                  </TouchableHighlight>
              </View>
            //</TouchableHighlight>
            );
        }
    }
    //if yes then show unsign/notify not coming depending on time button

    //if user is not signed up for this lesson - if there is room: sign up, no room: hamtana list
    /*return(
      //<TouchableHighlight onPress = {()=> {
      //    this.pressRow(item);
      //  }}>
        <View style = {styles.li}>
          <Text style={styles.liText}>{this.state.user.email}</Text>
          <Text style={styles.liText}>{item.title}</Text>
            <TouchableHighlight onPress = {()=> {
                this.pressRow(item);
              }}>
              <View style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Sign up</Text>
              </View>
            </TouchableHighlight>
        </View>
      //</TouchableHighlight>
    );*/
  }



  render() {
    // The application is initialising
    if (this.state.loading) return null;
    // The user is an Object, so they're logged in
    if (this.state.user)
    //else
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
            <TouchableOpacity style={styles.buttonContainer}
                         onPress={() => {
                         Alert.alert("logging out.");
                         firebase.auth().signOut();


                       }}>
                 <Text  style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
                        placeholder='Email'
                        placeholderTextColor='rgba(105,105,105,0.7)'
                        ref = "username"
                        onChangeText={(username) => this.setState({username})}/>

                 <TextInput style = {styles.input}
                       returnKeyType="go"
                       //ref={(input)=> this.passwordInput = input}
                       placeholder='Password'
                       placeholderTextColor='rgba(105,105,105,0.7)'
                       secureTextEntry
                       ref = {(input)=> this.passwordInput = input} //"password"
                       onChangeText={(password) => this.setState({password})}/>
                 <TouchableOpacity style={styles.buttonContainer}
                              onPress={() => {
                              if(this.state.username == null|| this.state.password == null || this.state.username.trim() == "" || this.state.password.trim() == "")
                              {
                                Alert.alert("Error - empty fields");
                                return;
                              }
                              firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password)
                                .then((user) => {
                                  Alert.alert("Login successful");
                                  // If you need to do anything with the user, do it here
                                  // The user will be logged in automatically by the
                                  // `onAuthStateChanged` listener we set up in App.js earlier
                                })
                                .catch((error) => {
                                  const { code, message } = error;
                                  Alert.alert(message);
                                  // For details of error codes, see the docs
                                  // The message contains the default Firebase string
                                  // representation of the error
                                });
                            }}>
                      <Text  style={styles.buttonText}>Login</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.buttonContainer2}
                              onPress = {() => {
                                      //const { email, password } = this.state;
                                      if(this.state.username == null|| this.state.password == null || this.state.username.trim() == "" || this.state.password.trim() == "")
                                      {
                                        Alert.alert("Error - empty fields");
                                        return;
                                      }
                                      firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password)
                                        .then((user) => {
                                          Alert.alert("User " + this.state.username + " created.\npassword: " + this.state.password);
                                          // If you need to do anything with the user, do it here
                                          // The user will be logged in automatically by the
                                          // `onAuthStateChanged` listener we set up in App.js earlier
                                        })
                                        .catch((error) => {
                                          const { code, message } = error;
                                          Alert.alert(message);
                                          // For details of error codes, see the docs
                                          // The message contains the default Firebase string
                                          // representation of the error
                                        });
                                    }}>
                      <Text  style={styles.buttonText}>Register</Text>
                 </TouchableOpacity>
               </View>
           </KeyboardAvoidingView>
    )
  }
}
