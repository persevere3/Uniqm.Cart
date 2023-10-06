import { storeToRefs } from 'pinia'

// store
import { useCommon }  from '@/stores/common/common'

import { useRoute } from 'vue-router'

export function useAuth () { 
  let { user_account } = storeToRefs(useCommon())

  const { account, result } = useRoute().query

  if (process.browser) {
    user_account.value = localStorage.getItem('user_account') || ''

    if(account) { // Line 登入
      user_account.value = account
      localStorage.setItem('user_account', user_account.value)
    }
    if(result) { // Line 綁定
      result = JSON.parse(decodeURI(result))
      if(!result.status) alert(result.msg)
      else {
        user_account.value = result.account
        localStorage.setItem('user_account', user_account.value)
      }
    }

    if(user_account.value) return true
  }

  return false
}