/**
 * @typedef {object} Node.Position within the document
 * @param {int} top - top pos
 * @param {int} left - left pos
 * @param {int} right - right pos
 * @param {int} bottom - bottom pos
 */

const STATE_VISIBLE   = Symbol( 'visible' ),
      STATE_INVISIBLE = Symbol( 'invisible' );

/**
 * Helper class to wrap a dom node, its position withi the viewport and its visibility.
 */
class Node {

	constructor () {

		/**
		 *
		 * @type {HTMLAnchorElement}
		 */
		this.root = null;

		/**
		 *
		 * @type {Symbol}
		 */
		this.visible = STATE_INVISIBLE;
	}

	/**
	 * Initialize the instance.
	 * @param {HTMLElement} root - the root node of the wrapped element.
	 * @return {Node} instance
	 */
	init ( root ) {

		this.root = root;

		return this;
	}

	/**
	 * Set a symbol for the visibility.
	 * @param {boolean} visibility - the state to be set
	 * @return {Node} instance - for chaining
	 */
	setVisibility ( visibility ) {

		if ( visibility === true ) {
			this.visible = STATE_VISIBLE;
		} else {
			this.visible = STATE_INVISIBLE;
		}

		return this;
	}

	/**
	 * Get item visibility.
	 * @return {Symbol} whether the item is visible
	 */
	isVisible () {
		return this.visible;
	}

	/**
	 * Get the element to which the node is attached to.
	 * @return {HTMLElement|*|HTMLAnchorElement} - the root node.
	 */
	getRoot () {
		return this.root;
	}
}

export default Node;

export { STATE_VISIBLE, STATE_INVISIBLE };
