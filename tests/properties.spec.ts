import { suite } from 'uvu';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './__helper.ts';

const MultilineTrueTest = suite('multiline property > when multiline is true');

MultilineTrueTest.before(async () => {
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

MultilineTrueTest('sets multiline to True in Python', () => {
	assert.fileContent('linter.py', 'multiline = True');
});

MultilineTrueTest.run();

const MultilineFalseTest = suite('multiline property > when multiline is false');

MultilineFalseTest.before(async () => {
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

MultilineFalseTest('sets multiline to False in Python', () => {
	assert.fileContent('linter.py', 'multiline = False');
});

MultilineFalseTest.run();

const selectors = ['source.python', 'source.js', 'text.html.basic'];

selectors.forEach((selector) => {
	const SelectorTest = suite(`selector property > with selector ${selector}`);

	SelectorTest.before(async () => {
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

	SelectorTest(`sets selector to ${selector}`, () => {
		assert.fileContent('linter.py', `'selector': '${selector}'`);
	});

	SelectorTest.run();
});

const names = [
	{ input: 'my-linter', slug: 'my-linter', className: 'MyLinter' },
	{ input: 'awesome_tool', slug: 'awesome-tool', className: 'AwesomeTool' },
	{ input: 'PyFlakes', slug: 'py-flakes', className: 'PyFlakes' },
];

names.forEach(({ input, slug, className }) => {
	const NameTest = suite(`name property > with name ${input}`);

	NameTest.before(async () => {
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

	NameTest(`uses class name ${className}`, () => {
		assert.fileContent('linter.py', `class ${className}(`);
	});

	NameTest('mentions repository name in README', () => {
		assert.fileContent('README.md', `SublimeLinter-contrib-${slug}`);
	});

	NameTest.run();
});
