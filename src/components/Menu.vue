<template>
  <div
    :class="[dockClass, 'menu-wrapper']"
    :style="{ background: theme.secondary }"
  >
    <ul class="menu-items">
      <li
        v-for="item of items"
        :key="item.id"
        :class="[dockClass, 'menu-item', { 'is-parent': !!item.menu }]"
        :style="menuItemStyle"
        @mouseenter="item.menu && !isMobile && toggleSubMenu(!!item.menu)"
        @mouseleave="item.menu && !isMobile && toggleSubMenu(!!item.menu)"
        @click="
          handleSelection({
            event: $event,
            name: item.name,
            isParent: !!item.menu,
          })
        "
      >
        <span class="name">{{ item.name }}</span>
        <span
          :class="{ visible: !!item.menu }"
          class="icon-wrap"
        >
          <ChevRight />
        </span>
        <div
          v-if="item.menu && showSubMenu"
          :class="[dockClass, 'sub-menu-wrapper']"
        >
          <component
            :is="MenuComponent"
            :items="item.menu"
            :dock="dock"
            :parent="item.name"
            :theme="theme"
            :is-touch="isMobile"
            @selected="handleSelection"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import MenuBarDockPosition from "../models/MenuBarDockPosition";
import { MenuItemModel } from "../models/MenuItemModel";
import {
  defineComponent,
  PropType,
  resolveComponent,
  ref,
  computed,
} from "vue";
import ChevRight from "./ChevRight.vue";
import { SelectedItemModel } from "@/models/SelectedItemModel";

export default defineComponent({
  name: "Menu",
  components: {
    ChevRight,
  },
  props: {
    items: {
      type: Array as PropType<MenuItemModel[]>,
      default: [] as MenuItemModel[],
      required: true,
    },
    dock: {
      required: false,
      default: MenuBarDockPosition.TOP,
      type: String,
    },
    parent: {
      required: false,
      default: "",
      type: String,
    },
    theme: {
      required: false,
      type: Object as PropType<{
        primary: string;
        secondary: string;
        tertiary: string;
        textColor: string;
      }>,
      default: {
        primary: "#21252b",
        secondary: "#32323e",
        tertiary: "#4c4c57",
        textColor: "#fff",
      },
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const MenuComponent = resolveComponent("Menu");

    const showSubMenu = ref(false);

    const dockClass = computed(() => props.dock.toLowerCase());

    const toggleSubMenu = (hasData: boolean) => {
      if (hasData) {
        showSubMenu.value = !showSubMenu.value;
      }
    };

    const handleSelection = (selectedItem: SelectedItemModel) => {
      selectedItem.event.stopPropagation();
      selectedItem.event.preventDefault();

      if (selectedItem.isParent) {
        showSubMenu.value = !showSubMenu.value;
        return;
      }

      const { path, name } = selectedItem;

      emit(
        "selected",
        Object.assign({}, selectedItem, {
          path: `${props.parent}>${path ? path : name}`.toLowerCase(),
        })
      );
    };

    const menuItemStyle = computed(() => ({
      "--background-color-hover": props.theme.tertiary,
      "--fore-color": props.theme.textColor,
    }));

    return {
      MenuComponent,
      toggleSubMenu,
      showSubMenu,
      dockClass,
      handleSelection,
      menuItemStyle,
    };
  },
});
</script>

<style lang="scss" scoped src="./menu.scss">
</style>