import { defineStore, storeToRefs } from 'pinia'

import { useCommon }  from '@/stores/common/common'
import { useInfo}  from '@/stores/info'
import { useUser }  from '@/stores/user'

import { getUser_infoApi } from '@/api/index';

export const useHandlerCommon = defineStore('handlerCommon', () => {
  // store ==================================================
  let { site, user_account, payModal_message, is_payModal } = storeToRefs(useCommon())
  let { login, check_logout } = useCommon()
  let { user_info, recommend_code, total_bonus, delivery_address, phone_barCode, natural_barCode } = storeToRefs(useInfo())
  let { r_name, r_mail, r_birthday, sex, r_phone2, r_recommender } = storeToRefs(useUser())


  // methods ==================================================
  const methods = {
    getUser_info() {
      return new Promise(async(resolve, reject) => {
        let formData = new FormData();
        formData.append("storeid", site.value.Name);
        formData.append("phone", user_account.value);
  
        try {
          let res = await getUser_infoApi(formData)
          if(res.data.errormessage) {
            await login();
            methods.getUser_info();
            return
          }

          if(res.data.status) {
            user_info.value = res.data.datas[0][0] || {};
            
            user_info.value.ThreeLinkCode = user_info.value.ThreeLinkCode || ''
            user_info.value.invoice_title = user_info.value.ThreeLinkCode.split('|')[0] || ''
            user_info.value.invoice_uniNumber = user_info.value.ThreeLinkCode.split('|')[1] || ''
  
            methods.login_handle_carts();
  
            r_name.value.value = user_info.value.Name
            r_mail.value.value = user_info.value.Email
            r_birthday.value.value = user_info.value.Birthday ? new Date(user_info.value.Birthday) : ''
            sex.value = user_info.value.Gender == 1 ? 'male' : 'female' 
            r_phone2.value.value = user_info.value.Phone2
            recommend_code.value = user_info.value.Promocode
            r_recommender.value.value = user_info.value.Recommender
  
            let result_arr = [];
            user_info.value.Adress = decodeURI(user_info.value.Adress)
            let address_arr = user_info.value.Adress.split('_#_');
            address_arr.length = address_arr.length - 1;
            for(let address of address_arr) {
              let item = address.split('_ _');
              result_arr.push({
                id: item[0],
                city: item[1],
                district: item[2],
                detail: item[3],
                rules: {
                  required: {
                    message: '請輸入完整地址'
                  },
                },
                is_error: false,
                message: '',
              })
            }
            delivery_address.value = result_arr;

            phone_barCode.value = user_info.value.PhoneCode
            natural_barCode.value = user_info.value.NatureCode

            total_bonus.value = user_info.value.Wallet * 1
          } else {
            payModal_message.value = res.data.msg;
            check_logout();
            is_payModal.value = true;
          }

          resolve();
        } catch (error) {
          throw new Error(error)
        }
      })
    },
    login_handle_carts() {
      let userCart = JSON.parse(localStorage.getItem(`${site.value.Name}@${user_account.value}@cart`)) || [];
      let localCart = JSON.parse(localStorage.getItem(`${site.value.Name}@cart`)) || [];
      for(let localIndex in localCart) {
        let f = false;
        for(let cartsIndex in userCart) {
          if(localCart[localIndex].ID === userCart[cartsIndex].ID) {
            userCart[cartsIndex] = localCart[localIndex]
            f = true;
          }
        }
        if(!f) {
          userCart[cart.length] = localCart[localIndex]
        }
      }
      cart.value = [];
      userCart.forEach((item, index) => cart.value[index] = item)
      localStorage.setItem(`${site.value.Name}@${user_account.value}@cart`, JSON.stringify(userCart.value));
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})