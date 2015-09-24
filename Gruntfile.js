module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.initConfig({
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'site/assets/style/style.css': 'site/assets/style/style.scss'
                }
            }
        },
        jsbeautifier: {
            default: {
                src: [
                    'Gruntfile.js',
                    'site/assets/scripts/*.js'
                ]
            },
            verify: {
                src: [
                    'Gruntfile.js',
                    'site/assets/scripts/*.js'
                ],
                options: {
                    mode: 'VERIFY_ONLY'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                'site/assets/scripts/*.js'
            ]
        }
    });

    grunt.registerTask('default', ['sass', 'jsbeautifier', 'jshint']);
};
