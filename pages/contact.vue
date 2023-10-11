<style lang="scss" scoped>
  @import "@/assets/scss/contact.scss";
</style>

<template>
  <div class="main" v-if="contact">
    <div class="opening">
      <div class="title">
        <p>〈 服務時間 〉</p>
      </div>
      <div class="text">
        <ul>
          <li v-if="contact.Open">{{contact.Open}}</li>
        </ul>
      </div>
    </div>

    <div class="info">
      <div class="title">
        <p>〈 聯絡資訊 〉</p>
      </div>
      <div class="text">
        <ul>
          <li v-if="contact.Phone">電話客服｜{{contact.Phone}}</li>
          <li v-if="contact.Email">Email｜{{contact.Email}}</li>
          <li v-if="contact.Line">LINE｜{{contact.Line}}</li>
          <li v-if="contact.FBName">FB粉絲團｜<div class="a" @click="urlPush(contact.FBLink, true)">{{contact.FBName}}</div> </li>
        </ul>
      </div>
    </div>

    <div class="location">
      <div class="left">
        <div class="title">
          <p>〈 公司位置  〉</p>
        </div>
        <div class="text">
          <ul>
            <li v-if="contact.Address">
              <div class="item_name">地址｜</div>
              <div>{{contact.Address}}</div>
            </li>
            <li v-if="contact.Text">
              <div class="item_name">備註｜</div>
              <div>{{contact.Text}}</div>
            </li>
            <li v-if="contact.Traffic">
              <div class="item_name">交通方式｜</div>
              <div>{{contact.Traffic}}</div>
            </li>
          </ul>
        </div>
      </div>
      <div class="right" v-if="contact.Map" v-html="unescapeHTML(contact.Map)"></div>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getContactApi } from '@/apis/pages'

  // store
  import { useCommon }  from '@/stores/common/common'

  let { site, is_getSite } = storeToRefs(useCommon())
  let { return_formUrlencoded, login, imgHandler, urlPush, unescapeHTML } = useCommon()
  
  const state = reactive({
    contact: {}
  })
  let { contact } = toRefs(state)

  // watch ==================================================
  watch(is_getSite, async() => {
    await getContact()
    await nextTick()
    imgHandler()
  },)

  // methods ==================================================
  async function getContact() {
    let params = return_formUrlencoded('WebPreview')

    try {
      let res = await getContactApi(params)
      if(res.data.errormessage) {
        await login();
        getContact();
        return
      }

      state.contact = res.data.data[0];
    } catch (error) {
      throw new Error(error)
    }
  }
</script>