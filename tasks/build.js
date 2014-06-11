module.exports = function(grunt) {
    grunt.registerTask('build', function(target) {
	    // La target au sens Grunt
        target = target || '';

        // L'environnement
        if(!grunt.option('target')) {
            grunt.option('target', 'prod');
        }

	    grunt.task.run([
            'clean:dist',
            'copy:dist',
            'useminPrepare',
            'cssmin',
            'uglify',
            'usemin',
            'replace-config-vars:' + target
        ]);
    });
};