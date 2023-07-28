import { defineStore, storeToRefs } from 'pinia'
import { loginApi, getSiteApi, getAllApi, getStoreApi, getCopyRightApi, getCustomerServiceApi,
  getFavoriteApi, deleteFavoriteApi, addFavoriteApi } from '@/api/index';

import { useFilters }  from '../cross/filters'

import bank_json from '@/json/bank'
import city_district_json from '@/json/city_district.json'

export const useCommon = defineStore('common', () => {
  // state ==================================================
  const state = reactive({
    site: {},
    user_account: '',
    all: {},
    store: {},
    footer_community: {},
    copyRight: {},
    customerService: {},
    pathname: useRoute.name,

    is_getSite: false,
    is_getAll: false,

    cart: [],
    favorite: {},
    is_carts_active: false,
    is_favorite_active: false,

    // 
    bank: bank_json,
    city_district: city_district_json,

    // index, search page
    perpage_num: 8,
    totalpage_num: 0,
    page_active: 1,

    //
    is_logout: null,

    //
    payModal_message: '',
    is_payModal: false,

    //
    messageArr: [],

    //
    demoOrigin: 'https://demo.uniqcarttest.com',
    webVersion: 'demo',


    //
    testData: '',
  })

  onMounted(() => {
    if(document.querySelector('.header')) {
      document.querySelector('body').style['padding-top'] = document.querySelector('.header').getBoundingClientRect().height + 'px';
    }

    
  })

  // methods ==================================================
  const methods = {
    ...useFilters(),

    async login() {
      let params = `site=${state.site.Site}&store=${state.site.Name}&preview=${state.site.Preview}&WebPreview=${state.site.WebPreview}`;

      try {
        loginApi(params)
      }
      catch (error) {
        throw new Error(error)
      }
    },
    async getSite() {
      try {
        let res = await getSiteApi()
        if(res.data.errormessage) {
          await methods.login();
          methods.getSite();
          return
        }

        state.site = res.data.data[0];
        localStorage.setItem('site', JSON.stringify(state.site));
      } catch (error) {
        throw new Error(error)
      }
    },
    async getAll() {
      let params = `WebPreview=${state.site.WebPreview}`;

      try {
        let res = await getAllApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getAll();
          return
        }

        state.all = res.data;
      } catch (error) {
        throw new Error(error)
      }
    },
    async getStore() {
      let params = `WebPreview=${state.site.WebPreview}`;

      try {
        let res = await getStoreApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getStore();
          return
        }

        state.store = res.data.data[0] || {};
        if(state.webVersion === 'demo') state.store.Logo = state.demoOrigin + state.store.Logo
        // 新增 store.footer 放聯絡我們 icon 
        // 有 link 才顯示
        state.footer_community = res.data.footer[0] || {};

      } catch (error) {
        throw new Error(error)
      }
    },
    async getCopyRight() {
      let params = `WebPreview=${state.site.WebPreview}`;

      try {
        let res = await getCopyRightApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getCopyRight();
          return
        }

        state.copyRight = res.data.data[0] || {};
      } catch (error) {
        throw new Error(error)
      }
    },
    async getCustomerService() {
      let params = `WebPreview=${state.site.WebPreview}`;

      try {
        let res = await getCustomerServiceApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getCustomerService();
          return
        }

        state.customerService = res.data.data[0] || {};
        state.customerService.Type == 1 ? methods.appendScript(state.customerService.Text, 'head') : methods.appendScript(state.customerService.Text, 'body');
        // if(state.customerService.FBText ) methods.appendScript(state.customerService.FBText, 'body');
      } catch (error) {
        throw new Error(error)
      }
    },

    // 
    getCart() {      
      if(state.user_account) {
        state.cart = JSON.parse(localStorage.getItem(`${state.site.Name}@${state.user_account}@cart`)) || [];
      }
      else {
        state.cart = JSON.parse(localStorage.getItem(`${state.site.Name}@cart`)) || [];
      }
      if(state.webVersion === 'demo') {
        state.cart.forEach(item => {
          item.Img1 = state.demoOrigin + item.Img1
          if(item.addPrice) {
            item.addPrice.forEach(addPriceItem => {
              addPriceItem.Img = state.demoOrigin + addPriceItem.Img
            })
          }
        })
      }

    },
    //
    async getFavorite() {
      if(state.user_account) {
        let formData = new FormData();
        formData.append("storeid", state.site.Name);
        formData.append("phone", state.user_account);

        try {
          let res = await getFavoriteApi(formData)
          if(res.data.errormessage) {
            await methods.login();
            methods.getFavoriteApi(formData);
            return
          }
  
          if(!res.data.status) {
            if(res.data.msg.indexOf('登入') > -1) {
              state.user_account = ''
              localStorage.removeItem('user_account')
              methods.getFavorite()
            }
            else state.favorite = {};
            return
          }

          state.favorite = {};
          let favorite_list = res.data.datas[0];
          for(let favorite of favorite_list) {
            let id = favorite.Product;
            let index = state.all.data.map((item) => item.ID).indexOf('' + id);
            if(index > -1) state.favorite[id] = state.all.data[index]
          }
        } catch (error) {
          throw new Error(error)
        }
      }
      else {
        state.favorite = JSON.parse(localStorage.getItem(`${state.site.Name}@favorite`)) || {};
        for(let key in state.favorite) {
          let favorite = state.favorite[key];
          let index = state.all.data.map((item) => item.ID).indexOf(favorite.ID)
          favorite = state.all.data[index];
        }
      }
    },
    async toggleFavorite(id) {
      if(state.user_account) {
        let formData = new FormData();
        formData.append("storeid", state.site.Name);
        formData.append("phone", state.user_account);
        formData.append("productid[]", id);

        try {
          let res
          if(state.favorite[id]) res = await deleteFavoriteApi(formData)
          else res = await addFavoriteApi(formData)
          if(res.data.errormessage) {
            await methods.login();
            if(state.favorite[id]) methods.deleteFavoriteApi(formData);
            else methods.addFavoriteApi(formData);
            return
          }

          if(!res.data.status) {
            if(res.data.msg.indexOf('登入') > -1) {
              state.user_account = ''
              localStorage.removeItem('user_account');
            }
          }

          methods.getFavorite();
        } catch (error) {
          throw new Error(error)
        }
      }
      else {
        if(state.favorite[id]) delete state.favorite[id]
        else {
          state.all.data.forEach((item) => {
            if(item.ID === id) state.favorite[id] = item
          })
        }
        localStorage.setItem(`${state.site.Name}@favorite`, JSON.stringify(state.favorite))
      }
    },

    // ==================================================
    // user info ========================================
    async send_verify_code() {
      if(state.second > 0) return

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
      let formData = getFormData(obj)
      try {
        let res = await send_verify_codeApi(formData)
        if(res.data.errormessage) {
          await methods.login();
          send_verify_code();
          return
        }

        if(res.data.status) {
          state.second = 300;
          let interval =  setInterval(() => {
            state.second -= 1;
            if(state.second < 1){
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
    // ==================================================

    // allProducts, category, rich, contact(map) ==============================
    imgHandler() {
      let editorWidth = 0;
      let editor_input =  document.querySelector('#EditerWidth');
      if(editor_input) {
        editorWidth = editor_input.value  * 1
      }

      let ql_editor = document.querySelector('.ql-editor');

      let rich_container = document.querySelector('.rich_container');

      if(!ql_editor || !rich_container) return

      let rich_container_width = parseFloat(window.getComputedStyle(rich_container).width);
      let rich_container_padding = parseFloat(window.getComputedStyle(rich_container).padding);
      if(rich_container_padding){
        rich_container_width -= rich_container_padding*2;
      }

      if( editorWidth < rich_container_width ){
        ql_editor.style.width = editorWidth + 'px';
      } 
      else{
        ql_editor.style.width = rich_container_width + 'px';
      }

      let imgs = document.querySelectorAll('.ql-editor img');
      for(let i = 0; i < imgs.length; i++){
        let imgWidth = window.getComputedStyle(imgs[i]).width.split('px')[0] * 1;

        if(imgWidth > editorWidth){
          imgs[i].style.width = editorWidth + 'px';
        }
      }

      let videos = document.querySelectorAll('.ql-editor .ql-video');
      for(let i = 0; i < videos.length; i++){
        let videosWidth = window.getComputedStyle(videos[i]).width.split('px')[0] * 1;
        if(videosWidth > editorWidth){
          videos[i].style.width = editorWidth + 'px';
        }
      }
    },
    // allProducts, category ==============================
    videoHandler(url){
      let code = '';
      if(url.indexOf('youtu.be') != -1){
        code = url.split('https://youtu.be/')[1];
      }
      else if(url.indexOf('www.youtube.com') != -1){
        if(url.split('?v=').length > 1){
          code = url.split('?v=')[1].split('&')[0];
        }
      }
      let iframe = '';
      if(code){
        iframe = `
          <iframe src="https://www.youtube.com/embed/${code}" 
            frameborder="0" 
            allow="accelerometer; 
              autoplay; clipboard-write; 
              encrypted-media; 
              gyroscope; 
              picture-in-picture" 
            allowfullscreen
          >
          </iframe>
        `
      }
      return iframe;
    },
    // ==============================

    // common component ============================================================
    delete_carts_item(id, specID) {
      cart.value.forEach((item, index)=> {
        if(item.ID === id) {
          if(item.specArr) {
            item.specArr.forEach((item2, index2) => {
              if(item2.ID === specID) {
                item.specArr[index2].buyQty = 0;
              }
            })

            if(methods.productTotalQty(item) < 1) {
              cart.value.splice(index, 1);
            }
          }
          else {
            cart.value.splice(index, 1);
          }
        }
      })
      methods.setCarts();
    },
    productTotalQty(product) {
      let totalQty = 0;
      if(product.specArr){
        for(let i = 0; i < product.specArr.length; i++){
          totalQty += product.specArr[i].buyQty * 1;
        }
      }
      else {
        totalQty = product.buyQty;
      }
      return totalQty;
    },
    setCarts() {
      if(user_account.value) {
        console.log('登入')
        localStorage.setItem(`${site.value.Name}@${user_account.value}@cart`, JSON.stringify(cart.value));
      }
      else {
        console.log('登出')
        localStorage.setItem(`${site.value.Name}@cart`, JSON.stringify(cart.value));
      }
    },
    // ============================================================

    check_logout() {
      if(state.payModal_message == '請先登入會員' ||
      state.payModal_message == '閒置逾時，請重新登入' ||
      state.payModal_message == '已登出，請重新登入'
      ) state.is_logout = true;
    },

    getFormData(obj) {
      let formData = new FormData();
      for(let key in obj) {
        formData.append(key, obj[key]);
      }
      return formData
    },

    appendScript(text, tag) {
      if(!text) return

      // 
      let script_arr = [];

      let scriptItems = text.split('&lt;script');
      scriptItems.splice(0, 1);

      for(let i = 0; i < scriptItems.length; i++) {
        scriptItems[i] = '&lt;script '+ scriptItems[i].trim();
        let attr = scriptItems[i].split('&gt;')[0];

        let content = scriptItems[i].split('&gt;')[1].split("&lt;/script")[0];
        let arr = attr.split(" ");
        let obj = {};
        for(let i = 0; i < arr.length; i++){
          if(arr[i].indexOf('="') != -1){
            obj[arr[i].split('="')[0]] = arr[i].split('="')[1].split('"')[0];
          } 
        }

        let script = document.createElement('script');
        for(let item in obj){
          script.setAttribute(item, obj[item]);
        }
        script.textContent = content;

        script_arr.push(script);
      }

      // 
      for(let i = 0; i < script_arr.length; i++) {
        document.querySelector(tag).appendChild(script_arr[i])
      }
    },

    copy(text, id) {
      let copy_input
      if(id) copy_input = document.querySelector(`#${id}`) 
      else copy_input = document.querySelector('#copy_input')
      copy_input.value = text;
      copy_input.select();
      document.execCommand('copy');
    },

    pagePush(page) {
      if(page > state.totalpage_num || page < 1) return
      state.page_active = page;
    },

    getPathname(page) {
      let pageObj = {
        index: {
          'common': '/',
          'demo': '/',
          'uniqm.com': '/',
          'uniqm.net': '/',
        },
        order: {
          'common': '/order',
          'demo': '/order',
          'uniqm.com': '/shoppingOrder',
          'uniqm.net': '/',
        },
        user: {
          'common': '/user',
          'demo': '/user',
          'uniqm.com': '/shoppingUser',
          'uniqm.net': '/',
        },
        info: {
          'common': '/user_info',
          'demo': '/user_info',
          'uniqm.com': '/shoppingInfo',
          'uniqm.net': '/',
        },
      }

      return pageObj[page][state.webVersion];
    },

    pushTo_cart(id) {
      let href = state.webVersion === 'uniqm.net' ? 'https://www.uniqm.net' : '/cart'
      if(state.site.WebPreview == 2) alert('預覽模式下不開放')
      else {
        if(id === undefined) methods.urlPush(`${href}?open_carts=true`, true)
        else methods.urlPush(`${href}?id=${id}`, true)
      }
    },

    urlPush(url, isOpen) {
      if(!url) return
      if(isOpen) window.open(url)
      else window.location.href = url
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})