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
*/
export const getSiteApi = () => formRequest.get('/interface/web/GetSite');

/*
  getSeoApi
  // search
  const { id, cid, store } = useRoute().query

  // pagetype 
  let pagetype = 1
  if(location.pathname.indexOf('cart') > -1) pagetype = 0
  else if (location.pathname === '/' || location.pathname.indexOf('index') > -1)  pagetype = 1
  else if (location.pathname.indexOf('allProducts') > -1 || location.pathname.indexOf('category') > -1)  pagetype = 3
  else if (location.pathname.indexOf('contact') > -1 )  pagetype = 5
  else if (location.pathname.indexOf('rich') > -1 ) {
    if(cid == 0) pagetype = 3
    else if(cid == 1 || cid == 2) pagetype = 4
    else if(cid == 3) pagetype = 2
  }

  let obj = {
    id,
    pagetype,
    webid: store,
    WebPreview: state.site.WebPreview
  }
  let params = methods.return_formUrlencoded(obj)
*/
export const getSeoApi = params => formRequest.post('/interface/web/GetTitle', params);

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
  let obj = {
    title: state.connect_mail.value,
    text: state.connect_text.value,
    WebPreview: site.value.WebPreview
  }
  let formData = methods.return_formData(obj)
*/
export const connectHandlerApi = formData => formDataRequest.post('/interface/web/PostFeedback', formData);

