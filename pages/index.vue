<style lang="scss">
  
</style>

<template>
  <div>
    {{ site }}
  </div>
</template>

<script setup>
  import { loginApi, getSiteApi } from '@/api/index';
  const state = reactive({
    site: null
  })
  let { site } = toRefs(state)

  onMounted(async() => {
    let site = JSON.parse(localStorage.getItem('site')) || [] ;
    let params = `site=${site.Site}&store=${site.Name}&Preview=${site.Preview}&WebPreview=${site.WebPreview}`;

    try {
      await loginApi(params)
    }
    catch (error) {
      throw new Error(error)
    }

    try {
      let { data } = await getSiteApi()
      console.log(data.data[0])
      state.site = data.data[0]
    }
    catch (error) {
      throw new Error(error)
    }
  })

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================

</script>