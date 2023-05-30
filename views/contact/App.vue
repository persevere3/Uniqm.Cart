<template>
  <div class="contact">
   <Common 
      :json_site="JSON.stringify(site)" 
      :json_all="JSON.stringify(all)"
      :json_store="JSON.stringify(store)"
      :json_footer_community="JSON.stringify(footer_community)"
      :json_copyRight="JSON.stringify(copyRight)"
      :json_customerService="JSON.stringify(customerService)"
      :json_carts="JSON.stringify(carts)"
      :json_favorite="JSON.stringify(favorite)"
      :user_account="user_account"
    > 
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
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/contact.scss";
</style>
