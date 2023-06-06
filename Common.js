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
    async getBonus(type){
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
    copy(text, id) {
      let copy_input
      if(id) {
        copy_input = document.querySelector(`#${id}`);
      } else {
        copy_input = document.querySelector('#copy_input');
      }
      copy_input.value = text;
      copy_input.select();
      document.execCommand('copy');
    },
    filter_account_number(){
      if(this.account_number.length > 6){
        this.account_number = this.account_number.substring(0, 6)
      }
    },
    checkPay(){
      if(!this.order_number || !this.account_number || this.account_number.length < 6){
        this.payModal_message = '請填寫匯款帳號末6碼';
        this.is_payModal = true;
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("payflino", this.order_number);
      formData.append("paytradeno", this.account_number);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/interface/web/ATMComfirmBack`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status){
            vm.payModal_message = '帳號末6碼已送出，確認您的付款中';
          } else {
            vm.payModal_message = '抱歉，請重新輸入帳號末6碼';
          }
          vm.is_payModal = true;

          let pathname = location.pathname;
          if (pathname.indexOf('order') > -1 && !vm.user_account ) {
            vm.getOrder('page', true);
          } else {
            vm.getMemberOrder('page', true)
          }

          vm.$forceUpdate();
        }
      }
    },

    rePay(FilNo, url) {
      let vm = this;

      let formData = new FormData();
      formData.append("StoreId", this.site.Name);
      formData.append("flino", FilNo);
      formData.append("url", url);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('post', `${vm.protocol}//${vm.api}/LineMK/Line/RePayConfirm`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if('status' in JSON.parse(xhr.response)) {
            alert(JSON.parse(xhr.response).msg)
            if(vm.user_account) vm.getMemberOrder()
            else vm.getOrder()
          }
          else {
            vm.payResult = JSON.parse(xhr.response)
            vm.toPay()
          }
        }
      }
    },
    toPay(){
      let vm = this
      // LinePay
      if(this.pay_method == 'LinePay'){
        this.urlPush(this.payResult.payUrl)
      }
      // ecpay
      else {
        if(this.api.indexOf('demo') > -1) {
          // target="_blank"
          this.ECPay_form = `<form id="ECPay_form" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">`
        } else {
          this.ECPay_form = `<form id="ECPay_form" action="https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">`
        }
        for(let item in this.payResult){
          if(item === 'success' || item === 'message') continue
          // EncryptType TotalAmount ExpireDate: number，other: text
          this.ECPay_form += `<input type="${item == 'EncryptType' || item == 'TotalAmount' || item == 'ExpireDate' ? 'number' : 'text'}" name="${item}" value="${this.payResult[item]}">`;
        }
        this.ECPay_form += `
            <div class="message"> 前往付款頁面 </div>
            <div class="button_row">
              <div class="button" onclick="document.querySelector('.ECPay_form_container').style.display = 'none'" > 取消 </div> 
              <div class="button" onclick="document.querySelector('#ECPay_form').submit(); document.querySelector('.ECPay_form_container').style.display = 'none'" > 確認 </div> 
            </div>
          </form>
        `;

        this.$nextTick(() => {
          document.querySelector('.ECPay_form_container').style.display = 'block'
        })
      }
    },
    // user
    required_verify(item) {
      if(!item.hasOwnProperty('value')){
        if (!item.city || !item.district || !item.detail ) {
          item.is_error = true;
          item.message = item.rules.required.message;
          return false;
        }
        else {
          item.is_error = false;
          item.message = '';
          return true;
        }
      }
      else {
        if (!item.value) {
          item.is_error = true;
          item.message = item.rules.required.message;
          return false;
        }
        else {
          item.is_error = false;
          item.message = '';
          return true;
        }
      }
    },
    cellphone_verify(item) {
      let rep = /^(09)[0-9]{8}$/;
      if (!rep.test(item.value)) {
        item.is_error = true;
        item.message = item.rules.cellphone.message;
        return false;
      }
      else {
        item.is_error = false;
        item.message = '';
        return true;
      }
    },
    length_verify(item) {
      if (item.value.length < item.rules.length.min || item.value.length > item.rules.length.max) {
        item.is_error = true;
        item.message = item.rules.length.message;
        return false;
      }
      else {
        item.is_error = false;
        item.message = '';
        return true;
      }
    },
    mail_verify(item) {
      let rep = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!rep.test(item.value)) {
        item.is_error = true;
        item.message = item.rules.mail.message;
        return false;
      }
      else {
        item.is_error = false;
        item.message = '';
        return true;
      }
    },
    confirm_verify(item) {
      if (item.value != this[item.rules.confirm.password].value) {
        item.is_error = true;
        item.message = item.rules.confirm.message;
        return false;
      }
      else {
        item.is_error = false;
        item.message = '';
        return true;
      }
    },
    send_verify_code() {
      if(this.second > 0) return

      if(this.store.NotificationSystem == 0) {
        if( !this.verify(this.r_mail) ) return
      }
      else if(this.store.NotificationSystem == 1) {
        if( !this.verify(this.r_account) ) return
      }
      else {
        if( !this.verify(this.r_account) || !this.verify(this.r_mail) ) return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("phone", this.r_account.value.trim());
      formData.append("mail", this.r_mail.value.trim());

      formData.append("notificationsystem", this.store.NotificationSystem)
      formData.append("type", this.store.NotificationSystem)
      formData.append("storeName", this.site.Store);
      formData.append("storeid", this.site.Name);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/SendValidateMessage`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status){
            vm.second = 300;
            let interval =  setInterval(() => {
              vm.second -= 1;
              if(vm.second < 1){
                clearInterval(interval);
              }
            }, 1000)
          }
          vm.user_message = JSON.parse(xhr.response).msg
          vm.is_userMessage = true;
        }
      }
    },
    verify(...arr) {
      let is_valid = true;
      for (let item of arr) {
        for (let rule in item.rules) {
          if (!this[`${rule}_verify`](item)) {
            is_valid = false;
            break
          }
        }
      }
      return is_valid;
    },
    register() {
      if (this.site.TermsNotices && !this.r_is_agree) {
        return
      }

      let verify_code = [];
      if(this.store.NotificationSystem == 0) {
        verify_code.push(this.r_verify_code2)
      }
      else if(this.store.NotificationSystem == 1) {
        verify_code.push(this.r_verify_code)
      }
      else {
        verify_code.push(this.r_verify_code)
        verify_code.push(this.r_verify_code2)
      }

      if (!this.verify(this.r_name, this.r_mail, this.r_birthday, this.r_account, ...verify_code, this.r_password, this.r_confirm_password)) {
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      formData.append("phone", this.r_account.value);

      if(this.store.NotificationSystem == 0) {
        formData.append("validate2", this.r_verify_code2.value);
      }
      else if(this.store.NotificationSystem == 1) {
        formData.append("validate", this.r_verify_code.value);
      }
      else {
        formData.append("validate", this.r_verify_code.value);
        formData.append("validate2", this.r_verify_code2.value);
      }

      formData.append("password", this.r_password.value);
      formData.append("name", this.r_name.value);
      let b = this.r_birthday.value
      let birthday = `${b.getFullYear()}/${b.getMonth() + 1 < 10  ? '0' : '' }${b.getMonth() + 1}/${b.getDate() < 10  ? '0' : '' }${b.getDate()}`
      formData.append("birthday", birthday);
      formData.append("gender", this.sex == 'male' ? 1 : 0 );
      formData.append("email", this.r_mail.value);
      formData.append("recommender", this.r_recommender.value);
      formData.append("type", this.store.NotificationSystem)

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/MemberRegister`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status){
            vm.l_account.value = vm.r_account.value;
            vm.l_password.value = vm.r_password.value;
            vm.user_login();
          }
          else {
            vm.user_message = JSON.parse(xhr.response).msg
            vm.is_userMessage = true;
          }
        }
      }
    },
    user_login() {
      if (!this.verify(this.l_account, this.l_password)) {
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      formData.append("phone", this.l_account.value);
      formData.append("password", this.l_password.value);
      formData.append("realAccount", this.l_account.value);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/MemberLogin`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status){
            localStorage.setItem('user_account', vm.l_account.value);
            vm.user_account = vm.l_account.value;

            vm.urlPush(vm.getPathname('info'));
          }
          else {
            vm.user_message = '請確認您的帳號密碼後重新登入'
            vm.is_userMessage = true;
          }
        }
      }
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
    post_logout(){
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
    logout(){
      localStorage.removeItem('user_account');
      this.urlPush(this.getPathname('user'));
    },

    // forget password
    send_forget_verify_code() {
      if(this.f_second > 0) return

      if(this.store.NotificationSystem == 0 || (this.store.NotificationSystem == 2 && this.mailOrAccount == 0) ) {
        if( !this.verify(this.f_mail) ) return
      }
      else if(this.store.NotificationSystem == 1 || (this.store.NotificationSystem == 2 && this.mailOrAccount == 1) ) {
        if( !this.verify(this.f_account) ) return
      }

      let vm = this;

      let formData = new FormData();
      let phoneormail;
      if(this.store.NotificationSystem == 0) {
        phoneormail = this.f_mail.value.trim()
      }
      else if(this.store.NotificationSystem == 1) {
        phoneormail = this.f_account.value.trim()
      } else {
        phoneormail = this.mailOrAccount == 0 ? this.f_mail.value.trim() : this.f_account.value.trim()
      }
      formData.append("phoneormail", phoneormail);
      formData.append("storeName", this.site.Store);
      formData.append("storeid", this.site.Name);
      formData.append("notificationsystem", this.store.NotificationSystem)

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/ForgetPasswordValidateMessage`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).status){
            vm.reset_input('f_verify_code');
            vm.forget_step = 2;

            vm.f_second = 300;
            let interval =  setInterval(() => {
              vm.f_second -= 1;
              if(vm.f_second < 1){
                clearInterval(interval);
              }
            }, 1000)
          } else {
            vm.user_message = JSON.parse(xhr.response).msg
            vm.is_userMessage = true;
          }
        }
      }
    },
    check_forget_verify_code() {
      if(!this.verify(this.f_verify_code)){
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      let phoneormail;
      if(this.store.NotificationSystem == 0) {
        phoneormail = this.f_mail.value.trim()
      }
      else if(this.store.NotificationSystem == 1) {
        phoneormail = this.f_account.value.trim()
      } else {
        phoneormail = this.mailOrAccount == 0 ? this.f_mail.value.trim() : this.f_account.value.trim()
      }
      formData.append("phoneormail", phoneormail);
      formData.append("validate", this.f_verify_code.value);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/CheckForgetPasswordValidate`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
          vm.user_message = JSON.parse(xhr.response).msg
          vm.is_userMessage = true;
          if(JSON.parse(xhr.response).status){
            vm.reset_input('f_password');
            vm.reset_input('f_confirm_password');
            vm.forget_step = 3;
          }
        }
      }
    },
    reset_input(name) {
      this[name].value = '';
      this[name].is_error = false;
      this[name].message = '';
    },
    edit_forget_pass() {
      if (!this.verify(this.f_password, this.f_confirm_password)) {
        return
      }

      let vm = this;

      let formData = new FormData();
      formData.append("storeid", this.site.Name);
      let phoneormail;
      if(this.store.NotificationSystem == 0) {
        phoneormail = this.f_mail.value.trim()
      }
      else if(this.store.NotificationSystem == 1) {
        phoneormail = this.f_account.value.trim()
      } else {
        phoneormail = this.mailOrAccount == 0 ? this.f_mail.value.trim() : this.f_account.value.trim()
      }
      formData.append("phoneormail", phoneormail);
      formData.append("validate", this.f_verify_code.value);
      formData.append("newpassword", this.f_password.value);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/changeforgetpasswordvalidate`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
          vm.user_message = JSON.parse(xhr.response).msg
          vm.is_userMessage = true;
          if(JSON.parse(xhr.response).status){
            vm.reset_input('f_account');
            vm.reset_input('f_mail');
            vm.reset_input('f_verify_code');
            vm.reset_input('f_password');
            vm.reset_input('f_confirm_password');
            vm.forget_step = 1;
            vm.user_nav_active = 'login'
          }
        }
      }
    },

    // user_info
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
    check_logout(){
      let vm = this;
      if(vm.payModal_message == '請先登入會員' ||
        vm.payModal_message == '閒置逾時，請重新登入' ||
        vm.payModal_message == '已登出，請重新登入'
      ) vm.is_logout = true;
    },

    // sidebar change all.Navbar[index].isDropDown
    changeDropDown(index){
      this.all.Navbar[index].isDropDown = !this.all.Navbar[index].isDropDown;
      this.$forceUpdate();
    },
    
    // allProducts, category, rich, contact(map)
    unescapeHTML(str){
      let vm = this;
      str = "" + str;
      
      this.$nextTick(function () {
        vm.imgHandler();
      });

      return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
    },
    imgHandler(){
      
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

    // 
    numberThousands(number) {
      return String(number).replace( /(\d)(?=(?:\d{3})+$)/g, '$1,')
    },

    // allProducts, category
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

    // Line
    // https://demo.uniqcarttest.tk/?code=cYECgbvDcN1egeR6UyPk&state=login
    LineLogin(isRegister) {
      this.urlPush(`${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${this.site.Name}&site=${this.site.Site}${isRegister ? `&recommender=${this.r_recommender.value}&method=Register` : ''}`)
    },
    validateRecommenderCode() {
      let vm = this;

      if(!vm.r_recommender.value) {
        vm.LineLogin(true)
        return
      }
      let formData = new FormData();
      formData.append("storeid", vm.site.Name);
      formData.append("recommender", vm.r_recommender.value);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('POST', `${vm.protocol}//${vm.api}/interface/WebMember/CheckRecommanderCode`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          alert(JSON.parse(xhr.response).msg)
          if(JSON.parse(xhr.response).status) vm.LineLogin(true)
        }
      }
    },

    getLineProfile() {
      let vm = this;

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open('get', `https://api.line.me/oauth2/v2.1/userinfo`, true);
      xhr.setRequestHeader("Authorization", `Bearer ${this.LineToken}`); 
      xhr.send();
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          console.log(JSON.parse(xhr.response));
        }
      }
    },

    // homePage allProducts, category, search
    pushTo_cart(id){
      let href = this.webVersion === 'uniqm.net' ? 'https://www.uniqm.net' : '/cart'
      this.site = JSON.parse(localStorage.getItem('site')) || [] ;
      if(this.site.WebPreview == 2) alert('預覽模式下不開放')
      else {
        const vm = this;

        if(id === undefined) vm.urlPush(`${href}?open_carts=true`, true)
        else vm.urlPush(`${href}?id=${id}`, true)
      }
    },

    // shopping ============================================================
    getCategories() {
      let vm = this

      let formData = new FormData();
      formData.append("Preview", vm.site.Preview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true; 
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/store/GetCategory`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).errormessage) {
            return
          }

          vm.categories =[{ID: "0", Name: "所有分類商品", Show: "1"}, ...JSON.parse(xhr.response).data];
        }
      }
    },
    getProducts() {
      let vm = this

      let formData = new FormData();
      formData.append("Preview", vm.site.Preview);

      let xhr = new XMLHttpRequest();
      xhr.withCredentials = true; 
      xhr.open('post',`${vm.protocol}//${vm.api}/interface/store/storeLogin`, true);
      xhr.send(formData);
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if(JSON.parse(xhr.response).errormessage) {
            return
          }

          vm.products = JSON.parse(xhr.response).data;
        }
      }
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
    }
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