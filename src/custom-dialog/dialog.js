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
  var CustomDialog = function CustomDialog(element) {
    this.element_ = element;
    this.placeholder_ = null;
    this.container_ = null;
    this.close_ = null;
    this.confirm_ = null;
    this.cancel_ = null;

    // Initialize instance.
    this.init();
  };

  window['CustomDialog'] = CustomDialog;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomDialog.prototype.Constant_ = {
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
  CustomDialog.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Show the dialog.
   */
  CustomDialog.prototype.showBox_ = function() {
    this.element_.classList.add('beforeshow');
    this.container_.style.marginTop = '-' + (this.container_.offsetHeight / 2) + 'px';
    this.container_.style.marginLeft = '-' + (this.container_.offsetWidth / 2) + 'px';
    this.element_.classList.add('show');
  };

  /**
   * Hide the dialog.
   */
  CustomDialog.prototype.closeBox_ = function() {
    this.element_.classList.remove('beforeshow');
    this.element_.classList.remove('show');
  };

  /**
   * Initialize element.
   */
  CustomDialog.prototype.init = function() {
    if (this.element_) {
      this.container_ = this.element_.querySelector('.custom-dialog-container');
      this.close_ = this.element_.querySelector('.custom-dialog-close');
      this.confirm_ = this.element_.querySelector('.custom-dialog-confirm');
      this.cancel_ = this.element_.querySelector('.custom-dialog-cancel');

      this.close_.__fn = this.closeBox_.bind(this);
      this.close_.addEventListener('click', this.close_.__fn);
      this.confirm_.__fn = this.closeBox_.bind(this);
      this.confirm_.addEventListener('click', this.confirm_.__fn);
      this.cancel_.__fn = this.closeBox_.bind(this);
      this.cancel_.addEventListener('click', this.cancel_.__fn);

      this.placeholder_ = document.createElement('input');
      this.placeholder_.setAttribute('type', 'hidden');
      this.element_.parentNode.insertBefore(this.placeholder_, this.element_);
      document.body.appendChild(this.element_);

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomDialog.prototype.mdlDowngrade_ = function() {
    this.close_.removeEventListener('click', this.close_.__fn);
    this.close_.__fn = null;
    this.confirm_.removeEventListener('click', this.confirm_.__fn);
    this.confirm_.__fn = null;
    this.cancel_.removeEventListener('click', this.cancel_.__fn);
    this.cancel_.__fn = null;
    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    this.placeholder_.remove();
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomDialog,
    classAsString: 'CustomDialog',
    cssClass: 'custom-js-dialog'
  });
})();
