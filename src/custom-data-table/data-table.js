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
  var CustomDataTable = function CustomDataTable(element) {
    this.element_ = element;
    this.btEl_ = null;

    // Initialize instance.
    this.init();
  };

  window['CustomDataTable'] = CustomDataTable;

  /**
   * Store constants in one place so they can be updated easily.
   *
   * @enum {string | number}
   * @private
   */
  CustomDataTable.prototype.Constant_ = {
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
  CustomDataTable.prototype.CssClasses_ = {
    DATA_TABLE: 'mdl-data-table',
    SELECTABLE: 'mdl-data-table--selectable',
    SELECT_ELEMENT: 'mdl-data-table__select',
    IS_SELECTED: 'is-selected',
    IS_UPGRADED: 'is-upgraded'
  };

  /**
   * Creates a checkbox for a single or or multiple rows and hooks up the
   * event handling.
   *
   * @param {Element} row Row to toggle when checkbox changes.
   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
   * @private
   */
  CustomDataTable.prototype.createCheckbox_ = function(row, opt_rows) {
    var label = document.createElement('label');
    var labelClasses = [
      'mdl-checkbox',
      'mdl-js-checkbox',
      'mdl-js-ripple-effect',
      this.CssClasses_.SELECT_ELEMENT
    ];
    label.className = labelClasses.join(' ');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('mdl-checkbox__input');

    if (row) {
      if (row.getAttribute('value')) {
        checkbox.value = row.getAttribute('value');
      }
      checkbox.checked = row.classList.contains(this.CssClasses_.IS_SELECTED);
    }

    label.appendChild(checkbox);
    componentHandler.upgradeElement(label, 'MaterialCheckbox');
    return label;
  };

  /**
   * Enables or disables associated bt-el.
   *
   * @private
   */
  CustomDataTable.prototype.updateBt_ = function(btEl) {
    var sTr = this.element_.querySelectorAll('tr.is-selected');
    if (sTr.length) {
      this.btEl_.removeAttribute('disabled');
    } else {
      this.btEl_.setAttribute('disabled', 'disabled');
    }
  };

  /**
   * Initialize element.
   */
  CustomDataTable.prototype.init = function() {
    if (this.element_) {
      var firstHeader = this.element_.querySelector('th');
      var bodyRows = Array.prototype.slice.call(this.element_.querySelectorAll('tbody tr'));
      var footRows = Array.prototype.slice.call(this.element_.querySelectorAll('tfoot tr'));
      var rows = bodyRows.concat(footRows);

      if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
        var th = document.createElement('th');
        var headerCheckbox = this.createCheckbox_(null, rows);
        th.appendChild(headerCheckbox);
        firstHeader.parentElement.insertBefore(th, firstHeader);

        for (var i = 0; i < rows.length; i++) {
          var firstCell = rows[i].querySelector('td');
          if (firstCell) {
            var td = document.createElement('td');
            if (rows[i].parentNode.nodeName.toUpperCase() === 'TBODY') {
              var rowCheckbox = this.createCheckbox_(rows[i]);
              td.appendChild(rowCheckbox);
            }
            rows[i].insertBefore(td, firstCell);
          }
        }
        this.element_.classList.add(this.CssClasses_.IS_UPGRADED);

        var that = this;
        var cherry = window.cherry;
        this.element_.__selectall = cherry.delegateEvent(this.element_, 'change', 'input[type="checkbox"]', function() {
          var cb = this;
          var row = cherry.getParentsUntil(this, 'tr');
          if (row) {
            row = row.pop().parentNode;
            var isHeader = row.querySelectorAll('th').length > 0;

            if (isHeader) {
              var cell;
              cell = cherry.getParentsUntil(this, 'th');
              cell = cell.pop().parentNode;

              if (isHeader) {
                var rows = that.element_.querySelectorAll('tbody > tr');
                for (var i = 0; i < rows.length; i++) {
                  if (cb.checked) {
                    rows[i].classList.add(that.CssClasses_.IS_SELECTED);
                  } else {
                    rows[i].classList.remove(that.CssClasses_.IS_SELECTED);
                  }
                  var rowCb = rows[i].querySelector('td:nth-child(1) .mdl-checkbox');
                  if (rowCb) {
                    if (cb.checked) {
                      rowCb['MaterialCheckbox'].check();
                    } else {
                      rowCb['MaterialCheckbox'].uncheck();
                    }
                  }
                }
              }
            } else {
              if (cb.checked) {
                row.classList.add(that.CssClasses_.IS_SELECTED);
              } else {
                row.classList.remove(that.CssClasses_.IS_SELECTED);
              }
            }
          }

          if (that.btEl_) {
            that.updateBt_();
          }
        });
      }

      if (this.element_.hasAttribute('bt-el')) {
        this.btEl_ = document.querySelector(this.element_.getAttribute('bt-el'));
        this.updateBt_();
      }
    }
  };

  /**
   * Downgrade element.
   */
  CustomDataTable.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('change', this.element_.__selectall);
    this.element_.classList.remove(this.CssClasses_.IS_UPGRADED);
  };

  // The component registers itself. It can assume componentHandler is available
  // in the global scope.
  componentHandler.register({
    constructor: CustomDataTable,
    classAsString: 'CustomDataTable',
    cssClass: 'custom-js-data-table'
  });
})();
