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

templatesLoader.register('FormAjax', '/src/custom-form-ajax/snippets/form-ajax.html');
templatesLoader.register('FormAjaxHtml5', '/src/custom-form-ajax/snippets/form-ajax-html5.html');


describe('CustomFormAjax', function () {

  var defTout = 250;

  it('should be globally available', function () {
    expect(CustomFormAjax).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    componentHandler.upgradeElements(el);
    var form = el.querySelector('.custom-js-form-ajax');
    expect(form.getAttribute('data-upgraded')).to.be.equal(',CustomFormAjax');

    componentHandler.downgradeElementRecursive(el);
    expect(form.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should emit pre-submit event', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    componentHandler.upgradeElements(el);
    var form = el.querySelector('.custom-js-form-ajax');
    var bt = el.querySelector('button');

    var cherry = window.cherry;
    var preSubmmitted = false;
    cherry.once(form, 'pre-submit', function () {
      preSubmmitted = true;
    });
    bt.click();

    expect(preSubmmitted).to.be.equal(true);

    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

  it('should emit post-submit event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    componentHandler.upgradeElements(el);
    var form = el.querySelector('.custom-js-form-ajax');
    var bt = el.querySelector('button');

    var cherry = window.cherry;
    var postSubmmitted = false;
    cherry.once(form, 'post-submit', function () {
      postSubmmitted = true;
    });
    bt.click();

    expect(postSubmmitted).to.be.equal(false);
    setTimeout(function() {
      expect(postSubmmitted).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit validation-success event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    componentHandler.upgradeElements(el);
    var form = el.querySelector('.custom-js-form-ajax');
    var bt = el.querySelector('button');

    var cherry = window.cherry;
    var postSubmmitted = false;
    cherry.once(form, 'validation-success', function () {
      postSubmmitted = true;
    });
    bt.click();

    expect(postSubmmitted).to.be.equal(false);
    setTimeout(function() {
      expect(postSubmmitted).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit validation-fail event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=form_failure');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var cherry = window.cherry;
    var postSubmmitted = false;
    cherry.once(form, 'validation-fail', function () {
      postSubmmitted = true;
    });
    bt.click();

    expect(postSubmmitted).to.be.equal(false);
    setTimeout(function() {
      expect(postSubmmitted).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit success events in right order', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    var form = el.querySelector('.custom-js-form-ajax');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var cherry = window.cherry;
    var events = [];
    cherry.once(form, 'pre-submit', function(ev) {
      events.push(ev.type);
    });
    cherry.once(form, 'post-submit', function(ev) {
      events.push(ev.type);
    });
    cherry.once(form, 'validation-success', function(ev) {
      events.push(ev.type);
    });
    bt.click();

    setTimeout(function() {

      expect(events).to.be.eql(['pre-submit', 'post-submit', 'validation-success']);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit failure events in right order', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=form_failure');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var cherry = window.cherry;
    var events = [];
    cherry.once(form, 'pre-submit', function(ev) {
      events.push(ev.type);
    });
    cherry.once(form, 'post-submit', function(ev) {
      events.push(ev.type);
    });
    cherry.once(form, 'validation-fail', function(ev) {
      events.push(ev.type);
    });
    bt.click();

    setTimeout(function() {

      expect(events).to.be.eql(['pre-submit', 'post-submit', 'validation-fail']);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should display form failure error', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=form_failure');
    var text = el.querySelector('.custom-form__errorfailure');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    bt.click();

    setTimeout(function() {

      expect(text.innerHTML).to.be.equal('Something went wrong');
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should display field failure errors', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=field_errors');
    var errfields = el.querySelectorAll('.mdl-textfield__error');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    bt.click();

    setTimeout(function() {
      for( var i = 0; i < errfields.length; i++) {
        expect(errfields[i].innerHTML).to.be.equal('Anyway its wrong for the demo!');
        expect(errfields[i].parentNode.classList.contains('is-invalid')).to.be.equal(true);
      }
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should disable buttons while processing the form', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjax');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=field_errors');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    expect(bt.getAttribute('disabled')).to.be.equal(null);
    bt.click();
    expect(bt.getAttribute('disabled')).to.be.equal('disabled');

    setTimeout(function() {
      expect(bt.getAttribute('disabled')).to.be.equal(null);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should handle html5 buttons', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=field_errors');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    expect(bt.getAttribute('disabled')).to.be.equal(null);
    bt.click();
    expect(bt.getAttribute('disabled')).to.be.equal('disabled');

    setTimeout(function() {
      expect(bt.getAttribute('disabled')).to.be.equal(null);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should update submit options for the clicked html5 button', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=field_errors');
    var bt = el.querySelector('button');
    bt.setAttribute('formmethod', 'GET');
    bt.setAttribute('formaction', '/somewhere');
    bt.setAttribute('formenctype', 'encoded');
    componentHandler.upgradeElements(el);

    var options = form['CustomFormAjax'].getSubmitOptions(bt);

    expect(options.method).to.be.equal('GET');
    expect(options.url).to.be.equal('/somewhere');
    expect(options.headers['content-type']).to.be.equal('encoded');
    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

  it('should emit pre-notify event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');
    var div = document.createElement('div');
    div.id = 'prenotifier';
    el.appendChild(div);

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('pre-notify', '#'+div.id);
    form.setAttribute('pre-notify-message', 'message');
    form.setAttribute('pre-notify-action', 'action');
    form.setAttribute('pre-notify-timeout', '1500');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var notified = false;
    var ts = Date.now();
    div.addEventListener('notify', function(ev) {
      var notification = ev.notification;
      notified = true;
      expect(notification.targetElement).to.be.equal(form);
      expect(notification.inputElement).to.be.equal(bt);
      expect(notification.sourceEvent).to.be.equal('pre-submit');
      expect(notification.notificationType).to.be.equal('info');
      expect(notification.message).to.be.equal('message');
      expect(notification.actionText).to.be.equal('action');
      expect(notification.timeout).to.be.equal(1500);
    })

    bt.click();
    setTimeout(function() {
      expect(notified).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit post-notify success event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');
    var div = document.createElement('div');
    div.id = 'prenotifier';
    el.appendChild(div);

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('post-notify', '#'+div.id);
    form.setAttribute('post-notify-success', 'message');
    form.setAttribute('post-notify-action', 'action');
    form.setAttribute('post-notify-success-timeout', '1500');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var notified = false;
    var ts = Date.now();
    div.addEventListener('notify', function(ev) {
      var notification = ev.notification;
      notified = true;
      expect(notification.targetElement).to.be.equal(form);
      expect(notification.inputElement).to.be.equal(bt);
      expect(notification.sourceEvent).to.be.equal('post-submit');
      expect(notification.notificationType).to.be.equal('success');
      expect(notification.message).to.be.equal('message');
      expect(notification.actionText).to.be.equal('action');
      expect(notification.timeout).to.be.equal(1500);
    })

    bt.click();
    setTimeout(function() {
      expect(notified).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit post-notify field errors event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');
    var div = document.createElement('div');
    div.id = 'prenotifier';
    el.appendChild(div);

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=field_errors');
    form.setAttribute('post-notify', '#'+div.id);
    form.setAttribute('post-notify-failure', 'message');
    form.setAttribute('post-notify-action', 'action');
    form.setAttribute('post-notify-failure-timeout', '1500');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var notified = false;
    var ts = Date.now();
    div.addEventListener('notify', function(ev) {
      var notification = ev.notification;
      notified = true;
      expect(notification.targetElement).to.be.equal(form);
      expect(notification.inputElement).to.be.equal(bt);
      expect(notification.sourceEvent).to.be.equal('post-submit');
      expect(notification.notificationType).to.be.equal('warn');
      expect(notification.message).to.be.equal('message');
      expect(notification.actionText).to.be.equal('action');
      expect(notification.timeout).to.be.equal(1500);
    })

    bt.click();
    setTimeout(function() {
      expect(notified).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit post-notify form failure event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');
    var div = document.createElement('div');
    div.id = 'prenotifier';
    el.appendChild(div);

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/form-ajax.json?Return=form_failure');
    form.setAttribute('post-notify', '#'+div.id);
    form.setAttribute('post-notify-failure', 'message');
    form.setAttribute('post-notify-action', 'action');
    form.setAttribute('post-notify-failure-timeout', '1500');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var notified = false;
    var ts = Date.now();
    div.addEventListener('notify', function(ev) {
      var notification = ev.notification;
      notified = true;
      expect(notification.targetElement).to.be.equal(form);
      expect(notification.inputElement).to.be.equal(bt);
      expect(notification.sourceEvent).to.be.equal('post-submit');
      expect(notification.notificationType).to.be.equal('severe');
      expect(notification.message).to.be.equal('Something went wrong');
      expect(notification.actionText).to.be.equal('action');
      expect(notification.timeout).to.be.equal(1500);
    })

    bt.click();
    setTimeout(function() {
      expect(notified).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });

  it('should emit post-notify crtical event', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('FormAjaxHtml5');
    var div = document.createElement('div');
    div.id = 'prenotifier';
    el.appendChild(div);

    var form = el.querySelector('.custom-js-form-ajax');
    form.setAttribute('action', '/nop');
    form.setAttribute('post-notify', '#'+div.id);
    form.setAttribute('post-notify-failure', 'message');
    form.setAttribute('post-notify-critical', 'critical message');
    form.setAttribute('post-notify-action', 'action');
    form.setAttribute('post-notify-failure-timeout', '1500');
    var bt = el.querySelector('button');
    componentHandler.upgradeElements(el);

    var notified = false;
    var ts = Date.now();
    div.addEventListener('notify', function(ev) {
      var notification = ev.notification;
      notified = true;
      expect(notification.targetElement).to.be.equal(form);
      expect(notification.inputElement).to.be.equal(bt);
      expect(notification.sourceEvent).to.be.equal('post-submit');
      expect(notification.notificationType).to.be.equal('critical');
      expect(notification.message).to.be.equal('critical message');
      expect(notification.actionText).to.be.equal('action');
      expect(notification.timeout).to.be.equal(1500);
    })

    bt.click();
    setTimeout(function() {
      expect(notified).to.be.equal(true);
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout);
  });


});
