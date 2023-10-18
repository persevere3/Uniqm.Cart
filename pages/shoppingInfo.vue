<template>
  <Info />
  <Pay />
</template>

<script setup>
  // components ========== ========== ========== ========== ==========
  import Info from '@/components/web/Info.vue'
  import Pay from '@/components/web/Pay.vue'

  definePageMeta({
    layout: 'uniqm',
  })
</script>