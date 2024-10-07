import type { PropsWithChildren } from 'react';
import type {
  FieldPath,
  RegisterOptions,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { type FieldValues, FormProvider } from 'react-hook-form';

import RHFErrorMessage from '@components/Form/ErrorMessage';
import RHFInput from '@components/Form/Input/RHFInput';
import RHFLabel from '@components/Form/Label/RHFLabel';

export type CommonRHFPropsType<T, U extends FieldValues> = {
  name?: FieldPath<U>;
  rules?: RegisterOptions<U>;
} & Omit<T, 'error'>;

type RHFFormPropsType<T extends FieldValues> = UseFormReturn<T> & {
  id?: string;
  onSubmit: SubmitHandler<T>;
};

const Form = <T extends FieldValues>({
  id,
  onSubmit,
  children,
  ...form
}: PropsWithChildren<RHFFormPropsType<T>>) => (
  <FormProvider {...form}>
    <form id={id} onSubmit={form.handleSubmit(onSubmit)}>
      {children}
    </form>
  </FormProvider>
);

const Rhf = {
  Form,
  Label: RHFLabel,
  Input: RHFInput,
  ErrorMessage: RHFErrorMessage,
};

export default Rhf;
