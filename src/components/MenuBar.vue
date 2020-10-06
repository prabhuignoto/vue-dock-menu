<template>
  <div
    ref="menuBarRef"
    :class="[dockClass, 'menu-bar-container', expandClass]"
    :draggable="draggable"
    tabindex="0"
    :style="{ background: theme.primary }"
    @blur="handleBlur"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @touchEnd="handleDragEnd"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <ul
      :class="[dockClass, 'menu-bar-items']"
      draggable="true"
      @dragstart="handleDragCancel"
    >
      <li
        v-for="item of menuItems"
        :key="item.id"
        :class="[dockClass, 'menu-bar-item-wrapper']"
      >
        <menu-bar-item
          :id="item.id"
          :dock="dockInternal"
          :menu-active="menuActive"
          :menu-bar-dimensions="{ height: barHeight, width: barWidth }"
          :menu="item.menu"
          :name="item.name"
          :menu-bar-active="menuBarActive"
          :show-menu="item.showMenu"
          :theme="theme"
          :is-touch-device="isMobileDevice"
          @activate="handleActivateMenu"
          @show="handleOnShowMenu"
          @selected="handleSelected"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, onMounted } from "vue";
import MenuBarItem from "./MenuBarItem.vue";
import DockPosition from "../models/MenuBarDockPosition";
import { MenuBarItemModel } from "@/models/MenuBarItemModel";
import { nanoid } from "nanoid";
import { SelectedItemModel } from "@/models/SelectedItemModel";
import isMobile from "./isMobileDevice";

export default defineComponent({
  name: "MenuBar",
  components: {
    MenuBarItem,
  },
  props: {
    items: {
      required: true,
      default: [] as MenuBarItemModel[],
      type: Array as PropType<MenuBarItemModel[]>,
    },
    dock: {
      required: false,
      default: DockPosition.TOP,
      type: String,
    },
    onSelected: {
      required: true,
      type: Function as PropType<
        ({ name, path }: { name: string; path: string }) => void
      >,
    },
    draggable: {
      required: false,
      type: Boolean,
      default: true,
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
  setup(props, {}) {
    // reference to the main menubar itself
    const menuBarRef = ref<HTMLElement>();

    // tracks the menubar drag
    const dragActive = ref(false);

    const menuActive = ref(false);

    const menuBarActive = ref(false);

    // reference to the dock position
    const dockInternal = ref<string>(props.dock);

    const dockClass = computed(() => [dockInternal.value.toLowerCase()]);

    const barHeight = ref<number>(0);
    const barWidth = ref<number>(0);

    const isMobileDevice = ref<boolean>();

    const menuItems = ref<MenuBarItemModel[]>(
      props.items.map((item) =>
        Object.assign({}, item, {
          id: nanoid(),
        })
      )
    );

    onMounted(() => {
      const menu = menuBarRef.value;

      // save the bar's height and width on render
      barHeight.value = menu?.clientHeight as number;
      barWidth.value = menu?.clientWidth as number;

      isMobileDevice.value = isMobile();
    });

    const handleDragStart = (event: DragEvent | TouchEvent) => {
      dragActive.value = true;

      event.stopPropagation();

      // close the menu during drag operation
      menuActive.value = false;
      // set a custom ghost image while dragging
      if (event instanceof DragEvent) {
        const img = new Image();
        img.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
        event.dataTransfer?.setDragImage(img, 0, 0);
      }
    };

    const handleDragEnd = (event: DragEvent | TouchEvent) => {
      dragActive.value = false;
      const winHeight = window.innerHeight;
      const winWidth = window.innerWidth;
      let xThreshold = 0;
      let yThreshold = 0;

      if (event instanceof DragEvent) {
        xThreshold = Math.round((event.clientX / winWidth) * 100);
        yThreshold = Math.round((event.clientY / winHeight) * 100);
      } else if (event instanceof TouchEvent) {
        xThreshold = Math.round(
          (event.changedTouches[0].clientX / winWidth) * 100
        );
        yThreshold = Math.round(
          (event.changedTouches[0].clientY / winHeight) * 100
        );
      }

      if (xThreshold < 10) {
        dockInternal.value = DockPosition.LEFT;
      }

      if (xThreshold > 90) {
        dockInternal.value = DockPosition.RIGHT;
      }

      if (yThreshold > 90) {
        dockInternal.value = DockPosition.BOTTOM;
      }

      if (yThreshold < 10) {
        dockInternal.value = DockPosition.TOP;
      }
    };

    const handleActivateMenu = (id: string) => {
      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showMenu: item.id === id,
        })
      );
    };

    const handleOnShowMenu = (state: boolean) => {
      menuActive.value = state;
    };

    const handleBlur = () => {
      menuActive.value = false;
      menuBarActive.value = false;

      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showMenu: false,
        })
      );
    };

    const expandClass = computed(() => {
      if (
        dockInternal.value === DockPosition.LEFT ||
        dockInternal.value === DockPosition.RIGHT
      ) {
        return menuBarActive.value ? "expanded" : "not-expanded";
      }
    });

    const handleSelected = ({ name, path }: SelectedItemModel) => {
      // close the menu
      menuActive.value = false;

      // propagate the selection
      props.onSelected({
        name: name,
        path: path,
      });
    };

    // cancels the drag event on the child elements of the menubar
    const handleDragCancel = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // activate the menu bar
    const handleMouseEnter = () => {
      if (!isMobileDevice.value) {
        menuBarActive.value = true;
      }
    };

    // deactivate the menubar if active
    const handleMouseLeave = () => {
      if (!isMobileDevice.value && !menuActive.value) {
        menuBarActive.value = false;
      }
    };

    return {
      barHeight,
      barWidth,
      dockClass,
      dockInternal,
      handleDragEnd,
      handleDragStart,
      handleOnShowMenu,
      handleActivateMenu,
      handleMouseEnter,
      handleMouseLeave,
      handleSelected,
      handleBlur,
      menuActive,
      menuBarRef,
      menuItems,
      handleDragCancel,
      expandClass,
      menuBarActive,
      isMobileDevice,
    };
  },
});
</script>

<style lang="scss" src="./menu-bar.scss" scoped>
</style>