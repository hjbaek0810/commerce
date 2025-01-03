export const FileSystemError = {
  FILE_WRITE_FAILED: {
    code: 'FS-01',
    message: 'Failed to write the file to the local system.',
  },
  FILE_DELETE_FAILED: {
    code: 'FS-02',
    message: 'Failed to delete the file from the local system.',
  },
};

export const CloudinaryError = {
  UPLOAD_FAILED: {
    code: 'CLD-01',
    message: 'Failed to upload the image to Cloudinary.',
  },
  RETRIEVE_FAILED: {
    code: 'CLD-02',
    message: 'Failed to retrieve images from Cloudinary.',
  },
  DELETE_FAILED: {
    code: 'CLD-03',
    message: 'Failed to delete the image from Cloudinary.',
  },
};

export const FormDataError = {
  INVALID_FILE_FORMAT: {
    code: 'FD-01',
    message: 'Invalid file format provided.',
  },
  FORM_DATA_PARSING_FAILED: {
    code: 'FD-02',
    message: 'Failed to parse the form data.',
  },
};

export const GeneralError = {
  UNKNOWN_ERROR: {
    code: 'GEN-01',
    message: 'An unknown error occurred.',
  },
};
