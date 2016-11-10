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
   *
   * @constructor
   * @param {Element} element The element that will be upgraded.
   */
  var CustomTinymce = function CustomTinymce(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomTinymce'] = CustomTinymce;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomTinymce.prototype.Constant_ = {
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
  CustomTinymce.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
  };

  /**
   * Initialize element.
   */
  CustomTinymce.prototype.init = function() {
    if (this.element_) {
      var element_ = this.element_;

      window.tinymce.init({
        target: element_.querySelector('textarea'),
      });

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomTinymce.prototype.mdlDowngrade_ = function() {
    window.tinymce.remove(this.element_.querySelector('textarea'));
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomTinymce,
    classAsString: 'CustomTinymce',
    cssClass: 'custom-js-tinymce'
  });
})();
