// stores ========== ========== ========== ========== ==========
import { defineStore, storeToRefs } from 'pinia'
import { useWebCommon }  from './common'

// apis ========== ========== ========== ========== ==========
import { getCategoriesApi, getProductsApi } from '@/apis/products';

export const useShopping = defineStore('shopping', () => {
  // stores ========== ========== ========== ========== ==========
  let { site, demoOrigin, webVersion } = storeToRefs(useWebCommon())
  let { multiPriceHandler } = useWebCommon()

  // state ========== ========== ========== ========== ==========
  const state = reactive({
    categories: [],
    products: [],

    active_category_id: 0,
    
    search_text: '',
  })

  // methods ========== ========== ========== ========== ==========
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

        let products = res.data.data;
        multiPriceHandler(products)
        if(webVersion.value === 'demo') {
          products.forEach(product => {
            product.Img1 = demoOrigin.value + product.Img1
          })
        }
        state.products = products;
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