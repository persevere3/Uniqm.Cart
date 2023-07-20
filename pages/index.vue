<style lang="scss">
  @import "../assets/scss/index.scss";
</style>

<template>
  <div class="main">
    <div class="img_container pc" v-if="homePage.TopImg" :style="{backgroundImage: `url(${homePage.TopImg})`}"></div>
    <div class="img_container mobile" v-if="homePage.PhoneImg" :style="{backgroundImage: `url(${homePage.PhoneImg})`}"></div>

    <!-- <div class="banner" v-if="homePage.Ads && homePage.Ads.length">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in homePage.Ads" 
                :key="item.ID" :style="{backgroundImage: `url(${item.URL})`}"
          >
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div> -->

    <div class="category_container" v-if="homePage.Ex && all.websubcategory">
      <ul>
        <li v-for="(item, index) in filter_ex" :key="index" :style="{backgroundImage: `url(${item.Img})`}" @click="item.direct_link ? ( item.type == 0 ? urlPush(item.direct_link, true) : urlPush(item.direct_link)) : '' "></li>
      </ul>
    </div>

    <div class="sub_category_container" v-if="homePage.Category && all.websubcategory">
      <ul>
        <li v-for="(item, index) in filter_category" :key="index" :style="{backgroundImage: `url(${item.Img})`}" @click="item.direct_link ? urlPush(item.direct_link) : '' "></li>
      </ul>
    </div>

    <div class="products">
      <div class="title">
        {{ store.Name }}
      </div>
      <div class="product_list">
        <ul>
          <li v-for="(item, index) in all.data" :key="index"
              @click="pushTo_cart(item.ID)"
              v-show="page_active * perpage_num - (perpage_num + 1)  < index && index < page_active * perpage_num"
          >
            <div class="pic" :style="{backgroundImage: `url(${item.Img1})`}">
              <div class="addTo_favorite_btn" @click.stop="toggleFavorite(item.ID)">
                加入我的最愛 <i class="fas fa-heart" :class="{is_favorite : favorite[item.ID]}"></i>
              </div>
              <div class="addTo_cart_btn">
                加入購物車
              </div>
            </div>
            <div class="info">
              <div class="name"> {{item.Name}} </div>
              <div class="discount_price"> NT$ {{ numberThousands(item.NowPrice) }} </div>
              <div class="origin_price" v-if="parseInt(item.Price) > -1"> NT$ {{ numberThousands(item.Price) }} </div>
            </div>
            <div class="l_addTo_favorite_btn" @click.stop="toggleFavorite(item.ID)">
              <i class="fas fa-heart" :class="{is_favorite : favorite[item.ID]}"></i>
            </div>
            <div class="l_addTo_cart_btn">
              <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            </div>
          </li>
        </ul>
      </div>
      <div class="product_page">
        <ul>
          <li @click="pagePush(page_active - 1)" :class="{opacity0: page_active < 2}"> <i class="fa fa-angle-double-left" aria-hidden="true"></i> </li>
          <li v-for="item in totalpage_num" :class="{li_active: page_active === item}" 
              @click="pagePush(item)">
            {{item}}
          </li>
          <li @click="pagePush(page_active + 1)" :class="{opacity0: page_active > totalpage_num - 1}"> <i class="fa fa-angle-double-right" aria-hidden="true"></i> </li>
        </ul>
      </div>
    </div>

    <div class="community_category_container" v-if="homePage.Community">
      <ul>
        <li @click="urlPush(homePage.Community.FB.Link, 1)" v-if="homePage.Community.FB.Img">
          <div class="pic" :style="{backgroundImage: `url(${homePage.Community.FB.Img})`}"></div>
        </li>
        <li @click="urlPush(homePage.Community.Line.Link, 1)" v-if="homePage.Community.Line.Img">
          <div class="pic" :style="{backgroundImage: `url(${homePage.Community.Line.Img})`}"></div>
        </li>
        <li @click="urlPush(homePage.Community.IG.Link, 1)" v-if="homePage.Community.IG.Img">
          <div class="pic" :style="{backgroundImage: `url(${homePage.Community.IG.Img})`}"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
  import { storeToRefs } from 'pinia'
  import { getHomePageApi } from '@/api/index.js'

  // store
  import { useCommon }  from '@/stores/common/common'

  let { site, is_getSite, all, store, user_account, favorite, perpage_num, totalpage_num, page_active, 
    webVersion } = storeToRefs(useCommon())
  let { toggleFavorite, pagePush, pushTo_cart, urlPush, numberThousands } = useCommon()

  const state = reactive({
    homePage: {},
    
    swiper: '',
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
              Ex[i].direct_link = `/rich?id=${websubcategory[j].CategoryID}&cid=1`;
            }
            else if(websubcategory[j].Class == 2) {
              Ex[i].direct_link = `/rich?id=${Ex[i].Link}&cid=0`;
            }
            else if(websubcategory[j].Class == 1) {
              Ex[i].direct_link = `/category?id=${Ex[i].Link}`;
            }
            else if(websubcategory[j].Class == 0){
              Ex[i].direct_link = `/allProducts?id=${Ex[i].Link}`;
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
            Category[i].direct_link = `/rich?id=${websubcategory[j].CategoryID}&cid=1`;
          }
          else if(websubcategory[j].Class == 2) {
            Category[i].direct_link = `/rich?id=${Category[i].Link}&cid=0`;
          }
          else if(websubcategory[j].Class == 1) {
            Category[i].direct_link = `/category?id=${Category[i].Link}`;
          }
          else if(websubcategory[j].Class == 0) {
            Category[i].direct_link = `/allProducts?id=${Category[i].Link}`;
          }

          arr.push(Category[i]);
          break;
        }
      }
    }
    return arr;
  })

  // watch ==================================================
  watch(is_getSite, async() => {
    await getHomePage()
    // Swiper ???
  },)

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

      if(webVersion.value === 'demo') {
        dataSort.TopImg = 'https://demo.uniqcarttest.com' + dataSort.TopImg
        dataSort.PhoneImg = 'https://demo.uniqcarttest.com' + dataSort.PhoneImg

        dataSort.Ads.forEach(item => {
          item.URL = 'https://demo.uniqcarttest.com' + item.URL
        })

        dataSort.Ex.forEach(item => {
          item.Img = 'https://demo.uniqcarttest.com' + item.Img
        })

        dataSort.Category.forEach(item => {
          item.Img = 'https://demo.uniqcarttest.com' + item.Img
        })
        if(dataSort.Community.FB.Img) {
          dataSort.Community.FB.Img = 'https://demo.uniqcarttest.com' + dataSort.Community.FB.Img
        }
        if(dataSort.Community.Line.Img) {
          dataSort.Community.Line.Img = 'https://demo.uniqcarttest.com' + dataSort.Community.Line.Img
        }
        if(dataSort.Community.IG.Img) {
          dataSort.Community.IG.Img = 'https://demo.uniqcarttest.com' + dataSort.Community.IG.Img
        }
      }

      console.log(dataSort)

      state.homePage = dataSort;
    } catch (error) {
      throw new Error(error)
    }
  }

</script>