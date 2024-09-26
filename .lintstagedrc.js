module.exports = {
  '*.{js,jsx,ts,tsx,json,scss,css,html,md}': filenames => [
    `yarn prettier --write ${filenames.join(' ')}`,
  ],
  '*.{js,jsx,ts,tsx}': filenames => [
    `yarn eslint --fix ${filenames.join(' ')}`,
  ],
};
