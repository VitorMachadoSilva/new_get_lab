// src/utils/token.js
export function getToken() {
    return localStorage.getItem("lab_api_token");
  }
  
  export function removeToken() {
    localStorage.removeItem("lab_api_token");
  }