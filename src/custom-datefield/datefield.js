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
   * Class constructor for Textfield MDL component.
   * Implements MDL component design pattern defined at:
   * https://github.com/jasonmayes/mdl-component-design-pattern
   *
   * @constructor
   * @param {HTMLElement} element The element that will be upgraded.
   */
  var CustomDateField = function CustomDateField(element) {
    this.element_ = element;
    // Initialize instance.
    this.init();
  };
  window['CustomDateField'] = CustomDateField;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomDateField.prototype.Constant_ = {
  };

  /**
   * Store strings for class names defined by this component that are used in
   * JavaScript. This allows us to simply change it in one place should we
   * decide to modify at a later date.
   *
   * @enum {string}
   * @private
   */
  CustomDateField.prototype.CssClasses_ = {
    LABEL: 'mdl-textfield__label',
    INPUT: 'mdl-textfield__input',
    INPUTVALUE: 'custom-datefield__value'
  };

  // Public methods.

  /**
   * Initialize element.
   */
  CustomDateField.prototype.init = function() {

    if (this.element_) {
      this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);
      this.value_ = this.element_.querySelector('.' + this.CssClasses_.INPUTVALUE);

      if (this.input_) {

        var displaylocale = this.element_.getAttribute('displaylocale') || 'en';
        var displayformat = this.element_.getAttribute('displayformat') || 'ddd DD MMM YYYY';
        var format = this.element_.getAttribute('format') || 'YYYY-MM-DDThh:mm:ssZ';
        var future = this.element_.getAttribute('future') || undefined;
        var past = this.element_.getAttribute('past') || undefined;
        var mode = this.element_.getAttribute('mode') || undefined;
        var orientation = this.element_.getAttribute('orientation') || undefined;
        var colon = this.element_.getAttribute('colon') || undefined;

        var moment = window.moment;
        moment.locale(displaylocale);
        var mdDateTimePicker = window.mdDateTimePicker;

        var options = {
          type: 'date',
          init: moment.utc(this.value_.value, format),
          trigger: this.input_,
          future: future && moment(future, format) || future,
          past: past && moment(past, format) || past,
          mode: mode,
          orientation: orientation,
          colon: colon=="true",
        };
        var dialog = new mdDateTimePicker.default(options);
        this.dialog = dialog;
        /**
        * Click function handler.
        */
        this.input_.__click = function() {
          dialog.toggle();
        };
        this.input_.addEventListener('click', this.input_.__click);
        /**
        * onOk function handler.
        */
        this.input_.__ok = function() {
          this.input_.value = dialog.time.format(displayformat);
          this.value_.value = dialog.time.format(format);
          this.element_['MaterialTextfield'].updateClasses_();
        }.bind(this);
        this.input_.addEventListener('onOk', this.input_.__ok);
        this.input_.value = moment(this.value_.value, format).format(displayformat);
        this.element_['MaterialTextfield'].updateClasses_();
      }
    }
  };

  /**
   * Downgrade element.
   */
  CustomDateField.prototype.mdlDowngrade_ = function() {
    // this.dialog.destroy();
    this.input_.removeEventListener('click', this.input_.__click);
    this.input_.removeEventListener('onOk', this.input_.__ok);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomDateField,
    classAsString: 'CustomDateField',
    cssClass: 'custom-js-datefield',
    widget: true
  });
})();
