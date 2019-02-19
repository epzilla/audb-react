export const gameIsInFuture = (game) => {
  let now = new Date();
  let gameDate = new Date(game.date);
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  now.setMilliseconds(0);
  gameDate.setHours(0);
  gameDate.setMinutes(0);
  gameDate.setSeconds(0);
  gameDate.setMilliseconds(0);
  return gameDate.getTime() >= now.getTime();
};

export const debounce = function (func: Function, wait: number, immediate?: boolean) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};