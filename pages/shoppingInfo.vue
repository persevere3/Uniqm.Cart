<template>
  <Info />
  <Pay />
</template>

<script setup>
  // components ========== ========== ========== ========== ==========
  import Info from '@/components/Info.vue'
  import Pay from '@/components/Pay.vue'

  definePageMeta({
    layout: 'uniqm',
  })
</script>