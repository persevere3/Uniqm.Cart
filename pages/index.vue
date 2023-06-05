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

  let { site, user_account, testData } = storeToRefs(useCommon())
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
  })
  let { homePage } = toRefs(state)

  // computed ==================================================

  // watch ==================================================

  // methods ==================================================
  async function getHomePage() {
    let params = `WebPreview=${site.value.WebPreview}`;

    try {
      let res = await getHomePageApi(params)
      if(res.data.errormessage) {
        await methods.login();
        methods.getHomePageApi(params);
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