import { storeToRefs } from 'pinia'

// store
import { useCommon }  from '@/stores/common/common'
import { useHandlerCommon }  from '@/stores/handlerCommon'

export default defineNuxtRouteMiddleware(async(to, from) => {
  let { site, user_account } = storeToRefs(useCommon())
  let { getPathname, urlPush } = useCommon()
  let { getSiteHandler } = useHandlerCommon()

  console.log(to, from)

  if(!site.value) {
    site.value = JSON.parse(localStorage.getItem('site')) || null ;
    user_account.value = localStorage.getItem('user_account')
    await getSiteHandler()
  }
  if(!(site.value.MemberFuction * 1)) {
    urlPush(getPathname('index'));
  }

  const { account, result } = useRoute().query
  // Line 登入
  if(account) {
    user_account.value = account
    localStorage.setItem('user_account', user_account.value)
  }
  // Line 綁定
  if(result) {
    result = JSON.parse(decodeURI(result))
    if(!result.status) alert(result.msg)
    else {
      user_account.value = result.account
      localStorage.setItem('user_account', user_account.value)
    }
  }

  if(user_account.value) urlPush(getPathname('info'))
  else urlPush(getPathname('user'))
})