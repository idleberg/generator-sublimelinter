import spdxLicenseList from 'spdx-license-list/full.js';
import { beforeAll, describe, test } from 'vitest';
import assert from 'yeoman-assert';
import type { PromptAnswers } from 'yeoman-generator';
import { helper } from './__helper.ts';

// Test a representative subset of licenses
const licensesToTest = ['MIT', 'Apache-2.0', 'GPL-3.0-or-later', 'BSD-3-Clause', 'ISC'];

licensesToTest.forEach((licenseName) => {
	describe(`with ${licenseName} license`, () => {
		beforeAll(async () => {
			await helper({
				name: 'test-linter',
				version: '0.1.0',
				interface: 'Linter',
				selector: 'source.test',
				errorStream: 'STREAM_BOTH',
				multiline: false,
				author: 'testuser',
				spdxLicense: licenseName,
				tests: [],
				initGit: false,
			} as PromptAnswers);
		});

		test('creates LICENSE file', () => {
			assert.file('LICENSE');
		});

		test(`contains ${licenseName} license text`, () => {
			const licenseText = spdxLicenseList[licenseName].licenseText.replace(/\n{3,}/g, '\n\n');
			assert.fileContent('LICENSE', licenseText);
		});

		test('mentions license in README', () => {
			assert.fileContent('README.md', licenseName);
		});
	});
});
