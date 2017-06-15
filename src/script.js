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
    const btcRateCell = util.el('td', { className: 'btcRate' });
    const yenRateCell = util.el('td', { className: 'yenRate' });
    const usdValueCell = util.el('td', { className: 'usdValue' });

    const tr = cell.parentNode;
    tr.insertBefore(btcRateCell, cell.nextSibling);
    tr.insertBefore(yenRateCell, cell.nextSibling);
    tr.insertBefore(usdValueCell, cell.nextSibling);
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

    value.textContent = util.format(btcValue, 8);
    usdValue.textContent = `$${util.format(btcValue * usdRateValue, 4)}`
    yenRate.textContent = `¥${util.separate(util.format(btcValue * yenRateValue, 0))}`;
  }
}

async function loopRender() {
  await delay(5000);
  await renderAllRates();
  await renderAllValues();

  return loopRender();
}

async function main() {
  initializeSummary();
  initializeTable();
  loopRender();
}

document.addEventListener('DOMContentLoaded', main);
