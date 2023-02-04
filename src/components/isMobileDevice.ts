export default function() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/iu.test(navigator.userAgent)) {
    return true;
  }
}