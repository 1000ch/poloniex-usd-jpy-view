function qs(selector, element = document) {
  return element.querySelector(selector);
}

function qsa(selector, element = document) {
  return element.querySelectorAll(selector);
}

function el(tagName, properties) {
  const element = document.createElement(tagName);

  Object.keys(properties).forEach(name => {
    element[name] = properties[name];
  });

  return element;
}

function after(element, target) {
  if (!element || !target) {
    return;
  }

  const {
    parentNode,
    nextSibling
  } = target;

  parentNode.insertBefore(element, nextSibling);
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

module.exports = {
  qs,
  qsa,
  el,
  after,
  format,
  separate,
  fetchJSON
};
