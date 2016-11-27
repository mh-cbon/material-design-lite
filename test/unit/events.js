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

describe('events', function () {

  it('should be globally available', function () {
    expect(cherry).to.be.a('object');
  });

  // std events
  it('should be able to add an event', function () {
    var bt = document.createElement("button");
    var res = false;
    var handler = function () {
      res = true;
    };
    cherry.on(bt, 'click', handler);
    bt.click();
    expect(res).to.be.equal(true);

    cherry.__registry.Reset();
    expect(cherry.__registry.length).to.be.equal(0);
    res = false;
    bt.click();
    expect(res).to.be.equal(false);
  });

  it('should be able to remove an event', function () {
    var bt = document.createElement("button");
    var res = false;
    var handler = function () {
      res = true;
    };
    cherry.on(bt, 'click', handler);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res).to.be.equal(true);
    res = false;
    cherry.off(bt, 'click', handler);
    bt.click();
    expect(res).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  function ObjScope(){
    this.res = false;
  }
  ObjScope.prototype.res = false;
  ObjScope.prototype.handler = function () {
    this.res = true;
  }

  it('should be able to bind the handler scope', function () {
    var bt = document.createElement("button");

    var obj = new ObjScope();
    expect(obj.res).to.be.equal(false);

    cherry.on(bt, 'click', obj.handler).bind(obj);
    expect(cherry.__registry.length).to.be.equal(1);

    bt.click();
    expect(obj.res).to.be.equal(true);

    obj.res = false;
    cherry.off(bt, 'click', obj.handler);
    bt.click();
    expect(obj.res).to.be.equal(false);

    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to remove a specific event handler', function () {
    var bt = document.createElement("button");
    var res1 = false;
    var res2 = false;
    var handler1 = function () {
      res1 = true;
    };
    var handler2 = function () {
      res2 = true;
    };
    cherry.on(bt, 'click', handler1);
    cherry.on(bt, 'click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    res1 = false;
    res2 = false;
    cherry.off(bt, 'click', handler2);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(1);
    expect(cherry.__registry.GetItem(bt)).to.not.equal(null);
    cherry.off(bt, 'click', handler1);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to remove all event handlers', function () {
    var bt = document.createElement("button");
    var res1 = false;
    var res2 = false;
    var handler1 = function () {
      res1 = true;
    };
    var handler2 = function () {
      res2 = true;
    };
    cherry.on(bt, 'click', handler1);
    cherry.on(bt, 'click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    res1 = false;
    res2 = false;
    cherry.off(bt, 'click');
    bt.click();
    expect(res1).to.be.equal(false);
    expect(res2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to add an once event', function () {
    var bt = document.createElement("button");
    var res = false;
    var handler = function () {
      res = true;
    };
    cherry.once(bt, 'click', handler);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res).to.be.equal(true);

    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);

    res = false;
    bt.click();
    expect(res).to.be.equal(false);
  });

  it('should be able to bind the handler scope for an once event', function () {
    var bt = document.createElement("button");

    var obj = new ObjScope();
    expect(obj.res).to.be.equal(false);

    cherry.once(bt, 'click', obj.handler).bind(obj);
    expect(cherry.__registry.length).to.be.equal(1);

    bt.click();
    expect(obj.res).to.be.equal(true);

    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to trigger multiple handlers', function () {
    var bt = document.createElement("button");

    var res = 0;
    var handler = function (ev) {
      res++;
    }
    var handler2 = function (ev) {
      res++;
    }
    expect(res).to.be.equal(0);

    cherry.on(bt, 'click', handler);
    cherry.on(bt, 'click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);

    bt.click();
    expect(res).to.be.equal(2);

    cherry.off(bt, 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to respect stopImmediatePropagation', function () {
    var bt = document.createElement("button");

    var res = false;
    var handler = function (ev) {
      ev.stopImmediatePropagation();
    }
    var handler2 = function (ev) {
      res = true;
    }
    expect(res).to.be.equal(false);

    cherry.on(bt, 'click', handler);
    cherry.on(bt, 'click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);

    bt.click();
    expect(res).to.be.equal(false);

    cherry.off(bt, 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to respect stopImmediatePropagation for an once event', function () {
    var bt = document.createElement("button");

    var res = false;
    var handler = function (ev) {
      ev.stopImmediatePropagation();
    }
    var handler2 = function (ev) {
      res = true;
    }
    expect(res).to.be.equal(false);

    cherry.once(bt, 'click', handler);
    cherry.once(bt, 'click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);

    bt.click();
    expect(res).to.be.equal(false);

    // note, as handler as stopped propagation, handler2 was not fired,
    // thus it was not undbounded
    expect(cherry.__registry.length).to.be.equal(1);
    expect(cherry.__registry.GetItem(bt)).to.not.equal(null);

    // we should click again to trigger handler2,
    // thus unbound it.
    bt.click();
    expect(res).to.be.equal(true);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to debounce an event', function (done) {
    var bt = document.createElement("button");

    var res = false;
    var handler = function (ev) {
      res = true;
    }
    expect(res).to.be.equal(false);

    cherry.on(bt, 'click', handler).debounce(100);
    expect(cherry.__registry.length).to.be.equal(1);

    bt.click();
    expect(res).to.be.equal(false);

    setTimeout(function () {
      expect(res).to.be.equal(true);
      cherry.off(bt, 'click', handler);
      expect(cherry.__registry.length).to.be.equal(0);
      expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
      done();
    }, 150);
  });

  // namespaced events
  it('should be able to add a namespaced event', function () {
    var bt = document.createElement("button");
    var res = false;
    var handler = function () {
      res = true;
    };
    cherry.on(bt, 'ns.click', handler);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res).to.be.equal(true);

    cherry.__registry.Reset();
    expect(cherry.__registry.length).to.be.equal(0);
    res = false;
    bt.click();
    expect(res).to.be.equal(false);
  });

  it('should be able to remove a namespaced event', function () {
    var bt = document.createElement("button");
    var res = false;
    var handler = function () {
      res = true;
    };
    cherry.on(bt, 'ns.click', handler);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res).to.be.equal(true);
    res = false;
    cherry.off(bt, 'ns.click', handler);
    bt.click();
    expect(res).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to remove a specific namespaced event handler', function () {
    var bt = document.createElement("button");
    var res1 = false;
    var res2 = false;
    var handler1 = function () {
      res1 = true;
    };
    var handler2 = function () {
      res2 = true;
    };
    cherry.on(bt, 'ns.click', handler1);
    cherry.on(bt, 'ns.click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    res1 = false;
    res2 = false;
    cherry.off(bt, 'ns.click', handler2);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(1);
    expect(cherry.__registry.GetItem(bt)).to.not.equal(null);
    cherry.off(bt, 'ns.click', handler1);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to remove all namespaced event handlers', function () {
    var bt = document.createElement("button");
    var res1 = false;
    var res2 = false;
    var handler1 = function () {
      res1 = true;
    };
    var handler2 = function () {
      res2 = true;
    };
    cherry.on(bt, 'ns.click', handler1);
    cherry.on(bt, 'ns.click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    res1 = false;
    res2 = false;
    cherry.off(bt, 'ns.click');
    bt.click();
    expect(res1).to.be.equal(false);
    expect(res2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to add an once namespaced event', function () {
    var bt = document.createElement("button");
    var res = false;
    var handler = function () {
      res = true;
    };
    cherry.once(bt, 'ns.click', handler);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res).to.be.equal(true);

    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);

    res = false;
    bt.click();
    expect(res).to.be.equal(false);
  });

  // mixed events
  it('should be able to remove only namespaced event handlers', function () {
    var bt = document.createElement("button");
    var res1 = false;
    var res2 = false;
    var nsres1 = false;
    var nsres2 = false;
    var handler1 = function () {
      res1 = true;
    };
    var handler2 = function () {
      res2 = true;
    };
    var nshandler1 = function () {
      nsres1 = true;
    };
    var nshandler2 = function () {
      nsres2 = true;
    };
    cherry.on(bt, 'click', handler1);
    cherry.on(bt, 'click', handler2);
    cherry.on(bt, 'ns.click', nshandler1);
    cherry.on(bt, 'ns.click', nshandler2);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    expect(nsres1).to.be.equal(true);
    expect(nsres2).to.be.equal(true);

    res1 = false;
    res2 = false;
    nsres1 = false;
    nsres2 = false;
    cherry.off(bt, 'ns.click');
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    expect(nsres1).to.be.equal(false);
    expect(nsres2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(1);
    expect(cherry.__registry.GetItem(bt)).to.not.equal(null);

    res1 = false;
    res2 = false;
    cherry.off(bt, 'click');
    bt.click();
    expect(res1).to.be.equal(false);
    expect(res2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  it('should be able to remove only non-namespaced event handlers', function () {
    var bt = document.createElement("button");
    var res1 = false;
    var res2 = false;
    var nsres1 = false;
    var nsres2 = false;
    var handler1 = function () {
      res1 = true;
    };
    var handler2 = function () {
      res2 = true;
    };
    var nshandler1 = function () {
      nsres1 = true;
    };
    var nshandler2 = function () {
      nsres2 = true;
    };
    cherry.on(bt, 'click', handler1);
    cherry.on(bt, 'click', handler2);
    cherry.on(bt, 'ns.click', nshandler1);
    cherry.on(bt, 'ns.click', nshandler2);
    expect(cherry.__registry.length).to.be.equal(1);
    bt.click();
    expect(res1).to.be.equal(true);
    expect(res2).to.be.equal(true);
    expect(nsres1).to.be.equal(true);
    expect(nsres2).to.be.equal(true);

    res1 = false;
    res2 = false;
    nsres1 = false;
    nsres2 = false;
    cherry.off(bt, 'click');
    bt.click();
    expect(res1).to.be.equal(false);
    expect(res2).to.be.equal(false);
    expect(nsres1).to.be.equal(true);
    expect(nsres2).to.be.equal(true);
    expect(cherry.__registry.length).to.be.equal(1);
    expect(cherry.__registry.GetItem(bt)).to.not.equal(null);

    nsres1 = false;
    nsres2 = false;
    cherry.off(bt, 'ns.click');
    bt.click();
    expect(nsres1).to.be.equal(false);
    expect(nsres2).to.be.equal(false);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(bt)).to.be.equal(null);
  });

  // delegate events
  it('should be able to delegate an event', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.delegate(div, '.bt1', 'click', handler);
    div.click();
    expect(res).to.be.equal(false);
    bt2.click();
    expect(res).to.be.equal(false);
    bt1.click();
    expect(res).to.be.equal(true);

    cherry.off(div, 'click', handler);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to undelegate an event with its selector only', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.delegate(div, '.bt1', 'click', handler);

    cherry.undelegate(div, '.bt1', 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to undelegate an event with its handler only', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.delegate(div, '.bt1', 'click', handler);

    cherry.undelegate(div, 'click', handler);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to undelegate an event with its event name only', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.delegate(div, '.bt1', 'click', handler);

    cherry.undelegate(div, 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to bind the handler scope with delegated events', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var obj = new ObjScope();
    expect(obj.res).to.be.equal(false);

    cherry.delegate(div, '.bt1', 'click', obj.handler).bind(obj);
    bt1.click();
    expect(obj.res).to.be.equal(true);

    cherry.undelegate(div, 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to undelegate a bound handler', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var obj = new ObjScope();
    expect(obj.res).to.be.equal(false);

    cherry.delegate(div, '.bt1', 'click', obj.handler).bind(obj);
    bt1.click();
    expect(obj.res).to.be.equal(true);

    cherry.undelegate(div, 'click', obj.handler);
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to respect stopImmediatePropagation for delegated events', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = false;
    var handler = function (ev) {
      ev.stopImmediatePropagation();
    }
    var handler2 = function (ev) {
      res = true;
    }
    expect(res).to.be.equal(false);

    cherry.delegate(div, '.bt1', 'click', handler);
    cherry.delegate(div, '.bt1', 'click', handler2);
    expect(cherry.__registry.length).to.be.equal(1);

    bt1.click();
    expect(res).to.be.equal(false);

    cherry.off(div, 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to set event.delegateTarget for delegated events', function () {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    var span = document.createElement("span");
    span.classList.add("span");
    div.appendChild(bt1);
    div.appendChild(bt2);
    bt1.appendChild(span);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = null;
    var handler = function (ev) {
      res = ev.delegateTarget;
    }

    cherry.delegate(div, '.bt1', 'click', handler);
    expect(cherry.__registry.length).to.be.equal(1);

    bt1.click();
    expect(res).to.be.equal(bt1);

    var res = null;
    span.click();
    expect(res).to.be.equal(bt1);

    var res = null;
    div.click();
    expect(res).to.be.equal(null);

    cherry.off(div, 'click');
    expect(cherry.__registry.length).to.be.equal(0);
    expect(cherry.__registry.GetItem(div)).to.be.equal(null);
    div.remove();
  });

  it('should be able to debounce a delegated event', function (done) {
    var div = document.createElement("button");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt1");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt2");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div); // this very specific line is for phantomjs@2.1.1

    var res = false;
    var handler = function (ev) {
      res = true;
    }
    expect(res).to.be.equal(false);

    cherry.delegate(div, '.bt1', 'click', handler).debounce(100);
    expect(cherry.__registry.length).to.be.equal(1);

    bt1.click();
    expect(res).to.be.equal(false);

    setTimeout(function () {
      expect(res).to.be.equal(true);
      cherry.undelegate(div, '.bt1', 'click', handler);
      expect(cherry.__registry.length).to.be.equal(0);
      expect(cherry.__registry.GetItem(div)).to.be.equal(null);
      div.remove();
      done();
    }, 150);
  });

  // trigger events
  it('should be able to trigger all events', function () {
    var bt = document.createElement("button");

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.on(bt, 'click', handler);

    var nsres = false;
    var nshandler = function (ev) {
      nsres = true;
    };
    cherry.on(bt, 'ns.click', nshandler);

    cherry.trigger(bt, 'click');
    expect(res).to.be.equal(true);
    expect(nsres).to.be.equal(true);

    cherry.__registry.Reset();
  });

  it('should be able to trigger namespaced events specifically', function () {
    var bt = document.createElement("button");

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.on(bt, 'click', handler);

    var nsres = false;
    var nshandler = function (ev) {
      nsres = true;
    };
    cherry.on(bt, 'ns.click', nshandler);

    cherry.trigger(bt, 'ns.click');
    expect(res).to.be.equal(false);
    expect(nsres).to.be.equal(true);

    cherry.__registry.Reset();
  });

  // custom events
  it('should be able to register and trigger custom events', function () {
    var bt = document.createElement("button");

    var res = false;
    var handler = function (ev) {
      res = true;
    };
    cherry.on(bt, 'myCustom', handler);

    cherry.trigger(bt, 'myCustom');
    expect(res).to.be.equal(true);

    cherry.__registry.Reset();
  });

  // multiple node selectors
  it('should be able to add an event for a selector', function () {
    var div = document.createElement("div");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div);

    var res = 0;
    var handler = function () {
      res++;
    };
    cherry.on('.bt', 'click', handler);
    bt1.click();
    bt2.click();
    expect(res).to.be.equal(2);

    cherry.__registry.Reset();
    div.remove();
  });

  it.skip('should be able to once events for a selector', function () {
  });

  it.skip('should be able to add event delegation for a selector', function () {
  });

  it.skip('should be able to trigger events for a selector', function () {
  });

  it('should be able to add a namespaced event for a selector', function () {
    var div = document.createElement("div");
    var bt1 = document.createElement("button");
    bt1.classList.add("bt");
    var bt2 = document.createElement("button");
    bt2.classList.add("bt");
    div.appendChild(bt1);
    div.appendChild(bt2);
    document.body.appendChild(div);

    var res = 0;
    var handler = function () {
      res++;
    };
    cherry.on('.bt', 'ns.click', handler);
    bt1.click();
    bt2.click();
    expect(res).to.be.equal(2);

    cherry.__registry.Reset();
    div.remove();
  });

  // first
  it.skip('should be able to set an event first in the queue', function () {
  });

  it.skip('should be able to set an once event first in the queue', function () {
  });

  it.skip('should be able to set a delegated event first in the queue', function () {
  });

});
