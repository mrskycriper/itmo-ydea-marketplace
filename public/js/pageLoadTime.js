window.onload = loadTime();

function loadTime() {
  let initialTimestamp = new Date().getTime();
  window.addEventListener('load', function () {
    let endTimestamp = new Date().getTime();
    let footerText = document.getElementById('footer__timer');
    footerText.innerHTML =
      footerText.innerHTML +
      ' | Страница загружена за ' +
      (endTimestamp - initialTimestamp) +
      ' мс';
  });
}
