function isObjectWithKey1<TValue, TKey extends PropertyKey>(
  value: TValue,
  key: TKey,
): value is Extract<TValue, object> & { [P in TKey]?: unknown } {
  return typeof value === 'object' && value !== null && hasKey(value, key);
}

function isObjectWithKey<TValue, TKey extends PropertyKey>(
  value: TValue,
  key: TKey,
): value is Extract<TValue, { [P in TKey]?: unknown }> {
  return typeof value === 'object' && value !== null && key in value;
}

// More generalized approach: Provides uniformity for all types of keys.
function isObjectWithKeyGen<T, K extends PropertyKey>(
  target: T,
  key: K,
): target is T extends object
  ? T & Record<K, K extends keyof T ? T[K] : never>
  : never {
  if (!target) return false;
  if (typeof target !== 'object' && typeof target !== 'function') return false;

  return key in target;
}

function hasKey<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is Extract<T, { [P in K]?: unknown }> {
  return key in obj;
}

type ActionFields = { handlers: string[] } | { handler: { name: string } };

function handle(actionFields: ActionFields) {
  // Block 1
  if ('handler' in actionFields) {
    if ('name' in actionFields.handler) {
      console.log(actionFields.handler.name.toLowerCase());
    }
  }
  // Block 2
  if (hasKey(actionFields, 'handler')) {
    if (hasKey(actionFields.handler, 'name')) {
      console.log(actionFields.handler.name.toLowerCase());
    }
  }
}

type ActionFieldsUndef = { handlers: string[] } | { handler?: { name: string } };

function handleUndef(actionFields: ActionFieldsUndef) {
  // Block 1
  if ('handler' in actionFields && actionFields.handler) {
    if ('name' in actionFields.handler) {
      console.log(actionFields.handler.name.toLowerCase());
    }
  }
  // Block 2
  if (hasKey(actionFields, 'handler') && actionFields.handler) {
    if (hasKey(actionFields.handler, 'name')) {
      console.log(actionFields.handler.name.toLowerCase());
    }
  }

  // Block 3
  if (isObjectWithKey(actionFields, 'handler') && actionFields.handler) {
    if (isObjectWithKey(actionFields.handler, 'name')) {
      console.log(actionFields.handler.name.toLowerCase()); // actionFields. handler. name is of type unknown
    }
  }

  // Block 4
  if (isObjectWithKey(actionFields, 'handler')) {
    if (isObjectWithKey(actionFields.handler, 'name')) {
      console.log(actionFields.handler.name.toLowerCase()); // name does not exist on type never
    }
  }
}
