/**
 * A type that represents a value that exists (Some) or does not exist (None).
 */
interface Option<T> {
  /**
   * Returns true if the option is a Some value.
   */
  isSome(): this is Some<T>;

  /**
   * Returns true if the option is a None value.
   */
  isNone(): this is None;

  /**
   * Returns `this` if it is a None value, otherwise returns `other`.
   */
  and<U>(other: Option<U>): Option<U>;

  /**
   * Returns the result of calling `fn` with the wrapped Some value if this
   * option is a Some value, otherwise returns None.
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
}

/**
 * A Some value.
 */
class Some<T> implements Option<T> {
  constructor(public value: T) {}

  isSome(): this is Some<T> {
    return true;
  }

  isNone(): this is None {
    return false;
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
}

/**
 * A None value.
 *
 * This implements the Option interface with `never` as the type parameter,
 * because it is impossible to create a None with a value. It is compatible
 * with any Option type.
 */
class None implements Option<never> {
  isSome(): this is Some<never> {
    return false;
  }

  isNone(): this is None {
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
