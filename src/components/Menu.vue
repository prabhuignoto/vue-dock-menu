<template>
  <div
    class="menu-wrapper"
    :class="dockClass"
  >
    <ul class="menu-items">
      <li
        v-for="item of items"
        :key="item.id"
        class="menu-item"
        :class="dockClass"
        @mouseenter="item.menu && toggleSubMenu(!!item.menu)"
        @mouseleave="item.menu && toggleSubMenu(!!item.menu)"
        @click="handleSelection(item.name)"
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
          class="sub-menu-wrapper"
          :class="dockClass"
        >
          <component
            :is="MenuComponent"
            :items="item.menu"
            :dock="dock"
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

export default defineComponent({
  name: "Menu",
  components: {
    ChevRight,
  },
  props: {
    items: {
      type: Array as PropType<MenuItemModel[]>,
      default: [],
      required: true,
    },
    dock: {
      required: false,
      default: MenuBarDockPosition.TOP,
      type: String,
    },
  },
  emits: ["selected"],
  setup(props, {emit}) {
    const MenuComponent = resolveComponent("Menu");

    const showSubMenu = ref(false);

    const dockClass = computed(() => props.dock.toLowerCase());

    const toggleSubMenu = (hasData: boolean) => {
      if (hasData) {
        showSubMenu.value = !showSubMenu.value;
      }
    };

    const handleSelection = (name: string) => {
      emit("selected", name)
    };

    return {
      MenuComponent,
      toggleSubMenu,
      showSubMenu,
      dockClass,
      handleSelection
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-width: 250px;
  background: #32323e;
  padding: 0.75rem 0;

  &.top {
    filter: drop-shadow(2px 14px 8px rgba(0, 0, 0, 0.25));
  }

  &.bottom {
    filter: drop-shadow(2px -14px 8px rgba(0, 0, 0, 0.25));
  }
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
  fill: red;
  height: 1rem;
  justify-content: center;
  margin-left: auto;
  width: 1.25rem;
}

.menu-item {
  align-items: center;
  color: #ccc;
  display: flex;
  font-size: 0.8rem;
  justify-content: flex-start;
  padding: 0.65rem 0;
  position: relative;
  text-transform: capitalize;
  width: 100%;
  cursor: pointer;

  &:hover {
    background: #4c4c57;
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