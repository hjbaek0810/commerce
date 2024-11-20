'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

import Button from '@components/Button';

// TODO: home header?
const GoogleLogin = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>{session.user?.email}</p>
        <Button onClick={() => signOut()}>Sign out</Button>
      </>
    );
  } else {
    return <Button onClick={() => signIn()}>Sign in</Button>;
  }
};

export default GoogleLogin;
