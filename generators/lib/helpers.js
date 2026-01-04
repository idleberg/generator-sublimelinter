// @ts-check
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
	if (name.startsWith('SublimeLinter-')) true;
	if (name.startsWith('SublimeLinter-contrib-')) true;
	if (name.startsWith('sublime-linter-')) true;
	if (name.startsWith('sublime-linter-contrib-')) true;

	return false;
}
