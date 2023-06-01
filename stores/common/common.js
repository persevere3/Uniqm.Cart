import { defineStore, storeToRefs } from 'pinia'
import { loginApi, getSiteApi, getAllApi, getStoreApi } from '@/api/index';

export const useCommon = defineStore('common', () => {
  // state ==================================================
  const state = reactive({
    site: {},
    user_account: '',
    all: {},
    store: {},
    footer_community: {},

    bank: '',

    // homePage, search_page
    perpage_num: 8,
    totalpage_num: 0,
    product_page_active: 1,

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


    appendScript(text, tag) {
      if(!text) return

      // 
      let script_arr = [];

      let scriptItems = text.split('&lt;script');
      scriptItems.splice(0, 1);

      scriptItems.forEach(scriptItem => {
        scriptItem = '&lt;script '+ scriptItem.trim();
        let attr = scriptItem.split('&gt;')[0];

        let content = scriptItem.split('&gt;')[1].split("&lt;/script")[0];
        let arr = attr.split(" ");
        let obj = {};
        arr.forEach(item => {
          if(item.indexOf('="') != -1) {
            obj[item.split('="')[0]] = item.split('="')[1].split('"')[0];
          }
        })

        let script = document.createElement('script');
        for(let item in obj) script.setAttribute(item, obj[item])
        script.textContent = content;

        script_arr.push(script);
      })

      // 
      for(let i = 0; i < script_arr.length; i++){
        document.querySelector(tag).appendChild(script_arr[i])
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