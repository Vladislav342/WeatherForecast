module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(lodash-es|@reduxjs/toolkit|@standard-schema)/)',
  ],
};

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'jsdom',
//   transform: {
//     '^.+\\.(ts|tsx)$': 'ts-jest',
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?!(lodash-es|@reduxjs/toolkit|@standard-schema)/)',
//   ],
//   moduleNameMapper: {
//     '\\.(scss|css)$': 'identity-obj-proxy',
//   },
// };