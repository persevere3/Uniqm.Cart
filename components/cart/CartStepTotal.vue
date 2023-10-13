<template>
  <div class="total">
    <ul>
      <li>
        <div class="before">商品金額</div>
        <div class="after">NT$ {{useNumberThousands(total.Total)}}</div>
      </li>
      <li>
        <div class="before">- 折扣</div>
        <div class="after">NT$ {{useNumberThousands(total.Discount)}}</div>
      </li>
      <li>
        <div class="before">- 折扣碼優惠</div>
        <div class="after">NT$ {{useNumberThousands(total.DiscountCode)}}</div>
      </li>
      <li>
        <div class="before">小計</div>
        <div class="after" v-if=" subtotal >= 0"> NT$ {{useNumberThousands(subtotal)}} </div>
        <div class="after" v-else> NT$ 0 </div>
      </li>
      <li class="line"></li>
      <li v-if="user_account && is_use_bonus && use_bonus > 0">
        <div class="before">- 購物金</div>
        <div class="after">NT$ {{useNumberThousands(use_bonus)}}</div>
      </li>
      <li v-if="stepPage === 2">
        <div class="before">+ 運費</div>
        <div class="after">NT$ {{useNumberThousands(total.Shipping)}}</div>
      </li>
      <li>
        <div class="before"> 金額總計 </div>
        <div class="after">NT$ {{useNumberThousands(total.Sum)}}</div>
      </li>
      <template v-if="stepPage === 2 && user_account">
        <hr>
        <li> 訂單完成後獲得 NT${{ useNumberThousands(member_bonus) }} 購物金 </li>
        <li> (購物金將在出貨日滿14天後獲得) </li>
      </template>
    </ul>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // composables
  import { useNumberThousands } from '@/composables/numberThousands'

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'
  import { useCart }  from '@/stores/cart'

  let { user_account } = storeToRefs(useCommon())
  let { stepPage, total, is_use_bonus, use_bonus, member_bonus } = storeToRefs(useCart())

  // computed ==================================================
  let subtotal = computed(() => {
    return parseInt(total.value.Total) - parseInt(total.value.Discount) - parseInt(total.value.DiscountCode)
  })
</script>
