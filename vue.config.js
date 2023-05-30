// common, demo, uniqm.com, uniqm.net
let webVersion = 'common'

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  pages: webVersion === 'common' || webVersion === 'demo'
    ? {
      index : {
        entry: 'src/pages/index/main.js', // page 的入口
        template: 'src/pages/index/index.html', // 模板来源
        filename: 'index.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      allProducts : {
        entry: 'src/pages/allProducts/main.js',
        template: 'src/pages/allProducts/index.html',
        filename: 'allProducts.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'allProducts']
      },
      category : {
        entry: 'src/pages/category/main.js',
        template: 'src/pages/category/index.html',
        filename: 'category.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'category']
      },
      rich : {
        entry: 'src/pages/rich/main.js',
        template: 'src/pages/rich/index.html',
        filename: 'rich.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'rich']
      },
      contact : {
        entry: 'src/pages/contact/main.js',
        template: 'src/pages/contact/index.html',
        filename: 'contact.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'contact']
      },
      search : {
        entry: 'src/pages/search/main.js',
        template: 'src/pages/search/index.html',
        filename: 'search.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'search']
      },
      order : {
        entry: 'src/pages/order/main.js',
        template: 'src/pages/order/index.html',
        filename: 'order.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'order']
      },
      user : {
        entry: 'src/pages/user/main.js',
        template: 'src/pages/user/index.html',
        filename: 'user.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'user']
      },
      user_info : {
        entry: 'src/pages/user_info/main.js',
        template: 'src/pages/user_info/index.html',
        filename: 'user_info.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'user_info']
      },
      error : {
        entry: 'src/pages/error/main.js',
        template: 'src/pages/error/index.html',
        filename: 'error.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'error']
      },
    }
    : {
      shopping : {
        entry: 'src/pages/shopping/main.js',
        template: 'src/pages/shopping/index.html',
        filename: 'shopping.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'shopping']
      },
      shoppingUser : {
        entry: 'src/pages/shoppingUser/main.js',
        template: 'src/pages/shoppingUser/index.html',
        filename: 'shoppingUser.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'shoppingUser']
      },
      shoppingInfo : {
        entry: 'src/pages/shoppingInfo/main.js',
        template: 'src/pages/shoppingInfo/index.html',
        filename: 'shoppingInfo.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'shoppingInfo']
      },
      shoppingOrder : {
        entry: 'src/pages/shoppingOrder/main.js',
        template: 'src/pages/shoppingOrder/index.html',
        filename: 'shoppingOrder.html', 
        chunks: ['chunk-vendors', 'chunk-common', 'shoppingOrder']
      },
    },
}