/**
 * A type that represents a value that exists (Some) or does not exist (None).
 *
 * This is a monadic type that can be used to represent optional values. It is
 * based on the Option type in Rust.
 *
 * This type is preferred over using `null` or `undefined` to represent a value
 * that may not exist. It is more explicit and allows for more type safety.
 * It is also more ergonomic than using `null` or `undefined` in many cases.
 *
 * For example, it is possible to use `map` to transform the value of an option
 * without having to check if the value exists first:
 *
 * ```ts
 * const option = some(1);
 * const result = option.map(x => x + 1);
 * ```
 *
 * You can also use `andThen` to chain operations that return options:
 *
 * ```ts
 * const option = some(1);
 * const result = option.andThen(x => some(x + 1));
 * ```
 *
 * Or use `orElse` to provide a default value if the option is None:
 *
 * ```ts
 * const option = none;
 * const result = option.orElse(() => some(1));
 * ```
 *
 * Individual options can be combined using `and` and `or`:
 *
 * ```ts
 * const option1 = some(1);
 * const option2 = some(2);
 * const result = option1.and(option2); // result is Some(1)
 *
 * const option3 = none;
 * const option4 = some(4);
 * const result2 = option3.or(option4); // result2 is Some(4)
 */
export type Option<T> = Some<T> | None;

/**
 * An interface that represents the contract for the Option type.
 */
interface IOption<T> {
  /**
   * Returns true if the option is a Some value.
   */
  isSome(): this is Some<T>;

  /**
   * Returns true if the option is a Some value and the value satisfies the
   * predicate `fn`.
   */
  isSomeAnd<U extends T>(fn: (value: T) => value is U): this is Some<U>;
  isSomeAnd(fn: (value: T) => boolean): this is Some<T>;

  /**
   * Returns true if the option is a None value.
   */
  isNone(): this is None;

  /**
   * Returns true if the option is a None value or a Some with a value that
   * satisfies the predicate `fn`.
   */
  isNoneOr<U extends T>(fn: (value: T) => value is U): this is Option<U>;
  isNoneOr(fn: (value: T) => boolean): boolean;

  /**
   * Returns `this` if it is a None value, otherwise returns `other`.
   */
  and<U>(other: Option<U>): Option<U>;

  /**
   * Returns the result of calling `fn` with the wrapped Some value if this
   * option is a Some value, otherwise returns None.
   *
   * In monadic terms, this is the `bind` operation.
   */
  andThen<U>(fn: (value: T) => Option<U>): Option<U>;

  /**
   * Returns `this` option if it is a Some value, otherwise returns `other`.
   */
  or<U>(other: Option<U>): Option<T | U>;

  /**
   * Returns the result of calling `fn` if this option is a None value,
   * otherwise returns `this`.
   */
  orElse<U>(fn: () => Option<U>): Option<T | U>;

  /**
   * Maps the value of this option using the function `fn` if it is a Some,
   * otherwise returns None.
   */
  map<U>(fn: (value: T) => U): Option<U>;
}

/**
 * A Some value. This represents a value that exists.
 */
class Some<T> implements IOption<T> {
  constructor(public value: T) {}

  isSome(): this is Some<T> {
    return true;
  }

  isSomeAnd(fn: (value: T) => boolean): this is Some<T> {
    return fn(this.value);
  }

  isNone(): this is None {
    return false;
  }

  isNoneOr(fn: (value: T) => boolean): boolean {
    return fn(this.value);
  }

  and<U>(other: Option<U>): Option<U> {
    return other;
  }

  andThen<U>(fn: (value: T) => Option<U>): Option<U> {
    return fn(this.value);
  }

  or<U>(other: Option<U>): Option<T | U> {
    return this;
  }

  orElse<U>(fn: () => Option<U>): Option<T | U> {
    return this;
  }

  map<U>(fn: (value: T) => U): Option<U> {
    return some(fn(this.value));
  }
}

/**
 * A None value. This represents a value that does not exist.
 *
 * This implements the Option interface with `never` as the type parameter,
 * because it is impossible to create a None with a value. It is compatible
 * with any Option type.
 */
class None implements IOption<never> {
  isSome(): this is Some<never> {
    return false;
  }

  isSomeAnd(fn: unknown): boolean {
    return false;
  }

  isNone(): this is None {
    return true;
  }

  isNoneOr(fn: (value: never) => boolean): boolean {
    return true;
  }

  and<U>(other: Option<U>): Option<U> {
    return this;
  }

  andThen<U>(fn: (value: never) => Option<U>): Option<U> {
    return this;
  }

  or<U>(other: Option<U>): Option<U> {
    return other;
  }

  orElse<U>(fn: () => Option<U>): Option<U> {
    return fn();
  }

  map<U>(fn: (value: never) => U): Option<U> {
    return this;
  }
}

/**
 * Creates a Some value.
 */
export function some<T>(value: T): Option<T> {
  return new Some(value);
}

/**
 * A None value.
 */
export const none: Option<never> = new None();

/**
 * Collects an iterable of options into a single option of an array.
 * If any of the options are None, the result is None. Otherwise, the result
 * is a Some with an array of the contained values.
 */
export function collect<T>(options: Iterable<Option<T>>): Option<T[]> {
  const result: T[] = [];
  for (const option of options) {
    if (option.isNone()) {
      return none;
    }
    result.push(option.value);
  }
  return some(result);
}
