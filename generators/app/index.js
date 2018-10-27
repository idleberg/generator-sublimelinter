const Generator = require('yeoman-generator');
const pkg = require('../../package.json');

const gitUserName = require('git-user-name');
const mkdirp = require('mkdirp');
const pascalCase = require('pascal-case');
const semver = require('semver');
const slugify = require('@sindresorhus/slugify');
const spdxLicenseList = require('spdx-license-list/full');
const terminalLink = require('terminal-link');
const updateNotifier = require('update-notifier');
const { join } = require('path');

// Is there a newer version of this generator?
updateNotifier({ pkg: pkg }).notify();

// Create array of license choices
const spdxCodes = Object.getOwnPropertyNames(spdxLicenseList).sort();
const licenseChoices = spdxCodes.map(obj => {
  const licenses = {};
  licenses['name'] = terminalLink(obj, `https://spdx.org/licenses/${obj}.html`, {
    fallback() {
      return obj;
    }
  });
  licenses['value'] = obj;

  return licenses;
});

const validateName = str => {
  if (str.startsWith('SublimeLinter-')) {
    return false;
  } else if (str.startsWith('SublimeLinter-contrib-')) {
    return false;
  } else if (str.startsWith('sublime-linter-')) {
    return false;
  } else if (str.startsWith('sublime-linter-contrib-')) {
    return false;
  }

  return true;
};

const defaultSelector = linterInterface => {
  if (linterInterface === 'ComposerLinter') {
    return 'source.php';
  } else if (linterInterface === 'NodeLinter') {
    return 'source.js';
  } else if (linterInterface === 'PythonLinter') {
    return 'source.py';
  } else if (linterInterface === 'RubyLinter') {
    return 'source.rb';
  }

  return 'source.example';
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('loose-version', { desc: `Doesn't enforce semantic versioning`, default: false });

    this.looseVersion = (this.options.looseVersion ? true : false);
  }

  inquirer() {
    return this.prompt([
      {
        name: 'name',
        message: `What's name of the linter executable?`,
        default: slugify(this.appname),
        store: true,
        validate: str => (validateName(str) === false) ? `Specify the linter's name without SublimeLinter prefixes` : true
      },
      {
        name: 'version',
        message: `What's the plugin's initial version?`,
        default: '0.0.0',
        store: true,
        validate: version => (this.looseVersion === true || semver.valid(version) !== null) ? true : `Not a valid ${terminalLink(
          'semantic version',
          'https://semver.org',
          {
            fallback() {
              return 'semantic version';
            }
          }
        )}`
      },
      {
        name: 'interface',
        message: 'Specify the linter interface',
        type: 'list',
        default: '(default)',
        store: true,
        choices: [
          {
            name: '(default)',
            value: 'Linter'
          },
          {
            name: 'Composer',
            value: 'ComposerLinter'
          },
          {
            name: 'Node',
            value: 'NodeLinter'
          },
          {
            name: terminalLink('Python', 'http://www.sublimelinter.com/en/stable/python_linter.html',
              {
                fallback() {
                  return 'Python';
                }
              }
            ),
            value: 'PythonLinter'
          },
          {
            name: terminalLink(
              'Ruby',
              'http://www.sublimelinter.com/en/stable/ruby_linter.html',
              {
                fallback() {
                  return 'Ruby';
                }
              }
            ),
            value: 'RubyLinter'
          }
        ]
      },
      {
        name: 'selector',
        message: `Specify the ${terminalLink('selector', 'http://www.sublimelinter.com/en/stable/linter_settings.html#selector',
              {
                fallback() {
                  return 'selector';
                }
              }
            )}`,
        default: answers => defaultSelector(answers.interface),
        store: true,
        validate: x => x.length > 0 ? true : 'You have to provide a valid selector'
      },
      {
        name: 'errorStream',
        message: `Specify the default ${terminalLink('error stream', 'http://www.sublimelinter.com/en/stable/linter_attributes.html#error-stream',
              {
                fallback() {
                  return 'error stream';
                }
              }
            )}`,
        type: 'list',
        default: 'STREAM_BOTH',
        choices: [
          {
            name: 'both',
            value: 'STREAM_BOTH'
          },
          {
            name: 'stderr',
            value: 'STREAM_STDERR'
          },
          {
            name: 'stdout',
            value: 'STREAM_STDOUT'
          }
        ],
        store: true
      },
      {
        name: 'multiline',
        message: `RegEx pattern is ${terminalLink('multiline', 'http://www.sublimelinter.com/en/stable/linter_attributes.html#multiline',
              {
                fallback() {
                  return 'multiline';
                }
              }
            )}`,
        type: 'confirm',
        default: false,
        store: true
      },
      {
        name: 'author',
        message: `What's your GitHub username?`,
        default: gitUserName(),
        store: true,
        validate: x => x.length > 0 ? true : 'You have to provide a username'
      },
      {
        name: 'spdxLicense',
        message: 'Choose a license',
        type: 'list',
        default: 'MIT',
        choices: licenseChoices,
        store: true,
      },
      {
        type: 'checkbox',
        name: 'tests',
        message: 'Add tests',
        store: true,
        choices: [
          {
            name: terminalLink(
              'Circle CI',
              'https://circleci.com/',
              {
                fallback() {
                  return 'Circle CI';
                }
              }
            ),
            value: 'circleCI',
            checked: false
          },
          {
            name: terminalLink(
              'Travis CI',
              'https://travis-ci.org/',
              {
                fallback() {
                  return 'Travis CI';
                }
              }
            ),
            value: 'travisCI',
            checked: false
          }
        ]
      },
      {
        name: 'flakeArgs',
        message: `Specify ${terminalLink(
          'flake8',
          'http://flake8.pycqa.org/',
          {
            fallback() {
              return 'flake8'
            }
          }
        )} arguments`,
        'default': '-ignore=D211',
        store: true,
        when: answers => (answers.tests.length > 0) ? true : false
      },
      {
        name: 'pepArgs',
        message: `Specify ${terminalLink(
          'pep257',
          'https://pep257.readthedocs.io/',
          {
            fallback() {
              return 'pep257'
            }
          }
        )} arguments`,
        'default': '--ignore=D211',
        store: true,
        when: answers => (answers.tests.length > 0) ? true : false
      },
      {
        name: 'initGit',
        message: 'Initialize Git repository?',
        type: 'confirm',
        default: this.fs.exists(join(process.cwd(), '.git', 'config')) ? false : true
      },
      {
        name: 'openInEditor',
        message: 'Open in default editor?',
        type: 'confirm',
        default: 'true',
        store: true,
        when: () => {
          return (process.env.EDITOR) ? true : false;
        }
      },
    ]).then(props => {
      props.slug = slugify(props.name);
      props.repositoryName = `SublimeLinter-contrib-${props.slug}`;
      props.className = pascalCase(props.name);
      props.multiline = (props.multiline === true) ? 'True' : 'False';

      if (typeof props.spdxLicense !== 'undefined') {
        props.licenseName = spdxLicenseList[props.spdxLicense].name;
        props.licenseText = spdxLicenseList[props.spdxLicense].licenseText.replace(/\n{3,}/g, '\n\n');
      }

      if (typeof props.spdxLicense !== 'undefined') {
        this.fs.copyTpl(
          this.templatePath('LICENSE.ejs'),
          this.destinationPath('LICENSE'),
          {
            licenseText: props.licenseText
          }
        );
      }

      if (props.tests.includes('circleCI')) {
        mkdirp('.circleci');
        this.fs.copyTpl(
          this.templatePath('config.yml.ejs'),
          this.destinationPath('.circleci/config.yml'),
          {
            flakeArgs: ` ${props.flakeArgs.trim()}`,
            pepArgs: ` ${props.pepArgs.trim()}`
          }
        );
      }

      if (props.tests.includes('travisCI')) {
        this.fs.copyTpl(
          this.templatePath('_travis.yml.ejs'),
          this.destinationPath('.travis.yml'),
          {
            flakeArgs: ` ${props.flakeArgs.trim()}`,
            pepArgs: ` ${props.pepArgs.trim()}`
          }
        );
      }

      this.fs.copy(
        this.templatePath('_editorconfig'),
        this.destinationPath('.editorconfig'),
      );

      this.fs.copyTpl(
        this.templatePath('linter.py.ejs'),
        this.destinationPath('linter.py'),
        {
          props: props
        }
      );

      this.fs.copyTpl(
        this.templatePath('README.md.ejs'),
        this.destinationPath('README.md'),
        {
          props: props
        }
      );

      // Initialize git repository
      if (props.initGit) {
        this.spawnCommandSync('git', ['init']);
      }

      // Open in Editor
      if (props.openInEditor === true) {
        this.spawnCommand(process.env.EDITOR, [ '.' ]);
      }
    });
  }
};
