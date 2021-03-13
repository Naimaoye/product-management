// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import * as admin from 'firebase-admin';
// import serviceAccount from './appConfig.json';
import uuid from 'uuidv4';

import dotenv from 'dotenv';

dotenv.config();
const SERVICE_ACCOUNT = process.env.GOOGLE_APPLICATION_CREDENTIALS || '';

admin.initializeApp({
	credential: admin.credential.cert(SERVICE_ACCOUNT),
	databaseURL: 'product-manatgemen.appspot.com',
});

var bucket = admin.storage().bucket();


export async function uploadFile(filename) {

  const metadata = {
    metadata: {
      // This line is very important. It's to create a download token.
      firebaseStorageDownloadTokens: uuid()
    },
    contentType: 'image/png',
    cacheControl: 'public, max-age=31536000',
  };

  // Uploads a local file to the bucket
  await bucket.upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: metadata,
  });

console.log(`${filename} uploaded.`);

}

