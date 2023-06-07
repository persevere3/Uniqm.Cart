import Common from './components/Common.vue'
import Cookie from './components/Cookie.vue'

import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  components: {
    Common,
    Cookie,
    DatePicker
  },
  data(){
    return{
      api: '',
      protocol: '',

      // rich location.href
      rich_id: 0,
      // rich_cid 0: navbar, 1: 關於我們, 2: 顧客服務
      rich_cid: 0,

      // user
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
      r_verify_code2: {
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
      sex: 'male',
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
      r_verify_code: {
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
      r_password_type: 'password',
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

      forget_step: 1,
      mailOrAccount: 0,
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
      f_password_type: 'password',
      f_confirm_password_type: 'password',

      is_userModal: false,
      is_LineRegister: false,
      is_userMessage: false,
      user_message: '',

      // 
      LineToken: '',

      // user_info
      user_account: '',

      user_info: {},

      user_info_nav_active: 'info',

      delivery_address: [],
      address_select_active: '',

      recommend_code: '',

      bonus: [],

      // 
      total_bonus: 0,

      // 
      status_500_counter: 0,

      // shopping ============================================================
      categories: [],
      active_category_id: 0,
      products: [],
      search_text: '',

      is_favorite_hover: false,
      is_carts_hover: false,
    }
  },
  computed:{
    // homePage 
    // Ex[i].Link 有可能是 websubcategory[j].ID 或 OutUrl
    // direct_link
    filter_ex(){
      let arr = [];
      let Ex = this.homePage.Ex;
      for(let i = 0; i < Ex.length; i++){
        if(Ex[i].type == 0){
          Ex[i].direct_link = Ex[i].Link;
          arr.push(Ex[i]);
        }
        else {
          let websubcategory = this.all.websubcategory;
          for(let j = 0; j < websubcategory.length; j++){
            if( Ex[i].Link == websubcategory[j].ID){

              if(websubcategory[j].Class == 3){
                Ex[i].direct_link = `/rich.html?id=${websubcategory[j].CategoryID}&cid=1`;
              }
              else if(websubcategory[j].Class == 2){
                Ex[i].direct_link = `/rich.html?id=${Ex[i].Link}&cid=0`;
              }
              else if(websubcategory[j].Class == 1){
                Ex[i].direct_link = `/category.html?id=${Ex[i].Link}`;
              }
              else if(websubcategory[j].Class == 0){
                Ex[i].direct_link = `/allProducts.html?id=${Ex[i].Link}`;
              }

              arr.push(Ex[i]);
              break;
            }
          }
        }
      }
      return arr;
    },
    filter_category(){
      let arr = [];
      let Category = this.homePage.Category;
      let websubcategory = this.all.websubcategory;
      for(let i = 0; i < Category.length; i++){
        if(Category[i].Link == 0){
          arr.push(Category[i]);
          continue;
        }
        for(let j = 0; j < websubcategory.length; j++){
          if( Category[i].Link == websubcategory[j].ID){
            if(websubcategory[j].Class == 3){
              Category[i].direct_link = `/rich.html?id=${websubcategory[j].CategoryID}&cid=1`;
            }
            else if(websubcategory[j].Class == 2){
              Category[i].direct_link = `/rich.html?id=${Category[i].Link}&cid=0`;
            }
            else if(websubcategory[j].Class == 1){
              Category[i].direct_link = `/category.html?id=${Category[i].Link}`;
            }
            else if(websubcategory[j].Class == 0){
              Category[i].direct_link = `/allProducts.html?id=${Category[i].Link}`;
            }

            arr.push(Category[i]);
            break;
          }
        }
      }
      return arr;
    },

    // rich
    customize_obj(){
      let object = {};
      if(!this.all){
        return
      }
      for(let i = 0; i < this.all.webcategory.length; i++){
        // all.webcategory[i].Class 0: 無, 1: contact.html, 2: url, 3: customize
        object[this.all.webcategory[i].ID] = this.all.webcategory[i];
      }
      return object;
    },
    navbar_obj(){
      let object = {};
      if(!this.all){
        return
      }
      for(let i = 0; i < this.all.websubcategory.length; i++){
        // all.websubcategory[i].Class 0: all, 1: category, 2: rich, 3: rich(footer)
        if(this.all.websubcategory[i].Class == 2){
          object[this.all.websubcategory[i].ID] = this.all.websubcategory[i];
        }
      }
      return object;
    },
    footer_obj(){
      let object = {};
      if(!this.all){
        return
      }
      for(let i = 0; i < this.all.footer.length; i++){
        object[this.all.footer[i].ID] = this.all.footer[i];
      }
      return object;
    },

    birthday() {
      let b = new Date(this.r_birthday.value);
      return `${b.getFullYear()}/${b.getMonth() + 1 < 10  ? '0' : '' }${b.getMonth() + 1}/${b.getDate() < 10  ? '0' : '' }${b.getDate()}`
    },

    // shopping ============================================================
    filter_products() {
      if(this.active_category_id == 0) {
        if(this.search_text) {
          return this.products.filter(item => item.Name.indexOf(this.search_text) > -1)
        } else {
          return this.products
        }
      }
      return this.products.filter(item => {
        let category_arr = [item.Category1, item.Category2, item.Category3, item.Category4, item.Category5]
        return category_arr.indexOf(this.active_category_id) > -1 && (this.search_text ? item.Name.indexOf(this.search_text) > -1 : true) 
      })
    }
  },
  watch: {
    is_carts_hover(v) {
      console.log(v);
    }
  },
  methods: {
    // 
    async example_test() {
      let obj = {
        
      }
      let formData = getFormData(obj)

      try {
        let res = await registerApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.register();
          return
        }

      } catch (error) {
        throw new Error(error)
      }
    },


    // common component ============================================================
    delete_carts_item(id, specID) {
      let vm = this;
      vm.carts.forEach((item, index)=> {
        if(item.ID === id) {
          if(item.specArr) {
            item.specArr.forEach((item2, index2) => {
              if(item2.ID === specID) {
                item.specArr[index2].buyQty = 0;
              }
            })

            if(vm.productTotalQty(item) < 1) {
              vm.carts.splice(index, 1);
            }
          }
          else {
            vm.carts.splice(index, 1);
          }
        }
      })
      vm.setCarts();
    },
    productTotalQty(product){
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
      if(this.user_account) {
        console.log('登入')
        localStorage.setItem(`${this.site.Name}@${this.user_account}@carts`, JSON.stringify(this.carts));
      }
      else {
        console.log('登出')
        localStorage.setItem(`${this.site.Name}@carts`, JSON.stringify(this.carts));
      }
    },
    // ============================================================

    // allProducts, category, rich, contact(map) ==============================
    imgHandler() {
      let editorWidth = 0;
      let editor_input =  document.querySelector('#EditerWidth');
      if(editor_input){
        editorWidth = editor_input.value  * 1
      }

      let ql_editor = document.querySelector('.ql-editor');

      let rich_container = document.querySelector('.rich_container');

      if(!ql_editor || !rich_container){
        return
      }

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
    // ==============================
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

    // info ============================================================
    getUser_info() {
      let vm = this;

      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("storeid", vm.site.Name);
        formData.append("phone", vm.user_account);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/GetMemberInfo`, true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if(JSON.parse(xhr.response).status) {
              vm.user_info = JSON.parse(xhr.response).datas[0][0];

              vm.login_handle_carts();

              vm.r_name.value = vm.user_info.Name
              vm.r_mail.value = vm.user_info.Email
              vm.r_birthday.value = vm.user_info.Birthday ? new Date(vm.user_info.Birthday) : ''
              vm.sex = vm.user_info.Gender == 1 ? 'male' : 'female' 
              vm.r_phone2.value = vm.user_info.Phone2
              vm.recommend_code = vm.user_info.Promocode
              vm.r_recommender.value = vm.user_info.Recommender
              vm.total_bonus = vm.user_info.Wallet * 1

              let result_arr = [];
              let address_arr = vm.user_info.Adress.split('_#_');
              address_arr.length = address_arr.length - 1;
              for(let address of address_arr){
                let item = address.split('_ _');
                result_arr.push({
                  id: item[0],
                  city: item[1],
                  district: item[2],
                  detail: item[3],
                  rules: {
                    required: {
                      message: '請輸入完整地址'
                    },
                  },
                  is_error: false,
                  message: '',
                })
              }
              vm.delivery_address = result_arr;

            } else {
              vm.payModal_message = JSON.parse(xhr.response).msg;
              vm.check_logout();
              vm.is_payModal = true;
            }

            resolve();
          }
        }
      })
    },
    login_handle_carts() {
      let vm = this
      let carts = JSON.parse(localStorage.getItem(`${vm.site.Name}@${vm.user_account}@carts`)) || [];
      let localCarts = JSON.parse(localStorage.getItem(`${vm.site.Name}@carts`)) || [];
      for(let localIndex in localCarts) {
        let f = false;
        for(let cartsIndex in carts) {
          if(localCarts[localIndex].ID === carts[cartsIndex].ID) {
            vm.$set(carts, cartsIndex, localCarts[localIndex])
            f = true;
          }
        }
        if(!f) {
          vm.$set(carts, carts.length, localCarts[localIndex])
        }
      }
      vm.carts = [];
      carts.forEach((item, index)=>{
        vm.$set(vm.carts, index, item)
      })
      console.log(`${vm.site.Name}@${vm.user_account}@carts`, vm.carts)
      localStorage.setItem(`${vm.site.Name}@${vm.user_account}@carts`, JSON.stringify(vm.carts));
    },

    add_address() {
      let id = new Date().getTime();
      if (this.delivery_address.length > 2) return
      this.delivery_address.push({
        id,
        city: '',
        district: '',
        detail: '',
        rules: {
          required: {
            message: '請輸入完整地址'
          },
        },
        is_error: false,
        message: '',
      })
    },
    delete_address(id) {
      let vm = this;
      console.log(id);
      for(let i = vm.delivery_address.length - 1; i > -1; i--) {
        console.log(vm.delivery_address[i].id);
        if(vm.delivery_address[i].id == id) {
          vm.delivery_address.splice(i, 1)
        }
      }
    },
    edit_info() {
      let arr = this.delivery_address
      for(let i = arr.length - 1; i > 0; i --) {
        for( let j = 0; j < i; j++) {
          if(arr[j].city == arr[i].city && arr[j].district == arr[i].district && arr[j].detail == arr[i].detail){
            arr.splice(i, 1);
            break;
          }
        }
      }

      if(this.store.NotificationSystem == 1 || this.store.NotificationSystem == 2) {
        if (!this.verify(this.verify_code)) {
          return
        }
      }
      if (!this.verify(this.r_name, this.r_mail, this.r_birthday, this.r_phone2, ...arr)) {
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      formData.append("recommender", this.r_recommender.value);
      formData.append("phone", this.user_account);
      formData.append("phone2", this.r_phone2.value);
      if(vm.store.NotificationSystem == 1 || vm.store.NotificationSystem == 2) {
        formData.append("validate", this.verify_code.value);
      }
      formData.append("name", this.r_name.value);
      let b = this.r_birthday.value;
      let birthday = `${b.getFullYear()}/${b.getMonth() + 1 < 10  ? '0' : '' }${b.getMonth() + 1}/${b.getDate() < 10  ? '0' : '' }${b.getDate()}`
      formData.append("birthday", birthday);
      formData.append("gender", this.sex == 'male' ? 1 : 0 );
      formData.append("email", this.r_mail.value);
      let address_str = '';
      for(let item of arr){
        address_str += `${item.id}_ _${item.city}_ _${item.district}_ _${item.detail}_#_`
      }
      formData.append("address", address_str);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/EditMemberInfo`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          vm.getUser_info();
          vm.payModal_message = JSON.parse(xhr.response).msg;
          if(!(JSON.parse(xhr.response).status)){
            vm.check_logout()
          }
          vm.is_payModal = true;
        }
      }
    },
    edit_pass() {
      if (!this.verify(this.o_password, this.r_password, this.r_confirm_password)) {
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      formData.append("phone", this.user_account);
      formData.append("oldpassword", this.o_password.value);
      formData.append("newpassword", this.r_password.value);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/EditMemberPassWord`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
          vm.payModal_message = JSON.parse(xhr.response).msg;
          if(!(JSON.parse(xhr.response).status)){
            vm.check_logout()
          }
          vm.is_payModal = true;
        }
      }
    },

    async getBonus(type) {
      let vm = this;
      
      await vm.getUser_info()

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      formData.append("storename", this.site.Store);
      formData.append("phone", this.user_account);
      formData.append("recommander", this.recommend_code);
      if (!type) {
        this.order_page_index = 1;
      }
      formData.append("pageindex", this.order_page_index);
      formData.append("pagesize", this.order_page_size);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/Webmember/GetMemberBonusOrders`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status) {
            let data = JSON.parse(xhr.response).datas[0]

            vm.order_page_number = Math.ceil(data.Count / vm.order_page_size);
            if(vm.order_page_number == 0){
              vm.payModal_message = '沒有您的購物金紀錄';
              vm.is_payModal = true;
              vm.bonus = null;
              return;
            }
            else {
              vm.total_bonus = data.Total;
              vm.bonus = data.Bonuses;
              vm.bonus.forEach((item) => {
                if(item.Type.indexOf('使用點數') > -1){
                  item.FeedBack = -item.FeedBack;
                }
              })
            }
          } else {
            vm.payModal_message = JSON.parse(xhr.response).msg;
            vm.check_logout();
            vm.is_payModal = true;
          }
        }
      }
    },

    post_logout() {
      let vm = this;
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/MemberLogout`, true);
      xhr.send();
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          vm.logout();
        }
      }
    },
    logout() {
      localStorage.removeItem('user_account');
      this.urlPush(this.getPathname('user'));
    },

    //
    bindLine() {
      this.urlPush(`${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${this.site.Name}&site=${this.site.Site}&phone=${this.user_account}`)
    },
    unbindLine_test() {
      let vm = this

      let isConfim = confirm('確定解除Line綁定嗎？');
      if(!isConfim) return

      let formData = new FormData();
      formData.append("storeid", vm.site.Name);
      formData.append("phone", vm.user_account);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/webmember/OldMemberDeleteLineIDAccount`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status) {
            vm.getUser_info()
          }
        }
      }
    },
    deleteAccount_test() {
      let vm = this;

      let isConfim = confirm('確定刪除帳號嗎？')
      if(!isConfim) return

      let formData = new FormData();
      formData.append("storeid", vm.site.Name);
      formData.append("phone", vm.user_account);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/WebMember/DeleteLineIDAccount`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status) {
            vm.logout();
          }
        }
      }
    },
    // ==============================
  },
  created() {
    let vm = this;
    vm.api = location.host;
    vm.protocol = location.protocol;
  },
  mounted() {
    this.getSite();
    if(document.querySelector('.header')){
      document.querySelector('body').style['padding-top'] = document.querySelector('.header').getBoundingClientRect().height + 'px';
    }
  }
}