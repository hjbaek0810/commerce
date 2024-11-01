import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';

import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '@components/Button';

import * as css from './fileUpload.css';
import useFileUpload from './useFileUpload';

export type FileUploadPropsType = {
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
};

const FileUpload = forwardRef(
  ({ name, onChange, error = false }: FileUploadPropsType, ref) => {
    const {
      fileName,
      fileRef,
      isDropActive,
      handleSelectFileClick,
      handleFileChange,
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDrop,
    } = useFileUpload(ref);

    return (
      <div
        className={css.fileWrapper({ active: isDropActive })}
        onDragEnter={handleDragStart}
        onDragLeave={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          hidden
          name={name}
          onChange={event => {
            handleFileChange(event);
            onChange?.(event);
          }}
          ref={fileRef}
        />

        {error && (
          <FontAwesomeIcon
            className={css.errorIcon}
            icon={faExclamationCircle}
          />
        )}

        {isDropActive ? (
          <p className={css.fileName({ attached: false })}>Drop file here</p>
        ) : (
          <>
            <p className={css.fileName({ attached: !!fileName })}>
              {fileName || 'No file attached'}
            </p>
            <Button
              fill
              onClick={handleSelectFileClick}
              className={css.uploadButton}
            >
              Upload
            </Button>
          </>
        )}
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
