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

templatesLoader.register('AJAX_TABLE', '/src/custom-ajax-table/snippets/ajax-table.html');
templatesLoader.register('AJAX_TABLE_SELECTABLE', '/src/custom-ajax-table/snippets/ajax-table-selectable.html');
templatesLoader.register('AJAX_TABLE_SELECTABLE_CTRLS', '/src/custom-ajax-table/snippets/ajax-table-selectable-controls.html');
templatesLoader.register('AJAX_TABLE_SORTABLE_CTRLS', '/src/custom-ajax-table/snippets/ajax-table-sortable-controls.html');
templatesLoader.register('AJAX_TABLE_SORTABLE_LINKS_CTRLS', '/src/custom-ajax-table/snippets/ajax-table-sortable-controls-links.html');

describe('CustomAjaxTable', function () {

  var defTout = 200;

  function removeUrlParams() {
    var url = new URL(window.location.href);
    url.searchParams.delete("Limit")
    url.searchParams.delete("Offset")
    url.searchParams.delete("Sort")

    var title = '';
    var el = document.getElementsByTagName('title');
    if (el.length) {
      el = el[0].innerHTML;
    }
    window.history.replaceState({}, title, url.toString());
  }
  beforeEach(removeUrlParams);
  afterEach(removeUrlParams);

  it('should be globally available', function () {
    expect(CustomAjaxTable).to.be.a('function');
  });

  if (window._phantom) {
    it.skip('not running on PhantomJS');
    return true;
  }

  it('should upgrade successfully', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');

    componentHandler.upgradeElements(el);
    expect(table.getAttribute('data-upgraded')).to.not.equal('');
    expect(table.getAttribute('data-upgraded')).to.be.equal(',CustomDataTable,CustomAjaxTable');

    setTimeout(function() {
      componentHandler.downgradeElementRecursive(el);
      expect(table.getAttribute('data-upgraded')).to.be.equal('');
      el.remove();
      done();
    }, defTout);
  });

  it('should respect limit attribute value', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var tr = table.querySelectorAll('tbody tr');
      expect(tr.length).to.be.equal(2);

      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);

  });

  it('should set cell texts according to data-name', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var tr = table.querySelectorAll('tbody tr')[0];
      var td = table.querySelectorAll('td');
      expect(td[0].innerHTML).to.be.equal('Wood (1)');
      expect(td[3].innerHTML).to.be.equal('Concrete (2)');

      componentHandler.downgradeElementRecursive(el);
      expect(table.getAttribute('data-upgraded')).to.be.equal('');

      el.remove();
      done();
    }, defTout * 2);

  });

  it('should set checkbox values according to data-name', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var cbBody = table.querySelectorAll('tbody tr td input')[0];
      expect(cbBody.value).to.be.equal('1');

      componentHandler.downgradeElementRecursive(el);
      expect(table.getAttribute('data-upgraded')).to.be.equal('');

      el.remove();
      done();
    }, defTout);

  });

  it('should update the window url', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var url = new URL(window.location.href);
      expect(url.searchParams.get("Limit")).to.be.equal('2');
      expect(url.searchParams.get("Offset")).to.be.equal('0');

      componentHandler.downgradeElementRecursive(el);
      expect(table.getAttribute('data-upgraded')).to.be.equal('');

      el.remove();
      done();
    }, defTout);
  });

  it('should load more on bt load more click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var loadmore = el.querySelector('#loadmore');
      loadmore.click();
      setTimeout(function() {
        var tr = table.querySelectorAll('tbody tr');
        expect(tr.length).to.be.equal(4);

        componentHandler.downgradeElementRecursive(el);
        expect(table.getAttribute('data-upgraded')).to.be.equal('');

        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should update window url on bt load more click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var loadmore = el.querySelector('#loadmore');
      loadmore.click();
      setTimeout(function() {
        var url = new URL(window.location.href);
        expect(url.searchParams.get("Limit")).to.be.equal('4');
        expect(url.searchParams.get("Offset")).to.be.equal('0');

        componentHandler.downgradeElementRecursive(el);
        expect(table.getAttribute('data-upgraded')).to.be.equal('');

        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should refresh on bt refresh click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var refresh = el.querySelector('#refresh');
      refresh.click();
      var tr = table.querySelectorAll('tbody tr');
      tr = [].slice.call(tr);
      setTimeout(function() {
        var newTr = table.querySelectorAll('tbody tr');
        newTr = [].slice.call(newTr);
        tr.forEach(function (t) {
          expect(newTr.indexOf(t)).to.be.equal(-1);
        })

        componentHandler.downgradeElementRecursive(el);
        expect(table.getAttribute('data-upgraded')).to.be.equal('');

        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should update window url on bt refresh click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SELECTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');

    componentHandler.upgradeElements(el);

    setTimeout(function() {
      removeUrlParams();
      var refresh = el.querySelector('#refresh');
      refresh.click();
      setTimeout(function() {
        var url = new URL(window.location.href);
        expect(url.searchParams.get("Limit")).to.be.equal('2');
        expect(url.searchParams.get("Offset")).to.be.equal('0');

        componentHandler.downgradeElementRecursive(el);
        expect(table.getAttribute('data-upgraded')).to.be.equal('');

        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should update header class on sortable header click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SORTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');
    table.setAttribute('sort-qs-name', 'Sort');
    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var th = el.querySelectorAll('thead tr th');

      expect(th[1].classList.contains("mdl-data-table__header--sorted")).to.be.equal(true);
      th[1].click();
      setTimeout(function() {
        expect(th[1].classList.contains("mdl-data-table__header--sorted")).to.be.equal(false);
        expect(th[1].classList.contains("mdl-data-table__header--sorted-ascending")).to.be.equal(true);
        th[1].click();
        setTimeout(function() {
          expect(th[1].classList.contains("mdl-data-table__header--sorted-ascending")).to.be.equal(false);
          expect(th[1].classList.contains("mdl-data-table__header--sorted-descending")).to.be.equal(true);
          th[1].click();
          setTimeout(function() {
            expect(th[1].classList.contains("mdl-data-table__header--sorted-decending")).to.be.equal(false);
            expect(th[1].classList.contains("mdl-data-table__header--sorted")).to.be.equal(true);
            el.remove();
            done();
          }, defTout);
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should update window url on sortable header click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SORTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');
    table.setAttribute('sort-qs-name', 'Sort');
    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var th = el.querySelectorAll('thead tr th');

      var url = new URL(window.location.href);
      expect(url.searchParams.get("Sort")).to.be.equal(null);
      th[1].click();
      setTimeout(function() {
        url = new URL(window.location.href);
        expect(url.searchParams.get("Sort")).to.be.equal('Material-asc');
        th[1].click();
        setTimeout(function() {
          url = new URL(window.location.href);
          expect(url.searchParams.get("Sort")).to.be.equal('Material-desc');
          th[1].click();
          setTimeout(function() {
            var url = new URL(window.location.href);
            expect(url.searchParams.get("Sort")).to.be.equal(null);
            el.remove();
            done();
          }, defTout);
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should update results list on sortable header click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SORTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');
    table.setAttribute('sort-qs-name', 'Sort');
    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var th = el.querySelectorAll('thead tr th');
      var td = el.querySelectorAll('tbody tr td');

      expect(td[1].innerHTML).to.be.equal('Wood (1)');
      th[1].click();
      setTimeout(function() {
        td = el.querySelectorAll('tbody tr td');
        expect(td[1].innerHTML).to.be.equal('Concrete (11)');

        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should maintain sort params order on sortable header click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SORTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');
    table.setAttribute('sort-qs-name', 'Sort');
    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var th = el.querySelectorAll('thead tr th');

      var url = new URL(window.location.href);
      expect(url.searchParams.get("Sort")).to.be.equal(null);
      th[1].click();
      setTimeout(function() {
        url = new URL(window.location.href);
        expect(url.searchParams.get("Sort")).to.be.equal('Material-asc');
        th[2].click();
        setTimeout(function() {
          url = new URL(window.location.href);
          expect(url.searchParams.getAll("Sort")[0]).to.be.equal('Material-asc');
          expect(url.searchParams.getAll("Sort")[1]).to.be.equal('Quantity-asc');
          th[2].click();
          setTimeout(function() {
            var url = new URL(window.location.href);
            expect(url.searchParams.getAll("Sort")[0]).to.be.equal('Material-asc');
            expect(url.searchParams.getAll("Sort")[1]).to.be.equal('Quantity-desc');
            el.remove();
            done();
          }, defTout);
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should maintain sort params order on bt refresh click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SORTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');
    table.setAttribute('sort-qs-name', 'Sort');
    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var th = el.querySelectorAll('thead tr th');
      var refresh = el.querySelector('#refresh');

      var url = new URL(window.location.href);
      expect(url.searchParams.get("Sort")).to.be.equal(null);
      th[1].click();
      setTimeout(function() {
        th[2].click();
        setTimeout(function() {
          refresh.click();
          setTimeout(function() {
            url = new URL(window.location.href);
            expect(url.searchParams.getAll("Sort")[0]).to.be.equal('Material-asc');
            expect(url.searchParams.getAll("Sort")[1]).to.be.equal('Quantity-asc');
            var td = el.querySelectorAll('tbody tr td');
            expect(td[1].innerHTML).to.be.equal('Wood (1)');

            el.remove();
            done();
          }, defTout);
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it('should maintain sort params order on bt loadmore click', function (done) {
    var TEMPLATE = templatesLoader.get('AJAX_TABLE_SORTABLE_CTRLS');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    var table = el.querySelector('table');
    table.setAttribute('checkbox-property-value', 'Id');
    table.setAttribute('limit-value', '2');
    table.setAttribute('limit-qs-name', 'Limit');
    table.setAttribute('offset-qs-name', 'Offset');
    table.setAttribute('sort-qs-name', 'Sort');
    componentHandler.upgradeElements(el);

    setTimeout(function() {
      var th = el.querySelectorAll('thead tr th');
      var loadmore = el.querySelector('#loadmore');

      var url = new URL(window.location.href);
      expect(url.searchParams.get("Sort")).to.be.equal(null);
      th[1].click();
      setTimeout(function() {
        th[2].click();
        setTimeout(function() {
          loadmore.click();
          setTimeout(function() {
            url = new URL(window.location.href);
            expect(url.searchParams.getAll("Sort")[0]).to.be.equal('Material-asc');
            expect(url.searchParams.getAll("Sort")[1]).to.be.equal('Quantity-asc');
            var td = el.querySelectorAll('tbody tr td');
            expect(td[1].innerHTML).to.be.equal('Wood (1)');

            expect(td[9].innerHTML).to.be.equal('Wood (13)');

            el.remove();
            done();
          }, defTout);
        }, defTout);
      }, defTout);
    }, defTout);
  });

  it.skip('should disable navigation buttons while loading data');
  it.skip('should disable next page button when it reaches end of list');
  it.skip('should disable pre page button when offset is zero');
  it.skip('should show the navigation helper');
  it.skip('should show the empty helper');
  it.skip('should disable navigation buttons when the results are empty');
  it.skip('should show the unreachable helper');
  it.skip('should disable navigation buttons when the remote is unreachable');
  it.skip('should test ajax table with a form');

});
