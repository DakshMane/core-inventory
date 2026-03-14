// Are you doing this?
import admin from 'firebase-admin';
import serviceAccount from '../../serviceAccount.json' with { type: 'json' };

const adminInfo = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log(adminInfo)
export default admin;
