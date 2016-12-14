(function(window) {
  'use strict';

  if (!window.cherry && !window['cherry']) {
    window.cherry = {};
    window['cherry'] = {};
  }

  var cherry = window.cherry || window['cherry'];

  /**
  * Given the event names 'click',
  * 'ns.click', returns 'click'
  * @param {string} eventName The name of the event.
  * @returns {string}
  * @private
  */
  function getEventName(some) {
    var k = some.split(/[.]/);
    return k[k.length - 1];
  }

  /**
  * Tells if an event name is namespaced like
  * 'ns.click'
  * @param {string} eventName The name of the event.
  * @returns {boolean}
  * @private
  */
  function isNamespaced(some) {
    var k = some.split(/./);
    return k.length > 1;
  }

  /**
  * Take a selector string, or a DomNode, returns a DomNode.
  * @param {string|DomNode} some A selector to a node, or the node itself.
  * @returns {DomNode}
  * @private
  */
  function getElement(some) {
    var element;
    if (some && some.querySelector) {
      element = [some];
    } else if (cherry.isAWindow(some)) {
      element = [some];
    } else if (some instanceof Array || isNodeList(some)) {
      element = some;
    } else {
      element = document.querySelectorAll(some);
    }
    return element;
  }

  /**
  * Teells if given value is a NodeList type.
  * @param {string|DomNode} some A selector to a node, or the node itself.
  * @returns {bool}
  * @private
  */
  function isNodeList(some) {
    var stringRepr = Object.prototype.toString.call(some);

    return typeof some === 'object' &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        (typeof some.length === 'number') &&
        (some.length === 0 || (typeof some[0] === 'object' && some[0].nodeType > 0));
  }

  /**
  * Create an event suitable for dispatch.
  * @param {eventType} eventType A type of event.
  * @returns {CustomEvent}
  * @private
  */
  function createEvent_(eventType, opts) {
    var ev = {};
    if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
      ev = new CustomEvent(eventType, opts);

    } else if ('Event' in window && typeof window.Event === 'function') {
      ev = new Event(eventType, opts);

    } else {
      ev = document.createEvent('Events');
      ev.initEvent(eventType, opts.bubbles, opts.cancelable);
    }
    for (var n in opts) {
      if (n !== 'bubbles' && n !== 'cancelable') {
        ev[n] = opts[n];
      }
    }
    return ev;
  }

  /**
  * Create a new instance of EventManager for the given node.
  * @param {DomNode} node A DomNode.
  * @returns {EventManager}
  */
  function EventManager(node) {
    this.domNode = node;
    this.userEventHandlers = {};
    this.subscribedDomEvents = {};
  }
  EventManager.prototype.userEventHandlers = {}; /* eventName => [handlers...] */
  EventManager.prototype.domNode = null;
  EventManager.prototype.subscribedDomEvents = {};

  /**
  * Tell if current EventManager instance is managing given target node.
  * @param {DomNode} target A DomNode.
  * @returns {boolean}
  */
  EventManager.prototype.isNode = function(target) {
    return this.domNode === target;
  };

  /**
  * Subscribe this EventManager to a dom event.
  * @param {string} eventName The name of the event.
  */
  EventManager.prototype.subscribeToDomEvent = function(eventName) {
    eventName = getEventName(eventName);
    if (!this.subscribedDomEvents[eventName]) {
      var that = this;
      /**
      * xx
      */
      this.subscribedDomEvents[eventName] = function(ev) {
        var p = ev.stopImmediatePropagation;
        /**
        * Replacement of original stopImmediatePropagation
        * to catch and mark stopped event.
        */
        ev.stopImmediatePropagation = function() {
          ev.__HasStopped = true;
          p.call(ev);
        };
        if (!ev.onlyThisEventName) {
          that.triggerForEventName(eventName, ev);
        } else {
          that.triggerForEventName(ev.onlyThisEventName, ev);
        }
      };
      this.domNode.addEventListener(eventName, this.subscribedDomEvents[eventName], false);
    }
  };

  /**
  * Unsubscribe this EventManager to a dom event.
  * @param {string} eventName The name of the event.
  */
  EventManager.prototype.unsubscribeToDomEvent = function(eventName) {
    eventName = getEventName(eventName);
    if (this.subscribedDomEvents[eventName]) {
      this.domNode.removeEventListener(eventName, this.subscribedDomEvents[eventName]);
      this.subscribedDomEvents[eventName] = null;
    }
  };

  /**
  * Add a susbcription to given event.
  * @param {string} eventName The name of the event.
  * @param {string} handler The effective function bound to the dom.
  * @param {string} userFn The original function handler for a delegated event.
  * @param {string} delegationSelector The target of a delegated event.
  * @param {Object} The user event handler object.
  */
  EventManager.prototype.addUserEventHandler = function(eventName, handler, userFn, delegationSelector) {
    this.subscribeToDomEvent(eventName);
    var domEventName = getEventName(eventName);
    if (!this.userEventHandlers[domEventName]) {
      this.userEventHandlers[domEventName] = [];
    }
    var that = this;
    var ret = {
      eventName: eventName,
      effectiveHandler: handler,
      delegationSelector: delegationSelector,
      userHandler: userFn,
      debouncedHandler: null,
      scope: null,
      /**
      * Set the scope of the handler
      */
      bind: function(t) {
        ret.scope = t;
        return ret;
      },
      /**
      * Debounce the event handler.
      */
      debounce: function(delay) {
        ret.debouncedHandler = cherry.debounce(ret.userHandler || ret.effectiveHandler, delay);
        return ret;
      },
      /**
      * ensure the event triggers after len milliseconds.
      */
      // timeout: function(len) {
      //   ret.mustTimeout = setTimeout(function() {
      //     that.triggerForEventName(eventName);
      //   }, len);
      //   return ret;
      // },
      /**
      * ensure an event does not triggers before len milliseconds.
      */
      notBefore: function(len) {
        throw 'TODO';
        // return ret;
      },
      /**
      * clear event associated resources.
      */
      clear: function(len) {
        if (ret.debouncedHandler) {
          ret.debouncedHandler.cancel();
        }
      },
      /**
      * Set event handler to trigger in first.
      */
      first: function() {
        var i = that.userEventHandlers[domEventName].indexOf(ret);
        if (i > -1) {
          that.userEventHandlers[domEventName].splice(i, 1);
        }
        that.userEventHandlers[domEventName].unshift(ret);
        return ret;
      }
    };
    this.userEventHandlers[domEventName].push(ret);
    return ret;
  };

  /**
  * Remove a susbcription to given event.
  * @param {string} eventName The name of the event.
  * @param {string} handler The effective function, or the use function handler.
  * @param {string} delegationSelector The target of a delegated event.
  * @param {Object} scope The execution scope of the event handler.
  */
  EventManager.prototype.removeUserEventHandler = function(eventName, handler, delegationSelector, scope) {
    var domEventName = getEventName(eventName);
    if (this.userEventHandlers[domEventName]) {
      var rm = [];
      if (!handler) {
        this.userEventHandlers[domEventName].forEach(function(o, index) {
          if (o.eventName === eventName) {
            if (!scope || scope && scope === o.scope) {
              rm.push(index);
            }
          }
        });
      } else {
        this.userEventHandlers[domEventName].forEach(function(o, index) {
          if (o.eventName === eventName) {
            if (!scope || scope && scope === o.scope) {
              if (delegationSelector && o.delegationSelector === delegationSelector &&
                o.userHandler && o.userHandler === handler) {
                rm.push(index);
              } else if (delegationSelector && o.delegationSelector === delegationSelector && !handler) {
                rm.push(index);
              } else if (o.userHandler && o.userHandler === handler) {
                rm.push(index);
              } else if (!o.userHandler && o.effectiveHandler === handler) {
                rm.push(index);
              }
            }
          }
        });
      }
      rm.reverse().forEach(function(i) {
        // clearTimeout(this.userEventHandlers[domEventName][i].mustTimeout);
        this.userEventHandlers[domEventName][i].clear();
        this.userEventHandlers[domEventName].splice(i, 1);
      }.bind(this));
      var remaining = this.getAllRelatedUserEventHandlers(eventName);
      if (remaining.length === 0) {
        this.unsubscribeToDomEvent(eventName);
      }
    }
  };

  /**
  * Given an eventName, namespaced or not, returns all handlers
  * related to the Dom Event.
  * @param {string} eventName The name of the event.
  * @returns {Array} The list of handlers found.
  */
  EventManager.prototype.getAllRelatedUserEventHandlers = function(eventName) {
    var ret = [];
    var t = this.userEventHandlers;
    eventName = getEventName(eventName);
    /**
    * Lookup for all handlers related to a dom event.
    */
    Object.keys(t).forEach(function(name) {
      if (name === eventName) {
        ret = ret.concat(t[name]);
      }
    });
    return ret;
  };

  /**
  * Given an eventName, namespaced or not, returns handlers attached to it.
  * @param {string} eventName The name of the event.
  * @returns {Array} The list of handlers found.
  */
  EventManager.prototype.getUserEventHandlers = function(eventName) {
    if (isNamespaced(eventName) === false) {
      return this.userEventHandlers[eventName];
    } else {
      var ret = [];
      var t = this.userEventHandlers;
      /**
      * xx
      */
      Object.keys(t).forEach(function(name) {
        t[name].forEach(function(o) {
          if (o.eventName === eventName || o.eventName.substr(-eventName.length - 1) === '.' + eventName) {
            ret.push(o);
          }
        });
      });
      return ret;
    }
  };

  /**
  * Triggers given event name against this instance of event manager.
  * @param {string} eventName The name of the event.
  * @param {Event} ev The event object.
  */
  EventManager.prototype.triggerForEventName = function(eventName, ev) {
    ev = ev || {};
    var eventHandlers = this.getUserEventHandlers(eventName);
    eventHandlers.forEach(function(o) {
      // clearTimeout(o.mustTimeout);
      if (!ev.__HasStopped) {
        var fn = (o.debouncedHandler || o.effectiveHandler);
        if (o.scope !== null) {
          fn.call(o.scope, ev);
        } else {
          fn(ev);
        }
      }
    });
  };

  /**
  * Tells if this instance of event manager is empty, useless.
  * @returns {Bool}
  */
  EventManager.prototype.IsEmpty = function() {
    var total = 0;
    var t = this.userEventHandlers;
    Object.keys(t).forEach(function(evName) {
      total += t[evName].length;
    });
    return total === 0;
  };

  /**
  * Clear all subscriptions to dom or user events.
  */
  EventManager.prototype.Clear = function() {
    Object.keys(this.userEventHandlers).forEach(function(evName) {
      this.userEventHandlers[evName].forEach(function(h) {
        h.clear();
      });
      this.unsubscribeToDomEvent(evName);
    }.bind(this));
    this.userEventHandlers = [];
  };

  /**
  * An UserEventHandlerProxy is a proxy object
  * to manipulate multiple instances of UserEventHandlers
  * as one.
  */
  function UserEventHandlerProxy() {
    this.items = [];
  }
  /**
  * Add an instance of UserEventHandler to this proxy.
  * @param {UserEventHandler} eventHandler An UserEventHandler instance.
  * @returns {UserEventHandlerProxy}
  */
  UserEventHandlerProxy.prototype.add = function(eventHandler) {
    this.items.push(eventHandler);
    return this;
  };
  /**
  * Set the scope the event handler function will consume.
  * @param {Object} scope The scope to apply to the event handler.
  * @returns {UserEventHandlerProxy}
  */
  UserEventHandlerProxy.prototype.bind = function(scope) {
    this.items.forEach(function(item) {
      item.bind(scope);
    });
    return this;
  };
  /**
  * Debounce an event handler.
  * @param {int} delay The delay to apply.
  * @returns {UserEventHandlerProxy}
  */
  UserEventHandlerProxy.prototype.debounce = function(delay) {
    this.items.forEach(function(item) {
      item.debounce(delay);
    });
    return this;
  };
  /**
  * Ensure the event triggers after len milliseconds.
  * @param {int} len The delay to apply.
  * @returns {UserEventHandlerProxy}
  */
  // UserEventHandlerProxy.prototype.timeout = function(len) {
  //   this.items.forEach(function(item) {
  //     item.timeout(len);
  //   });
  //   return this;
  // };
  /**
  * Set the event to run first in the event queue.
  * @returns {UserEventHandlerProxy}
  */
  UserEventHandlerProxy.prototype.first = function() {
    this.items.forEach(function(item) {
      item.first();
    });
    return this;
  };

  /**
  * Susbcribe given evHandler for evName on the provided targetNode.
  * @param {DomNode} targetNode The node listen.
  * @param {string} evName The name of the event.
  * @param {Function} evHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var on = function(selector, evName, evHandler) {
    var ret = new UserEventHandlerProxy();
    var targetNodes = getElement(selector);
    for (var i = 0; i < targetNodes.length; i++) {
      var targetNode = targetNodes[i];
      if (!targetNode.__eventManager) {
        targetNode.__eventManager = new EventManager(targetNode);
      }
      var nodeEventManager = targetNode.__eventManager;
      var userEventHandler = nodeEventManager.addUserEventHandler(evName, evHandler);
      ret.add(userEventHandler);
    }
    return ret;
  };
  cherry.on = on;
  cherry['on'] = on;

  /**
  * Susbcribe given evHandler for evName on the provided targetNode,
  * for one trigger only.
  * @param {DomNode} selector The node listen.
  * @param {string} evName The name of the event.
  * @param {Function} evHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var once = function(selector, evName, evHandler) {
    /**
    * the handler that is unsubscribing the event handler once the event fired.
    */
    var handler = function(ev) {
      evHandler.call(this, ev);
      off(selector, evName, handler);
    };
    return on(selector, evName, handler);
  };
  cherry.once = once;
  cherry['once'] = once;

  /**
  * Unsusbcribe given evHandler for evName on the provided targetNode.
  * @param {DomNode} targetNode The node to listen.
  * @param {string} evName The name of the event.
  * @param {Function} evHandler The event handler callback.
  * @param {Object} scope The execution scope of the function handler.
  */
  var off = function(selector, evName, evHandler, scope) {
    var targetNodes = getElement(selector);
    for (var i = 0; i < targetNodes.length; i++) {
      var targetNode = targetNodes[i];
      var nodeEventManager = targetNode.__eventManager;
      if (nodeEventManager) {
        nodeEventManager.removeUserEventHandler(evName, evHandler, null, scope);
        if (nodeEventManager.IsEmpty()) {
          nodeEventManager.Clear();
          targetNode.__eventManager = undefined;
        }
      }
    }
  };
  cherry.off = off;
  cherry['off'] = off;

  /**
  * Delegate events of evName to the provided userHandler
  * for the selector within rootNode.
  * @param {DomNode} rootSelector The rootNode to bind.
  * @param {string} selector The elemnts to listen for.
  * @param {string} evName The name of the event.
  * @param {Function} userHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var delegate = function(rootSelector, selector, evName, userHandler) {
    var rootNodes = getElement(rootSelector);

    var ret = new UserEventHandlerProxy();
    for (var i = 0; i < rootNodes.length; i++) {
      var rootNode = rootNodes[i];

      if (!rootNode.__eventManager) {
        rootNode.__eventManager = new EventManager(rootNode);
      }
      var nodeEventManager = rootNode.__eventManager;

      var effectiveHandler = createEffectiveHandler(rootNode, selector, userHandler);
      var userEventHandler = nodeEventManager.addUserEventHandler(
        evName, effectiveHandler, userHandler, selector);
      ret.add(userEventHandler);
    }
    return ret;
  };
  cherry.delegate = delegate;
  cherry['delegate'] = delegate;

  /**
  * Create a function to handle delegated events.
  */
  var createEffectiveHandler = function(rootNode, selector, userHandler) {
    return function(event) {
      var possibleTargets = rootNode.querySelectorAll(selector);
      var target = event.target;

      for (var i = 0, l = possibleTargets.length; i < l; i++) {
        var el = target;
        var p = possibleTargets[i];

        while (el && el !== rootNode) {
          if (el === p) {
            event.delegateTarget = p;
            // this should be the same as userEventHandler scope, if any was provided.
            return userHandler.call(this, event);
          }
          el = el.parentNode;
        }
      }
    };
  };

  /**
  * Delegate events of evName to the provided userHandler
  * for the selector within rootNode.
  * You can also use
  *   cherry.undelegate(rootNode, selector)
  *   cherry.undelegate(rootNode, evName)
  *   cherry.undelegate(rootNode, evName, handler)
  * @param {DomNode} rootSelector The node listen.
  * @param {string} selector The selector of the delegation.
  * @param {string} evName The event name.
  * @param {Function} evHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var undelegate = function(rootSelector, selector, evName, evHandler, scope) {
    if (!evName && !evHandler) {
      scope = evHandler;
      evHandler = evName;
      evName = selector;
      selector = null;
    } else if (evName.apply) {
      scope = evHandler;
      evHandler = evName;
      evName = selector;
      selector = null;
    }
    var rootNodes = getElement(rootSelector);
    for (var i = 0; i < rootNodes.length; i++) {
      var rootNode = rootNodes[i];

      var nodeEventManager = rootNode.__eventManager;
      if (nodeEventManager) {
        nodeEventManager.removeUserEventHandler(evName, evHandler, selector, scope);
        if (nodeEventManager.IsEmpty()) {
          nodeEventManager.Clear();
          rootNode.__eventManager = undefined;
        }
      }
    }
  };
  cherry.undelegate = undelegate;
  cherry['undelegate'] = undelegate;

  /**
  * Triggers given event evName on targetNode with the provided opts.
  * if opts is null, it is set to an object.
  * if opts will have bubble:true and cancellable:true properties
  * set by default if they are not provided.
  * @param {DomNode} selector The node to trigger the event.
  * @param {string} evName The name of the event.
  * @param {Object} opts The event options.
  */
  var trigger = function(selector, evName, opts) {
    if (!opts) {
      opts = {};
    }
    if (opts['bubbles'] === undefined) {
      opts.bubbles = true;
    }
    if (opts['cancelable'] === undefined) {
      opts.cancelable = true;
    }
    var ev = createEvent_(getEventName(evName), opts);
    if (isNamespaced(evName)) {
      ev.onlyThisEventName = evName;
    }
    getElement(selector).forEach(function(node) {
      node.dispatchEvent(ev);
    });
  };
  cherry.trigger = trigger;
  cherry['trigger'] = trigger;

})(window);
