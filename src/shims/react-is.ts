import * as React from 'react';

export function isFragment(object: any): boolean {
  return (
    object &&
    (object.type === React.Fragment ||
      object.type === Symbol.for('react.fragment') ||
      object.$$typeof === Symbol.for('react.fragment'))
  );
}

export function isElement(object: any): boolean {
  return React.isValidElement(object);
}

export function isValidElementType(type: any): boolean {
  return (
    typeof type === 'string' ||
    typeof type === 'function' ||
    type === React.Fragment ||
    type === React.Suspense ||
    (typeof type === 'object' &&
      type !== null &&
      (type.$$typeof === Symbol.for('react.memo') ||
        type.$$typeof === Symbol.for('react.forward_ref') ||
        type.$$typeof === Symbol.for('react.provider') ||
        type.$$typeof === Symbol.for('react.context')))
  );
}

export function isContextConsumer(object: any): boolean {
  return object && object.$$typeof === Symbol.for('react.context');
}

export function isContextProvider(object: any): boolean {
  return object && object.$$typeof === Symbol.for('react.provider');
}

export function isForwardRef(object: any): boolean {
  return object && object.$$typeof === Symbol.for('react.forward_ref');
}

export function isMemo(object: any): boolean {
  return object && object.$$typeof === Symbol.for('react.memo');
}

export const Fragment = React.Fragment;
export const ForwardRef = Symbol.for('react.forward_ref');
export const Memo = Symbol.for('react.memo');

export default {
  isFragment,
  isElement,
  isValidElementType,
  isContextConsumer,
  isContextProvider,
  isForwardRef,
  isMemo,
  Fragment,
  ForwardRef,
  Memo,
};
