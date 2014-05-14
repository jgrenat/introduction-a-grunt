module.exports = function (grunt) {
    // Charge les plugins Grunt automatiquement
    require('load-grunt-tasks')(grunt);

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
    
    grunt.registerTask('build', [
	'clean:dist',
	'copy:dist',
	'useminPrepare',
	'cssmin', 
	'uglify',
	'usemin'
    ]);
    
    grunt.registerTask('default', ['build']);
}; 
