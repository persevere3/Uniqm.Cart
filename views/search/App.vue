<template>
  <div class="search">
   <Common 
      :json_site="JSON.stringify(site)" 
      :json_all="JSON.stringify(all)"
      :json_store="JSON.stringify(store)"
      :json_footer_community="JSON.stringify(footer_community)"
      :json_copyRight="JSON.stringify(copyRight)"
      :json_customerService="JSON.stringify(customerService)"
      :json_carts="JSON.stringify(carts)"
      :json_favorite="JSON.stringify(favorite)"
      :user_account="user_account"
    > 
      <div class="breadcrumb">
        <div class="container" v-if="search_title">
          找商品 / {{search_title}}
        </div>
      </div>

      <div class="main">
        <!-- <div class="category_list" v-if="sortCategory">
          <ul>
            <li v-for="item in sortCategory" :key="item.ID" @click="urlPush(`/search.html?id=${item.ID}&name=${item.Name}`)">{{item.Name}}</li>
          </ul>
        </div> -->
        <template v-if="search && search.length">
          <div class="product_list">
            <div class="top">
              <!-- <div class="title">{{search_title}}</div> -->
              <div class="perpageNum_select">
                <div class="select">
                  {{sortBy_arr[sortBy_index]}}
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <ul>
                  <!-- getSearch(index:string) -->
                  <li v-for="(item, index) in sortBy_arr" :key="index" 
                      @click="getSearch('' + index)">
                    {{item}}
                  </li>
                </ul>
              </div>

              <div class="perpageNum_select">
                <div class="select">
                  每頁顯示 {{perpage_num}} 個
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <ul>
                  <li v-for="(item, index) in perpage_num_arr" :key="index" 
                      @click="perpage_num = item; 
                      search_totalpage_num = Math.ceil(search.length / perpage_num); 
                      product_page_active = 1;
                  ">
                    每頁顯示 {{item}} 個
                  </li>
                </ul>
              </div>
            </div>
            <ul>
              <li v-for="(item, index) in search" :key="item.ID"
                  v-show="product_page_active * perpage_num - (perpage_num + 1)  < index && index < product_page_active * perpage_num"
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
                  <div class="name"> {{item.Name}} </div>
                  <div class="discount_price"> NT$ {{numberThousands(item.NowPrice)}} </div>
                  <div class="origin_price"> NT$ {{numberThousands(item.Price)}} </div>
                </div>
                <div class="l_addTo_cart_btn">
                  <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                </div>
              </li>
            </ul>
          </div>
          <div class="product_page">
            <ul>
              <li @click="pagePush(product_page_active - 1)" :class="{opacity0: product_page_active < 2}"> <i class="fa fa-angle-double-left" aria-hidden="true"></i> </li>
              <li v-for="item in search_totalpage_num" :class="{li_active: product_page_active === item}" 
                  @click="pagePush(item)">
                {{item}}
              </li>
              <li @click="pagePush(product_page_active + 1)" :class="{opacity0: product_page_active > search_totalpage_num - 1}"> <i class="fa fa-angle-double-right" aria-hidden="true"></i> </li>
            </ul>
          </div>
        </template>
        <template v-if="search && search.length < 1">
          <div class="no_product">
            <img src="../.././assets/img/search.png" alt="">
            <h3>未找到商品</h3>
            <h4>嘗試不同或更常見的關鍵字</h4>
          </div>
        </template>
      </div>
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/search.scss";
</style>
