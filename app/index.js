const yeoman = require('yeoman-generator');
const fmtUrl = require('normalize-url');
const chalk = require('chalk');
const say = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: () => {
    this.pkg = require('../package.json');
  },

  prompting: () => {
    const done = this.async();

    // Have Yeoman greet the user.
    this.log(say(
      'Welcome to the peachy ' + chalk.red('Fly WebApp') + ' generator!'
    ));

    const prompts = [{
      name: 'username',
      message: 'What is your GitHub username?',
      store: true,
      validate: val => val.length > 0 ? true : 'github needed'
    }, {
      name: 'website',
      message: 'What is your website?',
      store: true,
      default: props => `http://github.com/${props.username}`
    }, {
      name: 'projectName',
      message: 'What is your project\'s name?',
      default: require('path').basename(process.cwd())
    }, {
      name: 'description',
      message: 'Please describe your project.',
      default: props => `${props.projectName} was initialized with 'generator-fly-webapp'!`
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

    this.prompt(prompts, (props) => {
      this.props = props;
      done();
    });
  },

  writing: () => {

  },

  install: () => {
    this.installDependencies({bower: false});
  }
});
