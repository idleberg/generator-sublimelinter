// @ts-check
import { access, constants } from 'node:fs/promises';
import spdxLicenseList from 'spdx-license-list/full.js';
import terminalLink from 'terminal-link';

const spdxCodes = Object.getOwnPropertyNames(spdxLicenseList).sort();

export const licenseChoices = spdxCodes.map((obj) => {
	const licenses = {};
	licenses.name = terminalLink(obj, `https://spdx.org/licenses/${obj}.html`, {
		fallback: true,
	});
	licenses.value = obj;

	return licenses;
});

/**
 *
 * @param {'ComposerLinter' | 'NodeLinter' | 'PythonLinter' | 'RubyLinter'} linterInterface
 * @returns {'source.php' | 'source.js' | 'source.py' | 'source.rb' | 'source.example'}
 */
export function getDefaultSelector(linterInterface) {
	if (linterInterface === 'ComposerLinter') {
		return 'source.php';
	}
	if (linterInterface === 'NodeLinter') {
		return 'source.js';
	}
	if (linterInterface === 'PythonLinter') {
		return 'source.py';
	}
	if (linterInterface === 'RubyLinter') {
		return 'source.rb';
	}

	return 'source.example';
}

/**
 *
 * @param {string} name
 * @returns {boolean}
 */
export function validateName(name) {
	if (name.startsWith('SublimeLinter-')) false;
	if (name.startsWith('SublimeLinter-contrib-')) false;
	if (name.startsWith('sublime-linter-')) false;
	if (name.startsWith('sublime-linter-contrib-')) false;

	return true;
}

/**
 *
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
export async function fileExists(filePath) {
	try {
		await access(filePath, constants.F_OK);
	} catch {
		return false;
	}

	return true;
}
