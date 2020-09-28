
[![DeepScan grade](https://deepscan.io/api/teams/10074/projects/13372/branches/223016/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=10074&pid=13372&bid=223016)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/65c2863c31644d5a98ae5bb83c1bd104)](https://www.codacy.com/manual/prabhuignoto/vue-dock-menu/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=prabhuignoto/vue-dock-menu&amp;utm_campaign=Badge_Grade)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/prabhuignoto/vue-dock-menu.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/prabhuignoto/vue-dock-menu/context:javascript)
[![Depfu](https://badges.depfu.com/badges/f3a16c4fe1fcbd36df15d6949d9846bc/overview.svg)](https://depfu.com/github/prabhuignoto/vue-dock-menu?project_id=16495)
[![Known Vulnerabilities](https://snyk.io/test/github/prabhuignoto/vue-dock-menu/badge.svg?targetFile=package.json)](https://snyk.io/test/github/prabhuignoto/vue-dock-menu?targetFile=package.json)

![logo](./readme-assets/logo.png)

> Dockable Menu bar for Vue 3

## Features

:large_blue_diamond: **Dockable Menu** - Dock your menus with ease.

:large_blue_diamond: **Dock with drag** - Quickly dock the Menubar by dragging the Menu bar and dropping to the edges of the screen.

:large_blue_diamond: **Nested Menus** - Support for nested menus up to any levels.

:large_blue_diamond: **Smart Menus** - The Menus adjust to any docked position and enables an intuitive menu navigation.

## ⚙ Installation

```sh
yarn install vue-dock-menu
```

## 🚀 Getting Started

vue-dock-menu has some great defaults. Please check the [Props](##props) list for all the available options.

The following snippet creates a simple Menubar and docks it to the top.

```sh
const items = [
  {
    name: "File",
    menu: [{ name: "Open"}, {name: "New Window"}, {name: "Exit"}]
  },
  {
    name: "Edit",
    menu: [{ name: "Cut"}, {name: "Copy"}, {name: "Paste"}]
  }
]

<vue-dock-menu>
  :items="items"
</vue-dock-menu>
```

![sample1](./readme-assets/sample1.png)

## 📺 Demo

![demo](./readme-assets/demo.gif)

## Props

| Name        | Description                                                                                       | Default |
|-------------|---------------------------------------------------------------------------------------------------|---------|
| dock        | Position where you want the Menu to be docked. Can be any one of `TOP`, `LEFT`, `RIGHT`, `BOTTOM` | `TOP`   |
| on-selected | Callback that will be called on a menu item selection                                             |         |
| items       | Data for the Menu bar                                                                             | []      |
| theme       | prop to customize the color theme                                                                 |         |

### Dock

use the `dock` prop to dock the menubar to your preferred position. The dock prop can accept the following values `TOP`, `BOTTOM`, `LEFT`, `RIGHT`.

Here we dock the Menu bar to the right side of the screen.

```sh
<vue-dock-menu>
  :items="items"
  dock="RIGHT"
</vue-dock-menu>
```

### on-selected

The `on-selected` prop is used to retrieve the selected menu item. The callback receives an object with `name` and a `path` property.

- **name** - Name of the selected menu item.
- **path** - Full path of the selected menu item.

``sh
{
  name: "Edit",
  path: "edit>recent-items"
}``

### Populating Menu

Use the `items` prop to create Simple or Nested menus of your liking.

Here we create a simple Menu structure with 3 Menu items with `Edit` and `Open Recent` having sub menus.

```sh
const items = [
  { name: "New" },
  {
    name: "Edit",
    menu: {
      name: "edit-items",
    },
  },
  {
    name: "Open Recent",
    menu: {
      name: "recent-items",
    },
  },
]
```

```sh
  <vue-dock-menu>
    :items="items"
    dock="BOTTOM"
  </vue-dock-menu>
```

### Custom theme

use the `theme` prop to customize the colors of the menu bar.

```sh
  <menu-bar
    :items="items"
    :on-selected="selected"
    :theme="{
      primary: '#001B48',
      secondary: '#02457a',
      tertiary: '#018abe',
      textColor: '#fff'
    }"
  />
```

![theme](./readme-assets/theme.png)

## 🔨 Built with

- [Vue.JS](vue) - The Component is written in Vue + [Typescript](typescript).

## 📄 Notes

- The project uses [vite](vite) instead of @vue/cli. I choose vite for speed and i also believe [vite](vite) will be the future.

## Meta

Prabhu Murthy – [@prabhumurthy2](https://twitter.com/prabhumurthy2) – prabhu.m.murthy@gmail.com

[https://www.prabhumurthy.com](https://www.prabhumurthy.com)

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/prabhuingoto/](https://github.com/prabhuingoto/)

[vue]: https://vuejs.org
[typescript]: https://typescriptlang.org
[vite]: https://github.com/vitejs/vite