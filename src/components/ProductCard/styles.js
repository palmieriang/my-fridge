import { StyleSheet } from 'react-native';
import { adjust } from '../utils/dimensions';

export default StyleSheet.create({
  card: {
    alignItems: 'flex-end',
    flex: 1,
    flexWrap: 'wrap',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  date: {
    fontSize: adjust(12),
    marginBottom: 10,
    fontFamily: 'OpenSans-Light',
  },
  title: {
    fontFamily: 'OpenSans-Regular',
    fontSize: adjust(16),
    marginBottom: 10,
    marginTop: 5,
  },
  counterContainer: {
    alignItems: 'baseline',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  counterText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(32),
  },
  counterLabel: {
    fontFamily: 'OpenSans-Light',
    fontSize: adjust(12),
    marginLeft: 10,
  },
  expired: {
    fontFamily: 'LilitaOne-Regular',
    fontSize: adjust(32),
    textTransform: 'uppercase',
  },
});
