import { doGetWithTokenJson, doPostNoToken } from "./generalCalls";
export async function login(email,password){
    
    const user ={email : email,
                 password : password}
    
    let url="login/auth";
    
    return doPostNoToken(url,user);
    
}

export async function getUser(){
    let url = "login/user"

    return doGetWithTokenJson(url)
}

    