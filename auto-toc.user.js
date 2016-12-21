// ==UserScript==
//
// @name        Auto TOC
// @namespace   letientai299
// @author      Le Tien Tai
// @description Add a Table of Content on any site. Toggleable with Alt+q short cut.
// @include     https://*/*
// @include     http://*/*
// @include     file://*
// @require     https://code.jquery.com/jquery-3.1.1.min.js
// @require     https://raw.githubusercontent.com/jgallen23/toc/master/dist/toc.min.js
// @grant       GM_addStyle
// @run-at      document-idle
// @noframes
// @version     0.0.3
// @updateURL   https://raw.githubusercontent.com/letientai299/userscript-auto-toc/master/auto-toc.user.js
// @downloadURL https://raw.githubusercontent.com/letientai299/userscript-auto-toc/master/auto-toc.user.js
// @license     MIT License
//
// ==/UserScript==

/**
 * ID of the TOC element. Used for css class prefix also.
 */
let tocId = "minetoc"

let getToc = function () {
  return $(`#${tocId}`);
}

let includedSitePatterns = [
  /.*.wiki.*\/.*/,
  /.*medium.com\/.*/,
  /.*.github.com\/.*/,
  /file:\/\/\/.*/
];

/**
 * Test whehter the website location is excluded by default (TOC won't displaying).
 */
let isOnIncludedSites = function (location) {
  return includedSitePatterns.some((pattern) => {
    return pattern.test(location)
  })
};

/**
 * Keep track of TOC displaying status
 */
var isTocDisplaying = true;
let bodyElement = $("body");
let tocPadding = 10;
let bodyOriginalMargin = parseInt(bodyElement.css("margin-left"), 10);

let updateBodyMargin = function () {
  let tocWidth = parseInt(getToc().css("width"), 10);

  let bodyNewMargin = isTocDisplaying ?
    tocWidth + bodyOriginalMargin + tocPadding :
    bodyOriginalMargin;
  bodyElement.css("margin-left", `${bodyNewMargin}px`);
}

let setTocDisplayMode = function (isDisplay) {
  let cssDisplay = isDisplay ? "block" : "none";
  getToc().css("display", cssDisplay);
  // This trick make the updateBodyMargin be executed right after browser
  // completely render the element with all css.
  // See http://stackoverflow.com/a/21043017/3869533
  setTimeout(updateBodyMargin, 0)
}

let toggleToc = function () {
  isTocDisplaying = !isTocDisplaying;
  setTocDisplayMode(isTocDisplaying);
}

/**
 * Build the TOC using jquery and toc plugin.
 */
bodyElement.append(`<div id=\"${tocId}\"></div>`);
let tocConfig = {
  'selectors': 'h1,h2,h3,h4,h5', //elements to use as headings
}

getToc().toc(tocConfig);

if (isOnIncludedSites(window.location.href)) {
  isTocDisplaying = true;
  setTocDisplayMode(isTocDisplaying);
}

/**
 * Add shortcut to toggle the TOC
 */
document.addEventListener('keydown', function (e) {

  // Alt+q
  if (e.keyCode == 81 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
    toggleToc();
  }
}, false);

GM_addStyle(`

#${tocId} {
  display: none;
  float: left;
  overflow-y: auto;
  resize: horizontal;
  top: 0px;
  left: 0px;
  height: 100%;
  position: fixed;
  background: #222;
  box-shadow: inset -5px 0 5px 0px #000;
  width: 300px;
  max-width: 600px;
  padding-top: 80px;
  color: #fff !important;
  z-index: 99999;
}

#${tocId} ul {
  margin: 0;
  padding: 0;
}

#${tocId} li {
  padding: 5px 10px;
}

#${tocId} a {
  color: #fff;
  text-decoration: none;
  display: block;
}

#${tocId} .toc-h1 {
  font-size: 1.5rem;
}

#${tocId} .toc-h2 {
  padding-left: 10px;
  font-size: 1.3rem;
  opacity: 0.9;
}

#${tocId} .toc-h3 {
  padding-left: 20px;
  font-size: 1.1rem;
  opacity: 0.8;
}

#${tocId} .toc-h4 {
  padding-left: 30px;
  font-size: 0.9rem;
  opacity: 0.7;
}

#${tocId} .toc-h5 {
  padding-left: 40px;
  opacity: 0.6;
}

#${tocId} .toc-active {
  background: #336699;
  box-shadow: inset -5px 0px 10px -5px #000;
}
`);
