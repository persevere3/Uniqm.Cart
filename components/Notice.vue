<template>
  <div class="notice_page">
    <div class="background" >
      <div class="close" @click="showPage = 'main'"> <i class="fa fa-times" aria-hidden="true"></i> </div>
      <div class="content ql-editor" v-html="useUnescapeHTML(store[showPage])"></div>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // composables
  import { useUnescapeHTML } from '@/composables/unescapeHTML'  

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'

  let { store, showPage } = storeToRefs(useCommon())
  
</script>