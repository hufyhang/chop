module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch:  {
      options: { nospawn: true },
      modules: {
        files: ['modules/**/*.js'],
        tasks: ['newer:uglify:modules']
      },

      chopjs: {
        files: ['chop.js'],
        tasks: ['uglify:chopjs']
      },

      css: {
        files: ['css/*.css'],
        tasks: ['copy:css', 'cssmin:css_dist']
      },

      scss: {
        files: ['css/*.scss'],
        tasks: ['sass:dist', 'cssmin:css_dist']
      }
    },

    uglify: {
      chopjs: {
        files: { 'dist/chop.min.js': ['chop.js', 'sizzle.js'] },
        options: {
          sourceMap: true
        }
      },

      modules: {
        files: grunt.file.expandMapping(['modules/**/*.js'], 'dist/', {
          rename: function(destBase, destPath) {
            return destBase+destPath.replace('.js', '.min.js');
          }
        })
      },

      module_rdfa: {
        files: {
          'dist/modules/rdfa/rdfa.min.js': ['modules/rdfa/rdfa.js', 'modules/rdfa/rdfa_processor.min.js']
        }
      },

      module_directive: {
        files: {
          'dist/modules/directive/directive.min.js': ['modules/directive/directive.js', 'modules/directive/shim.js']
        }
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          src: ['css/*.scss'],
          dest: 'dist/',
          ext: '.css'
        }]
      }
    },

    // copy css to dist folder
    copy: {
      css: {
        files: [{
          expand: true,
          src: ['css/*.css'],
          dest: 'dist/'
        }]
      }
    },

    // minify dist css
    cssmin: {
      css_dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css'],
        dest: 'dist/css/'
      }
    },

    docco: {
      docs: {
        src: ['chop.js', 'modules/**/*.js'],
        options: {
          output: 'docs/'
        }
      }
    },

    notify_hooks: {
      options: {
        enabled: true,
        title: 'ChopJS Build'
      }
    },

    notify: {
      build_done: {
        options: {
          title: 'ChopJS Build',
          message: '<%= pkg.name %> build finished successfully.'
        },
      }
    }

  });

  grunt.task.run('notify_hooks');
  grunt.registerTask('serve', ['watch']);
  grunt.registerTask('build', ['uglify', 'sass', 'copy', 'cssmin', 'notify:build_done']);
  grunt.registerTask('docs', ['docco']);

};
