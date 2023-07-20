import axios from 'axios';

let baseURL = process.env.NODE_ENV === 'development' ? '/api' : ""

const formRequest = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  withCredentials: true
})

const formDataRequest = axios.create({
  baseURL,
  headers: { 'Content-Type': 'multipart/form-data' },
  withCredentials: true
})

export const loginApi = data => formRequest.post('/interface/web/UserLogin', data);
export const getSiteApi = () => formRequest.get('/interface/web/GetSite');
// favorite
export const getFavoriteApi = data => formDataRequest.post('/interface/WebMember/FavoriteInfo', data);
export const deleteFavoriteApi = data => formDataRequest.post('/interface/WebMember/DeleteFavorite', data);
export const addFavoriteApi = data => formDataRequest.post('/interface/WebMember/AddFavorite', data);
// 
export const getAllApi = data => formRequest.post('/interface/web/WebLogin', data);
export const getStoreApi = data => formRequest.post('/interface/web/getStore', data);
export const getCopyRightApi = data => formRequest.post('/interface/web/GetCopyRight', data);
export const getCustomerServiceApi = data => formRequest.post('/interface/web/GetCustomerService', data);
// 
export const getHomePageApi = data => formRequest.post('/interface/web/GetHomePage', data);
export const getCategoryApi = data => formDataRequest.post('/interface/web/GetWebSubCategory', data);
export const getContactApi = data => formRequest.post('/interface/web/GetWebContact', data);
export const getSearchApi = data => formDataRequest.post('/interface/web/GetProductSearch', data);
export const getOrderApi = data => formDataRequest.post('/interface/web/GetOrderContactAjax', data);
export const getMemberOrderApi = data => formDataRequest.post('/interface/Webmember/GetMemberOrders', data);


export const checkPayApi = data => formDataRequest.post('/interface/web/ATMComfirmBack', data);
export const rePayApi = data => formRequest.post('/LineMK/Line/RePayConfirm', data);
export const searchMartDeliveryApi = data => formDataRequest.post('/interface/store/QueryLogisticsInfo', data);
export const send_verify_codeApi = data => formRequest.post('/interface/WebMember/SendValidateMessage', data);
export const connectHandlerApi = data => formDataRequest.post('/interface/web/PostFeedback', data);

// user
export const registerApi = data => formDataRequest.post('/interface/WebMember/MemberRegister', data);
export const user_loginApi = data => formDataRequest.post('/interface/WebMember/MemberLogin', data);
export const send_forget_verify_codeApi = data => formDataRequest.post('/interface/WebMember/ForgetPasswordValidateMessage', data);
export const check_forget_verify_codeApi = data => formDataRequest.post('/interface/WebMember/CheckForgetPasswordValidate', data);
export const edit_forget_passApi = data => formDataRequest.post('/interface/WebMember/changeforgetpasswordvalidate', data);
export const validateRecommenderCodeApi = data => formDataRequest.post('/interface/WebMember/CheckRecommanderCode', data);
export const getLineProfileApi = LineToken => axios.create({
  headers: { 'Authorization': `Bearer ${LineToken}` },
  withCredentials: true
}).get('https://api.line.me/oauth2/v2.1/userinfo');

// info
export const getUser_infoApi = data => formDataRequest.post('/interface/WebMember/GetMemberInfo', data);
export const edit_infoApi = data => formDataRequest.post('/interface/WebMember/EditMemberInfo', data);
export const edit_passApi = data => formDataRequest.post('/interface/WebMember/EditMemberPassWord', data);
export const getBonusApi = data => formDataRequest.post('/interface/Webmember/GetMemberBonusOrders', data);
export const post_logoutApi = data => formRequest.post('/interface/WebMember/MemberLogout', data);
export const unbindLine_testApi = data => formDataRequest.post('/interface/WebMember/OldMemberDeleteLineIDAccount', data);
export const deleteAccount_testApi = data => formDataRequest.post('/interface/WebMember/DeleteLineIDAccount', data);

// shopping
export const getCategoriesApi = data => formRequest.post('/interface/store/GetCategory', data);
export const getProductsApi = data => formRequest.post('/interface/store/storeLogin', data);