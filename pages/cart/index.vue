<style lang="scss">
  @import "@/assets/scss/pages/cart.scss";
</style>

<template>
  <div class="productContainer" @click.stop="isShowFavorite = false">
    <SelectProduct v-if="selectProduct.ID" :style="`height:${innerHeight}px`" />
    <Cart v-if="showPage === 'cart'" :style="`height:${innerHeight}px`" />
    <!-- 訂購須知 配送須知 隱私權聲明 -->
    <Notice v-if="showPage === 'Content' || showPage === 'Description' || showPage === 'PrivacyPolicy'" :style="`height:${innerHeight}px`"/>
    
    <Main v-if="showPage === 'main'" />
  
    <CartIcon v-if="showPage === 'main' && !selectProduct.ID" />
    <FavoriteIcon v-if="showPage === 'main' && !selectProduct.ID && Object.keys(favorite).length"/>

    <Confirm />
    <Message />
    <Cookie />
  </div>
</template>

<script setup>
  // components ========== ========== ========== ========== ==========
  import SelectProduct from '@/components/cart/SelectProduct'
  import Cart from '@/components/cart/cart/Cart'

  import Notice from '@/components/cart/Notice.vue'
  import Main from '@/components/cart/Main.vue'

  import CartIcon from '@/components/cart/CartIcon.vue'
  import FavoriteIcon from '@/components/cart/FavoriteIcon.vue'

  import Confirm from '@/components/cart/Confirm.vue'
  import Message from '@/components/cart/Message.vue'
  import Cookie from '@/components/Cookie.vue'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useCommon }  from '@/stores/cart/common/common'
  import { useProducts }  from '@/stores/cart/products'
  import { useCart }  from '@/stores/cart/cart'
  import { useInfo }  from '@/stores/cart/info'
  import { useHandlerCommon }  from '@/stores/cart/handlerCommon'

  let { user_account, isShowFavorite, showPage } = storeToRefs(useCommon())
  let { selectProduct, isSingleProduct, favorite } = storeToRefs(useProducts())
  let { stepPage, total_bonus } = storeToRefs(useCart())
  let { info, userInfo } = storeToRefs(useInfo())
  let { getSiteHandler } = useHandlerCommon()

  definePageMeta({
    layout: false,
  });

  // head ========== ========== ========== ========== ==========
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

  // state ========== ========== ========== ========== ==========
  const state = reactive({
    innerHeight: 0,
  })
  let { innerHeight } = toRefs(state)

  // onMounted ========== ========== ========== ========== ==========
  onMounted(() => {
    getSiteHandler();

    state.innerHeight = window.innerHeight;
    window.onresize = () => {
      state.innerHeight = window.innerHeight;
      computeVideoSize()
    }
  })

  // watch ========== ========== ========== ========== ==========
  watch(showPage, (newV, oldV) => {
    if(newV == 'cart') stepPage.value = 1

    if(newV === 'Content' || newV === 'Description' || newV === 'PrivacyPolicy') {
      setTimeout(() => {
        computeVideoSize(newV);
      }, 0)
    }
  })

  watch(selectProduct, (newV, oldV) => {
    if(newV.ID) {
      if(!isSingleProduct.value) window.history.replaceState({}, '', `${location.pathname}?id=${newV.ID}`)
      else window.history.replaceState({}, '', `${location.pathname}?spid=${newV.ID}`)
      setTimeout(() => {
        let event = new Event('resize');
        window.dispatchEvent(event);
      }, 100)
    }
    else window.history.replaceState({}, '', `${location.pathname}`)
  })

  watch(user_account, (newV, oldV) => {
    console.log('watch: user_account', newV, oldV)
    localStorage.setItem('user_account', newV);

    if(!newV) {
      info.value.purchaser_email.value = '';
      info.value.purchaser_name.value = '';
      info.value.purchaser_number.value = '';
      info.value.receiver_name.value = '';
      info.value.receiver_number.value = '';

      userInfo.value = {};
    }
  })

  watch(userInfo, (newV, oldV) => {
    if(!newV.Phone && !newV.Email) {
      user_account.value = '';
    }
    total_bonus.value = newV.Wallet * 1
  }, {deep: true})

  // methods ========== ========== ========== ========== ==========
  function computeVideoSize() {
    let content = document.querySelector('.content.ql-editor')
    if(!content) return
    let contentWidth = content.offsetWidth
    if(showPage.value == 'main') contentWidth -= 20
    let videos = content.querySelectorAll('iframe');
    videos.forEach(video => {
      if(video.width > contentWidth) {
        video.style.width = `${contentWidth}px`;
        video.style.height = `${video.height/ (video.width/contentWidth)}px`;
      }
    })
  }
</script>