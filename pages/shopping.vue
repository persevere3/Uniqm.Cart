<style lang="scss">
  @import "../assets/scss/shopping.scss";
</style>

<template>
  <div class="main">
    <div class="category">
      <ul v-if="categories">
        <li v-for="item in categories" :key="item.ID" :class="{active : active_category_id == item.ID }" @click="active_category_id = item.ID"> {{ item.Name }} </li>
      </ul>

      <div class="searchContainer">
        <input type="text" placeholder="搜尋" v-model.trim="search_text">
        <div class="icon"> <i class="fa-solid fa-magnifying-glass"></i> </div>
      </div>
    </div>

    <div class="uniqm_products">
      <div class="productsTitle"> 推薦商品 | RECOMMEND </div>
      <ul>
        <li v-for="item in filter_products" :key="item.ID" @click="pushTo_cart(item.ID)">
          <div class="image"><img :src="item.Img1" alt=""></div>
          <div class="name">{{ item.Name }}</div>
          <div class="priceAndControl">
            <div class="price">NT {{ item.NowPrice }}</div>
            <div class="control">
              <i class="fa-solid fa-heart" :class="{is_favorite : favorite[item.ID]}" @click.stop="toggleFavorite(item.ID)"></i>
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>

  </div>
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
  let filter_products = computed(() => {
    if(active_category_id.value == 0) {
      if(search_text.value) {
        return products.value.filter(item => item.Name.indexOf(search_text.value) > -1)
      } else {
        return products.value
      }
    }
    return products.value.filter(item => {
      let category_arr = [item.Category1, item.Category2, item.Category3, item.Category4, item.Category5]
      return category_arr.indexOf(active_category_id.value) > -1 && (search_text.value ? item.Name.indexOf(search_text.value) > -1 : true) 
    })
  })

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