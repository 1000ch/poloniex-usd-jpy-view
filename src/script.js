const qs = selector => document.querySelector(selector);
const qsa = selector => document.querySelectorAll(selector);

function floatFormat(number, n) {
  const pow = Math.pow(10, n);

  return Math.round(number * pow) / pow;
}

function separate(number) {
  return String(number).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function createElement(tagName, properties) {
  const element = document.createElement(tagName);

  Object.keys(properties).forEach(name => {
    element[name] = properties[name];
  });

  return element;
}

function initializeSummary() {
  const div = createElement('div', { className: 'supressWrap' });
  const span = createElement('span', { id: 'accountValue_yen' });

  div.appendChild(span);
  qs('.supressWrap').appendChild(div);
}

function initializeTable() {
  const header = qs('tr.header');
  const valueHeader = qs('tr.header .value');

  const btcRateHeader = createElement('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'BTC Rate'
  });
  const jpyValueHeader = createElement('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'JPY Value'
  });
  const usdValueHeader = createElement('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'USD Value'
  });

  header.insertBefore(btcRateHeader, valueHeader.nextSibling);
  header.insertBefore(jpyValueHeader, valueHeader.nextSibling);
  header.insertBefore(usdValueHeader, valueHeader.nextSibling);

  const cells = qs('#balancesTableBody').querySelectorAll('tr td.value');

  for (const cell of cells) {
    const btcRateCell = createElement('td', { className: 'btcRate' });
    const yenRateCell = createElement('td', { className: 'yenRate' });
    const usdValueCell = createElement('td', { className: 'usdValue' });

    const tr = cell.parentNode;
    tr.insertBefore(btcRateCell, cell.nextSibling);
    tr.insertBefore(yenRateCell, cell.nextSibling);
    tr.insertBefore(usdValueCell, cell.nextSibling);
  }
}

async function fetchJSON(url) {
  const response = await fetch(url);
  const json = await response.json();

  return json;
}

async function renderAllRates() {
  const rates = await fetchJSON('https://poloniex.com/public?command=returnTicker');

  for (const key of Object.keys(rates)) {
    if (key.match(/BTC_/)) {
      qs(`#balances_${key.replace('BTC_', '')}`).querySelector('.btcRate').textContent = rates[key]['last'];
    } else if (key.match(/USDT_BTC/)) {
      qs('#balances_USDT').querySelector('.btcRate').textContent = floatFormat(1 / Number(rates[key]['last']), 8);
    }
  }
}

async function renderAllValues() {
  const data = await fetchJSON('https://coincheck.com/api/ticker');

  const yenRateValue = data.bid;
  const usdValue = Number(qs('#accountValue_usd').textContent.replace(',', ''));
  const btcValue = Number(qs('#accountValue_btc').textContent);
  const usdRateValue = Number(usdValue / btcValue);

  qs('#accountValue_yen').textContent = ` / ¥${separate(floatFormat(Number(btcValue * yenRateValue), 0))} YEN`;

  const trList = qsa('#balancesTableBody tr');
  for (const tr of trList) {
    const coin = tr.querySelector('.coin');
    const balance = tr.querySelector('.balance');
    const btcRate = tr.querySelector('.btcRate');
    const value = tr.querySelector('.value');
    const usdValue = tr.querySelector('.usdValue');
    const yenRate = tr.querySelector('.yenRate');

    if (coin === null) {
      continue;
    }

    if (coin.textContent === 'BTC') {
      btcRate.textContent = 1;
    }

    const balanceValue = Number(balance.textContent);
    const btcRateValue = Number(btcRate.textContent);
    const btcValue = balanceValue * btcRateValue;

    value.textContent = floatFormat(btcValue, 8);
    usdValue.textContent = `$${floatFormat(btcValue * usdRateValue, 4)}`
    yenRate.textContent = `¥${separate(floatFormat(btcValue * yenRateValue, 0))}`;
  }
}

async function main() {
  initializeSummary();
  initializeTable();

  setInterval(() => {
    renderAllRates();
  }, 5000);

  setInterval(() => {
    renderAllValues();
  }, 5000);
}

document.addEventListener('DOMContentLoaded', main);
