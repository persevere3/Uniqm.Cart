<style lang="scss" scoped>
  @import "@/assets/scss/search.scss";
</style>

<template>
  <div class="breadcrumb">
    <div class="container" v-if="search_title">
      找商品 / {{search_title}}
    </div>
  </div>

  <div class="main" v-if="search">
    <template v-if="search.length">
      <div class="product_list">
        <div class="top">
          <div class="perpageNum_select">
            <div class="select">
              {{sortBy_arr[sortBy_index]}}
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <ul>
              <li v-for="(item, index) in sortBy_arr" :key="index" 
                  @click="getSearch('' + index)">
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="perpageNum_select">
            <div class="select">
              每頁顯示 {{ perpage_num }} 個
              <i class="fa fa-angle-down" aria-hidden="true"></i>
            </div>
            <ul>
              <li v-for="(item, index) in perpage_num_arr" :key="index" 
                  @click="perpage_num = item; 
                  totalpage_num = Math.ceil(search.length / perpage_num); 
                  page_active = 1;
              ">
                每頁顯示 {{ item }} 個
              </li>
            </ul>
          </div>
        </div>
        <ul>
          <li v-for="(item, index) in search" :key="item.ID"
              v-show="page_active * perpage_num - (perpage_num + 1)  < index && index < page_active * perpage_num"
              @click="pushTo_cart(item.ID)"
          >
            <div class="pic" :style="{backgroundImage: `url(${item.Img || item.Img1})`}">
              <div class="addTo_favorite_btn" @click.stop="toggleFavorite(item.ID)">
                加入我的最愛 <i class="fas fa-heart" :class="{is_favorite : favorite[item.ID]}"></i>
              </div>
              <div class="addTo_cart_btn">
                加入購物車
              </div>
            </div>
            <div class="info">
              <div class="name"> {{ item.Name }} </div>
              <!-- 多價格 products 主商品 單價 -->
              <template v-if="item.PriceType === 'onePrice'">
                <div class="discount_price"> NT${{ numberThousands(item.NowPrice) }} </div>
                <div class="origin_price" v-if="parseInt(item.Price) > -1"> NT${{numberThousands(item.Price)}} </div>
              </template>
              <template v-else>
                <div class="discount_price"> NT${{ item.nowPriceRange }} </div>
                <div class="origin_price" v-if="item.priceRange"> NT${{ item.priceRange }} </div>
              </template>
            </div>
            <div class="l_addTo_cart_btn">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </div>
          </li>
        </ul>
      </div>
      <div class="product_page">
        <ul>
          <li :class="{opacity0: page_active == 1}" 
              @click="pagePush(1)"
          >
            <i class="fa fa-angle-double-left" aria-hidden="true"></i>
          </li>
          <li :class="{opacity0: page_active < 2}" 
              @click="pagePush(page_active - 1)"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </li>
          <li v-for="item in totalpage_num"
              v-show="is_show_page(item, totalpage_num)"
              :class="{li_active: page_active === item}" 
              @click="pagePush(item)"
          >
            {{item}}
          </li>
          <li :class="{opacity0: page_active > totalpage_num - 1}" 
              @click="pagePush(page_active + 1)" 
          > 
            <i class="fa-solid fa-chevron-right"></i> 
          </li>
          <li :class="{opacity0: page_active == totalpage_num}" 
              @click="pagePush(totalpage_num)" 
          > 
            <i class="fa fa-angle-double-right" aria-hidden="true"></i> 
          </li>
        </ul>
      </div>
    </template>
    <template v-else>
      <div class="no_product">
        <img src="../.././assets/img/search.png" alt="">
        <h3>未找到商品</h3>
        <h4>嘗試不同或更常見的關鍵字</h4>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getSearchApi } from '@/api/index.js'

  // store
  import { useCommon }  from '@/stores/common/common'

  let { site, is_getAll, favorite, perpage_num, totalpage_num, page_active, 
    demoOrigin, webVersion 
  } = storeToRefs(useCommon())
  let { login, toggleFavorite, multiPriceHandler, pushTo_cart, pagePush, is_show_page, numberThousands } = useCommon()
  
  const state = reactive({
    sortBy_arr: [ '商品排序', '上架時間: 由新至舊', '上架時間: 由舊至新', '價格: 由高至低', '價格: 由低至高'],
    sortBy_index: 0,
    perpage_num_arr: [ 6, 9, 12, 15],
    // query
    search_title: '',
    // res
    search: null,
  })
  const { sortBy_arr, sortBy_index, perpage_num_arr, search_title, search } = toRefs(state)

  const { query, type } = useRoute().query

  watch(is_getAll, () => {
    if(query) getSearch()
  })

  // methods ==================================================
  async function getSearch(index) {
    if(index) state.sortBy_index = index * 1;
    else {
      state.search_title = decodeURI(query);
      state.sortBy_index = type;
    }

    let formData = new FormData();
    formData.append("input", state.search_title);
    formData.append("type", state.sortBy_index);
    formData.append("WebPreview", site.value.WebPreview);

    try {
      let res = await getSearchApi(formData)
      if(res.data.errormessage) {
        await login();
        getSearch(index);
        return
      }

      state.search = res.data.data;
      multiPriceHandler(state.search);
      if(webVersion.value === 'demo') {
        state.search.forEach(item => {
          item.Img = demoOrigin.value + item.Img
        })
      }
      if(perpage_num.value % 3 !== 0) perpage_num.value =  6;
      totalpage_num.value = Math.ceil(state.search.length / perpage_num.value);
      page_active.value = 1;
    } catch (error) {
      throw new Error(error)
    }
  }
</script>