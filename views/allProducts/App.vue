<template>
  <div class="allProducts">
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
        <template v-if="category_product && category_product.Data && category_product.Data[0].Img.length" >
          <div class="img_container" v-for="(item, index) in category_product.Data[0].Img" :key="index" :style="{backgroundImage: `url(${item})`}"></div>
        </template>

        <div class="content">
          <div class="rich_container"  v-if="category_product && category_product.Data && category_product.Data[0].Text">
            <div class="ql-editor" v-html="unescapeHTML(category_product.Data[0].Text)"></div>
          </div>
          
          <div class="video_container" 
            v-if="category_product && category_product.Data && category_product.Data[0].Video && videoHandler(category_product.Data[0].Video)"
            v-html="videoHandler(category_product.Data[0].Video)"
          >
          </div>
        </div>

        <template v-if="category_product">
          <div class="products" v-for="(item, key) in category_product.Sort" :key="`Sort${key}`" 
            v-show="Object.keys(item.Products).length"
          >
            <div class="title">
              {{item.Name}}
            </div>
            <div class="product_list" >
              <ul>
                <li v-for="(item2, key2) in item.Products" :key="`Products${key2}`" @click="pushTo_cart(item2.ID)">
                  <div class="pic" :style="{backgroundImage: `url(${item2.Img1})`}" >
                    <div class="addTo_favorite_btn" @click.stop="toggleFavorite(item2.ID)">
                      加入我的最愛 <i class="fas fa-heart" :class="{is_favorite : favorite[item2.ID]}"></i>
                    </div>
                    <div class="addTo_cart_btn">
                      加入購物車
                    </div>
                  </div>
                  <div class="info">
                    <div class="name"> {{item2.Name}} </div>
                    <div class="discount_price"> NT${{numberThousands(item2.NowPrice)}} </div>
                    <div class="origin_price"> NT${{numberThousands(item2.Price)}} </div>
                  </div>
                  <div class="l_addTo_cart_btn">
                    <i class="fa fa-shopping-cart" aria-hidden="true"></i>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/allProducts.scss";
</style>
