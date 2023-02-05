import MenuBarDockPosition from "../models/MenuBarDockPosition";

interface Coordinates {
  x: number;
  y: number;
}

const handleDragEnd: (
  event: DragEvent | TouchEvent,
  clientCoordinates: Coordinates
) => {
  dragActive: boolean;
  dockPosition: MenuBarDockPosition;
} | null = (event: DragEvent | TouchEvent, clientCoordinates: Coordinates) => {
  const winHeight = window.innerHeight;
  const winWidth = window.innerWidth;
  let xThreshold = 0;
  let yThreshold = 0;
  const { x, y } = clientCoordinates;

  const value = {
    dragActive: false,
    dockPosition: MenuBarDockPosition.NOT_AVAILABLE,
  };

  if (event instanceof DragEvent) {
    xThreshold = Math.round((x / winWidth) * 100);
    yThreshold = Math.round((y / winHeight) * 100);
  } else if (event instanceof TouchEvent) {
    const touches = event.changedTouches[0];
    if (Boolean(touches)) {
      const { clientX, clientY } = touches;
      xThreshold = Math.round((clientX / winWidth) * 100);
      yThreshold = Math.round((clientY / winHeight) * 100);
    }
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

  if (value.dockPosition !== MenuBarDockPosition.NOT_AVAILABLE) {
    return value;
  } else {
    return null;
  }
};

const handleDragStart: (event: DragEvent | TouchEvent) => void = (
  event: DragEvent | TouchEvent
) => {
  // set a custom ghost image while dragging
  if (event instanceof DragEvent) {
    const img = new Image();
    // img.src =
    //   `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua
    //   3NjYXBlLm9yZ5vuPBoAAAEFSURBVEiJ7dS9SgNBFIbhJymyWqRVay8ihT+FP42NlhZaewlW4lXkMsQuBDsLwUILKwstBAMiYilCMBCLHUHWjTujEZu8MPDN7sx5D5xlmfDf1CreZ9gN+RntkPfQ
    //   HYfgKEhqWMU66jhGP1VWRj8IMrx9ej7EApbwhF5YG6mCYWT+kN3HFN3Ehbz7WEFZLmULd1hD4y8El/Jhll24iciVgldMj7gcQ6XgEbOJRb8V1Av7HuZ/IfhCUXCKlXEKiiziukQcS+UM4BzbPyie
    //   YRBzsIUHzCUKWhK+un1cYSZB0MFhSkcH8n/LDpojzjTknXdwhqkUASzjBC/yARbXALeh8+TiE8A7L6BCi4Gh1q4AAAAASUVORK5CYII=`;
    event.dataTransfer?.setDragImage(img, 0, 0);
  }
};

export default { handleDragEnd, handleDragStart };
