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
   * Generates and returns a function that toggles the selection state of a
   * single row (or multiple rows).
   *
   * @param {Element} checkbox Checkbox that toggles the selection state.
   * @param {Element} row Row to toggle when checkbox changes.
   * @param {(Array<Object>|NodeList)=} opt_rows Rows to toggle when checkbox changes.
   * @private
   */
  CustomDataTable.prototype.selectRow_ = function(checkbox, row, opt_rows) {
    if (row) {
      return function() {
        if (checkbox.checked) {
          row.classList.add(this.CssClasses_.IS_SELECTED);
        } else {
          row.classList.remove(this.CssClasses_.IS_SELECTED);
        }
      }.bind(this);
    }

    if (opt_rows) {
      return function() {
        var i;
        var el;
        if (checkbox.checked) {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
            el['MaterialCheckbox'].check();
            opt_rows[i].classList.add(this.CssClasses_.IS_SELECTED);
          }
        } else {
          for (i = 0; i < opt_rows.length; i++) {
            el = opt_rows[i].querySelector('td').querySelector('.mdl-checkbox');
            el['MaterialCheckbox'].uncheck();
            opt_rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
          }
        }
      }.bind(this);
    }
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
      checkbox.__fn = this.selectRow_(checkbox, row);
      checkbox.addEventListener('change', checkbox.__fn);
    } else if (opt_rows) {
      checkbox.__fn = this.selectRow_(checkbox, null, opt_rows);
      checkbox.addEventListener('change', checkbox.__fn);
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
    var table = this.element_;
    var sTr = table.querySelectorAll('tbody > .is-selected');
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
      }

      if (this.element_.hasAttribute('bt-el')) {
        this.btEl_ = document.querySelector(this.element_.getAttribute('bt-el'));
        if (this.btEl_) {
          this.btEl_.__fn = this.updateBt_.bind(this);
          this.element_.addEventListener('change', this.btEl_.__fn);
          this.updateBt_();
        }
      }
    }
  };

  /**
   * Downgrade element.
   */
  CustomDataTable.prototype.mdlDowngrade_ = function() {
    this.element_.removeEventListener('change', this.btEl_.__fn);
    var checkboxes = this.element_.querySelectorAll('tbody tr td input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].removeEventListener('change', checkboxes[i].__fn);
      checkboxes[i].__fn = null;
    }
    var allCheckbox = this.element_.querySelectorAll('tbody th td input[type="checkbox"]');
    for (var e = 0; e < allCheckbox.length; i++) {
      allCheckbox[i].removeEventListener('change', allCheckbox[i].__fn);
      allCheckbox[i].__fn = null;
    }
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
