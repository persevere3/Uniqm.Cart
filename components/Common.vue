<template>
  <div @click.stop="is_carts_hover = false; is_favorite_hover = false">

    <div class="search_container" :class="{search_active : is_search}" @mousedown="close_search">
      <div class="search">
        <i class="fa fa-search" aria-hidden="true" @click="searchHandler"></i>
        <input type="text" maxlength="100" placeholder="找商品" v-model="searchStr" @keyup.enter="searchHandler">
      </div>
    </div>
  
    <div class="connect_container" :class="{connect_active : is_connect}" @mousedown="close_connect">
      <div class="connect">
        <div class="text">聯絡我們</div>
        <input placeholder="輸入你的電子信箱" type="email" value="" v-model.trim="connect_mail" :class="{error_border: error_mail}" @input="validate_connect('mail')">
        <div class="error_color" v-if="error_mail == 1"> 電郵 是必須的 </div>
        <div class="error_color" v-if="error_mail == 2"> 電郵 無效 </div>
        <textarea rows="5" v-model.trim="connect_text" :class="{error_border: error_text}" @input="validate_connect('text')" placeholder="輸入你的訊息。若是詢問店內特定商品，請留下商品名稱，也歡迎你留下電子信箱以外的聯絡方式，謝謝！"></textarea>
        <div class="error_color" v-if="error_text == 1"> 您的訊息 是必須的 </div>

        <div class="connect_button_container">
          <div class="connect_button" @click="connectHandler" >發送</div>
        </div>
      </div>
    </div>

    <div class="sidebar_container" :class="{sidebar_active : is_sidebar}" @mousedown="close_sidebar">
      <div class="sidebar" :class="{sidebar_slideout : is_slideout}">
        <div class="navbar">
          <ul>
            <li @click="urlPush('/')" >
              <div class="text">
                首頁
              </div>
            </li>

            <li v-for="(item, index) in all.Navbar" :key="item.ID" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)">
              <div class="text">
                {{ item.Name }}
                <div class="angle" @click.stop=" changeDropDown(index) ">
                  <i  class="fa fa-angle-down" :class="{i_active: item.isDropDown}" 
                    aria-hidden="true"
                    v-if="item.subNavbar"
                  >
                  </i>
                </div>
              </div>
              <template v-if="item.subNavbar">
                <ul :class="{ul_active: item.isDropDown}">
                  <li v-for="item2 in item.subNavbar" :key="item2.ID" @click.stop="urlPush(item2.Link)">
                    {{item2.Name}}
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </div>
        <div class="other">
          <div class="text">其他</div>
          <ul>
            <li @click="is_search = 1; is_sidebar = 0">
              搜尋
              <i class="fa fa-search" aria-hidden="true" @click="is_search = 1"></i>
            </li>
            <li @click.stop="is_favorite_hover = !is_favorite_hover; is_carts_hover = false">
              我的最愛
              <i class="fas fa-heart"></i>
            </li>
            <li @click.stop="carts.length ? is_carts_hover = !is_carts_hover : pushTo_cart(); is_favorite_hover = false">
              購物車
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </li>
            <li @click="urlPush('/order.html')">
              訂單查詢
              <i class="fas fa-clipboard-list"></i>
            </li>
            <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/user_info.html') : urlPush('/user.html')">
              會員登入
              <i class="fas fa-user"></i>
            </li>
            <li @click="open_connect">
              聯絡我們
              <i class="fa fa-comment" aria-hidden="true"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="scrollto_top" @click="scrollTo(0)" :class="{is_show: window_scrollTop > 100}">
      <i class="fa fa-arrow-up" aria-hidden="true"></i>
    </div>

    <div class="header" :class="{is_scrollTop: window_scrollTop > 100}">
      <div class="widthContainer">
        <div class="iconbar">
          <ul>
            <li class="search_button">
              <input type="text" maxlength="100" placeholder="找商品" v-model="searchStr" @keyup.enter="searchHandler">
              <i class="fa fa-search" aria-hidden="true" @click="searchHandler"></i>
            </li>

            <li class="m_search_button">
              <i class="fa fa-search" aria-hidden="true" @click="is_search = 1"></i>
            </li>

            <li class="connect_button" @click="open_connect">
              <i class="fa fa-comment" aria-hidden="true"></i>
            </li>
            <li @click.stop="is_favorite_hover = !is_favorite_hover; is_carts_hover = false">
              <i class="fas fa-heart"></i>
            </li>
            <li @click.stop="carts.length ? is_carts_hover = !is_carts_hover : pushTo_cart(); is_favorite_hover = false">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </li>
            <li @click="urlPush('/order.html')">
              <i class="fas fa-clipboard-list"></i>
            </li>
            <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/user_info.html') : urlPush('/user.html')">
              <i class="fas fa-user"></i>
            </li>
          </ul>
          <div class='navbar_button' @click="open_sidebar" :class="{is_background: window_scrollTop > 100}">
            <i class="fa fa-th-list" aria-hidden="true"></i>
          </div>
        </div>

        <div class="prev" @click="prev" :class="{ active : pathname !== '/' }">
          <img src=".././assets/img/arrow.png" alt="">
        </div>

        <div class="logo" v-if="store" @click="urlPush('/')">
          <img :src="store.Logo" alt="">
        </div>

        <div class="navbar">
          <ul>
            <li @click="urlPush('/')" >
              首頁
            </li>
            <li v-for="(item, key) in all.Navbar" :key="key" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)" >
              {{ item.Name }}
              <template v-if="item.subNavbar">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                <div class="transparent">  </div>
                <ul>
                  <li v-for="(item2, key2) in item.subNavbar" :key="key2" @click.stop="urlPush(item2.Link)">
                    <div> {{item2.Name}} </div>
                  </li>
                </ul>
              </template>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="carts_container" :class="{hover : is_carts_hover}" v-if="carts.length">
      <ul class="carts_items">
        <template v-for="item in carts" :key="item.ID">
          <!-- 有規格 -->
          <template v-if="item.specArr">
            <li v-for="spec in item.specArr " :key="spec.ID" v-show="spec.buyQty != 0 || spec.buyQty === ''" @click.stop="pushTo_cart(item.ID)">
              <div class="img_and_name">
                <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
                <div class="name"> {{ item.Name }}({{spec.Name}}) </div>
              </div>
              <div class="price_and_delete">
                <div class="price"> NT${{numberThousands(item.NowPrice)}} x {{spec.buyQty}}  </div>
                <div class="delete" @click.stop="delete_carts_item(item.ID, spec.ID)">
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
            </li>
          </template>
          <!-- 沒有規格 -->
          <li v-if="!item.specArr" @click.stop="pushTo_cart(item.ID)">
            <div class="img_and_name">
              <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
              <div class="name"> {{ item.Name }} </div>
            </div>
            <div class="price_and_delete">
              <div class="price"> NT${{numberThousands(item.NowPrice)}} x {{item.buyQty}}  </div>
              <div class="delete" @click.stop="delete_carts_item(item.ID)">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </li>

          <template v-if="item.addPrice">
            <template v-for=" (item2, index2) in item.addPrice">
              <!-- 有規格 -->
              <template v-if="item2.specArr">
                <li v-for="(spec2, specIndex2) in item2.specArr" :key="spec2.ID" v-show="spec2.buyQty != 0 || spec2.buyQty === ''" @click.stop="pushTo_cart(item.ID)">
                  <div class="img_and_name">
                    <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                    <div class="name"> 加價購 {{ item2.Name }}({{spec2.Name}}) </div>
                  </div>
                  <div class="price_and_delete">
                    <div class="price"> NT${{numberThousands(item2.Price)}} x {{spec2.buyQty}}  </div>
                    <!-- <div class="delete" @click.stop="spec2.buyQty = 0">
                      <i class="fas fa-trash-alt"></i>
                    </div> -->
                  </div>
                </li>
              </template>
              <!-- 沒有規格 -->
              <li v-if="!item2.specArr" @click.stop="pushTo_cart(item.ID)">
                <div class="img_and_name">
                  <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                  <div class="name"> 加價購 {{ item2.Name }} </div>
                </div>
                <div class="price_and_delete">
                  <div class="price"> NT${{numberThousands(item2.Price)}} x {{item2.Qty}}  </div>
                  <!-- <div class="delete" @click.stop="item2.buyQty = 0">
                    <i class="fas fa-trash-alt"></i>
                  </div> -->
                </div>
              </li>
            </template>
          </template>
        </template>
      </ul>
      <div class="pushTo_cart" @click.stop="pushTo_cart()">
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        前往購物車
      </div>
    </div>

    <div class="favorite_container" :class="{hover : is_favorite_hover}" v-if="Object.keys(favorite).length">
      <ul class="favorite_items">
        <template v-for="item in favorite" :key="item.ID">
          <li @click.stop="pushTo_cart(item.ID)">
            <div class="img_and_name">
              <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
              <div class="name"> {{ item.Name }} </div>
            </div>
            <div class="price_and_delete">
              <div class="price"> NT${{numberThousands(item.NowPrice)}} </div>
              <div class="delete" @click.stop="toggleFavorite(item.ID)">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
    
    <slot></slot>
    
    <div class="footer">
      <div class="link_list">
        <ul>
          <li>
            <div class="title">關於我們</div>
            <ul class="link">
              <li  v-for="item in all.about" :key="item.ID" @click="urlPush(item.Link)">
                {{item.Name}}
              </li>
            </ul>
          </li>
          <li>
            <div class="title link">顧客服務</div>
            <ul class="link">
              <li v-for="item in all.client" :key="item.ID" @click="urlPush(item.Link)">
                {{item.Name}}
              </li>
            </ul>
          </li>
          <li>  
            <div class="title">聯絡我們</div>     	 
            <ul v-if="all.contact && all.contact.length">
              <li v-if="all.contact[0].Phone">
                客服電話｜{{all.contact[0].Phone}}
              </li>
              <li v-if="all.contact[0].Email">
                客服信箱｜{{all.contact[0].Email}}
              </li>
              <li v-if="all.contact[0].Open">
                服務時間｜{{all.contact[0].Open}}
              </li>

              <li v-if="footer_community">
                <ul>
                  <li v-if="footer_community.FBLink" @click="urlPush(footer_community.FBLink, 1)">
                    <img src=".././assets/img/fb.png" alt="">
                  </li>
                  <li v-if="footer_community.LineLink" @click="urlPush(footer_community.LineLink, 1)">
                    <img src=".././assets/img/line.png" alt="">
                  </li>
                  <li v-if="footer_community.IGLink" @click="urlPush(footer_community.IGLink, 1)">
                    <img src=".././assets/img/ig.png" alt="">
                  </li>
                </ul>
              </li>
              
            </ul>
          </li>
        </ul>
      </div>

      <div class="footer_text" v-if="copyRight && copyRight.Footer">{{copyRight.Footer.trim()}}</div>
      <div class="copyright" v-if="copyRight && copyRight.Text"> {{copyRight.Text}} </div>
      <div class="copyright" v-else> Copyright © 2021 HONG BO Technology </div>  

      <div class="credit_list">
        <ul>
          <li v-if="site.PayStatus * 1">
            <img src="https://d.line-scdn.net/linepay/portal/assets/img/portal/tw/logo.svg" alt="">
          </li>
        </ul>
      </div>

      <Cookie />
    </div>
    
    <!-- chat controler -->
    <div class="chat_controler" v-show="customerService.Text || customerService.CSText || customerService.FBText" 
      @click="is_chat = !is_chat">
      <i class="fa-solid fa-comment-dots" v-if="!is_chat"></i>
      <i class="fa-solid fa-comment-slash" v-else></i>
    </div>

    <!-- fb -->
    <div id="fb-root"></div>
    <div id="fb-customer-chat" class="fb-customerchat"></div>

    <!-- line -->
    <div class="line_icon" v-if="customerService && customerService.CSText" @click="urlPush(customerService.CSText, true)">
      <img src="../assets/img/line_icon.png" alt="">
    </div>
  </div>
</template>

<script>
import Cookie from './Cookie.vue'

export default {
  component: {
    Cookie
  },
  props: ['json_site', 'json_all', 'json_store', 'json_footer_community', 'json_copyRight', 'json_customerService', 'json_carts', 'json_favorite', 'user_account'],
  data(){
    return{
      // ajax
      site: '',
      all: '',
      store: '',
      footer_community: '',
      copyRight: '',
      customerService: '',
      carts: [],
      is_carts_hover: false,
      favorite: {},
      is_favorite_hover: false,

      api: '',
      protocol: '',

      // 
      pathname: 'other',

      //
      is_chat: false,
      isTawkAddClick: false,
      isTawkOpen: false,

      // search
      is_search: 0,
      searchStr: '',

      // connect
      is_connect: 0,

      connect_mail: '',
      connect_text: '',
      error_mail: 0,
      error_text: 0,

      // sidebar
      is_sidebar: 0,
      is_slideout: 0,

      // scrollto_top
      window_scrollTop: 0,
    }
  },
  watch:{
    json_site(){
      this.site = JSON.parse(this.json_site);
    },
    json_all(){
      this.all = JSON.parse(this.json_all);
    },
    json_store(){
      this.store = JSON.parse(this.json_store);
    },
    json_footer_community(){
      this.footer_community = JSON.parse(this.json_footer_community);
    },
    json_copyRight(){
      this.copyRight = JSON.parse(this.json_copyRight);
    },
    json_customerService(){
      this.customerService = JSON.parse(this.json_customerService);
    },
    json_carts(){
      this.carts = JSON.parse(this.json_carts);
    },
    json_favorite(){
      this.favorite = JSON.parse(this.json_favorite);
    },
    is_chat(val) {
      let vm = this;
      let arr = [];

      let tawkbutton;
      let tawkchat;
      let tawks = document.querySelectorAll('.widget-visible iframe')
      if (tawks.length) {
        tawks[0].style.transition = '.5s';
        tawkbutton = tawks[0].contentWindow.document.querySelector('button');
        tawkchat = tawks[1];

        // 綁定 click 
        if(!this.isTawkAddClick) {
          tawkbutton.addEventListener('click', function() {
            if(vm.isTawkOpen) {
              setTimeout(()=>{
                tawkchat.style.bottom = parseInt(window.getComputedStyle(tawks[0]).bottom) + 70 + 'px';
                tawkchat.style.right = 95 + 'px';
              }, 0)
            } else {
              tawkchat.style.bottom = parseInt(window.getComputedStyle(tawks[0]).bottom) + 'px';
              tawkchat.style.right = 95 + 'px';
            }
          })
          this.isTawkAddClick = true
        }

        if(this.isTawkOpen) {
          tawkbutton.click()
          this.isTawkOpen = false;
        }

        arr.push(tawks)
      }

      let line = document.querySelector('.line_icon')
      if (line) arr.push(line)

      let fbchat;
      let fbs = document.querySelectorAll('.fb_dialog iframe')
      if(fbs.length) {
        for(let item of fbs) {
          item.style.transition = '.5s';
        }
        fbchat = document.querySelector('.fb_iframe_widget iframe')
        fbchat.style.height =  550 + 'px';
        fbchat.style.right =  95 + 'px';
        arr.push(fbs)
      }

      if(val) {
        let bottom = 90;
        for(let item of arr) {
          // line
          if(!item.length) {
            item.style.bottom = bottom + 'px'
          }
          // tawk 
          else if(item[0].parentNode.classList.contains('widget-visible')) {
            // chat 開關
            if(tawkchat.classList.contains('open')){
              setTimeout(()=>{
                tawkchat.style.display = 'block'; 
              }, 200)
            }

            // icon 移動
            item[0].style.bottom = bottom + 'px'
          }
          // fb
          else {
            // chat 開關
            if(fbchat.style.maxHeight != '0px'){
              fbchat.style.display = 'block'
            }

            // icon 移動
            item[0].style.bottom = bottom + 'px'
            item[1].style.bottom = bottom - 2.5 + 'px';
            item[2].style.bottom = bottom + 44 + 'px';

            // chat 移動
            fbchat.style.bottom =  bottom - 10 + 'px';
          }

          bottom += 70;
        }
      }
      else {
        for(let item of arr) {
          // line
          if(!item.length) {
            item.style.bottom = '20px'
          }
          // tawk
          else if(item[0].parentNode.classList.contains('widget-visible')) {
            // chat 開關
            if(tawkchat.classList.contains('open')){
              tawkchat.style.display = 'none';
            }

            // icon 移動
            item[0].style.bottom = '20px'
          }
          // fb
          else {
            // chat 開關
            if(fbchat.style.maxHeight != '0px'){
              fbchat.style.display = 'none'
            }

            // icon 移動
            for(let item2 of item) {
              item2.style.bottom = '20px'
            }
          }
        }
      }
    }
  },
  computed:{
  },
  methods: {
    // search
    close_search(event){
      let vm = this;
      if(event.target.className.indexOf('search_container')>-1){
        vm.is_search = 0;
        vm.searchStr = '';
      }
    },
    searchHandler(){
      if(this.searchStr){
        this.urlPush(`/search.html?query=${this.searchStr}&type=0`);
      }
    },

    // 
    resizeHandler(){
      // this.is_search = 0;
      // this.searchStr = '';

      document.querySelector('body').style['padding-top'] = document.querySelector('.header').getBoundingClientRect().height + 'px';
    },

    // connect
    open_connect(){
      if(this.site.WebPreview == 2){
        alert('預覽模式下不開放');
      }
      else{
        this.is_sidebar = 0; 
        this.is_slideout = 0; 
        this.is_connect = 1;
      }
    },
    close_connect(event){
      let vm = this;
      if(event.target.className.indexOf('connect_container')>-1){
        vm.is_connect = 0;

        vm.connect_mail = '';
        vm.connect_text = '';
        vm.error_mail = 0;
        vm.error_text = 0;
      }
    },

    validate_connect( item ){
      let isReturn = false;
      let RegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]+)$/;

      // mail 驗證
      if( !item || (item && item == 'mail') ){
        if(this.connect_mail === ''){
          this.error_mail = 1;
          isReturn = true;
        }
        else if(!RegExp.test(this.connect_mail)){
          this.error_mail = 2;
          isReturn = true;
        }
        else{
          this.error_mail = 0;
        }
      }

      // text 驗證
      if( !item || (item && item == 'text') ){
        if(this.connect_text === ''){
          this.error_text = 1;
          isReturn = true;
        }
        else{
          this.error_text = 0;
        }
      }

      return isReturn;
    },
    connectHandler(){
      let vm = this;

      let isReturn = this.validate_connect();
      if(isReturn){
        return;
      }
      else{
        let site_webPreview = (JSON.parse(localStorage.getItem('site')).WebPreview || '') ;

        let formData = new FormData();
        formData.append("title", this.connect_mail);
        formData.append("text", this.connect_text);
        formData.append("WebPreview", site_webPreview);

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.open('POST',`${this.protocol}//${this.api}/interface/web/PostFeedback`, true);
        xhr.send(formData);
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            if(JSON.parse(xhr.response).errormessage){
              vm.$bus.$emit('login');
              alert('請再發送一次');
              return;
            }

            vm.is_connect = 0;

            vm.connect_mail = '';
            vm.connect_text = '';
            vm.error_mail = 0;
            vm.error_text = 0;

            alert('發送成功');
          }
        }
      }
    },

    //
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
    numberThousands(number) {
      return String(number).replace( /(\d)(?=(?:\d{3})+$)/g, '$1,')
    },

    // sidebar
    open_sidebar(){
      const vm = this;
      vm.is_sidebar = 1;
      setTimeout(function(){
        vm.is_slideout = 1;
      }, 100)
    },
    close_sidebar(event){
      let vm = this;
      if(event.target.className.indexOf('sidebar_container')>-1){
        vm.is_slideout = 0;
        setTimeout(function(){
          vm.is_sidebar = 0;
        }, 350)
      }
    },
    changeDropDown(index){
      this.$bus.$emit('changeDropDown', index);
    },

    // 
    toggleFavorite(id) {
      this.$bus.$emit('toggleFavorite', id);
    },

    // scroll
    scrollTo(targetOffsetTop) {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let step = 50;

      function move(){
        if (scrollTop > targetOffsetTop) {
          scrollTop = scrollTop - step < targetOffsetTop ? targetOffsetTop : scrollTop - step ;
        }
        else if(scrollTop < targetOffsetTop) {
          scrollTop = scrollTop + step > targetOffsetTop ? targetOffsetTop : scrollTop + step ;
        }
        else {
          clearInterval(interval);
        }
        document.body.scrollTop = scrollTop;
        document.documentElement.scrollTop = scrollTop;
      }
      let interval = setInterval(move, 10);
    },
    scrollHandler(){
      this.window_scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    },

    // urlPush 
    urlPush(url, isOpen){
      this.$bus.$emit('urlPush', url, isOpen);
    },
    pushTo_cart(id){
      this.$bus.$emit('pushTo_cart', id);
    },
    prev(){
      window.history.go(-1);
    },
  },
  created(){
    this.api = location.host;
    this.protocol = location.protocol;

    let pathname = location.pathname;
    if( pathname === '/' || pathname === '/index.html'){
      this.pathname = '/';
    }
  },
  mounted(){
    let vm = this;
    window.addEventListener('scroll', this.scrollHandler);
    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener("webkitAnimationStart", function(event){
      if (event.animationName === "fbchatInserted") {
        let iframe = event.target.querySelector('iframe');

        let observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if(mutation.attributeName == 'style') {
              if(mutation.target.style.maxHeight.indexOf('px') > -1) {
                let fb = document.querySelector('#fb-root')
                let icon = document.querySelector('.fb_dialog iframe')
                // icon 移動
                icon.style.bottom = '20px';
                icon.style['box-shadow'] = 'none'; 
                // icon 顯示
                setTimeout(()=>{
                  fb.style.opacity = 1;
                }, 1000)

                // chat 開關
                console.log('chatHeight', mutation.target.style.maxHeight)
                if(mutation.target.style.maxHeight != '0px'){
                  // 隱藏
                  iframe.style.display = 'none';
                }
                // 取消
                observer.disconnect();
              }
            }
          });
        });
        observer.observe(iframe, {attributes: true});
      }
      else if(event.animationName === "tawkchatInserted") {
        let iframe = event.target;
        let iframeStyle = window.getComputedStyle(iframe)
        if(iframeStyle.display.indexOf('block') > -1){
          setTimeout(()=>{
            let tawkbutton = document.querySelector('.widget-visible iframe').contentWindow.document.querySelector('button');
            tawkbutton.click();
            vm.isTawkOpen = true;
          }, 0)
        }
      }
    });
  }
}
</script>