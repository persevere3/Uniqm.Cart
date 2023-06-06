import { defineStore, storeToRefs } from 'pinia'
import { loginApi, getSiteApi, getAllApi, getStoreApi, getCopyRightApi, getCustomerServiceApi,
  getFavoriteApi, deleteFavoriteApi, addFavoriteApi } from '@/api/index';

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

    carts: [],
    favorite: {},

    // 
    bank: bank_json,
    city_district: city_district_json,

    // index, search page
    perpage_num: 8,
    totalpage_num: 0,
    page_active: 1,

    //
    messageArr: [],

    //
    webVersion: 'common',

    //
    testData: '',
  })

  // methods ==================================================
  const methods = {
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
          methods.getAllApi(params);
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
          methods.getStoreApi(params);
          return
        }

        state.store = res.data.data[0] || {};

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
          methods.getCopyRightApi(params);
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
          methods.getCustomerServiceApi(params);
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
      let vm = this;
      
      if(state.user_account) {
        state.cart = JSON.parse(localStorage.getItem(`${state.site.Name}@${state.user_account}@cart`)) || [];
      }
      else {
        state.cart = JSON.parse(localStorage.getItem(`${state.site.Name}@cart`)) || [];
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

    getFormData(obj) {
      let formData = new FormData();
      for(key in obj) {
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
          'common': '/order.html',
          'demo': '/order.html',
          'uniqm.com': '/shoppingOrder.html',
          'uniqm.net': '',
        },
        user: {
          'common': '/user.html',
          'demo': '/user.html',
          'uniqm.com': '/shoppingUser.html',
          'uniqm.net': '',
        },
        info: {
          'common': '/user_info.html',
          'demo': '/user_info.html',
          'uniqm.com': '/shoppingInfo.html',
          'uniqm.net': '',
        },
      }

      return pageObj[page][state.webVersion];
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