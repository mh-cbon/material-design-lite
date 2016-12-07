/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  /**
   * Class constructor for Data Table Card MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  var CustomLoaderOver = function CustomLoaderOver(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomLoaderOver'] = CustomLoaderOver;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomLoaderOver.prototype.Constant_ = {
    // None at the moment.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  CustomLoaderOver.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Show the loader.
   */
  CustomLoaderOver.prototype.show = function(targetEl) {

    var cherry = window.cherry;
    clearTimeout(this.pendingHide_);
    cherry.off(this.element_, 'CustomLoaderOver.transitionend');

    targetEl.CustomLoaderOver = {
      oldPosition_: targetEl.style.position,
    };

    if (!this.element_.classList.contains('show')) {
      cherry.trigger(this.spinner_, 'enable');
    }
    if (this.element_.parentNode !== targetEl) {
      targetEl.appendChild(this.element_);
      this.adjustSize_(targetEl);
      if (cherry.getStyle(targetEl, 'position') === 'static') {
        targetEl.style.position = 'relative';
      }
    }
    this.element_.classList.add('show');
  };

  /**
   * Adjust size and position.
   */
  CustomLoaderOver.prototype.adjustSize_ = function(targetEl) {

    var b = this.spinner_.getBoundingClientRect();
    this.spinner_.style.marginTop = '-' + (b.height / 2) + 'px';
    this.spinner_.style.marginLeft = '-' + (b.width / 2) + 'px';

    this.element_.style.padding = 0;
    this.element_.style.top = 0;
    this.element_.style.left = 0;

    if (targetEl.style.borderTopWidth) {
      var t = targetEl.style.borderTopWidth;
      t = parseInt(t);
      this.element_.style.top = '-' + t + 'px';
      this.element_.style.paddingTop = t + 'px';
    }

    if (targetEl.style.borderLeftWidth) {
      var l = targetEl.style.borderLeftWidth;
      l = parseInt(l);
      this.element_.style.left = '-' + l + 'px';
      this.element_.style.paddingLeft = l + 'px';
    }

    if (targetEl.style.borderRightWidth) {
      var r = targetEl.style.borderRightWidth;
      r = parseInt(r);
      this.element_.style.paddingRight = r + 'px';
    }

    if (targetEl.style.borderBottomWidth) {
      var b1 = targetEl.style.borderBottomWidth;
      b1 = parseInt(b1);
      this.element_.style.paddingBottom = b1 + 'px';
    }
  };

  /**
   * Hide the loader.
   */
  CustomLoaderOver.prototype.hide = function(targetEl) {
    var cherry = window.cherry;
    clearTimeout(this.pendingHide_);
    this.pendingHide_ = setTimeout(function() {
      cherry.once(this.element_, 'CustomLoaderOver.transitionend', function() {
        cherry.trigger(this.spinner_, 'disable');
        this.placeholder_.appendChild(this.element_);
        targetEl.style.position = targetEl.CustomLoaderOver.oldPosition_;
      }).bind(this);
      this.element_.classList.remove('show');
    }.bind(this), 100);
    // this timeout is required to ensure transitionend does trigger
    // when show/hide are called consecutively
  };

  /**
   * Handles enable event.
   */
  CustomLoaderOver.prototype.enable = function(ev) {
    if (ev.loaderTarget) {
      this.show(ev.loaderTarget);
    }
  };

  /**
   * Handles disable event.
   */
  CustomLoaderOver.prototype.disable = function(ev) {
    if (ev.loaderTarget) {
      this.hide(ev.loaderTarget);
    }
  };

  /**
   * Initialize element.
   */
  CustomLoaderOver.prototype.init = function() {
    if (this.element_) {
      this.placeholder_ = document.createElement('div');
      this.placeholder_.classList.add('custom-loaderover-container');
      this.element_.parentNode.insertBefore(this.placeholder_, this.element_);

      this.placeholder_.appendChild(this.element_);

      this.spinner_ = this.element_.querySelector('.custom-spinner');

      var cherry = window.cherry;
      cherry.on(this.element_, 'CustomLoaderOver.enable', this.enable).bind(this);
      cherry.on(this.element_, 'CustomLoaderOver.disable', this.disable).bind(this);

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomLoaderOver.prototype.mdlDowngrade_ = function() {

    var cherry = window.cherry;
    cherry.off(this.element_, 'CustomLoaderOver.enable', this.enable);
    cherry.off(this.element_, 'CustomLoaderOver.disable', this.disable);

    cherry.off(this.element_, 'CustomLoaderOver.tansitionend');
    clearTimeout(this.pendingHide_);

    cherry.trigger(this.spinner_, 'disable');
    this.spinner_ = null;

    this.element_.classList.remove('show');

    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    this.placeholder_.remove();
    this.placeholder_ = null;

    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomLoaderOver,
    classAsString: 'CustomLoaderOver',
    cssClass: 'custom-js-loaderover'
  });
})();
