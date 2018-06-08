/**
 * configuration for grunt tasks
 * @module Gruntfile
 */

import 'babel-polyfill';

const ctrllrConfig = require('./test/ctrllr.config');
const loadGruntTasks = require('load-grunt-tasks');

module.exports = grunt => {
  /** load tasks */
  loadGruntTasks(grunt);

  /** paths to file on server */
  const files = {
    meta: [
      'README.md',
      '**/README.md',
      'Procfile',
      'TODO.md',
      'package.json',
      '.gitignore',
      '*.sublime-project',
      '*.sublime-workspace',
      '*.iml',
      '.idea',
      'dump.rdb'
    ],

    server: [
      '*.*',
      'bin/*.*',
      'config/**/*.*',
      'core/*.*',
      'core/**/*.*',
      'cron/*.*',
      'cron/**/*.*',
      'middleware/*.*',
      'middleware/**/*.*',
      'models/*.*',
      'models/**/*.*',
      'routes/*.*',
      'routes/**/*.*',
      'services/*.*',
      'services/**/*.*'
    ],

    all: []
  };

  files.meta.forEach(file => {
    files.all.push(file);
  });

  files.server.forEach(file => {
    files.all.push(file);
  });

  files.meta.forEach(file => {
    files.server.push(`! ${file}`);
  });

  const tasks = {
    // pkg: grunt.file.readJSON('package.json'),

    /** build TODO.md from inline comments */
    todos: {
      src: {
        /** options for plugin */
        options: {
          priorities: {
            low: /TODO/,
            med: /FIXME/,
            high: null
          },
          reporter: {
            /** put at the top of the generated file */
            header() {
              return '-- BEGIN TASK LIST --\n\n';
            },
            // flow for each file
            fileTasks(file, tasks2) {
              /** skip if no tasks or checking Gruntfile */
              if (!tasks2.length || (file && file === 'Gruntfile.js')) {
                return '';
              }

              let result = `* ${file} (${tasks2.length})\n\n`;

              /** iterate over tasks, add data */
              tasks2.forEach(task => {
                result += `    [${task.lineNumber} - ${task.priority}]`;
                result += ` ${task.line.trim()}\n`;

                result += '\n';
              });

              return result;
            },
            /** put at the bottom of the generated file */
            footer() {
              return '-- END TASK LIST --\n';
            }
          }
        },
        files: {
          'TODO.md': files.server
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: false, // true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: false, // true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false, // true,
        // pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },

    release: {
      options: {
        bump: false, // default: true
        changelog: false, // default: false
        changelogText: '<%= version %>\n', // default: '### <%= version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
        file: 'package.json', // default: package.json
        add: true, // default: true
        commit: true, // default: true
        tag: true, // default: true
        push: false, // default: true
        // pushTags: true, //default: true
        npm: false, // default: true
        npmtag: false, // default: no tag
        indentation: '', // default: '  ' (two spaces)
        // folder: 'folder/to/publish/to/npm', //default project root
        tagName: '<%= version %>', // default: '<%= version %>'
        commitMessage: 'release - v<%= version %>', // default: 'release <%= version %>'
        tagMessage: 'release - v<%= version %>', // default: 'Version <%= version %>',
        beforeBump: [], // optional grunt tasks to run before file versions are bumped
        afterBump: [], // optional grunt tasks to run after file versions are bumped
        beforeRelease: ['shell:gitAddAll'], // optional grunt tasks to run after release version is bumped up but before release is packaged
        afterRelease: [], // optional grunt tasks to run after release is packaged
        updateVars: [] // optional grunt config objects to update (this will update/set the version property on the object specified)
      }
    },

    /** shell commands */
    shell: {
      server: {
        command: 'node app --port=4000'
      },
      worker: {
        command: 'node worker'
      },
      testSetup: {
        command: 'node tests/testSetup --environment=test'
      },
      testCleanup: {
        command: 'node tests/testCleanup --environment=test'
      },
      documentAPI: {
        command: 'node core/scripts/documentAPI'
      },
      documentModels: {
        command: 'node core/scripts/documentModels'
      },
      gitAddAll: {
        command: 'git add -A'
      },
      pushProduction: {
        command: 'git push origin master && git push heroku master'
      },
      pushStaging: {
        command: 'git push origin staging && git push staging staging:master'
      }
    },

    /** testing framework */
    jasmine_node: {
      options: {
        forceExit: false,
        match: '',
        matchall: false,
        extensions: 'spec.js',
        specNameMatcher: ''
        // jUnit: {
        //      report: true,
        //      savePath: './reports/',
        //      useDotNotation: true,
        //      consolidate: true
        // }
      },
      all: ['app/tests'],
      models: ['app/tests/models'],
      api: ['app/tests/controllers'],
      singleFile: ['app/tests']
      // 'app/tests/controllers/user.find.spec.js'
    },

    /** ctrllr API tests */
    ctrllr: {
      api: {
        options: ctrllrConfig,
        src: ['test/api/**/*.spec.js', '!test/api/**/~*.spec.js']
      },
      models: {
        options: ctrllrConfig,
        src: ['test/models/**/*.spec.js', '!test/models/**/~*.spec.js']
      },
      services: {
        options: ctrllrConfig,
        src: ['test/services/**/*.spec.js', '!test/services/**/~*.spec.js']
      },
      tasks: {
        options: ctrllrConfig,
        src: ['test/tasks/**/*.spec.js', '!test/tasks/**/~*.spec.js']
      }
    },

    /** build documentation */
    jsdoc: {
      dist: {
        src: files.server,
        options: {
          destination: 'docs'
        }
      }
    }
  };

  // merge files and task config, initialize grunt config
  grunt.initConfig(grunt.util._.extend(tasks, files));

  // default grunt task, ran with `grunt`
  grunt.registerTask('default', () => {
    throw Error('No default task set.');
  });

  // build server files
  grunt.registerTask('build', ['todos']);

  // runs all tests
  grunt.registerTask('testAll', [
    'shell:testCleanup',
    // 'shell:testSetup',
    'jasmine_node:all',
    'shell:testCleanup'
  ]);

  // setup server for tests
  grunt.registerTask('testServerStart', [
    // 'concurrent:testServer'
    'nodemon:test'
  ]);

  // run api tests
  grunt.registerTask('testApi', [
    'shell:testCleanup',
    // 'shell:testSetup',
    'jasmine_node:api',
    'shell:testCleanup'
  ]);

  // run model tests
  grunt.registerTask('testModels', [
    'shell:testCleanup',
    // 'shell:testSetup',
    'jasmine_node:models',
    'shell:testCleanup'
  ]);

  // test a single file
  grunt.registerTask('testFile', [
    'shell:testCleanup',
    // 'shell:testSetup',
    'jasmine_node:singleFile',
    'shell:testCleanup'
  ]);

  // documents the server, bumps the version, tags it
  grunt.registerTask('prepareDeploy', [
    'doc',
    'shell:gitAddAll',
    'bump',
    'release'
  ]);

  // pushes code to remote repo & live server
  grunt.registerTask(
    'deploy',
    'This task pushes the code to the remote repos.',
    () => {
      const args = Array.prototype.slice.call(arguments);
      const env = args[0];

      if (
        args.length > 1 ||
        (args.length === 1 && ['staging', 'production'].indexOf(env) === -1)
      ) {
        throw new Error('Can only deploy `staging` or `production`');
      }

      if (!args.length) {
        // deploy to staging and production
        console.log('deploying to staging and production');
        grunt.task.run('shell:pushProduction');
        grunt.task.run('shell:pushStaging');
      } else if (args[0] === 'staging') {
        console.log('deploying to staging');
        grunt.task.run('shell:pushStaging');
      } else if (args[0] === 'production') {
        console.log('deploying to production');
        grunt.task.run('shell:pushProduction');
      }
    }
  );

  /** parses command, runs unit tests */
  grunt.registerTask('test', 'This task uses CTRLLR to run tests.', () => {
    const { argv } = require('optimist');
    const split = argv._[0].split(':');
    split.shift();

    const testType = split[0];
    const filter = split[1];

    if (!split.length) {
      // grunt test
      throw new Error(
        'Grunt alias `test` not implemented. Please specify what to test, i.e. `test:api`.'
      );
    } else if (
      ['api', 'models', 'services', 'tasks'].indexOf(testType) === -1
    ) {
      throw new Error(`Test alias not implemented. You entered "${testType}"`);
    }

    if (filter) {
      grunt.config(
        `ctrllr.${testType}.options.filter`,
        test => test && test.tags && test.tags.indexOf(filter) > -1
      );
    }

    if (argv.proxy) {
      grunt.config(`ctrllr.${testType}.options.proxy`, argv.proxy);
    }

    grunt.task.run(`ctrllr:${testType}`);
  });

  // parses command, documents the server or just the models or api
  grunt.registerTask('doc', 'Documents the server', () => {
    const args = Array.prototype.slice.call(arguments);

    if (!args.length) {
      // document everything
      grunt.task.run('shell:documentAPI');
      grunt.task.run('shell:documentModels');
      return;
    }

    switch (args[0]) {
      case 'api':
        grunt.task.run('shell:documentAPI');
        break;
      case 'models':
        grunt.task.run('shell:documentModels');
        break;
      default:
        throw new Error(
          `grunt command not implemented. You entered "${args[0]}"`
        );
    }
  });
};
