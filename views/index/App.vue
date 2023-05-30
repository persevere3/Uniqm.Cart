<template>
  <div class="home">
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
      <div class="main">
        <div class="img_container pc" v-if="homePage.TopImg" :style="{backgroundImage: `url(${homePage.TopImg})`}"></div>
        <div class="img_container mobile" v-if="homePage.PhoneImg" :style="{backgroundImage: `url(${homePage.PhoneImg})`}"></div>

        <div class="banner" v-if="homePage.Ad && homePage.Ad.length">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="item in homePage.Ad" 
                   :key="item.ID" :style="{backgroundImage: `url(${item.URL})`}"
              >
              </div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>

        <div class="category_container" v-if="homePage.Ex && all.websubcategory">
          <ul>
            <li v-for="(item, index) in filter_ex" :key="index" :style="{backgroundImage: `url(${item.Img})`}" @click="item.direct_link ? ( item.type == 0 ? urlPush(item.direct_link, true) : urlPush(item.direct_link)) : '' "></li>
          </ul>
        </div>

        <div class="sub_category_container" v-if="homePage.Category && all.websubcategory">
          <ul>
            <li v-for="(item, index) in filter_category" :key="index" :style="{backgroundImage: `url(${item.Img})`}" @click="item.direct_link ? urlPush(item.direct_link) : '' "></li>
          </ul>
        </div>

        <div class="products">
          <div class="title">
            {{store.Name}}
          </div>
          <div class="product_list">
            <ul>
              <li v-for="(item, index) in all.data" :key="index"
                  @click="pushTo_cart(item.ID)"
                  v-show="product_page_active * perpage_num - (perpage_num + 1)  < index && index < product_page_active * perpage_num"
              >
                <div class="pic" :style="{backgroundImage: `url(${item.Img1})`}">
                  <div class="addTo_favorite_btn" @click.stop="toggleFavorite(item.ID)">
                    加入我的最愛 <i class="fas fa-heart" :class="{is_favorite : favorite[item.ID]}"></i>
                  </div>
                  <div class="addTo_cart_btn">
                    加入購物車
                  </div>
                </div>
                <div class="info">
                  <div class="name"> {{item.Name}} </div>
                  <div class="discount_price"> NT$ {{ numberThousands(item.NowPrice) }} </div>
                  <div class="origin_price"> NT$ {{ numberThousands(item.Price) }} </div>
                </div>
                <div class="l_addTo_favorite_btn" @click.stop="toggleFavorite(item.ID)">
                  <i class="fas fa-heart" :class="{is_favorite : favorite[item.ID]}"></i>
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
              <li v-for="item in totalpage_num" :class="{li_active: product_page_active === item}" 
                  @click="pagePush(item)">
                {{item}}
              </li>
              <li @click="pagePush(product_page_active + 1)" :class="{opacity0: product_page_active > totalpage_num - 1}"> <i class="fa fa-angle-double-right" aria-hidden="true"></i> </li>
            </ul>
          </div>
        </div>

        <div class="community_category_container" v-if="homePage.Community">
          <ul>
            <li @click="urlPush(homePage.Community.FB.Link, 1)" v-if="homePage.Community.FB.Img">
              <div class="pic" :style="{backgroundImage: `url(${homePage.Community.FB.Img})`}"></div>
            </li>
            <li @click="urlPush(homePage.Community.Line.Link, 1)" v-if="homePage.Community.Line.Img">
              <div class="pic" :style="{backgroundImage: `url(${homePage.Community.Line.Img})`}"></div>
            </li>
            <li @click="urlPush(homePage.Community.IG.Link, 1)" v-if="homePage.Community.IG.Img">
              <div class="pic" :style="{backgroundImage: `url(${homePage.Community.IG.Img})`}"></div>
            </li>
          </ul>
        </div>
      </div>
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/index.scss";
</style>
