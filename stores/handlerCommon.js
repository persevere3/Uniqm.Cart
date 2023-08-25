import { defineStore, storeToRefs } from 'pinia'

import { useCommon }  from '@/stores/common/common'
import { useUser }  from '@/stores/user'
import { useVerify }  from '@/stores/cross/verify'

import { send_verify_codeApi } from '@/api/index';

export const useHandlerCommon = defineStore('handlerCommon', () => {
  // store ==================================================
  let { site, is_getSite, store, all, is_getAll, 
    totalpage_num, perpage_num, demoOrigin, webVersion 
  } = storeToRefs(useCommon())
  let { return_formData, getSite, getAll, getStore, getCopyRight, getCustomerService, 
    getCart, getFavorite, appendScript, urlPush 
  } = useCommon()
  let { second, r_mail, r_account, user_message, is_userMessage } = storeToRefs(useUser())
  let { verify  } = useVerify()


  // methods ==================================================
  const methods = {
    async getSiteHandler() {
      await getSite()
      if(site.value.WebEnable == 0) urlPush('/error')

      is_getSite.value = true

      methods.getAllHandler();
      methods.getStoreHandler();
      getCopyRight();
      getCustomerService();
      getCart();
    },

    async getAllHandler() {
      await getAll()
      console.log(toRaw(all.value))

      totalpage_num.value = Math.ceil(all.value.data.length / perpage_num.value);
          
      // webcategory, websubcategory => navbar
      let navbar = [];
      all.value.webcategory.forEach(category => {
        let link;
        // category.Class 0: all category rich, 1: contact, 2: 外部連結, 3: 自訂義
        if(category.Class === '1') link = '/contact'
        else if(category.Class === '2') link = category.Text
        else if(category.Class === '3') link = `/rich?id=${category.ID}&cid=3`

        category.Link = link;
        category.isDropDown = false;
        navbar.push(category);
      })
      all.value.websubcategory.forEach(category => {
        let link;
        //category.Class 0: all, 1: category, 2: rich, 3: rich(footer)
        if(category.Class === '3') link = `/rich?id=${category.CategoryID}&cid=1`
        else if(category.Class === '2') link = `/rich?id=${category.ID}&cid=0`
        else if(category.Class === '1') link = `/category?id=${category.ID}`
        else link = `/allProducts?id=${category.ID}`

        category.Link = link;

        let nav = navbar.find(nav => nav.ID == category.Category)
        if(nav) {
          if(!nav.subNavbar) nav.subNavbar = [];
          nav.subNavbar.push(category);
        }
      })
      all.value.Navbar = navbar;

      // footer => about, client
      all.value.about = [];
      all.value.client = [];

      all.value.footer.forEach(item => {
        if(item.CID == 1) {
          item.Link = `/rich?id=${item.ID}&cid=1`;
          all.value.about.push(item);
        }
        else if(item.CID == 2) {
          item.Link = `/rich?id=${item.ID}&cid=2`;
          all.value.client.push(item);
        }
      })
      if(webVersion.value === 'demo') {
        all.value.data.forEach(item => {
          item.Img1 = demoOrigin.value + item.Img1
        })
      }

      is_getAll.value = true

      getFavorite();
    },

    async getStoreHandler() {
      await getStore()

      // title
      document.title = store.value.Name
      if(site.value.WebPreview == 2)  document.title += ' (預覽模式)'

      // GA
      let GAText = store.value.GA;
      if(GAText.indexOf('GTM-') > -1) {
        let GTMID = GAText.split('GTM-')[1].split('\')')[0]

        let noscript = document.createElement('noscript');
        noscript.setAttribute('src', `https://www.googletagmanager.com/ns.html?id=GTM-${GTMID}`);
        noscript.setAttribute('height', '0');
        noscript.setAttribute('width', '0');
        noscript.setAttribute('style', 'display:none; visibility:hidden');

        document.querySelector('body').insertBefore(noscript, document.querySelector('body div'));
      }
      // appendScript(GAText, 'head');
    },

    // user info ========================================
    async send_verify_code() {
      if(second.value > 0) return

      if(store.value.NotificationSystem == 0) {
        if(!verify(r_mail.value)) return
      }
      else if(store.value.NotificationSystem == 1) {
        if(!verify(r_account.value)) return
      }
      else {
        if(!verify(r_account.value) || !verify(r_mail.value) ) return
      }

      let obj = {
        storeid: site.value.Name,
        storeName: site.value.Store,
        phone: r_account.value.value.trim(),
        mail: r_mail.value.value.trim(),
        type: store.value.NotificationSystem,
        notificationsystem: store.value.NotificationSystem,
      }
      let formData = return_formData(obj)
      try {
        let res = await send_verify_codeApi(formData)
        if(res.data.errormessage) {
          await methods.login();
          send_verify_code();
          return
        }

        if(res.data.status) {
          second.value = 300;
          let interval =  setInterval(() => {
            second.value -= 1;
            if(second.value < 1){
              clearInterval(interval);
            }
          }, 1000)
        }
        user_message.value = res.data.msg
        is_userMessage.value = true;
      } catch (error) {
        throw new Error(error)
      }
    },
  }

  return {
    ...methods
  }
})