/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
/* eslint-disable linebreak-style */
export function moveAt(element, deltas) {
  // eslint-disable-next-line no-restricted-globals
  element.style.left = `${event.clientX - deltas.x}px`;

  // eslint-disable-next-line no-restricted-globals
  element.style.top = `${event.clientY - deltas.y}px`;
}

export function getPosition(event, target) {
  const targetRect = target.getBoundingClientRect();

  if (event.clientY <= targetRect.top + targetRect.height / 2) {
    return true;
  }
  return false;
}
