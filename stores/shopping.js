import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

import { getCategoriesApi } from '@/api/index';


export const useShopping = defineStore('shopping', () => {
  // store ==================================================
  let { site } = storeToRefs(useCommon())

  // state ==================================================
  const state = reactive({
    categories: [],
    products: [],

    active_category_id: 0,
    
    search_text: '',
  })

  let filter_products = computed(() => {
    if(state.active_category_id == 0) {
      if(state.search_text) {
        return products.value.filter(item => item.Name.indexOf(this.search_text) > -1)
      } else {
        return products.value
      }
    }
    return products.value.filter(item => {
      let category_arr = [item.Category1, item.Category2, item.Category3, item.Category4, item.Category5]
      return category_arr.indexOf(state.active_category_id) > -1 && (state.search_text ? item.Name.indexOf(state.search_text) > -1 : true) 
    })
  })

  // methods ==================================================
  const methods = {
    async getCategories() {
      let params = `Preview=${site.value.Preview}`;

      try {
        let res = await getCategoriesApi(params)
        if(res.data.errormessage) {
          await methods.login();
          methods.getCategories();
          return
        }

        state.categories =[{ID: "0", Name: "所有分類商品", Show: "1"}, ...res.data.data];
      } catch (error) {
        throw new Error(error)
      }
    },
    async getProducts() {
      let params = `Preview=${site.value.Preview}`;

      try {
        let res = await getProductsApi(params)
        if(res.data.errormessage) {
          await login();
          methods.getProducts();
          return
        }

        state.products = res.data.data;
      } catch (error) {
        throw new Error(error)
      }
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})