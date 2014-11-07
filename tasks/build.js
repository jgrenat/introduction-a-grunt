module.exports = function(grunt) {
    grunt.registerTask('build', function(target) {
        target = target || '';
        // L'environnement
        if(!grunt.option('env')) {
            grunt.option('env', 'preprod');
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
