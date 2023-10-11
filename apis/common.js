import { formRequest, formDataRequest } from '@/utils/https'

/*
  loginApi
  let obj = {
    site: state.site.Site,
    store: state.site.Name,
    preview: state.site.Preview,
    WebPreview: state.site.WebPreview
  }
  let params = methods.return_formUrlencoded(obj)
*/
export const loginApi = params => formRequest.post('/interface/web/UserLogin', params);

/*
  getSiteApi
  let params = methods.return_formUrlencoded('WebPreview')
*/
export const getSiteApi = () => formRequest.get('/interface/web/GetSite');

/*
  getAllApi
  let params = methods.return_formUrlencoded('WebPreview')
*/
export const getAllApi = params => formRequest.post('/interface/web/WebLogin', params);

/*
  getStoreApi
  let params = methods.return_formUrlencoded('WebPreview')
*/
export const getStoreApi = params => formRequest.post('/interface/web/getStore', params);

/*
  getCopyRightApi
  let params = methods.return_formUrlencoded('WebPreview')
*/
export const getCopyRightApi = params => formRequest.post('/interface/web/GetCopyRight', params);

/*
  getCustomerServiceApi
  let params = methods.return_formUrlencoded('WebPreview')
*/
export const getCustomerServiceApi = params => formRequest.post('/interface/web/GetCustomerService', params);

/*
  connectHandlerApi
  let formData = new FormData();
  formData.append("title", state.connect_mail.value);
  formData.append("text", state.connect_text.value);
  formData.append("WebPreview", site.value.WebPreview);
*/
export const connectHandlerApi = formData => formDataRequest.post('/interface/web/PostFeedback', formData);

