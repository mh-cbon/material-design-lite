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

templatesLoader.register('DATEFIELD', '/src/custom-datefield/snippets/datefield.html');

describe('CustomDateField', function () {

  var defTout = 250;

  it('should be globally available', function () {
    expect(CustomDateField).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var TEMPLATE = templatesLoader.get('DATEFIELD');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var datefield = el.querySelector('.custom-js-datefield')
    expect(datefield.getAttribute('data-upgraded')).to.be.equal(',MaterialTextfield,CustomDateField');

    componentHandler.downgradeElementRecursive(el);
    expect(datefield.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should display the datefield component', function (done) {
    var TEMPLATE = templatesLoader.get('DATEFIELD');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var datefield = el.querySelector('.custom-js-datefield');
    var input = datefield.querySelector('.mdl-textfield__input');

    input.click();
    setTimeout(function() {
      var picker = document.querySelector('.mddtp-picker');
      expect(picker).to.not.equal(null);
      var cells = document.querySelectorAll('.mddtp-picker__cell');
      expect(cells.length).to.not.equal(0);

      componentHandler.downgradeElementRecursive(el);
      el.remove();
      setTimeout(done, 500);
    }, 500);
  });

  it('should update values on ok click', function (done) {
    var TEMPLATE = templatesLoader.get('DATEFIELD');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var datefield = el.querySelector('.custom-js-datefield');
    var input = datefield.querySelector('.mdl-textfield__input');
    var dateval = datefield.querySelector('.custom-datefield__value');

    input.click();
    setTimeout(function() {
      var cells = document.querySelectorAll('.mddtp-picker__cell');
      cells[1].click();
      var ok = document.getElementById('mddtp-date__ok');
      ok.click();
      expect(dateval.value).to.be.equal('2016-11-02T00:00:01+00:00');
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      setTimeout(done, 500);
    }, 500);
  });

  it('should not update values on cancel click', function (done) {
    var TEMPLATE = templatesLoader.get('DATEFIELD');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var datefield = el.querySelector('.custom-js-datefield');
    var input = datefield.querySelector('.mdl-textfield__input');
    var dateval = datefield.querySelector('.custom-datefield__value');

    input.click();
    setTimeout(function() {
      var cells = document.querySelectorAll('.mddtp-picker__cell');
      cells[1].click();
      var cancel = document.getElementById('mddtp-date__cancel');
      cancel.click();
      expect(dateval.value).to.be.equal('2016-11-09T00:00:01Z');
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      setTimeout(done, 500);
    }, 500);
  });

  it.skip('should display the calendar with the right language')
  it.skip('should display the date value with the right format')
  it.skip('should set the display mode')
  it.skip('should change ok button text')
  it.skip('should change cancel button text')
});
