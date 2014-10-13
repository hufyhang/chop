module.exports = function (grunt) {
  'use strict';

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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-newer');
  grunt.registerTask('serve', ['watch']);
  grunt.registerTask('build', ['uglify', 'sass', 'copy', 'cssmin']);

};