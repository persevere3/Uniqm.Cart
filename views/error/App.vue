<template>
  <div class="error">
    <div class="bg"></div>
  </div>
</template>

<script>
export default {
  created(){
    let vm = this;

    let api = location.host;
    let protocol = location.protocol;

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open('get',`${protocol}//${api}/interface/web/GetSite`, true);
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let site = JSON.parse(xhr.response).data[0];
        if(site.WebEnable == 1){
          window.location.href = '/';
        }
      }
    }
  },
}
</script>

<style lang="scss">
  *, *:before, *:after{
    margin: 0;
    padding :0;
    box-sizing: border-box;
    vertical-align: middle;
  }
  .error{
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  .error .bg{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(../.././assets/img/error.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  
    opacity: 0.8;
  }
</style>
