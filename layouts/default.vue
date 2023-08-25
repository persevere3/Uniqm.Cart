<style lang="scss" scoped>  
  @import "@/assets/scss/layout/default.scss";
</style>

<template>
  <div>
    <!-- click right-top icon -------------------------------------------------- -->
    <div class="search_container" :class="{active : is_search}" @click="close_search">
      <div class="search" @click.stop="">
        <i class="fa fa-search" aria-hidden="true" @click="searchHandler"></i>
        <input type="text" maxlength="100" placeholder="找商品" v-model="searchStr" @keyup.enter="searchHandler">
      </div>
    </div>

    <div class="connect_container" :class="{active : is_connect}" @click="close_connect">
      <div class="connect" @click.stop="">
        <div class="text">聯絡我們</div>
        <input type="text" placeholder="輸入您的電子信箱" :class="{error_border: connect_mail.is_error}" 
          v-model="connect_mail.value" @input="verify(connect_mail)"
        >
        <div class="error_color" v-if="connect_mail.message"> {{ connect_mail.message }} </div>

        <textarea rows="5" placeholder="輸入您的訊息。若是詢問店內特定商品，請留下商品名稱，也歡迎你留下電子信箱以外的聯絡方式，謝謝！"
          :class="{error_border: connect_text.is_error}"
          v-model.trim="connect_text.value" @input="verify(connect_text)" ></textarea>
        <div class="error_color" v-if="connect_text.message"> {{ connect_text.message }} </div>

        <div class="connect_button_container">
          <div class="connect_button" @click="connectHandler" >發送</div>
        </div>
      </div>
    </div>

    <LayoutFavoriteContainer />
    <LayoutCartContainer />

    <div class="sidebar_container" :class="{active : is_sidebar}" @click="close_sidebar">
      <div class="sidebar" :class="{sidebar_slideout : is_slideout}" @click.stop="">
        <div class="navbar">
          <ul>
            <li @click="urlPush('/')" >
              <div class="text">
                首頁
              </div>
            </li>

            <li v-for="(item) in all.Navbar" :key="item.ID" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)">
              <div class="text">
                {{ item.Name }}
                <div class="angle" @click.stop="item.isDropDown = !item.isDropDown">
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
            <li @click="is_search = true; is_sidebar = false">
              搜尋
              <i class="fa fa-search" aria-hidden="true"></i>
            </li>
            <li @click.stop="is_favorite_active = !is_favorite_active" tabindex="0" @blur="is_favorite_active = false">
              我的最愛
              <i class="fas fa-heart"></i>
            </li>
            <li @click.stop="cart.length ? is_cart_active = !is_cart_active : pushTo_cart()" tabindex="0" @blur="is_cart_active = false">
              購物車
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </li>
            <li @click="urlPush('/order')">
              訂單查詢
              <i class="fas fa-clipboard-list"></i>
            </li>
            <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/user_info') : urlPush('/user')">
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

    <!-- content -------------------------------------------------- -->
    <header class="header" 
      :class="{ 
        index: pathname === 'index',
        other: pathname !== 'index',
        is_scrollTop: window_scrollTop > 100
      }"
    >
      <div class="widthContainer">
        <div class="iconbar">
          <ul>
            <li class="search_button">
              <input type="text" maxlength="100" placeholder="找商品" v-model="searchStr" @keyup.enter="searchHandler">
              <i class="fa fa-search" aria-hidden="true" @click="searchHandler"></i>
            </li>

            <li class="m_search_button">
              <i class="fa fa-search" aria-hidden="true" @click="is_search = true"></i>
            </li>

            <li class="connect_button" @click="open_connect">
              <i class="fa fa-comment" aria-hidden="true"></i>
            </li>
            <li @click.stop="is_favorite_active = !is_favorite_active" tabindex="0" @blur="is_favorite_active = false">
              <i class="fas fa-heart"></i>
            </li>
            <li @click.stop="cart.length ? is_cart_active = !is_cart_active : pushTo_cart()" tabindex="0" @blur="is_cart_active = false">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </li>
            <li @click="urlPush('/order')">
              <i class="fas fa-clipboard-list"></i>
            </li>
            <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/user_info') : urlPush('/user')">
              <i class="fas fa-user"></i>
            </li>
          </ul>
          <div class='navbar_button' @click="open_sidebar" :class="{is_background: window_scrollTop > 100}">
            <i class="fa fa-th-list" aria-hidden="true"></i>
          </div>
        </div>

        <div class="prev" @click="prev">
          <img src="@/assets/img/arrow.png" alt="">
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
    </header>

    <slot />

    <footer class="footer">
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
                    <img src="@/assets/img/fb.png" alt="">
                  </li>
                  <li v-if="footer_community.LineLink" @click="urlPush(footer_community.LineLink, 1)">
                    <img src="@/assets/img/line.png" alt="">
                  </li>
                  <li v-if="footer_community.IGLink" @click="urlPush(footer_community.IGLink, 1)">
                    <img src="@/assets/img/ig.png" alt="">
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

      <!-- <Cookie /> -->
    </footer>

    <!-- fixed -------------------------------------------------- -->
    <div class="scrollto_top" @click="scrollto(0)" :class="{is_show: window_scrollTop > 100}">
      <i class="fa fa-arrow-up" aria-hidden="true"></i>
    </div>

    <!-- chat controler -->
    <div class="chat_controler" @click="is_chat = !is_chat"
      v-show="customerService.Text || customerService.CSText || customerService.FBText" 
    >
      <i class="fa-solid fa-comment-dots" v-if="!is_chat"></i>
      <i class="fa-solid fa-comment-slash" v-else></i>
    </div>

    <!-- fb -->
    <div id="fb-root"></div>
    <div id="fb-customer-chat" class="fb-customerchat"></div>

    <!-- line -->
    <div class="line_icon" v-if="customerService && customerService.CSText" @click="urlPush(customerService.CSText, true)">
      <img src="@/assets/img/line_icon.png" alt="">
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import { connectHandlerApi } from '@/api/index.js'

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'
  import { useVerify } from '@/stores/cross/verify'
  import { useHandlerCommon }  from '@/stores/handlerCommon'

  let { site, user_account, all, store, footer_community, copyRight, customerService, 
    pathname, cart, is_cart_active, is_favorite_active
  } = storeToRefs(useCommon())
  let { pushTo_cart, urlPush } = useCommon()
  let { reset, verify } = useVerify()
  let { getSiteHandler } = useHandlerCommon()

  // state ==================================================
  const state = reactive({
    //
    is_chat: false,
    isTawkAddClick: false,
    isTawkOpen: false,

    // search
    is_search: false,
    searchStr: '',

    // connect
    is_connect: false,
    connect_mail: {
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
    connect_text: {
      value: '',
      rules: {
        required: {
          message: '此項目為必填'
        },
      },
      is_error: false,
      message: '',
    },

    // sidebar
    is_sidebar: false,
    is_slideout: false,

    // scrollto_top
    window_scrollTop: 0,
  })
  let { is_search, searchStr, is_sidebar, is_slideout, is_connect, 
    connect_mail, connect_text, window_scrollTop, 
    is_chat, isTawkAddClick, isTawkOpen 
  } = toRefs(state)

  // head ==================================================
  useHead({
    link: [
      { 
        rel: 'stylesheet', 
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        integrity: 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==', 
        crossorigin: 'anonymous' 
      }
    ],
  })

  // onMounted ==================================================
  onMounted(async() => {
    if(!site.value.site) {
      site.value = JSON.parse(localStorage.getItem('site')) || null ;
      user_account.value = localStorage.getItem('user_account')
      await getSiteHandler()
    }

    window.addEventListener('scroll', scrollHandler);
    window.addEventListener('resize', resizeHandler);
    window.addEventListener("webkitAnimationStart", function(event) {
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
            isTawkOpen.value = true;
          }, 0)
        }
      }
    });
  })

  // watch ==================================================
  watch(is_chat, (val) => {
    let arr = [];

    let tawkbutton;
    let tawkchat;
    let tawks = document.querySelectorAll('.widget-visible iframe')
    if (tawks.length) {
      tawks[0].style.transition = '.5s';
      tawkbutton = tawks[0].contentWindow.document.querySelector('button');
      tawkchat = tawks[1];

      // 綁定 click 
      if(!state.isTawkAddClick) {
        tawkbutton.addEventListener('click', function() {
          if(state.isTawkOpen) {
            setTimeout(()=>{
              tawkchat.style.bottom = parseInt(window.getComputedStyle(tawks[0]).bottom) + 70 + 'px';
              tawkchat.style.right = 95 + 'px';
            }, 0)
          } else {
            tawkchat.style.bottom = parseInt(window.getComputedStyle(tawks[0]).bottom) + 'px';
            tawkchat.style.right = 95 + 'px';
          }
        })
        state.isTawkAddClick = true
      }

      if(state.isTawkOpen) {
        tawkbutton.click()
        state.isTawkOpen = false;
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
          if(tawkchat.classList.contains('open')) {
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
  })

  // function ==================================================
  // search
  function close_search() {
    state.is_search = false;
    state.searchStr = '';
  }
  function searchHandler() {
    if(state.searchStr) {
      urlPush(`/search?query=${state.searchStr}&type=0`);
    }
  }

  // connect
  function open_connect() {
    if(site.value.WebPreview == 2) alert('預覽模式下不開放')
    else {
      state.is_sidebar = false; 
      state.is_slideout = false; 
      state.is_connect = true;
    }
  }
  function close_connect() {
    state.is_connect = false;

    reset(state.connect_mail)
    reset(state.connect_text)
  }
  async function connectHandler() {
    let isValid = verify(state.connect_mail, state.connect_text);
    if(!isValid) return
    else {
      let formData = new FormData();
      formData.append("title", state.connect_mail.value);
      formData.append("text", state.connect_text.value);
      formData.append("WebPreview", site.value.WebPreview);

      try {
        let res = await connectHandlerApi(params)
        if(res.data.errormessage) {
          await login();
          connectHandler();
          return
        }

        state.is_connect = false;

        reset(state.connect_mail)
        reset(state.connect_text)

        alert('發送成功');
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  // sidebar
  function open_sidebar() {
    state.is_sidebar = true;
    setTimeout(function(){
      state.is_slideout = true;
    }, 100)
  }
  function close_sidebar() {
    state.is_slideout = false;
    setTimeout(function(){
      state.is_sidebar = false;
    }, 350)
  }

  // scroll
  function scrollto(targetOffsetTop) {
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
  }
  function scrollHandler() {
    state.window_scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  }

  // 
  function resizeHandler() {
    document.querySelector('body').style['padding-top'] = document.querySelector('.header').getBoundingClientRect().height + 'px';
  }

  function prev() {
    window.history.go(-1);
  }

</script>