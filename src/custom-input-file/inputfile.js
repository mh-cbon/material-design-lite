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
  var CustomInputFile = function CustomInputFile(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomInputFile'] = CustomInputFile;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomInputFile.prototype.Constant_ = {
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
  CustomInputFile.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
  };

  /**
   * Joins file names into a comma seprated string.
   */
  var joinFileNames = function(files) {
    var ret = [];
    for (var i = 0; i < files.length; i++) {
      ret.push(files[i].name);
    }
    return ret.join(', ');
  };

  /**
   * Handles clear click event.
   */
  CustomInputFile.prototype.onClearClicked_ = function(ev) {
    ev.preventDefault();
    this.fileinput_.value = null;
    this.textinput_.value = '';
    this.element_['MaterialTextfield'].updateClasses_();
  };

  /**
   * Handles file change event.
   */
  CustomInputFile.prototype.onFileChanged_ = function(ev) {
    if (this.fileinput_.files.length) {
      this.textinput_.value = joinFileNames(this.fileinput_.files);
    } else {
      this.textinput_.value = '';
    }
    this.element_['MaterialTextfield'].updateClasses_();
  };

  /**
   * Initialize element.
   */
  CustomInputFile.prototype.init = function() {
    if (this.element_) {
      this.textinput_ = this.element_.querySelector('input[type="text"]');
      this.fileinput_ = this.element_.querySelector('input[type="file"]');
      this.clear_ = this.element_.querySelector('.custom-clearbutton');

      var cherry = window.cherry;

      cherry.on(this.clear_, 'CustomInputFile.click', this.onClearClicked_).bind(this);
      cherry.on(this.fileinput_, 'CustomInputFile.change', this.onFileChanged_).bind(this);

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomInputFile.prototype.mdlDowngrade_ = function() {
    var cherry = window.cherry;
    cherry.off(this.clear_, 'CustomInputFile.click', this.onClearClicked_);
    cherry.off(this.fileinput_, 'CustomInputFile.change', this.onFileChanged_);

    this.textinput_ = null;
    this.fileinput_ = null;
    this.clear_ = null;
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomInputFile,
    classAsString: 'CustomInputFile',
    cssClass: 'custom-js-inputfile'
  });
})();
