<template>
  <div class="cart">
    <div class="background">
      <div class="close">
        <i class="fa fa-times" aria-hidden="true" @click="showPage = 'main'"></i>
      </div>
      
      <CartContent />
    </div>
  </div>
</template>

<script setup>
  // components ========== ========== ========== ========== ==========
  import CartContent from './CartContent.vue'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useCartCommon }  from '@/stores/cart/common'

  let { showPage } = storeToRefs(useCartCommon())
</script>