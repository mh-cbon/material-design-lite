(function(window) {
  'use strict';

  if (!window.cherry && !window['cherry']) {
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
    /**
    * debounced function.
    */
    var ret = function() {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    };
    /**
    * cancel the debounce.
    */
    ret.cancel = function() {
      clearTimeout(timer);
    };
    return ret;
  };
  cherry.debounce = debounce;
  cherry['debounce'] = debounce;

  /**
   * height.
   * @param  {!DomElement} The element we want the outer heihgt of.
   * @return {!Integer} The value of the height in pixel.
   */
  var height = function(el) {
    var s = el.offsetHeight;
    var style = getComputedStyle(el);
    s += parseInt(style.marginTop) + parseInt(style.marginBottom);
    s -= parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    return s;
  };
  cherry.height = height;
  cherry['height'] = height;

  /**
   * outerHeight .
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
   * innerHeight .
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
  var childElements = function(el, selector) {
    var ret = [];
    var els = [];
    if (!selector) {
      els = el.childNodes;
    } else {
      var hadId = true;
      if (!el.id) {
        hadId = false;
        el.id = 'ID_' + Date.now();
      }
      selector = '#' + el.id + ' ' + selector;
      els = document.querySelectorAll(selector);
      if (!hadId) {
        el.id = '';
      }
    }
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
   * Get index of given node within parent node.
   * @param  {!DomElement} The element.
   * @return {!int} The index.
   */
  var indexElement = function(el) {
    return [].slice.call(el.parentNode.children).indexOf(el);
  };
  cherry.indexElement = indexElement;
  cherry['indexElement'] = indexElement;

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
    // the || is for chromium
    var imgW  = img.offsetWidth || img.width;
    var imgH = img.offsetHeight || img.height;
    ctx.canvas.width  = imgW;
    ctx.canvas.height = imgH;
    ctx.drawImage(img, 0, 0, imgW, imgH);
    return canvas.toDataURL('image/png');
  };
  cherry.imgAsDataUrl = imgAsDataUrl;
  cherry['imgAsDataUrl'] = imgAsDataUrl;

  /**
   * Light templates.
   *
   * @param  {!string} content The template.
   * @param {!Object} data Data of the template.
   * @return {!string} Computed template.
   */
  var lightTemplate = function(content, data) {
    var matches = content.match(/(\{:[a-z]+\})/gi);
    if (matches) {
      matches.forEach(function(m) {
        var p = m.match(/[a-z]+/i)[0];
        content = content.replace(m, data[p]);
      });
    }
    return content;
  };
  cherry.lightTemplate = lightTemplate;
  cherry['lightTemplate'] = lightTemplate;

  /**
   * Replaces current browser url parameters.
   *
   * @param  {!string} content The template.
   * @return {!Object} data Data of the template.
   */
  var replaceUrlParams = function(newUrlParams) {
    var url = new URL(window.location.href);
    var allKeys = url.searchParams.keys();
    for (var key1 = allKeys.next(); key1.done === false; key1 = allKeys.next()) {
      url.searchParams.delete(key1);
    }
    if (newUrlParams.searchParams) {
      var keys = [];
      allKeys = newUrlParams.searchParams.keys();
      for (var key2 = allKeys.next(); key2.done === false; key2 = allKeys.next()) {
        if (keys.indexOf(key2.value) === -1) {
          keys.push(key2.value);
        }
      }
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var values = newUrlParams.searchParams.getAll(key);
        for (var e = 0; e < values.length; e++) {
          url.searchParams.append(key, values[e]);
        }
      }
    } else {
      Object.keys(newUrlParams).forEach(function(key) {
        var values = newUrlParams[key];
        if (values.substr) {
          values = [values];
        }
        values.forEach(function(value) {
          url.searchParams.append(key, value);
        });
      });
    }
    var title = '';
    var el = document.getElementsByTagName('title');
    if (el.length) {
      el = el[0].innerHTML;
    }
    window.history.replaceState({}, title, url.toString());
  };
  cherry.replaceUrlParams = replaceUrlParams;
  cherry['replaceUrlParams'] = replaceUrlParams;

  /**
   * Stringify an url argument.
   *
   * @param {!Object} data Value of the url.
   * @return {!string} Computed template.
   */
  var stringifyUrlArgs = function(data) {
    var ret = '';
    Object.keys(data).forEach(function(k) {
      if (data[k].sort) {
        data[k].forEach(function(v) {
          ret += encodeURIComponent(k) + '=' + encodeURIComponent(v) + '&';
        });
      } else {
        ret += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
      }
    });
    if (ret.length) {
      ret = ret.substr(0, ret.length - 1);
    }
    return ret;
  };
  cherry.stringifyUrlArgs = stringifyUrlArgs;
  cherry['stringifyUrlArgs'] = stringifyUrlArgs;

  /**
   * Get a computed style.
   *
   * @param {!DomNode} element The element to interrogate.
   * @param {!string} prop The name of the css property.
   * @return {!string} the value of the style.
   */
  var getStyle = function(oElm, css3Prop) {
    var strValue = '';

    if (window.getComputedStyle) {
      strValue = getComputedStyle(oElm).getPropertyValue(css3Prop);
    } //IE
    else if (oElm.currentStyle) {
      try {
        strValue = oElm.currentStyle[css3Prop];
      } catch (e) {}
    }

    return strValue;
  };
  cherry.getStyle = getStyle;
  cherry['getStyle'] = getStyle;

  /**
   * Test if the object is a window.
   *
   * @param {!DomNode} w The element to check.
   * @return {!bool} The result.
   */
  var isAWindow = function(w) {
    return w && w.document && w.location && w.alert && w.setInterval;
  };
  cherry.isAWindow = isAWindow;
  cherry['isAWindow'] = isAWindow;

})(window);
