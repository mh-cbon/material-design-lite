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
  var SnackbarNotify = function SnackbarNotify(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['SnackbarNotify'] = SnackbarNotify;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  SnackbarNotify.prototype.Constant_ = {
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
  SnackbarNotify.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Handles notify events.
   *
   * @private
   */
  SnackbarNotify.prototype.onNotify_ = function(ev) {
    var notification = ev.notification;
    var handler = null;
    if (notification.actionHandler === 'close') {
      handler = function() {
        if (this.element_.MaterialSnackbar) {
          this.element_.MaterialSnackbar.cleanup_();
        }
      }.bind(this);
    } else if (notification.actionHandler) {
      handler = notification.actionHandler;
    }
    var data = {
      message: notification.message,
      timeout: notification.timeout || 2000,
      addClass: null,
      actionHandler: handler,
      actionText: notification.actionText || 'Ok'
    };
    if (notification.notificationType) {
      data.addClass = 'custom-snackbar-notify-' + notification.notificationType;
    }
    if (this.element_.MaterialSnackbar && data.message) {
      this.element_.MaterialSnackbar.showSnackbar(data);
    }
  };

  /**
   * Initialize element.
   */
  SnackbarNotify.prototype.init = function() {
    if (this.element_) {
      var cherry = window.cherry;
      cherry.on(this.element_, 'SnackbarNotify.notify', this.onNotify_).bind(this).first();
    }
  };

  /**
   * Downgrade element.
   */
  SnackbarNotify.prototype.mdlDowngrade_ = function() {
    var cherry = window.cherry;

    cherry.off(this.element_, 'SnackbarNotify.notify', this.onNotify_);

    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: SnackbarNotify,
    classAsString: 'SnackbarNotify',
    cssClass: 'custom-js-snackbar-notify'
  });
})();
