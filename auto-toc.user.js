// ==UserScript==
// @name    Auto TOC
// @namespace   mine
// @include   https://*/*
// @include   http://*/*
// @include   file://*
// @version   1
// @require   https://code.jquery.com/jquery-3.1.1.min.js
// @require   https://raw.githubusercontent.com/jgallen23/toc/master/dist/toc.min.js
// @grant     GM_addStyle
// @noframes
// ==/UserScript==

/**
 * ID of the TOC element.
 */
let tocId = "minetoc"

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

let setTocDisplayMode = function (isDisplay) {
  let cssDisplay = isDisplay ? "block" : "none";
  $(`#${tocId}`).css("display", cssDisplay);
}

let toggleToc = function () {
  isTocDisplaying = !isTocDisplaying;
  setTocDisplayMode(isTocDisplaying);
}

/**
 * Build the TOC using jquery and toc plugin.
 */
$("body").append(`<div id=\"${tocId}\"></div>`);
$(`#${tocId}`).toc({
  'selectors': 'h1,h2,h3,h4,h5', //elements to use as headings
});

if (isOnIncludedSites(window.location)) {
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
  overflow: auto;
  resize: horizontal;
  top: 0px;
  left: 0px;
  height: 100%;
  position: fixed;
  background: #222;
  box-shadow: inset -5px 0 5px 0px #000;
  width: 200px;
  max-width: 200px;
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
