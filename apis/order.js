import { formRequest, formDataRequest } from '@/utils/https'

/*
  getOrderApi
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
*/
export const getOrderApi = formData => formDataRequest.post('/interface/web/GetOrderContactAjax', formData);

/*
  getMemberOrderApi
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
*/
export const getMemberOrderApi = formData => formDataRequest.post('/interface/Webmember/GetMemberOrders', formData);

/*
  searchMartDeliveryApi
  let formData = new FormData();
  formData.append("Site", site.value.Site);
  formData.append("Store", site.value.Name);
  formData.append("MerchantTradeNo", MerchantTradeNo);
  formData.append("LogisticsSubType", LogisticsSubType);
*/
export const searchMartDeliveryApi = formData => formDataRequest.post('/interface/store/QueryLogisticsInfo', formData);