module.exports = function (grunt) {
    // Charge les plugins Grunt automatiquement
    require('load-grunt-tasks')(grunt);
    // Charge les tâches personnalisées
    grunt.loadTasks('tasks');

    grunt.initConfig({
        clean: {
            dist: ['dist/*']
        },

        copy: {
            dist: {
                src: ['*.html', 'images/**/*'],
                dest: 'dist/'
            }
        },

        useminPrepare: {
            html: {
                src: ['index.html']
            },
            options: {
                flow: {
                    steps: {
                        js: ['uglifyjs'],
                        css: ['cssmin'],
                    },
                    post: {}
                }
            }
        },
	
        usemin: {
            html: 'dist/index.html'
        }
    });
    
    grunt.registerTask('default', ['build']);
}; 
