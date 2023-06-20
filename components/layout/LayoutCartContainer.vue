<template> 

</template>

<script setup>
  import { storeToRefs } from 'pinia'

  // store ==================================================
  import { useCommon }  from '@/stores/common/common'

  let { carts, is_carts_active } = storeToRefs(useCommon())
  let { pushTo_cart, numberThousands } = useCommon()

  // state ==================================================
  const state = reactive({

  })
  let {  } = toRefs(state)

  // watch ==================================================

  // function ==================================================


</script>