<template>
  <a-config-provider
    :locale="locale"
    :autoInsertSpaceInButton="false"
    :prefixCls="ANT_PREFIX"
    componentSize="small"
  >
    <router-view />
  </a-config-provider>
</template>

<script>
import { ANT_PREFIX } from '@/config/globalConfig';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {
      locale: zhCN,
      ANT_PREFIX,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
