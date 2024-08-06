(async function (win) {
  "use strict";

  async function initHeader() {
    const $navbar = document.querySelector("header");
    const strHtmlNavbar = await (
      await fetch("../../components/header.html")
    ).text();

    $navbar.innerHTML = strHtmlNavbar;
  }

  async function initFooter() {
    const $footer = document.querySelector("footer");
    const strHtmlFooter = await (
      await fetch("../../components/footer.html")
    ).text();

    $footer.innerHTML = strHtmlFooter;
  }

  await initHeader();
  await initFooter();

  // armazena a lista de horarios na memoria
  // window.openingHours = await (
  //   await fetch("../../config/horarios.json")
  // ).json();

  fetch("../../config/horarios.json").then(function (res) {
    res.json().then(function (result) {
      win.openingHours = result;

      // Inicia relógio no rodapé da página
      startFooterClocktime();
    });
  });

  // Ativa o menu no navbar que estiver aberto na página
  activateMenu();
})(window);
