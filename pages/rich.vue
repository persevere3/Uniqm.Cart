<style lang="scss" scoped>
  @import "@/assets/scss/pages/rich.scss";
</style>

<template>
  <div class="main" v-if="content_obj">
    <div class="title">
      {{ content_obj[rich_id].Name }}
    </div>
    <div class="rich_container">
      <div class="ql-editor" v-html="useUnescapeHTML(content_obj[rich_id].Text)"></div>
    </div>
  </div>
</template>

<script setup>
  // composables ========== ========== ========== ========== ==========
  import { useUnescapeHTML } from '@/composables/unescapeHTML'

  // stores ========== ========== ========== ========== ==========
  import { storeToRefs } from 'pinia'
  import { useWebCommon }  from '@/stores/web/common'

  let { all, is_getAll, demoOrigin, webVersion } = storeToRefs(useWebCommon())
  let { imgHandler } = useWebCommon()
  
  // state ========== ========== ========== ========== ==========
  const state = reactive({
    rich_id: 0,
    rich_cid: 0,
    content_obj: null
  })
  let { rich_id, rich_cid, content_obj } = toRefs(state)

  // composables ========== ========== ========== ========== ==========
  watch(is_getAll, async() => {
    const { id, cid } = useRoute().query
    state.rich_id = id
    state.rich_cid = cid

    // 第二層選單
    if(state.rich_cid === '0') {
      state.content_obj = toObj(all.value.websubcategory)
    }
    // 頁尾連結
    else if(state.rich_cid === '1' || state.rich_cid === '2') {
      state.content_obj = toObj(all.value.footer)
    }
    // 第一層選單
    else if(state.rich_cid === '3') {
      state.content_obj = toObj(all.value.webcategory)
    }

    if(webVersion.value === 'demo') {
      state.content_obj[rich_id.value].Text = state.content_obj[rich_id.value].Text.replaceAll('img src="', 'img src="' + demoOrigin.value)
    }

    await nextTick()
    imgHandler()
  })

  // methods ========== ========== ========== ========== ==========
  function toObj(arr) {
    let obj = {};
    if(!arr || !arr.length) return
    arr.forEach(item => obj[item.ID] = item)
    return obj;
  }
</script>