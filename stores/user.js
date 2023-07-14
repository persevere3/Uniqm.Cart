import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'
import { useVerify }  from '@/stores/cross/verify'

import { registerApi, user_loginApi, send_forget_verify_codeApi, check_forget_verify_codeApi, 
  edit_forget_passApi, getLineProfileApi, validateRecommenderCodeApi } from '@/api/index';


export const useUser = defineStore('user', () => {
  // store ==================================================
  let { site, store, user_account } = storeToRefs(useCommon())
  let { login, getFormData, getPathname, urlPush } = useCommon()
  let { verify } = useVerify()

  // state ==================================================
  const state = reactive({
    // user info
    r_recommender:{
      value: '',
      rules: {
      },
    },
    r_name: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
      },
      is_error: false,
      message: '',
    },
    r_mail: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        mail: {
          message: 'email格式不符',
        }
      },
      is_error: false,
      message: '',
    },
    r_verify_code2: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 6,
          max: 6,
          message: '驗證碼為6位',
        }
      },
      is_error: false,
      message: '',
    },
    r_birthday: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
      },
      is_error: false,
      message: '',
    },
    sex: 'male',
    // user
    r_account: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        cellphone: {
          message: '手機格式錯誤'
        }
      },
      is_error: false,
      message: '',
    },
    second: 0,

    // info
    r_phone2: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        cellphone: {
          message: '手機格式錯誤'
        }
      },
      is_error: false,
      message: '',
    },
    r_verify_code: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 6,
          max: 6,
          message: '驗證碼為6位',
        }
      },
      is_error: false,
      message: '',
    },

    // info
    o_password: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 8,
          message: '不得少於8位',
        }
      },
      is_error: false,
      message: '',
    },
    o_password_type: 'password',

    //
    r_password: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 8,
          message: '不得少於8位',
        }
      },
      is_error: false,
      message: '',
    },
    r_confirm_password: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        confirm: {
          password: 'r_password',
          message: '密碼不正確',
        }
      },
      is_error: false,
      message: '',
    },
    r_password_type: 'password',
    r_confirm_password_type: 'password',

    // user
    r_is_agree: false,

    l_account: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
      },
      is_error: false,
      message: '',
    },
    l_password: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 8,
          message: '不得少於8位',
        }
      },
      is_error: false,
      message: '',
    },
    l_password_type: 'password',

    forget_step: 1,
    mailOrAccount: 0,
    f_account: {
      value: '',
      rules: {
        cellphone: {
          message: '手機格式錯誤'
        }
      },
      is_error: false,
      message: '',
    },
    f_mail: {
      value: '',
      rules: {
        mail: {
          message: 'email格式不符',
        }
      },
      is_error: false,
      message: '',
    },
    f_verify_code: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 6,
          max: 6,
          message: '驗證碼為6位',
        }
      },
      is_error: false,
      message: '',
    },
    f_second: 0,
    f_password: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        length: {
          min: 8,
          message: '不得少於8位',
        }
      },
      is_error: false,
      message: '',
    },
    f_confirm_password: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
        confirm: {
          password: 'f_password',
          message: '密碼不正確',
        }
      },
      is_error: false,
      message: '',
    },
    f_password_type: 'password',
    f_confirm_password_type: 'password',

    user_nav_active: 'login',

    LineToken: '',

    is_LineRegister: false,

    is_userModal: false,

    is_userMessage: false,
    user_message: '',
  })

  // methods ==================================================
  const methods = {
    async register() {
      if(site.value.TermsNotices && !state.r_is_agree) return

      let verify_code = [];
      if(store.value.NotificationSystem == 0) verify_code.push(state.r_verify_code2)
      else if(store.value.NotificationSystem == 1) verify_code.push(state.r_verify_code)
      else {
        verify_code.push(state.r_verify_code)
        verify_code.push(state.r_verify_code2)
      }

      if (!verify(state.r_name, state.r_mail, state.r_birthday, state.r_account, 
        ...verify_code, state.r_password, state.r_confirm_password)
      ) return

      let b = state.r_birthday.value
      let birthday = `${b.getFullYear()}/${b.getMonth() + 1 < 10  ? '0' : '' }${b.getMonth() + 1}/${b.getDate() < 10  ? '0' : '' }${b.getDate()}`
      let obj = {
        storeid: site.value.Name,
        type: store.value.NotificationSystem,
        phone: state.r_account.value,
        email: state.r_mail.value,
        password: state.r_password.value,
        name: state.r_name.value,
        gender: state.sex == 'male' ? 1 : 0 ,
        birthday,
        recommender: state.r_recommender.value,
      }
      if(store.value.NotificationSystem == 0) obj.validate2 = state.r_verify_code2.value
      else if(store.value.NotificationSystem == 1) obj.validate = state.r_verify_code.value
      else {
        obj.validate = state.r_verify_code.value
        obj.validate2 = state.r_verify_code2.value
      }
      let formData = getFormData(obj)

      try {
        let res = await registerApi(formData)
        if(res.data.errormessage) {
          await methods.login();
          methods.register();
          return
        }

        if(res.data.status) {
          state.l_account.value = state.r_account.value;
          state.l_password.value = state.r_password.value;
          methods.user_login();
        }
        else {
          state.user_message = res.data.msg
          state.is_userMessage = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async user_login() {
      if(!verify(state.l_account, state.l_password)) return

      let obj = {
        storeid: site.value.Name,
        phone: state.l_account.value,
        password: state.l_password.value,
        realAccount: state.l_account.value,
      }
      let formData = getFormData(obj)

      try {
        let res = await user_loginApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.user_login();
          return
        }

        if(res.data.status) {
          localStorage.setItem('user_account', state.l_account.value);
          user_account.value = state.l_account.value;

          urlPush(getPathname('info'));
        }
        else {
          state.user_message = '請確認您的帳號密碼後重新登入'
          state.is_userMessage = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async send_forget_verify_code() {
      if(state.f_second > 0) return
      if(store.value.NotificationSystem == 0 || (store.value.NotificationSystem == 2 && state.mailOrAccount == 0)) {
        if(!verify(state.f_mail)) return
      }
      else if(store.value.NotificationSystem == 1 || (store.value.NotificationSystem == 2 && state.mailOrAccount == 1)) {
        if(!verify(state.f_account)) return
      }

      let obj = {
        storeid: site.value.Name,
        storeName: site.value.Store,
        notificationsystem: store.value.NotificationSystem,
        phoneormail: methods.getPhoneormail()
      }
      let formData = getFormData(obj)

      try {
        let res = await send_forget_verify_codeApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.send_forget_verify_code();
          return
        }

        if(res.data.status) {
          methods.reset_input('f_verify_code');
          state.forget_step = 2;

          state.f_second = 300;
          let interval =  setInterval(() => {
            state.f_second -= 1;
            if(state.f_second < 1){
              clearInterval(interval);
            }
          }, 1000)
        } else {
          state.user_message = res.data.msg
          state.is_userMessage = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async check_forget_verify_code() {
      if(!verify(state.f_verify_code)) return

      let obj = {
        storeid: site.value.Name,
        phoneormail: methods.getPhoneormail(),
        validate: state.f_verify_code.value,
      }
      let formData = getFormData(obj)

      try {
        let res = await check_forget_verify_codeApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.check_forget_verify_code();
          return
        }

        state.user_message = res.data.msg
        state.is_userMessage = true;
        if(res.data.status) {
          methods.reset_input('f_password');
          methods.reset_input('f_confirm_password');
          state.forget_step = 3;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async edit_forget_pass() {
      if (!verify(state.f_password, state.f_confirm_password)) return

      let obj = {
        storeid: site.value.Name,
        phoneormail: methods.getPhoneormail(),
        validate: state.f_verify_code.value,
        newpassword: state.f_password.value
      }
      let formData = getFormData(obj)

      try {
        let res = await edit_forget_passApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.edit_forget_pass();
          return
        }

        state.user_message = res.data.msg
        state.is_userMessage = true;
        if(res.data.status) {
          methods.reset_input('f_account');
          methods.reset_input('f_mail');
          methods.reset_input('f_verify_code');
          methods.reset_input('f_password');
          methods.reset_input('f_confirm_password');
          state.forget_step = 1;
          state.user_nav_active = 'login'
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    getPhoneormail() {
      if(store.value.NotificationSystem == 0) return state.f_mail.value.trim()
      else if(store.value.NotificationSystem == 1) return state.f_account.value.trim() 
      else return state.mailOrAccount == 0 ? state.f_mail.value.trim() : state.f_account.value.trim()
    },
    reset_input(name) {
      state[name].value = '';
      state[name].is_error = false;
      state[name].message = '';
    },

    async getLineProfile() {
      try {
        let res = await getLineProfileApi(state.LineToken)
        if(res.data.errormessage) {
          await login();
          methods.getLineProfile();
          return
        }

        console.log(res.data);
      } catch (error) {
        throw new Error(error)
      }
    },
    async validateRecommenderCode() {
      if(!state.r_recommender.value) {
        LineLogin(true)
        return
      }

      let obj = {
        storeid: site.value.Name,
        recommender: state.r_recommender.value,
      }
      let formData = getFormData(obj)

      try {
        let res = await validateRecommenderCodeApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.validateRecommenderCode();
          return
        }

        alert(res.data.msg)
        if(res.data.status) LineLogin(true)

      } catch (error) {
        throw new Error(error)
      }
    },
    LineLogin(isRegister) {
      urlPush(`${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${site.value.Name}&site=${site.value.Site}${isRegister ? `&recommender=${state.r_recommender.value}&method=Register` : ''}`)
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})