import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

import { getOrderApi, getMemberOrderApi, searchMartDeliveryApi } from '@/apis/order';
import { rePayApi } from '@/apis/pay';

export const useOrder = defineStore('order', () => {
  // store ==================================================
  let { site, user_account, payModal_message, is_payModal, webVersion } = storeToRefs(useCommon())
  let { return_formData, urlPush } = useCommon()

  // state ==================================================
  const state = reactive({
    order_phone: '',
    order_mail: '',
    filter_number: '',
    filter_pay: '0',
    filter_delivery: '0',
    
    order: '',
    // 展開某一筆訂單的產品列表
    product_active: '',
    // 某一筆訂單的運送狀態
    activeOrder: null,

    payStatus_arr: [
      '', '付款成功', '尚未付款', '已退款', '待對帳', '尚未付款'
    ],
    delivery_arr: [     
      '', '已出貨', '準備中', '已退貨', '已取消', '已自取', '已送達', '已取貨'
    ],

    payMethod_obj: {
      'CreditCard':'信用卡',
      'ATM':'ATM',
      'PayCode':'超商代碼',
      'PayBarCode':'超商條碼',
      'PayOnDelivery':'宅配取貨付款',
      'LinePay':'LinePay',
      'MartPayOnDelivery': '超商取貨付款',
      'MartOnDelivery': '超商取貨不付款'
    },
    martObj: {
      'UNIMART': '7-11',
      'UNIMARTFREEZE': '7-11 冷凍',
      'FAMI': '全家',
      'HILIFE': '萊爾富',
      'OKMART': 'OK超商'
    },

    order_page_number: 0,
    order_page_index: 1,
    order_page_size: 10,
    select_active: false,

    // 確認付款參數
    order_number: '',
    account_number: '',

    // 前往付款
    pay_method: '',

    payResult: '',
    ECPay_form: '',

    noOrder: false,
  })

  // methods ==================================================
  const methods = {
    async getOrder(type, is_filter) {
      if(!state.order_phone) {
        payModal_message.value = '請填寫購買人連絡電話';
        is_payModal.value = true;
        state.order = null;
        return
      } else if(!state.order_mail) {
        payModal_message.value = '請填寫購買人電子信箱';
        is_payModal.value = true;
        state.order = null;
        return
      }

      if(!type) state.order_page_index = 1
      if(!is_filter) {
        state.filter_number = '';
        state.filter_pay = '0';
        state.filter_delivery = '0';
      }
      let obj = {
        Site: site.value.Site,
        Store: site.value.Store,

        phone: state.order_phone.trim(),
        email: state.order_mail.trim(),

        pagesize: state.order_page_size,
        pageindex: state.order_page_index,

        filter_number: state.filter_number,
        filter_pay: state.filter_pay,
        filter_delivery: state.filter_delivery
      }
      let formData = return_formData(obj)

      try {
        let res = await getOrderApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.getOrder(type, is_filter)
          return
        }

        let orders = res.data.Orders;
        let order_page_number = Math.ceil(res.data.Count / state.order_page_size)
        if(order_page_number == 0) {
          payModal_message.value = '沒有您查詢的訂單資料';
          is_payModal.value = true;
          state.filter_number = '';
          state.filter_pay = '0';
          state.filter_delivery = '0';
          state.noOrder = true
          return;
        } else {
          state.order = orders;
          state.order_page_number = order_page_number
          state.noOrder = false
        }

        setTimeout(() => {
          let uls = document.querySelectorAll('.td.products ul');
          uls.forEach(function(item, index) {
            let lis = item.querySelectorAll('li')
            if(lis.length > 4){
              state.order[index]['expandable'] = true
            }
          })
        }, 100)
      } catch (error) {
        throw new Error(error)
      }
    },
    getMemberOrder(type, is_filter) {
      return new Promise(async(resolve) => {
        if(!type) state.order_page_index = 1;
        if(!is_filter) {
          state.filter_number = '';
          state.filter_pay = '0';
          state.filter_delivery = '0';
        }
        let obj = {
          site: site.value.Site,
          storeid: site.value.Name,
          storename: site.value.Store,

          phone: state.order_phone,
          email: state.order_mail,

          pageindex: state.order_page_index,
          pagesize: state.order_page_size,

          filter_number: state.filter_number,
          filter_pay: state.filter_pay,
          filter_delivery: state.filter_delivery,
        }
        let formData = return_formData(obj)

        try {
          let res = await getMemberOrderApi(formData)
          if(res.data.errormessage) {
            await login();
            methods.getMemberOrder(type, is_filter)
            return
          }
    
          if(res.data.status) {
            let data = res.data.datas[0] || {}

            state.order_page_number = Math.ceil(data.Count / state.order_page_size);
            if(state.order_page_number == 0) {
              payModal_message.value = '沒有您查詢的訂單資料';
              is_payModal.value = true;
              state.order = null;
              return;
            }

            state.order = data.Orders;

            setTimeout(() => {
              let uls = document.querySelectorAll('.td.products ul');
              uls.forEach(function(item, index) {
                let lis = item.querySelectorAll('li')
                if(lis.length > 4) {
                  // 產品列表可展開
                  state.order[index].expandable = true
                }
              })
            }, 100)
          } else {
            payModal_message.value = res.data.msg;
            check_logout();
            is_payModal.value = true;
          }

          resolve()
        } catch (error) {
          throw new Error(error)
        }
      })
    },

    async rePay(FilNo, url) {
      let formData = new FormData();
      formData.append("StoreId", site.value.Name);
      formData.append("flino", FilNo);
      formData.append("url", url);

      try {
        let res = await rePayApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.rePay(FilNo, url);
          return
        }

        if('status' in res.data) {
          alert(res.data.msg)
          if(user_account.value) methods.getMemberOrder()
          else methods.getOrder()
        }
        else {
          state.payResult = res.data
          methods.toPay()
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    toPay() {
      // LinePay
      if(state.pay_method === 'LinePay') {
        urlPush(state.payResult.payUrl)
      }
      // ecpay
      else {
        if(webVersion.value === 'demo') {
          // target="_blank"
          state.ECPay_form = `<form id="ECPay_form" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">`
        } else {
          state.ECPay_form = `<form id="ECPay_form" action="https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">`
        }

        for(let item in state.payResult) {
          if(item === 'success' || item === 'message') continue
          // EncryptType TotalAmount ExpireDate: number，other: text
          state.ECPay_form += `<input 
            type="${item == 'EncryptType' || item == 'TotalAmount' || item == 'ExpireDate' ? 'number' : 'text'}" 
            name="${item}" value="${state.payResult[item]}"
          >`;
        }
        state.ECPay_form += `
            <div class="message"> 前往付款頁面 </div>
            <div class="button_row">
              <div class="button" onclick="document.querySelector('.ECPay_form_container').style.display = 'none'" > 取消 </div> 
              <div class="button" onclick="document.querySelector('#ECPay_form').submit(); document.querySelector('.ECPay_form_container').style.display = 'none'" > 確認 </div> 
            </div>
          </form>
        `;

        setTimeout(() => {
          document.querySelector('.ECPay_form_container').style.display = 'block'
        }, 100)
      }
    },

    async searchMartDelivery(item) {
      let MerchantTradeNo = item.FilNo
      let LogisticsSubType = item.Mart.replace('Delivery', '')
      let formData = new FormData();
      formData.append("Site", site.value.Site);
      formData.append("Store", site.value.Name);
      formData.append("MerchantTradeNo", MerchantTradeNo);
      formData.append("LogisticsSubType", LogisticsSubType);

      try {
        let res = await searchMartDeliveryApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.searchMartDelivery(item);
          return
        }

        let martName = decodeURI(item.Address).split(' - ')[1] || ''
        let deliveryMsg = res.data.split('|')[0] || ''
        let deliveryNumber = res.data.split('|')[1] || ''
        if(deliveryMsg.indexOf('已配達') > -1) deliveryMsg += ` - ${martName}`
        item.deliveryMsg = deliveryMsg
        if(deliveryNumber) item.deliveryNumber = deliveryNumber
        state.activeOrder = item
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  return {
    ...toRefs(state),

    ...methods
  }
})