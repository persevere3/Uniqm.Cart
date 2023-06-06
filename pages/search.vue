<style lang="scss">
  @import "../assets/scss/search.scss";
</style>

<template>
  <div class="main">
    search
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getSearchApi } from '@/api/index.js'

  // store
  import { useCommon }  from '@/stores/common/common'

  let { site, perpage_num, totalpage_num, page_active } = storeToRefs(useCommon())
  let { login } = useCommon()
  
  const state = reactive({
    sortBy_arr: [ '商品排序', '上架時間: 由新至舊', '上架時間: 由舊至新', '價格: 由高至低', '價格: 由低至高'],
    sortBy_index: 0,
    perpage_num_arr: [ 6, 9, 12, 15],
    // query
    search_title: '',
    // res
    search: '',
  })
  let {  } = toRefs(state)

  const {query, type} = useRoute().params

  onMounted(() => {
    if(query) getSearch()
  })

  // methods ==================================================
  async function getSearch(index) {
    if(index) state.sortBy_index = index * 1;
    else {
      state.search_title = decodeURI(query);
      state.sortBy_index = type;
    }

    let formData = new FormData();
    formData.append("input", state.search_title);
    formData.append("type", state.sortBy_index);
    formData.append("WebPreview", site.value.WebPreview);

    try {
      let res = await getSearchApi(formData)
      if(res.data.errormessage) {
        await login();
        methods.getSearchApi(formData);
        return
      }

      state.search = res.data.data;
      perpage_num.value =  6;
      totalpage_num.value = Math.ceil(state.search.length / perpage_num.value);
      page_active.value = 1;
    } catch (error) {
      throw new Error(error)
    }
  }

</script>