import axios from 'axios';

let baseURL = process.env.NODE_ENV === 'development' ? '/api' : ""
let withCredentials = true


export const formRequest = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials
})

export const formDataRequest = axios.create({
  baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials
})