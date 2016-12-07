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
  var CustomFilet = function CustomFilet(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomFilet'] = CustomFilet;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomFilet.prototype.Constant_ = {
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
  CustomFilet.prototype.CssClasses_ = {
  };

  /**
   * show the filet.
   */
  CustomFilet.prototype.show = function(ev) {
    this.filet_.classList.add('show');
  };

  /**
   * hide the filet.
   */
  CustomFilet.prototype.hide = function(ev) {
    this.filet_.classList.remove('show');
  };

  /**
   * toggle the filet.
   */
  CustomFilet.prototype.toggle = function(ev) {
    this.filet_.classList.toggle('show');
  };

  /**
   * Initialize element.
   */
  CustomFilet.prototype.init = function() {
    if (this.element_) {
      var cherry = window.cherry;
      this.oldPosition = this.element_.style.position;
      if (cherry.getStyle(this.element_, 'position') === 'static') {
        this.element_.style.position = 'relative';
      }
      this.filet_ = document.createElement('div');
      this.filet_.classList.add('custom-filet--filet');

      this.element_.appendChild(this.filet_);

      this.filetTriggers = this.element_.getAttribute('filet-trigger') || '';

      if (!this.filetTriggers) {
        if (this.element_.nodeName.match(/div|tr|td|th/i)) {
          this.filetTriggers = 'mouseover';
        }
      }

      this.filetTriggers.split(',').forEach(function(trigger) {
        trigger = trigger.replace(/^\s+|\s$/, '');
        if (trigger.match(/(over|down)$/)) {
          cherry.on(
            this.element_, 'CustomFilet.' + trigger, this.show
          ).bind(this);
          if (trigger.match(/(over)$/)) {
            cherry.on(
              this.element_, 'CustomFilet.' + trigger.replace(/over$/, 'out'), this.hide
            ).bind(this);
          } else {
            cherry.on(
              this.element_, 'CustomFilet.' + trigger.replace(/down$/, 'up'), this.hide
            ).bind(this);
          }
        } else {
          cherry.on(
            this.element_, 'CustomFilet.' + trigger, this.toggle
          ).bind(this);
        }
      }.bind(this));
    }
  };

  /**
   * Downgrade element.
   */
  CustomFilet.prototype.mdlDowngrade_ = function() {
    var cherry = window.cherry;

    this.filetTriggers.split(',').forEach(function(trigger) {
      trigger = trigger.replace(/^\s+|\s$/, '');
      if (trigger.match(/(over|down)$/)) {
        cherry.off(this.element_, 'CustomFilet.' + trigger, this.show);
        if (trigger.match(/(over)$/)) {
          cherry.off(this.element_, 'CustomFilet.' + trigger.replace(/over$/, 'out'), this.hide);
        } else {
          cherry.off(this.element_, 'CustomFilet.' + trigger.replace(/down$/, 'up'), this.hide);
        }
      } else {
        cherry.off(this.element_, 'CustomFilet.' + trigger, this.toggle);
      }
    }.bind(this));

    this.filet_.remove();
    this.element_.style.position = this.oldPosition;
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomFilet,
    classAsString: 'CustomFilet',
    cssClass: 'custom-js-filet'
  });
})();
