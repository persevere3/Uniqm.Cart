// stores ========== ========== ========== ========== ==========
import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from './common'
import { useUser }  from './user'

// apis ========== ========== ========== ========== ==========
import { registerApi, user_loginApi, send_forget_verify_codeApi, 
  check_forget_verify_codeApi, edit_forget_passApi 
} from '@/apis/user';

// composables ========== ========== ========== ========== ==========
import { useVerify }  from '@/composables/verify'
import { useFormatDate } from '@/composables/formatDate'

export const useHandlerUser = defineStore('handlerUser', () => {
  // stores ========== ========== ========== ========== ==========
  let { site, store } = storeToRefs(useCommon())
  let { return_formData, getPathname, urlPush } = useCommon()
  let { user_nav_active, r_name, r_mail, r_mail_verify_code, r_phone_verify_code, r_birthday, 
    r_account, r_password, r_confirm_password, r_is_agree, l_account, l_password, 
    forget_step, mailOrAccount, f_mail , f_account , f_verify_code, f_second,
    f_password, f_confirm_password, is_userMessage, user_message
  } = storeToRefs(useUser())

  // composables ========== ========== ========== ========== ==========
  let { verify } = useVerify()

  // methods ========== ========== ========== ========== ==========
  const methods = {
    async register() {
      if(site.value.TermsNotices && !r_is_agree.value) return

      let verify_code = [];
      if(store.value.NotificationSystem == 0) verify_code.push(r_mail_verify_code.value)
      else if(store.value.NotificationSystem == 1) verify_code.push(r_phone_verify_code.value)
      else {
        verify_code.push(state.r_phone_verify_code)
        verify_code.push(state.r_mail_verify_code)
      }

      if (!verify(r_name.value, r_mail.value, ...verify_code, r_birthday.value, 
        r_account.value, r_password.value, r_confirm_password.value)
      ) return

      let obj = {
        storeid: site.value.Name,
        type: store.value.NotificationSystem,
        recommender: r_recommender.value.value,
        name: r_name.value.value,
        email: r_mail.value.value,
        gender: sex.value == 'male' ? 1 : 0 ,
        birthday: useFormatDate(r_birthday.value),
        phone: r_account.value.value,
        password: r_password.value.value,
      }
      if(store.value.NotificationSystem == 0) obj.validate2 = r_mail_verify_code.value.value
      else if(store.value.NotificationSystem == 1) obj.validate = r_phone_verify_code.value.value
      else {
        obj.validate = r_phone_verify_code.value.value
        obj.validate2 = r_mail_verify_code.value.value
      }
      let formData = return_formData(obj)

      try {
        let res = await registerApi(formData)
        if(res.data.errormessage) {
          await methods.login();
          methods.register();
          return
        }

        if(res.data.status) {
          l_account.value = r_account.value;
          l_password.value = r_password.value;
          methods.user_login();
        }
        else {
          user_message.value = res.data.msg
          is_userMessage.value = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async user_login() {
      if(!verify(l_account.value, l_password.value)) return

      let obj = {
        storeid: site.value.Name,
        phone: l_account.value.value,
        password: l_password.value.value,
        realAccount: l_account.value.value,
      }
      let formData = return_formData(obj)

      try {
        let res = await user_loginApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.user_login();
          return
        }

        if(res.data.status) {
          localStorage.setItem('user_account', l_account.value.value);
          user_account.value = l_account.value.value;

          urlPush(getPathname('info'));
        }
        else {
          user_message.value = '請確認您的帳號密碼後重新登入'
          is_userMessage.value = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async send_forget_verify_code() {
      if(f_second.value > 0) return
      if(store.value.NotificationSystem == 0 || (store.value.NotificationSystem == 2 && mailOrAccount.value == 0)) {
        if(!verify(f_mail.value)) return
      }
      else if(store.value.NotificationSystem == 1 || (store.value.NotificationSystem == 2 && mailOrAccount.value == 1)) {
        if(!verify(f_account.value)) return
      }

      let obj = {
        storeid: site.value.Name,
        storeName: site.value.Store,
        notificationsystem: store.value.NotificationSystem,
        phoneormail: methods.getPhoneOrMail()
      }
      let formData = return_formData(obj)

      try {
        let res = await send_forget_verify_codeApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.send_forget_verify_code();
          return
        }

        if(res.data.status) {
          methods.reset_input('f_verify_code');
          forget_step.value = 2;

          f_second.value = 300;
          let interval =  setInterval(() => {
            f_second.value -= 1;
            if(f_second.value < 1){
              clearInterval(interval);
            }
          }, 1000)
        } else {
          user_message.value = res.data.msg
          is_userMessage.value = true;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async check_forget_verify_code() {
      if(!verify(f_verify_code.value)) return

      let obj = {
        storeid: site.value.Name,
        phoneormail: methods.getPhoneOrMail(),
        validate: f_verify_code.value.value,
      }
      let formData = return_formData(obj)

      try {
        let res = await check_forget_verify_codeApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.check_forget_verify_code();
          return
        }

        user_message.value = res.data.msg
        is_userMessage.value = true;
        if(res.data.status) {
          methods.reset_input('f_password');
          methods.reset_input('f_confirm_password');
          forget_step.value = 3;
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async edit_forget_pass() {
      if (!verify(f_password.value, f_confirm_password.value)) return

      let obj = {
        storeid: site.value.Name,
        phoneormail: methods.getPhoneOrMail(),
        validate: f_verify_code.value.value,
        newpassword: f_password.value.value
      }
      let formData = return_formData(obj)

      try {
        let res = await edit_forget_passApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.edit_forget_pass();
          return
        }

        user_message.value = res.data.msg
        is_userMessage.value = true;
        if(res.data.status) {
          methods.reset_input('f_account');
          methods.reset_input('f_mail');
          methods.reset_input('f_verify_code');
          methods.reset_input('f_password');
          methods.reset_input('f_confirm_password');
          forget_step.value = 1;
          user_nav_active.value = 'login'
        }
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