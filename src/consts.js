
const MYCONSTANTS = {}

if(process.env.NODE_ENV === "development")
{
    MYCONSTANTS.APP_ROOT_URL = "http://localhost:3001/"  //my server
    //MYCONSTANTS.APP_ROOT_URL = "http://localhost:3000/" // SAM INIT server
}
else
{
    MYCONSTANTS.APP_ROOT_URL = "https://r2e8f10ca0.execute-api.ap-southeast-2.amazonaws.com/"
}

MYCONSTANTS.CHECK_PASSWORD_URL = MYCONSTANTS.APP_ROOT_URL+"login";
MYCONSTANTS.VERIFY_EMAIL_URL = MYCONSTANTS.APP_ROOT_URL+"verifyemail";
MYCONSTANTS.SEND_VERYFICATION_EMAIL_URL = MYCONSTANTS.APP_ROOT_URL+"sendvemail";
MYCONSTANTS.SEND_TEMP_PASSWORD_URL = MYCONSTANTS.APP_ROOT_URL+"sendtemppass"
MYCONSTANTS.PASSWORD_RESOURCE_URL = MYCONSTANTS.APP_ROOT_URL+"password";
MYCONSTANTS.EMAIL_RESOURCE_URL = MYCONSTANTS.APP_ROOT_URL+"email";
MYCONSTANTS.CHECK_TOKEN_URL = MYCONSTANTS.APP_ROOT_URL+"loginbytoken";
MYCONSTANTS.USER_RESOURCE = MYCONSTANTS.APP_ROOT_URL+"user";
MYCONSTANTS.BASICS_RESOURCE = MYCONSTANTS.APP_ROOT_URL+"basics";
MYCONSTANTS.PAYEE_RESOURCE = MYCONSTANTS.APP_ROOT_URL+"payee";
MYCONSTANTS.ADD_NEW_PAYEE = MYCONSTANTS.APP_ROOT_URL+"newpayee";
MYCONSTANTS.CLIENT_RESOURCE = MYCONSTANTS.APP_ROOT_URL+"client";
MYCONSTANTS.ALL_CLIENTS_RESOURCE = MYCONSTANTS.APP_ROOT_URL+"clients";
MYCONSTANTS.GET_PDF_URL = MYCONSTANTS.APP_ROOT_URL+"getpdf";
MYCONSTANTS.ADD_USER_URL = MYCONSTANTS.APP_ROOT_URL+"newuser";
MYCONSTANTS.ADD_CLIENT_URL = MYCONSTANTS.APP_ROOT_URL+"newclient";
export default MYCONSTANTS;