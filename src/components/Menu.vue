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
        @mouseenter="item.menu && toggleSubMenu(!!item.menu)"
        @mouseleave="item.menu && toggleSubMenu(!!item.menu)"
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

<style lang="scss" scoped>
.menu-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-width: 200px;
  padding: 0.5rem 0;
}

.menu-items {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}

.icon-wrap {
  align-items: center;
  display: flex;
  height: 1rem;
  justify-content: center;
  margin-left: auto;
  width: 1.25rem;
}

.menu-item {
  align-items: center;
  color: var(--fore-color);
  display: flex;
  font-size: 0.9rem;
  justify-content: flex-start;
  padding: 0.4rem 0;
  position: relative;
  text-transform: capitalize;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: var(--background-color-hover);
    cursor: pointer;
  }

  span.name {
    flex-basis: 85%;
    text-align: left;
    padding-left: 5%;
  }

  span.icon-wrap {
    width: 10%;
    visibility: hidden;

    &.visible {
      visibility: visible;
    }
  }

  &.right {
    .name {
      order: 2;
      text-align: right;
      padding-right: 5%;
    }

    .icon-wrap {
      order: 1;
      margin-right: auto;
      transform: rotate(180deg);
    }
  }
}

.sub-menu-wrapper {
  position: absolute;
  top: 0;

  &:not(.right) {
    left: 100%;
  }

  &.right {
    right: 100%;
  }

  &.bottom {
    transform: translateY(-65%);
  }
}
</style>