import {StyleSheet, StatusBar} from 'react-native';
import {createStyles} from '../utils/commonUtils';
const baseStyle = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  ratingImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    color: 'grey',
  },
  addNotesView: {
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  textField: {
    padding: 10,
  },
  backIcon: {
    margin: 5,
    padding: 10,
  },
  buttonsView: {
    flex: 1,
    flexDirection: 'row-reverse',
    width: '100%',
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    padding: 20,
    margin: 10,
  },
  notesContainerView: {
    borderRadius: 15,
    padding: 10,
    margin: 10,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  noteOverlay: {
    borderRadius: 5,
    minHeight: 90,
    minWidth: 180,
    maxWidth: 350,
    padding: 20,
  },
  noteTitleView: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  searchContainerView: {
    margin: 10,
    borderRadius: 20,
    padding: 5,
  },
  searchInputContainer: {
    borderRadius: 15,
  },
  emptyContainerView: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenView: {
    justifyContent: 'flex-start',
    display: 'flex',
    alignItems: 'flex-end',
  },
  deleteButtonStyle: {
    borderRadius: 15,
    padding: 10,
    margin: 10,
    backgroundColor: 'red',
    height: '81%',
    width: 150,
    marginRight: 15,
  },
  fadedLogo: {
    height: 150,
    width: 150,
    opacity: 0.4,
  },
});
export const styles = createStyles(baseStyle);
