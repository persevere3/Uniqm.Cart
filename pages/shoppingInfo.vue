<style lang="scss">
  @import "../assets/scss/shoppingInfo.scss";
</style>

<template>
  <Info />
  <Pay />
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store
  import { useCommon }  from '@/stores/common/common'

  let {  } = storeToRefs(useCommon())
  let {  } = useCommon()

  const state = reactive({

  })
  let {  } = toRefs(state)

  definePageMeta({
    layout: 'uniqm'
  })

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================
  

</script>