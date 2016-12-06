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
    if (this.loader_ && this.loader_['CustomLoaderOver']) {
      this.loader_['CustomLoaderOver'].show(this.container_);
    }

    this.element_.classList.add('show');
    document.body.classList.add('custom-rightpanelover-noscroll');
    document.body.appendChild(this.element_);

    var cherry = window.cherry;
    this.iframe_.setAttribute('src', this.href_);
    cherry.on(this.iframe_, 'load', this.frameLoaded_).bind(this);
    this.container_.appendChild(this.iframe_);

    setTimeout(function() {
      this.container_.classList.add('show');
    }.bind(this), 100);
  };

  /**
   * Update the view once frame is ready.
   */
  CustomRightPanelOver.prototype.frameLoaded_ = function() {
    var cherry = window.cherry;
    this.container_.classList.add('loaded');
    cherry.once(this.iframe_.contentWindow, 'beforeunload', this.frameUnloaded_).bind(this);

    if (this.loader_ && this.loader_['CustomLoaderOver']) {
      this.loader_['CustomLoaderOver'].hide(this.container_);
    }

    var doc = this.iframe_.contentDocument || this.iframe_.contentWindow.document;
    if (this.closerBtSelector_) {
      cherry.on(doc.body.querySelectorAll(this.closerBtSelector_),
        'CustomRightPanelOver.click', this.onCloserClicked_).bind(this).first();
    }
    if (this.closeForm_) {
      cherry.on(doc.body.querySelectorAll(this.closeForm_),
        'CustomRightPanelOver.validation-success',
        this.onFormCloserSuccess_).bind(this).first();
    }
  };

  /**
   * Update the view once frame is ready.
   */
  CustomRightPanelOver.prototype.frameUnloaded_ = function() {
    //NOTE: for some unexplicable reasons,
    // this event wont let us off events on anyhing related to
    // contentWindow.
    // lets assume it is cleared automatically :x

    // var cherry = window.cherry;
    // cherry.off(this.iframe_.contentWindow, 'beforeunload', this.frameUnloaded_);
    this.container_.classList.remove('loaded');
    if (this.loader_ && this.loader_['CustomLoaderOver']) {
      this.loader_['CustomLoaderOver'].show(this.container_);
    }

    // var doc = this.iframe_.contentDocument || this.iframe_.contentWindow.document;
    // if (this.closerBtSelector_) {
    //   cherry.off(doc.body.querySelectorAll(this.closerBtSelector_),
    //     'CustomRightPanelOver.click', this.onCloserClicked_).bind(this).first();
    // }
    // if (this.closeForm_) {
    //   cherry.off(doc.body.querySelectorAll(this.closeForm_),
    //     'CustomRightPanelOver.validation-success',
    //     this.onFormCloserSuccess_).bind(this).first();
    // }
  };

  /**
   * Hide the dialog.
   */
  CustomRightPanelOver.prototype.closeBox_ = function() {
    var cherry = window.cherry;
    cherry.off(this.iframe_, 'load', this.frameLoaded_);
    cherry.off(this.iframe_.contentWindow, 'beforeunload', this.frameUnloaded_);

    var doc = this.iframe_.contentDocument || this.iframe_.contentWindow.document;
    if (doc.body) {
      if (this.closerBtSelector_) {
        cherry.off(doc.body.querySelectorAll(this.closerBtSelector_),
          'CustomRightPanelOver.click', this.onCloserClicked_);
      }
      if (this.closeForm_) {
        cherry.off(doc.body.querySelectorAll(this.closeForm_),
          'CustomRightPanelOver.validation-success',
          this.onFormCloserSuccess_);
      }
    }

    document.body.classList.remove('custom-rightpanelover-noscroll');

    if (this.container_.classList.contains('show')) {
      cherry.once(this.container_, 'transitionend', this.cleanup_).bind(this);
      this.container_.classList.add('hide');
    } else {
      this.cleanup_();
    }
  };

  /**
   * cleanup.
   */
  CustomRightPanelOver.prototype.cleanup_ = function() {
    this.element_.classList.remove('show');
    this.container_.classList.remove('loaded');
    this.container_.classList.remove('show');
    this.container_.classList.remove('hide');
    this.iframe_.setAttribute('src', '');
    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
  };

  /**
   * Handles an event to close the box.
   */
  CustomRightPanelOver.prototype.onCloserClicked_ = function() {
    this.closeBox_();
  };

  /**
   * Handles a form success event to close the box.
   */
  CustomRightPanelOver.prototype.onFormCloserSuccess_ = function() {
    setTimeout(function() {
      this.closeBox_();
    }.bind(this), this.closerFormDelay_);
  };

  /**
   * Handles button click event.
   */
  CustomRightPanelOver.prototype.onOpenerClicked_ = function(ev) {
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

      this.loader_ = this.element_.getAttribute('loader-selector');
      this.loader_ = document.querySelector(this.loader_);

      this.frame_ = null;
      this.iframe_ = document.createElement('iframe');
      this.openerBtSelector_ = this.element_.getAttribute('opener-bt');
      this.closerBtSelector_ = this.element_.getAttribute('closer-bt');
      this.closeForm_ = this.element_.getAttribute('closer-form');
      this.closerFormDelay_ = this.element_.getAttribute('closer-form-delay');
      this.closerFormDelay_ = parseInt(this.closerFormDelay_);

      var cherry = window.cherry;

      cherry.on(this.element_, 'CustomRightPanelOver.dblclick', this.onCloserClicked_).bind(this);

      if (this.openerBtSelector_) {
        cherry.on(this.openerBtSelector_,
          'CustomRightPanelOver.click', this.onOpenerClicked_).bind(this).first();
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
  CustomRightPanelOver.prototype.mdlDowngrade_ = function() {

    var cherry = window.cherry;
    // cherry.off(window, 'CustomRightPanelOver.resize', this.updateBoxPosition_);
    if (this.openerBtSelector_) {
      cherry.off(this.openerBtSelector_, 'CustomRightPanelOver.click', this.onOpenerClicked_);
    }
    // if (this.closerBtSelector_) {
    //   cherry.off(this.closerBtSelector_, 'CustomRightPanelOver.click', this.onCloserClicked_);
    // }

    this.placeholder_.parentNode.insertBefore(this.element_, this.placeholder_);
    this.placeholder_.remove();

    this.loader_ = null;
    this.iframe_ = null;
    this.container_ = null;
    this.placeholder_ = null;
    this.openerBtSelector_ = null;

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
