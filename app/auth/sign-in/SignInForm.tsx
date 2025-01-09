'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import useSignInForm from '@app/auth/sign-in/useSignInForm';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { PATH } from '@utils/path';

import * as css from './signIn.css';

const SignInForm = () => {
  const { signInForm, handleSignInSubmit, isPending } = useSignInForm();

  return (
    <div className={css.signInWrapper}>
      <Title>Login</Title>

      <Rhf.Form
        {...signInForm}
        className={css.signInForm}
        onSubmit={handleSignInSubmit}
      >
        <div>
          <Rhf.Label name="loginId">ID</Rhf.Label>
          <Rhf.Input
            name="loginId"
            required
            onChange={() => signInForm.clearErrors('loginId')}
          />
        </div>
        <div>
          <Rhf.Label name="password">Password</Rhf.Label>
          <Rhf.Input
            name="password"
            type="password"
            autoComplete="one-time-code"
            required
            onChange={() => signInForm.clearErrors('password')}
          />
        </div>
        <Button size="large" fill type="submit" disabled={isPending}>
          Sign in
        </Button>
        <Link
          className={css.createAccountLink({ disabled: isPending })}
          href={PATH.SIGN_UP}
        >
          Create Account
        </Link>
      </Rhf.Form>

      <Button
        size="large"
        onClick={() => signIn('google')}
        disabled={isPending}
      >
        <Image
          width={24}
          height={24}
          src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
          alt="google"
        />
        Sign in with Google
      </Button>
    </div>
  );
};

export default SignInForm;
