import { doGetWithTokenJson, doPostNoToken } from "./generalCalls";

// Funcție pentru login
export async function login(email, password) {
  const user = { email: email, password: password };
  let url = "login/auth";
  return doPostNoToken(url, user);
}

// Funcție pentru obținerea detaliilor utilizatorului autentificat
export async function getUser() {
  let url = "login/user";
  return doGetWithTokenJson(url);
}

// Funcție pentru înregistrarea unui utilizator nou
export async function register(fullName, email, password, confirmPassword) {
  const user = {
    fullName: fullName,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  };
  let url = "register";
  return doPostNoToken(url, user);
}
