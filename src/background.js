const { saveData } = require('./util');
const {
  DISPLAY_USD_VALUE,
  DISPLAY_JPY_VALUE
} = require('./constant');

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.getAllInWindow(undefined, tabs => {
    for (const tab of tabs) {
      if (!tab.url) {
        continue;
      }

      if (!tab.url.includes('https://poloniex.com/balances')) {
        continue;
      }

      chrome.tabs.update(tab.id, {
        active: true
      });
      return;
    }

    chrome.tabs.create({
      url: 'https://poloniex.com/balances',
      active: true
    });
  });
});

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    saveData({
      [DISPLAY_USD_VALUE]: true,
      [DISPLAY_JPY_VALUE]: true
    });
  }
});
