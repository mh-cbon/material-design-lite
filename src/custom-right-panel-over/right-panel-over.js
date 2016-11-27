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
  var CustomRightPanelOver = function CustomRightPanelOver(element) {
    this.element_ = element;
    this.placeholder_ = null;
    this.container_ = null;
    this.close_ = null;
    this.confirm_ = null;
    this.cancel_ = null;

    // Initialize instance.
    this.init();
  };

  window['CustomRightPanelOver'] = CustomRightPanelOver;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomRightPanelOver.prototype.Constant_ = {
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
  CustomRightPanelOver.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Show the dialog.
   */
  CustomRightPanelOver.prototype.showBox_ = function() {
    var cherry = window.cherry;
    this.element_.classList.add('show');
    document.body.classList.add('custom-rightpanelover-noscroll');
    cherry.once(this.container_, 'transitionend', this.addFrame_).bind(this);
    setTimeout(function() {
      this.loader_.classList.add('show');
      this.overlayLoader_.classList.add('show');
      this.overlay_.classList.add('show');
      this.container_.classList.add('show');
      this.spinner_.classList.add('is-active');
    }.bind(this), 100);
  };

  /**
   * Add iframe.
   */
  CustomRightPanelOver.prototype.addFrame_ = function() {
    var cherry = window.cherry;
    this.iframe_.setAttribute('src', this.href_);
    cherry.once(this.iframe_, 'load', this.frameLoaded_).bind(this);
    this.container_.appendChild(this.iframe_);
  };

  /**
   * Update the view once frame is ready.
   */
  CustomRightPanelOver.prototype.frameLoaded_ = function() {
    this.container_.classList.add('loaded');
    this.loader_.classList.remove('show');
    this.overlayLoader_.classList.remove('show');
    this.spinner_.classList.remove('is-active');
  };

  /**
   * Hide the dialog.
   */
  CustomRightPanelOver.prototype.closeBox_ = function() {
    var cherry = window.cherry;
    cherry.off(this.iframe_, 'load', this.frameLoaded_);
    cherry.once(this.overlay_, 'transitionend', function() {
      document.body.classList.remove('custom-rightpanelover-noscroll');
      this.element_.classList.remove('show');
      this.container_.classList.remove('loaded');
      this.container_.classList.remove('show');
      this.container_.classList.remove('hide');
      this.iframe_.setAttribute('src', '');
    }).bind(this);
    this.container_.classList.add('hide');
    this.overlay_.classList.remove('show');
  };

  /**
   * Handles bg overlay double click event.
   */
  CustomRightPanelOver.prototype.onOverLayDblClicked_ = function() {
    this.frameLoaded_();
    this.closeBox_();
  };

  /**
   * Handles button click event.
   */
  CustomRightPanelOver.prototype.onBtClicked_ = function(ev) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    ev.stopPropagation();

    var bt = ev.target;
    if (bt.getAttribute('disabled') === 'disabled') {
      return;
    }

    this.href_ = bt.getAttribute('href');

    this.showBox_();
  };

  /**
   * Initialize element.
   */
  CustomRightPanelOver.prototype.init = function() {
    if (this.element_) {
      this.container_ = this.element_.querySelector('.custom-rightpanelover-container');
      this.overlay_ = this.element_.querySelector('.custom-rightpanelover-overlay');
      this.overlayLoader_ = this.element_.querySelector('.custom-rightpanelover-overlay-loader');
      this.loader_ = this.element_.querySelector('.custom-rightpanelover-loader');
      this.spinner_ = this.loader_.querySelector('.mdl-spinner');

      this.frame_ = null;
      this.iframe_ = document.createElement('iframe');
      this.btSelector_ = this.element_.getAttribute('on-button-click');

      var cherry = window.cherry;

      // cherry.on(window, 'CustomRightPanelOver.resize', this.updateBoxPosition_).bind(this).debounce(100);
      cherry.on(this.overlay_, 'CustomRightPanelOver.dblclick', this.onOverLayDblClicked_).bind(this);

      if (this.btSelector_) {
        cherry.on(this.btSelector_, 'CustomRightPanelOver.click', this.onBtClicked_).bind(this).first();
      }

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
  CustomRightPanelOver.prototype.mdlDowngrade_ = function() {

    var cherry = window.cherry;
    // cherry.off(window, 'CustomRightPanelOver.resize', this.updateBoxPosition_);
    if (this.btSelector_) {
      cherry.off(this.btSelector_, 'CustomRightPanelOver.click', this.onBtClicked_);
    }

    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    this.placeholder_.remove();

    this.iframe_ = null;
    this.container_ = null;
    this.placeholder_ = null;
    this.btSelector_ = null;

    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomRightPanelOver,
    classAsString: 'CustomRightPanelOver',
    cssClass: 'custom-js-rightpanelover'
  });
})();
