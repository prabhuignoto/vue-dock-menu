export const isMobile: () => boolean = () => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/iu.test(navigator.userAgent)) {
    return true;
  } else {
    return false;
  }
}