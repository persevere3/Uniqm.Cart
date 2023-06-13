<style lang="scss">
  @import "../assets/scss/index.scss";
</style>

<template>
  <div class="main">
    {{ testData }}

    <!-- v-if="homePage.Ads && homePage.Ads.length" -->
    <div class="banner" v-if="false">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <!-- <div class="swiper-slide" v-for="item in homePage.Ads" :key="item.ID" 
            :style="{backgroundImage: `url(${item.URL})`}"
          >
          </div> -->

          <div class="swiper-slide"> 1 </div>
          <div class="swiper-slide"> 2 </div>
          <div class="swiper-slide"> 3 </div>

        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>

  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getHomePageApi } from '@/api/index.js'

  // store
  import { useCommon }  from '@/stores/common/common'
  import { useHandlerCommon }  from '@/stores/handlerCommon'

  let { site, all, user_account, testData } = storeToRefs(useCommon())
  let { login } = useCommon()
  let {  } = storeToRefs(useHandlerCommon())
  let { getSiteHandler } = useHandlerCommon()

  onMounted(async() => {
    site.value = JSON.parse(localStorage.getItem('site')) || {} ;
    user_account.value = localStorage.getItem('user_account')

    await login()
    getSiteHandler()

    await getHomePage()

    // Swiper ???
  })
  
  const state = reactive({
    homePage: {},
    
    swiper: '',
    totalpage_num: 0,
  })
  let { homePage } = toRefs(state)

  // computed ==================================================
  // homePage 
  // Ex[i].Link 有可能是 websubcategory[j].ID 或 OutUrl
  // direct_link
  let filter_ex = computed(() => {
    let arr = [];
    let Ex = state.homePage.Ex;
    for(let i = 0; i < Ex.length; i++) {
      if(Ex[i].type == 0) {
        Ex[i].direct_link = Ex[i].Link;
        arr.push(Ex[i]);
      }
      else {
        let websubcategory = all.value.websubcategory;
        for(let j = 0; j < websubcategory.length; j++) {
          if(Ex[i].Link == websubcategory[j].ID) {
            if(websubcategory[j].Class == 3) {
              Ex[i].direct_link = `/rich.html?id=${websubcategory[j].CategoryID}&cid=1`;
            }
            else if(websubcategory[j].Class == 2) {
              Ex[i].direct_link = `/rich.html?id=${Ex[i].Link}&cid=0`;
            }
            else if(websubcategory[j].Class == 1) {
              Ex[i].direct_link = `/category.html?id=${Ex[i].Link}`;
            }
            else if(websubcategory[j].Class == 0){
              Ex[i].direct_link = `/allProducts.html?id=${Ex[i].Link}`;
            }

            arr.push(Ex[i]);
            break;
          }
        }
      }
    }
    return arr;
  })
  let filter_category = computed(() => {
    let arr = [];
    let Category = state.homePage.Category;
    let websubcategory = all.value.websubcategory;
    for(let i = 0; i < Category.length; i++) {
      if(Category[i].Link == 0) {
        arr.push(Category[i]);
        continue;
      }
      for(let j = 0; j < websubcategory.length; j++) {
        if(Category[i].Link == websubcategory[j].ID) {
          if(websubcategory[j].Class == 3) {
            Category[i].direct_link = `/rich.html?id=${websubcategory[j].CategoryID}&cid=1`;
          }
          else if(websubcategory[j].Class == 2) {
            Category[i].direct_link = `/rich.html?id=${Category[i].Link}&cid=0`;
          }
          else if(websubcategory[j].Class == 1) {
            Category[i].direct_link = `/category.html?id=${Category[i].Link}`;
          }
          else if(websubcategory[j].Class == 0) {
            Category[i].direct_link = `/allProducts.html?id=${Category[i].Link}`;
          }

          arr.push(Category[i]);
          break;
        }
      }
    }
    return arr;
  })

  // watch ==================================================

  // methods ==================================================
  async function getHomePage() {
    let params = `WebPreview=${site.value.WebPreview}`;

    try {
      let res = await getHomePageApi(params)
      if(res.data.errormessage) {
        await login();
        getHomePage();
        return
      }

      let data = res.data.data[0];
      if(!data) return

      // Ex[i].Link: data.Type1 > 0 ? data.Type1 : data.OutUrl1
      let dataSort = {
        Ads: res.data.Advertise.filter(ad => ad.URL),
        TopImg: data.TopImg,
        PhoneImg: data.PhoneImg,
        Ex: [
          { Img: data.ExImg1, Link: data.Type1 > 0 ? data.Type1 : data.OutUrl1, type: data.Type1},
          { Img: data.ExImg2, Link: data.Type2 > 0 ? data.Type2 : data.OutUrl2, type: data.Type2},
        ],
        Category: [
          { Img: data.Img1, Link: data.Link1 },
          { Img: data.Img2, Link: data.Link2 },
          { Img: data.Img3, Link: data.Link3 },
          { Img: data.Img4, Link: data.Link4 },
          { Img: data.Img5, Link: data.Link5 },
          { Img: data.Img6, Link: data.Link6 },
        ],
        Community: {
          FB: { Img: data.FBImg, Link: data.FBLink },
          Line: { Img: data.LineImg, Link: data.LineLink },
          IG: { Img: data.IGImg, Link: data.IGLink },
        }
      }
      dataSort.Ex = dataSort.Ex.filter(item => item.Img)
      dataSort.Category = dataSort.Category.filter(item => item.Img)

      dataSort.Ads.forEach(item => {
        item.URL = 'https://demo.uniqcarttest.com/' + item.URL
      })

      state.homePage = dataSort;
    } catch (error) {
      throw new Error(error)
    }
  }

</script>