<style lang="scss">
  @import "../assets/scss/rich.scss";
</style>

<template>
  <div class="main">
    {{ testData }}

  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getHomePageApi } from '@/api/index.js'

  // store
  import { useCommon }  from '@/stores/common/common'

  let { site, all, user_account, testData } = storeToRefs(useCommon())
  let { login } = useCommon()

  onMounted(async() => {
    
  })
  
  const state = reactive({
    // rich location.href
    rich_id: 0,
    // rich_cid 0: navbar, 1: 關於我們, 2: 顧客服務
    rich_cid: 0,
  })
  let {  } = toRefs(state)

  // computed ==================================================
  let customize_obj = computed(() => {
    return getObj_ID(all.value.webcategory)
  })
  let navbar_obj = computed(() => {
    return getObj_ID(all.value.websubcategory)
  })
  let footer_obj = computed(() => {
    return getObj_ID(all.value.footer)
  })

  // watch ==================================================

  // methods ==================================================
  function getObj_ID(arr) {
    let obj = {};
    if(!arr.length) return
    arr.forEach(item => obj[item.ID] = item)
    return obj;
  }

</script>