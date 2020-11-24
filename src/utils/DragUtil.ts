import MenuBarDockPosition from '../models/MenuBarDockPosition';

interface Coordinates {
  x: number; y: number;
}

let handleDragEnd: (event: DragEvent | TouchEvent, clientCoordinates: Coordinates) => ({
  dragActive: boolean,
  dockPosition: MenuBarDockPosition
});

handleDragEnd = (event: DragEvent | TouchEvent, clientCoordinates: Coordinates) => {
  const winHeight = window.innerHeight;
  const winWidth = window.innerWidth;
  let xThreshold = 0;
  let yThreshold = 0;
  const { x, y } = clientCoordinates;

  let value = {
    dragActive: false,
    dockPosition: MenuBarDockPosition.TOP
  }

  if (event instanceof DragEvent) {
    xThreshold = Math.round((x / winWidth) * 100);
    yThreshold = Math.round((y / winHeight) * 100);
  } else if (event instanceof TouchEvent) {
    const { clientX, clientY } = event.touches[0];
    xThreshold = Math.round((clientX / winWidth) * 100);
    yThreshold = Math.round((clientY / winHeight) * 100);
  }

  if (xThreshold < 10) {
    value.dockPosition = MenuBarDockPosition.LEFT;
  }

  if (xThreshold > 90) {
    value.dockPosition = MenuBarDockPosition.RIGHT;
  }

  if (yThreshold > 90) {
    value.dockPosition = MenuBarDockPosition.BOTTOM;
  }

  if (yThreshold < 10) {
    value.dockPosition = MenuBarDockPosition.TOP;
  }

  return value;
}


let handleDragStart: (event: DragEvent | TouchEvent) => void;

handleDragStart = (event: DragEvent | TouchEvent) => {
  // set a custom ghost image while dragging
  if (event instanceof DragEvent) {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    event.dataTransfer?.setDragImage(img, 0, 0);
  }
};

export default { handleDragEnd, handleDragStart };

