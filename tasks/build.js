module.exports = function(grunt) {
    grunt.registerTask('build', function(target) {
	    target = target || 'prod';
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