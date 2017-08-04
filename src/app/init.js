export default function init(fn, container, ...args) {
    if (container) {
        try {
            return fn(container, ...args);
        } catch (e) {
            /* eslint-disable */
            console.error(e);
            /* eslint-enable */
        }
    }
    return null;
}
