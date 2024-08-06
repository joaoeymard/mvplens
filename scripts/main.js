let stEstoqueDefault = [];
let stEstoque = new Storage({
  key: "inventory",
  st: localStorage,
});
let stSales = new Storage({
  key: "sales",
  st: localStorage,
});

if (!stEstoque.data) stEstoque.clear();
if (!stSales.data) stSales.clear();

fetch("../../config/estoquedefault.json").then(function (res) {
  res.json().then(function (result) {
    stEstoqueDefault = result;

    if (stEstoque.count() === 0) {
      stEstoque.data = stEstoqueDefault;
    }
  });
});

const sum = (a, b) => numeral(a).add(b).value();
const subtraction = (a, b) => numeral(a).subtract(b).value();

const multiply = (a, b) => numeral(a).multiply(b).value();

const somenteNumeros = (str = "") => str.replace(/[^\d]/g, "");

const displayCurrency = (number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(number);

const displayNumber = (number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
  }).format(number);

function paramsURL() {
  var query = location.search.slice(1);
  var partes = query.split("&");
  var data = {};
  partes.forEach(function (parte) {
    var chaveValor = parte.split("=");
    var chave = chaveValor[0];
    var valor = chaveValor[1];
    data[chave] = valor;
  });

  return data;
}

const displayDate = (dt) => new Intl.DateTimeFormat("pt-BR").format(dt);
const displayTime = (dt) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
const displayDateTime = (dt) =>
  new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(dt);

const fillsSpaces = (str, qt) =>
  (str + " --------------------------------------------").slice(0, qt);

const commandQtItems = ({ itens = [] }) =>
  itens.map((i) => i.quantidade).reduce(sum, 0);

const commandValue = ({ itens = [] }) =>
  itens.map((i) => multiply(i.valor, i.quantidade)).reduce(sum, 0);

const groupBy = (arr, key) =>
  arr.reduce(
    (acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc),
    {}
  );

const capitalize = (word = "") =>
  word.trim().replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());

const getEndereco = (end = "") =>
  axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${end}&key=AIzaSyAqAxSk3oapj5sQIxOwhA8cAMygwzrrC4A`
  );

const getDistancia = async (origem, destino) => {
  const request = {
    origin: new google.maps.LatLng(...origem.split(",")),
    destination: new google.maps.LatLng(...destino.split(",")),
    travelMode: "DRIVING",
  };
  const directionsService = new google.maps.DirectionsService();

  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      console.log(result);
    }
    console.log(result);
  });
  // axios.get(
  //   `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destino}&origins=${origem}&key=AIzaSyAqAxSk3oapj5sQIxOwhA8cAMygwzrrC4A`
  // );
};

/**
 * Função para calcular representação de período
 * return: inteiro / Object
 */
function format_period(periodo, formato, overflow) {
  var step,
    overflow = overflow || false;

  switch (formato) {
    case "milliseconds":
      step = 1;
      overflow = overflow ? 1000 : false;
      break;
    case "seconds":
      step = 1000;
      overflow = overflow ? 60 : false;
      break;
    case "minutes":
      step = 1000 * 60;
      overflow = overflow ? 60 : false;
      break;
    case "hours":
      step = 1000 * 60 * 60;
      overflow = overflow ? 24 : false;
      break;
    case "days":
      step = 1000 * 60 * 60 * 24;
      overflow = overflow ? 365.25 : false;
      break;
    case "years":
      step = 1000 * 60 * 60 * 24 * 365.25;
      overflow = false;
      break;
    default:
      return {
        milliseconds: format_period(periodo, "milliseconds", true),
        seconds: format_period(periodo, "seconds", true),
        minutes: format_period(periodo, "minutes", true),
        hours: format_period(periodo, "hours", true),
        days: format_period(periodo, "days", true),
        years: format_period(periodo, "years"),
      };
  }

  return overflow
    ? ~~(Math.floor(periodo / step) % overflow)
    : Math.floor(periodo / step);
}

const displayPeriod = (period) => {
  const padroniza = (value) => ("00" + value).slice(-2);
  const { hours, minutes, seconds } = format_period(period);

  return `${padroniza(hours)}:${padroniza(minutes)}:${padroniza(seconds)}`;
};

function activateMenu() {
  const page = window.location.pathname.replace(/[a-zA-Z\d.]+$/, "");

  [...document.querySelectorAll("header .navbar .nav-item .nav-link")].forEach(
    (el) => {
      if (el.href.includes(page)) el.classList.add("active");
    }
  );
}

const isOpenNow = (
  day = new Date().getDay(),
  hour = new Date().getHours(),
  minute = new Date().getMinutes()
) =>
  openingHours[day] &&
  openingHours[day][0] <= hour * 60 + minute &&
  hour * 60 + minute < openingHours[day][1];

function startFooterClocktime() {
  const $footerTime = document.querySelector("#footerTime");

  if ($footerTime) {
    $footerTime.innerHTML = `
      <span><b>Horário:</b> ${new Date().toLocaleString("pt-br")}</span>
    `.trim();

    setTimeout(startFooterClocktime, 250);
  }
}
