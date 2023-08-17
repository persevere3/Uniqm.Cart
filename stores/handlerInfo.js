import { defineStore, storeToRefs } from 'pinia'

import { useCommon }  from '@/stores/common/common'
import { useInfo}  from '@/stores/info'
import { useUser }  from '@/stores/user'
import { useOrder }  from '@/stores/order'
import { useVerify }  from '@/stores/cross/verify'

import { getUser_infoApi, edit_infoApi, edit_passApi, getBonusApi, unbindLine_testApi } from '@/api/index';

export const useHandlerInfo = defineStore('handlerInfo', () => {
  // store ==================================================
  let { site, user_account, store, payModal_message, is_payModal } = storeToRefs(useCommon())
  let { login, check_logout, return_date } = useCommon()
  let { user_info, recommend_code, delivery_address, phone_barCode, natural_barCode,
    total_bonus, bonus
  } = storeToRefs(useInfo())
  let { r_name, r_mail, r_birthday, sex, r_phone2, r_recommender,
    o_password, r_password, r_confirm_password 
  } = storeToRefs(useUser())
  let { order_page_index, order_page_size, order_page_number, order_phone, order_mail } = storeToRefs(useOrder())
  let { verify } = useVerify()

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

            // 取得訂單 參數
            order_phone.value = user_info.value.Phone
            order_mail.value = user_info.value.Email
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
        for(let userIndex in userCart) {
          if(localCart[localIndex].ID === userCart[userIndex].ID) {
            userCart[userIndex] = localCart[localIndex]
            f = true;
          }
        }
        if(!f) {
          userCart[userCart.length] = localCart[localIndex]
        }
      }
      cart.value = [];
      userCart.forEach((item, index) => cart.value[index] = item)
      localStorage.setItem(`${site.value.Name}@${user_account.value}@cart`, JSON.stringify(cart.value));
    },

    async edit_info() {
      if(!verify(r_name.value, r_mail.value, r_birthday.value, r_phone2.value)) return
    
      // 手機驗證
      // if(store.value.NotificationSystem == 1 || store.value.NotificationSystem == 2) {
      //   if(!verify(r_phone_verify_code.value)) return
      // }

      // 刪除重複地址
      let address_arr = delivery_address.value
      for(let i = address_arr.length - 1; i > 0; i --) {
        for(let j = 0; j < i; j++) {
          if( address_arr[j].city == address_arr[i].city && 
            address_arr[j].district == address_arr[i].district && 
            address_arr[j].detail == address_arr[i].detail
          ) {
            address_arr.splice(i, 1);
            break;
          }
        }
      }
      
      let obj = {
        storeid: site.value.Name,
        phone: user_account.value,

        name: r_name.value.value,
        email: r_mail.value.value,
        phone2: r_phone2.value.value,
        gender: sex.value == 'male' ? 1 : 0 ,
        recommender: r_recommender.value.value,
      }

      // obj r_birthday
      obj["birthday"] = return_date(r_birthday.value.value)

      // obj 手機驗證
      // if(store.value.NotificationSystem == 1 || store.value.NotificationSystem == 2) {
      //   obj["validate"] = r_phone_verify_code.value.value
      // }

      // 
      let address_str = '';
      for(let item of address_arr) {
        address_str += `${item.id}_ _${item.city}_ _${item.district}_ _${item.detail}_#_`
      }
      obj["address"] = address_str
      obj["savePhoneCode"] = phone_barCode.value ? phone_barCode.value : ''
      obj["saveNatureCode"] = natural_barCode.value ? natural_barCode.value : ''
      obj["threeLinkCode"] = `${user_info.value.invoice_title}|${user_info.value.invoice_uniNumber}`

      let formData = return_formData(obj)
      try {
        let res = await edit_infoApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.edit_info();
          return
        }

        methods.getUser_info();
        payModal_message.value = res.data.msg;
        if(!res.data.status) check_logout()
        is_payModal.value = true;
      } catch (error) {
        throw new Error(error)
      }
    },
    async edit_pass() {
      if (!verify(o_password, r_password, r_confirm_password)) return
    
      let obj = {
        storeid: site.value.Name,
        phone: user_account.value,
        oldpassword: o_password.value.value,
        newpassword: r_password.value.value
      }
      let formData = return_formData(obj)
      try {
        let res = await edit_passApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.edit_pass();
          return
        }

        payModal_message.value = res.data.msg;
        if(!res.data.status) check_logout()
        is_payModal.value = true;
      } catch (error) {
        throw new Error(error)
      }
    },

    async getBonus(type) {
      await methods.getUser_info()

      if(!type) order_page_index.value = 1
      let obj = {
        storeid: site.value.Name,
        storename: site.value.Store,
        phone: user_account.value,
        recommander: recommend_code.value,
        pageindex: order_page_index.value,
        pagesize: order_page_size.value,
      }
      let formData = return_formData(obj)

      try {
        let res = await getBonusApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.getBonus(type);
          return
        }

        if(res.data.status) {
          let data = res.data.datas[0] || {}
  
          order_page_number.value = Math.ceil(data.Count / order_page_size.value);
          if(order_page_number.value == 0) {
            payModal_message.value = '沒有您的購物金紀錄';
            is_payModal.value = true;
            bonus.value = null;
            return;
          }
          else {
            total_bonus.value = data.Total;
            bonus.value = data.Bonuses;
            bonus.value.forEach((item) => {
              if(item.Type.indexOf('使用點數') > -1) {
                item.FeedBack = -item.FeedBack;
              }
            })
          }
        } else {
          payModal_message.value = res.data.msg;
          check_logout();
          is_payModal.value = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    async unbindLine_test() {
      let isConfim = confirm('確定解除Line綁定嗎？');
      if(!isConfim) return

      let obj = {
        storeid: site.value.Name,
        phone: user_account.value
      }
      let formData = return_formData(obj)

      try {
        let res = await unbindLine_testApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.unbindLine_test();
          return
        }

        methods.getUser_info()
      } catch (error) {
        throw new Error(error)
      }
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})