// jest.config.js
process.env.VITE_IS_E2E = 'true';

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  // 基本配置
  rootDir: process.cwd(),
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // 覆盖率配置
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'html'],
  collectCoverageFrom: [
    'packages/**/*.{ts,tsx}', // 覆盖所有子包中的源码
    '!packages/**/__tests__/**', // 排除测试目录
    '!packages/**/*.d.ts', // 排除类型定义
    '!packages/**/index.ts', // 排除入口文件
    '!**/node_modules/**',
  ],
  // 显示每个文件的详细覆盖率
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // 转换配置
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        diagnostics: false,
        isolatedModules: true,
      },
    ],
  },

  // 其他配置
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/cypress/'],
};
