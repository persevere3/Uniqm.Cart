<style lang="scss" scoped>
  @import "../assets/scss/shoppingInfo.scss";
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