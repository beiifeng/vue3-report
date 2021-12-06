<template>
  <div>
    <a-layout>
      <a-layout-sider
        v-model:collapsed="collapsed"
        :trigger="null"
        collapsible
        :style="{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }"
        :width="siderWidth"
        :collapsedWidth="collapsedWidth"
      >
        <cc-sider></cc-sider>
      </a-layout-sider>
      <a-layout :style="{ marginLeft: contentMarginLeft + 'px' }">
        <a-layout-header style="background: #fff; padding: 0">
          <menu-unfold-outlined
            v-if="collapsed"
            class="trigger"
            @click="handleMenuFoldClick"
          />
          <menu-fold-outlined
            v-else
            class="trigger"
            @click="handleMenuFoldClick"
          />
          <span>Header</span>
        </a-layout-header>
        <a-layout-content>
          <div id="pageContainer">
            <router-view></router-view>
          </div>
        </a-layout-content>
        <a-layout-footer>Footer</a-layout-footer>
      </a-layout>
    </a-layout>
  </div>
</template>
<script>
import { CcSider } from '@/components/layouts';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { DEFAULT_LOGIN_URL } from '@/config/globalConfig';
// import { start } from 'qiankun';
import { getToken } from '@/utils/auth';
import useAuthority from '@/utils/useAuthority';
import {
  defineComponent,
  nextTick,
  onMounted,
  onUpdated,
  reactive,
  toRefs,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { menuData } from './data';

export default defineComponent({
  name: 'BasicLayout',
  components: {
    CcSider,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authority = useAuthority();

    const defaultSiderWidth = 200;

    const state = reactive({
      collapsed: false,
      // 侧边栏宽度
      siderWidth: defaultSiderWidth,
      collapsedWidth: 80,
      contentMarginLeft: defaultSiderWidth,
    });

    const toLoginPage = () => {
      return router.push({
        path: DEFAULT_LOGIN_URL,
        query: {
          redirect: route.fullPath,
        },
      });
    };

    const handleMenuFoldClick = () => {
      state.collapsed = !state.collapsed;
      if (state.collapsed) {
        state.contentMarginLeft = state.collapsedWidth;
      } else {
        state.contentMarginLeft = state.siderWidth;
      }
    };

    // TODO 在登录后及此处同时设置获取菜单信息方法，并且需要防重发
    nextTick(async () => {
      // 没有token，跳转到登录页
      if ((getToken() ?? '') === '') {
        return toLoginPage();
      }
      try {
        const userInfo = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              code: 1,
              data: menuData,
            });
          }, 300);
        });
        authority.setAuthorityV1(userInfo.data);
      } catch {
        // 获取信息失败，跳转到登录页
        return toLoginPage();
      }
    });

    onMounted(() => {
      console.log('BasicLayout:onMounted');
      // if (!window.qiankunStarted) {
      //   window.qiankunStarted = true;
      //   start({
      //     // see https://qiankun.umijs.org/zh/api#startopts
      //     prefetch: false,
      //   });
      // }
    });

    onUpdated(() => {
      // if (route.fullPath.startsWith('/sys2/')) {
      //   if (!window.qiankunStarted) {
      //     window.qiankunStarted = true;
      //     start({
      //       // see https://qiankun.umijs.org/zh/api#startopts
      //       prefetch: false,
      //     });
      //   }
      // }
    });

    return {
      ...toRefs(state),
      handleMenuFoldClick,
    };
  },
});
</script>

<style lang="less" scoped>
@import '../globalVar.less';
.trigger {
  font-size: 18px;
  line-height: 48px;
  padding: 3px 14px 0;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: @primary-color;
}
</style>
