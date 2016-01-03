const yeoman = require('yeoman-generator');
const fmtUrl = require('normalize-url');
const chalk = require('chalk');
const say = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function() {
    this.pkg = require('../package.json');
  },

  prompting: function() {
    const done = this.async();

    // Have Yeoman greet the user.
    this.log(say(
      'Welcome to the peachy ' + chalk.red('Fly Starter') + ' generator!'
    ));

    const prompts = [{
      name: 'username',
      message: 'What is your GitHub username?',
      store: true,
      validate: function(val) {
        return val.length > 0 ? true : 'github needed';
      }
    }, {
      name: 'website',
      message: 'What is your website?',
      store: true,
      default: function(props) {
        return 'http://github.com/' + props.username;
      }
    }, {
      name: 'projectName',
      message: 'What is your project\'s name?',
      default: require('path').basename(process.cwd())
    }, {
      name: 'description',
      message: 'Please describe your project.',
      default: function(props) {
        return props.projectName + ' was initialized with \'generator-fly-webapp\'!';
      }
    }, {
      type: 'confirm',
      name: 'installXO',
      message: 'Do you want to use XO\'s ESLint settings?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'installAva',
      message: 'Do you want to install a test suite?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'travis',
      message: 'Do you want to add Travis CI?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'changelog',
      message: 'Do you need a CHANGELOG file?',
      store: true,
      default: true
    }, {
      type: 'confirm',
      name: 'gitinit',
      message: 'Initialize a Git repository?',
      store: true,
      default: true
    }];

    this.prompt(prompts, function(props) {
      this.props = props;
      done();
    }.bind(this));
  },

  writing: function() {
    this.includeXO = this.props.installXO;
    this.includeAva = this.props.installAva;

    this.website = fmtUrl(this.props.website);
    this.email = this.user.git.email();
    this.name = this.user.git.name();

    this.template('LICENSE');
    this.template('README.md');
    this.template('editorconfig', '.editorconfig');
    this.template('_package.json', 'package.json');
    this.directory('src');
    this.template('flyfile', 'flyfile.js');

    const lint = this.props.installXO ? 'eslint_xo' : 'eslint_default';
    this.template(lint, '.eslintrc');

    if (this.props.gitinit) {
      this.template('gitignore', '.gitignore');
    }

    if (this.includeAva) {
      this.directory('test');
    }

    if (this.props.travis) {
      this.template('_travis.yml', '.travis.yml');
    }

    if (this.props.changelog) {
      this.template('CHANGELOG.md');
    }
  },

  install: function() {
    this.installDependencies({bower: false});
  },

  end: function() {
    if (this.props.gitinit) {
      const self = this
      console.log('\n')
      this.spawnCommand('git', ['init']).on('close', function() {
        self.spawnCommand('git', ['add', '--all']).on('close', function() {
          self.spawnCommand('git', ['commit', '-m', 'first commit, via generator-fly-webapp 🚀']).on('close', function() {
            console.log('\n')
          })
        })
      })
    }
  }
});
