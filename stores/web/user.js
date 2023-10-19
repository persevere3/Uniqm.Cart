// stores ========== ========== ========== ========== ==========
import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from './common'

// router ========== ========== ========== ========== ==========
import { useRoute } from 'vue-router'

// apis ========== ========== ========== ========== ==========
import { getLineProfileApi, validateRecommenderCodeApi } from '@/apis/user';

export const useUser = defineStore('user', () => {
  // stores ========== ========== ========== ========== ==========
  let { site, store } = storeToRefs(useCommon())
  let { return_formData, login, urlPush } = useCommon()

  // state ========== ========== ========== ========== ==========
  const state = reactive({
    user_nav_active: 'login',

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
        name: {
          message: '請輸入全中文或全英文'
        },
        nameLength: {
          message: '中文長度請介於2~5，英文長度請介於4~10'
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
    r_mail_verify_code: {
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
    r_phone_verify_code: {
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
    second: 0,
    sex: 'male',
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
    r_password_type: 'password',
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
    r_confirm_password_type: 'password',
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

    forget_step: 1,
    mailOrAccount: 0,
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
    f_password_type: 'password',
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
    f_confirm_password_type: 'password',

    // getLineProfile
    LineToken: useRoute().query.code,

    is_LineRegister: false,

    is_userModal: false,

    is_userMessage: false,
    user_message: '',
  })

  // methods ========== ========== ========== ========== ==========
  const methods = {
    getPhoneOrMail() {
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
      let formData = return_formData(obj)

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