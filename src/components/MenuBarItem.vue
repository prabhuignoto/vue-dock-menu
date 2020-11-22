<template>
  <div
    ref="menuBarItemRef"
    :class="[...menuBarStyle, 'menu-bar-item-container']"
    :style="{ background: bgColor }"
    tabindex="0"
    @mouseenter="setMenuViewable()"
    @click="toggleMenu()"
    @keyup="handleKeyUp"
  >
    <span
      :class="[...menuBarStyle, 'name-container']"
      :style="{ color: theme.textColor }"
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
          :is-touch="isMobileDevice"
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
  unref,
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
        textColor: "#fff",
      },
    },
    isMobileDevice: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["show", "activate", "selected", "activate-next", "activate-previous"],
  setup(props, { emit }) {
    const menuBarItemRef = ref<HTMLDivElement>();
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

    // activate menu
    const setMenuViewable = () => emit("activate", props.id);

    // toggle menu
    const toggleMenu = () => {
      emit("show", !props.menuActive);
    };

    const handleMenuSelection = ($event: any) => emit("selected", $event);

    const computeMenuStyle = () => {
      let newStyle: {
        top?: string;
        left?: string;
        right?: string;
        bottom?: string;
      } = {};

      const {
        clientHeight,
        clientWidth,
      } = menuBarItemRef.value as HTMLDivElement;

      if (props.dock === DockPosition.LEFT) {
        newStyle.top = "0px";
        newStyle.left = `${clientWidth}px`;
      } else if (props.dock === DockPosition.RIGHT) {
        newStyle.top = "0px";
        newStyle.right = `${clientWidth}px`;
      } else if (props.dock === DockPosition.TOP) {
        newStyle.top = `${clientHeight}px`;
        newStyle.left = "0px";
      } else if (props.dock === DockPosition.BOTTOM) {
        newStyle.bottom = `${clientHeight}px`;
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
        if (newValue) {
          nextTick(() => menuBarItemRef.value?.focus());
        }
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

    const keyNavType = computed(() => {
      if (props.dock === "TOP" || props.dock === "BOTTOM") {
        return "horizontal";
      } else {
        return "vertical";
      }
    });

    const handleKeyUp = (event: KeyboardEvent) => {
      const { key } = event;
      const navType = unref(keyNavType);

      if (key === "Tab") {
        emit("activate", props.id);
      } else if (key === "Enter") {
        emit("show", !props.menuActive);
      } else if (key === "Escape") {
        emit("show", false);
      } else if (
        (key === "ArrowRight" && navType === "horizontal") ||
        (key === "ArrowDown" && navType === "vertical")
      ) {
        emit("activate-next", props.id, "next");
      } else if (
        (key === "ArrowLeft" && navType === "horizontal") ||
        (key === "ArrowUp" && navType === "vertical")
      ) {
        emit("activate-previous", props.id, "prev");
      }
    };

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
      handleKeyUp,
    };
  },
});
</script>


<style lang="scss" src="./MenuBarItem.scss" scoped></style>