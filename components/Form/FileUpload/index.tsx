import type { ChangeEvent } from 'react';
import { forwardRef } from 'react';

import {
  faExclamationCircle,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
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
      handleRemoveButtonClick,
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
            {fileName && (
              <button
                className={css.removeButton}
                onClick={handleRemoveButtonClick}
              >
                <FontAwesomeIcon className={css.removeIcon} icon={faXmark} />
              </button>
            )}
            <Button fill onClick={handleSelectFileClick}>
              {fileName ? 'Replace' : 'Upload'}
            </Button>
          </>
        )}
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;
