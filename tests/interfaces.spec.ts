import type { PromptAnswers } from '@idleberg/yeoman-generator';
import { beforeAll, describe, test } from 'vitest';
import assert from 'yeoman-assert';
import { helper } from './helper.ts';

const interfaces = [
	{ name: 'Linter', value: 'Linter' },
	{ name: 'ComposerLinter', value: 'ComposerLinter' },
	{ name: 'NodeLinter', value: 'NodeLinter' },
	{ name: 'PythonLinter', value: 'PythonLinter' },
	{ name: 'RubyLinter', value: 'RubyLinter' },
];

interfaces.forEach((interfaceType) => {
	describe(`with ${interfaceType.name} interface`, () => {
		beforeAll(async () => {
			await helper({
				name: 'test-linter',
				version: '0.1.0',
				interface: interfaceType.value,
				selector: 'source.test',
				errorStream: 'STREAM_BOTH',
				multiline: false,
				author: 'testuser',
				spdxLicense: 'MIT',
				tests: [],
				initGit: false,
			} as PromptAnswers);
		});

		test('uses correct interface class', () => {
			assert.fileContent('linter.py', `from SublimeLinter.lint import ${interfaceType.value}`);
		});

		test('defines class with correct interface', () => {
			assert.fileContent('linter.py', `class TestLinter(${interfaceType.value}):`);
		});

		test('creates README.md', () => {
			assert.file('README.md');
		});

		test('creates linter.py', () => {
			assert.file('linter.py');
		});

		test('creates .editorconfig', () => {
			assert.file('.editorconfig');
		});
	});
});
