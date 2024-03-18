/**
 * General-purpose utilities which are not specific to one of the plugins.
 */

/**
 * Returns the last item of the given array.
 */
export function getLast<T extends readonly unknown[]>(items: T): T[number] {
  return items[items.length - 1];
}

export const objectKeys = Object.keys as <T>(o: T) => readonly Extract<keyof T, string>[];

/**
 * Enforces the invariant that the input is an array.
 */
export function arrayify<T>(value: T | readonly T[]): readonly T[] {
  return Array.isArray(value) ? value : (value ? [value] : []);
}

/**
 * Checks if the input is not null or undefined.
 */
export const isNotNullOrUndefined = <T>(input: null | undefined | T): input is T => input != null;

export const kebabToCamelCase = (value: string): string =>
  value.replace(/-[a-zA-Z]/g, (match) => match[1].toUpperCase());

/**
 * Converts an array to human-readable text.
 */
export const toHumanReadableText = (items: readonly string[]): string => {
  const itemsLength = items.length;

  if (itemsLength === 1) {
    return `"${items[0]}"`;
  }

  return `${items.slice(0, -1).join(', ')} or "${items[itemsLength - 1]}"`;
};

export const toPattern = (value: readonly unknown[]): RegExp =>
  new RegExp(`^(${value.join('|')})$`);

/**
 * Capitalizes the first letter of the given text.
 */
export function capitalize<T extends string>(text: T): Capitalize<T> {
  return text.charAt(0).toUpperCase() + text.slice(1) as Capitalize<T>;
}

/**
 * Removes brackets and whitespaces from the given text.
 */
export function withoutBracketsAndWhitespaces(text: string): string {
  return text.replace(/[\[\]\s]/g, '');
}
