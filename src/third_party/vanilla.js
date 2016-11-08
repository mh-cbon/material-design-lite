(function() {
  'use strict';
  /**
   * outerHeight polyfill.
   * @param  {!Function} callback the callback function.
   */
  var outerHeight = function(el) {
    var s = el.offsetHeight;
    var style = getComputedStyle(el);
    s += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return s;
  };
  window.outerHeight = outerHeight;
  window['outerHeight'] = outerHeight;
})();
