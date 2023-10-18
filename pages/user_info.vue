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
  import Info from '@/components/Info.vue'
  import Pay from '@/components/Pay.vue'

  // composables ========== ========== ========== ========== ==========
  import { useAuth } from '@/composables/auth'

  // stores ========== ========== ========== ========== ==========
  import { useCommon } from '@/stores/common/common'

  let { getPathname, urlPush } = useCommon()

  let isAuth = ref(false)

  if (process.browser) {
    if(useAuth()) isAuth.value = true
    else urlPush(getPathname('user'))
  }
</script>