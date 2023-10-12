import { formRequest, formDataRequest } from '@/utils/https'

/*
  getHomePageApi
  let params = return_formUrlencoded('WebPreview')
*/
export const getHomePageApi = params => formRequest.post('/interface/web/GetHomePage', params);

/*
  getCategoryApi
  let obj = {
    id,
    WebPreview: site.value.WebPreview
  }
  let formData = return_formData(obj)
*/
export const getCategoryApi = formData => formDataRequest.post('/interface/web/GetWebSubCategory', formData);

/*
  getSearchApi
  let obj = {
    input: state.search_title,
    type: state.sortBy_index,
    WebPreview: site.value.WebPreview
  }
  let formData = return_formData(obj)
*/
export const getSearchApi = formData => formDataRequest.post('/interface/web/GetProductSearch', formData);

/*
  getContactApi
  let params = return_formUrlencoded('WebPreview')
*/
export const getContactApi = params => formRequest.post('/interface/web/GetWebContact', params);



