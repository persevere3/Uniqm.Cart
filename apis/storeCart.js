import { formRequest } from '@/utils/https'

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
export const loginApi = params => formRequest.post('/interface/store/UserLogin', params);

/*
  getSiteApi
*/
export const getSiteApi = () => formRequest.get('/interface/store/GetSite');

/* 
  getStoreApi
  let params = return_formUrlencoded('Preview')
*/
export const getStoreApi = params => formRequest.post('/interface/store/getStore', params);