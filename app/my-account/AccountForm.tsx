'use client';

import useAccountForm from '@app/my-account/useAccountForm';
import Button from '@components/Button';
import Rhf from '@components/Form';
import { Table } from '@components/Table';
import Title from '@components/Title';
import {
  emailRules,
  isConfirmPasswordValidate,
  passwordRules,
  telephoneRules,
} from '@utils/validation';
import { PHONE_MAX_LENGTH } from '@utils/validation/telephone';

import * as css from './myAccount.css';

const AccountForm = () => {
  const {
    accountForm,
    isCustomUser,
    editable,
    onlyCustomUserEditable,
    passwordValue,
    editablePassword,
    isPending,
    handleUpdatePasswordButtonClick,
    handleTelephoneInput,
    handleCancelClick,
    handleEditClick,
    handleFindPostCodeButtonClick,
    handleUpdateMyAccount,
  } = useAccountForm();

  return (
    <>
      <Title size="large">My Account</Title>
      <Rhf.Form
        {...accountForm}
        className={css.accountFormWrapper}
        onSubmit={handleUpdateMyAccount}
      >
        <div className={css.buttonWrapper}>
          {editable ? (
            <>
              <Button
                size="medium"
                color="secondary"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button fill size="medium" type="submit">
                Save
              </Button>
            </>
          ) : (
            <Button
              fill
              size="medium"
              onClick={handleEditClick}
              disabled={isPending}
            >
              Edit
            </Button>
          )}
        </div>
        <Table>
          <Table.Body>
            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="name">이름</Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input name="name" disabled />
              </Table.Td>
            </Table.Tr>
            {isCustomUser && (
              <Table.Tr>
                <Table.Th scope="row">
                  <Rhf.Label name="loginId">아이디</Rhf.Label>
                </Table.Th>
                <Table.Td colSpan={2}>
                  <Rhf.Input name="loginId" disabled />
                  <Rhf.ErrorMessage name="loginId" />
                </Table.Td>
              </Table.Tr>
            )}

            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="email" required={onlyCustomUserEditable}>
                  이메일
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input
                  name="email"
                  required={onlyCustomUserEditable}
                  rules={emailRules}
                  disabled={!onlyCustomUserEditable}
                />
                <Rhf.ErrorMessage name="email" />
              </Table.Td>
            </Table.Tr>
            {onlyCustomUserEditable && (
              <>
                <Table.Tr>
                  <Table.Th scope="row">
                    <Rhf.Label name="password" required={editablePassword}>
                      비밀번호
                    </Rhf.Label>
                  </Table.Th>
                  <Table.Td colSpan={2}>
                    <div className={css.passwordWrapper}>
                      <Button
                        fill={editablePassword}
                        onClick={handleUpdatePasswordButtonClick}
                      >
                        {editablePassword ? '변경 취소' : '변경하기'}
                      </Button>
                      {editablePassword && (
                        <>
                          <Rhf.Input
                            name="password"
                            type="password"
                            autoComplete="one-time-code"
                            required
                            rules={passwordRules}
                          />
                          <Rhf.ErrorMessage name="password" />
                        </>
                      )}
                    </div>
                  </Table.Td>
                </Table.Tr>
                {editablePassword && (
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
                              password: passwordValue || '',
                              confirmPassword: value,
                            }),
                        }}
                      />
                      <Rhf.ErrorMessage name="confirmPassword" />
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
            )}

            <Table.Tr>
              <Table.Th scope="row">
                <Rhf.Label name="telephone" required={onlyCustomUserEditable}>
                  연락처
                </Rhf.Label>
              </Table.Th>
              <Table.Td colSpan={2}>
                <Rhf.Input
                  name="telephone"
                  placeholder="e.g. 010-1234-5678"
                  onInput={handleTelephoneInput}
                  maxLength={PHONE_MAX_LENGTH}
                  required={onlyCustomUserEditable}
                  rules={telephoneRules}
                  disabled={!editable}
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
                      disabled={!editable}
                    />
                    {editable && (
                      <Button onClick={handleFindPostCodeButtonClick}>
                        주소 찾기
                      </Button>
                    )}
                  </div>
                  <Rhf.Input
                    name="address"
                    placeholder="주소"
                    readOnly
                    disabled={!editable}
                  />
                  <Rhf.Input
                    name="subAddress"
                    placeholder="상세주소"
                    disabled={!editable}
                  />
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Body>
        </Table>
      </Rhf.Form>
    </>
  );
};

export default AccountForm;
