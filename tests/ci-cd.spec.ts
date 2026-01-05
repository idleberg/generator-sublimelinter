import { suite } from 'uvu';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './__helper.ts';

const CircleCITest = suite('with CircleCI');

CircleCITest.before(async () => {
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

CircleCITest('creates CircleCI config', () => {
	assert.file('.circleci/config.yml');
});

CircleCITest('includes flake8 in config', () => {
	assert.fileContent('.circleci/config.yml', 'flake8');
});

CircleCITest('includes pep257 in config', () => {
	assert.fileContent('.circleci/config.yml', 'pep257');
});

CircleCITest('includes CircleCI badge in README', () => {
	assert.fileContent('README.md', 'circleci.com');
});

CircleCITest.run();

const GitHubWorkflowTest = suite('with GitHub Workflow');

GitHubWorkflowTest.before(async () => {
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

GitHubWorkflowTest('creates GitHub workflow config', () => {
	assert.file('.github/workflows/config.yml');
});

GitHubWorkflowTest('includes flake8 in workflow', () => {
	assert.fileContent('.github/workflows/config.yml', 'flake8');
});

GitHubWorkflowTest('includes pep257 in workflow', () => {
	assert.fileContent('.github/workflows/config.yml', 'pep257');
});

GitHubWorkflowTest('includes GitHub Actions badge in README', () => {
	assert.fileContent('README.md', 'github.com');
});

GitHubWorkflowTest.run();

const BothCITest = suite('with both CircleCI and GitHub Workflow');

BothCITest.before(async () => {
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

BothCITest('creates both CI configs', () => {
	assert.file(['.circleci/config.yml', '.github/workflows/config.yml']);
});

BothCITest('includes both badges in README', () => {
	assert.fileContent('README.md', 'circleci.com');
	assert.fileContent('README.md', 'github.com');
});

BothCITest.run();

const NoCITest = suite('without CI/CD');

NoCITest.before(async () => {
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

NoCITest('does not create CI configs', () => {
	assert.noFile(['.circleci/config.yml', '.github/workflows/config.yml']);
});

NoCITest.run();
