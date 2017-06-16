chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.getAllInWindow(undefined, tabs => {
    for (const tab of tabs) {
      if (tab.url && tab.url.includes('https://poloniex.com/balances')) {
        chrome.tabs.update(tab.id, {
          active: true
        });
        return;
      }
    }

    chrome.tabs.create({
      url: 'https://poloniex.com/balances',
      active: true
    });
  });
});
