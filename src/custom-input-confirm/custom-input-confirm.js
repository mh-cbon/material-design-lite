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
  var CustomInputConfirm = function CustomInputConfirm(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomInputConfirm'] = CustomInputConfirm;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomInputConfirm.prototype.Constant_ = {
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
  CustomInputConfirm.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
  };

  /**
   * Handle on change event of underlyig textfield.
   */
  CustomInputConfirm.prototype.onChange_ = function() {
    this.element_.classList.remove('is-invalid');
  };

  /**
   * Initialize element.
   */
  CustomInputConfirm.prototype.init = function() {
    if (this.element_) {
      var cherry = window.cherry;
      cherry.on(this.element_, 'CustomInputConfirm.keypress', this.onChange_).bind(this).debounce(10);
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomInputConfirm.prototype.mdlDowngrade_ = function() {
    var cherry = window.cherry;
    cherry.off(this.element_, 'CustomInputConfirm.keypress', this.onChange_);
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomInputConfirm,
    classAsString: 'CustomInputConfirm',
    cssClass: 'custom-js-input-confirm'
  });
})();
