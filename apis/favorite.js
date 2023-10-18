import { formDataRequest } from '@/utils/https'

/*
  getFavoriteApi
  let obj = {
    storeid: state.site.Name,
    phone: state.user_account
  }
  let formData = return_formData(obj)
*/
export const getFavoriteApi = formData => formDataRequest.post('/interface/WebMember/FavoriteInfo', formData);

/*
  deleteFavoriteApi
  let obj = {
    storeid: state.site.Name,
    phone: state.user_account,
    'productid[]': id
  }
  let formData = return_formData(obj)

*/
export const deleteFavoriteApi = formData => formDataRequest.post('/interface/WebMember/DeleteFavorite', formData);

/*
  addFavoriteApi
  let obj = {
    storeid: state.site.Name,
    phone: state.user_account,
    'productid[]': id
  }
  let formData = return_formData(obj)
*/
export const addFavoriteApi = formData => formDataRequest.post('/interface/WebMember/AddFavorite', formData);