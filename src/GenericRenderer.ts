import { Renderer } from './Renderer.ts';

export class GenericRenderer<
	OutputGeneric,
	PropsGeneric extends { [key: string]: unknown } | undefined = undefined,
> extends Renderer<OutputGeneric, PropsGeneric> {
	constructor(...sets: GenericRenderer<OutputGeneric, PropsGeneric>[]) {
		super((component, props) => (component ? component(props) : null), ...sets);
	}
}

export class ReactRenderer<
	// deno-lint-ignore no-explicit-any
	CreateElementGeneric extends (Component: any, props: any, ...children: any[]) => unknown,
	PropsGeneric extends { [key: string]: unknown } | undefined = undefined,
> extends Renderer<ReturnType<CreateElementGeneric>, PropsGeneric> {
	constructor(
		createElement: CreateElementGeneric,
		...sets: ReactRenderer<CreateElementGeneric, PropsGeneric>[]
	) {
		super(
			(component, props) =>
				component ? (createElement(component, props) as ReturnType<CreateElementGeneric>) : null,
			...sets,
		);
	}
}
