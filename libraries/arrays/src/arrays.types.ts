export type AnyArray<TItem> = Array<TItem> | ReadonlyArray<TItem>;

export type ImmutableArray<TItem> = Immutable<AnyArray<TItem>>;

export type NonEmptyArray<TItem> = Readonly<[TItem, ...TItem[]]>;

type Immutable<T> = T & { push?: never };
