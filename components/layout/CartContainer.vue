<template> 
  <div class="carts_container" :class="{active : is_carts_active}" v-if="cart.length">
    <ul class="carts_items">
      <template v-for="item in cart" :key="item.ID">
        <!-- 有規格 -->
        <template v-if="item.specArr">
          <li v-for="spec in item.specArr " :key="spec.ID" v-show="spec.buyQty != 0 || spec.buyQty === ''" @click.stop="pushTo_cart(item.ID)">
            <div class="img_and_name">
              <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
              <div class="name"> {{ item.Name }}({{spec.Name}}) </div>
            </div>
            <div class="price_and_delete">
              <div class="price"> NT${{numberThousands(item.NowPrice)}} x {{spec.buyQty}}  </div>
              <div class="delete" @click.stop="delete_carts_item(item.ID, spec.ID)">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </li>
        </template>
        <!-- 沒有規格 -->
        <li v-if="!item.specArr" @click.stop="pushTo_cart(item.ID)">
          <div class="img_and_name">
            <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
            <div class="name"> {{ item.Name }} </div>
          </div>
          <div class="price_and_delete">
            <div class="price"> NT${{numberThousands(item.NowPrice)}} x {{item.buyQty}}  </div>
            <div class="delete" @click.stop="delete_carts_item(item.ID)">
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>
        </li>

        <!-- 加價購 -->
        <template v-if="item.addPrice">
          <template v-for=" (item2, index2) in item.addPrice">
            <!-- 有規格 -->
            <template v-if="item2.specArr">
              <li v-for="(spec2, specIndex2) in item2.specArr" :key="spec2.ID" v-show="spec2.buyQty != 0 || spec2.buyQty === ''" @click.stop="pushTo_cart(item.ID)">
                <div class="img_and_name">
                  <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                  <div class="name"> 加價購 {{ item2.Name }}({{spec2.Name}}) </div>
                </div>
                <div class="price_and_delete">
                  <div class="price"> NT${{numberThousands(item2.Price)}} x {{spec2.buyQty}}  </div>
                </div>
              </li>
            </template>
            <!-- 沒有規格 -->
            <template v-if="!item2.specArr" @click.stop="pushTo_cart(item2.ID)">
              <li v-show="item2.Qty != 0 || item2.Qty === ''" >
                <div class="img_and_name">
                  <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                  <div class="name"> 加價購 {{ item2.Name }} </div>
                </div>
                <div class="price_and_delete">
                  <div class="price"> NT${{numberThousands(item2.Price)}} x {{item2.Qty}}  </div>
                </div>
              </li>
            </template>
          </template>
        </template>
      </template>
    </ul>
    <div class="pushTo_cart" @click.stop="pushTo_cart()">
      <i class="fa fa-shopping-cart" aria-hidden="true"></i>
      前往購物車
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'

  let { cart, is_carts_active } = storeToRefs(useCommon())
  let { delete_carts_item, pushTo_cart, numberThousands } = useCommon()

  // state ==================================================
  const state = reactive({

  })
  let {  } = toRefs(state)

  // watch ==================================================

  // function ==================================================


</script>