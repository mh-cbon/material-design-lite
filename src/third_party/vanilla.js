(function(window) {
  'use strict';

  if (!window.cherry || !window['cherry']) {
    window.cherry = {};
    window['cherry'] = {};
  }

  var cherry = window.cherry || window['cherry'];

  /**
   * debounce a function.
   * @param  {!Function} The function to debounce.
   * @param  {!Integer} The delay before the function is invoked.
   * @return {!Function} The debounced function.
   */
  var debounce = function(fn, delay) {
    var timer = null;
    return function() {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
  };
  cherry.debounce = debounce;
  cherry['debounce'] = debounce;

  /**
   * outerHeight polyfill.
   * @param  {!DomElement} The element we want the outer heihgt of.
   * @return {!Integer} The value of the height in pixel.
   */
  var outerHeight = function(el) {
    var s = el.offsetHeight;
    var style = getComputedStyle(el);
    s += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return s;
  };
  cherry.outerHeight = outerHeight;
  cherry['outerHeight'] = outerHeight;

  /**
   * innerHeight polyfill.
   * @param  {!DomElement} The element we want the outer heihgt of.
   * @return {!Integer} The value of the height in pixel.
   */
  var innerHeight = function(el) {
    var s = el.offsetHeight;
    var style = getComputedStyle(el);
    s -= parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    return s;
  };
  cherry.innerHeight = innerHeight;
  cherry['innerHeight'] = innerHeight;

  /**
   * Get child element nodes only.
   * @param  {!DomElement} The parent element.
   * @return {!DomNodes} The list of dom child nodes.
   */
  var childElements = function(el) {
    var ret = [];
    var els = el.childNodes;
    for (var i = 0; i < els.length; i++) {
      if (els[i].nodeType === 1) {
        ret.push(els[i]);
      }
    }
    return ret;
  };
  cherry.childElements = childElements;
  cherry['childElements'] = childElements;

  /**
   * Event delegation.
   * @param  {!string} A selector string or a DomNode onto which attach the event.
   * @param  {!string} An event name to listen to.
   * @param  {!string} A selector of elements to listen the event for.
   * @return {!Function} The function bound to the node, useful to unbind.
   */
  function delegateEvent(elSelector, eventName, selector, fn) {
    var element;
    if (elSelector.querySelector) {
      element = elSelector;
    } else {
      element = document.querySelector(elSelector);
    }

    /**
    * The function handler bound to the event.
    */
    var handler = function(event) {
      var possibleTargets = element.querySelectorAll(selector);
      var target = event.target;

      for (var i = 0, l = possibleTargets.length; i < l; i++) {
        var el = target;
        var p = possibleTargets[i];

        while (el && el !== element) {
          if (el === p) {
            return fn.call(p, event);
          }

          el = el.parentNode;
        }
      }
    };
    element.addEventListener(eventName, handler);
    return handler;
  }
  cherry.delegateEvent = delegateEvent;
  cherry['delegateEvent'] = delegateEvent;

  /**
   * Get all DOM element up the tree that contain a class, ID, or data attribute.
   *
   * @param  {!Node} elem The base element
   * @param  {!string} selector The class, id, data attribute, or tag to look for
   * @return {!Array} Null if no match
   */
  var getParents = function(elem, selector) {

    var parents = [];
    var firstChar;
    if (selector) {
      firstChar = selector.charAt(0);
    }

    // Get matches
    for (true; elem && elem !== document; elem = elem.parentNode) {
      if (selector) {

        // If selector is a class
        if (firstChar === '.') {
          if (elem.classList.contains(selector.substr(1))) {
            parents.push(elem);
          }
        }

        // If selector is an ID
        if (firstChar === '#') {
          if (elem.id === selector.substr(1)) {
            parents.push(elem);
          }
        }

        // If selector is a data attribute
        if (firstChar === '[') {
          if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
            parents.push(elem);
          }
        }

        // If selector is a tag
        if (elem.tagName.toLowerCase() === selector) {
          parents.push(elem);
        }

      } else {
        parents.push(elem);
      }
    }

    // Return parents if any exist
    if (parents.length > 0) {
      return parents;
    }
    return null;
  };
  cherry.getParents = getParents;
  cherry['getParents'] = getParents;

  /**
   * Get all DOM element up the tree that contain a class, ID, or data attribute.
   *
   * @param  {!Node} elem The base element
   * @param  {!string} selector The class, id, data attribute, or tag to look for
   * @return {!Array} Null if no match
   */
  var getParentsUntil = function(elem, parent, selector) {

    var parentType = null;
    var selectorType = null;
    var parents = [];
    if (parent) {
      parentType = parent.charAt(0);
    }
    if (selector) {
      selectorType = selector.charAt(0);
    }

    // Get matches
    for (true; elem && elem !== document; elem = elem.parentNode) {

      // Check if parent has been reached
      if (parent) {

        // If parent is a class
        if (parentType === '.') {
          if (elem.classList.contains(parent.substr(1))) {
            break;
          }
        }

        // If parent is an ID
        if (parentType === '#') {
          if (elem.id === parent.substr(1)) {
            break;
          }
        }

        // If parent is a data attribute
        if (parentType === '[') {
          if (elem.hasAttribute(parent.substr(1, parent.length - 1))) {
            break;
          }
        }

        // If parent is a tag
        if (elem.tagName.toLowerCase() === parent) {
          break;
        }

      }

      if (selector) {

        // If selector is a class
        if (selectorType === '.') {
          if (elem.classList.contains(selector.substr(1))) {
            parents.push(elem);
          }
        }

        // If selector is an ID
        if (selectorType === '#') {
          if (elem.id === selector.substr(1)) {
            parents.push(elem);
          }
        }

        // If selector is a data attribute
        if (selectorType === '[') {
          if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
            parents.push(elem);
          }
        }

        // If selector is a tag
        if (elem.tagName.toLowerCase() === selector) {
          parents.push(elem);
        }

      } else {
        parents.push(elem);
      }

    }

    // Return parents if any exist
    if (parents.length > 0) {
      return parents;
    }

    return null;
  };
  cherry.getParentsUntil = getParentsUntil;
  cherry['getParentsUntil'] = getParentsUntil;

  /**
   * Get image as data url value.
   *
   * @param  {!Node} elem The base element
   * @return {!string} Data url of the image.
   */
  var imgAsDataUrl = function(img) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    ctx.canvas.width  = img.offsetWidth;
    ctx.canvas.height = img.offsetHeight;
    ctx.drawImage(img, 0, 0, img.offsetWidth, img.offsetHeight);
    return canvas.toDataURL('image/png');
  };
  cherry.imgAsDataUrl = imgAsDataUrl;
  cherry['imgAsDataUrl'] = imgAsDataUrl;

})(window);
