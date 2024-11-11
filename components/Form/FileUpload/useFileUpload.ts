import type { ChangeEvent, DragEvent, ForwardedRef } from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

import type { FileUploadPropsType } from '.';

type UseFileUploadPropsType = {
  ref: ForwardedRef<unknown>;
} & Pick<FileUploadPropsType, 'onChange' | 'onUpdateFile'>;

const useFileUpload = ({
  ref,
  onChange,
  onUpdateFile,
}: UseFileUploadPropsType) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => fileRef.current);

  const [isDropActive, setDropActive] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<FileList | null>(null);

  useEffect(() => {
    if (fileRef.current?.files) setUploadedFile(fileRef.current.files);
  }, [fileRef]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFile(event.target.files);
      onChange?.(event);
    }
  };

  const handleSelectFileClick = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDropActive(true);
  };

  const handleDragEnd = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDropActive(false);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer.files) {
      setDropActive(true);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setDropActive(false);
    setUploadedFile(event.dataTransfer.files);
    onUpdateFile?.(event.dataTransfer.files);
  };

  const handleRemoveButtonClick = () => {
    if (fileRef.current) {
      fileRef.current.value = '';
      setUploadedFile(null);
      onUpdateFile?.(null);
    }
  };

  return {
    fileRef,
    isDropActive,
    fileName: Array.from(uploadedFile || [])
      .map(file => file.name)
      .join(', '),
    handleSelectFileClick,
    handleFileChange,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleRemoveButtonClick,
  };
};

export default useFileUpload;
