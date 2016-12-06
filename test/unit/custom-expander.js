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

templatesLoader.register('EXPANDER', '/src/custom-expander/snippets/expander.html');
templatesLoader.register('EXPANDER_NOTIFIER', '/src/custom-expander/snippets/expander-notifier.html');


describe('CustomExpander', function () {

  var defTout = 750;

  it('should be globally available', function () {
    expect(CustomExpander).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER');

    componentHandler.upgradeElements(el);
    var expander = el.querySelector('.custom-js-expander');
    expect(expander.getAttribute('data-upgraded')).to.be.equal(',CustomExpander');

    componentHandler.downgradeElementRecursive(el);
    expect(expander.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should expand the content on bt click', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER');

    var expander = el.querySelector('.custom-js-expander');
    var bt = el.querySelector('.custom-expander-bt');
    var container = el.querySelector('.custom-expander-container');
    componentHandler.upgradeElements(el);

    var cherry = window.cherry;
    expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
    expect(expander.classList.contains('is-expanded')).to.be.equal(false);
    bt.click();
    setTimeout(function() {
      expect(cherry.getStyle(container, 'height')).to.be.equal('100px');
      expect(expander.classList.contains('is-expanded')).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should hide the content on twice bt click', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER');

    var expander = el.querySelector('.custom-js-expander');
    var bt = el.querySelector('.custom-expander-bt');
    var container = el.querySelector('.custom-expander-container');
    componentHandler.upgradeElements(el);

    var cherry = window.cherry;
    expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
    expect(expander.classList.contains('is-expanded')).to.be.equal(false);
    bt.click();
    setTimeout(function() {
      bt.click();
      setTimeout(function() {
        expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
        expect(expander.classList.contains('is-expanded')).to.be.equal(false);
        componentHandler.downgradeElementRecursive(el);
        el.remove();
        done();
      }, defTout);
    }, defTout);
  });

  it('should close an already expanded component on init', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER');

    var expander = el.querySelector('.custom-js-expander');
    expander.classList.add('is-expanded');
    var bt = el.querySelector('.custom-expander-bt');
    var container = el.querySelector('.custom-expander-container');
    componentHandler.upgradeElements(el);

    var cherry = window.cherry;
    expect(cherry.getStyle(container, 'height')).to.be.equal('100px');
    expect(expander.classList.contains('is-expanded')).to.be.equal(true);
    bt.click();
    setTimeout(function() {
      expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
      expect(expander.classList.contains('is-expanded')).to.be.equal(false);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should upgrade successfully a notifier', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER_NOTIFIER');

    componentHandler.upgradeElements(el);
    var expander = el.querySelector('.custom-js-expander');
    expect(expander.getAttribute('data-upgraded')).to.be.equal(',CustomExpander');

    componentHandler.downgradeElementRecursive(el);
    expect(expander.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should expand on notification', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER_NOTIFIER');

    componentHandler.upgradeElements(el);
    var expander = el.querySelector('.custom-js-expander');
    var container = el.querySelector('.custom-expander-container');

    var cherry = window.cherry;
    expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
    expect(expander.classList.contains('is-expanded')).to.be.equal(false);

    cherry.trigger(expander, 'notify', {
      notification: {
        message: 'notified',
        notificationType: 'success',
      }
    });

    setTimeout(function() {
      expect(cherry.getStyle(container, 'height')).to.be.equal('20px');
      expect(expander.classList.contains('is-expanded')).to.be.equal(true);
      expect(expander.classList.contains('custom-expander-notify-success')).to.be.equal(true);

      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);

  });

  it('should hide on notification with empty message', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('EXPANDER_NOTIFIER');

    componentHandler.upgradeElements(el);
    var expander = el.querySelector('.custom-js-expander');
    var container = el.querySelector('.custom-expander-container');

    var cherry = window.cherry;
    expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
    expect(expander.classList.contains('is-expanded')).to.be.equal(false);

    cherry.trigger(expander, 'notify', {
      notification: {
        message: '',
        notificationType: 'success',
      }
    });

    setTimeout(function() {
      expect(cherry.getStyle(container, 'height')).to.be.equal('0px');
      expect(expander.classList.contains('is-expanded')).to.be.equal(false);
      expect(expander.classList.contains('custom-expander-notify-success')).to.be.equal(false);

      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);

  });

});
