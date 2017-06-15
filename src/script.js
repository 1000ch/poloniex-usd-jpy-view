const delay = require('delay');
const util = require('./util');

function initializeSummary() {
  const div = util.el('div', { className: 'supressWrap' });
  const span = util.el('span', { id: 'accountValue_yen' });

  div.appendChild(span);
  util.qs('.supressWrap').appendChild(div);
}

function initializeTable() {
  const header = util.qs('tr.header');
  const valueHeader = util.qs('tr.header .value');

  const btcRateHeader = util.el('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'BTC Rate'
  });
  const jpyValueHeader = util.el('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'JPY Value'
  });
  const usdValueHeader = util.el('th', {
    className: 'name sortable tablesorter-header tablesorter-headerUnSorted',
    textContent: 'USD Value'
  });

  header.insertBefore(btcRateHeader, valueHeader.nextSibling);
  header.insertBefore(jpyValueHeader, valueHeader.nextSibling);
  header.insertBefore(usdValueHeader, valueHeader.nextSibling);

  const cells = util.qs('#balancesTableBody').querySelectorAll('tr td.value');

  for (const cell of cells) {
    const tr = cell.parentNode;
    tr.insertBefore(util.el('td', { className: 'btcRate' }), cell.nextSibling);
    tr.insertBefore(util.el('td', { className: 'yenRate' }), cell.nextSibling);
    tr.insertBefore(util.el('td', { className: 'usdValue' }), cell.nextSibling);
  }
}

async function renderAllRates() {
  const rates = await util.fetchJSON('https://poloniex.com/public?command=returnTicker');

  for (const key of Object.keys(rates)) {
    if (key.match(/BTC_/)) {
      util.qs(`#balances_${key.replace('BTC_', '')}`).querySelector('.btcRate').textContent = rates[key]['last'];
    } else if (key.match(/USDT_BTC/)) {
      util.qs('#balances_USDT').querySelector('.btcRate').textContent = util.format(1 / Number(rates[key]['last']), 8);
    }
  }
}

async function renderAllValues() {
  const data = await util.fetchJSON('https://coincheck.com/api/ticker');

  const yenRateValue = data.bid;
  const usdValue = Number(util.qs('#accountValue_usd').textContent.replace(',', ''));
  const btcValue = Number(util.qs('#accountValue_btc').textContent);
  const usdRateValue = Number(usdValue / btcValue);

  util.qs('#accountValue_yen').textContent = ` / ¥${util.separate(util.format(Number(btcValue * yenRateValue), 0))} YEN`;

  const trList = util.qsa('#balancesTableBody tr');
  for (const tr of trList) {
    const coin = tr.querySelector('.coin');

    if (coin === null) {
      continue;
    }

    if (coin.textContent === 'BTC') {
      tr.querySelector('.btcRate').textContent = 1;
    }

    const balanceValue = Number(tr.querySelector('.balance').textContent);
    const btcRateValue = Number(tr.querySelector('.btcRate').textContent);
    const btcValue = balanceValue * btcRateValue;

    tr.querySelector('.value').textContent = util.format(btcValue, 8);
    tr.querySelector('.usdValue').textContent = `$${util.format(btcValue * usdRateValue, 4)}`;
    tr.querySelector('.yenRate').textContent = `¥${util.separate(util.format(btcValue * yenRateValue, 0))}`;
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
