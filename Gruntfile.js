module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-traceur');

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
        },
        traceur: {
            options: {
                experimental: true,
            },
            custom: {
                files: [{
                    expand: true,
                    cwd: 'site/assets/scripts',
                    src: ['*.js.es6'],
                    dest: 'site/assets/scripts',
                    ext: '.js'
                }]
            }
        }
    });

    grunt.registerTask('default', ['sass', 'jsbeautifier', 'jshint']);
};
