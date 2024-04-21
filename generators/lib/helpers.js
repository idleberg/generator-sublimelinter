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

export function validateName(name) {
	switch (true) {
		case name.startsWith('SublimeLinter-'):
		case name.startsWith('SublimeLinter-contrib-'):
		case name.startsWith('sublime-linter-'):
		case name.startsWith('sublime-linter-contrib-'):
			return false;

		default:
			return true;
	}
}
