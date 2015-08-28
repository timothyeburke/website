module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

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
        }
    });

    grunt.registerTask('default', ['sass']);
};
