<style lang="scss" scoped>
  .error_container {
    width: 100vw;
    height: 100vh;
    position: relative;

    .bg {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-image: url(@/assets/img/error.png);
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    
      opacity: 0.8;
    }
  }
</style>

<template>
  <div class="error_container">
    <div class="bg"></div>
  </div>
</template>