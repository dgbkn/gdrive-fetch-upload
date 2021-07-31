
require('dotenv').config();
const { google } = require('googleapis');


const client_id = process.env.CLIENT_ID;
const refresh_token = process.env.TOKEN;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uris = ["urn:ietf:wg:oauth:2.0:oob","http://localhost"];

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials({refresh_token:refresh_token});

  
const drive = google.drive({ version: 'v3', oAuth2Client });


module.exports.download_stream = async function ( fileId, response, request) {

//  console.log(fileId,oAuth2Client);
    // drive.files.get(
    //     { fileId: fileId, alt: 'media' },
    //     { responseType: 'stream' },

    //     function (err, res) {
    //         res.data
    //             .on('end', () => {
    //                 console.log('done');
    //             })
    //             .on('error', err => {
    //                 console.log('error', err);
    //                 return;
    //             })
    //             //    .pipe(dest);
    //             .on("data",
    //                 (e) => {return e}
    //             );
    //     }

    // );

   await drive.files.get(
        { fileId: fileId, alt: 'media' },
        { responseType: 'stream' },
        

        function (err, {data}) {
            data.on('end', () => {
                    console.log('done');
                })
        data.on('error', err => {
                    console.log('error', err);
                    return;
                })
                //    .pipe(dest);
                data.pipe(response);
        }

    )


}


module.exports.getFileStream = (fileId, opts = {}) => {

    return new Promise((resolve, reject) => {
      drive.files.get(
        { fileId, alt: "media" }, { responseType: "stream"},
        (err, res) => (err ? reject(err) : resolve(res))
      ); // prettier-ignore
    });
  }










































function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}