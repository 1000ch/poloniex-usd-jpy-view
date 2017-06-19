const {
  qs,
  saveData,
  loadData
} = require('./util');
const {
  DISPLAY_USD_VALUE,
  DISPLAY_JPY_VALUE
} = require('./constant');

async function main() {
  const usd = qs('#display-usd-value');
  const jpy = qs('#display-jpy-value');

  const data = await loadData([
    DISPLAY_USD_VALUE,
    DISPLAY_JPY_VALUE
  ]);

  if (data[DISPLAY_USD_VALUE] === undefined &&
      data[DISPLAY_JPY_VALUE] === undefined) {
    await saveData({
      [DISPLAY_USD_VALUE]: true,
      [DISPLAY_JPY_VALUE]: true
    });

    usd.checked = true;
    jpy.checked = true;
  } else {
    usd.checked = data[DISPLAY_USD_VALUE];
    jpy.checked = data[DISPLAY_JPY_VALUE];
  }

  function onChange() {
    saveData({
      [DISPLAY_USD_VALUE]: usd.checked,
      [DISPLAY_JPY_VALUE]: jpy.checked
    });
  }

  usd.addEventListener('change', onChange);
  jpy.addEventListener('change', onChange);
}

document.addEventListener('DOMContentLoaded', main);
