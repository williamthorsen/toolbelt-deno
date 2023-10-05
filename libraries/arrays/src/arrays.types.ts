export type AnyArray<TItem> = WritableArray<TItem> | ReadonlyArray<TItem>;

export type NonEmptyArray<TItem> = [TItem, ...TItem[]];

export type WritableArray<TItem> = Array<TItem>;
