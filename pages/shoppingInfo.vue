<style lang="scss" scoped>
  @import "@/assets/scss/_uniqm_variable.scss";
  @import "@/assets/scss/_mixin.scss";

  @include info;
</style>

<template>
  <Info />
  <Pay />
</template>

<script setup>
  definePageMeta({
    layout: 'uniqm',
    // middleware: 'auth'
  })
</script>