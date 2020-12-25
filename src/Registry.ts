import { compareSpecificity, evaluateXPathToBoolean } from 'fontoxpath';

/**
 * An XPath expression that must evaluate to truthy or falsy for a given node, which determines wether or not the
 * metadata value associated with the test applies.
 */
export type XmlRendererTest = string;

/**
 * The metadata associated with nodes that match the correlating test. This metadata value is normally a component
 * (rendering to React) or another type of function, but is not actually limited to any type.
 */
export type XmlRendererSet<T> = {
	test: XmlRendererTest;
	value: T;
};

export class Registry<T> {
	/**
	 * All test/value sets known to this registery. Is kept in descending order of test specificity because {@link
	 * Registry.optimize} is always called when modifying this set through public methods.
	 */
	private sets: XmlRendererSet<T>[] = [];

	/**
	 * A class that you instantiate to contain "metadata" associated with certain XML nodes. The metadata could be anything,
	 * but in context of being an "xml renderer" you'll probably want to use it for templates or React components.
	 *
	 * See also {@link GenericRenderer} and {@link ReactRenderer} which extend the `Registry` class and add a `.render()`
	 * method to it.
	 *
	 * Render functions (metadata) are associated with XML nodes via an XPath test. For any given node, the renderer will
	 * use the metadata associated the most specific test that matches the node.
	 */
	constructor(...sets: Registry<T>[]) {
		this.merge(...sets);
	}

	/**
	 * Reorders the sets based on XPath test specificity so that an `Array#find` finds the closest matching test
	 * first.
	 *
	 * For example `<b />` could match tests `self::b` as well as `self::b[not(child::*)]`, but the latter is more
	 * specific so it wins.
	 *
	 * This method is private because it is already called at all relevant times. Calling it again will normally not
	 * yield any different results.
	 */
	private optimize(): void {
		this.sets = this.sets
			// Sort alphabetically by test to get a consistent sorting even if selectors are equally specific
			.sort((setLeft, setRight) => setLeft.test.localeCompare(setRight.test))
			// Sort by descreasing specificity as determined by fontoxpath
			.sort((setLeft, setRight) => compareSpecificity(setRight.test, setLeft.test));
	}

	public get length() {
		return this.sets.length;
	}

	/**
	 * Merges other registry instances into this one, and optimizes ({@link Registry.optimize}) when done.
	 */
	public merge(...sets: Registry<T>[]): void {
		this.sets = sets.reduce(
			(sets: XmlRendererSet<T>[], registry) =>
				sets
					// Remove any duplicates from the pre-existing set
					.filter(set => !registry.sets.some(s => s.test === set.test))
					.concat(registry.sets),
			this.sets
		);

		this.optimize();
	}

	/**
	 * Add a test/value set to the registry, and optimizes ({@link Registry.optimize}).
	 */
	public add(test: XmlRendererTest, value: T): void {
		if (value === undefined) {
			throw new TypeError('Required to pass a value when adding to registry.');
		}
		if (this.sets.some(set => set.test === test)) {
			throw new TypeError(
				'Refusing to add a selector in duplicate, use #overwrite() instead.'
			);
		}
		this.sets.push({
			test,
			value
		});

		this.optimize();
	}
	public overwrite(test: XmlRendererTest, value: T): void {
		if (value === undefined) {
			throw new TypeError(
				'Required to pass a value when overwriting to registry, use #remove() instead.'
			);
		}
		const index = this.sets.findIndex(set => set.test === test);
		if (index < 0) {
			throw new TypeError(
				'Refusing to overwrite a selector because it was never set before.'
			);
		}
		this.sets.splice(index, 1, {
			test,
			value
		});
	}

	/**
	 * Remove a test/value set from the registry. This is the opposite of the {@link Registry.add} method.
	 */
	public remove(test: XmlRendererTest): boolean {
		const index = this.sets.findIndex(set => set.test === test);
		if (index < 0) {
			return false;
		}

		return this.sets.splice(index, 1).length === 1;
	}

	/**
	 * Retrieve the metadata that was associated with this node before. If there are several rules that match, `.find`
	 * gives you only the value of the best match.
	 */
	public find(node: Node): T | undefined {
		const set = this.sets.find(set => evaluateXPathToBoolean(set.test, node));

		return set?.value;
	}
}
