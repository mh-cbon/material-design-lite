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
  var CustomFormAjax = function CustomFormAjax(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomFormAjax'] = CustomFormAjax;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomFormAjax.prototype.Constant_ = {
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
  CustomFormAjax.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Handles form submit.
   *
   * @private
   */
  CustomFormAjax.prototype.handleSubmit_ = function() {
    this.sendSubmit();
  };

  /**
   * Submit the form.
   */
  CustomFormAjax.prototype.sendSubmit = function() {

    var options = this.getSubmitOptions(this.inputBtn_);
    options.data = this.getSubmitData();
    if (this.dataOverride_) {
      Object.keys(this.dataOverride_).forEach(function(key) {
        options.data[key] = this.dataOverride_[key];
      }.bind(this));
    }

    var cherry = window.cherry;

    if (typeof options.data === 'object') {
      options.data = cherry.stringifyUrlArgs(options.data); // what about FormData object ?
    }

    this.notifyPresubmit_(options);
    this.disableFieldErrors_();
    this.showLoader_();

    var ajax = window.ajax;
    var request = ajax(options);
    request.then(function(response, xhr) {
      this.handleSubmitResponse_(response);
    }.bind(this)).catch(this.handleSubmitFail_.bind(this));
  };

  /**
   * Handles form submit.
   *
   */
  CustomFormAjax.prototype.setDataOverride = function(data) {
    this.dataOverride_ = data;
  };

  /**
   * Determines the submit options.
   */
  CustomFormAjax.prototype.getSubmitOptions = function(btn) {

    var hasFile = this.containsFileInput_();
    var headers = {};

    var action = this.element_.getAttribute('action');
    var method = this.element_.getAttribute('method');
    var enctype = this.element_.getAttribute('enctype');

    if (btn) {
      // handle html5 button outside of the form
      if (btn.hasAttribute('formmethod')) {
        method = btn.getAttribute('formmethod');
      }
      if (btn.hasAttribute('formaction')) {
        action = btn.getAttribute('formaction');
      }
      if (btn.hasAttribute('formenctype')) {
        enctype = btn.getAttribute('formenctype');
      }
    }

    if (!method) {
      method = 'POST'; // I presume.
    }
    if (method === 'POST' && !enctype) {
      enctype = 'application/x-www-form-urlencoded';
    }

    headers['content-type'] = enctype;
    if (hasFile) {
      // required for ajax module.
      headers['content-type'] = null;
    }

    return {
      method: method,
      url: action,
      headers: headers
    };
  };

  /**
   * Determines the submit data.
   */
  CustomFormAjax.prototype.getSubmitData = function() {

    var hasFile = this.containsFileInput_();
    var params = hasFile ? this.getFormData() : this.getFormDataRaw();

    if (this.inputBtn_) {
      // handle html5 button outside of the form
      var name = this.inputBtn_.getAttribute('name');
      var value = this.inputBtn_.value;
      if (name && Object.keys(params).indexOf(name) === -1 && value) {
        if (params.append) {
          params.append(name, value);
        } else {
          params[name] = value;
        }
      }
    }
    return params;
  };

  /**
   * Determines if the form contains file input with actual value.
   */
  CustomFormAjax.prototype.containsFileInput_ = function() {
    var files = this.element_.querySelectorAll('input[type="file"]');
    for (var i = 0; i < files.length; i++) {
      if (files[i].files && files[i].files.length) {
        return true;
      }
    }
    return false;
  };

  /**
   * Handles form success request response.
   *
   * @private
   */
  CustomFormAjax.prototype.handleSubmitResponse_ = function(response) {
    if (response) {
      if (response.HasFailure || response.HasFieldErrors) {
        this.applyFormFailure_(response.Failure);
        this.applyFieldErrors_(response.FieldErrors);
      } else if (response.Valid) {
        if (response.SuccessTo) {
          window.location.href = response.SuccessTo;
        } else if (this.element_.hasAttribute('success-to')) {
          window.location.href = this.element_.getAttribute('success-to');
        }
      }
    }
    this.hideLoader_();
    this.notifyPostsubmit_(response);
    this.inputBtn_ = null;
  };

  /**
   * Handles form request failure.
   *
   * @private
   */
  CustomFormAjax.prototype.handleSubmitFail_ = function() {
    this.hideLoader_();
    this.notifyPostsubmit_({}, true);
    this.inputBtn_ = null;
  };

  /**
   * Returns a form data as a FormData object.
   *
   * @private
   */
  CustomFormAjax.prototype.getFormData = function() {
    return new FormData(this.element_);
  };

  /**
   * Returns a form data as a query string.
   *
   * @private
   */
  CustomFormAjax.prototype.getFormDataRaw = function() {
    var params = {};
    var nodes = this.element_.querySelectorAll('[value]');
    for (var i = 0; i < nodes.length; ++i) {
      if (nodes[i].name) {
        params[nodes[i].name] = nodes[i].value;
      }
    }
    return params;
  };

  /**
   * Emits pre-submit event, notify listeners for pre-submit.
   *
   * @private
   */
  CustomFormAjax.prototype.notifyPresubmit_ = function(data) {
    var cherry = window.cherry;
    cherry.trigger(this.element_, 'pre-submit', data);
    if (this.preNotify_) {
      var notifyData = {
        notification: {
          sourceEvent: 'pre-submit',
          targetElement: this.element_,
          inputElement: this.inputBtn_,
          timeout: this.preNotifyTimeout_,
          sourceData: data,
          notificationType: 'info',
          message: this.preNotifyMessage_,
          actionHandler: 'close',
          actionText: this.preNotifyActionText_,
        }
      };
      cherry.trigger(this.preNotify_, 'notify', notifyData);
    }
  };

  /**
   * Emits pre-submit event, notify listeners for pre-submit.
   *
   * @private
   */
  CustomFormAjax.prototype.notifyPostsubmit_ = function(data, critical) {
    var cherry = window.cherry;
    cherry.trigger(this.element_, 'post-submit', data);
    if (data.Valid) {
      cherry.trigger(this.element_, 'validation-success', data);
    } else {
      cherry.trigger(this.element_, 'validation-fail', data);
    }
    var notifyData = {
      notification: {
        sourceEvent: 'post-submit',
        targetElement: this.element_,
        inputElement: this.inputBtn_,
        sourceData: data,
        notificationType: '',
        message: '',
        actionHandler: 'close',
        actionText: this.postNotifyActionText_,
      }
    };
    if (critical) {
      notifyData.notification.notificationType = 'critical';
      notifyData.notification.message = this.postNotifyCriticalMessage_;
      notifyData.notification.timeout = this.postNotifyFailureTimeout_;

    } else if (data.HasFailure) {
      notifyData.notification.notificationType = 'severe';
      notifyData.notification.message = data.Failure || this.postNotifyFailureMessage_;
      notifyData.notification.timeout = this.postNotifyFailureTimeout_;

    } else if (data.HasFieldErrors) {
      notifyData.notification.notificationType = 'warn';
      notifyData.notification.timeout = this.postNotifyFailureTimeout_;
      if (this.postNotifyFailureMessage_) {
        notifyData.notification.message = this.postNotifyFailureMessage_;
      }

    } else if (data.Valid) {
      notifyData.notification.notificationType = 'success';
      notifyData.notification.timeout = this.postNotifySuccessTimeout_;
      if (this.postNotifySuccessMessage_) {
        notifyData.notification.message = this.postNotifySuccessMessage_;
      }
    }

    cherry.trigger(this.postNotify_, 'notify', notifyData);
  };

  /**
   * Set error failure.
   *
   * @private
   */
  CustomFormAjax.prototype.applyFormFailure_ = function(failure) {
    var failureEl = this.element_.querySelector('[class$="__errorfailure"]');
    if (failureEl) {
      failureEl.innerHTML = failure;
      failureEl.parentNode.classList.add('is-invalid');
    }
  };

  /**
   * Set error values on form fields.
   *
   * @private
   */
  CustomFormAjax.prototype.applyFieldErrors_ = function(fieldErrors) {
    var cherry = window.cherry;
    var fieldsNotFounds = [];
    var errorNodesNotFounds = [];

    if (!fieldErrors) {
      return ;
    }

    Object.keys(fieldErrors).forEach(function(name) {
      var err = fieldErrors[name];

      var input = this.element_.querySelector('input[name="' + name + '"]');
      if (!input) {
        input = this.element_.querySelector('select[name="' + name + '"]');
        if (!input) {
          input = this.element_.querySelector('textarea[name="' + name + '"]');
        }
      }
      if (!input) {
        return fieldsNotFounds.push(name);
      }

      var errField = cherry.childElements(input.parentNode, '[class$="__error"]');
      if (!errField.length) {
        errField = cherry.childElements(input.parentNode.parentNode, '[class$="__error"]');
        if (!errField.length) {
          if (input.id) {
            // this last method should be the default on long term.
            errField = document.querySelectorAll('[class$="__error"][for="' + input.id + '"]');
            if (!errField.length) {
              return errorNodesNotFounds.push(name);
            }
          } else {
            return errorNodesNotFounds.push(name);
          }
        }
      }
      errField = errField[0];
      errField.parentNode.classList.add('is-invalid');
      errField.innerHTML = err;
    }.bind(this));

    fieldsNotFounds.forEach(function(name) {
      console.error('input field not found: ' + name);
    });
    errorNodesNotFounds.forEach(function(name) {
      console.error('error node not found: ' + name);
    });
  };

  /**
   * Disable error status on the form fields.
   *
   * @private
   */
  CustomFormAjax.prototype.disableFieldErrors_ = function() {
    var nodes = this.element_.querySelectorAll('[class$="__error"]');
    for (var i = 0; i < nodes.length; ++i) {
      nodes[i].innerHTML = '';
      nodes[i].parentNode.classList.remove('is-invalid');
    }
    var failureEl = this.element_.querySelector('[class$="__errorfailure"]');
    if (failureEl) {
      failureEl.innerHTML = '';
      failureEl.parentNode.classList.remove('is-invalid');
    }
  };

  /**
   * Hide the loader.
   *
   * @private
   */
  CustomFormAjax.prototype.hideLoader_ = function() {
    this.submitBtns_.forEach(function(node) {
      node.removeAttribute('disabled');
    });
  };

  /**
   * Show the loader.
   *
   * @private
   */
  CustomFormAjax.prototype.showLoader_ = function() {
    this.submitBtns_.forEach(function(node) {
      node.setAttribute('disabled', 'disabled');
    });
  };

  /**
   * Handles form submit event.
   *
   * @private
   */
  CustomFormAjax.prototype.onSubmit_ = function(ev) {
    ev.preventDefault();
    this.handleSubmit_();
  };
  /**
   * Handles form submit event.
   *
   * @private
   */
  CustomFormAjax.prototype.onBtClick_ = function(ev) {
    var btn = ev.target;
    // chromium specific
    if (btn.nodeName !== 'BUTTON') {
      var cherry = window.cherry;
      var t = cherry.getParentsUntil(ev.target, 'button');
      if (t) {
        btn = t.shift().parentNode;
      }
    }
    this.inputBtn_ = btn;
  };

  /**
   * Initialize element.
   */
  CustomFormAjax.prototype.init = function() {
    if (this.element_) {
      var cherry = window.cherry;

      this.preNotifyTimeout_ = this.element_.getAttribute('pre-notify-timeout') || 0;
      this.preNotifyTimeout_ = parseInt(this.preNotifyTimeout_);
      this.preNotifyActionText_ = this.element_.getAttribute('pre-notify-action');
      this.preNotifyMessage_ = this.element_.getAttribute('pre-notify-message');
      this.preNotifySelector_ = this.element_.getAttribute('pre-notify');
      this.preNotify_ = document.body.querySelectorAll(this.preNotifySelector_);

      this.postNotifySuccessTimeout_ = this.element_.getAttribute('post-notify-success-timeout') || 0;
      this.postNotifyFailureTimeout_ = this.element_.getAttribute('post-notify-failure-timeout') || 0;
      this.postNotifySuccessTimeout_ = parseInt(this.postNotifySuccessTimeout_);
      this.postNotifyFailureTimeout_ = parseInt(this.postNotifyFailureTimeout_);
      this.postNotifyActionText_ = this.element_.getAttribute('post-notify-action');
      this.postNotifySuccessMessage_ = this.element_.getAttribute('post-notify-success');
      this.postNotifyFailureMessage_ = this.element_.getAttribute('post-notify-failure');
      this.postNotifyCriticalMessage_ = this.element_.getAttribute('post-notify-critical');
      this.postNotifySelector_ = this.element_.getAttribute('post-notify');
      this.postNotify_ = document.body.querySelectorAll(this.postNotifySelector_);

      this.inputBtn_ = null;
      this.submitBtns_ = this.element_.querySelectorAll('[type="submit"]');
      this.submitBtns_ = Array.prototype.slice.call(this.submitBtns_);

      if (this.element_.getAttribute('id')) {
        var id = this.element_.getAttribute('id');
        var outerBtns = document.querySelectorAll('button[form="' + id + '"][type="submit"]');
        for (var i = 0; i < outerBtns.length; i++) {
          if (this.submitBtns_.indexOf(outerBtns[i]) === -1) {
            this.submitBtns_.push(outerBtns[i]);
          }
        }
      }
      cherry.on(this.submitBtns_, 'CustomFormAjax.click', this.onBtClick_).bind(this).first();
      cherry.on(this.element_, 'CustomFormAjax.submit', this.onSubmit_).bind(this).first();
      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomFormAjax.prototype.mdlDowngrade_ = function() {
    var cherry = window.cherry;

    cherry.off(this.submitBtns_, 'CustomFormAjax.click', this.onClickSubmitBtn_);
    cherry.off(this.element_, 'CustomFormAjax.submit', this.onSubmit_);

    this.inputBtn_ = null;
    this.preNotify_ = null;
    this.preNotifySelector_ = null;
    this.postNotify_ = null;
    this.postNotifySelector_ = null;
    this.notify_ = null;
    this.notifySelector_ = null;
    this.dataOverride_ = null;

    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomFormAjax,
    classAsString: 'CustomFormAjax',
    cssClass: 'custom-js-form-ajax'
  });
})();
