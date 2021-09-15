import React from 'react';
import {View, StatusBar, FlatList, Text, Image, Alert} from 'react-native';
import {connect} from 'react-redux';
import {SpeedDial, SearchBar, Button} from 'react-native-elements';
import {NoteItem} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {deleteNote} from '../redux/actions/noteAction';
import ReactNativeBiometrics from 'react-native-biometrics';
import {styles} from '../styles';
import Dialog from 'react-native-dialog';
import {SwipeListView} from 'react-native-swipe-list-view';
class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fabOpen: false,
      searchText: '',
      searchContainerVisible: false,
      notelistVisible: true,
      searchList: [],
      appLock: 'lock-open',
      passwordDialogVisible: false,
      passcode: '',
      passcodeTitle: '',
      passcodeDescription: '',
      passcodePlaceholder: 'Enter passcode...',
      placeholderTextColor: 'grey',
    };
  }
  async componentDidMount() {
    this.setState({
      appLock:
        (await AsyncStorage.getItem('BiometricEnabled')) ||
        (await AsyncStorage.getItem('passcode'))
          ? 'lock'
          : 'lock-open',
    });
  }
  renderItem = ({item}) => (
    <NoteItem
      noteTitle={item.noteTitle}
      noteContent={item.noteContent}
      noteDate={item.noteDate}
      noteBackground={item.noteBackground}
      editFunction={() => {
        this.props.navigation.navigate('AddNotes', item);
      }}
      notePin={item.notePin}
    />
  );
  async verifyBiometrics() {
    const {biometryType} = await ReactNativeBiometrics.isSensorAvailable();
    if (biometryType === ReactNativeBiometrics.Biometrics) {
      ReactNativeBiometrics.simplePrompt({
        promptMessage: 'Confirm fingerprint',
        cancelButtonText: 'Use Passcode',
      })
        .then(resultObject => {
          const {success} = resultObject;

          if (success) {
            AsyncStorage.setItem('BiometricEnabled', 'true');
            this.setState({
              appLock: 'lock',
              fabOpen: false,
              passwordDialogVisible: true,
              passcodeTitle: 'Passcode',
              passcodeDescription:
                'Please enter 4 digit passcode in case biometric fails.',
            });
          } else {
            this.setState({
              passwordDialogVisible: true,
              passcodeTitle: 'Passcode',
              passcodeDescription: 'Please enter 4 digit passcode..',
            });
          }
        })
        .catch(() => {
          console.log('biometrics failed');
        });
    } else {
      Alert.alert(
        'Sensor Not Available...',
        'You can still set a passcode...',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              this.setState({
                passwordDialogVisible: true,
                passcodeTitle: 'Passcode',
                passcodeDescription: 'Please enter 4 digit passcode..',
              });
            },
          },
        ],
      );
    }
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
        <View resizeMode="cover" style={{flex: 1}}>
          <SearchBar
            placeholder="Search Notes..."
            lightTheme={true}
            containerStyle={styles.searchContainerView}
            inputContainerStyle={styles.searchInputContainer}
            round={true}
            platform={'android'}
            onChange={({nativeEvent}) => {
              this.setState({
                searchText: nativeEvent.text,
                searchList: this.props.noteList.filter(note => {
                  return (
                    String(note.noteTitle)
                      .toLowerCase()
                      .includes(String(nativeEvent.text).toLowerCase()) ||
                    String(note.noteContent)
                      .toLowerCase()
                      .includes(String(nativeEvent.text).toLowerCase())
                  );
                }),
              });
            }}
            value={this.state.searchText}
            onFocus={() => {
              this.setState({
                searchContainerVisible: true,
                notelistVisible: false,
                searchList: this.props.noteList,
              });
            }}
            onClear={() => {
              this.setState({
                searchContainerVisible: false,
                notelistVisible: true,
                searchText: '',
              });
            }}
          />
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
                }}
              />
              <Dialog.Button
                label="Submit"
                style={{fontWeight: 'bold'}}
                onPress={() => {
                  if (this.state.passcode.length === 4) {
                    AsyncStorage.setItem('passcode', this.state.passcode);
                    this.setState({
                      passcode: '',
                      fabOpen: false,
                      passwordDialogVisible: false,
                      appLock: 'lock',
                      passcodePlaceholder: 'Enter Passcode.',
                      placeholderTextColor: 'grey',
                    });
                  } else {
                    this.setState({
                      passcodePlaceholder: 'Enter Valid Passcode!',
                      placeholderTextColor: 'red',
                      passcode: '',
                    });
                  }
                }}
              />
            </Dialog.Container>
          </View>

          {this.props.noteList.length === 0 && (
            <View style={styles.emptyContainerView}>
              <Image
                source={require('../assets/images/notes.png')}
                style={styles.fadedLogo}
              />
              <Text style={{opacity: 0.4}}>Click '+' to add a note...</Text>
            </View>
          )}
          {this.state.searchContainerVisible && (
            <View>
              <SwipeListView
                data={this.state.searchList}
                renderItem={this.renderItem}
                keyExtractor={item => item.id}
                renderHiddenItem={data => (
                  <View style={styles.hiddenView}>
                    <Button
                      title="Delete"
                      icon={{name: 'delete', color: 'white'}}
                      buttonStyle={styles.deleteButtonStyle}
                      onPress={async () => {
                        this.props.deleteNote(data.item.noteDate);
                        try {
                          AsyncStorage.removeItem(data.item.noteDate);
                          EncryptedStorage.removeItem(data.item.noteDate);
                          this.setState({refresh: true});
                        } catch (err) {
                          console.log(err);
                        }
                      }}
                    />
                  </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-160}
              />
            </View>
          )}
          {this.state.notelistVisible && (
            <SwipeListView
              data={this.props.noteList}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              renderHiddenItem={data => (
                <View style={styles.hiddenView}>
                  <Button
                    title="Delete"
                    icon={{name: 'delete', color: 'white'}}
                    buttonStyle={styles.deleteButtonStyle}
                    onPress={async () => {
                      this.props.deleteNote(data.item.noteDate);
                      try {
                        AsyncStorage.removeItem(data.item.noteDate);
                        EncryptedStorage.removeItem(data.item.noteDate);
                        this.setState({refresh: true});
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  />
                </View>
              )}
              leftOpenValue={0}
              rightOpenValue={-160}
            />
          )}
          <SpeedDial
            isOpen={this.state.fabOpen}
            icon={{name: 'add', color: '#fff'}}
            openIcon={{name: 'close', color: '#fff'}}
            onOpen={() => this.setState({fabOpen: true})}
            onClose={() => this.setState({fabOpen: false})}
            color={'#0984e3'}>
            <SpeedDial.Action
              icon={{name: 'add', color: '#fff'}}
              title="Add a Note"
              onPress={() => {
                this.setState({fabOpen: false});
                this.props.navigation.navigate('AddNotes');
              }}
              color={'#0984e3'}
            />
            <SpeedDial.Action
              icon={{name: this.state.appLock, color: '#fff'}}
              title={
                this.state.appLock === 'lock-open'
                  ? 'Lock App'
                  : 'Remove App Lock'
              }
              onPress={async () => {
                if (this.state.appLock === 'lock-open') {
                  this.verifyBiometrics();
                } else {
                  Alert.alert(
                    'Remove App lock',
                    'Are you sure you want to remove passcode/biometrics ?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => {
                          this.setState({appLock: 'lock-open', fabOpen: false});
                          AsyncStorage.removeItem('BiometricEnabled');
                          AsyncStorage.removeItem('passcode');
                        },
                      },
                    ],
                  );
                }
              }}
              color={'#0984e3'}
            />
          </SpeedDial>
        </View>
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    deleteNote: noteDate => dispatch(deleteNote(noteDate)),
  };
};
const mapStateToProps = state => {
  return {
    noteList: state.note.noteList,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
