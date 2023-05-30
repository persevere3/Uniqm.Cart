<template>
  <div >
    <div class="carts_container" :class="{'hover' : is_carts_hover}" v-if="carts.length">
      <ul class="carts_items">
        <template v-for="item in carts" :key="item.ID">
          <!-- 有規格 -->
          <template v-if="item.specArr">
            <li v-for="spec in item.specArr " :key="spec.ID" v-show="spec.buyQty != 0 || spec.buyQty === ''" @click.stop="pushTo_cart(item.ID)">
              <div class="img_and_name">
                <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
                <div class="name"> {{ item.Name }}({{spec.Name}}) </div>
              </div>
              <div class="price_and_delete">
                <div class="price"> NT${{numberThousands(item.NowPrice)}} x {{spec.buyQty}}  </div>
                <div class="delete" @click.stop="delete_carts_item(item.ID, spec.ID)">
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
            </li>
          </template>
          <!-- 沒有規格 -->
          <li v-if="!item.specArr" @click.stop="pushTo_cart(item.ID)">
            <div class="img_and_name">
              <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
              <div class="name"> {{ item.Name }} </div>
            </div>
            <div class="price_and_delete">
              <div class="price"> NT${{numberThousands(item.NowPrice)}} x {{item.buyQty}}  </div>
              <div class="delete" @click.stop="delete_carts_item(item.ID)">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </li>

          <template v-if="item.addPrice">
            <template v-for=" (item2, index2) in item.addPrice">
              <!-- 有規格 -->
              <template v-if="item2.specArr">
                <li v-for="(spec2, specIndex2) in item2.specArr" :key="spec2.ID" v-show="spec2.buyQty != 0 || spec2.buyQty === ''" @click.stop="pushTo_cart(item.ID)">
                  <div class="img_and_name">
                    <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                    <div class="name"> 加價購 {{ item2.Name }}({{spec2.Name}}) </div>
                  </div>
                  <div class="price_and_delete">
                    <div class="price"> NT${{numberThousands(item2.Price)}} x {{spec2.buyQty}}  </div>
                    <!-- <div class="delete" @click.stop="spec2.buyQty = 0">
                      <i class="fas fa-trash-alt"></i>
                    </div> -->
                  </div>
                </li>
              </template>
              <!-- 沒有規格 -->
              <li v-if="!item2.specArr" @click.stop="pushTo_cart(item.ID)">
                <div class="img_and_name">
                  <div class="img" :style="{backgroundImage: `url(${item2.Img})`}"></div>
                  <div class="name"> 加價購 {{ item2.Name }} </div>
                </div>
                <div class="price_and_delete">
                  <div class="price"> NT${{numberThousands(item2.Price)}} x {{item2.Qty}}  </div>
                  <!-- <div class="delete" @click.stop="item2.buyQty = 0">
                    <i class="fas fa-trash-alt"></i>
                  </div> -->
                </div>
              </li>
            </template>
          </template>
        </template>
      </ul>
      <div class="pushTo_cart" @click.stop="pushTo_cart()">
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        前往購物車
      </div>
    </div>

    <div class="favorite_container" :class="{'hover' : is_favorite_hover}" v-if="Object.keys(favorite).length">
      <ul class="favorite_items">
        <template v-for="item in favorite" :key="item.ID">
          <li @click.stop="pushTo_cart(item.ID)">
            <div class="img_and_name">
              <div class="img" :style="{backgroundImage: `url(${item.Img1})`}"></div>
              <div class="name"> {{ item.Name }} </div>
            </div>
            <div class="price_and_delete">
              <div class="price"> NT${{numberThousands(item.NowPrice)}} </div>
              <div class="delete" @click.stop="toggleFavorite(item.ID)">
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>

    <header>
      <div class="logo" v-if="store">
        <a @click="urlPush(getPathname('index'))">
          <img :src="store.Logo" alt="">
        </a>
      </div>
      <div class="menu">
        <ul>
          <li @click="urlPush(getPathname('index'))"><i class="fa-solid fa-house"></i> <span class="none650"> 首頁 </span></li>
          <li @click.stop="is_favorite_hover = !is_favorite_hover; is_carts_hover = false"> 
            <i class="fa-solid fa-heart"></i> 
            <span class="none650"> 收藏 </span> 
          </li>
          <li @click.stop="carts.length ? is_carts_hover = !is_carts_hover : pushTo_cart(); is_favorite_hover = false"> 
            <i class="fa-solid fa-cart-shopping"></i> 
            <span class="none650"> 購物車 </span> 
          </li>
          <li @click="urlPush('/shoppingOrder.html')">
            <i class="fas fa-clipboard-list"></i>
            <span class="none650"> 訂單 </span>
          </li>
          <li v-if="site.MemberFuction * 1" @click="user_account ? urlPush('/shoppingInfo.html') : urlPush('/shoppingUser.html')">
            <i class="fa-solid fa-user"></i> 
            <span class="none650"> 會員中心 </span>
          </li>
        </ul>
      </div>
    </header>

    <div class="main" :class="user_nav_active">
      <div class="navs">
        <div class="nav register_nav" @click="user_nav_active = 'register'">
          註冊會員
        </div>
        <div class="nav login_nav" @click="user_nav_active = 'login'">
          會員登入
        </div>
        <div class="nav forget_nav" @click="user_nav_active = 'forget'">
          忘記密碼
        </div>
      </div>

      <form class="forms">
        <div class="form register_form">
          <div class="input_container">
            <input type="text" placeholder="請輸入推薦代碼" v-model.trim="r_recommender.value">
          </div>
          <div class="input_container" :class="{ error: r_name.is_error }">
            <input type="text" placeholder="* 請輸入姓名" v-model.trim="r_name.value" @blur="verify(r_name)">
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{  r_name.message  }}
            </div>
          </div>

          <div class="input_container" :class="{ error: r_account.is_error }">
            <input type="number" placeholder="* 請輸入手機(帳號)" v-model.trim="r_account.value" @blur="verify(r_account)">
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{  r_account.message  }}
            </div>
          </div>
          <template v-if="store.NotificationSystem == 1 || store.NotificationSystem == 2">
            <div class="input_container" :class="{ error: r_verify_code.is_error }">
              <input type="text" placeholder="* 請輸入手機驗證碼" v-model.trim="r_verify_code.value" @blur="verify(r_verify_code)"> 
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  r_verify_code.message  }}
              </div>
            </div>
          </template>

          <div class="input_container" :class="{ error: r_mail.is_error }">
            <input type="text" placeholder="* 請輸入電子信箱" v-model.trim="r_mail.value" @blur="verify(r_mail)">
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{  r_mail.message  }}
            </div>
          </div>
          <template v-if="store.NotificationSystem == 0 || store.NotificationSystem == 2">
            <div class="input_container" :class="{ error: r_verify_code2.is_error }">
              <input type="text" placeholder="* 請輸入電子信箱驗證碼" v-model.trim="r_verify_code2.value" @blur="verify(r_verify_code2)"> 
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  r_verify_code2.message  }}
              </div>
            </div>
          </template>
          
          <div class="button" style="margin-bottom: 20px;" @click="send_verify_code"> 獲取驗證碼 <span v-if="second > 0"> ( {{second}}s ) </span> </div>

          <div class="input_container" :class="{ error: r_birthday.is_error }">
            <date-picker placeholder="* 請輸入生日" format="YYYY/MM/DD" v-model="r_birthday.value" @close="verify(r_birthday)"
              @clear="verify(r_birthday)"></date-picker>
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{  r_birthday.message  }}
            </div>
          </div>
          <div class="radio_container">
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

          <div class="agree_container" v-if="site.TermsNotices">
            <div class="checkbox">
              <input type="checkbox" name="" id="agree" v-model="r_is_agree">
              <i class="fas fa-check" v-show="r_is_agree"></i>
            </div>
            <label for="agree"> 我已同意 </label>
            <div class="modal_text" @click="is_userModal = true;"> 會員條款與隱私權政策 </div>
          </div>

          <div class="button" :class="{ disabled: !r_is_agree }" @click="register"> 註冊 </div>
        </div>

        <div class="form login_form">
          <div class="input_container" :class="{ error: l_account.is_error }">
            <input type="number" placeholder="* 請輸入手機(帳號)" v-model.trim="l_account.value" @blur="verify(l_account)">
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{  l_account.message  }}
            </div>
          </div>
          <div class="input_container" :class="{ error: l_password.is_error }">
            <input :type="l_password_type" placeholder="* 請輸入密碼" v-model.trim="l_password.value"
              @blur="verify(l_password)" autocomplete="false">
            <div class="eyes_icon"
              @click.stop="l_password_type == 'password' ? l_password_type = 'text' : l_password_type = 'password'">
              <i class="fas fa-eye" v-if="l_password_type == 'text'"></i>
              <i class="fas fa-eye-slash" v-else></i>
            </div>
            <div class="error message">
              <i class="error_icon fas fa-exclamation-circle"></i> {{  l_password.message  }}
            </div>
          </div>

          <div class="button" @click="user_login"> 登入 </div>
        </div>

        <div class="form forget_form">
          <template v-if="forget_step == 1">
            <select name="" id="" v-model="mailOrAccount" v-if="store.NotificationSystem == 2">
              <option value="0"> 電子信箱 </option>
              <option value="1"> 手機 </option>
            </select>
            <div class="input_container" :class="{ error: f_mail.is_error }" v-if="store.NotificationSystem == 0 || (store.NotificationSystem == 2 && mailOrAccount == 0)">
              <input type="text" placeholder="* 請輸入電子信箱" v-model.trim="f_mail.value" @blur="verify(f_mail)">
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  f_mail.message  }}
              </div>
            </div>
            <div class="input_container" :class="{ error: f_account.is_error }" v-if="store.NotificationSystem == 1 || (store.NotificationSystem == 2 && mailOrAccount == 1)">
              <input type="number" placeholder="* 請輸入手機(帳號)" v-model.trim="f_account.value" @blur="verify(f_account)">
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  f_account.message  }}
              </div>
            </div>
            <div class="button" @click="send_forget_verify_code"> 獲取驗證碼 <span v-if="f_second > 0"> ( {{f_second}}s ) </span> </div>
          </template>

          <template v-if="forget_step == 2">
            <div class="input_container verify" :class="{ error: f_verify_code.is_error }">
              <input type="text" placeholder="* 請輸入驗證碼" v-model.trim="f_verify_code.value" @blur="verify(f_verify_code)"> 
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  f_verify_code.message  }}
              </div>
            </div>
            <div class="button" @click="check_forget_verify_code"> 送出 </div>

            <div class="button" @click="reset_input('f_mail') ; forget_step = 1;" v-if="store.NotificationSystem == 0 || (store.NotificationSystem == 2 && mailOrAccount  == 0)"> 重新輸入電子信箱 </div>
            <div class="button" @click="reset_input('f_account') ; forget_step = 1;" v-if="store.NotificationSystem == 1 || (store.NotificationSystem == 2 && mailOrAccount == 1)"> 重新輸入手機 </div>
          </template>

          <template v-if="forget_step == 3">
            <div class="input_container" :class="{ error: f_password.is_error }">
              <input :type="f_password_type" placeholder="* 請輸入密碼" v-model.trim="f_password.value"
                @blur="verify(f_password)" autocomplete="false">
              <div class="eyes_icon"
                @click.stop="f_password_type == 'password' ? f_password_type = 'text' : f_password_type = 'password'">
                <i class="fas fa-eye" v-if="f_password_type == 'text'"></i>
                <i class="fas fa-eye-slash" v-else></i>
              </div>
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  f_password.message  }}
              </div>
            </div>
            <div class="input_container" :class="{ error: f_confirm_password.is_error }">
              <input :type="f_confirm_password_type" placeholder="* 請再次輸入密碼" v-model.trim="f_confirm_password.value"
              @blur="verify(f_confirm_password)" autocomplete="false">
              <div class="eyes_icon"
                @click.stop="f_confirm_password_type == 'password' ? f_confirm_password_type = 'text' : f_confirm_password_type = 'password'">
                <i class="fas fa-eye" v-if="f_confirm_password_type == 'text'"></i>
                <i class="fas fa-eye-slash" v-else></i>
              </div>
              <div class="error message">
                <i class="error_icon fas fa-exclamation-circle"></i> {{  f_confirm_password.message  }}
              </div>
            </div>

            <div class="button" @click="edit_forget_pass"> 確認修改 </div>
            <div class="button" @click="reset_input('f_mail'); forget_step = 1;" v-if="store.NotificationSystem == 0 || (store.NotificationSystem == 2 && mailOrAccount == 0)"> 重新輸入電子信箱 </div>
            <div class="button" @click="reset_input('f_account'); forget_step = 1;" v-if="store.NotificationSystem == 1 || (store.NotificationSystem == 2 && mailOrAccount == 1)"> 重新輸入手機 </div>
          </template>
        </div>
      </form>

      <div class="third_login" v-if="user_nav_active != 'forget'">
        <div v-if="false" class="button" style="background-color: #3B5998;" > <i class="fa-brands fa-facebook"></i> 使用Facebook登入 </div>
        <div class="button" style="background-color: #00c300;" @click="user_nav_active === 'login' ? LineLogin() : is_LineRegister = true"> <i class="fa-brands fa-line"></i> 使用Line <span v-if="user_nav_active === 'register'">註冊</span> <span v-if="user_nav_active === 'login'">登入</span> </div>
      </div>
    </div>

    <div class="user_modal_container" v-if="is_userModal">
      <div class="close" @click="is_userModal = false;">
        <i class="fas fa-times"></i>
      </div>
      <div class="user_modal">
        <div class="content" v-html="unescapeHTML(site.TermsNotices)"></div>
      </div>
    </div>

    <div class="user_modal_container" v-if="is_LineRegister">
      <div class="close" @click="is_LineRegister = false;">
        <i class="fas fa-times"></i>
      </div>
      <div class="user_modal">
        <div class="content">
          <div class="input_container">
            <input type="text" placeholder="請輸入推薦代碼" v-model.trim="r_recommender.value">
            <div class="message"> (註冊後不可做更改，如果沒有推薦人可不填寫。) </div>
          </div>
          <div class="button" style="margin-bottom: 20px;" @click="validateRecommenderCode"> Line註冊 </div>
        </div>
      </div>
    </div>

    <div class="user_message_container" v-if="is_userMessage">
      <div class="user_message">
        <div class="close" @click="is_userMessage = false;">
          <i class="fas fa-times"></i>
        </div>
        <div class="message"> {{user_message}} </div>
      </div>
    </div>

    <footer>
      <div class="footerContact">
        <div class="footerContainer">
          <div class="w33">
            <p>智聯微網 統編: 42872739 </p>
            <p>台中市西屯區市政路386號四樓三</p>          
            <p>04-22520766</p>

            <a href="./privacy.html"> 隱私權政策 </a>
            <a href="./member-benefits.html"> 會員權益聲明 </a>
            <a href="./return.html"> 退換貨說明 </a>
          </div>
          <div class="w33">
            <div style="text-align:center; margin-bottom: 5px;"> 聯繫我們 </div>
            <a href="https://line.me/ti/p/@uniqm" target="_blank"> <img src="/image/qr-line.png" alt=""> </a>
            <!-- <span class="faicon"><i class="fa-brands fa-facebook-f"></i></span> -->
          </div>
        </div>
      </div>

      <div class="copyright">
        <div class="footerContainer">
          <p>Copyright &copy; 2023 - All Rights Reserved - UNIQ Micronet . </p>
        </div>
      </div>
      <Cookie />
    </footer>
  </div>
</template>

<script src="../.././Common.js"></script>

<style lang="scss">
  @import "../.././assets/scss/shoppingUser.scss";
</style>