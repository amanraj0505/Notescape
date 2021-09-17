import React from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Share,
  ScrollView,
  BackHandler,
} from 'react-native';
import {styles} from '../styles';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input, Overlay} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {addNote, editNote} from '../redux/actions/noteAction';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
class AddNotesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
    if (this.props.navigation.getParam('noteDate')) {
      this.state = {
        open: false,
        noteBackground: this.props.navigation.getParam('noteBackground'),
        noteTitle: this.props.navigation.getParam('noteTitle'),
        noteContent: this.props.navigation.getParam('noteContent'),
        noteDate: this.props.navigation.getParam('noteDate'),
        notePin: this.props.navigation.getParam('notePin'),
        editNote: true,
        visible: false,
      };
    } else {
      this.state = {
        open: false,
        visible: false,
        noteBackground: '#ffffff',
        noteTitle: null,
        noteContent: null,
        noteDate: String(new Date()),
        notePin: 'pin-outline',
      };
    }
  }
  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }
  handleBackButtonClick() {
    this.props.navigation.goBack();
    this.saveNotes();
    return true;
  }
  async saveNotes() {
    if (this.state.editNote) {
      const currentNote = {
        noteTitle: this.state.noteTitle,
        noteContent: this.state.noteContent,
        noteBackground: this.state.noteBackground,
        notePin: this.state.notePin,
      };
      this.props.editNote({
        ...currentNote,
        newNoteDate: String(new Date()),
        oldNoteDate: this.state.noteDate,
      });
      try {
        await AsyncStorage.removeItem(this.state.noteDate);
        await EncryptedStorage.removeItem(this.state.noteDate);

        AsyncStorage.setItem(String(String(new Date())), '[Notes]');
        EncryptedStorage.setItem(
          String(String(new Date())),
          JSON.stringify({
            ...currentNote,
            noteDate: String(String(new Date())),
          }),
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      if (this.state.noteContent !== null) {
        const currentNote = {
          noteTitle: this.state.noteTitle,
          noteContent: this.state.noteContent,
          noteDate: this.state.noteDate,
          noteBackground: this.state.noteBackground,
          notePin: this.state.notePin,
        };
        try {
          AsyncStorage.setItem(this.state.noteDate, '[Notes]');
          EncryptedStorage.setItem(
            String(this.state.noteDate),
            JSON.stringify(currentNote),
          );
        } catch (err) {
          console.log(err);
        }
        this.props.addNote(currentNote);
      }
    }
  }

  render() {
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: this.state.noteBackground}}>
        <StatusBar backgroundColor={'transparent'} barStyle={'dark-content'} />
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="chevron-left"
            style={styles.backIcon}
            size={24}
            onPress={async () => {
              await this.saveNotes();
              this.props.navigation.goBack();
            }}
          />
          <View style={styles.buttonsView}>
            <Icon
              name="paint-brush"
              style={styles.backIcon}
              size={24}
              onPress={() => {
                this.setState({visible: true});
              }}
            />
            <Icon
              name="share-alt"
              style={styles.backIcon}
              size={24}
              onPress={async () => {
                try {
                  const result = await Share.share({
                    message:
                      this.state.noteTitle + '\n' + this.state.noteContent,
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            />
            <MaterialCommunityIcons
              name={this.state.notePin}
              style={styles.backIcon}
              size={25}
              onPress={() => {
                if (this.state.notePin === 'pin-outline')
                  this.setState({notePin: 'pin'});
                else this.setState({notePin: 'pin-outline'});
              }}
            />
          </View>
        </View>
        <ScrollView>
          <View style={styles.addNotesView}>
            <Overlay
              isVisible={this.state.visible}
              overlayStyle={{borderRadius: 20}}
              onBackdropPress={() => {
                this.setState({visible: false});
              }}>
              <View style={{padding: 5, alignItems: 'center', marginBottom: 5}}>
                <Text>NOTE BACKGROUND</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{...styles.colorCircle, backgroundColor: '#f9ca24'}}
                  onPress={() => {
                    this.setState({noteBackground: '#f9ca24', visible: false});
                  }}
                />
                <TouchableOpacity
                  style={{...styles.colorCircle, backgroundColor: '#eb4d4b'}}
                  onPress={() => {
                    this.setState({noteBackground: '#eb4d4b', visible: false});
                  }}
                />
                <TouchableOpacity
                  style={{...styles.colorCircle, backgroundColor: '#7f8fa6'}}
                  onPress={() => {
                    this.setState({noteBackground: '#7f8fa6', visible: false});
                  }}
                />
                <TouchableOpacity
                  style={{...styles.colorCircle, backgroundColor: '#54a0ff'}}
                  onPress={() => {
                    this.setState({noteBackground: '#54a0ff', visible: false});
                  }}
                />
                <TouchableOpacity
                  style={{...styles.colorCircle, backgroundColor: '#78e08f'}}
                  onPress={() => {
                    this.setState({noteBackground: '#78e08f', visible: false});
                  }}
                />
              </View>
            </Overlay>
            <Input
              placeholder="Note Title"
              leftIcon={{type: 'font-awesome', name: 'edit'}}
              multiline={true}
              style={styles.textField}
              inputContainerStyle={{borderBottomWidth: 0}}
              onChangeText={text => this.setState({noteTitle: text})}
              value={this.state.noteTitle}
              inputStyle={{fontWeight: 'bold'}}
            />
            <Input
              placeholder="Note Content"
              leftIcon={{type: 'font-awesome', name: 'edit'}}
              multiline={true}
              style={styles.textField}
              inputContainerStyle={{borderBottomWidth: 0}}
              onChangeText={text => this.setState({noteContent: text})}
              value={this.state.noteContent}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    addNote: note => dispatch(addNote(note)),
    editNote: note => dispatch(editNote(note)),
  };
};
export default connect(null, mapDispatchToProps)(AddNotesScreen);
