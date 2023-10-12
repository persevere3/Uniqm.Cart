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

/*
  getAddPriceApi
  let obj = {
    id: item.ID,
    Preview: site.value.Preview
  }
  let params = methods.return_formUrlencoded(obj)
*/
export const getAddPriceApi = params => formRequest.post('/interface/store/GetAdditional', params);

/*
  getAmountApi
  let type
  if(spec) type = 3
  else if(addPrice) type = 2
  else type = 1

  let obj = {
    id: target.ID,
    type
  }
  if(addPrice) obj['pid'] = main.ID
  let formData = methods.return_formData(obj)
*/
export const getAmountApi = formData => formDataRequest.post('/interface/store/GetProductQty', formData);