<template>
  <div @click.stop="is_carts_hover = false; is_favorite_hover = false">
    <div class="carts_container" :class="{'hover' : is_carts_hover}" v-if="carts.length">
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

    <div class="favorite_container" :class="{'hover' : is_favorite_hover}" v-if="Object.keys(favorite).length">
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

    <header>
      <div class="logo" v-if="store">
        <a @click="urlPush(getPathname('index'))">
          <img :src="store.Logo" alt="">
        </a>
      </div>
      <div class="menu">
        <ul>
          <li @click="urlPush(getPathname('index'))"><i class="fa-solid fa-house"></i> <span class="none650"> 首頁 </span></li>
          <li @click.stop="is_favorite_hover = !is_favorite_hover; is_carts_hover = false"> 
            <i class="fa-solid fa-heart"></i>
            <span class="none650"> 收藏 </span> 
          </li>
          <li @click.stop="carts.length ? is_carts_hover = !is_carts_hover : pushTo_cart(); is_favorite_hover = false"> 
            <i class="fa-solid fa-cart-shopping"></i> 
            <span class="none650"> 購物車 </span> 
          </li>
          <li @click="urlPush('/shoppingOrder.html')">
            <i class="fas fa-clipboard-list"></i>
            <span class="none650"> 訂單 </span>
          </li>
          <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/shoppingInfo.html') : urlPush('/shoppingUser.html')">
            <i class="fa-solid fa-user"></i> 
            <span class="none650"> 會員中心 </span>
          </li>
        </ul>
      </div>
    </header>

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
            <div class="price">NT {{ item.NowPrice }}</div>
            <div class="control">
              <i class="fa-solid fa-heart" :class="{is_favorite : favorite[item.ID]}" @click.stop="toggleFavorite(item.ID)"></i>
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <footer>
      <div class="footerContact">
        <div class="footerContainer">
          <div class="w33">
            <p>智聯微網 統編: 42872739 </p>
            <p>台中市西屯區市政路386號四樓三</p>          
            <p>04-22520766</p>

            <a href="./privacy.html"> 隱私權政策 </a>
            <a href="./member-benefits.html"> 會員權益聲明 </a>
            <a href="./return.html"> 退換貨說明 </a>
          </div>
          <div class="w33">
            <div style="text-align:center; margin-bottom: 5px;"> 聯繫我們 </div>
            <a href="https://line.me/ti/p/@uniqm" target="_blank"> <img src="/image/qr-line.png" alt=""> </a>
            <!-- <span class="faicon"><i class="fa-brands fa-facebook-f"></i></span> -->
          </div>
        </div>
      </div>

      <div class="copyright">
        <div class="footerContainer">
          <p>Copyright &copy; 2023 - All Rights Reserved - UNIQ Micronet . </p>
        </div>
      </div>
      <Cookie />
    </footer>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/shopping.scss";
</style>