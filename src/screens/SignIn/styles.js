import { StyleSheet } from 'react-native';
import { adjust } from '@components/utils/dimensions';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  animationContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    height: 280,
  },
  footerView: {
    alignItems: 'center',
    flex: 1,
    marginTop: 20,
  },
  footerText: {
    color: '#2e2e2d',
    fontFamily: 'OpenSans-Regular',
    fontSize: adjust(13),
    padding: 10,
  },
  footerLink: {
    color: '#48bbec',
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(14),
    padding: 10,
  },
});
