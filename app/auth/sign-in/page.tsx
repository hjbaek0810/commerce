'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import useSignIn from '@app/auth/sign-in/useSignIn';
import Button from '@components/Button';
import Rhf from '@components/Form';
import Title from '@components/Title';
import { PATH } from '@utils/path';

import * as css from './signIn.css';

const GoogleAuthSignIn = () => {
  const { signInForm, handleSignInSubmit } = useSignIn();

  return (
    <div className={css.signInWrapper}>
      <Title>Login</Title>

      <Rhf.Form
        {...signInForm}
        className={css.signInForm}
        onSubmit={handleSignInSubmit}
      >
        <div>
          <Rhf.Label>ID</Rhf.Label>
          <Rhf.Input
            name="loginId"
            required
            onChange={() => signInForm.clearErrors('loginId')}
          />
        </div>
        <div>
          <Rhf.Label>Password</Rhf.Label>
          <Rhf.Input
            name="password"
            type="password"
            required
            onChange={() => signInForm.clearErrors('password')}
          />
        </div>
        <Button size="large" fill type="submit">
          Sign in
        </Button>
        <Link className={css.createAccountLink} href={PATH.SIGN_UP}>
          Create Account
        </Link>
      </Rhf.Form>

      <Button size="large" onClick={() => signIn('google')}>
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

export default GoogleAuthSignIn;
