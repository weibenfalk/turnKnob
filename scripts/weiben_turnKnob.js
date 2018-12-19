(function() {
  // Only change these four!!!
  var STEPS = 1000;
  var MIN_VAL = 5000;
  var MAX_VAL = 30000;
  var MAX_LIMIT_DEGREES = 180;
  var START_VALUE_DEGREES = 115;

  // Subtract 5 from the maxlimit as a quickfix for reaching the maxvalue before full 180 turn
  var stepDegrees = (MAX_LIMIT_DEGREES-5) / ((MAX_VAL - MIN_VAL) / STEPS);
  var R2D, active, center, init, rotate, rotation, start, prevAngle, stop, totalRotation, amount;

  // Convert radians to degrees
  R2D = 180 / Math.PI;

  amount = 0;
  active = false;
  totalRotation = START_VALUE_DEGREES;
  rotation = START_VALUE_DEGREES;
  prevAngle = START_VALUE_DEGREES;

  center = {x: 0, y: 0};

  function turnKnob() {
    document.getElementById('target').style.webkitTransform = "rotate(" + totalRotation + "deg)";
    document.getElementById('target').style.transform = "rotate(" + totalRotation + "deg)";
    document.getElementById('target').style.msTransform = "rotate(" + totalRotation + "deg)";
    // Count up the value
    amount = MIN_VAL + (Math.floor((totalRotation / stepDegrees)) * STEPS);
    // Below is a quickfix for reaching the maxvalue before max turn angle
    document.getElementById('value').innerHTML = amount;
  }

  // Init
  turnKnob();

  document.getElementById('target').addEventListener("mousedown", start, false);
  document.addEventListener("mousemove", rotate, false);
  document.addEventListener("mouseup", stop, false);

  // Init for touch implementation
  document.addEventListener("touchstart", touch2Mouse, { passive: false });
  document.addEventListener("touchmove", touch2Mouse, { passive: false });
  document.addEventListener("touchend", touch2Mouse, { passive: false });

  function start(e) {
      var height, left, top, width, x, y, _ref;
      e.preventDefault();

      _ref = this.getBoundingClientRect(), top = _ref.top, left = _ref.left, height = _ref.height, width = _ref.width;

      center = {
          x: left + (width / 2),
          y: top + (height / 2)
      };

      // Get the distance to the mouse click from the element center
      x = e.clientX - center.x;
      y = e.clientY - center.y;

      prevAngle = Math.round(R2D * Math.atan2(y, x) + 180); // +180 needed to convert to regular 0-360 degrees
      active = true;
  };

  function rotate(e) {
      if (active) {
          e.preventDefault();

          var rotationAngle, dx, dy;

          dx = e.clientX - center.x;
          dy = e.clientY - center.y;
          rotationAngle = Math.round(R2D * Math.atan2(dy, dx) + 180); // +180 needed to convert to regular 0-360 degrees
          rotation = Math.round(rotationAngle - prevAngle) % 360;

          if (rotation > 180) {
              rotation = -360 + rotation;
          } else if (rotation < -180) {
              rotation = 360 + rotation;
          }

          prevAngle = rotationAngle;

          // Calculate the new total but don't store it yet.
          var tempTotalRotation = (totalRotation + rotation);

          // Check that the calculated new total is within limits.
          if (tempTotalRotation >= 0 && tempTotalRotation <= MAX_LIMIT_DEGREES) {
              // Store the new total.
              totalRotation = tempTotalRotation;
              // Turn the knob with the new values
              turnKnob();
          }
      }
  };

  function stop() {
      active = false;
  };

  // BELOW CODE IS FOR TOUCH INTERACTION
  // CREATE MOUSE EVENTS OF THE TOUCH EVENTS
  function touch2Mouse(e) {
    // Only prevent touch scrolling when we're turning the knob
    if (active) {
      e.preventDefault();
    }

    var theTouch = e.changedTouches[0];
    var mouseEv;

    switch (e.type)
    {
        case "touchstart":
            mouseEv = "mousedown";
            break;
        case "touchend":
            mouseEv = "mouseup";
            break;
        case "touchmove":
            mouseEv = "mousemove";
            break;
        default:
            return;
    }

    var mouseEvent = document.createEvent("MouseEvent");
    mouseEvent.initMouseEvent(mouseEv, true, true, window, 1, theTouch.screenX, theTouch.screenY, theTouch.clientX, theTouch.clientY, false, false, false, false, 0, null);
    theTouch.target.dispatchEvent(mouseEvent);
  }
  // END OF TOUCH IMPLEMENTATION
  })();