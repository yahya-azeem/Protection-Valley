
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>
		};
		Pathname(): "/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/images/apron-1.jpg" | "/images/gloves-1.jpg" | "/images/hero-bg.jpg" | "/images/kneepads-1.jpg" | "/images/logo-v3.png" | "/images/logo.png" | "/images/pouch-1.jpg" | "/images/pouch-2.jpg" | "/images/pouch-3.jpg" | "/images/rig-1.jpg" | "/images/suspenders-1.jpg" | "/images/toolbag-1.jpg" | "/images/toolbelt-1.jpg" | "/images/toolbelt-2.jpg" | "/images/toolbelt-3.jpg" | "/images/toolroll-1.jpg" | "/images/wristband-1.jpg" | string & {};
	}
}