module.exports = function(grunt) {
    grunt.registerTask('build', function(environment) {
		environment = environment || 'preprod';
		grunt.task.run([
		    'clean:dist',
		    'copy:dist',
		    'useminPrepare',
		    'cssmin', 
		    'uglify',
		    'usemin',
		    'replace-config-vars:' + environment
		]);
    });
};
