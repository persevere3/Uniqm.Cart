import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

import { getUser_infoApi, edit_infoApi, edit_passApi, getBonusApi, 
  post_logoutApi, unbindLine_testApi, deleteAccount_testApi
} from '@/api/index';


export const useInfo = defineStore('info', () => {
  // store ==================================================
  let { site, store, user_account } = storeToRefs(useCommon())
  let { login, check_logout, getFormData, urlPush } = useCommon()

  // state ==================================================
  const state = reactive({
    user_info: {},
    user_info_nav_active: 'info',

    recommend_code: '',

    delivery_address: [],
    address_select_active: '',

    total_bonus: 0,
    bonus: [],
  })

  // methods ==================================================
  const methods = {
    async getUser_info() {
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
            state.user_info = res.data.datas[0][0];
  
            methods.login_handle_carts();
  
            state.r_name.value = state.user_info.Name
            state.r_mail.value = state.user_info.Email
            state.r_birthday.value = state.user_info.Birthday ? new Date(state.user_info.Birthday) : ''
            state.sex = state.user_info.Gender == 1 ? 'male' : 'female' 
            state.r_phone2.value = state.user_info.Phone2
            state.recommend_code = state.user_info.Promocode
            state.r_recommender.value = state.user_info.Recommender
            state.total_bonus = state.user_info.Wallet * 1
  
            let result_arr = [];
            let address_arr = state.user_info.Adress.split('_#_');
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
            state.delivery_address = result_arr;
  
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
      let carts = JSON.parse(localStorage.getItem(`${site.value.Name}@${user_account.value}@carts`)) || [];
      let localCarts = JSON.parse(localStorage.getItem(`${site.value.Name}@carts`)) || [];
      for(let localIndex in localCarts) {
        let f = false;
        for(let cartsIndex in carts) {
          if(localCarts[localIndex].ID === carts[cartsIndex].ID) {
            carts[cartsIndex] = localCarts[localIndex]
            f = true;
          }
        }
        if(!f) {
          carts[carts.length] = localCarts[localIndex]
        }
      }
      state.carts = [];
      carts.forEach((item, index) => vm.carts[index] = item)
      localStorage.setItem(`${site.value.Name}@${user_account.value}@carts`, JSON.stringify(state.carts));
    },
    
    add_address() {
      let id = new Date().getTime();
      if (state.delivery_address.length > 2) return
      state.delivery_address.push({
        id,
        city: '',
        district: '',
        detail: '',
        rules: {
          required: {
            message: '請輸入完整地址'
          },
        },
        is_error: false,
        message: '',
      })
    },
    delete_address(id) {
      state.delivery_address = state.delivery_address.filter(address => address.id != id)
    },

    async edit_info() {
      let arr = state.delivery_address
      for(let i = arr.length - 1; i > 0; i --) {
        for( let j = 0; j < i; j++) {
          if(arr[j].city == arr[i].city && arr[j].district == arr[i].district && arr[j].detail == arr[i].detail){
            arr.splice(i, 1);
            break;
          }
        }
      }
    
      if(store.value.NotificationSystem == 1 || store.value.NotificationSystem == 2) {
        if(!verify(state.verify_code)) return
      }
      if(!verify(state.r_name, state.r_mail, state.r_birthday, state.r_phone2, ...arr)) return
      
      let b = state.r_birthday.value;
      let birthday = `${b.getFullYear()}/${b.getMonth() + 1 < 10  ? '0' : '' }${b.getMonth() + 1}/${b.getDate() < 10  ? '0' : '' }${b.getDate()}`
      let address_str = '';
      for(let item of arr) {
        address_str += `${item.id}_ _${item.city}_ _${item.district}_ _${item.detail}_#_`
      }
      let obj = {
        storeid: site.value.Name,
        phone: user_account.value,
        phone2: state.r_phone2.value,
        email: state.r_mail.value,
        name: state.r_name.value,
        birthday: birthday,
        gender: state.sex == 'male' ? 1 : 0 ,
        address: address_str,
        recommender: state.r_recommender.value,
      }
      if(store.value.NotificationSystem == 1 || store.value.NotificationSystem == 2) {
        obj.validate = state.verify_code.value
      }
      let formData = getFormData(obj)

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
      if (!verify(state.o_password, state.r_password, state.r_confirm_password)) return
    
      let obj = {
        storeid: site.value.Name,
        phone: user_account.value,
        oldpassword: state.o_password.value,
        newpassword: state.r_password.value
      }
      let formData = getFormData(obj)

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

      if(!type) state.order_page_index = 1
      let obj = {
        storeid: this.site.Name,
        storename: this.site.Store,
        phone: this.user_account,
        recommander: this.recommend_code,
        pageindex: this.order_page_index,
        pagesize: this.order_page_size,
      }
      let formData = getFormData(obj)

      try {
        let res = await getBonusApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.getBonus();
          return
        }

        if(res.data.status) {
          let data = res.data.datas[0]
  
          order_page_number.value = Math.ceil(data.Count / order_page_size.value);
          if(order_page_number.value == 0) {
            payModal_message.value = '沒有您的購物金紀錄';
            is_payModal.value = true;
            state.bonus = null;
            return;
          }
          else {
            state.total_bonus = data.Total;
            state.bonus = data.Bonuses;
            state.bonus.forEach((item) => {
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
    
    async post_logout() {
      try {
        let res = await post_logoutApi()
        if(res.data.errormessage) {
          await login();
          methods.post_logout();
          return
        }

        logout()
      } catch (error) {
        throw new Error(error)
      }
    },
    logout() {
      user_account.value = ''
      localStorage.removeItem('user_account')
      urlPush(getPathname('user'))
    },
    
    //
    bindLine() {
      urlPush(`${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${site.value.Name}&site=${site.value.Site}&phone=${user_account.value}`)
    },

    async unbindLine_test() {
      let isConfim = confirm('確定解除Line綁定嗎？');
      if(!isConfim) return

      let obj = {
        storeid: site.value.Name,
        phone: user_account.value
      }
      let formData = getFormData(obj)

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
    async deleteAccount_test() {
      let isConfim = confirm('確定刪除帳號嗎？')
      if(!isConfim) return

      let obj = {
        storeid: site.value.Name,
        phone: user_account.value
      }
      let formData = getFormData(obj)

      try {
        let res = await deleteAccount_testApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.deleteAccount_test();
          return
        }

        state.logout();
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