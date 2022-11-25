var buttonPressTimer;
var timerRunning = false;
var eventCallback = () => {};
export function handleTouchClickEvents(e, callback = (type, event) => {}) {
  eventCallback = callback ? callback : () => {};

  if (e.nativeEvent.which === 1 && e.type === "click") {
    eventCallback("click", e);
    e.nativeEvent.preventDefault(true);
  } else if (e.nativeEvent.which === 3 && e.type === "contextmenu") {
    eventCallback("rightClick", e);
    e.nativeEvent.preventDefault(true);
  } else if (e.nativeEvent.which === 0 && e.type === "touchstart") {
    if (!timerRunning) {
      buttonPressTimer = setTimeout(() => {
        timerRunning = false;
        eventCallback("longPress", e);
        e.nativeEvent.preventDefault(true);
      }, 300);
      timerRunning = true;
    }
  } else if (e.nativeEvent.which === 0 && e.type === "touchmove") {
    if (timerRunning) {
      clearTimeout(buttonPressTimer);
      timerRunning = false;
      e.nativeEvent.preventDefault(true);
    }
  } else if (e.nativeEvent.which === 0 && e.type === "touchend") {
    if (timerRunning) {
      eventCallback("onTouch", e);
    }
    clearTimeout(buttonPressTimer);
    timerRunning = false;
    e.nativeEvent.preventDefault(true);
  }
}
