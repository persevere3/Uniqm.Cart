<template>
  <div class="productContainer" @click.stop="isShowFavorite = false">
    <SelectProduct v-if="selectProduct.ID" :style="`height:${innerHeight}px`" />
    <Cart v-if="showPage === 'cart'" :style="`height:${innerHeight}px`" />
    <!-- 訂購須知 配送須知 隱私權聲明 -->
    <Notice v-if="showPage === 'Content' || showPage === 'Description' || showPage === 'PrivacyPolicy'" :style="`height:${innerHeight}px`"/>
    
    <CartIcon v-if="showPage === 'main' && !selectProduct.ID" />
    <FavoriteIcon v-if="showPage === 'main' && !selectProduct.ID && Object.keys(favorite).length"/>

    <Confirm />
    <Message />
    <Cookie />
  </div>
</template>
