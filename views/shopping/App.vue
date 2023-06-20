<template>
  <div @click.stop="is_carts_active = false; is_favorite_active = false">
    <div class="carts_container" :class="{'hover' : is_carts_active}" v-if="carts.length">
      <ul class="carts_items">
        <template v-for="item in carts" :key="item.ID">
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
                    <!-- <div class="delete" @click.stop="spec2.buyQty = 0">
                      <i class="fas fa-trash-alt"></i>
                    </div> -->
                  </div>
                </li>
              </template>
              <!-- 沒有規格 -->
              <li v-if="!item2.specArr" @click.stop="pushTo_cart(item.ID)">
                <div class="img_and_name">
                  <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                  <div class="name"> 加價購 {{ item2.Name }} </div>
                </div>
                <div class="price_and_delete">
                  <div class="price"> NT${{numberThousands(item2.Price)}} x {{item2.Qty}}  </div>
                  <!-- <div class="delete" @click.stop="item2.buyQty = 0">
                    <i class="fas fa-trash-alt"></i>
                  </div> -->
                </div>
              </li>
            </template>
          </template>
        </template>
      </ul>
      <div class="pushTo_cart" @click.stop="pushTo_cart()">
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        前往購物車
      </div>
    </div>
  </div>
</template>