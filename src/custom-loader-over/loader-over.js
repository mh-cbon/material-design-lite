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

    if (this.status_ === 'showing' || this.status_ === 'shown') {
      return ;
    } else if (this.status_ === 'hidding') {
      cherry.once(this.element_, 'CustomLoaderOver.transitionend', function() {
        this.show(targetEl);
      }).bind(this);
    }

    targetEl.CustomLoaderOver = {
      busy: true,
      oldPosition_: targetEl.style.position,
    };

    if (cherry.getStyle(targetEl, 'position') === 'static') {
      targetEl.style.position = 'relative';
    }

    targetEl.appendChild(this.element_);

    this.spinner_.classList.add('is-active');
    this.element_.classList.add('beforeshow');

    this.adjustSize_(targetEl);

    this.element_.classList.add('show');
    this.status_ = 'showing';
    // this timeout should be a transitionend event,
    // but its not reliable, it won t always trigger..
    setTimeout(function() {
      this.status_ = 'shown';
    }.bind(this), 500);
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
    if (this.element_.classList.contains('show')) {
      this.status_ = 'hidding';
      cherry.once(this.element_, 'CustomLoaderOver.transitionend', function() {
        this.cleanup_(targetEl);
      }).bind(this);
      this.element_.classList.remove('show');
    } else {
      cherry.once(this.element_, 'CustomLoaderOver.transitionend', function() {
        this.hide(targetEl);
      }).bind(this);
    }
  };

  /**
   * Hide the loader.
   */
  CustomLoaderOver.prototype.cleanup_ = function(targetEl) {
    this.element_.classList.remove('beforeshow');
    this.spinner_.classList.remove('is-active');
    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    targetEl.style.position = targetEl.CustomLoaderOver.oldPosition_;
    targetEl.CustomLoaderOver.busy = false;
    this.status_ = 'hidden';
  };

  /**
   * Initialize element.
   */
  CustomLoaderOver.prototype.init = function() {
    if (this.element_) {
      this.placeholder_ = document.createElement('input');
      this.placeholder_.setAttribute('type', 'hidden');
      this.element_.parentNode.insertBefore(this.placeholder_, this.element_);
      this.spinner_ = this.element_.querySelector('.custom-spinner');
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomLoaderOver.prototype.mdlDowngrade_ = function() {

    var cherry = window.cherry;
    cherry.off(this.element_, 'CustomLoaderOver.tansitionend');

    this.spinner_.classList.remove('is-active');
    this.spinner_ = null;

    this.element_.classList.remove('beforehide');
    this.element_.classList.remove('beforeshow');
    this.element_.classList.remove('show');

    this.placeholder_.remove();
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
    this.element_.parentNode.insertBefore(this.placeholder_, this.element_);
    this.placeholder_ = null;
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomLoaderOver,
    classAsString: 'CustomLoaderOver',
    cssClass: 'custom-js-loaderover'
  });
})();
