import { formRequest, formDataRequest } from '@/utils/https'

/*
  discountApi
  let obj = {
    code: state.discountCode,
    Preview: site.value.Preview
  }
  let params = methods.return_formUrlencoded(obj)
*/
export const discountApi = params => formRequest.post('/interface/store/CheckDiscountCode', params);

/*
  getTotalApi
  let cartStrObj = createCartStrObj();

  let formDataObj = {
    // 商店
    'Site': site.value.Site,
    'StoreName': site.value.Name,
    'productName': store.value.Name,
    'LogoUrl': location.origin + store.value.PayLogo,
    'Preview': site.value.Preview,

    // 商品
    'ProductIdList': cartStrObj.id,
    'PriceList': cartStrObj.price,
    'AmountList': cartStrObj.qry,
    'ExtraProductIdList': cartStrObj.additionalid,
    'ExtraPriceList': cartStrObj.additionalprice,
    'ExtraAmountList': cartStrObj.additionalqry,
    'SizeIdList': cartStrObj.specificationid,
    'SizeAmountList': cartStrObj.specificationqty,
    'ItemName': cartStrObj.ItemName,

    // 折扣碼
    'DiscountCode': successUsedDiscountCode.value,

    // 金額
    'Discount': total.value.Discount * 1,
    'DiscountPrice': total.value.DiscountCode * 1,
    'Shipping': total.value.Shipping * 1,
    'Total': total.value.Sum * 1,

    // 購買人
    'Email': info.value.purchaser_email.value,
    'Name': info.value.purchaser_name.value,
    'Phone': info.value.purchaser_number.value,
    'Phone2': info.value.purchaser_number.value,
    'Receiver': info.value.receiver_name.value,
    'ReceiverPhone': info.value.receiver_number.value,
    'Message': info_message.value,
    
    // 購物金
    'MemberWallet': use_bonus.value,
    'MemberBonus': member_bonus.value,
  }

  // 運送方式 支付方式
  if(transport.value === '1' || transport.value === '2') {
    formDataObj['SendWay'] = transport.value
    formDataObj['PayMethod'] = pay_method.value
    formDataObj['PayType'] = store.value[pay_method.value]
  }
  else {
    formDataObj['SendWay'] = 3
    formDataObj['Mart'] = transport.value

    if(transport.value.indexOf('Delivery') > -1) {
      formDataObj['PayMethod'] = transport.value
      formDataObj['PayType'] = 1
    }
    else {
      formDataObj['PayMethod'] = pay_method.value
      formDataObj['PayType'] = store.value[pay_method.value]
    }

    // 0 代收 1 不代收
    formDataObj['IsCollection'] = transport.value.indexOf('Delivery') > -1 ? 0 : 1
  }

  // 地址 
  if(is_store.value) formDataObj['Address'] = encodeURI(`${storeid.value} - ${storename.value} - ${storeaddress.value}`)
  else formDataObj['Address'] = encodeURI(receiver_address.value)
  if(userInfo.value.address_obj && Object.keys(userInfo.value.address_obj).length < 3 && !has_address.value && is_save_address.value) {
    let id = new Date().getTime();
    formDataObj['saveAddressStr'] = encodeURI(`${id}_ _${receiver_address.value.replace(/ /g, '_ _')}`)
  }
  else formDataObj['saveAddressStr'] = ''

  // 郵遞區號 
  if(userInfo.value.city_active && userInfo.value.district_active) {
    formDataObj['ZipCode'] = state.city_district[userInfo.value.city_active][userInfo.value.district_active]
  } else {
    formDataObj['ZipCode'] = ''
  }

  // 超商取貨付款 
  if(is_store.value) formDataObj['StoreID'] = storeid.value;

  // 發票
  formDataObj['Type'] = invoice_type.value * 1
  formDataObj['Title'] = invoice_title.value * 1
  if(invoice_type.value === '3') {
    formDataObj['UniNumber'] = phone_barCode.value
    formDataObj['savePhoneCode'] = phone_barCode.value
    formDataObj['saveNatureCode'] = ''
  }
  else if(invoice_type.value === '4') {
    formDataObj['UniNumber'] = natural_barCode.value
    formDataObj['savePhoneCode'] = ''
    formDataObj['saveNatureCode'] = natural_barCode.value
  }
  else formDataObj['UniNumber'] = invoice_uniNumber.value

  let formData = return_formData(formDataObj)
*/
export const getTotalApi = formData => formRequest.post('/interface/store/GetProductTotal', formData);

/*
  createOrderApi
  let cartStrObj = createCartStrObj();

  let formDataObj = {
    // 商店
    'Site': site.value.Site,
    'StoreName': site.value.Name,
    'productName': store.value.Name,
    'LogoUrl': location.origin + store.value.PayLogo,
    'Preview': site.value.Preview,

    // 商品
    'ProductIdList': cartStrObj.id,
    'PriceList': cartStrObj.price,
    'AmountList': cartStrObj.qry,
    'ExtraProductIdList': cartStrObj.additionalid,
    'ExtraPriceList': cartStrObj.additionalprice,
    'ExtraAmountList': cartStrObj.additionalqry,
    'SizeIdList': cartStrObj.specificationid,
    'SizeAmountList': cartStrObj.specificationqty,
    'ItemName': cartStrObj.ItemName,

    // 折扣碼
    'DiscountCode': successUsedDiscountCode.value,

    // 金額
    'Discount': total.value.Discount * 1,
    'DiscountPrice': total.value.DiscountCode * 1,
    'Shipping': total.value.Shipping * 1,
    'Total': total.value.Sum * 1,

    // 購買人
    'Email': info.value.purchaser_email.value,
    'Name': info.value.purchaser_name.value,
    'Phone': info.value.purchaser_number.value,
    'Phone2': info.value.purchaser_number.value,
    'Receiver': info.value.receiver_name.value,
    'ReceiverPhone': info.value.receiver_number.value,
    'Message': info_message.value,
    
    // 購物金
    'MemberWallet': use_bonus.value,
    'MemberBonus': member_bonus.value,
  }

  // 運送方式 支付方式
  if(transport.value === '1' || transport.value === '2') {
    formDataObj['SendWay'] = transport.value
    formDataObj['PayMethod'] = pay_method.value
    formDataObj['PayType'] = store.value[pay_method.value]
  }
  else {
    formDataObj['SendWay'] = 3
    formDataObj['Mart'] = transport.value

    if(transport.value.indexOf('Delivery') > -1) {
      formDataObj['PayMethod'] = transport.value
      formDataObj['PayType'] = 1
    }
    else {
      formDataObj['PayMethod'] = pay_method.value
      formDataObj['PayType'] = store.value[pay_method.value]
    }

    // 0 代收 1 不代收
    formDataObj['IsCollection'] = transport.value.indexOf('Delivery') > -1 ? 0 : 1
  }

  // 地址 
  if(is_store.value) formDataObj['Address'] = encodeURI(`${storeid.value} - ${storename.value} - ${storeaddress.value}`)
  else formDataObj['Address'] = encodeURI(receiver_address.value)
  if(userInfo.value.address_obj && Object.keys(userInfo.value.address_obj).length < 3 && !has_address.value && is_save_address.value) {
    let id = new Date().getTime();
    formDataObj['saveAddressStr'] = encodeURI(`${id}_ _${receiver_address.value.replace(/ /g, '_ _')}`)
  }
  else formDataObj['saveAddressStr'] = ''

  // 郵遞區號 
  if(userInfo.value.city_active && userInfo.value.district_active) {
    formDataObj['ZipCode'] = state.city_district[userInfo.value.city_active][userInfo.value.district_active]
  } else {
    formDataObj['ZipCode'] = ''
  }

  // 超商取貨付款 
  if(is_store.value) formDataObj['StoreID'] = storeid.value;

  // 發票
  formDataObj['Type'] = invoice_type.value * 1
  formDataObj['Title'] = invoice_title.value * 1
  if(invoice_type.value === '3') {
    formDataObj['UniNumber'] = phone_barCode.value
    formDataObj['savePhoneCode'] = phone_barCode.value
    formDataObj['saveNatureCode'] = ''
  }
  else if(invoice_type.value === '4') {
    formDataObj['UniNumber'] = natural_barCode.value
    formDataObj['savePhoneCode'] = ''
    formDataObj['saveNatureCode'] = natural_barCode.value
  }
  else formDataObj['UniNumber'] = invoice_uniNumber.value

  let formData = return_formData(formDataObj)
*/
export const createOrderApi = formData => formDataRequest.post('/LineMK/Line/OrderPayRequest', formData);

// ========== ========== ========== ========== ==========

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
  let obj = {
    Site: site.value.Site,
    Store: site.value.Name,
    MerchantTradeNo: item.FilNo,
    LogisticsSubType: item.Mart.replace('Delivery', '')
  }
  let formData = return_formData(obj)
*/
export const searchMartDeliveryApi = formData => formDataRequest.post('/interface/store/QueryLogisticsInfo', formData);