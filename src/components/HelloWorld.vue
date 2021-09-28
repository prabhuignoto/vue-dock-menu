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
      <img
        src="../assets/file.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #window>
      <img
        src="../assets/window-maximize.svg"
        alt="file"
        :style="style"
      >
    </template> 
    <template #cog>
      <img
        src="../assets/cog.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #save>
      <img
        src="../assets/save.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #times>
      <img
        src="../assets/window-close.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #signout>
      <img
        src="../assets/sign-out-alt.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #brush>
      <img
        src="../assets/paint-brush.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #hammer>
      <img
        src="../assets/hammer.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #brief>
      <img
        src="../assets/briefcase.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #cut>
      <img
        src="../assets/cut.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #copy>
      <img
        src="../assets/copy.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #paste>
      <img
        src="../assets/paste.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #search>
      <img
        src="../assets/paste.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #undo>
      <img
        src="../assets/undo.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #redo>
      <img
        src="../assets/redo.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #bolt>
      <img
        src="../assets/bolt.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #mask>
      <img
        src="../assets/mask.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #circle>
      <img
        src="../assets/info-circle.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #download>
      <img
        src="../assets/download.svg"
        alt="file"
        :style="style"
      >
    </template>
    <template #folderopen>
      <img
        src="../assets/folder-open.svg"
        alt="file"
        :style="style"
      >
    </template>
  </menu-bar>
</template>

<script lang="ts">
import { MenuBarItemModel } from "@/models/MenuBarItemModel";
import { SelectedItemModel } from "@/models/SelectedItemModel";
import { computed, defineComponent } from "vue";
import MenuBar from "./MenuBar.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    MenuBar,
  },
  setup() {
    const selected = (data: SelectedItemModel) => {
      alert(data.name + " _ " + data.path);
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
          name: "file",
          iconSlot: "brief",
          title: "File",
          menu: [
            { name: "new-file", title: 'New File', iconSlot: "file" },
            { name: "new-window", title: "New Window", iconSlot: "window" },
            { name: "open-file", title: "Open File", iconSlot: "folderopen" },
            { isDivider: true },
            {
              name: "preferences",
              title: 'Preferences',
              iconSlot: "cog",
              menu: [
                { name: "settings", title: 'Settings', iconSlot: "hammer" },
                {
                  name: "themes",
                  title: 'Themes',
                  iconSlot: "brush",
                  menu: [
                    {
                      name: "white",
                      title: 'White',
                      menu: [{ name: "white-1", title: 'white 1', }, { name: "white-2", title: "white 2" }],
                    },
                    {
                      name: "black",
                      title: "Black",
                    },
                  ],
                },
              ],
            },
            { name: "open-workspace", title: "Open Workspace", iconSlot: "brief" },
            { isDivider: true },
            { name: "save", title: "Save",  disable: true, iconSlot: "save" },
            { name: "save-as", title: "Save As...", iconSlot: "save" },
            { isDivider: true },
            { name: "close", title: "Close", iconSlot: "times" },
            { name: "exit", title: "Exit", iconSlot: "signout" },
          ],
        },
      ] as MenuBarItemModel[],
    };
  },
});
</script>
