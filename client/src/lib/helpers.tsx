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

/**
 * A function that emits a side effect and does not return anything.
 */
export type Procedure = (...args: any[]) => void;

export type Options = {
  isImmediate: boolean,
}

export function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds = 50,
  options: Options = {
    isImmediate: false
  },
): F {
  let timeoutId: any;

  return function (this: any, ...args: any[]) {
    const context = this;

    const doLater = function () {
      timeoutId = undefined;
      if (!options.isImmediate) {
        func.apply(context, args);
      }
    }

    const shouldCallNow = options.isImmediate && timeoutId === undefined;

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(doLater, waitMilliseconds);

    if (shouldCallNow) {
      func.apply(context, args);
    }
  } as any
}