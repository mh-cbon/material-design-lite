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
  var CustomAjaxTable = function CustomAjaxTable(element) {
    this.element_ = element;

    // Initialize instance.
    this.init();
  };

  window['CustomAjaxTable'] = CustomAjaxTable;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomAjaxTable.prototype.Constant_ = {
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
  CustomAjaxTable.prototype.CssClasses_ = {
    SELECTABLE: 'mdl-data-table--selectable',
    SORT_ASC: 'mdl-data-table__header--sorted-ascending',
    SORT_DESC: 'mdl-data-table__header--sorted-descending',
    SORT_ABLE: 'mdl-data-table__header--sorted',
    NOT_NUMERIC: 'mdl-data-table__cell--non-numeric',
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Load data from url.
   *
   * @private
   */
  CustomAjaxTable.prototype.loadDataFromUrl_ = function(offset, limit, clearLines) {

    if (!this.dataUrl_) {
      throw 'Did you forget to define data-url / form-recipient attribute ?';
    }

    this.changeButtonStatus_(this.refreshActionBt_, 'disabled');
    this.changeButtonStatus_(this.loadMoreActionBt_, 'disabled');

    var ajax = window.ajax;
    this.showLoader_();
    var url = new URL(this.dataUrl_);
    var params = url.searchParams;
    if (this.limitQsName_) {
      url.searchParams.set(this.limitQsName_, limit);
    }
    if (this.offsetQsName_) {
      url.searchParams.set(this.offsetQsName_, offset);
    }
    this.getSortParams_().forEach(function(s) {
      params.append(this.sortQsName_, s);
    }.bind(this));
    var request = ajax().get(url.toString());
    return request.then(function(results) {
      if (clearLines) {
        this.allResults_ = [];
      }
      this.emptyLines_();
      this.allResults_ = this.allResults_.concat(results.Data);
      if (!this.allResults_.length) {
        this.offsetValue_ = 0;
      } else {
        this.offsetValue_ = Math.ceil(this.allResults_.length / this.limitValue_) * this.limitValue_;
      }
      this.setLocationUrl_(this.offsetValue_ - this.limitValue_, this.limitValue_, this.getSortParams_());
      var url = new URL(window.location.href);
      this.sortAllResults_(url);
      if (this.allResults_.length) {
        this.addLines_(this.allResults_);
      }
      this.hideLoader_();
    }.bind(this)).catch(function(response, xhr) {
      window.alert('beep boop');
    });
  };

  /**
   * Load data from the form recipient.
   *
   * @private
   */
  CustomAjaxTable.prototype.loadDataFromFormRecipient_ = function(offset, limit, clearLines) {
    var data = {};
    data[this.offsetQsName_] = offset;
    data[this.limitQsName_] = limit;
    data[this.sortQsName_] = this.getSortParams_();
    this.formRecipient_['CustomFormAjax'].setDataOverride(data);

    this.postSubmitClearLines_ = clearLines;
    this.showLoader_();
    this.formRecipient_['CustomFormAjax'].sendSubmit();
  };

  /**
   * Handles form pre-submit event.
   *
   * @private
   */
  CustomAjaxTable.prototype.formRecipientSubmit_ = function(ev) {

    this.changeButtonStatus_(this.refreshActionBt_, 'disabled');
    this.changeButtonStatus_(this.loadMoreActionBt_, 'disabled');

    ev.preventDefault();
    ev.stopImmediatePropagation();
    this.sourceClick_ = 'form';
    this.loadDataFromFormRecipient_(0, this.limitValue_, true);
  };

  /**
   * Handles form post-submit event.
   *
   * @private
   */
  CustomAjaxTable.prototype.formRecipientPostSubmit_ = function(ev) {

    var data = ev.Data || [];

    if (this.postSubmitClearLines_) {
      this.allResults_ = [];
    }
    this.emptyLines_();

    this.allResults_ = this.allResults_.concat(data);

    if (!this.allResults_.length) {
      this.offsetValue_ = 0;
    } else {
      this.offsetValue_ = Math.ceil(this.allResults_.length / this.limitValue_) * this.limitValue_;
    }

    this.setLocationUrl_(this.offsetValue_ - this.limitValue_, this.limitValue_, this.getSortParams_());

    var url = new URL(window.location.href);
    this.sortAllResults_(url);

    if (this.allResults_.length) {
      this.addLines_(this.allResults_);
    }
    this.hideLoader_();
    this.sourceClick_ = null;
  };

  /**
   * Update current brower url.
   *
   * @private
   */
  CustomAjaxTable.prototype.setLocationUrl_ = function(offset, limit, sort) {
    var url = new URL(window.location.href);

    if (this.sortQsName_) {
      url.searchParams.delete(this.sortQsName_);
      sort.forEach(function(s) {
        url.searchParams.append(this.sortQsName_, s);
      }.bind(this));
    }
    if (this.offsetQsName_) {
      url.searchParams.set(this.offsetQsName_, 0);
    }
    if (this.limitQsName_) {
      url.searchParams.set(this.limitQsName_, limit + (offset < 0 ? 0 : offset));
    }

    var title = '';
    var el = document.getElementsByTagName('title');
    if (el.length) {
      el = el[0].innerHTML;
    }
    window.history.replaceState({}, title, url.toString());
  };

  /**
   * Sorts all results.
   *
   * @private
   */
  CustomAjaxTable.prototype.sortAllResults_ = function(dataUrl) {
    var sort = dataUrl.searchParams.getAll(this.sortQsName_);
    if (sort.length) {
      var k = sort.pop();
      var j = k.split('-');
      var dir = j[j.length - 1];
      var col = k.substr(0, k.length - dir.length - 1);
      var sorter = window.firstBy(col, (dir === 'asc' ? 1 : -1));
      sort.forEach(function(k) {
        var j = k.split('-');
        var dir = j[j.length - 1];
        var col = k.substring(0, k.length - dir.length - 1);
        sorter = sorter.thenBy(col, (dir === 'asc' ? 1 : -1));
      });
      this.allResults_.sort(sorter);
    }
  };

  /**
   * Show a loader over the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.showLoader_ = function() {

    var tbody = this.element_.querySelector('tbody');
    var bodyRect = tbody.getBoundingClientRect();
    tbody.style.minHeight = bodyRect.height + 'px';

    if (this.loader_ && this.loader_['CustomLoaderOver']) {
      this.loader_['CustomLoaderOver'].show(this.element_);
    }
  };

  /**
   * Hide a loader over the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.hideLoader_ = function() {
    var tbody = this.element_.querySelector('tbody');
    tbody.style.minHeight = null;

    if (this.loader_ && this.loader_['CustomLoaderOver']) {
      this.loader_['CustomLoaderOver'].hide(this.element_);
    }

    this.changeButtonStatus_(this.refreshActionBt_);
    this.changeButtonStatus_(this.loadMoreActionBt_);
  };

  /**
   * Change dsibaled button of given selector.
   *
   * @private
   */
  CustomAjaxTable.prototype.changeButtonStatus_ = function(selector, status) {
    if (selector) {
      var k = document.querySelector(selector);
      if (k) {
        if (status) {
          k.setAttribute('disabled', status);
        } else {
          k.removeAttribute('disabled');
        }
      }
    }
  };

  /**
   * Remove lines from the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.emptyLines_ = function() {
    var lines = this.element_.querySelectorAll('tbody > tr');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      this.removeLine_(line);
    }
  };

  /**
   * Remove lines from the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.removeLine_ = function(line) {
    line.style.visibility = 'hidden';
    line.style.height = '0px';
    window['componentHandler'].downgradeElementRecursive(line);
    line.remove();
  };

  /**
   * Add lines to the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.addLines_ = function(results) {
    var thList = this.element_.querySelectorAll('thead > tr > th');
    var tbody = this.element_.querySelector('tbody');
    var isSelectable = this.element_.classList.contains('mdl-data-table--selectable');
    for (var e = 0; e < results.length; e++) {
      var x = e;
      if (x > 0 && x % this.navigationRepeat_ === 0) {
        var helperData = {
          Offset: e,
          Limit: this.limitValue_,
          Next: e + this.limitValue_
        };
        this.addNavigationHelper_(tbody, thList.length + (isSelectable ? 1 : 0), helperData);
      }
      this.addLine_(results[e], thList, tbody, isSelectable);
    }
  };

  /**
   * Add a line to the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.addLine_ = function(data, thList, tbody, isSelectable) {
    var cherry = window.cherry;
    var i = isSelectable ? 1 : 0;

    var row = document.createElement('tr');
    for (i; i < thList.length; i++) {
      var td = document.createElement('td');
      var tdH = thList[i];
      if (tdH.classList.contains(this.CssClasses_.NOT_NUMERIC)) {
        td.classList.add(this.CssClasses_.NOT_NUMERIC);
      }
      var propertyName = tdH.getAttribute('data-name');
      var propertyLink = tdH.getAttribute('data-link');
      if (propertyName) {
        td.innerHTML = data[propertyName];
      } else if (propertyLink) {
        var template = tdH.querySelector('.template');
        td.innerHTML = template.innerHTML;
        var link = td.querySelector('a');
        link.setAttribute('href', cherry.lightTemplate(propertyLink, data));
      }
      row.appendChild(td);
    }
    if (this.checkboxDataValue_) {
      row.setAttribute('checkbox-value', data[this.checkboxDataValue_]);
    }
    if (this.isSelectable_) {
      this.element_['CustomDataTable'].addCheckboxToRow_(row);
    }
    tbody.appendChild(row);
  };

  /**
   * Add a line to the table body.
   *
   * @private
   */
  CustomAjaxTable.prototype.addNavigationHelper_ = function(tbody, tdLen, data) {
    var cherry = window.cherry;
    if (this.navigationHelper_) {
      var row = this.navigationHelper_.cloneNode(true);
      row.classList.remove('template');
      var td = row.querySelector('td');
      if (td.getAttribute('collapse') === 'auto') {
        td.setAttribute('colspan', tdLen);
      }
      td.innerHTML = cherry.lightTemplate(td.innerHTML, data);
      tbody.appendChild(row);
    }
  };

  /**
   * Sort the sorting array according to the click order.
   * Uses current window url to achieve it.
   *
   * @private
   */
  CustomAjaxTable.prototype.sortSortCols = function(sort) {
    var searchParams = window.location.search.slice(1);
    var QsParams = new window.URLSearchParams(searchParams);
    var urlSort = QsParams.getAll(this.sortQsName_);
    urlSort.forEach(function(s, i) {
      urlSort[i] = s.replace(/(-asc|-desc)$/, '');
    });
    sort.sort(function(a, b) {
      a = a.replace(/(-asc|-desc)$/, '');
      b = b.replace(/(-asc|-desc)$/, '');
      a = urlSort.indexOf(a);
      b = urlSort.indexOf(b);
      if (b < 0) {
        return -1;
      }
      if (a < 0) {
        return 1;
      }
      return a < b ? -1 : 1;
    });
  };

  /**
   * Returns an array of sorting value given the column status.
   *
   * @private
   */
  CustomAjaxTable.prototype.getColSort_ = function() {
    var sort = [];
    var thList = this.element_.querySelectorAll('thead > tr > th[data-name]');
    for (var i = 0; i < thList.length; i++) {
      var th = thList[i];
      var col = th.getAttribute('data-name');
      if (th.classList.contains(this.CssClasses_.SORT_ASC)) {
        sort.push(col + '-asc');
      } else if (th.classList.contains(this.CssClasses_.SORT_DESC)) {
        sort.push(col + '-desc');
      }
    }
    return sort;
  };

  /**
   * Returns an array of sorting value given the column status,
   * ordered appropriately.
   *
   * @private
   */
  CustomAjaxTable.prototype.getSortParams_ = function() {
    var sort = this.getColSort_();
    this.sortSortCols(sort);
    return sort;
  };

  /**
   * Given an header column, tells if can sort.
   *
   * @private
   */
  CustomAjaxTable.prototype.canSort_ = function(trHead) {
    if (trHead.classList.contains(this.CssClasses_.SORT_ASC)) {
      return true;
    }
    if (trHead.classList.contains(this.CssClasses_.SORT_DESC)) {
      return true;
    }
    if (trHead.classList.contains(this.CssClasses_.SORT_ABLE)) {
      return true;
    }
    return false;
  };

  /**
   * Given current url, setup sort column display.
   *
   * @private
   */
  CustomAjaxTable.prototype.setupSortcolumnDisplay_ = function() {
    var Sorts = this.QsParams_.getAll(this.sortQsName_);
    var trHead = this.element_.querySelector('thead > tr');
    Sorts.forEach(function(Sort) {
      var k = Sort.split('-');
      var dir = k[k.length - 1];
      var col = Sort.substr(0, Sort.length - dir.length - 1);
      var th = trHead.querySelector('th[data-name="' + col + '"]');
      if (th && this.canSort_(th)) {
        th.classList.remove(this.CssClasses_.SORT_ASC);
        th.classList.remove(this.CssClasses_.SORT_DESC);
        th.classList.remove(this.CssClasses_.SORT_ABLE);
        if (dir === 'desc') {
          th.classList.add(this.CssClasses_.SORT_DESC);
        }else if (dir === 'desc') {
          th.classList.add(this.CssClasses_.SORT_ASC);
        } else {
          th.classList.add(this.CssClasses_.SORT_ABLE);
        }
      }
    }.bind(this));
  };

  /**
   * Take a portion of url and make is parasable by URL api.
   * Uses current url to fill in the holes.
   *
   * @private
   */
  CustomAjaxTable.prototype.makeProperUrl = function(url) {
    if (url && !url.match(/^http/)) {
      if (!url.match(/^\//)) {
        if (window.location.pathname) {
          var d = window.location.pathname.replace(/[^/]+$/, '');
          url = d + url;
        } else {
          url = '/' + url;
        }
      }
      if (window.location.port) {
        url = ':' + window.location.port + url;
      }
      url = window.location.hostname + url;
      url = window.location.protocol + '//' + url;
    }
    return url;
  };

  /**
   * Handles load more btn click event.
   *
   * @private
   */
  CustomAjaxTable.prototype.onLoadMoreClick_ = function() {
    if (this.formRecipient_) {
      this.sourceClick_ = 'table';
      this.loadDataFromFormRecipient_(this.offsetValue_, this.limitValue_, false);
    } else {
      this.loadDataFromUrl_(this.offsetValue_, this.limitValue_, false);
    }
  };

  /**
   * Handles load more btn click event.
   *
   * @private
   */
  CustomAjaxTable.prototype.onRefreshClick_ = function() {
    if (this.formRecipient_) {
      this.sourceClick_ = 'table';
      this.loadDataFromFormRecipient_(0, this.offsetValue_, true);
    } else {
      this.loadDataFromUrl_(0, this.offsetValue_, true);
    }
  };

  /**
   * Handles sort link click event.
   *
   * @private
   */
  CustomAjaxTable.prototype.onSortClick_ = function(th) {
    if (th.classList.contains(this.CssClasses_.SORT_ASC)) {
      th.classList.remove(this.CssClasses_.SORT_ASC);
      th.classList.add(this.CssClasses_.SORT_DESC);
    } else if (th.classList.contains(this.CssClasses_.SORT_DESC)) {
      th.classList.remove(this.CssClasses_.SORT_DESC);
      th.classList.add(this.CssClasses_.SORT_ABLE);
    } else {
      th.classList.remove(this.CssClasses_.SORT_ABLE);
      th.classList.add(this.CssClasses_.SORT_ASC);
    }
    this.onRefreshClick_();
  };

  /**
   * Handles sort link click event.
   *
   * @private
   */
  CustomAjaxTable.prototype.onSortAClick_ = function(ev) {
    ev.preventDefault();
    var link = ev.target;
    var th = link.parentNode;
    this.onSortClick_(th);
  };

  /**
   * Handles sort link click event.
   *
   * @private
   */
  CustomAjaxTable.prototype.onSortThClick_ = function(ev) {
    ev.preventDefault();
    var th = ev.target;
    this.onSortClick_(th);
  };

  /**
   * Initialize element.
   */
  CustomAjaxTable.prototype.init = function() {
    if (this.element_) {
      var cherry = window.cherry;

      this.allResults_ = [];
      this.checkboxDataValue_ = this.element_.getAttribute('checkbox-property-value');
      this.loadMoreActionBt_ = this.element_.getAttribute('loadmore-action-bt');
      this.refreshActionBt_ = this.element_.getAttribute('refresh-action-bt');
      this.sortQsName_ = this.element_.getAttribute('sort-qs-name');
      this.limitQsName_ = this.element_.getAttribute('limit-qs-name');
      this.offsetQsName_ = this.element_.getAttribute('offset-qs-name');
      this.limitValue_ = this.element_.getAttribute('limit-value');
      this.limitValue_ = parseInt(this.limitValue_);
      this.isSelectable_ = this.element_.classList.contains(this.CssClasses_.SELECTABLE);

      this.dataUrl_ = this.element_.getAttribute('data-url');
      if (this.dataUrl_) {
        this.dataUrl_ = this.makeProperUrl(this.dataUrl_);
      }
      this.formRecipientSel_ = this.element_.getAttribute('form-recipient');
      this.formRecipient_ = document.querySelector(this.formRecipientSel_);
      if (this.formRecipient_) {
        cherry.on(this.formRecipient_, 'post-submit', this.formRecipientPostSubmit_).bind(this);
      }

      var searchParams = window.location.search.slice(1);
      this.QsParams_ = new window.URLSearchParams(searchParams);
      this.offsetValue_ = 0;
      this.initialOffsetValue_ = 0;
      if (this.QsParams_.has(this.offsetQsName_)) {
        this.offsetValue_ = this.QsParams_.get(this.offsetQsName_);
        this.offsetValue_ = parseInt(this.offsetValue_);
        this.initialOffsetValue_ = this.offsetValue_;
      }

      this.navigationRepeat_ = this.limitValue_;
      this.navigationHelper_ = this.element_.querySelector('tbody > .navigation-helper');
      if (this.navigationHelper_) {
        this.navigationHelper_.remove();
        if (this.navigationHelper_.hasAttribute('show-nav-helper-every')) {
          this.navigationRepeat_ = parseInt(this.navigationHelper_.getAttribute('show-nav-helper-every'));
        }
      }

      this.loader_ = this.element_.getAttribute('loader-selector');
      this.loader_ = document.querySelector(this.loader_);

      this.setupSortcolumnDisplay_();
      var initLimit = this.limitValue_;
      if (this.QsParams_.has(this.limitQsName_)) {
        initLimit = this.QsParams_.get(this.limitQsName_);
        initLimit = parseInt(initLimit);
      }

      /**
      * xx
      */
      var initialLoad = function() {
        if (this.formRecipient_) {
          cherry.on(this.formRecipient_, 'submit', this.formRecipientSubmit_).bind(this).first();
          this.sourceClick_ = 'table';
          if (!this.formRecipient_.classList.contains('is-upgraded')) {
            cherry.once(this.formRecipient_, 'mdl-componentupgraded', function() {
              this.loadDataFromFormRecipient_(0, initLimit, true);
            }).bind(this);
          } else {
            this.loadDataFromFormRecipient_(0, initLimit, true);
          }
        } else {
          this.loadDataFromUrl_(0, initLimit, true);
        }
      };
      if (this.loader_ && !this.loader_.classList.contains('is-upgraded')) {
        cherry.once(this.loader_, 'mdl-componentupgraded', initialLoad).bind(this);
      } else {
        initialLoad.bind(this)();
      }

      var sortLinks = this.element_.querySelectorAll('thead tr th a');
      if (sortLinks.length) {
        cherry.on(sortLinks,
          'CustomAjaxTable.click',
          this.onSortAClick_
        ).bind(this);
      } else {
        var sortTh = this.element_.querySelectorAll('thead tr th');
        cherry.on(sortTh,
          'CustomAjaxTable.click',
          this.onSortThClick_
        ).bind(this);
      }

      if (this.loadMoreActionBt_) {
        cherry.on(this.loadMoreActionBt_,
          'CustomAjaxTable.click',
          this.onLoadMoreClick_
        ).bind(this);
      }

      if (this.refreshActionBt_) {
        cherry.on(this.refreshActionBt_,
          'CustomAjaxTable.click',
          this.onRefreshClick_
        ).bind(this);
      }

    }
  };

  /**
   * Downgrade element.
   */
  CustomAjaxTable.prototype.mdlDowngrade_ = function() {
    var cherry = window.cherry;
    cherry.off(this.refreshActionBt_, 'CustomAjaxTable.click', this.onRefreshClick_);
    cherry.off(this.loadMoreActionBt_, 'CustomAjaxTable.click', this.onLoadMoreClick_);

    var sortALinks = this.element_.querySelectorAll('thead tr th a');
    cherry.off(sortALinks, 'CustomAjaxTable.click', this.onSortAClick_);

    var sortThLinks = this.element_.querySelectorAll('thead tr th');
    cherry.off(sortThLinks, 'CustomAjaxTable.click', this.onSortThClick_);

    if (this.formRecipient_) {
      cherry.off(this.formRecipient_, 'submit', this.formRecipientSubmit_);
      cherry.off(this.formRecipient_, 'post-submit', this.formRecipientPostSubmit_);
    }

    this.loader_ = null;
    this.navigationRepeat_ = null;
    this.navigationHelper_ = null;
    this.allResults_ = null;
    this.checkboxDataValue_ = null;
    this.loadMoreActionBt_ = null;
    this.refreshActionBt_ = null;
    this.sortQsName_ = null;
    this.offsetQsName_ = null;
    this.limitValue_ = null;
    this.dataUrl_ = null;
    this.QsParams_ = null;
    this.offsetValue_ = null;
    this.initialOffsetValue_ = null;

    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomAjaxTable,
    classAsString: 'CustomAjaxTable',
    cssClass: 'custom-js-ajax-table'
  });
})();
