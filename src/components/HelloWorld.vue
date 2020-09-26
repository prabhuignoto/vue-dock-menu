<template>
  <menu-bar
    :items="items"
    :dock="'TOP'"
  />
</template>

<script lang="ts">
import { MenuBarItemModel } from "@/models/MenuBarItemModel";
import { defineComponent } from "vue";
import MenuBar from "./MenuBar.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    MenuBar,
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
              name: "Open Folder",
              menu: [
                { name: "prabhu" },
                {
                  name: "RAMYA",
                  menu: [{ name: "prabhu" }, { name: "prabhu" }],
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
          menu: [{ name: "red" }, { name: "blue" }, { name: "orange" }],
        },
        {
          name: "selection",
          menu: [{ name: "red" }, { name: "blue" }, { name: "orange" }],
        },
        {
          name: "view",
          menu: [
            { name: "red" },
            { name: "blue" },
            { name: "orange" },
            { name: "red" },
            { name: "blue" },
            { name: "orange" },
            {
              name: "Open Folder",
              menu: [
                { name: "prabhu" },
                {
                  name: "RAMYA",
                  menu: [{ name: "prabhu" }, { name: "prabhu" }],
                },
              ],
            },
          ],
        },
      ] as MenuBarItemModel[],
    };
  },
});
</script>
