<template>
  <a-sub-menu :key="menuInfo.id">
    <template v-if="hasIcon(menuInfo.icon)" #icon>
      <component :is="Icon(menuInfo.icon)"></component>
    </template>
    <template #title>
      {{ menuInfo.name }}
    </template>
    <template v-for="item in menuInfo.children" :key="'template||' + item.id">
      <template v-if="!item.children">
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
      <template v-else>
        <sub-menu :menu-info="item" :key="item.id" />
      </template>
    </template>
  </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { hasIcon, Icon } from '../../utils/menuIcon';

export default defineComponent({
  name: 'SubMenu',
  props: {
    menuInfo: {
      type: Object,
      default: (): Record<string, any> => ({}),
    },
  },
  setup() {
    return {
      hasIcon,
      Icon,
    };
  },
});
</script>
