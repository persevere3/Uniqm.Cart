// stores ========== ========== ========== ========== ==========
import { defineStore } from 'pinia'

// router ========== ========== ========== ========== ==========
import { useRoute } from 'vue-router'

// apis ========== ========== ========== ========== ==========
import { loginApi, getSiteApi, getAllApi, getStoreApi, getCopyRightApi, getCustomerServiceApi} from '@/apis/storeWeb';
import { getFavoriteApi, deleteFavoriteApi, addFavoriteApi } from '@/apis/favorite';

// json ========== ========== ========== ========== ==========
import bank_json from '@/json/bank'
import city_district_json from '@/json/city_district.json'

// composables ========== ========== ========== ========== ==========
import { useNumberThousands } from '@/composables/numberThousands'

export const useCommon = defineStore('common', () => {
  // state ========== ========== ========== ========== ==========
  const state = reactive({
    site: {},
    user_account: '',
    all: {},
    store: {},
    footer_community: {},
    copyRight: {},
    customerService: {},
    pathname: useRoute().name,

    is_getSite: false,
    is_getAll: false,

    cart: [],
    favorite: {},
    is_cart_active: false,
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
  })

  // methods ========== ========== ========== ========== ==========
  const methods = {
    // obj => formData or 只post WebPreview Preview
    return_formUrlencoded(origin) {
      if(origin === 'WebPreview') return `WebPreview=${state.site.WebPreview}`
      else if(origin === 'Preview') return `Preview=${state.site.Preview}`

      let formUrlencoded = ''
      for(let key in origin) {
        let value = origin[key]
        formUrlencoded += `${formUrlencoded ? '&' : ''}${key}=${value}`
      }
      return formUrlencoded
    },
    // obj => formData or 只post WebPreview
    return_formData(origin) {
      let formData = new FormData();

      if(origin === 'WebPreview' || origin === 'Preview') {
        formData.append(origin, state.site[origin]);
      } 
      else {
        for(let key in origin) {
          formData.append(key, origin[key]);
        }
      }

      return formData
    },

    async login() {
      let obj = {
        site: state.site.Site,
        store: state.site.Name,
        preview: state.site.Preview,
        WebPreview: state.site.WebPreview
      }
      let params = methods.return_formUrlencoded(obj)

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
          await methods.getSite();
          return
        }

        state.site = res.data.data[0] || {};
        localStorage.setItem('site', JSON.stringify(state.site));
      } catch (error) {
        throw new Error(error)
      }
    },
    async getAll() {
      let params = methods.return_formUrlencoded('WebPreview')

      try {
        let res = await getAllApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getAll();
          return
        }

        state.all = res.data;
        methods.multiPriceHandler(state.all.data);
        console.log('all: ', state.all)
      } catch (error) {
        throw new Error(error)
      }
    },
    async getStore() {
      let params = methods.return_formUrlencoded('WebPreview')

      try {
        let res = await getStoreApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getStore();
          return
        }

        state.store = res.data.data[0] || {};
        console.log(state.store)
        if(state.webVersion === 'demo') state.store.Logo = state.demoOrigin + state.store.Logo

        state.footer_community = res.data.footer[0] || {};
      } catch (error) {
        throw new Error(error)
      }
    },
    async getCopyRight() {
      let params = methods.return_formUrlencoded('WebPreview')

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
      let params = methods.return_formUrlencoded('WebPreview')

      try {
        let res = await getCustomerServiceApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getCustomerService();
          return
        }

        state.customerService = res.data.data[0] || {};
        methods.appendScript(state.customerService.Text, state.customerService.Type == 1 ? 'head' : 'body')
        // if(state.customerService.FBText ) methods.appendScript(state.customerService.FBText, 'body')
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
    },

    //
    async getFavorite() {
      if(state.user_account) {
        let formData = new FormData()
        formData.append("storeid", state.site.Name)
        formData.append("phone", state.user_account)

        try {
          let res = await getFavoriteApi(formData)
          if(res.data.errormessage) {
            await methods.login()
            methods.getFavorite()
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

          state.favorite = {}
          let favorite_list = res.data.datas[0] || []
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
            toggleFavorite(id)
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

    // payModal_message.indexOf('登入') > -1
    check_logout() {
      if(state.payModal_message == '請先登入會員' ||
        state.payModal_message == '閒置逾時，請重新登入' ||
        state.payModal_message == '已登出，請重新登入'
      ) state.is_logout = true;
    },

    //
    multiPriceHandler(data) {
      data.forEach(item => {
        if(item.PriceType === 'multiPrice') {
          // 建議售價
          // 所有規格都有填建議售價
          if(item.MinPrice > 0 && item.MaxPrice > 0) {        
            // 建議售價都一樣
            if(item.MinPrice === item.MaxPrice) item.priceRange = useNumberThousands(item.MinPrice)
            else item.priceRange = `${useNumberThousands(item.MinPrice)} - ${useNumberThousands(item.MaxPrice)}`
          }

          // 售價
          // 售價都一樣
          if(item.NowMinPrice === item.NowMaxPrice) item.nowPriceRange = useNumberThousands(item.NowMinPrice)
          else item.nowPriceRange = `${useNumberThousands(item.NowMinPrice)} - ${useNumberThousands(item.NowMaxPrice)}`
        }
      })
    },

    // 
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

    // 
    copy(text, id) {
      let copy_input
      if(id) copy_input = document.querySelector(`#${id}`) 
      else copy_input = document.querySelector('#copy_input')
      copy_input.value = text;
      copy_input.select();
      document.execCommand('copy');
    },

    // allProducts, category, rich, contact(map) , user ==============================
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
      for(let i = 0; i < imgs.length; i++) {
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

    // products page
    pagePush(page) {
      if(page > state.totalpage_num || page < 1 || page == state.page_active) {
        return;
      }

      state.page_active = page;
    },

    is_show_page(item, totalpage_num) {
      let showpage_num = 5

      if(totalpage_num < showpage_num + 1) {
        return item < totalpage_num + 1
      }
      else if(state.page_active < (showpage_num / 2)) {
        return item < showpage_num + 1
      }
      else if(state.page_active > totalpage_num - (showpage_num / 2)) {
        return item > (totalpage_num - 5) 
      }
      else {
        return item >= (state.page_active - 2) && item <= (state.page_active + 2)
      }
    },

    // 
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

    // 
    pushTo_cart(id) {
      if(state.site.WebPreview == 2) alert('預覽模式下不開放')
      else {
        let href = state.webVersion === 'uniqm.net' ? 'https://www.uniqm.net' : '/cart'

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