<template>
  <div>
    <LayoutFavoriteContainer />

    <LayoutCartContainer />

    <header>
      <div class="logo" v-if="store">
        <a @click="urlPush(getPathname('index'))">
          <img :src="store.Logo" alt="">
        </a>
      </div>
      <div class="menu">
        <ul>
          <li @click="urlPush(getPathname('index'))"><i class="fa-solid fa-house"></i> <span class="none650"> 首頁 </span></li>
          <li @click.stop="is_favorite_active = !is_favorite_active" tabindex="0" @blur="is_favorite_active = false"> 
            <i class="fa-solid fa-heart"></i>
            <span class="none650"> 收藏 </span> 
          </li>
          <li @click.stop="cart.length ? is_carts_active = !is_carts_active : pushTo_cart();" tabindex="0" @blur="is_carts_active = false"> 
            <i class="fa-solid fa-cart-shopping"></i> 
            <span class="none650"> 購物車 </span> 
          </li>
          <li @click="urlPush('/shoppingOrder')">
            <i class="fas fa-clipboard-list"></i>
            <span class="none650"> 訂單 </span>
          </li>
          <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/shoppingInfo') : urlPush('/shoppingUser')">
            <i class="fa-solid fa-user"></i> 
            <span class="none650"> 會員中心 </span>
          </li>
        </ul>
      </div>
    </header>
    
    <slot />

    <footer>
      <div class="footerContact">
        <div class="footerContainer">
          <div class="w33">
            <p>智聯微網 統編: 42872739 </p>
            <p>台中市西屯區市政路386號四樓三</p>          
            <p>04-22520766</p>

            <a href="./privacy.html"> 隱私權政策 </a>
            <a href="./member-benefits.html"> 會員權益聲明 </a>
            <a href="./return.html"> 退換貨說明 </a>
          </div>
          <div class="w33">
            <div style="text-align:center; margin-bottom: 5px;"> 聯繫我們 </div>
            <a href="https://line.me/ti/p/@uniqm" target="_blank"> <img src="/image/qr-line.png" alt=""> </a>
            <!-- <span class="faicon"><i class="fa-brands fa-facebook-f"></i></span> -->
          </div>
        </div>
      </div>

      <div class="copyright">
        <div class="footerContainer">
          <p>Copyright &copy; 2023 - All Rights Reserved - UNIQ Micronet . </p>
        </div>
      </div>
      <Cookie />
    </footer>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'
  import { useHandlerCommon }  from '@/stores/handlerCommon'

  let { site, user_account, store, cart, is_carts_active, is_favorite_active } = storeToRefs(useCommon())
  let { pushTo_cart, getPathname, urlPush } = useCommon()
  let { getSiteHandler } = useHandlerCommon()

  // state ==================================================
  const state = reactive({
    
  })
  let {  } = toRefs(state)

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
    site.value = JSON.parse(localStorage.getItem('site')) || {} ;
    user_account.value = localStorage.getItem('user_account')

    await getSiteHandler()
  })

  // watch ==================================================
  

  // function ==================================================
</script>