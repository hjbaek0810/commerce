import type { PropsWithChildren } from 'react';
import type {
  FieldPath,
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { FormProvider } from 'react-hook-form';

import {
  RHFCheckbox,
  RHFCheckboxGroup,
} from '@components/Form/Checkbox/RHFCheckbox';
import RHFErrorMessage from '@components/Form/ErrorMessage';
import RHFInput from '@components/Form/Input/RHFInput';
import RHFLabel from '@components/Form/Label/RHFLabel';

import RHFFileUpload from './FileUpload/RHFFileUpload';
import { RHFRadio, RHFRadioGroup } from './Radio/RHFRadio';
import Select from './Select';
import RHFSelect from './Select/RHFSelect';
import RHFTextArea from './TextArea/RHFTextArea';

export type CommonRHFPropsType<T, U extends FieldValues> = {
  name?: FieldPath<U>;
  rules?: RegisterOptions<U>;
} & Omit<T, 'error'>;

type RHFFormPropsType<T extends FieldValues> = UseFormReturn<T> & {
  id?: string;
  onSubmit?: SubmitHandler<T>;
  className?: string;
};

export const RHFRules = <T extends FieldValues>(
  rules?: RegisterOptions<T>,
  required?: boolean,
) => ({
  ...(required && { required: true }),
  ...rules,
});

const Form = <T extends FieldValues>({
  id,
  onSubmit = () => {},
  children,
  className,
  ...form
}: PropsWithChildren<RHFFormPropsType<T>>) => (
  <FormProvider {...form}>
    <form id={id} onSubmit={form.handleSubmit(onSubmit)} className={className}>
      {children}
    </form>
  </FormProvider>
);

const Rhf = {
  Form,
  Label: RHFLabel,
  Input: RHFInput,
  Select: RHFSelect,
  SelectOption: Select.Option,
  CheckboxGroup: RHFCheckboxGroup,
  Checkbox: RHFCheckbox,
  Radio: RHFRadioGroup,
  RadioOption: RHFRadio,
  TextArea: RHFTextArea,
  FileUpload: RHFFileUpload,
  ErrorMessage: RHFErrorMessage,
};

export default Rhf;
