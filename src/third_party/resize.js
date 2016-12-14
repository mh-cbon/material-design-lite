(function() {
  'use strict';

  /**
  * throttle an event according to available animation frames
  */
  var throttle = function(type, name) {
    var running = false;
    window.addEventListener(type, function() {
      if (running) {
        return;
      }
      running = true;
      requestAnimationFrame(function() {
        window.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    });
  };

  /* init - you can init any event */
  throttle('resize', 'optimizedResize', window);
})();
