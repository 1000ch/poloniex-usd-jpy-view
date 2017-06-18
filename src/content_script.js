const delay = require('delay');
const {
  qs,
  qsa,
  el,
  insertAfter,
  format,
  separate,
  fetchJSON,
} = require('./util');

function initializeSummary() {
  const div = el('div', { className: 'supressWrap' });
  const span = el('span', { id: 'accountValue_yen' });

  div.appendChild(span);
  qs('.supressWrap').appendChild(div);
}

function initializeTable() {
  const header = qs('tr.header .value');
  const cells = qsa('tr td.value', qs('#balancesTableBody'));

  insertAfter(el('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'BTC Rate'
  }), header);

  insertAfter(el('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'JPY Value'
  }), header);

  insertAfter(el('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'USD Value'
  }), header);

  for (const cell of cells) {
    insertAfter(el('td', { className: 'btcRate' }), cell);
    insertAfter(el('td', { className: 'yenRate' }), cell);
    insertAfter(el('td', { className: 'usdValue' }), cell);
  }
}

async function renderAllRates() {
  const rates = await fetchJSON('https://poloniex.com/public?command=returnTicker');
  const coins = Object.keys(rates);

  for (const coin of coins) {
    if (coin.match(/BTC_/)) {
      qs('.btcRate', qs(`#balances_${coin.replace('BTC_', '')}`)).textContent = rates[coin]['last'];
    } else if (coin.match(/USDT_BTC/)) {
      qs('.btcRate', qs('#balances_USDT')).textContent = format(1 / Number(rates[coin]['last']), 8);
    }
  }
}

async function renderAllValues() {
  const data = await fetchJSON('https://coincheck.com/api/ticker');

  const yenRateValue = data.bid;
  const usdValue = Number(qs('#accountValue_usd').textContent.replace(',', ''));
  const btcValue = Number(qs('#accountValue_btc').textContent);
  const usdRateValue = Number(usdValue / btcValue);

  qs('#accountValue_yen').textContent = ` / ¥${separate(format(Number(btcValue * yenRateValue), 0))} YEN`;

  const trList = qsa('#balancesTableBody tr');
  for (const tr of trList) {
    const coin = qs('.coin', tr);

    if (coin === null) {
      continue;
    }

    if (coin.textContent === 'BTC') {
      qs('.btcRate', tr).textContent = 1;
    }

    const balanceValue = Number(qs('.balance', tr).textContent);
    const btcRateValue = Number(qs('.btcRate', tr).textContent);
    const btcValue = balanceValue * btcRateValue;

    qs('.value', tr).textContent = format(btcValue, 8);
    qs('.usdValue', tr).textContent = `$${format(btcValue * usdRateValue, 4)}`;
    qs('.yenRate', tr).textContent = `¥${separate(format(btcValue * yenRateValue, 0))}`;
  }
}

async function loopRender() {
  try {
    await delay(5000);
    await renderAllRates();
    await renderAllValues();
  } finally {
    return loopRender();
  }
}

async function main() {
  initializeSummary();
  initializeTable();
  loopRender();
}

document.addEventListener('DOMContentLoaded', main);
