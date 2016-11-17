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
  var CustomChipAutocomplete = function CustomChipAutocomplete(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomChipAutocomplete'] = CustomChipAutocomplete;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomChipAutocomplete.prototype.Constant_ = {
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
  CustomChipAutocomplete.prototype.CssClasses_ = {
    IS_UPGRADED: 'is-upgraded',
  };

  /**
   * Remove existing chip.
   * this must be bound to the chip to delete.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.removeChip_ = function(ev) {
    this.parentNode.remove();
  };

  /**
   * Hide results list.
   * Clear input text value.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.clearComponent_ = function() {
    this.hideResults_();
    this.input_.value = '';
    this.textfield_['MaterialTextfield'].updateClasses_();
    // this.element_.classList.remove("is-dirty");
  };

  /**
   * Make an url to fetch results on the remote.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.makeFetchUrl_ = function(text) {
    var url = this.urlCompleter_.replace(this.urlPlaceholder_, text);
    var urlArgs = '';
    var getArgs = this.completerArgs_;
    Object.keys(getArgs).forEach(function(key) {
      urlArgs += key + '=' + getArgs[key];
    });
    if (url.match(/[?]/)) {
      url = url + '&' + urlArgs;
    } else {
      url = url + '?' + urlArgs;
    }
    return url;
  };

  /**
   * Fetch results on the remote server.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.fetchResults_ = function(text) {
    var ajax = window.ajax;
    var that = this;
    var request = ajax().get(this.makeFetchUrl_(text));
    request.then(function(response) {
      var results = response;
      if (!results.length || !that.resultsContainsText_(results, text)) {
        if (that.urlCreator_) {
          results.unshift(that.makeCreateResult_());
        }
      }
      that.emptyResults_();
      if (results.length) {
        that.setResults_(results);
        that.showResults_();
      }
    }).catch(function(response, xhr) {
      that.setError_(that.txtRemoteUnreachable_);
    });
  };

  /**
   * Make a new create option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.setResults_ = function(results) {
    for (var i = 0; i < results.length; i++) {
      var li = document.createElement('li');
      li.classList.add('mdl-list__item');
      li.setAttribute('value', results[i].Value);

      var span = document.createElement('span');
      span.classList.add('mdl-list__item-primary-content');
      span.innerHTML = results[i].Text;

      li.appendChild(span);
      this.ul_.appendChild(li);
    }
  };

  /**
   * Make a new create option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.makeCreateResult_ = function() {
    return {
      Value: '-1',
      Text: 'Press enter to create <i class="material-icons">create</i>',
    };
  };

  /**
   * Tells if the results has the create result item.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.hasCreateResult_ = function() {
    var lis = this.ul_.querySelectorAll('li');
    return lis.length && this.isCreateResultEl_(lis[0]);
  };

  /**
   * Tells if given li element is the create result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.isCreateResultEl_ = function(li) {
    var optCreate = this.makeCreateResult_();
    return li.getAttribute('value') === optCreate.Value &&
    li.querySelector('span').innerHTML === optCreate.Text;
  };

  /**
   * Tells if given options contains given text.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.resultsContainsText_ = function(results, text) {
    var ret = false;
    results.forEach(function(o) {
      if (!ret && o.Text === text) {
        ret = true;
      }
    });
    return ret;
  };

  /**
   * Show the results list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.showResults_ = function() {
    this.results_.style.visibility = 'hidden';
    this.results_.classList.add('show');
    var componentHeight   = window.outerHeight(this.results_);
    var bodyRect          = document.body.getBoundingClientRect();
    var inputRect         = this.input_.getBoundingClientRect();
    var inputLeft         = inputRect.left;
    var inputTop          = inputRect.top - bodyRect.top;
    var inputHeight       = window.outerHeight(this.input_);
    var intFrameHeight    = window.innerHeight;

    if (intFrameHeight > inputTop + inputHeight + componentHeight) {
      this.results_.style.top = '' + (inputTop + inputHeight) + 'px';
    } else {
      this.results_.style.top = '' + (inputTop - componentHeight - 1) + 'px';
    }
    this.results_.style.left = '' + (inputLeft) + 'px';

    this.results_.style.visibility = 'visible';
  };

  /**
   * Handle result click event.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.onResultClick_ = function() {
    var that = this;
    return function() {
      if (that.isCreateResultEl_(this)) {
        that.createNewValue_(that.input_.value);
      } else {
        var option = {
          Value: this.getAttribute('value'),
          Text: this.querySelector('span').innerHTML,
        };
        that.addChip_(option);
        that.clearComponent_();
      }
    };
  };

  /**
   * Hide the results list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.hideResults_ = function() {
    this.results_.classList.remove('show');
    this.results_.style.visibility = 'hidden';
  };

  /**
   * Empty the results list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.emptyResults_ = function() {
    var lis = this.ul_.querySelectorAll('li');
    for (var i = 0; i < lis.length; i++) {
      lis[i].remove();
    }
  };

  /**
   * Clear current error.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.clearError_ = function() {
    this.error_.innerHTML = '';
    this.textfield_.classList.remove('is-invalid');
  };

  /**
   * Set current error.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.setError_ = function(text) {
    this.error_.innerHTML = text;
    this.textfield_.classList.add('is-invalid');
  };

  /**
   * Call the server to create a new option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.createNewValue_ = function(text) {
    this.clearError_();
    var postArgs = JSON.parse(JSON.stringify(this.creatorArgs_));
    postArgs.Value = text;
    var ajax = window.ajax;
    var that = this;
    var request = ajax().post(this.urlCreator_, postArgs);
    request.then(function(response) {
      if (response.Valid) {
        that.addChip_(response.Data);
      } else {
        if (response.HasFailure) {
          that.setError_(response.Failure);
        } else if (response.HasFieldErrors && response.FieldErrors.Value) {
          that.setError_(response.FieldErrors.Value);
        }
      }
    }).catch(function(response, xhr) {
      that.setError_(that.txtRemoteUnreachable_);
    });
  };

  /**
   * Traverse all results and transform them into an array of option.
   * suitable to add multiple chips.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.getCurrentResultsAsOptions_ = function() {
    var options = [];
    var lis = this.ul_.querySelectorAll('li');
    var hasCreateResult = this.hasCreateResult_();
    for (var i = (hasCreateResult ? 1 : 0); i < lis.length; i++) {
      options.push({
        Value: lis[i].getAttribute('value'),
        Text: lis[i].querySelector('span').innerHTML,
      });
    }
    return options;
  };

  /**
   * Tells if a chip with given value exists.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.chipExists_ = function(value) {
    return this.selected_.querySelector('[type="hidden"][value="' + value + '"]');
  };

  /**
   * Create a new chip and add it to the selection.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.addChip_ = function(option) {
    if (this.chipExists_(option.Value)) {
      return;
    }

    /*
    <span class="mdl-chip mdl-chip--deletable">
      <input type="hidden" name="{{.Field.GetName}}" value="xx" />
      <span class="mdl-chip__text">Deletable Chip</span>
      <button type="button" class="mdl-chip__action"><i class="material-icons">&#xE5C9;</i></button>
    </span>
    */

    var span = document.createElement('span');
    span.classList.add('mdl-chip');
    span.classList.add('mdl-chip--deletable');

    var text = document.createElement('span');
    text.classList.add('mdl-chip__text');
    text.innerHTML = option.Text;

    var icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.innerHTML = 'close';

    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('mdl-chip__action');

    var hidden = document.createElement('input');
    hidden.setAttribute('type', 'hidden');
    hidden.setAttribute('name', this.chipName_);
    hidden.setAttribute('value', option.Value);

    button.appendChild(icon);
    span.appendChild(text);
    span.appendChild(button);
    span.appendChild(hidden);

    this.selected_.appendChild(span);
    componentHandler.upgradeDom(span);
  };

  /**
   * Add multiple chips.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.addChips_ = function(options) {
    for (var i = 0; i < options.length; i++) {
      this.addChip_(options[i]);
    }
  };

  /**
   * Manage ctrl keys (enter/esc) on the keypress event of the input.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.onInputCtrlKeys_ = function(ev) {
    if (ev.keyCode === 27 || ev.keyCode === 13) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
    }

    if (ev.keyCode === 27) { // esc
      this.clearComponent_();
      this.clearError_();
      this.input_.blur();
      return false;
    }

    if (ev.keyCode === 13) { // enter
      var value = this.input_.value;
      var isCreateMode = this.hasCreateResult_();
      if (value && isCreateMode) {
        if (this.urlCreator_) {
          this.createNewValue_(value);
          this.clearComponent_();
        }
      } else if (!isCreateMode) {
        this.addChips_(this.getCurrentResultsAsOptions_());
        this.clearComponent_();
      }
      return false;
    }
  };

  /**
   * Manage input values changes.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.onInputChanged = function(ev) {
    var value = this.input_.value;
    if (value) {
      this.fetchResults_(value);
    } else {
      this.hideResults_();
      this.emptyResults_();
    }
  };

  /**
   * Initialize element.
   */
  CustomChipAutocomplete.prototype.init = function() {
    if (this.element_) {
      var element_ = this.element_;
      this.textfield_ = this.element_.querySelector('.mdl-textfield');
      this.input_ = this.textfield_.querySelector('.mdl-textfield__input');
      this.error_ = this.textfield_.querySelector('.mdl-textfield__error');
      this.results_ = this.element_.querySelector('.custom-chipautocomplete-results');
      this.ul_ = this.element_.querySelector('.mdl-list');
      this.selected_ = this.element_.querySelector('.custom-chipautocomplete-selected');

      this.urlPlaceholder_ = element_.getAttribute('url-placeholder') || '!pl!';
      this.urlCompleter_ = element_.getAttribute('url-completer');
      this.urlCompleter_ = this.urlCompleter_ && decodeURI(this.urlCompleter_);
      this.completerArgs_ = element_.getAttribute('url-complete-args') || '{}';
      this.completerArgs_ = JSON.parse(this.completerArgs_);

      this.urlCreator_ = element_.getAttribute('url-creator');
      this.urlCreator_ = this.urlCreator_ && decodeURI(this.urlCreator_);
      this.creatorArgs_ = element_.getAttribute('url-creator-args') || '{}';
      this.creatorArgs_ = JSON.parse(this.creatorArgs_);

      this.txtRemoteUnreachable_ = element_.getAttribute('txt-remote-unreachable') || 'Failed to query the remote application';
      this.chipName_ = element_.getAttribute('chip-name') || 'chip';

      document.body.appendChild(this.results_);
      this.results_.style.width = this.input_.offsetWidth + 'px';

      var debounce = window.debounce;
      var delegateEvent = window.delegateEvent;

      this.selected_.__click = delegateEvent(this.selected_, 'click', '.mdl-chip__action', this.removeChip_);

      this.ul_.__click = delegateEvent(this.ul_, 'click', 'li', this.onResultClick_());

      this.input_.__blur = debounce(this.clearComponent_.bind(this), 150);
      this.input_.addEventListener('blur', this.input_.__blur);

      this.input_.__submit = this.onInputCtrlKeys_.bind(this);
      this.input_.addEventListener('keypress', this.input_.__submit);

      this.input_.__change = debounce(this.onInputChanged.bind(this), 250);
      this.input_.addEventListener('keypress', this.input_.__change);

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomChipAutocomplete.prototype.mdlDowngrade_ = function() {

    this.input_.removeEventListener('blur', this.input_.__blur);
    this.input_.__blur = null;

    this.input_.removeEventListener('keypress', this.input_.__change);
    this.input_.__change = null;

    this.input_.removeEventListener('keypress', this.input_.__submit);
    this.input_.__submit = null;

    this.ul_.removeEventListener('click', this.ul_.__click);
    this.ul_.__click = null;

    this.selected_.removeEventListener('click', this.selected_.__click);
    this.selected_.__click = null;

    this.textfield_.appendChild(this.results_);
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomChipAutocomplete,
    classAsString: 'CustomChipAutocomplete',
    cssClass: 'custom-js-chipautocomplete'
  });
})();
