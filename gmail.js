
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

var oAuth2Client=''
var result=[];
var mail=''
mailList=[];
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'token.json';    
async function intialize(callback){
    var result=null
fs.readFile('credentials.json',(err,data)=>{
    if(err) console.log("no file ");
    authorize(JSON.parse(data),callback)
  
}

)
}




 function authorize(creds,callback){
    const {client_secret, client_id, redirect_uris} = creds.installed;
     oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
        getNewToken(oAuth2Client,callback);

}
 function getNewToken(oAuth2Client,callback){
    const authUrl =  oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      });
  callback(authUrl)    
}
  function newToken(code,callback){
     oAuth2Client.getToken(code,(err,token)=>{
         if(err)console.log("error occured")
         oAuth2Client.setCredentials(token)
         getMailList(oAuth2Client,callback)
     })
 }
 async function getMailList(auth,callback){
    const gmail = google.gmail({version: 'v1', auth});
     gmail.users.messages.list({userId:'me'},(err,res)=>{result=res.data.messages
         result.forEach(element => {
            gmail.users.messages.get({userId:'me',id:element.id,format:'MINIMAL'},(err,res)=>{mailList.push(res.data)
               
                
            })
            
        })

        setTimeout(()=>{callback(mailList)},3000)

       
    })

    
}

    

module.exports={intialize,newToken}