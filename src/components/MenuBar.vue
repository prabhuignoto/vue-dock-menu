<template>
  <div
    ref="menuBarRef"
    :class="[dockClass, 'menu-bar-container', expandClass]"
    :draggable="draggable"
    tabindex="0"
    :style="menuBarStyle"
    @dragover="handleDragMove"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @touchstart="handleDragStart"
    @touchmove="handleDragMove"
    @touchend="handleDragEnd"
  >
    <ul
      :class="[dockClass, 'menu-bar-items']"
      draggable="true"
      @dragstart="handleDragCancel"
    >
      <li
        v-for="item of menuItems"
        :key="item.id"
        :class="[dockClass, 'v-dock-menu-bar-item-wrapper']"
      >
        <menu-bar-item
          :id="item.id"
          :dock="dockPosition"
          :menu-active="menuActive"
          :menu-bar-dimensions="{ height: barHeight, width: barWidth }"
          :menu="item.menu"
          :name="item.name"
          :icon-slot="item.iconSlot"
          :title="item.title"
          :menu-bar-active="menuBarActive"
          :show-menu="item.showMenu"
          :theme="theme"
          :is-touch-device="isMobileDevice"
          :on-selected="handleSelected"
          :highlight-first-element="highlightFirstElement"
          @deactivate="handleDeactivateMenu"
          @activate="handleActivateMenu"
          @activate-next="handleActivateDir"
          @activate-previous="handleActivateDir"
          @show="handleOnShowMenu"
        >
          <template
            v-for="slot in Object.keys($slots)"
            #[slot]="scope"
          >
            <slot
              :name="slot"
              v-bind="scope"
            />
          </template>
        </menu-bar-item>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  ref,
  onMounted,
  unref,
  onUnmounted,
} from "vue";
import MenuBarItem from "./MenuBarItem.vue";
import DockPosition from "../models/MenuBarDockPosition";
import { MenuBarItemModel } from "@/models/MenuBarItemModel";
import "focus-visible";
import isMobile from "./isMobileDevice";
import utils from "../utils/DragUtil";
import { MenuTheme } from "@/models/Theme";
import { handleNav } from "../utils/keyboardNavigator";

const remListener = document.removeEventListener;
const addListener = document.addEventListener;

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
    sidebarWidth: {
      required: false,
      type: String,
      default: "200px",
    },
    theme: {
      required: false,
      type: Object as PropType<MenuTheme>,
      default: () => ({
        primary: "#21252b",
        secondary: "#32323e",
        tertiary: "#4c4c57",
        textColor: "#fff",
      }),
    },
  },
  setup(props) {
    // reference to the main menubar itself
    const menuBarRef = ref<HTMLElement>();

    // tracks if the drag has been started
    const dragStart = ref(false);

    // tracks the drag status of the menubar
    const dragActive = ref(false);

    // tracks if the menu is active
    const menuActive = ref(false);

    // tracks if the menubar is active
    const menuBarActive = ref(false);

    // reference to the dock position
    const dockPosition = ref<string>(props.dock);

    // compute the dock class
    const dockClass = computed(() => [dockPosition.value.toLowerCase()]);

    // height and width of the menubar
    const barHeight = ref<number>(0);
    const barWidth = ref<number>(0);

    const isMobileDevice = ref<boolean>();

    // highlights the first element in the menu (on keyboard interaction)
    const highlightFirstElement = ref<boolean>();

    // initialize the menu items.add a unique id to all items.
    const menuItems = ref<MenuBarItemModel[]>(
      props.items.map((item) =>
        Object.assign({}, item, {
          id: Math.random().toString(16).slice(2),
        })
      )
    );

    const activeMenuSelection = ref(-1);

    // tracks the active menubar item
    const activeMenuBarId = ref("");

    const clientCoords = ref<{ x: number; y: number }>({ x: 0, y: 0 });

    // activate the menu bar
    const handleMouseEnter = () => {
      menuBarActive.value = true;
    };

    // deactivate the menubar if active
    const handleMouseLeave = () => {
      if (!isMobileDevice.value && !menuActive.value) {
        menuBarActive.value = false;
      }
    };

    const handleMenuClosure = () => {
      if (unref(menuActive) || unref(menuBarActive)) {
        menuBarActive.value = false;
        menuActive.value = false;
        activeMenuSelection.value = -1;
        activeMenuBarId.value = "";
        highlightFirstElement.value = false;
        handleDeactivateMenu();
      }
    };

    //** Lifecylce  Methods **

    const updateDragCoords = (event: DragEvent) =>
      (clientCoords.value = { x: event.clientX, y: event.clientY });

    onMounted(() => {
      // get reference to the menubar
      const menu = menuBarRef.value;

      // save the bar's height and width on render
      barHeight.value = menu?.clientHeight as number;
      barWidth.value = menu?.clientWidth as number;

      // check if its a mobile device
      isMobileDevice.value = isMobile();
      const menuBar = unref(menuBarRef);

      if (isMobileDevice.value) {
        addListener("touchend", handleMenuClosure);
      } else {
        addListener("click", handleMenuClosure);

        if (menuBar) {
          menuBar.addEventListener("mouseenter", handleMouseEnter);
          menuBar.addEventListener("mouseleave", handleMouseLeave);
        }
      }

      addListener("dragover", updateDragCoords);
    });

    // cleanup
    onUnmounted(() => {
      remListener("dragover", updateDragCoords);

      const menuBar = unref(menuBarRef);

      if (isMobileDevice.value) {
        remListener("touchend", handleMenuClosure);
      } else {
        remListener("click", handleMenuClosure);

        if (menuBar) {
          menuBar.removeEventListener("mouseenter", handleMouseEnter);
          menuBar.removeEventListener("mouseleave", handleMouseLeave);
        }
      }

      remListener("dragover", updateDragCoords);
    });

    const handleDragStart = (event: DragEvent | TouchEvent) => {
      dragStart.value = true;
      dragActive.value = false;

      // set a custom ghost image while dragging
      utils.handleDragStart(event);
    };

    //** Drag handlers **

    const handleDragEnd = (event: DragEvent | TouchEvent) => {
      if (!unref(dragStart)) {
        return;
      }

      const dragEndResult = utils.handleDragEnd(event, unref(clientCoords));

      if (dragEndResult) {
        const {
          dragActive: dragActiveNew,
          dockPosition: positionNew,
        } = dragEndResult;

        dragActive.value = dragActiveNew;
        dockPosition.value = positionNew;
      }

      dragStart.value = false;
      dragActive.value = false;
    };

    const handleDragMove = () => {
      if (dragStart.value) {
        dragActive.value = true;

        // close the menu during drag operation
        menuActive.value = false;
      }
    };

    const handleDrag = (event: DragEvent) => {
      clientCoords.value = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    // cancels the drag event on the child elements of the menubar
    const handleDragCancel = (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    //** Other handlers */

    const handleActivateMenu = (id?: string) => {
      menuItems.value = menuItems.value.map((item) =>
        Object.assign({}, item, {
          showMenu: item.id === id,
        })
      );
    };

    const handleDeactivateMenu = () => {
      // keep the menubar when the sub menu is being displayed
      if (!menuActive.value) {
        menuItems.value = menuItems.value.map((item) =>
          Object.assign({}, item, {
            showMenu: false,
          })
        );
      }
    };

    const focusMenuBar = () => {
      const menuBarItems = (menuBarRef.value as HTMLElement).querySelector(
        ".menu-bar-item-container"
      );
      if (menuBarItems) {
        (menuBarItems as HTMLElement).focus();
      }
    };

    const handleOnShowMenu = (state: boolean, id: string) => {
      menuActive.value = state;
      if (state) {
        activeMenuBarId.value = id;
      } else {
        activeMenuBarId.value = "";
        highlightFirstElement.value = false;
        focusMenuBar()
      }
    };

    //** computed methods */

    // convert to a sidebar when docked to either left or right
    const expandClass = computed(() => {
      if (
        dockPosition.value === DockPosition.LEFT ||
        dockPosition.value === DockPosition.RIGHT
      ) {
        return menuBarActive.value ? "expanded" : "not-expanded";
      } else {
        return "";
      }
    });

    //** final selection handler */
    const handleSelected = (data: any) => {
      handleMenuClosure();
      props.onSelected(data);
    };

    //** keyboard handlers  **

    // activates the menu via keyboard
    const handleActivateDir = (id: string, dir: "prev" | "next") => {
      const result = handleNav(
        id,
        dir,
        unref(menuItems),
        unref(activeMenuSelection),
        unref(activeMenuBarId)
      );

      if ("navigateMenu" in result) {
        menuItems.value = result.navigateMenu.items;
      } else if ("navigateMenubar" in result) {
        highlightFirstElement.value = true;
        const {
          navigateMenubar: { nextId },
        } = result;
        activeMenuBarId.value = nextId;
        nextId && handleActivateMenu(nextId);
      }

      // reset active menu selection
      activeMenuSelection.value = -1;
    };

    const menuBarStyle = computed(() => ({
      "--menubar-expanded-width": props.sidebarWidth,
      "--menubar-not-expanded-width": "50px",
      "--menubar-bg-color": props.theme.primary,
    }));

    return {
      activeMenuBarId,
      activeMenuSelection,
      barHeight,
      barWidth,
      dockClass,
      dockPosition,
      expandClass,
      handleActivateDir,
      handleActivateMenu,
      handleDeactivateMenu,
      handleDrag,
      handleDragCancel,
      handleDragEnd,
      handleDragMove,
      handleDragStart,
      handleMouseEnter,
      handleMouseLeave,
      handleOnShowMenu,
      handleSelected,
      highlightFirstElement,
      isMobileDevice,
      menuActive,
      menuBarActive,
      menuBarRef,
      menuBarStyle,
      menuItems,
    };
  },
});
</script>

<style lang="scss" src="./menu-bar.scss" scoped>
</style>