<style lang="scss" scoped>
  @import "@/assets/scss/components/cart_and_favorite_container";
</style>

<template> 
  <div class="favorite_container" :class="{active : is_favorite_active}" v-if="Object.keys(favorite).length">
    <ul class="favorite_items">
      <template v-for="item in favorite" :key="item.ID">
        <li @click.stop="pushTo_cart(item.ID)">
          <div class="img_and_name">
            <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
            <div class="name"> {{ item.Name }} </div>
          </div>
          <div class="price_and_delete">
            <!-- 多價格 favorite_container 主商品 單價 -->
            <div class="price" v-if="item.PriceType === 'onePrice'"> NT${{ useNumberThousands(item.NowPrice) }} </div>
            <div class="price" v-else> NT${{ item.nowPriceRange }} </div>

            <div class="delete" @click.stop="toggleFavorite(item.ID)">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
  // composables ========== ========== ========== ========== ==========
  import { useNumberThousands } from '@/composables/numberThousands'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useCommon }  from '@/stores/web/common/common'

  let { favorite, is_favorite_active } = storeToRefs(useCommon())
  let { toggleFavorite, pushTo_cart } = useCommon()
</script>