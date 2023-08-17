<style lang="scss" scoped>
  @import "@/assets/scss/_uniqm_variable.scss";
  @import "@/assets/scss/_mixin.scss";

  @include order;
</style>

<template>
  <Order />
</template>

<script setup>
  definePageMeta({
    layout: 'uniqm'
  })
</script>