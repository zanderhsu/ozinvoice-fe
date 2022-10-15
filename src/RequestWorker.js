import axios from 'axios';

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

RequestWorker.postJSONByaxios = async (theUrl, reqData)=>
{
  return new Promise( (resolve, reject) => {
      console.log("postJSONByaxios() start on :"+theUrl)
      axios.post(theUrl,reqData, {
              headers: {
                "Content-Type":"application/json;charset=UTF-8"
              },
              responseType: 'blob'
          })
          .then((response)=>{
              //console.log("[axois success]:");
              downloadPDFBlobData(response.data);
              resolve("request finished for url:"+theUrl);
          })
          .catch( (error)=> {
              // handle error
              console.log("[axois error]:"+error);
              reject(error);
          })
    })
}

export default RequestWorker;