import { formRequest, formDataRequest } from '@/utils/https'

/*
  checkPayApi
  let formData = new FormData();
  formData.append("payflino", order_number.value);
  formData.append("paytradeno", account_number.value);
*/
export const checkPayApi = formData => formDataRequest.post('/interface/web/ATMComfirmBack', formData);

/*
  rePayApi
  let formData = new FormData();
  formData.append("StoreId", site.value.Name);
  formData.append("flino", FilNo);
  formData.append("url", url);
*/
export const rePayApi = formData => formRequest.post('/LineMK/Line/RePayConfirm', formData);