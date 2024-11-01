import type { ChangeEvent, DragEvent, ForwardedRef } from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

const useFileUpload = (ref: ForwardedRef<unknown>) => {
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
  };

  const handleRemoveButtonClick = () => {
    if (fileRef.current) {
      fileRef.current.value = '';
      setUploadedFile(null);
    }
  };

  return {
    fileRef,
    isDropActive,
    fileName: uploadedFile?.[0]?.name || '',
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
