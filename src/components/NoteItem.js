import React from 'react';
import {styles} from '../styles';
import {View, Text} from 'react-native';
import {ListItem, Avatar, Button} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
function NoteItem({
  noteTitle,
  noteContent,
  noteDate,
  noteBackground,
  deleteFunction,
  editFunction,
  notePin,
}) {
  const date = new Date(Date.parse(noteDate));
  return (
    <ListItem.Swipeable
      containerStyle={{
        ...styles.notesContainerView,
        backgroundColor: noteBackground,
      }}
      rightContent={
        <Button
          title="Delete"
          icon={{name: 'delete', color: 'white'}}
          buttonStyle={{
            ...styles.notesContainerView,
            backgroundColor: 'red',
            height: '80%',
          }}
          onPress={deleteFunction}
        />
      }
      leftContent={
        <Button
          title="Edit"
          icon={{name: 'edit', color: 'white'}}
          buttonStyle={{
            ...styles.notesContainerView,
            backgroundColor: '#0984e3',
            height: '80%',
          }}
          onPress={editFunction}
          activeOpacity={1}
        />
      }>
      <Avatar source={require('../assets/images/writing.png')} />
      <ListItem.Content>
        <ListItem.Title style={styles.listTitle}>{noteTitle}</ListItem.Title>
        <ListItem.Subtitle>
          <Text>{trimContent(noteContent)}</Text>
        </ListItem.Subtitle>
        <View style={styles.subtitleView}>
          <Text style={styles.ratingText}>
            {date.getDate() +
              '/' +
              getStringMonth(date.getMonth()) +
              '/' +
              date.getFullYear() +
              ' ' +
              '(' +
              getStringDay(date.getDay()) +
              ')'}
          </Text>
        </View>
      </ListItem.Content>
      {notePin === 'pin' && (
        <View>
          <MaterialCommunityIcons name="pin" size={20} />
        </View>
      )}
      <ListItem.Chevron color="black" />
    </ListItem.Swipeable>
  );
}
function getStringDay(day) {
  switch (day) {
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    case 0:
      return 'Sunday';
  }
}
function getStringMonth(month) {
  switch (month) {
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
    case 0:
      return 'Jan';
  }
}
function trimContent(content) {
  if (content.length > 20) return content.slice(0, 20) + '....';
  else return content;
}
export default NoteItem;
