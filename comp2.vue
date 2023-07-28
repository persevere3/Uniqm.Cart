<div class="navbar">
  <ul>
    <li @click="urlPush('/')" >
      首頁
    </li>
    <li v-for="(item, key) in all.Navbar" :key="key" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)" >
      {{ item.Name }}
      <template v-if="item.subNavbar">
        <i class="fa fa-angle-down" aria-hidden="true"></i>
        <div class="transparent">  </div>
        <ul>
          <li v-for="(item2, key2) in item.subNavbar" :key="key2" @click.stop="urlPush(item2.Link)">
            <div> {{item2.Name}} </div>
          </li>
        </ul>
      </template>
    </li>
  </ul>
</div>