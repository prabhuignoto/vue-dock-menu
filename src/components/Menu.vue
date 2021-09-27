<template>
  <div
    :class="[dockClass, 'menu-wrapper']"
    :style="{ background: theme.secondary }"
  >
    <ul
      ref="menuItemsRef"
      class="menu-items"
      tabindex="0"
      @keyup.up="handleKeyUp"
      @keyup.down="handleKeyDown"
      @keyup.left="
        dock === 'RIGHT' ? handleKeyRight($event) : handleKeyLeft($event)
      "
      @keyup.right="
        dock === 'RIGHT' ? handleKeyLeft($event) : handleKeyRight($event)
      "
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="handleKeySelection"
    >
      <li
        v-for="(item, index) of menuItems"
        :key="item.id"
        :class="[
          dockClass,
          'menu-item',
          {
            'is-parent': !!item.menu,
            highlight: index === highlightedIndex,
            divider: item.isDivider,
            disable: item.disable,
          },
        ]"
        :style="menuItemStyle"
        @mouseenter="item.menu && !isMobile && toggleSubMenu(!!item.menu, item.id)"
        @mouseleave="item.menu && !isMobile && toggleSubMenu(!!item.menu, item.id)"
        @click="
          handleSelection({
            event: $event,
            name: item.name,
            isParent: !!item.menu,
            disable: item.disable,
          })
        "
        @touchend="
          handleSelection({
            event: $event,
            name: item.name,
            isParent: !!item.menu,
            disable: item.disable,
          })
        "
      >
        <template v-if="!item.isDivider">
          <span
            v-if="item.iconSlot"
            class="menu-item-icon"
          >
            <slot :name="item.iconSlot" />
          </span>
          <span class="name">{{ item.name }}</span>
          <span
            :class="{ visible: !!item.menu }"
            class="icon-wrap"
          >
            <ChevRight />
          </span>
          <div
            v-if="item.menu && showSubMenu && item.id === activeMenuId"
            :class="[dockClass, 'sub-menu-wrapper']"
          >
            <component
              :is="MenuComponent"
              :items="item.menu"
              :dock="dock"
              :parent="`${parent}>${item.name}`"
              :theme="theme"
              :is-touch="isMobile"
              :nested="true"
              :on-selected="onSelected"
              :initial-highlight-index="subMenuHighlightIndex"
              @closeMenu="handleCloseMenu"
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
            </component>
          </div>
        </template>
        <span
          v-else
          class="menu-item-divider"
        />
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
  onMounted,
  nextTick,
} from "vue";
import ChevRight from "./ChevRight.vue";
import { SelectedItemModel } from "@/models/SelectedItemModel";
import { MenuTheme } from "@/models/Theme";

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
      required: true,
      type: Object as PropType<MenuTheme>,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
    nested: {
      type: Boolean,
      default: false,
    },
    onSelected: {
      required: true,
      type: Function as PropType<
        ({ name, path }: { name: string; path: string }) => void
      >,
    },
    initialHighlightIndex: {
      required: false,
      type: Number,
      default: -1,
    },
  },
  emits: ["selected", "close-menu"],
  setup(props, { emit }) {
    const MenuComponent = resolveComponent("Menu");

    const showSubMenu = ref();

    const activeMenuId = ref();

    const dockClass = computed(() => props.dock.toLowerCase());

    const toggleSubMenu = (hasData: boolean, id: string) => {
      if (hasData) {
        if(!showSubMenu.value) {
          activeMenuId.value = id;
        } else {
          activeMenuId.value = null;
        }
        showSubMenu.value = !showSubMenu.value;
      }
    };

    const hasFocus = ref<boolean>();

    const menuItemsRef = ref();
    const highlightedIndex = ref<number>(props.initialHighlightIndex);
    const subMenuHighlightIndex = ref(-1);

    const handleSelection = (selectedItem: SelectedItemModel) => {
      selectedItem.event.stopPropagation();
      selectedItem.event.preventDefault();

      if (selectedItem.disable) {
        return;
      }

      if (selectedItem.isParent) {
        showSubMenu.value = !showSubMenu.value;
        return;
      }

      const { path, name } = selectedItem;

      props.onSelected({
        name,
        path: `${props.parent}>${path ? path : name}`.toLowerCase(),
      });

    };

    const menuItemStyle = computed(() => ({
      "--background-color-hover": props.theme.tertiary,
      "--fore-color": props.theme.textColor,
      "--text-hover-color": props.theme.textHoverColor,
    }));

    const menuItems = ref(
      props.items.map((item) =>
        Object.assign({}, item, {
          id: Math.random().toString(16).slice(2),
          showSubMenu: false,
        })
      )
    );

    const menuItemsLen = computed(() => menuItems.value.length);

    onMounted(() => {
      nextTick(() => {
        (menuItemsRef.value as HTMLElement).focus();
      });
    });

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!hasFocus.value) {
        return;
      }
      event.stopPropagation();
      let nextIndex = highlightedIndex.value - 1;
      nextIndex = menuItems.value[nextIndex]?.isDivider
        ? nextIndex - 1
        : nextIndex;

      if (nextIndex >= 0) {
        highlightedIndex.value = nextIndex;
      } else if (nextIndex < 0) {
        highlightedIndex.value = menuItemsLen.value - 1;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hasFocus.value) {
        return;
      }
      event.stopPropagation();
      let nextIndex = highlightedIndex.value + 1;
      nextIndex = menuItems.value[nextIndex]?.isDivider
        ? nextIndex + 1
        : nextIndex;

      if (nextIndex >= 0 && nextIndex < menuItemsLen.value) {
        highlightedIndex.value = nextIndex;
      } else if (nextIndex > menuItemsLen.value - 1) {
        highlightedIndex.value = 0;
      }
    };

    const handleKeyRight = (event: KeyboardEvent) => {
      if (!hasFocus.value) {
        return;
      }
      const menuItem = menuItems.value[highlightedIndex.value];

      if (menuItem && menuItem.menu) {
        event.stopPropagation();
        subMenuHighlightIndex.value = 0;
        toggleSubMenu(!!menuItem.menu, menuItem.id);
      }
    };

    const handleKeyLeft = (event: KeyboardEvent) => {
      if (!hasFocus.value) {
        return;
      }
      if (props.nested) {
        event.stopPropagation();
        emit("close-menu");
      }
    };

    const handleKeySelection = (event: KeyboardEvent) => {
      if (highlightedIndex.value >= 0) {
        const menuItem = menuItems.value[highlightedIndex.value];
        event.stopPropagation();

        if (menuItem?.menu) {
          subMenuHighlightIndex.value = 0;
          toggleSubMenu(!!menuItem.menu, menuItem.id);

          nextTick(() => {
            (menuItemsRef.value as HTMLElement).focus();
          });
        } else if (menuItem) {
          props.onSelected({
            name: menuItem.name as string,
            path: `${props.parent}>${menuItem.name}`.toLowerCase(),
          });
        }
      }
    };

    const onFocus = () => (hasFocus.value = true);
    const onBlur = () => (hasFocus.value = false);

    const handleCloseMenu = () => {
      showSubMenu.value = false;
      nextTick(() => {
        (menuItemsRef.value as HTMLElement).focus();
      });
    };

    return {
      MenuComponent,
      activeMenuId,
      dockClass,
      handleCloseMenu,
      handleKeyDown,
      handleKeyLeft,
      handleKeyRight,
      handleKeySelection,
      handleKeyUp,
      handleSelection,
      highlightedIndex,
      menuItemStyle,
      menuItems,
      menuItemsRef,
      onBlur,
      onFocus,
      showSubMenu,
      subMenuHighlightIndex,
      toggleSubMenu,
    };
  },
});
</script>

<style lang="scss" scoped src="./menu.scss">
</style>