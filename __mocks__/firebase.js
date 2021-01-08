jest.mock('../src/firebase/config.js', () => {
  const firebasemock = require('firebase-mock');

  const mockdatabase = new firebasemock.MockFirebase();
  const mockauth = new firebasemock.MockFirebase();
  const mocksdk = new firebasemock.MockFirebaseSdk(
    (path) => {
      null;
    },
    () => {
      return mockauth;
    }
  );
  const mockfirestore = new firebasemock.MockFirestore();

  const firebase = mocksdk.initializeApp(); // can take a path arg to database url

  // return the mock to match your export api
  return {
    auth: mockauth,
    database: mockdatabase,
    firestore: mockfirestore,
  };
});
