<template>
  <template v-if="isAuth">
    <Info />
    <Pay />
  </template>
  <template v-else>
    isAuth: {{ isAuth }}
  </template>
</template>

<script setup>
  import { useAuth } from '@/composables/auth'

  import { useCommon } from '@/stores/common/common'
  let { getPathname, urlPush } = useCommon()

  let isAuth = ref(false)

  if (process.browser) {
    if(useAuth()) isAuth.value = true
    else urlPush(getPathname('user'))
  }

</script>