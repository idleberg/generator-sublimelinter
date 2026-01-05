import { suite } from 'uvu';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './__helper.ts';

const errorStreams = ['STREAM_BOTH', 'STREAM_STDERR', 'STREAM_STDOUT'];

errorStreams.forEach((errorStream) => {
	const ErrorStreamTest = suite(`with ${errorStream} error stream`);

	ErrorStreamTest.before(async () => {
		await helper({
			name: 'test-linter',
			version: '0.1.0',
			interface: 'Linter',
			selector: 'source.test',
			errorStream,
			multiline: false,
			author: 'testuser',
			spdxLicense: 'MIT',
			tests: [],
			initGit: false,
		} as PromptAnswers);
	});

	ErrorStreamTest(`sets error_stream to ${errorStream}`, () => {
		assert.fileContent('linter.py', `error_stream = util.${errorStream}`);
	});

	ErrorStreamTest.run();
});
