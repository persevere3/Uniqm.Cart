import { formRequest, formDataRequest } from '@/utils/https'

/*
  getCategoriesApi
  let params = return_formUrlencoded('Preview');
*/
export const getCategoriesApi = params => formRequest.post('/interface/store/GetCategory', params);

/*
  getProductsApi
  let params = return_formUrlencoded('Preview');
*/
export const getProductsApi = params => formRequest.post('/interface/store/storeLogin', params);
