
require('dotenv').config();


  const client_id = process.env.CLIENT_ID;
  const refresh_token = process.env.TOKEN;
  const client_secret = process.env.CLIENT_SECRET;
  
  
  export async function fetchAccessToken() {
      
    console.log("fetchAccessToken");
    const url = "https://www.googleapis.com/oauth2/v4/token";
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    const post_data = {
      'client_id': client_id,
      'client_secret': client_secret,
      'refresh_token': refresh_token,
      'grant_type': 'refresh_token'
    }

    let requestOption = {
      'method': 'POST',
      'headers': headers,
      'body': enQuery(post_data)
    };

    const response = await fetch(url, requestOption);
    return await response.json();
  }



  export async function requestOption(headers = {}, method = 'GET') {
    const accessToken = await this.accessToken();
    headers['authorization'] = 'Bearer ' + accessToken;
    return {'method': method, 'headers': headers};
  }



  export async function accessToken() {
    console.log("accessToken");
    if (process.env.expires == undefined || process.env.expires < Date.now()) {
      const obj = await fetchAccessToken();
      if (obj.access_token != undefined) {
        process.env.accessToken = obj.access_token;
        process.env.expires = Date.now() + 3500 * 1000;
      }
    }
    return process.env.accessToken;
  }




  function enQuery(data) {
    const ret = [];
    for (let d in data) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
    return ret.join('&');
  }


  