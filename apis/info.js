import { formRequest, formDataRequest } from '@/utils/https'

/*
  getUserInfoApi

  let obj = {
    storeid: site.value.Name,
    phone: user_account.value
  }
  let formData = return_formData(obj)
*/
export const getUserInfoApi = formData => formDataRequest.post('/interface/WebMember/GetMemberInfo', formData);

/*
  edit_infoApi
  let obj = {
    storeid: site.value.Name,
    
    phone: user_account.value,
    phone2: r_phone2.value.value,
    email: r_mail.value.value,

    recommender: r_recommender.value.value,
    name: r_name.value.value,
    gender: sex.value == 'male' ? 1 : 0 ,
  }

  // obj r_birthday
  obj["birthday"] = return_date(r_birthday.value.value)

  // obj 手機驗證
  // if(store.value.NotificationSystem == 1 || store.value.NotificationSystem == 2) {
  //   obj["validate"] = r_phone_verify_code.value.value
  // }

  // address
  let address_str = '';
  for(let item of address_arr) {
    address_str += `${item.id}_ _${item.city}_ _${item.district}_ _${item.detail}_#_`
  }
  obj["address"] = address_str
  obj["savePhoneCode"] = phone_barCode.value ? phone_barCode.value : ''
  obj["saveNatureCode"] = natural_barCode.value ? natural_barCode.value : ''
  obj["threeLinkCode"] = `${user_info.value.invoice_title}|${user_info.value.invoice_uniNumber}`

  let formData = return_formData(obj)
*/
export const edit_infoApi = formData => formDataRequest.post('/interface/WebMember/EditMemberInfo', formData);

/*
  edit_passApi
  let obj = {
    storeid: site.value.Name,
    phone: user_account.value,
    oldpassword: o_password.value.value,
    newpassword: r_password.value.value
  }
  let formData = return_formData(obj)
*/
export const edit_passApi = formData => formDataRequest.post('/interface/WebMember/EditMemberPassWord', formData);

/*
  getBonusApi
  let obj = {
    storeid: site.value.Name,
    storename: site.value.Store,
    phone: user_account.value,
    recommander: recommend_code.value,
    pageindex: order_page_index.value,
    pagesize: order_page_size.value,
  }
  let formData = return_formData(obj)
*/
export const getBonusApi = formData => formDataRequest.post('/interface/Webmember/GetMemberBonusOrders', formData);

/*
  post_logoutApi
*/
export const post_logoutApi = params => formRequest.post('/interface/WebMember/MemberLogout', params);

/*
  unbindLine_testApi
  let obj = {
    storeid: site.value.Name,
    phone: user_account.value
  }
  let formData = return_formData(obj)
*/
export const unbindLine_testApi = formData => formDataRequest.post('/interface/WebMember/OldMemberDeleteLineIDAccount', formData);

/*
  deleteAccount_testApi
  let obj = {
    storeid: site.value.Name,
    phone: user_account.value
  }
  let formData = return_formData(obj)
*/
export const deleteAccount_testApi = formData => formDataRequest.post('/interface/WebMember/DeleteLineIDAccount', formData);