import { formRequest, formDataRequest } from '@/utils/https'

/*
  getHomePageApi
  let params = return_formUrlencoded('WebPreview')
*/
export const getHomePageApi = params => formRequest.post('/interface/web/GetHomePage', params);

/*
  getCategoryApi
  let formData = new FormData();
  formData.append("id", id);
  formData.append("WebPreview", site.value.WebPreview);
*/
export const getCategoryApi = formData => formDataRequest.post('/interface/web/GetWebSubCategory', formData);

/*
  getSearchApi
  let formData = new FormData();
  formData.append("input", state.search_title);
  formData.append("type", state.sortBy_index);
  formData.append("WebPreview", site.value.WebPreview);
*/
export const getSearchApi = formData => formDataRequest.post('/interface/web/GetProductSearch', formData);

/*
  getContactApi
  let params = return_formUrlencoded('WebPreview')
*/
export const getContactApi = params => formRequest.post('/interface/web/GetWebContact', params);



