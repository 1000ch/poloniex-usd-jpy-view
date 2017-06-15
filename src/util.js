function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function el(tagName, properties) {
  const element = document.createElement(tagName);

  Object.keys(properties).forEach(name => {
    element[name] = properties[name];
  });

  return element;
}

function format(number, n) {
  const pow = Math.pow(10, n);

  return Math.round(number * pow) / pow;
}

function separate(number) {
  return String(number).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

async function fetchJSON(url) {
  const response = await fetch(url);
  const json = await response.json();

  return json;
}

module.exports = { qs, qsa, el, format, separate, fetchJSON };
