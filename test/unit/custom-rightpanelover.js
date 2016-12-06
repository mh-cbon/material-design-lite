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

templatesLoader.register('RightPanelOver', '/src/custom-right-panel-over/snippets/right-panel-over.html');


describe('CustomRightPanelOver', function () {

  var defTout = 1500;
  this.timeout(6000);

  it('should be globally available', function () {
    expect(CustomRightPanelOver).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('RightPanelOver');

    componentHandler.upgradeElements(el);
    var rightpanel = el.querySelector('.custom-js-rightpanelover');
    expect(rightpanel.getAttribute('data-upgraded')).to.be.equal(',CustomRightPanelOver');

    componentHandler.downgradeElementRecursive(el);
    expect(rightpanel.getAttribute('data-upgraded')).to.be.equal('');
    el.remove();
  });

  it('should show the right panel', function (done) {
    var cherry = window.cherry;
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('RightPanelOver');

    componentHandler.upgradeElements(el);
    var rightpanel = el.querySelector('.custom-js-rightpanelover');
    var link = el.querySelector('a');
    link.setAttribute('href', '/test/right-page.html')
    cherry.trigger(link, 'click');

    setTimeout(function() {
      expect(cherry.getStyle(rightpanel, 'display')).to.be.equal('block');
      var iframe = rightpanel.querySelector('iframe');
      expect(iframe.src).to.be.match(/\/test\/right-page\.html$/);
      rightpanel['CustomRightPanelOver'].closeBox_();
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout)
  });

  it('should hide the right panel on dblclick left zone', function (done) {
    var cherry = window.cherry;
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('RightPanelOver');

    componentHandler.upgradeElements(el);
    var rightpanel = el.querySelector('.custom-js-rightpanelover');
    var link = el.querySelector('a');
    link.setAttribute('href', '/test/right-page.html')
    cherry.trigger(link, 'click');

    setTimeout(function() {
      cherry.trigger(rightpanel, 'dblclick');
      setTimeout(function() {
        expect(cherry.getStyle(rightpanel, 'display')).to.be.equal('none');
        componentHandler.downgradeElementRecursive(el);
        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should hide the right panel on button click within the iframe', function (done) {
    var cherry = window.cherry;
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('RightPanelOver');

    componentHandler.upgradeElements(el);
    var rightpanel = el.querySelector('.custom-js-rightpanelover');
    var link = el.querySelector('a');
    link.setAttribute('href', '/test/right-page.html')
    cherry.trigger(link, 'click');

    var iframe = rightpanel.querySelector('iframe');
    cherry.once(iframe, 'load', function() {
      setTimeout(function(){ // this timeout is for chromium :x
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        var sel = rightpanel.getAttribute('closer-bt');
        var bt = doc.querySelector(sel)
        bt.click();
        setTimeout(function() {
          expect(cherry.getStyle(rightpanel, 'display')).to.be.equal('none');
          componentHandler.downgradeElementRecursive(el);
          el.remove();
          done();
        }, defTout);
      }, 150);
    });
  });

  it('should hide the right panel on form validation within the iframe', function (done) {
    var cherry = window.cherry;
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('RightPanelOver');

    var rightpanel = el.querySelector('.custom-js-rightpanelover');
    rightpanel.setAttribute('closer-form-delay', '0');
    componentHandler.upgradeElements(el);
    var link = el.querySelector('a');
    link.setAttribute('href', '/test/right-page.html')
    cherry.trigger(link, 'click');

    var cherry = window.cherry;
    var iframe = rightpanel.querySelector('iframe');
    cherry.once(iframe, 'load', function() {
      setTimeout(function(){ // this timeout is for chromium :x
        var doc = iframe.contentDocument || iframe.contentWindow.document;
        var form = doc.querySelector(rightpanel.getAttribute('closer-form'));
        cherry.trigger(form, 'submit');
        setTimeout(function() {
          expect(cherry.getStyle(rightpanel, 'display')).to.be.equal('none');
          componentHandler.downgradeElementRecursive(el);
          el.remove();
          done();
        }, defTout);
      }, 150);
    });
  });

});
