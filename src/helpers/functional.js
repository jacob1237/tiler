/**
 * Apply memoization to an arbitrary function
 *
 * @param {Function} func
 * @param {string} separator Custom cache hashmap key separator for function arguments
 */
export function memoize(func, separator = ':') {
    const cache = {};

    return function() {
        const key = [...arguments].join(separator);

        if (typeof cache[key] === 'undefined') {
            cache[key] = func(...arguments);
        }

        return cache[key];
    };
}
