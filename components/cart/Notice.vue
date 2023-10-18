<template>
  <div class="notice_page">
    <div class="background" >
      <div class="close" @click="showPage = 'main'"> <i class="fa fa-times" aria-hidden="true"></i> </div>
      <div class="content ql-editor" v-html="useUnescapeHTML(store[showPage])"></div>
    </div>
  </div>
</template>

<script setup>
  // composables ========== ========== ========== ========== ==========
  import { useUnescapeHTML } from '@/composables/unescapeHTML'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useCommon }  from '@/stores/cart/common/common'
  
  let { store, showPage } = storeToRefs(useCommon())
  
</script>