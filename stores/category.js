import { defineStore } from 'pinia'
import { getCategoryApi } from '@/api/index';

export const useCategory = defineStore('category', () => {
  // state ==================================================
  const state = reactive({
    category_product: {}
  })

  // methods ==================================================
  const methods = {
    async getCategory(id) {
      let formData = new FormData();
      formData.append("id", id);
      formData.append("WebPreview", site.value.WebPreview);

      try {
        let res = await getCategoryApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.getCategoryApi(formData);
          return
        }

        state.category_product = res.data;
          
        state.category_product.Sort = {};
        let sort = state.category_product.Sort;
        let data = state.category_product.Data[0];
        let category = state.category_product.Category;
        let product = state.category_product.Product;
        
        // category => sort[i]
        for(let i = 0; i < category.length; i++) {
          sort[category[i].ID] = {};
          sort[category[i].ID].Products = {};
          sort[category[i].ID].Name = category[i].Name;
        }

        // product => sort[i].Products[j]
        for(let i = 0; i < product.length; i++) {
          // Category1~5
          for(let j = 1; j < 6; j++) {
            let category_item = product[i][`Category${j}`];
            if(category_item) {
              if(sort[category_item]) {
                sort[category_item].Products[product[i].ID] = product[i];
              }
            }
          }
        }

        data.Img = [];
        for(let i = 1; i < 6; i++) {
          if(data[`Img${i}`]){
            data.Img.push(data[`Img${i}`]);
          }
        }
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