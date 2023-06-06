<style lang="scss">
  @import "../assets/scss/contact.scss";
</style>

<template>
  <div class="main">
    contact
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getContactApi } from '@/api/index.js'

  // store
  import { useCommon }  from '@/stores/common/common'

  let { site } = storeToRefs(useCommon())
  let { login } = useCommon()
  
  const state = reactive({
    contact: {}
  })
  let { contact } = toRefs(state)

  onMounted(() => {
    getContact()
  })

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================
  async function getContact() {
    let params = `WebPreview=${site.value.WebPreview}`;

    try {
      let res = await getContactApi(params)
      if(res.data.errormessage) {
        await login();
        methods.getContactApi(params);
        return
      }

      state.contact = res.data.data[0];

    } catch (error) {
      throw new Error(error)
    }
  }

</script>