<template>
  <div @click.stop="is_carts_hover = false; is_favorite_hover = false">
    layout-common

    

    <slot />
  </div>
</template>

<script setup>
  // import Main from '@/components/Main.vue'

  // store ==================================================
  // import { useCommon }  from '@/stores/common/common'

  // let { user_account, isShowFavorite, showPage } = storeToRefs(useCommon())

  // state ==================================================
  const state = reactive({
    
  })
  let {  } = toRefs(state)

  // onMounted ==================================================
  onMounted(() => {
    
  })

  // watched ==================================================
  

  // function ==================================================
  const methods = reactive({
    
  })

</script>