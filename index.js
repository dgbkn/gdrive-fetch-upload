


const express = require('express');
const port = 3000;
const app = express();



require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { download_stream ,getFileStream} = require('./utils/down_new');
const backup_db_name = 'dev.sqlite';

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';
// If modifying these scopes, delete token.json.


const client_id = process.env.CLIENT_ID;
const refresh_token = process.env.TOKEN;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uris = ["urn:ietf:wg:oauth:2.0:oob","http://localhost"];


/**
 * Create an OAuth2 client with the given credentials, and then execute the given callback function.
 */
function authorize(callback) {
  // console.log();
  // const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  // fs.readFile(TOKEN_PATH, (err, token) => {
    // if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials({refresh_token:refresh_token});
    // console.log(oAuth2Client);
    callback(oAuth2Client);
  // });
}






async function uploadFile(auth) {
  const drive = google.drive({version: 'v3', auth});
  const fileMetadata = {
    'name': backup_db_name
  };
  const media = {
    mimeType: 'application/vnd.sqlite3',
    body: fs.createReadStream(backup_db_name)
  };
  await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, (err, file) => {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });
}








app.get('/gdriveauth', (req, res) => {
  // fs.readFile('credentials.json', (err, content) => {
    // if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    // authorize(JSON.parse(content), uploadFile);
    // });
    authorize(uploadFile);
    res.send('Check The Console');
  });
  
  

  app.get('/gdriveauth', (req, res) => {
    // fs.readFile('credentials.json', (err, content) => {
      // if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      // authorize(JSON.parse(content), uploadFile);
      // });
      authorize(uploadFile);
      res.send('Check The Console');
    });


    // app.get('/down/:id',async (req, res) => {
    //   var fileId = req.params.id;
    //  await  download_stream(fileId,res,sreq);
    //   });
  

   app.get("/download/:id", async (req, res) => {
        try {
          const fileId = req.query.id || req.params.id;
          if (!fileId) res.status(400).send("File id not specified");

          const stream = await getFileStream(fileId, req.headers);

          Object.keys(stream.headers).forEach((val) => {
            res.setHeader(val, stream.headers[val]);
          });
          stream.data
            .on("end", () => {})
            .on("error", () => {})
            .pipe(res);
        } catch (e) {
          console.log();
          res.status(500).send(e);
        }
      });


  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    });












