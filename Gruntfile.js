module.exports = function(grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-traceur');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

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
                'Gruntfile.js'
            ],
            es6: {
                options: {
                    jshintrc: '.jshintrc.es6'
                },
                files: {
                    src: [
                        'site/assets/scripts/*.js.es6'
                    ]
                }
            }
        },
        traceur: {
            options: {
                experimental: true,
                modules: 'inline'
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
        },
        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: ['site/assets/scripts/app.js', 'site/assets/scripts/*.js'],
                dest: 'site/assets/scripts/build.js'
            }
        },
        clean: {
            js: ['site/assets/scripts/*.js']
        }
    });

    grunt.registerTask('default', ['clean', 'sass', 'jsbeautifier', 'jshint', 'traceur', 'concat']);
};
