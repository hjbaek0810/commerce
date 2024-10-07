import type { ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';

import { intersection, isEmpty } from 'lodash-es';

type NewObject = { [key: string]: any };

export const passPropsToSingleChild = (child: ReactNode, props: NewObject) => {
  if (isValidElement(child)) {
    const childProps = { ...props, ...child.props };

    const commonKeys = intersection(
      Object.keys(props),
      Object.keys(child.props),
    );
    const differentValues = commonKeys.filter(
      key => props[key] !== child.props[key],
    );

    if (!isEmpty(differentValues)) {
      console.warn(
        'Prop conflicts detected:',
        differentValues.map(
          key =>
            `${key}: ${props[key]} (original) vs ${child.props[key]} (new)`,
        ),
      );
    }

    const newChild = cloneElement(child, childProps);

    return newChild;
  }

  return child;
};

export const passPropsToChildren = (children: ReactNode, props: NewObject) =>
  Children.map(children, child => passPropsToSingleChild(child, props));
