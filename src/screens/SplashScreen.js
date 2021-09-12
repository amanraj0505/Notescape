import React from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  ActivityIndicator,
  View,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import {connect} from 'react-redux';
import {addNote} from '../redux/actions';
import ReactNativeBiometrics from 'react-native-biometrics';
import Dialog from 'react-native-dialog';
class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordDialogVisible: false,
      passcodeTitle: 'Passcode',
      passcodeDescription: 'Please enter 4 digit passcode..',
      passcode: '',
      passcodePlaceholder: 'Enter Passcode.',
      placeholderTextColor: 'grey',
    };
  }
  async componentDidMount() {
    if (
      (await AsyncStorage.getItem('BiometricEnabled')) &&
      (await AsyncStorage.getItem('passcode'))
    ) {
      this.verifyBiometricWithPasscode();
    } else if (
      !(await AsyncStorage.getItem('BiometricEnabled')) &&
      (await AsyncStorage.getItem('passcode'))
    ) {
      this.verifyWithPasscode();
    } else if (
      (await AsyncStorage.getItem('BiometricEnabled')) &&
      !(await AsyncStorage.getItem('passcode'))
    ) {
      this.verifyWithBiometric();
    } else {
      await this.loadData();
    }
  }
  async loadData() {
    var noteKeys = await AsyncStorage.getAllKeys();
    for (let i in noteKeys) {
      if (await EncryptedStorage.getItem(noteKeys[i])) {
        this.props.addNote(
          JSON.parse(await EncryptedStorage.getItem(noteKeys[i])),
        );
      }
    }
    this.props.navigation.navigate('MainStack');
  }
  async verifyBiometricWithPasscode() {
    ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Confirm fingerprint',
      cancelButtonText: 'Use Passcode',
    })
      .then(async resultObject => {
        const {success} = resultObject;

        if (success) {
          await this.loadData();
        } else {
          this.setState({
            passwordDialogVisible: true,
            passcodeTitle: 'Passcode',
            passcodeDescription: 'Please enter 4 digit passcode..',
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          passwordDialogVisible: true,
          passcodeTitle: 'Passcode',
          passcodeDescription: 'Please enter 4 digit passcode..',
        });
      });
  }
  async verifyWithBiometric() {
    ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Confirm fingerprint',
      cancelButtonText: 'Exit App',
    })
      .then(async resultObject => {
        const {success} = resultObject;

        if (success) {
          await this.loadData();
        } else {
          BackHandler.exitApp();
        }
      })
      .catch(err => {
        console.log(err);
        BackHandler.exitApp();
      });
  }
  verifyWithPasscode() {
    this.setState({
      passwordDialogVisible: true,
      passcodeTitle: 'Passcode',
      passcodeDescription: 'Please enter 4 digit passcode..',
    });
  }
  render() {
    return (
      <React.Fragment>
        <SafeAreaView
          style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Dialog.Container visible={this.state.passwordDialogVisible}>
              <Dialog.Title>{this.state.passcodeTitle}</Dialog.Title>
              <Dialog.Description>
                {this.state.passcodeDescription}
              </Dialog.Description>
              <Dialog.Input
                placeholder={this.state.passcodePlaceholder}
                placeholderTextColor={this.state.placeholderTextColor}
                value={this.state.passcode}
                onChange={({nativeEvent}) => {
                  this.setState({passcode: nativeEvent.text});
                }}
                keyboardType={'number-pad'}
                secureTextEntry={true}
                maxLength={4}
              />
              <Dialog.Button
                label="Cancel"
                style={{fontWeight: 'bold'}}
                onPress={() => {
                  this.setState({passwordDialogVisible: false});
                  BackHandler.exitApp();
                }}
              />
              <Dialog.Button
                label="Submit"
                style={{fontWeight: 'bold'}}
                onPress={async () => {
                  if (
                    this.state.passcode ===
                    (await AsyncStorage.getItem('passcode'))
                  ) {
                    await this.loadData();
                  } else {
                    this.setState({
                      passcodePlaceholder: 'Incorrect Passcode...',
                      placeholderTextColor: 'red',
                      passcode: '',
                    });
                  }
                }}
              />
            </Dialog.Container>
          </View>
          <Image
            source={require('../assets/images/notes.png')}
            style={{width: 150, height: 150}}
          />
          <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>
            NoteScape
          </Text>
          <ActivityIndicator color="black" size={'large'} />
        </SafeAreaView>
      </React.Fragment>
    );
  }
  r;
}
const mapDispatchToProps = dispatch => {
  return {
    addNote: note => dispatch(addNote(note)),
  };
};
export default connect(null, mapDispatchToProps)(SplashScreen);
