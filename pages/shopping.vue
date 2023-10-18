<style lang="scss" scoped>
  @import "@/assets/scss/pages/shopping.scss";
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

    <div class="products">
      <div class="productsTitle"> 推薦商品 | RECOMMEND </div>
      <ul>
        <li v-for="item in filter_products" :key="item.ID" @click="pushTo_cart(item.ID)">
          <div class="image"><img :src="item.Img1" alt=""></div>
          <div class="name">{{ item.Name }}</div>
          <div class="priceAndControl">
            <!-- 多價格 products 主商品 單價 -->
            <div class="price" v-if="item.PriceType === 'onePrice'"> NT${{ useNumberThousands(item.NowPrice) }} </div>
            <div class="price" v-else> NT${{ item.nowPriceRange }} </div>

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
  // composables ========== ========== ========== ========== ==========
  import { useNumberThousands } from '@/composables/numberThousands'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useCommon }  from '@/stores/web/common/common'
  import { useShopping }  from '@/stores/web/shopping'

  let { is_getSite, user_account, favorite } = storeToRefs(useCommon())
  let { toggleFavorite, pushTo_cart } = useCommon()
  let { categories, products, active_category_id, search_text } = storeToRefs(useShopping())
  let { getCategories, getProducts } = useShopping()

  definePageMeta({
    layout: "uniqm",
  });

  // computed ========== ========== ========== ========== ==========
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

  const { account } = useRoute().query
  if(account) {
    user_account.value = account
    localStorage.setItem('user_account', account)
  }

  // watch ========== ========== ========== ========== ==========
  watch(is_getSite, async() => {
    await getCategories()
    await getProducts()
  },)
</script>