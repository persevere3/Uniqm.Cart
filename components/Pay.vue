<template>
  <div class="payModal_container" v-if="is_payModal">
    <div class="payModal bank">
      <div class="close" @click="is_payModal = false; payModal_message = ''; is_logout ? logout() : ''"><i class="fas fa-times"></i></div>

      <!-- 顯示帳戶 -->
      <template v-if="payModal_message == 'template1'">
        <div> 匯款銀行 : {{ store.SelfAtmBankId }} {{ bank[store.SelfAtmBankId] }} </div>
        <div class='bank_account'>
          <div class="bank_title"> 匯款帳號 : </div>
          <input type='text' id='bank_copy_input' readonly v-model='store.SelfAtmId'>
          <div class='copy' @click='copy(store.SelfAtmId, "bank_copy_input")'>
            <i class='fas fa-copy'></i>
          </div>
        </div>
      </template>

      <!-- 輸入帳戶 -->
      <template v-else-if="payModal_message == 'template2'">
        <div class="message" style="margin: 0 auto;">
          請輸入匯款帳戶末6碼:
          <input type="number" @input="filter_account_number" @keydown.enter="checkPay" v-model="account_number">
        </div>
        <div class="button_row" style="margin: 0 auto;">
          <div class="button" @click="checkPay">
            確認
          </div>
        </div>
      </template>

      <!-- 修改密碼 -->
      <template v-else-if="payModal_message == 'template3'">
        <div class="input_container" :class="{ error: o_password.is_error }">
          <input :type="o_password_type" placeholder="* 請輸入原密碼" v-model.trim="o_password.value"
            @blur="verify(o_password)" autocomplete="false">
          <div class="eyes_icon"
            @click.stop="o_password_type == 'password' ? o_password_type = 'text' : o_password_type = 'password'">
            <i class="fas fa-eye" v-if="o_password_type == 'text'"></i>
            <i class="fas fa-eye-slash" v-else></i>
          </div>
          <div class="error message">
            <i class="error_icon fas fa-exclamation-circle"></i> {{  o_password.message  }}
          </div>
        </div>
        <div class="input_container" :class="{ error: r_password.is_error }">
          <input :type="r_password_type" placeholder="* 請輸入密碼" v-model.trim="r_password.value"
            @blur="verify(r_password)" autocomplete="false">
          <div class="eyes_icon"
            @click.stop="r_password_type == 'password' ? r_password_type = 'text' : r_password_type = 'password'">
            <i class="fas fa-eye" v-if="r_password_type == 'text'"></i>
            <i class="fas fa-eye-slash" v-else></i>
          </div>
          <div class="error message">
            <i class="error_icon fas fa-exclamation-circle"></i> {{  r_password.message  }}
          </div>
        </div>
        <div class="input_container" :class="{ error: r_confirm_password.is_error }">
          <input :type="r_confirm_password_type" placeholder="* 請再次輸入密碼" v-model.trim="r_confirm_password.value"
            @blur="verify(r_confirm_password)" autocomplete="false">
          <div class="eyes_icon"
            @click.stop="r_confirm_password_type == 'password' ? r_confirm_password_type = 'text' : r_confirm_password_type = 'password'">
            <i class="fas fa-eye" v-if="r_confirm_password_type == 'text'"></i>
            <i class="fas fa-eye-slash" v-else></i>
          </div>
          <div class="error message">
            <i class="error_icon fas fa-exclamation-circle"></i> {{  r_confirm_password.message  }}
          </div>
        </div>
        <div class="button" @click="edit_pass"> 修改密碼 </div>
      </template>
      
      <template v-else>
        <div class="message" v-html="payModal_message"> </div>
      </template>
    </div>
  </div>

  <div class="ECPay_form_container" v-html="ECPay_form" ></div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import { checkPayApi } from '../api/index'

  // store
  import { useCommon }  from '@/stores/common/common'
  import { useInfo }  from '@/stores/common/info'
  import { useUser }  from '@/stores/common/user'
  import { useVerify }  from '@/stores/common/verify'

  let { store, bank, account_number, order_number, 
    is_payModal, payModal_message, is_logout 
  } = storeToRefs(useCommon())
  let { copy } = useCommon()
  let {  } = storeToRefs(useInfo())
  let { logout } = useInfo()
  let { o_password, o_password_type, r_password, r_password_type, r_confirm_password, r_confirm_password_type } = storeToRefs(useUser())
  let {  } = useUser()
  let { verify } = useVerify()

  const state = reactive({

  })
  let {  } = toRefs(state)

  definePageMeta({
    layout: 'uniqm'
  })

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================
  function filter_account_number() {
    if(account_number.value.length > 6) {
      account_number.value = account_number.value.substring(0, 6)
    }
  }
  async function checkPay() {
    if(!order_number.value || !account_number.value || account_number.value.length < 6) {
      payModal_message.value = '請填寫匯款帳號末6碼';
      is_payModal.value = true;
      return
    }

    let formData = new FormData();
    formData.append("payflino", order_number.value);
    formData.append("paytradeno", account_number.value);

    try {
      let res = await checkPayApi(formData)
      if(res.data.errormessage) {
        await methods.login();
        checkPayApi(formData);
        return
      }

      if(res.data.status) payModal_message.value = '帳號末6碼已送出，確認您的付款中' 
      else payModal_message.value = '抱歉，請重新輸入帳號末6碼'
      is_payModal.value = true;

      let pathname = location.pathname;
      if(pathname.indexOf('order') > -1 && !user_account.value) getOrder('page', true)
      else state.getMemberOrder('page', true)
    } catch (error) {
      throw new Error(error)
    }
  }
  
</script>