import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from '@/stores/common/common'

import { getCategoriesApi } from '@/api/index';


export const useShopping = defineStore('shopping', () => {
  // store ==================================================
  let { site } = storeToRefs(useCommon())

  // state ==================================================
  const state = reactive({
    categories: {},
    products: {},
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