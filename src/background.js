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
      break;
    }

    chrome.tabs.create({
      url: 'https://poloniex.com/balances',
      active: true
    });
  });
});
