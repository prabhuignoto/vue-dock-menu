<template>
  <div
    ref="menuBarItemRef"
    class="menu-bar-item-container"
    :class="menuBarStyle"
    @mouseenter="setMenuViewable()"
    @click="toggleMenu()"
  >
    <span
      class="name-container"
      :class="menuBarStyle"
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
          @selected="handleMenuSelection"
        />
      </transition>
    </span>
  </div>
</template>

<script lang="ts">
import DockPosition from "../models/MenuBarDockPosition";
import { MenuItemModel } from "@/models/MenuItemModel";
import { defineComponent, PropType, ref, computed, watch, onMounted, nextTick } from "vue";
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
    showMenu: {
      type: Boolean,
      default: false,
      required: true,
    },
    menuBarDimensions: {
      type: Object as PropType<{ height: number; width: number }>,
      default: 0,
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
  },
  emits: ["show", "activate", "selected"],
  setup(props, { emit }) {
    const menuBarItemRef = ref<HTMLElement>();
    const menuBarItemActive = ref();
    const menuStyle = ref();

    const getName = computed(() => {
      if (
        props.dock === DockPosition.LEFT ||
        props.dock === DockPosition.RIGHT
      ) {
        return props.name[0];
      } else {
        return props.name;
      }
    });

    const setMenuViewable = () => {
      emit("show", props.id);
    };

    const handleMenuSelection = (name: string) => {
      emit("selected", {
        id: props.id,
        name,
        parent: props.name
      })
    };

    const computeStyle = () => {
      let newStyle = {} as any;
      debugger;

      if (props.dock === DockPosition.LEFT) {
        newStyle.top = "0px";
        newStyle.left = `${menuBarItemRef.value?.clientWidth}px`;
      } else if (props.dock === DockPosition.RIGHT) {
        newStyle.top = "0px";
        newStyle.right = `${menuBarItemRef.value?.clientWidth}px`;
      } else if (props.dock === DockPosition.TOP) {
        newStyle.top = `${menuBarItemRef.value?.clientHeight}px`;
        newStyle.left = 0;
      } else if (props.dock === DockPosition.BOTTOM) {
        newStyle.bottom = `${menuBarItemRef.value?.clientHeight}px`;
        newStyle.left = 0;
      }

      menuStyle.value = newStyle;
    }

    const menuBarStyle = computed(() => `${props.dock.toLowerCase()} ${menuBarItemActive.value ? "active" : ""}`);

    const toggleMenu = () => {
      emit("activate", !props.menuActive)
    }

    watch(() => props.showMenu, newValue => {
      menuBarItemActive.value = newValue;
    });

    watch(() => props.dock, () => {
      nextTick(() => {
        computeStyle();
      })
    });

    onMounted(() => {
      computeStyle();
    });

    return {
      getName,
      menuBarItemRef,
      menuBarStyle,
      menuStyle,
      setMenuViewable,
      toggleMenu,
      handleMenuSelection,
      computeStyle
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
    /* background: #32323e; */
    cursor: pointer;
  }

  &.active {
    background: #32323e;
  }
}

.menu-container {
  position: absolute;
  z-index: 9999;
}

.name-container {
  text-transform: capitalize;
  font-size: 0.95rem;

  &.left,
  &.right {
    align-items: center;
    background: #4c4c57;
    border-radius: 50%;
    display: flex;
    font-size: 1.2rem;
    height: 2rem;
    justify-content: center;
    margin: 0.25rem 0.75rem;
    text-transform: uppercase;
    width: 2rem;
  }
}
</style>