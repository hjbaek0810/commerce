import { xor } from 'lodash-es';

export type ListValueType = string | number | null;

const ListController = (values: ListValueType[]) => ({
  add: (newValue: ListValueType) =>
    ListController([...values, newValue] as ListValueType[]),
  remove: (valueToBeRemoved: ListValueType) =>
    ListController(values.filter(value => value !== valueToBeRemoved)),
  reset: () => ListController([] as ListValueType[]),
  isEmpty: () => values.length === 0,
  equal: (valuesToBeCompared: ListValueType[]) =>
    xor(values, valuesToBeCompared).length === 0,
  get: () => values,
});

export default ListController;
