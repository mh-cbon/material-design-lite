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
      element = some;
    } else if (some === window) {
      element = window;
    } else {
      element = document.querySelector(some);
    }
    return element;
  }

  /**
  * Create an event suitable for dispatch.
  * @param {eventType} eventType A type of event.
  * @returns {CustomEvent}
  * @private
  */
  function createEvent_(eventType, opts) {
    if ('CustomEvent' in window && typeof window.CustomEvent === 'function') {
      return new CustomEvent(eventType, opts);
    } else {
      var ev = document.createEvent('Events');
      ev.initEvent(eventType, opts.bubbles, opts.cancelable);
      for (var n in opts) {
        if (n !== 'bubbles' && n !== 'cancelable') {
          ev[n] = opts[n];
        }
      }
      return ev;
    }
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
      this.domNode.addEventListener(eventName, this.subscribedDomEvents[eventName]);
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
    if (!this.userEventHandlers[eventName]) {
      this.userEventHandlers[eventName] = [];
    }
    var ret = {
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
      * Set the scope of the handler
      */
      debounce: function(delay) {
        ret.debouncedHandler = cherry.debounce(ret.userHandler || ret.effectiveHandler, delay);
        return ret;
      }
    };
    this.userEventHandlers[eventName].push(ret);
    return ret;
  };

  /**
  * Remove a susbcription to given event.
  * @param {string} eventName The name of the event.
  * @param {string} handler The effective function, or the use function handler.
  * @param {string} delegationSelector The target of a delegated event.
  */
  EventManager.prototype.removeUserEventHandler = function(eventName, handler, delegationSelector) {
    if (this.userEventHandlers[eventName]) {
      if (!handler) {
        this.userEventHandlers[eventName] = [];
      } else {
        var i = -1;
        this.userEventHandlers[eventName].forEach(function(o, index) {
          if (delegationSelector && o.delegationSelector === delegationSelector &&
              o.userHandler && o.userHandler === handler) {
            i = index;
          } else if (delegationSelector && o.delegationSelector === delegationSelector && !handler) {
            i = index;
          } else if (o.userHandler && o.userHandler === handler) {
            i = index;
          } else if (!o.userHandler && o.effectiveHandler === handler) {
            i = index;
          }
        });
        if (i > -1) {
          this.userEventHandlers[eventName].splice(i, 1);
        }
      }
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
      if (name.substr(-eventName.length) === eventName) {
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
        if (name.substr(-eventName.length) === eventName) {
          ret = ret.concat(t[name]);
        }
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
    var eventHandlers = this.getUserEventHandlers(eventName);
    eventHandlers.forEach(function(o) {
      // there should be some test for cancelled event right here.
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
    var that = this;
    Object.keys(this.userEventHandlers).forEach(function(evName) {
      that.unsubscribeToDomEvent(evName);
    });
    this.userEventHandlers = [];
  };

  // registry is a global registry of all events currently managed.
  var registry = [];

  /**
  * Add a new EventManager instance for given node to the registry.
  * @param {DomNode} targetNode The node to manage.
  * @returns {EventManager}
  */
  registry.AddNewItem = function(targetNode) {
    var ret = new EventManager(targetNode);
    registry.push(ret);
    return ret;
  };

  /**
  * Get an existing EventManager for the given node.
  * @param {DomNode} targetNode The node to manage.
  * @returns {EventManager|null}
  */
  registry.GetItem = function(targetNode) {
    var f = null;
    registry.forEach(function(item) {
      if (item.isNode(targetNode)) {
        f = item;
      }
    });
    return f;
  };

  /**
  * Removes an existing EventManager for the given node.
  * @param {DomNode} targetNode The node to manage.
  * @returns {EventManager|null}
  */
  registry.RemoveItem = function(targetNode) {
    var f = -1;
    registry.forEach(function(item, index) {
      if (item.isNode(targetNode)) {
        f = index;
      }
    });
    if (f > -1) {
      registry.splice(f, 1);
    }
  };

  /**
  * Clear all registred EventManager instances and reset the registry.
  */
  registry.Reset = function() {
    registry.forEach(function(item, index) {
      item.Clear();
    });
    registry.splice(0, registry.length);
  };

  cherry.__registry = registry;

  /**
  * Susbcribe given evHandler for evName on the provided targetNode.
  * @param {DomNode} targetNode The node listen.
  * @param {string} evName The name of the event.
  * @param {Function} evHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var on = function(targetNode, evName, evHandler) {
    targetNode = getElement(targetNode);
    var item = registry.GetItem(targetNode);
    if (!item) {
      item = registry.AddNewItem(targetNode);
    }
    return item.addUserEventHandler(evName, evHandler);
  };
  cherry.on = on;
  cherry['on'] = on;

  /**
  * Susbcribe given evHandler for evName on the provided targetNode,
  * for one trigger only.
  * @param {DomNode} targetNode The node listen.
  * @param {string} evName The name of the event.
  * @param {Function} evHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var once = function(targetNode, evName, evHandler) {
    targetNode = getElement(targetNode);
    /**
    * the handler that is unsubscribing the event handler once the event fired.
    */
    var handler = function(ev) {
      evHandler.call(this, ev);
      off(targetNode, evName, handler);
    };
    return on(targetNode, evName, handler);
  };
  cherry.once = once;
  cherry['once'] = once;

  /**
  * Unsusbcribe given evHandler for evName on the provided targetNode.
  * @param {DomNode} targetNode The node to listen.
  * @param {string} evName The name of the event.
  * @param {Function} evHandler The event handler callback.
  */
  var off = function(targetNode, evName, evHandler) {
    targetNode = getElement(targetNode);
    var item = registry.GetItem(targetNode);
    if (item) {
      item.removeUserEventHandler(evName, evHandler);
      if (item.IsEmpty()) {
        registry.RemoveItem(targetNode);
      }
    }
  };
  cherry.off = off;
  cherry['off'] = off;

  /**
  * Delegate events of evName to the provided userHandler
  * for the selector within rootNode.
  * @param {DomNode} rootNode The rootNode to bind.
  * @param {string} selector The elemnts to listen for.
  * @param {string} evName The name of the event.
  * @param {Function} userHandler The event handler callback.
  * @param {Object} The user event handler object.
  */
  var delegate = function(rootNode, selector, evName, userHandler) {
    rootNode = getElement(rootNode);

    /**
    * The function handler bound to the event.
    */
    var effectiveHandler = function(event) {
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

    var item = registry.GetItem(rootNode);
    if (!item) {
      item = registry.AddNewItem(rootNode);
    }
    return item.addUserEventHandler(evName, effectiveHandler, userHandler, selector);
  };
  cherry.delegate = delegate;
  cherry['delegate'] = delegate;

  /**
  * Delegate events of evName to the provided userHandler
  * for the selector within rootNode.
  * You can also use
  *   cherry.undelegate(rootNode, selector)
  *   cherry.undelegate(rootNode, evName)
  *   cherry.undelegate(rootNode, evName, handler)
  * @param {DomNode} rootNode The node listen.
  * @param {string} evName The name of the event.
  * @param {Function} evName The event handler callback.
  */
  var undelegate = function(rootNode, selector, evName, evHandler) {
    rootNode = getElement(rootNode);
    var item = registry.GetItem(rootNode);
    if (item) {
      if (!evName && !evHandler) {
        evName = selector;
        selector = null;
      } else if (evName.apply) {
        evHandler = evName;
        evName = selector;
        selector = null;
      }
      item.removeUserEventHandler(evName, evHandler, selector);
      if (item.IsEmpty()) {
        registry.RemoveItem(rootNode);
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
  * @param {DomNode} targetNode The node to trigger the event.
  * @param {string} evName The name of the event.
  * @param {Object} opts The event options.
  */
  var trigger = function(targetNode, evName, opts) {
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
    getElement(targetNode).dispatchEvent(ev);
  };
  cherry.trigger = trigger;
  cherry['trigger'] = trigger;

})(window);
