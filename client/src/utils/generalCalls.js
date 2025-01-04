import { APP_URL } from "./CONSTS";
function status(response) {
    console.log('response status '+response.status);
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}
export async function doPostNoToken(url,payload){
    let headers= new Headers();
    headers.append('Accept','*/*');
    headers.append('Content-Type','application/json');
    let init={method:'POST',
    headers: headers,
    mode:'cors',
    body : JSON.stringify(payload)
    };
    let request= new Request(APP_URL + url,init);
    console.log("POST for "+url);
    return fetch(request).then(async response => {
        if (!response.ok) {
          const errorMessage = await response.text(); // Await the response text promise
          const err = new Error(errorMessage);
          err.response = { status: response.status }; // Include the status in the error
          throw err;
        }
    
        return response;
      })
      .then(status)
      .then(data=>{
            console.log("Request succeeded",data);
            return data.text();
        })
        .catch(error=>{
            console.log("Error"+error);
            return Promise.reject(error);
        })
}

export async function doGetWithTokenJson(url){
    let headers= new Headers();
    headers.append('Accept','*/*');
    headers.append('Content-Type','application/json');
    headers.append('Authorization',"Bearer "+localStorage.getItem('jwtToken'))
    let init={method:'GET',
    headers: headers,
    mode:'cors',
    };
    let request= new Request(APP_URL + url,init);
    console.log("POST for "+url);
    return fetch(request).then(async response => {
        if (!response.ok) {
          const errorMessage = await response.text();
          const err = new Error(errorMessage);
          err.response = { status: response.status };
          throw err;
        }
    
        return response;
      })
      .then(status)
      .then(data=>{
            console.log("Request succeeded",data);
            return data.json();
        })
        .catch(error=>{
            console.log("Error"+error);
            return Promise.reject(error);
        })
}