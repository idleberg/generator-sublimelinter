import { beforeAll, describe, test } from 'vitest';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './helper.ts';

describe('with CircleCI', () => {
	beforeAll(async () => {
		await helper({
			name: 'test-linter',
			version: '0.1.0',
			interface: 'Linter',
			selector: 'source.test',
			errorStream: 'STREAM_BOTH',
			multiline: false,
			author: 'testuser',
			spdxLicense: 'MIT',
			tests: ['circleCI'],
			flakeArgs: '--ignore=D211',
			pepArgs: '--ignore=D211',
			initGit: false,
		} as PromptAnswers);
	});

	test('creates CircleCI config', () => {
		assert.file('.circleci/config.yml');
	});

	test('includes flake8 in config', () => {
		assert.fileContent('.circleci/config.yml', 'flake8');
	});

	test('includes pep257 in config', () => {
		assert.fileContent('.circleci/config.yml', 'pep257');
	});

	test('includes CircleCI badge in README', () => {
		assert.fileContent('README.md', 'circleci.com');
	});
});

describe('with GitHub Workflow', () => {
	beforeAll(async () => {
		await helper({
			name: 'test-linter',
			version: '0.1.0',
			interface: 'Linter',
			selector: 'source.test',
			errorStream: 'STREAM_BOTH',
			multiline: false,
			author: 'testuser',
			spdxLicense: 'MIT',
			tests: ['githubWorkflow'],
			flakeArgs: '--ignore=D211',
			pepArgs: '--ignore=D211',
			initGit: false,
		} as PromptAnswers);
	});

	test('creates GitHub workflow config', () => {
		assert.file('.github/workflows/config.yml');
	});

	test('includes flake8 in workflow', () => {
		assert.fileContent('.github/workflows/config.yml', 'flake8');
	});

	test('includes pep257 in workflow', () => {
		assert.fileContent('.github/workflows/config.yml', 'pep257');
	});

	test('includes GitHub Actions badge in README', () => {
		assert.fileContent('README.md', 'github.com');
	});
});

describe('with both CircleCI and GitHub Workflow', () => {
	beforeAll(async () => {
		await helper({
			name: 'test-linter',
			version: '0.1.0',
			interface: 'Linter',
			selector: 'source.test',
			errorStream: 'STREAM_BOTH',
			multiline: false,
			author: 'testuser',
			spdxLicense: 'MIT',
			tests: ['circleCI', 'githubWorkflow'],
			flakeArgs: '--ignore=D211',
			pepArgs: '--ignore=D211',
			initGit: false,
		} as PromptAnswers);
	});

	test('creates both CI configs', () => {
		assert.file(['.circleci/config.yml', '.github/workflows/config.yml']);
	});

	test('includes both badges in README', () => {
		assert.fileContent('README.md', 'circleci.com');
		assert.fileContent('README.md', 'github.com');
	});
});

describe('without CI/CD', () => {
	beforeAll(async () => {
		await helper({
			name: 'test-linter',
			version: '0.1.0',
			interface: 'Linter',
			selector: 'source.test',
			errorStream: 'STREAM_BOTH',
			multiline: false,
			author: 'testuser',
			spdxLicense: 'MIT',
			tests: [],
			initGit: false,
		} as PromptAnswers);
	});

	test('does not create CI configs', () => {
		assert.noFile(['.circleci/config.yml', '.github/workflows/config.yml']);
	});
});
