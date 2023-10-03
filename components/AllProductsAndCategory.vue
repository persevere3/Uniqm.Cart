<style lang="scss">
  @import "@/assets/scss/components/allProductsAndCategory.scss";
  @import "@/assets/scss/_quill.scss";
</style>

<template>
  <div>
    <template v-if="category_product && category_product.Data && category_product.Data[0].Img.length" >
      <div class="img_container" v-for="(item, index) in category_product.Data[0].Img" :key="index" :style="{backgroundImage: `url(${item})`}"></div>
    </template>
    <div class="content">
      <div class="rich_container"  v-if="category_product && category_product.Data && category_product.Data[0].Text">
        <div class="ql-editor" v-html="unescapeHTML(category_product.Data[0].Text)"></div>
      </div>
      
      <div class="video_container" 
        v-if="category_product && category_product.Data && category_product.Data[0].Video"
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

                <!-- 多價格 products 主商品 單價 -->
                <template v-if="item2.PriceType === 'onePrice'">
                  <div class="discount_price"> NT${{ numberThousands(item2.NowPrice) }} </div>
                  <div class="origin_price" :class="{ opacity0 : parseInt(item2.Price) < 0 }"> NT${{ numberThousands(item2.Price) }} </div>
                </template>
                <template v-else>
                  <div class="discount_price"> NT${{ item2.nowPriceRange }} </div>
                  <div class="origin_price" :class="{ opacity0 : !item2.priceRange }"> NT${{ item2.priceRange }} </div>
                </template>
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
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store
  import { useCommon }  from '@/stores/common/common'
  import { useCategory}  from '@/stores/category'

  let { is_getSite, favorite } = storeToRefs(useCommon())
  let { toggleFavorite, imgHandler, pushTo_cart, numberThousands, unescapeHTML } = useCommon()
  let { category_product } = storeToRefs(useCategory())
  let { getCategory, videoHandler } = useCategory()

  const { id } = useRoute().query

  // watch ==================================================
  watch(is_getSite, async() => {
    await getCategory(id)
    await nextTick()
    imgHandler()
  },)
</script>