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
        urlPush('/error.html');
      }

      methods.getAllHandler();
      methods.getStoreHandler();
      getCopyRight();
      getCustomerService();
      getCart();

      let pathname = '';

      // order
      if (pathname === '/order.html' || pathname === '/shoppingOrder.html') {

        let RtnMsg = location.href.split('RtnMsg=')[1] &&
        location.href.split('RtnMsg=')[1].split('&')[0];
        if(RtnMsg) {
          vm.payModal_message = '已收到您的付款';
          vm.is_payModal = true;
        }

        // Line 登入
        let account = location.search.split('account=')[1] && 
        location.search.split('account=')[1].split('&')[0];
        if(account) {
          vm.user_account = account
          localStorage.setItem('user_account', vm.user_account)
        }

        // Line 綁定
        let result = location.search.split('result=')[1] && 
        location.search.split('result=')[1].split('&')[0];
        if(result) {
          result = JSON.parse(decodeURI(result))
          if(!result.status) alert(result.msg)
          else {
            vm.user_account = result.account
            localStorage.setItem('user_account', vm.user_account)
          }
        }

        if(vm.user_account) {
          await vm.getUser_info();
          vm.order_phone = vm.user_info.Phone;
          vm.order_mail = vm.user_info.Email;
          vm.getMemberOrder();
        } else {
          let phone = location.href.split('phone=')[1] && 
          location.href.split('phone=')[1].split('&')[0];
          let email = location.href.split('email=')[1] && 
          location.href.split('email=')[1].split('&')[0];

          if(phone && email) {
            vm.order_phone = phone;
            vm.order_mail = email;
            vm.getOrder();
          }
        }

        window.history.replaceState({}, document.title, vm.getPathname('order'));
      }

      // user
      if (pathname === '/user.html' || pathname === '/shoppingUser.html') {
        if(!(vm.site.MemberFuction * 1)){
          vm.urlPush(vm.getPathname('index'));
        }
        if(vm.user_account){
          vm.urlPush(vm.getPathname('info'));
        }

        if( vm.site.TermsNotices && location.search.split('?term=')[1]){
          vm.user_nav_active = 'register';
          vm.is_userModal = true;
        }

        vm.LineToken = location.href.split('code=')[1] && 
                      location.href.split('code=')[1].split('&')[0];       
        if(vm.LineToken) {
          window.history.replaceState({}, document.title, vm.getPathname('user'));
          vm.getLineProfile();
        }
      }

      // user_info
      if (pathname === '/user_info.html' || pathname === '/shoppingInfo.html') {
        // 沒有開啟會員功能
        if(!(vm.site.MemberFuction * 1)) {
          vm.urlPush(vm.getPathname('index'));
        }

        // Line 登入
        let account = location.search.split('account=')[1] && 
        location.search.split('account=')[1].split('&')[0];
        if(account) {
          vm.user_account = account
          localStorage.setItem('user_account', vm.user_account)
        }

        // Line 綁定
        let result = location.search.split('result=')[1] && 
        location.search.split('result=')[1].split('&')[0];
        if(result) {
          result = JSON.parse(decodeURI(result))
          if(!result.status) alert(result.msg)
          else {
            vm.user_account = result.account
            localStorage.setItem('user_account', vm.user_account)
          }
        }

        //
        if(vm.user_account) {
          await vm.getUser_info();

          let RtnMsg = location.href.split('RtnMsg=')[1] && 
          location.href.split('RtnMsg=')[1].split('&')[0];
          if(RtnMsg){
            vm.payModal_message = '已收到您的付款';
            vm.is_payModal = true;
          }

          let active_page = location.href.split('page=')[1] && 
          location.href.split('page=')[1].split('&')[0];
          if(active_page && active_page == 'order'){
            vm.user_info_nav_active = 'order'; 
            vm.getMemberOrder()
          }

          window.history.replaceState({}, document.title, vm.getPathname('info'));
        } else {
          vm.urlPush(vm.getPathname('user'));
        }
      }
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