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
   * Initialize element.
   */
  CustomInputFile.prototype.init = function() {
    if (this.element_) {
      var element_ = this.element_;
      this.textinput_ = this.element_.querySelector('input[type="text"]');
      this.fileinput_ = this.element_.querySelector('input[type="file"]');
      this.clear_ = this.element_.querySelector('.custom-clearbutton');

      var file = this.fileinput_;
      var text = this.textinput_;

      this.clear_.__click = function(ev) {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();
        file.value = null;
        text.value = '';
        element_['MaterialTextfield'].updateClasses_();
      }.bind(this);
      this.clear_.addEventListener('click', this.clear_.__click);

      var label = this.element_.querySelector('.mdl-textfield__label');
      if (label) {
        // var originalLabel = label.innerHTML;
        this.fileinput_.__change = function(ev) {
          if (file.files.length) {
            // label.innerHTML = joinFileNames(file.files);
            text.value = joinFileNames(file.files);
          } else {
            // label.innerHTML = originalLabel;
            text.value = '';
          }
          element_['MaterialTextfield'].updateClasses_();
        }.bind(this);
        this.fileinput_.addEventListener('change', this.fileinput_.__change);
      }

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomInputFile.prototype.mdlDowngrade_ = function() {
    this.clear_.removeEventListener('click', this.textinput_.__click);
    this.clear_.__click = null;
    this.fileinput_.removeEventListener('change', this.fileinput_.__change);
    this.fileinput_.__change = null;
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
