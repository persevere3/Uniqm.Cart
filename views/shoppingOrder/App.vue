<template>
  <div >
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

    <div class="main">
      <div class="box" v-if="!user_account"> 
        <div class="info">
          <label> 訂單查詢 </label>
          <input type="text" placeholder="購買人手機號碼" v-model="order_phone" @keyup.enter="user_account ? getMemberOrder() : getOrder()">
          <input type="text" placeholder="購買人電子信箱" v-model="order_mail" @keyup.enter="user_account ? getMemberOrder() : getOrder()">
          <div class="button_row">
            <div class="button" @click="user_account ? getMemberOrder() : getOrder()"> 搜尋 </div>
          </div>
        </div>
      </div>

      <div class="box" v-if="order">
        <div class="filter">
          <div class="item">
            <label> 訂單編號 </label>
            <input type="text" placeholder="訂單編號" v-model="filter_number">
          </div>
          
          <div class="item">
            <label> 付款狀態 </label>
            <select v-model="filter_pay">
              <option value="0"> === 付款狀態 === </option>
              <option :value="index" v-for="(item, index) in payStatus_arr" :key="index" v-show="index != 0"> {{ item }} </option>
            </select>
          </div>

          <div class="item">
            <label> 運送狀態 </label>
            <select v-model="filter_delivery">
              <option value="0"> === 運送狀態 === </option>
              <option :value="index" v-for="(item, index) in delivery_arr" :key="index" v-show="index != 0"> {{ item }} </option>
            </select>
          </div>

          <div class="button_row">
            <div class="button" @click="user_account ? getMemberOrder('', true) : getOrder('', true)"> 篩選 </div>
          </div>
        </div>
      </div>

      <div class="box" v-if="order">
        <div class="table">
          <div class="head">
            <div class="tr">
              <div class="td number">
                訂單編號
              </div>
              <div class="td products">
                商品
              </div>
              <div class="td amount">
                金額
              </div>
              <div class="td payState">
                付款狀態  
              </div>
              <div class="td transportState">
                運送狀態 
              </div>
              <div class="td time">
                成立時間 
              </div>
            </div>
          </div>
          <div class="body">
            <div class="tr" v-for="item in order" :key="item.FilNo">
              <div class="td number">
                {{item.FilNo}}
              </div>
              <div class="td products" :class="{active : product_active == item.FilNo, expandable : item.expandable }" @click="product_active == item.FilNo ? product_active = '' : product_active = item.FilNo">
                <ul>
                  <li v-for="(item2, index) in item.Items" :key="index" v-show="product_active == item.FilNo || index < 4">
                    {{item2.ProductType == 2 ? '加價購' : ''}} {{item2.Name}}{{item2.Spec ? `(${item2.Spec})` : ''}} NT${{numberThousands(item2.Price)}} x {{item2.Amount}}
                  </li>
                </ul>
                <template v-if="item.expandable">
                  <div class="icon" v-if="product_active == item.FilNo"> <i class="fa-solid fa-chevron-up"></i> </div>
                  <div class="icon" v-else> <i class="fa-solid fa-chevron-down"></i> </div>
                </template>
              </div>
              <div class="td amount">
                <div class="total">
                  應付金額: NT$ {{numberThousands(item.TotalAmount)}}
                </div>
                <div class="additional">
                  <div v-if="item.Shipping * 1"> 運費: NT$ {{numberThousands(item.Shipping)}} </div>
                  <div v-if="item.Discount * 1"> 折扣: NT$ {{numberThousands(item.Discount)}} </div>
                  <div v-if="item.DiscountCode && item.DiscountCode.split(' ')[0] * 1">
                    <div> 折扣碼優惠: NT$ {{numberThousands(item.DiscountCode.split(' ')[0])}} {{item.DiscountCode.split(' ')[1]}} </div>
                  </div>
                  <div v-if="item.UsedWallet * 1">
                    <div> 使用購物金: NT$ {{numberThousands(item.UsedWallet)}} </div>
                  </div>
                </div>
              </div>
              <div class="td payState">
                <div class="l_head"> 付款狀態 </div>
                <!-- 付款方式 -->
                <div v-if="item.PayMethod" class="payMethod"> {{payMethod_obj[item.PayMethod]}} </div>
                
                <!-- 付款狀態 -->
                <div class="state_container" v-if="item.Delivery == 3 || item.Delivery == 4">
                  <div> {{ payStatus_arr[item.PayStatus] }} </div>
                </div>
                <!-- PayStatus == 2 (待付款)，PayMethod == 'ATM'，PayType == 1 (公司) -->
                <div class="state_container" v-else-if="item.PayStatus == 2 && item.PayMethod == 'ATM' && item.PayType == 1">
                  <template v-if="store.SelfAtmStatus == 0">
                    <div> ATM帳戶關閉，請聯繫我們 </div>
                  </template>
                  <template v-else>
                    <div class="show_bank">
                      <div class="button" @click.stop="is_payModal = true; payModal_message =  'template1'">
                        匯款帳戶
                      </div>
                    </div>
                    <div class="button"
                      @click.stop="is_payModal = true; payModal_message = 'template2'; account_number = ''; order_number = item.PayFilNo">
                      付款確認
                    </div>
                  </template>
                </div>
                <div class="state_container" v-else-if="item.PayStatus == 2 && item.PayMethod != 'PayOnDelivery'">
                  <div class="button"  @click="pay_method = item.PayMethod; rePay(item.FilNo, `${item.PayType === '2' ? '' : `${protocol}//${api}` }/shoppingOrder.html`)"> 立即付款 </div>
                </div>
                <div class="state_container" v-else>
                  <div> {{ payStatus_arr[item.PayStatus] }} </div>
                </div>

              </div>
              <div class="td transportState">
                <div class="l_head"> 運送狀態 </div>
                {{delivery_arr[item.Delivery]}}
                <template v-if="item.CancelTime && (item.Delivery == 3 || item.Delivery == 4)">
                  <div> {{ item.CancelTime.split(' ')[0] }} </div>
                  <div> {{ item.CancelTime.split(' ')[1] }} </div>
                </template>
                <template v-else-if="item.DeliveryTime && (item.Delivery == 1 || item.Delivery == 5)">
                  <div> {{ item.DeliveryTime.split(' ')[0] }} </div>
                  <div> {{ item.DeliveryTime.split(' ')[1] }} </div>
                </template>
              </div>
              <div class="td time">
                <div class="l_head"> 成立時間 </div>
                <div> {{ item.CreateTime.split(' ')[0] }} </div>
                <div> {{ item.CreateTime.split(' ')[1] }} </div>
              </div>
            </div>
          </div>
        </div>

        <div class="page_container">
          <div class="page">
            <ul>
              <li :class="{'disabled' : order_page_index < 2}" @click="order_page_index > 1 ? order_page_index-- : ''; user_account ? getMemberOrder('page', true) : getOrder('page', true)"> <i class="fas fa-caret-left"></i> </li>
              <li v-show="order_page_index > Math.floor(5/2) && order_page_index < order_page_number - Math.floor(5/2) ? item >= order_page_index - Math.floor(5/2) && item <= order_page_index + Math.floor(5/2) : order_page_index <= 5  ? item <= 5 : item > order_page_number - 5" :class="{'active' : order_page_index === item}" v-for="item in order_page_number" :key="item" @click="order_page_index = item; user_account ? getMemberOrder('page', true) : getOrder('page', true)"> {{item}} </li>
              <li :class="{'disabled' : order_page_index > order_page_number - 1}" @click="order_page_index < order_page_number ? order_page_index++ : ''; user_account ? getMemberOrder('page', true) : getOrder('page', true);"> <i class="fas fa-caret-right"></i> </li>
            </ul>
          </div>
          <div class="total"> {{ order_page_index }} / {{ order_page_number }} </div>
          <div class="select" @click.stop="select_active = !select_active">
            <div class="value"> {{order_page_size}} </div>
            <i class="fas fa-caret-down"></i>
            <ul :class="{'active' : select_active}">
              <li :class="{'active' : order_page_size === item * 10}" v-for="item in 5" :key="item" @click="order_page_size = item * 10; user_account ? getMemberOrder('', true) : getOrder('', true)"> {{item * 10}} </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="box" v-if="noOrder" style="text-align: center;"> 查無訂單資料 </div>
    </div>

    <div class="payModal_container" v-if="is_payModal">
      <div class="payModal bank">
        <div class="close" @click="is_payModal = false; payModal_message = '';"><i class="fas fa-times"></i></div>
      
        <template v-if="payModal_message == 'template1'">
          <div> 匯款銀行 : {{store.SelfAtmBankId}} {{bank[store.SelfAtmBankId]}} </div>
          <div class='bank_account'>
            <div class="bank_title"> 匯款帳號 : </div>
            <input type='text' id='copy_input' readonly v-model='store.SelfAtmId'>
            <div class='copy' @click='copy(store.SelfAtmId)'> 
              <i class='fas fa-copy'></i>
            </div>
          </div>
        </template>

        <template v-else-if="payModal_message == 'template2'">
          <div class="message" style="margin: 0 auto;">
            請輸入匯款帳戶末6碼:
            <input type="number" @input="filter_account_number" @keydown.enter="checkPay" v-model="account_number">
          </div>
          <div class="button_row" style="margin: 0 auto;">
            <div class="button" @click="checkPay">
              確認
            </div>
          </div>
        </template>

        <template v-else>
          <div class="message" v-html="payModal_message"> </div>
        </template>
      </div>
    </div>

    <div class="ECPay_form_container" v-html="ECPay_form" ></div>

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
  @import "../.././assets/scss/shoppingOrder.scss";
</style>