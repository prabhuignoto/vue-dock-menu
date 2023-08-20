<template>
  <menu-bar
    :items="items"
    :on-selected="selected"
    :theme="{
      primary: '#b7b7b7',
      secondary: '#e5e5e5',
      tertiary: '#b7b7b7',
      textColor: '#000',
      textHoverColor: '#fff',
    }"
  >
    <template #file>
      <img src="../assets/file.svg" alt="file" :style="style" />
    </template>
    <template #window>
      <img src="../assets/window-maximize.svg" alt="file" :style="style" />
    </template>
    <template #cog>
      <img src="../assets/cog.svg" alt="file" :style="style" />
    </template>
    <template #save>
      <img src="../assets/save.svg" alt="file" :style="style" />
    </template>
    <template #times>
      <img src="../assets/window-close.svg" alt="file" :style="style" />
    </template>
    <template #signout>
      <img src="../assets/sign-out-alt.svg" alt="file" :style="style" />
    </template>
    <template #brush>
      <img src="../assets/paint-brush.svg" alt="file" :style="style" />
    </template>
    <template #hammer>
      <img src="../assets/hammer.svg" alt="file" :style="style" />
    </template>
    <template #brief>
      <img src="../assets/briefcase.svg" alt="file" :style="style" />
    </template>
    <template #cut>
      <img src="../assets/cut.svg" alt="file" :style="style" />
    </template>
    <template #copy>
      <img src="../assets/copy.svg" alt="file" :style="style" />
    </template>
    <template #paste>
      <img src="../assets/paste.svg" alt="file" :style="style" />
    </template>
    <template #search>
      <img src="../assets/paste.svg" alt="file" :style="style" />
    </template>
    <template #undo>
      <img src="../assets/undo.svg" alt="file" :style="style" />
    </template>
    <template #redo>
      <img src="../assets/redo.svg" alt="file" :style="style" />
    </template>
    <template #bolt>
      <img src="../assets/bolt.svg" alt="file" :style="style" />
    </template>
    <template #mask>
      <img src="../assets/mask.svg" alt="file" :style="style" />
    </template>
    <template #circle>
      <img src="../assets/info-circle.svg" alt="file" :style="style" />
    </template>
    <template #download>
      <img src="../assets/download.svg" alt="file" :style="style" />
    </template>
    <template #folderopen>
      <img src="../assets/folder-open.svg" alt="file" :style="style" />
    </template>
  </menu-bar>
</template>

<script lang="ts">
import { MenuBarItemModel } from "../models/MenuBarItemModel";
import { SelectedItemModel } from "../models/SelectedItemModel";
import { computed, defineComponent } from "vue";
import MenuBar from "./MenuBar.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    MenuBar,
  },
  setup() {
    const selected = (data: SelectedItemModel) => {
      alert(data.name + "\n" + data.path + "\n" + data.id);
    };

    const style = computed(() => ({
      height: "100%",
      width: "100%",
      fill: "red",
    }));

    return {
      selected,
      style,
    };
  },
  data() {
    return {
      count: 0,
      items: [
        {
          id: "file",
          name: "file",
          menu: [
            { name: "New File", iconSlot: "file", id: "new-file" },
            { name: "New Window", iconSlot: "window", id: "new-window" },
            { name: "Open File", iconSlot: "folderopen", id: "open-file" },
            { isDivider: true },
            {
              id: "preferences",
              name: "Preferences",
              iconSlot: "cog",
              menu: [
                { name: "Settings", iconSlot: "hammer", id: "settings" },
                {
                  id: "themes",
                  name: "Themes",
                  iconSlot: "brush",
                  menu: [
                    {
                      id: "white",
                      name: "White",
                      menu: [{ name: "white 1", id: "white-1" }, { name: "white 2", id: "white-2" }],
                    },
                    {
                      id: "black",
                      name: "Black",
                    },
                  ],
                },
              ],
            },
            { name: "Open Workspace", iconSlot: "brief", id: "open-workspace" },
            { isDivider: true },
            { name: "Save", disable: true, iconSlot: "save", id: "save" },
            { name: "Save As...", iconSlot: "save", id: "save-as" },
            { isDivider: true },
            { name: "Close", iconSlot: "times", id: "close" },
            { name: "Exit", iconSlot: "signout", id: "exit" },
          ],
        },
        {
          name: "edit",
          menu: [
            { name: "Undo", iconSlot: "undo" },
            { name: "Redo", iconSlot: "redo" },
            { isDivider: true },
            { name: "Cut", iconSlot: "cut" },
            { name: "Copy", iconSlot: "copy" },
            { name: "Paste", iconSlot: "paste" },
            { isDivider: true },
            { name: "Find", iconSlot: "search" },
          ],
        },
        {
          name: "View",
          menu: [
            { name: "Search", iconSlot: "search" },
            { name: "Run", iconSlot: "bolt" },
            { isDivider: true },
            {
              name: "Apperance",
              iconSlot: "mask",
              menu: [{ name: "Full Screen" }, { name: "Zen Mode" }],
            },
          ],
        },
        {
          name: "Help",
          menu: [
            { name: "About", iconSlot: "circle" },
            { name: "Check for Updates", iconSlot: "download" },
          ],
        },
      ] as MenuBarItemModel[],
    };
  },
});
</script>
