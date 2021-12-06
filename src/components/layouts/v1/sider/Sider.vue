<template>
  <div>
    <div key="logo" class="menu-logo">
      <router-link :to="DEFAULT_HOME_PAGE">
        <img :src="logo" alt="logo" />
        <h1 style="font-size: 'large'">{{ SIDER_TITLE }}</h1>
      </router-link>
    </div>
    <a-menu
      class="menu-content"
      mode="inline"
      theme="dark"
      v-model:selectedKeys="selectedKeys"
      @click="handleMenuClick"
      :open-keys="openKeys"
      @openChange="onOpenChange"
    >
      <template v-for="item in menuData" :key="item.id">
        <template v-if="!item.children && item.isShow === '1'">
          <a-menu-item
            :key="item.id"
            :id="item.id"
            :path="item.path"
            :name="item.name"
            :target="item.target"
          >
            <template v-if="hasIcon(item.icon)" #icon>
              <component :is="Icon(item.icon)"></component>
            </template>
            {{ item.name }}
          </a-menu-item>
        </template>
        <template v-else-if="item.isShow === '1'">
          <sub-menu :key="item.id" :menu-info="item" />
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script>
import logo from '@/assets/logo.png';
import { DEFAULT_HOME_PAGE, SIDER_TITLE } from '@/config/globalConfig';
import useAuthority from '@/utils/useAuthority';
import {
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  toRefs,
  watch,
} from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { hasIcon, Icon } from '../../utils/menuIcon';
import { buildTreeData, buildMapKeyByPath } from '../../utils/menuUtil';
import SubMenu from './SubMenu.vue';

export default defineComponent({
  components: {
    'sub-menu': SubMenu,
  },
  setup() {
    const authority = useAuthority();
    const router = useRouter();
    const route = useRoute();

    let menuMap = new Map();
    let openKeysProcessing = false;

    const state = reactive({
      menuData: [],
      openKeys: [],
      selectedKeys: [],
    });

    const handleMenuClick = ({ item }) => {
      router.push(item.path);
    };

    const onOpenChange = (openKeys) => {
      const lastOpenKey = openKeys[openKeys.length - 1];
      const willOpenKeys = (menuMap.get(lastOpenKey)?.parentIds || []).concat(
        lastOpenKey,
      );
      if (lastOpenKey) {
        state.openKeys = willOpenKeys;
      } else {
        state.openKeys = [];
      }
    };

    const buildMenu = (menu) => {
      const { treeData, relationMap } = buildTreeData(menu);
      state.menuData = treeData;
      menuMap = relationMap;
      // 首次加载，设置默认展开
      if (!openKeysProcessing && state.openKeys && state.openKeys.length < 1) {
        openKeysProcessing = true;
        nextTick(() => {
          const item = menuMap.get(buildMapKeyByPath(route.path));
          state.openKeys = item?.parentIds || [];
          state.selectedKeys = item?.id ? [item.id] : [];
          openKeysProcessing = false;
        });
      }
    };

    onMounted(() => {
      if (
        Array.isArray(authority.getMenuInfoValue()) &&
        authority.getMenuInfoValue().length > 0
      ) {
        buildMenu(authority.getMenuInfoValue());
      }
    });

    watch(authority.getMenuInfoRef(), (newVal) => {
      buildMenu(newVal);
    });

    return {
      ...toRefs(state),
      hasIcon,
      Icon,
      handleMenuClick,
      onOpenChange,
      logo,
      SIDER_TITLE,
      DEFAULT_HOME_PAGE,
    };
  },
});
</script>
<style lang="less" scoped>
@import '../../../../globalVar.less';

.menu-logo {
  height: @layout-header-height;
  line-height: @layout-header-height;
  position: relative;
  padding-left: (@menu-collapsed-width - 32px) / 2;
  transition: all 0.3s;
  background: transparent;
  overflow: hidden;
  img {
    display: inline-block;
    vertical-align: middle;
    height: 26px;
    margin-top: -2px;
  }
  h1 {
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    font-size: 15px;
    margin: 0 0 3px 12px;
    font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
    font-weight: 600;
  }
}
.menu-content {
  height: calc(~'100vh - @{layout-header-height}');

  /* IE10,IE11,IE12  隐藏滚动条 */
  -ms-scroll-chaining: chained;
  -ms-overflow-style: none;
  -ms-content-zooming: zoom;
  -ms-scroll-rails: none;
  -ms-content-zoom-limit-min: 100%;
  -ms-content-zoom-limit-max: 500%;
  -ms-scroll-snap-points-x: snapList(100%, 200%, 300%, 400%, 500%);
  overflow: auto;
  /* 谷歌下隐藏滚动条 */
  &::-webkit-scrollbar {
    width: 0;
  }
}
</style>
