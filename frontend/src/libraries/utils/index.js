export * from './select-options'

export function getMaxZIndex() {

    let highestZIndex = 0;
    highestZIndex = Math.max(
        highestZIndex,
        ...Array.from(document.querySelectorAll("body *:not([data-highest]):not(.yetHigher)"), (elem) => parseFloat(getComputedStyle(elem).zIndex))
          .filter((zIndex) => !isNaN(zIndex))
      );
      return highestZIndex
    
}