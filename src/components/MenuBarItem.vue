<template>
  <div
    ref="menuBarItemRef"
    :class="[...menuBarStyle, 'menu-bar-item-container']"
    :style="{ background: bgColor }"
    @mouseenter="setMenuViewable()"
    @click="toggleMenu()"
  >
    <span
      :class="[...menuBarStyle, 'name-container']"
      :style="{color: theme.textColor}"
    >
      {{ getName }}
    </span>
    <span
      class="menu-container"
      :style="menuStyle"
    >
      <transition name="fade">
        <Menu
          v-if="menuActive && showMenu"
          :items="menu"
          :dock="dock"
          :parent="name"
          :theme="theme"
          @selected="handleMenuSelection"
        />
      </transition>
    </span>
  </div>
</template>

<script lang="ts">
import DockPosition from "../models/MenuBarDockPosition";
import { MenuItemModel } from "@/models/MenuItemModel";
import {
  defineComponent,
  PropType,
  ref,
  computed,
  watch,
  onMounted,
  nextTick,
} from "vue";
import Menu from "./Menu.vue";

export default defineComponent({
  name: "MenuBarItem",
  components: {
    Menu,
  },
  props: {
    name: {
      type: String,
      default: "",
      required: true,
    },
    menu: {
      type: Array as PropType<MenuItemModel[]>,
      required: true,
    },
    menuActive: {
      type: Boolean,
      default: false,
      required: true,
    },
    menuBarActive: {
      type: Boolean,
      default: false,
      required: true,
    },
    showMenu: {
      type: Boolean,
      default: false,
      required: true,
    },
    menuBarDimensions: {
      type: Object as PropType<{ height: number; width: number }>,
      default: {},
      required: true,
    },
    dock: {
      required: true,
      default: DockPosition.TOP,
      type: String,
    },
    id: {
      required: true,
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
        textColor: "#fff"
      },
    },
  },
  emits: ["show", "activate", "deactivate", "selected"],
  setup(props, { emit }) {
    const menuBarItemRef = ref<HTMLElement>();
    const menuBarItemActive = ref();
    const menuStyle = ref();

    const getName = computed(() => {
      if (
        props.dock === DockPosition.LEFT ||
        props.dock === DockPosition.RIGHT
      ) {
        return !props.menuBarActive ? props.name[0] : props.name;
      } else {
        return props.name;
      }
    });

    const setMenuViewable = () => {
      emit("activate", props.id);
    };

    const toggleMenu = () => {
      emit("show", !props.menuActive);
    };

    const handleMenuSelection = ($event: any) => {
      emit("selected", $event);
    };

    const computeMenuStyle = () => {
      let newStyle: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
      } = {};

      if (props.dock === DockPosition.LEFT) {
        newStyle.top = "0px";
        newStyle.left = `${menuBarItemRef.value?.clientWidth}px`;
      } else if (props.dock === DockPosition.RIGHT) {
        newStyle.top = "0px";
        newStyle.right = `${menuBarItemRef.value?.clientWidth}px`;
      } else if (props.dock === DockPosition.TOP) {
        newStyle.top = `${menuBarItemRef.value?.clientHeight}px`;
        newStyle.left = "0px";
      } else if (props.dock === DockPosition.BOTTOM) {
        newStyle.bottom = `${menuBarItemRef.value?.clientHeight}px`;
        newStyle.left = "0px";
      }

      menuStyle.value = newStyle;
    };

    const menuBarStyle = computed(() => {
      return [
        props.dock.toLowerCase(),
        menuBarItemActive.value ? "active" : "",
        props.menuBarActive ? "expanded" : "",
      ];
    });

    watch(
      () => props.showMenu,
      (newValue) => {
        menuBarItemActive.value = newValue;
      }
    );

    watch(
      () => [props.dock, props.menuBarActive],
      () => {
        nextTick(() => {
          setTimeout(() => {
            computeMenuStyle();
          }, 150);
        });
      }
    );

    onMounted(() => computeMenuStyle());

    const bgColor = computed(() => {
      if (menuBarItemActive.value) {
        return props.theme.secondary;
      }
    });

    return {
      getName,
      menuBarItemRef,
      menuBarStyle,
      menuStyle,
      setMenuViewable,
      toggleMenu,
      handleMenuSelection,
      computeMenuStyle,
      bgColor,
    };
  },
});
</script>


<style lang="scss" scoped>
.menu-bar-item-container {
  align-items: center;
  color: #ccc;
  display: flex;
  justify-content: center;
  position: relative;

  &.left,
  &.right {
    padding: 0.5rem 0;
    width: 100%;
  }

  &.top,
  &.bottom {
    height: 100%;
    padding: 0 0.75rem;
  }

  &:hover {
    cursor: pointer;
  }

  &.active {
    /* background: #32323e; */
  }
}

.menu-container {
  position: absolute;
  z-index: 9999;
}

.name-container {
  text-transform: capitalize;
  font-size: 0.95rem;
  margin: 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.left,
  &.right {
    align-items: center;
    display: flex;
    font-size: 1rem;
    background: none;
    width: 100%;
    justify-content: flex-start;
    height: 1.5rem;

    &.expanded {
      padding-left: 1rem;
    }

    &:not(.expanded) {
      width: 2rem;
      font-size: 1.1rem;
      justify-content: center;
      text-transform: uppercase;
    }
  }
}
</style>