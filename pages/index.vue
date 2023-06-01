<style lang="scss">
  
</style>

<template>
  <div>
    {{ testData }}
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store
  import { useCommon }  from '@/stores/common/common'
  import { useHandlerCommon }  from '@/stores/handlerCommon'

  let { site, user_account, testData } = storeToRefs(useCommon())
  let { login } = useCommon()
  let {  } = storeToRefs(useHandlerCommon())
  let { getSiteHandler } = useHandlerCommon()

  onMounted(async() => {
    site.value = JSON.parse(localStorage.getItem('site')) || {} ;
    user_account.value = localStorage.getItem('user_account')

    await login()
    getSiteHandler()
  })
  
  const state = reactive({

  })
  let {  } = toRefs(state)

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================

</script>

<style lang="scss">
  @import "../assets/scss/index.scss";
</style>