<template>
  <User />
</template>

<!-- <script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script> -->

<script setup>
  import { useAuth } from '@/composables/auth'

  import { useCommon } from '@/stores/common/common'
  let { getPathname, urlPush } = useCommon()

  if(useAuth()) urlPush(getPathname('info')) 
</script>