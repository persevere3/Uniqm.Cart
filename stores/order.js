import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

import { getOrderApi, getMemberOrderApi } from '@/api/index';


export const useOrder = defineStore('order', () => {
  // store ==================================================
  let { user_account } = storeToRefs(useCommon())
  let { getFormData } = useCommon()

  // state ==================================================
  const state = reactive({
    order_phone: '',
    order_mail: '',
    filter_number: '',
    filter_pay: '0',
    filter_delivery: '0',
    
    order: '',
    product_active: '',

    payStatus_arr: [
      '', '付款成功', '尚未付款', '已退款', '待對帳'
    ],
    delivery_arr: [
      '', '已出貨', '準備中', '已退貨', '已取消', '已自取'
    ],
    payMethod_obj: {
      'CreditCard':'信用卡',
      'ATM':'ATM',
      'PayCode':'超商代碼',
      'PayBarCode':'超商條碼',
      'PayOnDelivery':'取貨付款',
      'LinePay':'LinePay',
    },

    order_page_number: 0,
    order_page_index: 1,
    order_page_size: 10,
    select_active: false,

    is_payModal: false,
    payModal_message: '',
    is_logout: false,

    order_number: '',
    account_number: '',

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
      let formData = getFormData(obj)

      try {
        let res = await getOrderApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.getOrderApi(formData);
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
          uls.forEach(function(item, index){
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
    async getMemberOrder(type, is_filter) {
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

          phone: user_account.value,
          email: r_mail.value,

          pageindex: state.order_page_index,
          pagesize: state.order_page_size,

          filter_number: state.filter_number,
          filter_pay: state.filter_pay,
          filter_delivery: state.filter_delivery,
        }
        let formData = getFormData(obj)

        try {
          let res = await getMemberOrderApi(formData)
          if(res.data.errormessage) {
            await login();
            methods.getMemberOrderApi(formData);
            return
          }
    
          if(res.data.status) {
            let data = res.data.datas[0]

            order_page_number.value = Math.ceil(data.Count / order_page_size.value);
            if(vm.order_page_number == 0){
              vm.payModal_message = '沒有您查詢的訂單資料';
              vm.is_payModal = true;
              vm.order = null;
              return;
            }

            vm.order = data.Orders;

            setTimeout(() => {
              let uls = document.querySelectorAll('.td.products ul');
              uls.forEach(function(item, index) {
                let lis = item.querySelectorAll('li')
                if(lis.length > 4) {
                  vm.$set(vm.order[index],"expandable", true)
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
          resolve()
        }
      })
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})