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

templatesLoader.register('LoaderOver', '/src/custom-loader-over/snippets/loader-over.html');


describe('CustomLoaderOver', function () {

  var defTout = 650;

  it('should be globally available', function () {
    expect(CustomLoaderOver).to.be.a('function');
  });

  it('should upgrade successfully', function () {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('LoaderOver');

    componentHandler.upgradeElements(el);
    var loader = el.querySelector('.custom-js-loaderover');
    expect(loader.getAttribute('data-upgraded')).to.be.equal(',CustomLoaderOver');

    componentHandler.downgradeElementRecursive(el);
    expect(loader.getAttribute('data-upgraded')).to.be.equal('');
    el.remove();
  });

  it('should show over given el', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('LoaderOver');

    var div = document.createElement('div');
    div.style.height = '50px';
    div.style.width = '50px';
    div.style.backgroundColor = 'silver';
    el.appendChild(div);

    componentHandler.upgradeElements(el);
    var loader = el.querySelector('.custom-js-loaderover');
    loader['CustomLoaderOver'].show(div);
    var spinner = el.querySelector('.custom-spinner');
    expect(spinner.classList.contains('is-active')).to.be.equal(true);
    expect(spinner.style.marginLeft).to.be.equal('-14px');
    expect(spinner.style.marginTop).to.be.equal('-14px');

    loader['CustomLoaderOver'].hide(div);
    setTimeout(function() {
      componentHandler.downgradeElementRecursive(el);
      el.remove();
      done();
    }, defTout)
  });

  it('should hide from given el', function (done) {
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.innerHTML = templatesLoader.get('LoaderOver');

    var div = document.createElement('div');
    div.style.height = '50px';
    div.style.width = '50px';
    div.style.backgroundColor = 'silver';
    el.appendChild(div);

    componentHandler.upgradeElements(el);
    var loader = el.querySelector('.custom-js-loaderover');
    loader['CustomLoaderOver'].show(div);
    var spinner = el.querySelector('.custom-spinner');
    expect(spinner.classList.contains('is-active')).to.be.equal(true);
    expect(spinner.style.marginLeft).to.be.equal('-14px');
    expect(spinner.style.marginTop).to.be.equal('-14px');


    setTimeout(function() {
      loader['CustomLoaderOver'].hide(div);
      setTimeout(function() {
        expect(spinner.classList.contains('is-active')).to.be.equal(false);
        componentHandler.downgradeElementRecursive(el);
        el.remove();
        done();
      }, defTout)
    }, defTout)

  });

});
