import { suite } from 'uvu';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './__helper.ts';

const interfaces = [
	{ name: 'Linter', value: 'Linter' },
	{ name: 'ComposerLinter', value: 'ComposerLinter' },
	{ name: 'NodeLinter', value: 'NodeLinter' },
	{ name: 'PythonLinter', value: 'PythonLinter' },
	{ name: 'RubyLinter', value: 'RubyLinter' },
];

interfaces.forEach((interfaceType) => {
	const InterfaceTest = suite(`with ${interfaceType.name} interface`);

	InterfaceTest.before(async () => {
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

	InterfaceTest('uses correct interface class', () => {
		assert.fileContent('linter.py', `from SublimeLinter.lint import ${interfaceType.value}`);
	});

	InterfaceTest('defines class with correct interface', () => {
		assert.fileContent('linter.py', `class TestLinter(${interfaceType.value}):`);
	});

	InterfaceTest('creates README.md', () => {
		assert.file('README.md');
	});

	InterfaceTest('creates linter.py', () => {
		assert.file('linter.py');
	});

	InterfaceTest('creates .editorconfig', () => {
		assert.file('.editorconfig');
	});

	InterfaceTest.run();
});
