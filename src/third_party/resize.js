(function() {
  'use strict';

  /**
  * throttle an event according to available animation frames
  */
  var throttle = function(type, name) {
    var running = false;
    var needmore = false;
    /**
    * jj
    */
    var triggermore = function() {
      clearTimeout(needmore);
      needmore = setTimeout(function() {
        running = true;
        requestAnimationFrame(function() {
          window.dispatchEvent(new CustomEvent(name));
          running = false;
        });
      }, 250);
    };
    /**
    * jj
    */
    var trigger = function() {
      running = true;
      requestAnimationFrame(function() {
        window.dispatchEvent(new CustomEvent(name));
        triggermore();
        running = false;
      });
    };
    window.addEventListener(type, function() {
      if (running) {
        triggermore();
        return;
      }
      trigger();
    });
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize', window);
})();
