/**
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

templatesLoader.register('DATATABLE', '/src/custom-data-table/snippets/data-table.html');
templatesLoader.register('DATATABLE_SELECTALE', '/src/custom-data-table/snippets/data-table-selectable.html');
templatesLoader.register('DATATABLE_SORT', '/src/custom-data-table/snippets/data-table-sortable.html');

describe('CustomDataTable', function () {

  it('should be globally available', function () {
    expect(CustomDataTable).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');

    componentHandler.upgradeElements(el);
    expect(table.getAttribute('data-upgraded')).to.not.equal('');
    expect(table.getAttribute('data-upgraded')).to.be.equal(',CustomDataTable');

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should have is-checked class when the row has the is-selected class', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE_SELECTALE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    table = document.querySelector('#data-table-test')
    componentHandler.upgradeElements(table);
    expect(table.querySelector('.second-row label').classList.contains('is-checked')).to.be.true;

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should check all lines when header checkbox is clicked', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE_SELECTALE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    table = document.querySelector('#data-table-test')
    componentHandler.upgradeElements(table);

    var cbHead = table.querySelectorAll('thead tr th input');
    cbHead[0].click();

    var cbBody = table.querySelectorAll('tbody tr td input');
    for (var i = 0; i < cbBody.length; i++) {
      expect(cbBody[i].checked).to.be.equal(true);
    }

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should set checkbox names when checkbox-name attribute is set', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE_SELECTALE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    componentHandler.upgradeElements(el);

    var cbHead = table.querySelectorAll('thead tr th input');
    expect(cbHead[0].name).to.be.equal('');

    var cbBody = table.querySelectorAll('tbody tr td input');
    for (var i = 0; i < cbBody.length; i++) {
      expect(cbBody[i].name).to.be.equal('cbname');
    }

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should set checkbox values when checkbox-value attribute is set', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE_SELECTALE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    componentHandler.upgradeElements(el);

    var cbBody = table.querySelectorAll('tbody tr td input');
    expect(cbBody[0].value).to.be.equal('1');
    expect(cbBody[1].value).to.be.equal('2');

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should trigger sort link when the td is clicked', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE_SORT');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    componentHandler.upgradeElements(el);

    var clicked = false;
    var a = table.querySelectorAll('thead tr th a');
    for (var i = 0; i < a.length; i++) {
      a[i].addEventListener('click', function (ev) {
        ev.preventDefault();
        clicked = true;
      });
    }

    var th = table.querySelectorAll('thead tr th');
    th[1].click();
    expect(clicked).to.be.equal(true);

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should enable the checkbox action bt', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE_SORT');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    componentHandler.upgradeElements(el);

    var cbHead = table.querySelectorAll('thead tr th input');
    cbHead[0].click();
    cbHead[0].click(); // need twice click to uncheck all cb

    var bt = el.querySelectorAll('button');
    expect(bt[0].getAttribute('disabled')).to.be.equal('disabled');

    cbHead[0].click();
    expect(bt[0].getAttribute('disabled')).to.not.equal('disabled');

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should upgrade a non selectable table', function () {
    var TEMPLATE = templatesLoader.get('DATATABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');

    componentHandler.upgradeElements(el);
    expect(table.getAttribute('data-upgraded')).to.not.equal('');
    expect(table.getAttribute('data-upgraded')).to.be.equal(',CustomDataTable');

    var cbHead = table.querySelectorAll('thead tr th input');
    expect(cbHead.length).to.be.equal(0);

    var cbBody = table.querySelectorAll('tbody tr td input');
    expect(cbBody.length).to.be.equal(0);

    componentHandler.downgradeElementRecursive(el);
    expect(table.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

});
