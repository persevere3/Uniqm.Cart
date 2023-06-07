import axios from 'axios';

let baseURL = process.env.NODE_ENV === 'development' ? '/api' : ""

const cartRequest = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

const cartRequestFormData = axios.create({
  baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true
})

export const loginApi = data => cartRequest.post('/interface/web/UserLogin', data);
export const getSiteApi = () => cartRequest.get('/interface/web/GetSite');

export const getFavoriteApi = data => cartRequestFormData.post('/interface/WebMember/FavoriteInfo', data);
export const deleteFavoriteApi = data => cartRequestFormData.post('/interface/WebMember/DeleteFavorite', data);
export const addFavoriteApi = data => cartRequestFormData.post('/interface/WebMember/AddFavorite', data);

export const getAllApi = data => cartRequest.post('/interface/web/WebLogin', data);
export const getStoreApi = data => cartRequest.post('/interface/web/getStore', data);
export const getCopyRightApi = data => cartRequest.post('/interface/web/GetCopyRight', data);
export const getCustomerServiceApi = data => cartRequest.post('/interface/web/GetCustomerService', data);
 
export const getHomePageApi = data => cartRequest.post('/interface/web/GetHomePage', data);
export const getCategoryApi = data => cartRequestFormData.post('/interface/web/GetWebSubCategory', data);
export const getContactApi = data => cartRequest.post('/interface/web/GetWebContact', data);
export const getSearchApi = data => cartRequestFormData.post('/interface/web/GetProductSearch', data);
export const getOrderApi = data => cartRequestFormData.post('/interface/web/GetOrderContactAjax', data);
export const getMemberOrderApi = data => cartRequestFormData.post('/interface/Webmember/GetMemberOrders', data);

//
export const getBonusApi = data => cartRequest.post('/interface/Webmember/GetMemberBonusOrders', data);
export const checkPaytApi = data => cartRequest.post('/interface/web/ATMComfirmBack', data);
export const rePayApi = data => cartRequest.post('/LineMK/Line/RePayConfirm', data);
export const send_verify_codeApi = data => cartRequest.post('/interface/WebMember/SendValidateMessage', data);

// ok
export const registerApi = data => cartRequestFormData.post('/interface/WebMember/MemberRegister', data);
export const user_loginApi = data => cartRequestFormData.post('/interface/WebMember/MemberLogin', data);
export const send_forget_verify_codeApi = data => cartRequestFormData.post('/interface/WebMember/ForgetPasswordValidateMessage', data);
export const check_forget_verify_codeApi = data => cartRequestFormData.post('/interface/WebMember/CheckForgetPasswordValidate', data);
export const edit_forget_passApi = data => cartRequestFormData.post('/interface/WebMember/changeforgetpasswordvalidate', data);
export const validateRecommenderCodeApi = data => cartRequestFormData.post('/interface/WebMember/CheckRecommanderCode', data);
export const getLineProfileApi = LineToken => axios.create({
  headers: { 'Authorization': `Bearer ${LineToken}` },
  withCredentials: true
}).get('https://api.line.me/oauth2/v2.1/userinfo');

export const post_logoutApi = data => cartRequest.post('/interface/WebMember/MemberLogout', data);
export const getUser_infoApi = data => cartRequest.post('/interface/WebMember/GetMemberInfo', data);
export const edit_infoApi = data => cartRequest.post('/interface/WebMember/EditMemberInfo', data);

// ok
export const getCategoriesApi = data => cartRequest.post('/interface/store/GetCategory', data);
export const getProductsApi = data => cartRequest.post('/interface/store/storeLogin', data);

export const unbindLine_testApi = data => cartRequest.post('/interface/WebMember/OldMemberDeleteLineIDAccount', data);
export const deleteAccount_testApi = data => cartRequest.post('/interface/WebMember/DeleteLineIDAccount', data);
export const connectHandlerApi = data => cartRequest.post('/interface/web/PostFeedback', data);