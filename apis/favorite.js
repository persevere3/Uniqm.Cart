import { formRequest, formDataRequest } from '@/utils/https'

/*
  getFavoriteApi
  let formData = new FormData()
  formData.append("storeid", state.site.Name)
  formData.append("phone", state.user_account)
*/
export const getFavoriteApi = formData => formDataRequest.post('/interface/WebMember/FavoriteInfo', formData);

/*
  deleteFavoriteApi
  let formData = new FormData();
  formData.append("storeid", state.site.Name);
  formData.append("phone", state.user_account);
  formData.append("productid[]", id);
*/
export const deleteFavoriteApi = formData => formDataRequest.post('/interface/WebMember/DeleteFavorite', formData);

/*
  addFavoriteApi
  let formData = new FormData();
  formData.append("storeid", state.site.Name);
  formData.append("phone", state.user_account);
  formData.append("productid[]", id);
*/
export const addFavoriteApi = formData => formDataRequest.post('/interface/WebMember/AddFavorite', formData);