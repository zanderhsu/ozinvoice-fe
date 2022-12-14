import axios from 'axios'
import Utility from './utils'
import {Buffer} from 'buffer'

const RequestWorker = (function(){


  function getPDFBlobURL(responseData)
  {
      var blob = new Blob([responseData], {type: 'application/pdf'});
       
      //Create a DOMString representing the blob and point the link element towards it
      return window.URL.createObjectURL(blob);
  
  }

  function _downloadPDFBlobData(responseData)
  {
      var blob = new Blob([responseData], {type: 'application/pdf'});
      
      let a = document.createElement("a");
      a.style = "display: none";
      document.body.appendChild(a);
      
      //Create a DOMString representing the blob and point the link element towards it
      let url = window.URL.createObjectURL(blob);
      //callback(url);
      a.href = url;
      a.download = 'MyInvoice.pdf';
      //programatically click the link to trigger the download
      a.click();
      //release the reference to the file by revoking the Object URL
      window.URL.revokeObjectURL(url);
  }

  const getPDF = async (theUrl, reqData)=>
  {
    return new Promise( (resolve, reject) => {
        Utility.actionForWaiting(true);
        console.log("RequestWorker:getPDF() start on :"+theUrl)
        axios.post(theUrl,reqData, {
                headers: {
                  "Content-Type":"application/json;charset=UTF-8"
                },
                //responseType:'blob'
                responseType:'json'
            })
            .then((response)=>{
                let pdfData = Buffer.from(response.data.toString(),'base64')
                let url = getPDFBlobURL(pdfData);
                //_downloadPDFBlobData(pdfData);
                resolve(url);
                Utility.actionForWaiting(false);
            })
            .catch( (error)=> {
                //console.log("[RequestWorker:getPDF() ERROR]:"+error);
                reject(error.message?error.message:"Error in Axios");
                Utility.actionForWaiting(false);
            })
      })
  }


  const  HttpJSONRequest = async(method,theUrl,reqData)=>
  {
    return new Promise( (resolve, reject) => {
      Utility.actionForWaiting(true);
    // console.log("HttpJSONRequest() start on :"+method+","+theUrl)
      axios({
            method: method,
            url: theUrl,
            data:reqData
          })
          .then((response)=>{
              resolve(response.data);
              Utility.actionForWaiting(false);
              //console.log("HttpJSONRequest() finished on :"+method+","+theUrl)
          })
          .catch( (error)=> {
              console.log("[HttpJSONRequest()] Error:"+JSON.stringify(error ));
              let errorMessag = error.response.data?error.response.data:error.message
              reject(errorMessag);
              Utility.actionForWaiting(false);
          })
    })
  }

return {
  getPDF:getPDF,
  HttpJSONRequest:HttpJSONRequest,
}
})();

export default RequestWorker;

