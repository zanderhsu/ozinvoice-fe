import axios from 'axios';
import Utility from './utils';
const RequestWorker = {};
function downloadPDFBlobData(responseData)
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

RequestWorker.getPDF = async (theUrl, reqData)=>
{
  return new Promise( (resolve, reject) => {
      Utility.actionForWaiting(true);
      console.log("RequestWorker:getPDF() start on :"+theUrl)
      axios.post(theUrl,reqData, {
              headers: {
                "Content-Type":"application/json;charset=UTF-8"
              },
              responseType:'blob'
          })
          .then((response)=>{
              downloadPDFBlobData(response.data);
              resolve("RequestWorker:getPDF() finished");
              Utility.actionForWaiting(false);
          })
          .catch( (error)=> {
              console.log("[RequestWorker:getPDF() ERROR]:"+error);
              reject(error);
              Utility.actionForWaiting(false);
          })
    })
}


RequestWorker.HttpJSONRequest = (method,theUrl,reqData)=>
{
  return new Promise( (resolve, reject) => {
    Utility.actionForWaiting(true);
    console.log("HttpJSONRequest() start on :"+method+","+theUrl)
    axios({
          method: method,
          url: theUrl,
          data:reqData
        })
        .then((response)=>{
            resolve(response.data); 
            Utility.actionForWaiting(false);
        })
        .catch( (error)=> {
            console.log("[HttpJSONRequest()]:"+error);
            reject(error);
            Utility.actionForWaiting(false);
        })
  })
}

export default RequestWorker;