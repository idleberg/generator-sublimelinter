import { beforeAll, describe, test } from 'vitest';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './helper.ts';

describe('multiline property', () => {
	describe('when multiline is true', () => {
		beforeAll(async () => {
			await helper({
				name: 'test-linter',
				version: '0.1.0',
				interface: 'Linter',
				selector: 'source.test',
				errorStream: 'STREAM_BOTH',
				multiline: true,
				author: 'testuser',
				spdxLicense: 'MIT',
				tests: [],
				initGit: false,
			} as PromptAnswers);
		});

		test('sets multiline to True in Python', () => {
			assert.fileContent('linter.py', 'multiline = True');
		});
	});

	describe('when multiline is false', () => {
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

		test('sets multiline to False in Python', () => {
			assert.fileContent('linter.py', 'multiline = False');
		});
	});
});

describe('selector property', () => {
	const selectors = ['source.python', 'source.js', 'text.html.basic'];

	selectors.forEach((selector) => {
		describe(`with selector ${selector}`, () => {
			beforeAll(async () => {
				await helper({
					name: 'test-linter',
					version: '0.1.0',
					interface: 'Linter',
					selector,
					errorStream: 'STREAM_BOTH',
					multiline: false,
					author: 'testuser',
					spdxLicense: 'MIT',
					tests: [],
					initGit: false,
				} as PromptAnswers);
			});

			test(`sets selector to ${selector}`, () => {
				assert.fileContent('linter.py', `'selector': '${selector}'`);
			});
		});
	});
});

describe('name property', () => {
	const names = [
		{ input: 'my-linter', slug: 'my-linter', className: 'MyLinter' },
		{ input: 'awesome_tool', slug: 'awesome-tool', className: 'AwesomeTool' },
		{ input: 'PyFlakes', slug: 'py-flakes', className: 'PyFlakes' },
	];

	names.forEach(({ input, slug, className }) => {
		describe(`with name ${input}`, () => {
			beforeAll(async () => {
				await helper({
					name: input,
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

			test(`uses class name ${className}`, () => {
				assert.fileContent('linter.py', `class ${className}(`);
			});

			test('mentions repository name in README', () => {
				assert.fileContent('README.md', `SublimeLinter-contrib-${slug}`);
			});
		});
	});
});
