import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { GeneratorCompat as Generator } from '@idleberg/yeoman-generator';
import slugify from '@sindresorhus/slugify';
import { pascalCase } from 'change-case';
import semver from 'semver';
import spdxLicenseList from 'spdx-license-list/full.js';
import terminalLink from 'terminal-link';
import { fileExists, getDefaultSelector, licenseChoices, validateName } from '../../lib/helpers.js';

export default class extends Generator {
	constructor(args, options) {
		super(args, options);

		this.option('loose-version', { description: `Doesn't enforce semantic versioning`, default: false });
		this.option('debug', { description: 'Prints debug messages', default: false });

		this.looseVersion = this.options.looseVersion;
		this.debug = this.options.debug;
		this.outdir = this.options.debug ? '.debug' : '';
	}

	async prompting() {
		this.clack.intro(this.appname);

		const answers = await this.prompt([
			{
				name: 'name',
				message: `What's name of the linter executable?`,
				default: slugify(this.appname),
				store: true,
				validate: (str) =>
					validateName(str) === false ? `Specify the linter's name without SublimeLinter prefixes` : true,
			},
			{
				name: 'version',
				message: `What's the plugin's initial version?`,
				default: '0.1.0',
				store: true,
				validate: (version) =>
					this.looseVersion === true || semver.valid(version) !== null
						? true
						: `Not a valid ${terminalLink('semantic version', 'https://semver.org', {
								fallback() {
									return 'semantic version';
								},
							})}`,
			},
			{
				name: 'interface',
				message: 'Specify a linter interface:',
				type: 'list',
				default: '(default)',
				store: true,
				choices: [
					{
						name: '(default)',
						value: 'Linter',
					},
					{
						name: 'Composer',
						value: 'ComposerLinter',
					},
					{
						name: 'Node',
						value: 'NodeLinter',
					},
					{
						name: terminalLink('Python', 'http://www.sublimelinter.com/en/stable/python_linter.html', {
							fallback() {
								return 'Python';
							},
						}),
						value: 'PythonLinter',
					},
					{
						name: terminalLink('Ruby', 'http://www.sublimelinter.com/en/stable/ruby_linter.html', {
							fallback() {
								return 'Ruby';
							},
						}),
						value: 'RubyLinter',
					},
				],
			},
			{
				name: 'selector',
				message: `Specify a ${terminalLink(
					'selector',
					'http://www.sublimelinter.com/en/stable/linter_settings.html#selector',
					{
						fallback() {
							return 'selector';
						},
					},
				)} for files that should be linted:`,
				default: (answers) => getDefaultSelector(answers.interface),
				store: true,
				validate: (answer) => (answer?.length > 0 ? true : 'You have to provide a valid selector'),
			},
			{
				name: 'errorStream',
				message: `Specify the output captured for the ${terminalLink(
					'error stream',
					'http://www.sublimelinter.com/en/stable/linter_attributes.html#error-stream',
					{
						fallback() {
							return 'error stream';
						},
					},
				)}:`,
				type: 'list',
				default: 'STREAM_BOTH',
				choices: [
					{
						name: 'both',
						value: 'STREAM_BOTH',
					},
					{
						name: 'stderr',
						value: 'STREAM_STDERR',
					},
					{
						name: 'stdout',
						value: 'STREAM_STDOUT',
					},
				],
				store: true,
			},
			{
				name: 'multiline',
				message: `Does the RegEx pattern capture ${terminalLink(
					'multiline',
					'http://www.sublimelinter.com/en/stable/linter_attributes.html#multiline',
					{
						fallback() {
							return 'multiline';
						},
					},
				)}?`,
				type: 'confirm',
				default: false,
				store: true,
			},
			{
				name: 'author',
				message: `What's your GitHub username?`,
				store: true,
				validate: (answer) => (answer?.length > 0 ? true : 'You have to provide a username'),
			},
			{
				name: 'spdxLicense',
				message: 'Choose a license for your linter:',
				type: 'list',
				default: 'MIT',
				choices: licenseChoices,
				store: true,
			},
			{
				type: 'checkbox',
				name: 'tests',
				message: 'Add CI/CD pipeline configurations?',
				store: true,
				choices: [
					{
						name: terminalLink('Circle CI', 'https://circleci.com/', {
							fallback() {
								return 'Circle CI';
							},
						}),
						value: 'circleCI',
						checked: false,
					},
					{
						name: terminalLink('GitHub Workflow', 'https://docs.github.com/en/actions/using-workflows', {
							fallback() {
								return 'GitHub Workflow';
							},
						}),
						value: 'githubWorkflow',
						checked: false,
					},
				],
			},
			{
				name: 'flakeArgs',
				message: `Specify arguments for ${terminalLink('flake8', 'http://flake8.pycqa.org/', {
					fallback() {
						return 'flake8';
					},
				})}:`,
				default: '--extend-ignore=D211',
				store: true,
				when: (answers) => answers.tests.length > 0,
			},
			{
				name: 'pepArgs',
				message: `Specify arguments for ${terminalLink('pep257', 'https://pep257.readthedocs.io/', {
					fallback() {
						return 'pep257';
					},
				})}:`,
				default: '--ignore=D211',
				store: true,
				when: (answers) => answers.tests.length > 0,
			},
			{
				name: 'initGit',
				message: 'Initialize a Git repository?',
				type: 'confirm',
				default: !(await fileExists(resolve(process.cwd(), '.git', 'config'))),
			},
		]);

		this.answers = answers;
	}

	async writing() {
		if (this.options.debug) {
			console.log(this.answers);
		}

		this.answers.slug = slugify(this.answers.name);
		this.answers.repositoryName = `SublimeLinter-contrib-${this.answers.slug}`;
		this.answers.className = pascalCase(this.answers.name);
		this.answers.multiline = this.answers.multiline === true ? 'True' : 'False';

		if (typeof this.answers.spdxLicense !== 'undefined') {
			this.answers.licenseName = spdxLicenseList[this.answers.spdxLicense].name;
			this.answers.licenseText = spdxLicenseList[this.answers.spdxLicense].licenseText.replace(/\n{3,}/g, '\n\n');
		}

		if (typeof this.answers.spdxLicense !== 'undefined') {
			this.fs.copyTpl(this.templatePath('LICENSE.eta'), this.destinationPath(this.outdir, 'LICENSE'), {
				licenseText: this.answers.licenseText,
			});
		}

		if (this.answers.tests.includes('circleCI')) {
			await mkdir('.circleci', {
				recursive: true,
			});

			this.fs.copyTpl(
				this.templatePath('config-circleci.eta'),
				this.destinationPath(this.outdir, '.circleci/config.yml'),
				{
					flakeArgs: this.answers.flakeArgs.trim(),
					pepArgs: this.answers.pepArgs.trim(),
				},
			);
		}

		if (this.answers.tests.includes('githubWorkflow')) {
			await mkdir('.github/workflows', {
				recursive: true,
			});

			this.fs.copyTpl(
				this.templatePath('config-github.eta'),
				this.destinationPath(this.outdir, '.github/workflows/config.yml'),
				{
					flakeArgs: this.answers.flakeArgs.trim(),
					pepArgs: this.answers.pepArgs.trim(),
				},
			);
		}

		this.fs.copy(this.templatePath('_editorconfig'), this.destinationPath(this.outdir, '.editorconfig'));

		this.fs.copyTpl(this.templatePath('linter.py.eta'), this.destinationPath(this.outdir, 'linter.py'), {
			...this.answers,
		});

		this.fs.copyTpl(this.templatePath('README.md.eta'), this.destinationPath(this.outdir, 'README.md'), {
			...this.answers,
		});

		// Initialize git repository
		if (this.answers.initGit) {
			this.spawnSync('git', ['init']);
		}
	}
}
