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
   * @private
   */
  CustomDialog.prototype.showBox_ = function() {
    document.body.appendChild(this.element_);
    document.body.classList.add('custom-dialog-noscroll');
    this.element_.classList.add('beforeshow');
    this.updateBoxPosition_();
    this.element_.classList.add('show');
  };

  /**
   * Hide the dialog.
   *
   * @private
   */
  CustomDialog.prototype.closeBox_ = function() {
    this.pendingBt_ = null;
    this.element_.classList.remove('show');
    var cherry = window.cherry;
    cherry.once(this.container_, 'transitionend', function() {
      this.element_.classList.remove('beforeshow');
      document.body.classList.remove('custom-dialog-noscroll');
      this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    }).bind(this);
  };

  /**
   * Hide the dialog.
   */
  CustomDialog.prototype.hide = function() {
    this.closeBox_();
  };

  /**
   * Cancel the dialog.
   */
  CustomDialog.prototype.cancelClicked_ = function() {
    this.closeBox_();
  };

  /**
   * Confirm the dialog.
   */
  CustomDialog.prototype.confirmClicked_ = function() {
    if (this.pendingBt_) {
      this.pendingBt_.click();
    }
    this.closeBox_();
  };

  /**
   * Update the dialog positionning.
   */
  CustomDialog.prototype.updateBoxPosition_ = function() {
    if (this.element_.classList.contains('show') || this.element_.classList.contains('beforeshow')) {
      this.container_.style.marginTop = '-' + (this.container_.offsetHeight / 2) + 'px';
      this.container_.style.marginLeft = '-' + (this.container_.offsetWidth / 2) + 'px';
    }
  };

  /**
   * Hnadles button click event.
   */
  CustomDialog.prototype.onBtClicked_ = function(ev) {
    if (this.pendingBt_ === null) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();

      var bt = ev.target;
      if (bt.getAttribute('disabled') === 'disabled') {
        return;
      }

      this.pendingBt_ = bt;
      this.showBox_();

    } else {
      this.pendingBt_ = null;
    }
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

      this.btSelector_ = this.element_.getAttribute('on-button-click');

      var cherry = window.cherry;
      cherry.on(this.close_, 'customdialog.click', this.cancelClicked_).bind(this);
      cherry.on(this.confirm_, 'customdialog.click', this.confirmClicked_).bind(this);
      cherry.on(this.cancel_, 'customdialog.click', this.cancelClicked_).bind(this);

      cherry.on(window, 'customdialog.optimizedResize', this.updateBoxPosition_).bind(this);

      if (this.btSelector_) {
        this.pendingBt_ = null;
        cherry.on(this.btSelector_, 'customdialog.click', this.onBtClicked_).bind(this).first();
      }

      this.placeholder_ = document.createElement('input');
      this.placeholder_.setAttribute('type', 'hidden');
      this.element_.parentNode.insertBefore(this.placeholder_, this.element_);

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomDialog.prototype.mdlDowngrade_ = function() {

    this.element_.classList.remove('beforeshow');
    this.element_.classList.remove('show');

    var cherry = window.cherry;
    cherry.off(this.close_, 'customdialog.click', this.cancelClicked_);
    cherry.off(this.confirm_, 'customdialog.click', this.confirmClicked_);
    cherry.off(this.cancel_, 'customdialog.click', this.cancelClicked_);
    cherry.off(window, 'customdialog.optimizedResize', this.updateBoxPosition_, this);
    if (this.btSelector_) {
      cherry.off(this.btSelector_, 'customdialog.click', this.onBtClicked_);
    }

    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    this.placeholder_.remove();

    this.container_ = null;
    this.pendingBt_ = null;
    this.close_ = null;
    this.confirm_ = null;
    this.cancel_ = null;
    this.placeholder_ = null;
    this.btSelector_ = null;

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
