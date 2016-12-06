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

templatesLoader.register('DIALOG', '/src/custom-dialog/snippets/dialog.html');

describe('CustomDialog', function () {

  var defTout = 250;

  it('should be globally available', function () {
    expect(CustomDialog).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var TEMPLATE = templatesLoader.get('DIALOG');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var dialog = el.querySelector('.custom-js-dialog')
    expect(dialog.getAttribute('data-upgraded')).to.be.equal(',CustomDialog');

    componentHandler.downgradeElementRecursive(el);
    expect(dialog.getAttribute('data-upgraded')).to.be.equal('');

    el.remove();
  });

  it('should open on bt click', function () {
    var TEMPLATE = templatesLoader.get('DIALOG');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var dialog = el.querySelector('.custom-js-dialog')
    var bt = document.querySelector('#bt1');

    var cherry = window.cherry;
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    bt.click();
    display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('block');

    dialog['CustomDialog'].hide();
    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

  it('should close on cancel click', function () {
    var TEMPLATE = templatesLoader.get('DIALOG');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var dialog = el.querySelector('.custom-js-dialog');
    var cancel = dialog.querySelector('.custom-dialog-cancel');
    var bt = document.querySelector('#bt1');

    var cherry = window.cherry;
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    bt.click();
    display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('block');

    cancel.click();
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

  it('should close on close click', function () {
    var TEMPLATE = templatesLoader.get('DIALOG');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var dialog = el.querySelector('.custom-js-dialog');
    var close = dialog.querySelector('.custom-dialog-close');
    var bt = document.querySelector('#bt1');

    var cherry = window.cherry;
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    bt.click();
    display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('block');

    close.click();
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

  it('should prevent first click on button enabler', function () {
    var TEMPLATE = templatesLoader.get('DIALOG');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var dialog = el.querySelector('.custom-js-dialog')
    var bt = document.querySelector('#bt1');

    var clicked = false;
    bt.addEventListener('click', function () {
      clicked = true;
    })

    var cherry = window.cherry;
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    bt.click();
    display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('block');

    expect(clicked).to.be.equal(false);


    dialog['CustomDialog'].hide();
    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

  it('should enable click on button enabler after confirm', function () {
    var TEMPLATE = templatesLoader.get('DIALOG');
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = TEMPLATE;

    componentHandler.upgradeElements(el);
    var dialog = el.querySelector('.custom-js-dialog');
    var confirm = dialog.querySelector('.custom-dialog-confirm');

    var bt = document.querySelector('#bt1');
    var clicked = false;
    bt.addEventListener('click', function() {
      clicked = true;
    }, false);

    var cherry = window.cherry;
    var display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('none');

    bt.click();
    display = cherry.getStyle(dialog, 'display');
    expect(display).to.be.equal('block');
    expect(clicked).to.be.equal(false);

    confirm.click();
    expect(clicked).to.be.equal(true);

    componentHandler.downgradeElementRecursive(el);
    el.remove();
  });

});
