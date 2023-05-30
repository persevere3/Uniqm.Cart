<template>
  <div class="rich">
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
      <!-- customize  -->
      <div class="main" v-if="rich_cid == 3">
        <div class="title" v-if="rich_id && customize_obj && customize_obj[rich_id]">
          {{customize_obj[rich_id].Name}}
        </div>
        <div class="rich_container" v-if="rich_id && customize_obj && customize_obj[rich_id]">
          <div class="ql-editor" v-html="unescapeHTML(customize_obj[rich_id].Text)"></div>
        </div>
      </div>

      <!-- navbar -->
      <div class="main" v-if="rich_cid == 0">
        <div class="title" v-if="rich_id && navbar_obj && navbar_obj[rich_id]">
          {{navbar_obj[rich_id].Name}}
        </div>
        <div class="rich_container" v-if="rich_id && navbar_obj && navbar_obj[rich_id]">
          <div class="ql-editor" v-html="unescapeHTML(navbar_obj[rich_id].Text)"></div>
        </div>
      </div>

      <!-- footer -->
      <div class="main" v-if="rich_cid == 1 || rich_cid == 2">
        <div class="title" v-if="rich_id && footer_obj && footer_obj[rich_id]">
          {{footer_obj[rich_id].Name}}
        </div>
        <div class="rich_container" v-if="rich_id && footer_obj && footer_obj[rich_id]">
          <div class="ql-editor" v-html="unescapeHTML(footer_obj[rich_id].Text)"></div>
        </div>
      </div>
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/rich.scss";
</style>
