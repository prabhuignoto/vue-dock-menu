<template>
  <menu-bar
    :items="items"
    :on-selected="selected"
    :theme="{
      primary: '#b2b2b2',
      secondary: '#e5e5e5',
      tertiary: '#008ecc',
      textColor: '#000',
      textHoverColor: '#fff',
    }"
  />
</template>

<script lang="ts">
import { MenuBarItemModel } from "@/models/MenuBarItemModel";
import { SelectedItemModel } from "@/models/SelectedItemModel";
import { defineComponent } from "vue";
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

    return {
      selected,
    };
  },
  data() {
    return {
      count: 0,
      items: [
        {
          name: "file",
          menu: [
            { name: "New File" },
            { name: "New Window" },
            { name: "Open File" },
            { isDivider: true },
            {
              name: "Preferences",
              menu: [
                { name: "Settings" },
                {
                  name: "Themes",
                  menu: [
                    {
                      name: "White",
                      menu: [{ name: "white 1" }, { name: "white 2" }],
                    },
                    {
                      name: "Black",
                    },
                  ],
                },
              ],
            },
            { name: "Open Workspace" },
            { isDivider: true },
            { name: "Save", disable: true },
            { name: "Save As..." },
            { isDivider: true },
            { name: "Close" },
            { name: "Exit" },
          ],
        },
        {
          name: "edit",
          menu: [
            { name: "Undo" },
            { name: "Redo" },
            { isDivider: true },
            { name: "Cut" },
            { name: "Copy" },
            { name: "Paste" },
            { isDivider: true },
            { name: "Find" },
            { name: "Replace" },
          ],
        },
        {
          name: "View",
          menu: [
            { name: "Explorer" },
            { name: "Search" },
            { name: "Run" },
            { isDivider: true },
            {
              name: "Apperance",
              menu: [{ name: "Full Screen" }, { name: "Zen Mode" }],
            },
          ],
        },
        {
          name: "Help",
          menu: [{ name: "About" }, { name: "Check for Updates" }],
        },
      ] as MenuBarItemModel[],
    };
  },
});
</script>
