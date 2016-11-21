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
  var CustomSelectChangeUrl = function CustomSelectChangeUrl(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomSelectChangeUrl'] = CustomSelectChangeUrl;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomSelectChangeUrl.prototype.Constant_ = {
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
  CustomSelectChangeUrl.prototype.CssClasses_ = {
  };

  /**
   * Change url.
   */
  CustomSelectChangeUrl.prototype.changeUrl_ = function(ev) {
    var select = ev.target || ev.srcElement;
    var opt = select[select.selectedIndex];
    if (opt && opt.value) {
      window.location.href = opt.value;
    }
  };

  /**
   * Initialize element.
   */
  CustomSelectChangeUrl.prototype.init = function() {
    if (this.element_) {
      this.element_.__changeurl = this.changeUrl_.bind(this);
      this.element_.addEventListener('change', this.element_.__changeurl);
    }
  };

  /**
   * Downgrade element.
   */
  CustomSelectChangeUrl.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('change', this.element_.__changeurl);
    this.element_.__changeurl = null;
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomSelectChangeUrl,
    classAsString: 'CustomSelectChangeUrl',
    cssClass: 'custom-js-select-change-url'
  });
})();
