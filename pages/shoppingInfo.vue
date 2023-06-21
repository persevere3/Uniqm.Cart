<style lang="scss">
  @import "../assets/scss/shoppingInfo.scss";
</style>

<template>
  <Info />
  <Pay />
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store
  import { useCommon }  from '@/stores/common/common'
  import { useShopping }  from '@/stores/shopping'

  let { site, is_getSite, all, store, user_account, favorite, webVersion } = storeToRefs(useCommon())
  let { toggleFavorite, pagePush, pushTo_cart, urlPush, numberThousands } = useCommon()
  let { categories, products, active_category_id, search_text } = storeToRefs(useShopping())
  let { getCategories, getProducts } = useShopping()

  const state = reactive({

  })
  let {  } = toRefs(state)

  definePageMeta({
    layout: 'uniqm'
  })

  // computed ==================================================

  // watch ==================================================
  watch(is_getSite, async() => {
    getCategories()
    getProducts()

    const { account } = useRoute().query
    if(account) {
      user_account.value = account
      localStorage.setItem('user_account', account)
    }
  },)

  // methods ==================================================
  

</script>