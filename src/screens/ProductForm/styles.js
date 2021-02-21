import { StyleSheet } from 'react-native';
import { adjust } from '../../components/utils/dimensions';

export default StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    maxHeight: 54,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#48BBEC',
    borderRadius: 5,
    justifyContent: 'center',
    height: 48,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
  },
  buttonTitle: {
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(16),
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    textTransform: 'uppercase',
  },
  buttonDelete: {
    backgroundColor: '#e74c3c',
  },
});
