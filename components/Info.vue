<template>
  <div class="main" :class="user_info_nav_active" v-if="user_account">
    <div class="logout_container button_row">
      <!-- <div> 
        <div class="button" v-if="user_info && user_info.Registermethod == 2" @click="deleteAccount_test" style="margin-right: 5px;"> 刪除Line帳號(測試用) </div>
        <div class="button" v-if="user_info && user_info.Registermethod <= 1 && user_info.ConnectLine" @click="unbindLine_test" style="margin-right: 5px;"> 解除Line綁定(測試用) </div>
      </div> -->
      <div class="button" v-if="user_info && user_info.Registermethod <= 1 && !user_info.ConnectLine" @click="bindLine" style="margin-right: 5px;"> 綁定Line帳號 </div>
      <div class="button" @click="post_logout"> 登出 </div>
    </div>

    <div class="navs">
      <div class="nav info_nav" @click="user_info_nav_active = 'info'; getUser_info()">
        個人資訊
      </div>
      <div class="nav bonus_nav" @click="user_info_nav_active = 'bonus'; getBonus()" >
        購物金紀錄
      </div>
      <div class="nav order_nav" @click="user_info_nav_active = 'order'; getMemberOrder()">
        訂單列表
      </div>
    </div>

    <form class="forms">
      <div class="form info_form">
        <div class="title top">
          <i class="fas fa-edit"></i> 編輯個人資訊
        </div>
        <div class="left">
          <div class="input_container" :class="{ error: r_name.is_error }">
            <div class="title"> 姓名 </div>
            <input type="text" placeholder="* 請輸入姓名" v-model.trim="r_name.value" @blur="verify(r_name)">
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{ r_name.message }}
            </div>
          </div>
          <div class="input_container" :class="{ error: r_mail.is_error }">
            <div class="title"> 電子信箱 </div>
            <input type="text" :readonly="!!user_info.Email" placeholder="* 請輸入電子信箱" v-model.trim="r_mail.value" @input="r_mail.value = $event.target.value">
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{ r_mail.message }}
            </div>
          </div>
          <div class="input_container" :class="{ error: r_birthday.is_error }" v-if="!!user_info.Birthday">
            <div class="title"> 生日 </div>
            <input type="text" readonly v-model.trim="birthday" @input="birthday.value = $event.target.value">
          </div>
          <div class="input_container" :class="{ error: r_birthday.is_error }" v-else>
            <div class="title"> 生日 </div>
            <!-- <date-picker placeholder="* 請輸入生日" format="YYYY/MM/DD" v-model="r_birthday.value"
              @close="verify(r_birthday)" @clear="verify(r_birthday)">
            </date-picker> -->
          </div>
          <div class="radio_container">
            <div class="title"> 性別 </div>
            <div class="radio">
              <input type="radio" name="sex" id="male" value="male" v-model="sex">
              <div class="circle" v-show="sex == 'male'"> </div>
            </div>
            <label for="male"> 男 </label>
            <div class="radio">
              <input type="radio" name="sex" id="female" value="female" v-model="sex">
              <div class="circle" v-show="sex == 'female'"> </div>
            </div>
            <label for="female"> 女 </label>
          </div>
        </div>

        <div class="right">
          <div class="input_container">
            <div class="title border"> 推薦人代碼 </div>
            <input type='text' readonly v-model="r_recommender.value">
          </div>

          <div class="input_container" :class="{ error: r_phone2.is_error }">
            <div class="title"> 手機 </div>
            <input type="text" placeholder="* 請輸入手機" :readonly="!!user_info.Phone2" v-model.trim="r_phone2.value" @input="!!user_info.Phone2 ? r_phone2.value = $event.target.value : verify(r_phone2)">
          </div>
          <template v-if="!user_info.Phone2 && (store.NotificationSystem == 1 || store.NotificationSystem == 2)">
            <div class="input_container" :class="{ error: r_verify_code.is_error }">
              <div class="title"> 手機驗證碼 </div>
              <input type="text" placeholder="* 請輸入手機驗證碼" v-model.trim="r_verify_code.value" @blur="verify(r_verify_code)"> 
            </div>
            <div class="button" style="margin-bottom: 20px;" @click="send_verify_code"> 獲取驗證碼 <span v-if="second > 0"> ( {{second}}s ) </span> </div>
          </template>

          <div class="password_container" v-if="user_info.Registermethod != 2">
            <div class="title"> 密碼 </div>
            <div class="button" @click="is_payModal = true; payModal_message = 'template3'"> 修改密碼 </div>
          </div>
          <div class="input_container">
            <div class="title border"> 推薦代碼 </div>
            <input type='text' id="copy_input" readonly v-model='recommend_code' @input="recommend_code = $event.target.value">
            <div class='copy' @click='copy(recommend_code)'>
              <i class='fas fa-copy'></i>
            </div>
          </div>

          <div class="title">
            常用收件地址
            <div class="add_address" @click="add_address" v-if="delivery_address && delivery_address.length < 3">
              <i class="fas fa-plus-circle"></i>
            </div>
          </div>
          <div class="address_container" :class="{error : item.is_error}" v-for="(item, index) in delivery_address"
            :key="index">
            <div class="address">
              <div class="select"
                @click.stop="address_select_active == `${item.id}_city`? address_select_active = '' : address_select_active = `${item.id}_city`">
                <div class="value"> {{ item.city }} </div>
                <div class="dropdown"> <i class="fas fa-caret-down"></i> </div>
                <ul :class="{ active: address_select_active == `${item.id}_city` }">
                  <li v-for="(value, city) in city_district" :key="city" @click="item.city = city; item.district = ''"> {{ city }} </li>
                </ul>
              </div>
              <div class="select"
                @click.stop="address_select_active == `${item.id}_district`? address_select_active = '' : address_select_active = `${item.id}_district`">
                <div class="value"> {{ item.district }} </div>
                <div class="dropdown"> <i class="fas fa-caret-down"></i> </div>
                <ul :class="{ active: address_select_active == `${item.id}_district` }">
                  <li v-for="(value, district) in city_district[item.city]" :key="district" @click="item.district = district;"> {{ district }}
                  </li>
                </ul>
              </div>
              <div class="input_container">
                <input type='text' placeholder="請輸入詳細地址" v-model.trim='item.detail'>
                <div class="error message">
                  <i class="error_icon fas fa-exclamation-circle"></i>
                  {{ item.message }}
                </div>
              </div>
            </div>
            <div class="delete" @click="delete_address(item.id)"> <i class="fas fa-trash-alt"></i> </div>
          </div>
        </div>

        <div class="button_row">
          <div class="button" @click="edit_info"> 儲存變更 </div>
        </div>
      </div>

      <div class="form bonus_form">
        <div class="title top"> <i class="fas fa-wallet"></i> 現有購物金: <span class="current_bonus"> {{ total_bonus }} </span> </div>

        <div class="table">
          <div class="head">
            <div class="tr">
              <div class="td date">
                日期
              </div>
              <div class="td bonus_type">
                購物金項目
              </div>
              <div class="td bonus">
                購物金
              </div>
            </div>
          </div>
          <div class="body">
            <div class="tr" v-for="(item, index) in bonus" :key="index">
              <div class="td date">
                <div> {{ item.Time.split(' ')[0] }} {{ item.Time.split(' ')[1] }}</div>
                <div> {{ item.Time.split(' ')[2] }} </div>
              </div>
              <div class="td bonus_type">
                {{ item.Type }}
              </div>
              <div class="td bonus" :class="item.FeedBack > 0 ? 'green' : 'red'">
                {{ item.FeedBack > 0 ? '+' : '' }}{{ item.FeedBack }}
              </div>
            </div>
          </div>
        </div>

        <div class="page_container">
          <div class="page">
            <ul>
              <li :class="{'disabled' : order_page_index < 2}"
                @click="order_page_index > 1 ? order_page_index-- : ''; getBonus('page')"> <i
                  class="fas fa-caret-left"></i> </li>
              <li
                v-show="order_page_index > Math.floor(5/2) && order_page_index < order_page_number - Math.floor(5/2) ? item >= order_page_index - Math.floor(5/2) && item <= order_page_index + Math.floor(5/2) : order_page_index <= 5  ? item <= 5 : item > order_page_number - 5"
                :class="{'active' : order_page_index === item}" v-for="item in order_page_number" :key="item"
                @click="order_page_index = item; getBonus('page')"> {{item}} </li>
              <li :class="{'disabled' : order_page_index > order_page_number - 1}"
                @click="order_page_index < order_page_number ? order_page_index++ : ''; getBonus('page');"> <i
                  class="fas fa-caret-right"></i> </li>
            </ul>
          </div>
          <div class="total"> {{ order_page_index }} / {{ order_page_number }} </div>
          <div class="select" @click.stop="select_active = !select_active">
            <div class="value"> {{order_page_size}} </div>
            <i class="fas fa-caret-down"></i>
            <ul :class="{'active' : select_active}">
              <li :class="{'active' : order_page_size === item * 10}" v-for="item in 5" :key="item"
                @click="order_page_size = item * 10; getBonus()"> {{item * 10}} </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="form order_form" v-if="order">
        <Order />
      </div>
    </form>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'

  import {  } from '../api/index'

  // store
  import { useCommon }  from '@/stores/common/common'
  import { useVerify }  from '@/stores/cross/verify'
  import { useInfo }  from '@/stores/info'
  import { useUser }  from '@/stores/user'
  import { useOrder }  from '@/stores/order'

  let { store, user_account, is_payModal, payModal_message } = storeToRefs(useCommon())
  let { send_verify_code, getPathname } = useCommon()
  let { user_info_nav_active, user_info, add_address, recommend_code, delivery_address, total_bonus, bonus} = storeToRefs(useInfo())
  let { bindLine, post_logout, getUser_info, getBonus, getMemberOrder, edit_info} = useInfo()
  let { r_name, r_mail, r_birthday, sex, r_recommender, r_phone2, r_verify_code, second, } = storeToRefs(useUser())
  let {  } = useUser()
  let { order_page_index, order_page_number, select_active, order_page_size } = storeToRefs(useOrder())
  let { verify } = useVerify()

  const { RtnMsg , page } = useRoute().query
  await getUser_info();
  if(RtnMsg) {
    payModal_message.value = '已收到您的付款';
    is_payModal.value = true;
  }
  if(page === 'order') {
    user_info_nav_active.value = 'order'; 
    getMemberOrder()
  }

  useRouter().replace({ path: getPathname('info') })

  const state = reactive({

  })
  let {  } = toRefs(state)

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================

  
</script>