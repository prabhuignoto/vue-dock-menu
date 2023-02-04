import { MenuBarItemModel } from "@/models/MenuBarItemModel";

type tResult = {
  navigateMenu: {
    items: MenuBarItemModel[];
  }
} | {
  navigateMenubar: {
    nextId: string;
  }
};

let handleNav: (
  id: string,
  dir: "prev" | "next",
  items: MenuBarItemModel[],
  activeSelection: number,
  activeMenuBarId: string
) => tResult;

handleNav = (id, dir, items, activeSelection, activeMenuBarId) => {
  const eleIndex = items.findIndex((item) => item.id === id);
  const newIdx = dir === "next" ? eleIndex + 1 : eleIndex - 1;
  const menuItemsLen = items.length;

  let nextId = "";

  if (newIdx > -1 && newIdx < menuItemsLen) {
    nextId = items[newIdx].id as string;
  } else if (newIdx > menuItemsLen - 1) {
    nextId = items[0].id as string;
  } else if (newIdx < 0) {
    nextId = items[menuItemsLen - 1].id as string;
  }

  // get the menubar item
  const menuBarItem = items.find((item) => item.id === id);

  const menuItem =
    (menuBarItem && menuBarItem !== null && menuBarItem.menu)
      ? menuBarItem.menu[activeSelection]
      : null;

  let result: tResult;

  if (menuItem !== null && menuItem?.menu && dir === "next") {
    result = {
      navigateMenu: {
        items: items.map((item) => {
          if (item.id === activeMenuBarId) {
            return Object.assign({}, item, {
              menu: item.menu?.map((it) =>
                Object.assign({}, it, {
                  showSubMenu:
                    it.name?.toLowerCase() === menuItem.name?.toLowerCase(),
                })
              ),
            });
          } else {
            return item;
          }
        })
      }
    };
  } else {
    // move to the next menu bar item
    return {
      navigateMenubar: {
        nextId
      }
    }
  }

  return result;
}

export { handleNav };

