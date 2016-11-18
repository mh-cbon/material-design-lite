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
  var CustomDup = function CustomDup(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomDup'] = CustomDup;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomDup.prototype.Constant_ = {
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
  CustomDup.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
  };

  /**
   * Handle bt-add event.
   */
  CustomDup.prototype.onBtAddClicked_ = function() {
    var that = this;
    var cherry = window.cherry;
    return function(ev) {
      var html = that.template_.innerHTML;
      var children = cherry.childElements(that.container_);
      html = html.replace(/([$]incrIndex[$])/g, that.incIndex_);
      html = html.replace(/([$]itemIndex[$])/g, children.length);
      html = html.replace(/([$]random[$])/g, function() {
        return Math.random();
      });
      that.incIndex_++;
      var temp = document.createElement('div');
      temp.innerHTML = html;
      var el = temp.querySelector('.custom-dup-item');
      that.container_.appendChild(el);
      window['componentHandler'].upgradeElements(cherry.childElements(el));
    };
  };

  /**
   * Handle bt-remove event.
   */
  CustomDup.prototype.onBtRemoveClicked_ = function() {
    var that = this;
    var cherry = window.cherry;
    return function(ev) {
      var item = this.parentNode;
      var i = cherry.indexElement(item);
      var m = cherry.childElements(that.container_).length - 1;
      if (i === m && i > -1) {
        // - its the last element
        that.incIndex_--;
      }
      window['componentHandler'].downgradeElements(cherry.childElements(item));
      item.remove();
    };
  };

  /**
   * Handle mdl components registered event.
   */
  CustomDup.prototype.onComponentsRegistered_ = function() {
    var template = this.template_;
    window['componentHandler'].downgradeElementRecursive(template);
    // template.remove();
    window.removeEventListener('mdl-componentsupgraded', this.onComponentsRegistered_);
  };

  /**
   * Initialize element.
   */
  CustomDup.prototype.init = function() {
    if (this.element_) {
      var cherry = window.cherry;
      var element_ = this.element_;
      this.template_ = element_.querySelector('.custom-dup-template');
      this.container_ = element_.querySelector('.custom-dup-container');

      window.addEventListener('mdl-componentsupgraded', this.onComponentsRegistered_.bind(this));

      this.incIndex_ = cherry.childElements(this.container_).length;

      this.element_.__btadd = cherry.delegateEvent(this.element_,
        'click',
        '.custom-dup-bt-add',
        this.onBtAddClicked_());

      this.element_.__btrem = cherry.delegateEvent(this.element_,
        'click',
        '.custom-dup-item > .custom-dup-bt-remove',
        this.onBtRemoveClicked_());

      element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomDup.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('click', this.element_.__btrem);
    this.element_.removeEventListener('click', this.element_.__btadd);
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomDup,
    classAsString: 'CustomDup',
    cssClass: 'custom-js-dup'
  });
})();
