<div class="navbar">
  <ul>
    <li @click="urlPush('/')">
      <div class="text">
        首頁
      </div>
    </li>

    <li v-for="(item) in all.Navbar" :key="item.ID" @click="item.Class == 2 ? urlPush(item.Link, true) : urlPush(item.Link)">
      <div class="text">
        {{ item.Name }}
        <div class="angle" @click.stop="item.isDropDown = !item.isDropDown">
          <i  class="fa fa-angle-down" :class="{i_active: item.isDropDown}" 
            aria-hidden="true"
            v-if="item.subNavbar"
          >
          </i>
        </div>
      </div>
      <template v-if="item.subNavbar">
        <ul :class="{ul_active: item.isDropDown}">
          <li v-for="item2 in item.subNavbar" :key="item2.ID" @click.stop="urlPush(item2.Link)">
            {{item2.Name}}
          </li>
        </ul>
      </template>
    </li>
  </ul>
</div>