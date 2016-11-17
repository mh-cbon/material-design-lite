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
  var CustomExpander = function CustomExpander(element) {
    this.element_ = element;
    this.bt_ = null;
    this.container_ = null;

    // Initialize instance.
    this.init();
  };

  window['CustomExpander'] = CustomExpander;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomExpander.prototype.Constant_ = {
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
  CustomExpander.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
    IS_EXPANDED: 'is-expanded',
  };

  /**
   * Toggle the dialog display.
   */
  CustomExpander.prototype.toggleBox_ = function() {
    if (this.element_.classList.contains(this.CssClasses_.IS_EXPANDED)) {
      this.closeBox_();
    } else {
      this.showBox_();
    }
  };

  /**
   * Show the dialog.
   */
  CustomExpander.prototype.showBox_ = function() {
    var h = 0;
    var cherry = window.cherry;
    var els = cherry.childElements(this.container_);
    for (var i = 0; i < els.length; i++) {
      h += cherry.outerHeight(els[i]);
    }
    var that = this;
    window.Velocity(this.container_, {
      height: h,
    }, {
      /**
      * complete.
      */
      complete: function() {
        that.element_.classList.add(that.CssClasses_.IS_EXPANDED);
        that.element_.style.height = 'auto';
      }
    });
  };

  /**
   * Hide the dialog.
   */
  CustomExpander.prototype.closeBox_ = function() {
    var that = this;
    window.Velocity(this.container_, {
      height: 0,
    }, {
      /**
      * complete.
      */
      complete: function() {
        that.element_.classList.remove(that.CssClasses_.IS_EXPANDED);
      }
    });
  };

  /**
   * Initialize element.
   */
  CustomExpander.prototype.init = function() {
    if (this.element_) {
      this.container_ = this.element_.querySelector('.custom-expander-container');
      this.bt_ = this.element_.querySelector('.custom-expander-bt');

      this.bt_.__fn = this.toggleBox_.bind(this);
      this.bt_.addEventListener('click', this.bt_.__fn);
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomExpander.prototype.mdlDowngrade_ = function() {
    this.bt_.removeEventListener('click', this.bt_.__fn);
    this.bt_.__fn = null;
    this.element_.classList.remove(this.CssClasses_.IS_EXPANDED);
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomExpander,
    classAsString: 'CustomExpander',
    cssClass: 'custom-js-expander'
  });
})();
