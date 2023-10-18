<style lang="scss" scoped>
  @import "@/assets/scss/components/order.scss";
</style>

<template>
  <div class="order">
    <div class="box" v-if="!user_account">
      <div class="info">
        <label> 訂單查詢 </label>
        <input type="text" placeholder="購買人手機號碼" v-model="order_phone" @keyup.enter="getOrderHandler()">
        <input type="text" placeholder="購買人電子信箱" v-model="order_mail" @keyup.enter="getOrderHandler()">
        <div class="button_row">
          <div class="button" @click="getOrderHandler()"> 搜尋 </div>
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
            <option :value="index" v-for="(item, index) in payStatus_arr" :key="index" v-show="index != 0 && index != 5"> {{ item }} </option>
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
          <div class="button" @click="getOrderHandler('', true)"> 篩選 </div>
        </div>
      </div>
    </div>

    <div :class="{ box : pathname.indexOf('order') > -1 }" v-if="order">
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
            <div class="td products"
              :class="{active : product_active == item.FilNo, expandable : item.expandable }"
              @click="product_active == item.FilNo ? product_active = '' : product_active = item.FilNo"
            >
              <ul>
                <li v-for="(item2, index) in item.Items" :key="index" v-show="product_active == item.FilNo || index < 4">
                  {{item2.ProductType == 2 ? '加價購' : ''}} {{item2.Name}}{{item2.Spec ? `(${item2.Spec})` : ''}}
                  NT${{ useNumberThousands(item2.Price) }} x {{ item2.Amount }}
                </li>
              </ul>
              <template v-if="item.expandable">
                <div class="icon" v-if="product_active == item.FilNo"> <i class="fa-solid fa-chevron-up"></i> </div>
                <div class="icon" v-else> <i class="fa-solid fa-chevron-down"></i> </div>
              </template>
            </div>
            <div class="td amount">
              <div class="total">
                應付金額: NT$ {{useNumberThousands(item.TotalAmount)}}
              </div>
              <div class="additional">
                <div v-if="item.Shipping * 1"> 運費: NT$ {{useNumberThousands(item.Shipping)}} </div>
                <div v-if="item.Discount * 1"> 折扣: NT$ {{useNumberThousands(item.Discount)}} </div>
                <div v-if="item.DiscountCode && item.DiscountCode.split(' ')[0] * 1">
                  <div> 折扣碼優惠: NT$ {{useNumberThousands(item.DiscountCode.split(' ')[0])}} {{item.DiscountCode.split(' ')[1]}} </div>
                </div>
                <div v-if="item.UsedWallet * 1">
                  <div> 使用購物金: NT$ {{useNumberThousands(item.UsedWallet)}} </div>
                </div>
              </div>
            </div>
            <div class="td payState">
              <div class="l_head"> 付款狀態 </div>
              <!-- 付款方式 -->
              <template v-if="item.Mart" > 
                <div v-if="item.Mart.indexOf('Delivery') < 0" class="payMethod">
                  <div> {{ payMethod_obj['MartOnDelivery'] }} </div>
                  <div> {{ payMethod_obj[item.PayMethod] }} </div>
                </div>
                <div v-else class="payMethod"> {{payMethod_obj['MartPayOnDelivery']}} </div>
              </template>
              <template v-else>
                <div class="payMethod"> {{ payMethod_obj[item.PayMethod] }} </div>
              </template>

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
                <div class="button" v-if="pathname.toLowerCase().indexOf('order') > -1" @click="pay_method = item.PayMethod; rePay( item.FilNo, `${ item.PayType === '2' ? '' : location.origin + getPathname('order') }`)"> 立即付款 </div>
                <div class="button" v-if="pathname.toLowerCase().indexOf('info') > -1" @click="pay_method = item.PayMethod; rePay(item.FilNo, `${ item.PayType === '2' ? '' : location.origin + getPathname('info') + '?page=order' }`)"> 立即付款 </div>
              </div>
              <div class="state_container" v-else>
                <div> {{ payStatus_arr[item.PayStatus] }} </div>
              </div>
            </div>
            <div class="td transportState">
              <div class="l_head"> 運送狀態 </div>
              <div class="text">
                <span> {{delivery_arr[item.Delivery]}} </span>
                <span class="search" v-if="item.Mart && (item.Delivery === '1' || item.Delivery === '6')" @click="searchMartDelivery(item)"> 查詢 </span>
              </div>
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

      <div class="martDeliveryModal" v-if="activeOrder">
        <div class='number_container' v-if="activeOrder.deliveryNumber">
          <div class="number_title"> {{ martObj[activeOrder.Mart.replace('C2C', '').replace('Delivery', '')] }} 包裹查詢號碼 </div>
          <input type='text' id='number_input' readonly v-model='activeOrder.deliveryNumber'>
          <div class='copy' @click="copy(activeOrder.deliveryNumber, 'number_input')"> 
            <i class='fas fa-copy'></i>
          </div>
        </div>
        
        <div class="message"> {{ activeOrder.deliveryMsg }} </div>
        <div class="time">  </div>
        <div class="button close" @click="activeOrder = null"> 確認 </div>
      </div>

      <div class="page_container">
        <div class="page">
          <ul>
            <li :class="{'disabled' : order_page_index < 2}"
              @click="order_page_index > 1 ? order_page_index-- : ''; getOrderHandler('page', true)"> 
              <i class="fas fa-caret-left"></i> </li>
            <li v-show="order_page_index > Math.floor(5/2) && order_page_index < order_page_number - Math.floor(5/2) ? item >= order_page_index - Math.floor(5/2) && item <= order_page_index + Math.floor(5/2) : order_page_index <= 5  ? item <= 5 : item > order_page_number - 5"
              :class="{'active' : order_page_index === item}" v-for="item in order_page_number" :key="item"
              @click="order_page_index = item; getOrderHandler('page', true)"> {{item}} </li>
            <li :class="{'disabled' : order_page_index > order_page_number - 1}"
              @click="order_page_index < order_page_number ? order_page_index++ : ''; getOrderHandler('page', true);">
              <i class="fas fa-caret-right"></i> </li>
          </ul>
        </div>
        <div class="total"> {{ order_page_index }} / {{ order_page_number }} </div>
        <div class="select" @click.stop="select_active = !select_active">
          <div class="value"> {{order_page_size}} </div>
          <i class="fas fa-caret-down"></i>
          <ul :class="{'active' : select_active}">
            <li :class="{'active' : order_page_size === item * 10}" v-for="item in 5" :key="item"
              @click="order_page_size = item * 10; getOrderHandler('', true)"> {{item * 10}} </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="box" v-if="noOrder" style="text-align: center;"> 查無訂單資料 </div>
  </div>
</template>

<script setup>
  // composables ========== ========== ========== ========== ==========
  import { useNumberThousands } from '@/composables/numberThousands'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useCommon }  from '@/stores/common/common'
  import { useOrder }  from '@/stores/order'
  import { useHandlerInfo } from '@/stores/handlerInfo'

  let { store, user_account, pathname, is_payModal, payModal_message } = storeToRefs(useCommon())
  let { rePay, copy, getPathname } = useCommon()
  let { order_phone, order_mail, filter_number, filter_pay, filter_delivery, payStatus_arr, delivery_arr,
    order, noOrder, product_active, payMethod_obj, pay_method, martObj, account_number, activeOrder,
    order_number, order_page_index, order_page_number, order_page_size, select_active
  } = storeToRefs(useOrder())
  let { getOrder, getMemberOrder, searchMartDelivery } = useOrder()
  let { getUser_info } = useHandlerInfo()

  const { RtnMsg, account, result, phone, email } = useRoute().query
  
  // 付款成功
  if(RtnMsg) {
    payModal_message.value = '已收到您的付款';
    is_payModal.value = true;
  }

  // Line 登入
  if(account) {
    user_account.value = account
    localStorage.setItem('user_account', user_account.value)
  }
  // Line 綁定
  if(result) {
    result = JSON.parse(decodeURI(result))
    if(!result.status) alert(result.msg)
    else {
      user_account.value = result.account
      localStorage.setItem('user_account', user_account.value)
    }
  }

  if(user_account.value) {
    await getUser_info();
    getMemberOrder();
  } else {
    if(phone && email) {
      order_phone.value = phone;
      order_mail.value = email;
      getOrder();
    }
  }

  useRouter().replace({ path: getPathname('order') })

  // computed ========== ========== ========== ========== ==========
  let getOrderHandler = computed(() => {
    return user_account.value ? getMemberOrder : getOrder
  })
</script>