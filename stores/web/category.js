
// stores ========== ========== ========== ========== ==========
import { defineStore, storeToRefs } from 'pinia'
import { useCommon }  from './common/common'

// apis ========== ========== ========== ========== ==========
import { getCategoryApi } from '@/apis/pages';

export const useCategory = defineStore('category', () => {
  // stores ========== ========== ========== ========== ==========
  let { site, demoOrigin, webVersion } = storeToRefs(useCommon())
  let { login, multiPriceHandler } = useCommon()

  // state ========== ========== ========== ========== ==========
  const state = reactive({
    category_product: {}
  })

  // methods ========== ========== ========== ========== ==========
  const methods = {
    async getCategory(id) {
      let formData = new FormData();
      formData.append("id", id);
      formData.append("WebPreview", site.value.WebPreview);

      try {
        let res = await getCategoryApi(formData)
        if(res.data.errormessage) {
          await login();
          methods.getCategory(id)
          return
        }

        state.category_product = res.data;
          
        state.category_product.Sort = {};
        let sort = state.category_product.Sort;
        let data = state.category_product.Data[0];
        let category = state.category_product.Category;
        let product = state.category_product.Product;

        multiPriceHandler(product)
        
        // category => sort[i]
        for(let i = 0; i < category.length; i++) {
          sort[category[i].ID] = {};
          sort[category[i].ID].Products = {};
          sort[category[i].ID].Name = category[i].Name;
        }

        // product => sort[i].Products[j]
        for(let i = 0; i < product.length; i++) {
          if(webVersion.value === 'demo') {
            product[i].Img1 = demoOrigin.value + product[i].Img1
          }
          
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
          if(data[`Img${i}`]) {
            if(webVersion.value === 'demo') {
              data[`Img${i}`] = demoOrigin.value + data[`Img${i}`]
            }
            data.Img.push(data[`Img${i}`]);
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    // allProducts, category ==============================
    videoHandler(url) {
      let code = '';
      if(url.indexOf('youtu.be') != -1){
        code = url.split('https://youtu.be/')[1];
      }
      else if(url.indexOf('www.youtube.com') != -1){
        if(url.split('?v=').length > 1){
          code = url.split('?v=')[1].split('&')[0];
        }
      }
      let iframe = '';
      if(code){
        iframe = `
          <iframe src="https://www.youtube.com/embed/${code}" 
            frameborder="0" 
            allow="accelerometer; 
              autoplay; clipboard-write; 
              encrypted-media; 
              gyroscope; 
              picture-in-picture" 
            allowfullscreen
          >
          </iframe>
        `
      }
      return iframe;
    },
  }

  return {
    ...toRefs(state),

    ...methods
  }
})