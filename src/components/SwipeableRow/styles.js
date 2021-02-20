import { StyleSheet } from 'react-native';
import { adjust } from '../utils/dimensions';

export default StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  actionText: {
    color: 'white',
    fontFamily: 'OpenSans-Regular',
    fontSize: adjust(13),
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
});
