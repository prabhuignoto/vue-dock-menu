<template>
  <div
    ref="menuBarRef"
    class="menu-bar-container"
    :class="dockClass"
    draggable="true"
    tabindex="0"
    @blur="handleBlur"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd($event)"
  >
    <ul
      class="menu-bar-items"
      :class="dockClass"
    >
      <li
        v-for="item of menuItems"
        :key="item.id"
        :class="dockClass"
        class="menu-bar-item-wrapper"
      >
        <menu-bar-item
          :id="item.id"
          :dock="dockInternal"
          :menu-active="menuActive"
          :menu-bar-dimensions="{ height: barHeight, width: barWidth }"
          :menu="item.menu"
          :name="item.name"
          :show-menu="item.showMenu"
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
import { SelectedItemModel } from "@/models/SelectedItemModel";
import { nanoid } from "nanoid";

export default defineComponent({
  name: "MenuBar",
  components: {
    MenuBarItem,
  },
  props: {
    items: {
      required: true,
      default: [],
      type: Array as PropType<MenuBarItemModel[]>,
    },
    dock: {
      required: false,
      default: DockPosition.TOP,
      type: String,
    },
  },
  setup(props, {}) {
    // reference to the main menubar itself
    const menuBarRef = ref<HTMLElement>();

    // tracks the menubar drag
    const dragActive = ref(false);

    const menuActive = ref(false);

    // reference to the dock position
    const dockInternal = ref<string>(props.dock);

    const dockClass = computed(() => dockInternal.value.toLowerCase());

    const barHeight = ref<number>(0);
    const barWidth = ref<number>(0);

    const menuItems = ref<MenuBarItemModel[]>(
      props.items.map((item) =>
        Object.assign({}, item, {
          id: nanoid(),
        })
      )
    );

    onMounted(() => {
      const menu = menuBarRef.value;

      barHeight.value = menu?.clientHeight as number;
      barWidth.value = menu?.clientWidth as number;
    });

    const handleDragStart = (event: DragEvent) => {
      dragActive.value = true;
      menuActive.value = false;
      const img = new Image();
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
      event.dataTransfer?.setDragImage(img, 0, 0);
    };

    const handleDragEnd = (event: DragEvent) => {
      dragActive.value = false;
      const winHeight = window.innerHeight;
      const winWidth = window.innerWidth;

      const xThreshold = Math.round((event.clientX / winWidth) * 100);
      const yThreshold = Math.round((event.clientY / winHeight) * 100);

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

    const handleOnShowMenu = (id: string) => {
      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showMenu: item.id === id,
        })
      );
    };

    const handleActivateMenu = (state: boolean) => (menuActive.value = state);

    const handleBlur = () => {
      menuActive.value = false;

      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showMenu: false,
        })
      );
    };

    const handleSelected = (data: SelectedItemModel) => {
      debugger;
      console.log(data);
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
      handleSelected,
      handleBlur,
      menuActive,
      menuBarRef,
      menuItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-bar-container {
  position: fixed;
  display: flex;
  background: #21252b;
  user-select: none;

  &.left,
  &.right {
    height: 100%;
    align-items: flex-start;
  }

  &.top,
  &.bottom {
    height: 3rem;
    width: 100%;
    align-items: center;
    left: 0;
  }

  &.left {
    left: 0;
    top: 0;
  }

  &.right {
    right: 0;
    top: 0;
  }

  &.top {
    top: 0;
  }

  &.bottom {
    bottom: 0;
  }
}

.menu-bar-items {
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: flex-start;
  padding: 0;
  margin: 0;

  &.top,
  &.bottom {
    height: 100%;
  }

  &.left,
  &.right {
    flex-direction: column;
    width: 100%;
    align-items: flex-start;
  }
}

.menu-bar-item-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.left,
  &.right {
    width: 100%;
  }
}
</style>