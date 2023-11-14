<template>
  <User />
</template>

<!-- <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script> -->

<script setup>
  // components ========== ========== ========== ========== ==========
  import User from '@/components/web/User.vue'

  // composables ========== ========== ========== ========== ==========
  import { useAuth } from '@/composables/auth'

  // stores ========== ========== ========== ========== ==========
  import { useWebCommon } from '@/stores/web/common'
  
  let { getPathname, urlPush } = useWebCommon()

  if(useAuth()) urlPush(getPathname('info'))
</script>