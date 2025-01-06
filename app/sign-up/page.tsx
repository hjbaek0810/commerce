'use client';

import useSignUp from '@app/sign-up/useSignUp';
import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import Title from '@components/Title';
import { sprinkles } from '@styles/sprinkles.css';
import { UserRoleType } from '@utils/constants/user';
import {
  emailRules,
  isConfirmPasswordValidate,
  passwordRules,
  telephoneRules,
} from '@utils/validation';
import { loginIdRules } from '@utils/validation/loginId';
import { PHONE_MAX_LENGTH } from '@utils/validation/telephone';

import * as css from './signUp.css';

const SignUp = () => {
  const {
    signUpForm,
    passwordValue,
    handleTelephoneInput,
    handleFindPostCodeButtonClick,
    handleSignUpSubmit,
  } = useSignUp();

  return (
    <>
      <Title size="large">회원 가입</Title>
      <Rhf.Form
        {...signUpForm}
        className={css.signUpFormWrapper}
        onSubmit={handleSignUpSubmit}
      >
        <Table>
          <Table.Body>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label isLegend>가입 유형</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Radio name="role">
                  <div
                    className={sprinkles({
                      display: 'flex',
                      gap: 'spacing-008',
                    })}
                  >
                    <Rhf.RadioOption value={UserRoleType.USER}>
                      User
                    </Rhf.RadioOption>
                    <Rhf.RadioOption value={UserRoleType.ADMIN}>
                      Admin
                    </Rhf.RadioOption>
                  </div>
                </Rhf.Radio>
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="name" required>
                  이름
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input name="name" required />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="loginId" required>
                  아이디
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input name="loginId" required rules={loginIdRules} />
                <Rhf.ErrorMessage name="loginId" />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="email" required>
                  이메일
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input name="email" required rules={emailRules} />
                <Rhf.ErrorMessage name="email" />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="password" required>
                  패스워드
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input
                  name="password"
                  type="password"
                  required
                  autoComplete="one-time-code"
                  rules={passwordRules}
                />
                <Rhf.ErrorMessage name="password" />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="confirmPassword" required>
                  패스워드 확인
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input
                  type="password"
                  name="confirmPassword"
                  required
                  autoComplete="one-time-code"
                  rules={{
                    validate: value =>
                      isConfirmPasswordValidate({
                        password: passwordValue,
                        confirmPassword: value,
                      }),
                  }}
                />
                <Rhf.ErrorMessage name="confirmPassword" />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="telephone" required>
                  연락처
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input
                  name="telephone"
                  placeholder="e.g. 010-1234-5678"
                  onInput={handleTelephoneInput}
                  maxLength={PHONE_MAX_LENGTH}
                  required
                  rules={telephoneRules}
                />
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="postCode">주소</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <div className={css.addressWrapper}>
                  <div className={css.postCodeWrapper}>
                    <Rhf.Input
                      name="postCode"
                      placeholder="우편번호"
                      readOnly
                    />
                    <Button onClick={handleFindPostCodeButtonClick}>
                      주소 찾기
                    </Button>
                  </div>
                  <Rhf.Input name="address" placeholder="주소" readOnly />
                  <Rhf.Input name="subAddress" placeholder="상세주소" />
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>
        <Button fill size="large" type="submit">
          회원가입
        </Button>
      </Rhf.Form>
    </>
  );
};

export default SignUp;
