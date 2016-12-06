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

 templatesLoader.register('CHIPAUTOCOMPLETE', '/src/custom-chipautocomplete/snippets/chipautocomplete.html');
 templatesLoader.register('CHIPAUTOCOMPLETE_CREATOR', '/src/custom-chipautocomplete/snippets/chipautocomplete-creator.html');

describe('CustomChipAutocomplete', function () {

  var defTout = 250;

  it('should be globally available', function () {
    expect(CustomChipAutocomplete).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var chipautocomplete = el.querySelector('.custom-chipautocomplete')
    expect(chipautocomplete.getAttribute('data-upgraded')).to.be.equal(',CustomChipAutocomplete');

    componentHandler.downgradeElementRecursive(el);
    expect(chipautocomplete.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  if (window._phantom) {
    it.skip('not running on PhantomJS');
    return true;
  }

  it('should show results on focus', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var chipautocomplete = el.querySelector('.custom-chipautocomplete')
    expect(chipautocomplete.getAttribute('data-upgraded')).to.be.equal(',CustomChipAutocomplete');

    var results = document.querySelector('.custom-chipautocomplete-results');
    var input = chipautocomplete.querySelector('input[type="text"]');

    var styles = window.getComputedStyle(results);
    expect(styles.display).to.be.equal('none');
    input.focus();
    setTimeout(function() {
      styles = window.getComputedStyle(results);
      expect(styles.display).to.be.equal('block');
      input.blur();
      setTimeout(function() {
        styles = window.getComputedStyle(results);
        expect(styles.display).to.be.equal('none');
        componentHandler.downgradeElementRecursive(el);
        el.remove();
        done();
      }, 200);
    }, 100);
  });

  it('should add selected result to the chips', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var chipautocomplete = el.querySelector('.custom-chipautocomplete');
    var results = el.querySelector('.custom-chipautocomplete-results');
    var chips = el.querySelector('.custom-chipautocomplete-selected');
    componentHandler.upgradeElements(el);
    expect(chipautocomplete.getAttribute('data-upgraded')).to.be.equal(',CustomChipAutocomplete');

    var input = chipautocomplete.querySelector('input[type="text"]');

    var styles = window.getComputedStyle(results);
    expect(styles.display).to.be.equal('none', 'initial display must be none');
    input.focus();
    setTimeout(function() {
      var result = results.querySelector('li span');
      var text = result.innerHTML;
      result.click();
      setTimeout(function() {
        var chipSelected = chips.querySelectorAll('.mdl-chip');
        expect(chipSelected.length).to.be.equal(1);
        var chipText = chipSelected[0].querySelector('.mdl-chip__text');
        expect(chipText.innerHTML).to.be.equal(text);

        input.blur();
        componentHandler.downgradeElementRecursive(el);
        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should filter out selected chip from the results list', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var chipautocomplete = el.querySelector('.custom-chipautocomplete');
    var results = el.querySelector('.custom-chipautocomplete-results');
    var chips = el.querySelector('.custom-chipautocomplete-selected');
    componentHandler.upgradeElements(el);
    expect(chipautocomplete.getAttribute('data-upgraded')).to.be.equal(',CustomChipAutocomplete');

    var input = chipautocomplete.querySelector('input[type="text"]');

    input.focus();
    setTimeout(function() {
      var result = results.querySelector('li span');
      var text = result.innerHTML;
      result.click();
      setTimeout(function() {
        input.blur();
        setTimeout(function() {
          input.focus();

          setTimeout(function() {
            var itemresults = results.querySelectorAll('li span');
            for (var i = 0; i < itemresults.length; i++) {
              expect(itemresults[i].innerHTML).to.not.equal(text);
            }

            componentHandler.downgradeElementRecursive(el);
            el.remove();
            done();
          }, defTout);
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should remove clicked chip from the selection', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var chipautocomplete = el.querySelector('.custom-chipautocomplete');
    var results = el.querySelector('.custom-chipautocomplete-results');
    var chips = el.querySelector('.custom-chipautocomplete-selected');
    componentHandler.upgradeElements(el);

    var input = chipautocomplete.querySelector('input[type="text"]');

    input.focus();
    setTimeout(function() {
      var result = results.querySelector('li span');
      result.click();
      setTimeout(function() {
        var chipSelected = chips.querySelectorAll('.mdl-chip');
        chipSelected[0].querySelector('button').click();
        input.blur();

        setTimeout(function() {
          chipSelected = chips.querySelectorAll('.mdl-chip');
          expect(chipSelected.length).to.be.equal(0);

          componentHandler.downgradeElementRecursive(el);
          el.remove();
          done();
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should show the "type more text" results option', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var chipautocomplete = el.querySelector('.custom-chipautocomplete');
    var results = el.querySelector('.custom-chipautocomplete-results');
    var chips = el.querySelector('.custom-chipautocomplete-selected');
    var url = chipautocomplete.getAttribute('url-completer');
    chipautocomplete.setAttribute('url-completer', url.replace(/List=[a-z0-9]+/, 'List=list3'));
    chipautocomplete.setAttribute('txt-type-more', 'type more');
    var typeMoreText = 'type more';
    componentHandler.upgradeElements(el);

    var input = chipautocomplete.querySelector('input[type="text"]');

    input.focus();
    setTimeout(function() {
      var result = results.querySelectorAll('li span');
      expect(result.length).to.be.equal(1);
      expect(result[0].innerHTML).to.be.equal(typeMoreText);
      setTimeout(function() {
        input.blur();
        setTimeout(function() {
          componentHandler.downgradeElementRecursive(el);
          el.remove();
          done();
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should show the "empty" results option', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var chipautocomplete = el.querySelector('.custom-chipautocomplete');
    var results = el.querySelector('.custom-chipautocomplete-results');
    var chips = el.querySelector('.custom-chipautocomplete-selected');
    var url = chipautocomplete.getAttribute('url-completer');
    chipautocomplete.setAttribute('url-completer', url.replace(/List=[a-z0-9]+/, 'List=list3'));
    chipautocomplete.setAttribute('txt-no-results', 'no res');
    var noResText = 'no res';
    componentHandler.upgradeElements(el);

    var input = chipautocomplete.querySelector('input[type="text"]');

    input.value = 'kkkkkk';
    input.focus();
    setTimeout(function() {
      var result = results.querySelectorAll('li span');
      expect(result.length).to.be.equal(1);
      expect(result[0].innerHTML).to.be.equal(noResText);
      setTimeout(function() {
        input.blur();

        setTimeout(function() {
          componentHandler.downgradeElementRecursive(el);
          el.remove();
          done();
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should show the "unreachable" text', function (done) {
    var TEMPLATE = templatesLoader.get('CHIPAUTOCOMPLETE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var chipautocomplete = el.querySelector('.custom-chipautocomplete');
    var textfield = el.querySelector('.mdl-textfield');
    var errfield = el.querySelector('.mdl-textfield__error');
    chipautocomplete.setAttribute('url-completer', 'rrrrr');
    chipautocomplete.setAttribute('txt-remote-unreachable', 'nopnop');
    var unreachableText = 'nopnop';
    componentHandler.upgradeElements(el);

    var input = chipautocomplete.querySelector('input[type="text"]');

    input.focus();
    setTimeout(function() {
      expect(textfield.classList.contains('is-invalid')).to.be.equal(true);
      expect(errfield.innerHTML).to.be.equal(unreachableText);
      setTimeout(function() {
        input.blur();
        setTimeout(function() {
          componentHandler.downgradeElementRecursive(el);
          el.remove();
          done();
        }, defTout);
      }, defTout);
    }, defTout);
  });


});
