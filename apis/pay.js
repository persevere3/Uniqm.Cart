import { formRequest, formDataRequest } from '@/utils/https'

/*
  checkPayApi
  let obj = {
    payflino: order_number.value,
    paytradeno: account_number.value,
  }
  let formData = return_formData(obj)
*/
export const checkPayApi = formData => formDataRequest.post('/interface/web/ATMComfirmBack', formData);

/*
  rePayApi
  let obj = {
    StoreId: site.value.Name,
    flino,
    url
  }
  let formData = return_formData(obj)
*/
export const rePayApi = formData => formRequest.post('/LineMK/Line/RePayConfirm', formData);