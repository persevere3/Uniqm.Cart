import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

import {  } from '@/api/index';

export const useHandlerCommon = defineStore('handlerCommon', () => {
  // store ==================================================
  let { site, is_getSite, store, user_account, all, is_getAll, totalpage_num, perpage_num, footer_community, webVersion } = storeToRefs(useCommon())
  let { getSite, getAll, getStore, getCopyRight, getCustomerService, getCart, getFavorite, appendScript, urlPush } = useCommon()

  // state ==================================================
  const state = reactive({
    
  })

  // methods ==================================================
  const methods = {
    async getSiteHandler() {
      await getSite()

      is_getSite.value = true

      if(site.value.WebEnable == 0) {
        urlPush('/error');
      }

      methods.getAllHandler();
      methods.getStoreHandler();
      getCopyRight();
      getCustomerService();
      getCart();
    },

    async getAllHandler() {
      await getAll()

      totalpage_num.value = Math.ceil(all.value.data.length / perpage_num.value);
          
      // webcategory, websubcategory => navbar
      let navbar = [];
      all.value.webcategory.forEach(category => {
        let link;
        // category.Class 0: all category rich, 1: contact, 2: 外部連結, 3: 自訂義
        if(category.Class === '1') link = '/contact'
        else if(category.Class === '2') link = category.Text
        else if(category.Class === '3') link = `/rich?id=${category.ID}&cid=3`

        if(state.webVersion === 'demo') {
          if(category.Class === '1' || category.Class === '3') {
            link = 'https://demo.uniqcarttest.com' + link
          }
        }

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

        if(state.webVersion === 'demo') {
          link = 'https://demo.uniqcarttest.com' + link
        }

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
          item.Img1 = 'https://demo.uniqcarttest.com' + item.Img1
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
  }

  return {
    ...toRefs(state),

    ...methods
  }
})