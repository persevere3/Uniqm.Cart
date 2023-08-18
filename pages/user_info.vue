<style lang="scss" scoped>
  @import "@/assets/scss/_variable.scss";
  @import "@/assets/scss/_mixin.scss";

  @include info;
</style>

<template>
  <Info />
  <Pay />
</template>

<script setup>
  definePageMeta({
    // middleware: 'auth'
  })
</script>