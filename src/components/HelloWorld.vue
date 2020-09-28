<template>
  <menu-bar
    :items="items"
    :on-selected="selected"
    :theme="{
      primary: '#b2b2b2',
      secondary: '#e5e5e5',
      tertiary: '#ccc',
      textColor: '#000',
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
            {
              name: "Preferences",
              menu: [
                { name: "Settings" },
                {
                  name: "Themes",
                  menu: [{
                    name: "White",
                    menu: [{name: "white 1"}, {name: "white 2"}]
                  }, {
                    name: "Black"
                  }]
                },
              ],
            },
            { name: "Open Workspace" },
            { name: "Save" },
            { name: "Save As..." },
            { name: "Close" },
            { name: "Exit" },
          ],
        },
        {
          name: "edit",
          menu: [{ name: "Cut" }, { name: "Copy" }, { name: "Paste" }],
        },
        {
          name: "View",
          menu: [
            { name: "Explorer" },
            { name: "Search" },
            { name: "Run" },
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
