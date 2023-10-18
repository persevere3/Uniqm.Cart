// stores ========== ========== ========== ========== ==========
import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

// apis ========== ========== ========== ========== ==========
import { post_logoutApi, deleteAccount_testApi } from '@/apis/info';

export const useInfo = defineStore('info', () => {
  // stores ========== ========== ========== ========== ==========
  let { site, user_account } = storeToRefs(useCommon())
  let { return_formData, login, getPathname, urlPush } = useCommon()

  // state ========== ========== ========== ========== ==========
  const state = reactive({
    user_info: {},
    user_info_nav_active: 'info',

    phone_barCode: '',
    natural_barCode: '',

    recommend_code: '',

    delivery_address: [],
    address_select_active: '',

    total_bonus: 0,
    bonus: [],
  })

  // methods ========== ========== ========== ========== ==========
  const methods = {
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
      urlPush(`${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${site.value.Name}&site=${site.value.Site}&phone=${user_account.value}&method=LineRegister`)
    },

    async deleteAccount_test() {
      let isConfim = confirm('確定刪除帳號嗎？')
      if(!isConfim) return

      let obj = {
        storeid: site.value.Name,
        phone: user_account.value
      }
      let formData = return_formData(obj)

      try {
        let res = await deleteAccount_testApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.deleteAccount_test();
          return
        }

        methods.logout();
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