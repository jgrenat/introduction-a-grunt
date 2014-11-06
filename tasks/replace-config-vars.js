module.exports = function (grunt) {

    grunt.initConfig({
        'replace-config-vars': {
            'prod': {
                'test': 18
            }
        }
    });

    function getConfigReplacements(configFile, environment, openString, closeString) {
        var i, configVars, envVars, replaces = [];

        // Protège les chaînes à convertir en regex
        var escapeRegexp = /([.*+?^=!:${}()|\[\]\/\\])/g;

        grunt.log.writeln('Checking the environment... ');

        if(!(configVars = grunt.file.readJSON(configFile))) {
            grunt.fail.warn('Unable to replace config vars : file ' + configFile + ' could not be opened');
            return null;
        }

        // Si l'environnement cible est inconnu on targetoie un message d'erreur et on arrête la tâche
        if(!(envVars = configVars[environment])) {
            grunt.fail.warn('Unable to replace config vars : unknown environment.');
            return null;
        }
        grunt.log.ok('Environment checked!');

        // On convertit les variables en regex pour les remplacements multiples.
        for(i in envVars) {
            if(envVars.hasOwnProperty(i)) {
                regexp = new RegExp((openString + i + closeString).replace(escapeRegexp, '$1'), 'g');
                replaces.push([regexp, envVars[i]]);
                grunt.verbose.writeln('Replacement of *' + i + '* by *' + envVars[i] + '* found');
            }
        }

        return replaces;
    }
    
    function replaceInFile(sourcePath, destPath, replaces) {
        // Vérification de la destination
        if(grunt.file.isDir(destPath)) {
            destPath = destPath + '/' + sourcePath.split('/').pop();
        }
        // On remplace les variables dans le fichier
        grunt.file.copy(sourcePath, destPath, {
            process: function(content) {
                // On remplace les variables une à une dans le fichier
                replaces.forEach(function(replace) {
                    content = content.replace(replace[0], replace[1]);
                });
                return content;
            }
        });
    }

    grunt.registerMultiTask('replace-config-vars', 'Remplace les variables de configuration selon l\'environnement', function() {
        var replaces;

        var target = grunt.option('target');
        // On vérifie qu'on a bien la cible
        if(!target) {
            grunt.fail.warn('Unable to replace config vars : target option missing.');
            return false;
        }

        var options = this.options({
            'configFile': 'config.json',
            'openString': '@@',
            'closeString': ''
        });

        // On récupère les remplacements à effectuer selon l'environnement
        replaces = getConfigReplacements(options['configFile'], target, options['openString'], options['closeString']);

        grunt.log.writeln('Replacing config vars for *' + target + '* target... ');
        this.files.forEach(function(file) {
            // Si on n'a aucun fichier source pour une destination, on passe à la suite
            if(file.src.length < 1) {
                return;
            }
            // On retourne une erreur si on a plusieurs fichiers sources pour un seul fichier cible
            if(file.src.length !== 1 && !grunt.file.isDir(file.dest)) {
                grunt.fail.warn('replace-config-vars doesn\'t handle files concatenation.');
                return;
            }
            file.src.forEach(function(path) {
                grunt.verbose.writeln('Processing file *' + path + '*... ');
                replaceInFile(path, file.dest, replaces);
            });
        });
        grunt.log.ok('Every files have been processed!');
    });
}; 
