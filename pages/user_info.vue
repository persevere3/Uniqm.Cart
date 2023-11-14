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
  // components ========== ========== ========== ========== ==========
  import Info from '@/components/web/Info.vue'
  import Pay from '@/components/web/Pay.vue'

  // composables ========== ========== ========== ========== ==========
  import { useAuth } from '@/composables/auth'

  // stores ========== ========== ========== ========== ==========
  import { useWebCommon } from '@/stores/web/common'

  let { getPathname, urlPush } = useWebCommon()

  let isAuth = ref(false)

  if (process.browser) {
    if(useAuth()) isAuth.value = true
    else urlPush(getPathname('user'))
  }
</script>