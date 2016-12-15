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
   * Hide results list.
   * Clear input text value.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.clearComponent_ = function() {
    this.hideResults_();
    this.input_.value = '';
    this.textfield_['MaterialTextfield'].updateClasses_();
  };

  /**
   * Make an url to fetch results on the remote.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.makeFetchUrl_ = function(text) {
    var cherry = window.cherry;
    var url = cherry.lightTemplate(this.urlCompleter_, {Text: text});
    var urlArgs = '';
    var getArgs = this.completerArgs_;
    Object.keys(getArgs).forEach(function(key) {
      urlArgs += encodeURIComponent(key) + '=' + encodeURIComponent(getArgs[key]) + '&';
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
    var url = this.makeFetchUrl_(text);
    var ajax = window.ajax;
    var request = ajax().get(url);
    request.then(function(response) {
      var results = this.filterExistingResults_(response);
      if (text && !this.chipTextExists_(text) && this.urlCreator_) {
        results.unshift(this.makeCreateResultOption_());
      }
      if (!results.length && text) {
        results.unshift(this.makeNoResultOption_());
      }
      if (!results.length && !text) {
        results.unshift(this.makeTypeMoreTextOption_());
      }
      this.emptyResults_();
      this.setResults_(results);
      this.showResults_();
    }.bind(this)).catch(function(response, xhr) {
      this.setError_(this.txtRemoteUnreachable_);
    }.bind(this));
  };

  /**
   * Make a new create option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.filterExistingResults_ = function(results) {
    var ret = [];
    for (var i = 0; i < results.length; i++) {
      var opt = results[i];
      if (opt.Value && this.chipExists_(opt.Value) === false) {
        ret.push(opt);
      }
    }
    return ret;
  };

  /**
   * Make a new create option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.setResults_ = function(results) {
    for (var i = 0; i < results.length; i++) {
      var opt = results[i];
      var li = document.createElement('li');
      li.classList.add('mdl-list__item');
      li.setAttribute('value', opt.Value);

      var span = document.createElement('span');
      span.classList.add('mdl-list__item-primary-content');
      span.innerHTML = opt.Text;

      li.appendChild(span);
      this.ul_.appendChild(li);
    }
  };

  /**
   * Make a new create option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.makeCreateResultOption_ = function() {
    return {
      Value: '-1',
      Text: this.txtCreateResult_,
    };
  };

  /**
   * Make a new no-result option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.makeNoResultOption_ = function() {
    return {
      Value: '-1',
      Text: this.txtNoResults_,
    };
  };

  /**
   * Tells if the results contains the create-result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.hasCreateResultOption_ = function() {
    var lis = this.ul_.querySelectorAll('li');
    return lis.length && this.isCreateResultOption_(lis[0]);
  };

  /**
   * Tells if given li element is the create result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.isCreateResultOption_ = function(li) {
    return li.getAttribute('value') === '-1' &&
    li.querySelector('span').innerHTML === this.txtCreateResult_;
  };

  /**
   * Make a new no-result option for the result list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.makeTypeMoreTextOption_ = function() {
    return {
      Value: '-1',
      Text: this.txtTypeMore_,
    };
  };

  /**
   * Tells if the results contains the create-result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.hasTypeMoreTextOption_ = function() {
    var lis = this.ul_.querySelectorAll('li');
    return lis.length && this.isTypeMoreTextOption_(lis[0]);
  };

  /**
   * Tells if given li element is the no-result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.isTypeMoreTextOption_ = function(li) {
    return li.getAttribute('value') === '-1' &&
    li.querySelector('span').innerHTML === this.txtTypeMore_;
  };

  /**
   * Tells if given li element is the no-result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.isNoResultOption_ = function(li) {
    return li.getAttribute('value') === '-1' &&
    li.querySelector('span').innerHTML === this.txtNoResults_;
  };

  /**
   * Tells if the results contains the no-result option.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.hasNoResultOption_ = function() {
    var lis = this.ul_.querySelectorAll('li');
    return lis.length && this.isNoResultOption_(lis[0]);
  };

  /**
   * Tells if given results contains given text.
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
    this.results_.style.height = 'auto';
    this.results_.style.visibility = 'hidden';
    this.results_.classList.add('show');
    var cherry = window.cherry;
    cherry.off(this.results_, 'CustomChipAutocomplete.transitionend');

    var componentHeight = cherry.outerHeight(this.results_);
    var inputRect       = this.input_.getBoundingClientRect();
    var inputTop        = inputRect.top;
    var inputHeight     = cherry.outerHeight(this.input_);
    var textFieldHeight = cherry.outerHeight(this.textfield_);
    var intFrameHeight  = window.innerHeight;
    var d = (textFieldHeight - inputHeight);

    if (intFrameHeight > inputTop + inputHeight + componentHeight) {
      //dispaly below
      this.results_.style.top = '' + (inputHeight + d / 2) + 'px';
    } else {
      //dispaly above
      this.results_.style.bottom = textFieldHeight + 'px';
    }
    this.results_.style.height = '0px';
    this.results_.style.width = this.input_.offsetWidth + 'px';
    this.results_.style.visibility = 'visible';
    this.results_.style.height = componentHeight + 'px';
  };

  /**
   * Handle result click event.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.onResultClick_ = function(ev) {
    var li = ev.delegateTarget;
    if (!this.isTypeMoreTextOption_(li)) {
      if (this.isCreateResultOption_(li)) {
        this.createNewValue_(this.input_.value);

      } else if (!this.isNoResultOption_(li)) {
        var option = {
          Value: li.getAttribute('value'),
          Text: li.querySelector('span').innerHTML,
        };
        this.addChip_(option);
        this.clearComponent_();
      }
    }
  };

  /**
   * Hide the results list.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.hideResults_ = function() {
    var cherry = window.cherry;
    cherry.off(this.results_, 'CustomChipAutocomplete.transitionend');
    cherry.on(this.results_, 'CustomChipAutocomplete.transitionend', function() {
      this.results_.classList.remove('show');
      this.results_.style.visibility = 'hidden';
      this.results_.style.top = '';
      this.results_.style.bottom = '';
    }).bind(this);
    this.results_.style.height = '0px';
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
    var i = 0;
    if (this.hasCreateResultOption_() || this.hasTypeMoreTextOption_()) {
      i++;
    }
    for (; i < lis.length; i++) {
      options.push({
        Value: lis[i].getAttribute('value'),
        Text: lis[i].querySelector('span').innerHTML,
      });
    }
    return options;
  };

  /**
   * Tells if a chip with given text exists.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.chipTextExists_ = function(text) {
    if (!text) {
      return false;
    }
    var els = this.selected_.querySelectorAll('.mdl-chip__text');
    for (var i = 0; i < els.length; i++) {
      if (els[i].innerHTML.toLowerCase() === text.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  /**
   * Tells if a chip with given value exists.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.chipExists_ = function(value) {
    return !!this.selected_.querySelector('[type="hidden"][value="' + value + '"]');
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
    icon.innerHTML = '&#xE5C9;';

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

    this.selected_.offsetWidth; // jshint ignore:line

    var cherry = window.cherry;
    var w = cherry.innerWidth(span);
    span.style.width = '0px';
    this.selected_.offsetWidth; // jshint ignore:line
    span.classList.add('show');
    span.style.width = w + 'px';
  };

  /**
   * Remove existing chip.
   * this must be bound to the chip to delete.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.removeChip_ = function(ev) {
    var target = ev.delegateTarget.parentNode;
    var cherry = window.cherry;
    cherry.off(target, 'CustomChipAutocomplete.transitionend');
    cherry.on(target, 'CustomChipAutocomplete.transitionend', function() {
      target.remove();
      target.classList.remove('show');
    }).bind(this);
    target.style.width = '0px';
    target.style.opacity = '0';
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
      if (!this.hasNoResultOption_() && !this.hasTypeMoreTextOption_()) {
        var isCreateMode = this.hasCreateResultOption_();
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
   * Show some results when input gets the focus.
   *
   * @private
   */
  CustomChipAutocomplete.prototype.onInputFocus = function(ev) {
    this.fetchResults_(this.input_.value);
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

      this.urlCompleter_ = element_.getAttribute('url-completer');
      this.urlCompleter_ = this.urlCompleter_ && decodeURI(this.urlCompleter_);
      this.completerArgs_ = element_.getAttribute('url-complete-args') || '{}';
      this.completerArgs_ = JSON.parse(this.completerArgs_);

      this.urlCreator_ = element_.getAttribute('url-creator');
      this.urlCreator_ = this.urlCreator_ && decodeURI(this.urlCreator_);
      this.creatorArgs_ = element_.getAttribute('url-creator-args') || '{}';
      this.creatorArgs_ = JSON.parse(this.creatorArgs_);

      this.txtCreateResult_ = element_.getAttribute('txt-create-results') ||
        'Press enter to create <i class="material-icons">create</i>';
      this.txtNoResults_ = element_.getAttribute('txt-no-results') || 'No results';
      this.txtTypeMore_ = element_.getAttribute('txt-type-more') || 'Type more text...';
      this.txtRemoteUnreachable_ = element_.getAttribute('txt-remote-unreachable') ||
        'Failed to query the remote application';
      this.chipName_ = element_.getAttribute('chip-name') || 'chip';

      // document.body.appendChild(this.results_);
      this.textfield_.appendChild(this.results_);
      this.results_.style.width = this.input_.offsetWidth + 'px';

      var existingChips = this.selected_.querySelectorAll('.mdl-chip');
      for (var i = 0; i < existingChips.length; i++) {
        existingChips[i].classList.add('show');
      }

      var cherry = window.cherry;

      cherry.delegate(this.selected_, '.mdl-chip__action', 'click', this.removeChip_).bind(this);
      cherry.delegate(this.ul_, 'li', 'click', this.onResultClick_).bind(this);
      cherry.on(this.input_, 'chipautocomplete.blur', this.clearComponent_).bind(this).debounce(150);
      cherry.on(this.input_, 'chipautocomplete.focus', this.onInputFocus).bind(this);
      cherry.on(this.input_, 'chipautocomplete.keypress', this.onInputCtrlKeys_).bind(this);
      cherry.on(this.input_, 'chipautocomplete.keypress', this.onInputChanged).bind(this).debounce(250);

      // if (!element_.getAttribute('id')) {
      //   element_.setAttribute('id', (new Date()).now());
      // }
      // this.results_.setAttribute('about-chipautocomplete', element_.getAttribute('id'));

      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
    }
  };

  /**
   * Downgrade element.
   */
  CustomChipAutocomplete.prototype.mdlDowngrade_ = function() {

    var cherry = window.cherry;

    cherry.off(this.input_, 'chipautocomplete.focus', this.onInputFocus);
    cherry.off(this.input_, 'chipautocomplete.blur', this.clearComponent_);
    cherry.off(this.input_, 'chipautocomplete.keypress', this.onInputCtrlKeys_);
    cherry.off(this.input_, 'chipautocomplete.keypress', this.onInputChanged);
    cherry.undelegate(this.selected_, 'li', 'click', this.onResultClick_);
    cherry.undelegate(this.selected_, '.mdl-chip-action', 'click', this.removeChip_);

    this.textfield_.appendChild(this.results_);
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);

    this.textfield_ = null;
    this.input_ = null;
    this.error_ = null;
    this.results_ = null;
    this.ul_ = null;
    this.selected_ = null;

    this.urlCompleter_ = null;
    this.completerArgs_ = null;

    this.urlCreator_ = null;
    this.creatorArgs_ = null;

    this.txtCreateResult_ = null;
    this.txtNoResults_ = null;
    this.txtRemoteUnreachable_ = null;
    this.chipName_ = null;

  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomChipAutocomplete,
    classAsString: 'CustomChipAutocomplete',
    cssClass: 'custom-js-chipautocomplete'
  });
})();
