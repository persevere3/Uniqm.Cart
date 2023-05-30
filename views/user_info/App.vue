<template>
  <div class="user_info" @click="address_select_active = ''; select_active = false">
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
                <date-picker placeholder="* 請輸入生日" format="YYYY/MM/DD" v-model="r_birthday.value"
                  @close="verify(r_birthday)" @clear="verify(r_birthday)">
                </date-picker>
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
                <input type="number" placeholder="* 請輸入手機" :readonly="!!user_info.Phone2" v-model.trim="r_phone2.value" @input="!!user_info.Phone2 ? r_phone2.value = $event.target.value : verify(r_phone2)">
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
                      <li v-for="(city, key) in city_district" :key="key" @click="item.city = key; item.district = ''"> {{ key }} </li>
                    </ul>
                  </div>
                  <div class="select"
                    @click.stop="address_select_active == `${item.id}_district`? address_select_active = '' : address_select_active = `${item.id}_district`">
                    <div class="value"> {{ item.district }} </div>
                    <div class="dropdown"> <i class="fas fa-caret-down"></i> </div>
                    <ul :class="{ active: address_select_active == `${item.id}_district` }">
                      <li v-for="district in city_district[item.city]" :key="district" @click="item.district = district;"> {{ district }}
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
            <div class="box">
              <div class="filter">
                <div class="item">
                  <label> 訂單編號 </label>
                  <input type="text" placeholder="訂單編號" v-model="filter_number">
                </div>
                
                <div class="item">
                  <label> 付款狀態 </label>
                  <select v-model="filter_pay">
                    <option value="0"> === 付款狀態 === </option>
                    <option :value="index" v-for="(item, index) in payStatus_arr" :key="index" v-show="index != 0"> {{ item }} </option>
                  </select>
                </div>

                <div class="item">
                  <label> 運送狀態 </label>
                  <select v-model="filter_delivery">
                    <option value="0"> === 運送狀態 === </option>
                    <option :value="index" v-for="(item, index) in delivery_arr" :key="index" v-show="index != 0"> {{ item }} </option>
                  </select>
                </div>

                <div class="button_row">
                  <div class="button" @click="getMemberOrder('', true)"> 篩選 </div>
                </div>
              </div>
            </div>

            <div class="table">
              <div class="head">
                <div class="tr">
                  <div class="td number">
                    訂單編號
                  </div>
                  <div class="td products">
                    商品
                  </div>
                  <div class="td amount">
                    金額
                  </div>
                  <div class="td payState">
                    付款狀態
                  </div>
                  <div class="td transportState">
                    運送狀態
                  </div>
                  <div class="td time">
                    成立時間
                  </div>
                </div>
              </div>
              <div class="body">
                <div class="tr" v-for="item in order" :key="item.FilNo">
                  <div class="td number">
                    {{item.FilNo}}
                  </div>
                  <div class="td products"
                    :class="{active : product_active == item.FilNo, expandable : item.expandable }"
                    @click="product_active == item.FilNo ? product_active = '' : product_active = item.FilNo">
                    <ul>
                      <li v-for="(item2, index) in item.Items" :key="index" v-show="product_active == item.FilNo || index < 4">
                        {{item2.ProductType == 2 ? '加價購' : ''}} {{item2.Name}}{{item2.Spec ? `(${item2.Spec})` : ''}}
                        NT${{numberThousands(item2.Price)}} x {{item2.Amount}}
                      </li>
                    </ul>
                    <template v-if="item.expandable">
                      <div class="icon" v-if="product_active == item.FilNo"> <i class="fa-solid fa-chevron-up"></i> </div>
                      <div class="icon" v-else> <i class="fa-solid fa-chevron-down"></i> </div>
                    </template>
                  </div>
                  <div class="td amount">
                    <div class="total">
                      應付金額: NT$ {{numberThousands(item.TotalAmount)}}
                    </div>
                    <div class="additional">
                      <div v-if="item.Shipping * 1"> 運費: NT$ {{numberThousands(item.Shipping)}} </div>
                      <div v-if="item.Discount * 1"> 折扣: NT$ {{numberThousands(item.Discount)}} </div>
                      <div v-if="item.DiscountCode && item.DiscountCode.split(' ')[0] * 1">
                        <div> 折扣碼優惠: NT$ {{numberThousands(item.DiscountCode.split(' ')[0])}} {{item.DiscountCode.split(' ')[1]}}</div>
                      </div>
                      <div v-if="item.UsedWallet * 1">
                        <div> 使用購物金: NT$ {{numberThousands(item.UsedWallet)}} </div>
                      </div>
                    </div>
                  </div>
                  <div class="td payState">
                    <div class="l_head"> 付款狀態 </div>
                    <!-- 付款方式 -->
                    <div v-if="item.PayMethod" class="payMethod"> {{payMethod_obj[item.PayMethod]}} </div>

                    <!-- 付款狀態 -->
                    <div class="state_container" v-if="item.Delivery == 3 || item.Delivery == 4">
                      <div> {{ payStatus_arr[item.PayStatus] }} </div>
                    </div>
                    <!-- PayStatus == 2 (待付款)，PayMethod == 'ATM'，PayType == 1 (公司) -->
                    <div class="state_container" v-else-if="item.PayStatus == 2 && item.PayMethod == 'ATM' && item.PayType == 1">
                      <template v-if="store.SelfAtmStatus == 0">
                        <div> ATM帳戶關閉，請聯繫我們 </div>
                      </template>
                      <template v-else>
                        <div class="show_bank">
                          <div class="button" @click.stop="is_payModal = true; payModal_message =  'template1'">
                            匯款帳戶
                          </div>
                        </div>
                        <div class="button"
                          @click.stop="is_payModal = true; payModal_message = 'template2'; account_number = ''; order_number = item.PayFilNo">
                          付款確認
                        </div>
                      </template>
                    </div>
                    <div class="state_container" v-else-if="item.PayStatus == 2 && item.PayMethod != 'PayOnDelivery'">
                      <div class="button"  @click="pay_method = item.PayMethod; rePay(item.FilNo, `${item.PayType === '2' ? '' : `${protocol}//${api}` }/user_info.html?page=order`)"> 立即付款 </div>
                    </div>
                    <div class="state_container" v-else>
                      <div> {{ payStatus_arr[item.PayStatus] }} </div>
                    </div>

                  </div>
                  <div class="td transportState">
                    <div class="l_head"> 運送狀態 </div>
                    {{delivery_arr[item.Delivery]}}
                    <template v-if="item.CancelTime && (item.Delivery == 3 || item.Delivery == 4)">
                      <div> {{ item.CancelTime.split(' ')[0] }} </div>
                      <div> {{ item.CancelTime.split(' ')[1] }} </div>
                    </template>
                    <template v-else-if="item.DeliveryTime && (item.Delivery == 1 || item.Delivery == 5)">
                      <div> {{ item.DeliveryTime.split(' ')[0] }} </div>
                      <div> {{ item.DeliveryTime.split(' ')[1] }} </div>
                    </template>
                  </div>
                  <div class="td time">
                    <div class="l_head"> 成立時間 </div>
                    <div> {{ item.CreateTime.split(' ')[0] }} </div>
                    <div> {{ item.CreateTime.split(' ')[1] }} </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="page_container">
              <div class="page">
                <ul>
                  <li :class="{'disabled' : order_page_index < 2}"
                    @click="order_page_index > 1 ? order_page_index-- : ''; getMemberOrder('page', true)"> <i
                      class="fas fa-caret-left"></i> </li>
                  <li
                    v-show="order_page_index > Math.floor(5/2) && order_page_index < order_page_number - Math.floor(5/2) ? item >= order_page_index - Math.floor(5/2) && item <= order_page_index + Math.floor(5/2) : order_page_index <= 5  ? item <= 5 : item > order_page_number - 5"
                    :class="{'active' : order_page_index === item}" v-for="item in order_page_number" :key="item"
                    @click="order_page_index = item; getMemberOrder('page', true)"> {{item}} </li>
                  <li :class="{'disabled' : order_page_index > order_page_number - 1}"
                    @click="order_page_index < order_page_number ? order_page_index++ : ''; getMemberOrder('page', true);"> <i
                      class="fas fa-caret-right"></i> </li>
                </ul>
              </div>
              <div class="total"> {{ order_page_index }} / {{ order_page_number }} </div>
              <div class="select" @click.stop="select_active = !select_active">
                <div class="value"> {{order_page_size}} </div>
                <i class="fas fa-caret-down"></i>
                <ul :class="{'active' : select_active}">
                  <li :class="{'active' : order_page_size === item * 10}" v-for="item in 5" :key="item"
                    @click="order_page_size = item * 10; getMemberOrder('', true)"> {{item * 10}} </li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="payModal_container" v-if="is_payModal">
        <div class="payModal">
          <div class="close" @click="is_payModal = false; payModal_message = ''; is_logout ? logout() : ''"><i class="fas fa-times"></i></div>

          <!-- 顯示帳戶 -->
          <template v-if="payModal_message == 'template1'">
            <div> 匯款銀行 : {{store.SelfAtmBankId}} {{bank[store.SelfAtmBankId]}}</div>
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
            <div class="message">
              請輸入匯款帳戶末6碼:
              <input type="number" @input="filter_account_number" @keydown.enter="checkPay" v-model="account_number">
            </div>
            <div class="button_row">
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
    </Common>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
@import "../.././assets/scss/user_info.scss";
</style>