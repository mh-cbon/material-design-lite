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
   * Class constructor for Button MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var CustomConfirmButton = function CustomConfirmButton(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };
  window['CustomConfirmButton'] = CustomConfirmButton;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomConfirmButton.prototype.Constant_ = {
    // None for now.
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  CustomConfirmButton.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Handle blur of element.
   *
   * @param {Event} event The event that fired.
   * @private
   */
  CustomConfirmButton.prototype.showConfirm_ = function(ev) {
    var target = this.element_.getAttribute('confirm');
    var confirm = document.querySelector(target);
    if (confirm && confirm.CustomDialog) {
      confirm.CustomDialog.showBox_();
    }
  };

  // Public methods.

  /**
   * Initialize element.
   */
  CustomConfirmButton.prototype.init = function() {
    if (this.element_) {
      this.element_.__fn = this.showConfirm_.bind(this);
      this.element_.addEventListener('click', this.element_.__fn);
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomConfirmButton.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('click', this.element_.__fn);
    this.element_.__fn = null;
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomConfirmButton,
    classAsString: 'CustomConfirmButton',
    cssClass: 'custom-js-confirm-button',
    widget: true
  });
})();
