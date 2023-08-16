<style lang="scss" scoped>
  @import "@/assets/scss/components/cart_and_favorite_container.scss";
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
            <div class="price"> NT${{numberThousands(item.NowPrice)}} </div>
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
  import { storeToRefs } from 'pinia'

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'

  let { favorite, is_favorite_active } = storeToRefs(useCommon())
  let { toggleFavorite, pushTo_cart, numberThousands } = useCommon()

</script>