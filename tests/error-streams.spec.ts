import { beforeAll, describe, test } from 'vitest';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './__helper.ts';

const errorStreams = ['STREAM_BOTH', 'STREAM_STDERR', 'STREAM_STDOUT'];

errorStreams.forEach((errorStream) => {
	describe(`with ${errorStream} error stream`, () => {
		beforeAll(async () => {
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

		test(`sets error_stream to ${errorStream}`, () => {
			assert.fileContent('linter.py', `error_stream = util.${errorStream}`);
		});
	});
});
