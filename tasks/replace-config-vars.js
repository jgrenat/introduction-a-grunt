module.exports = function (grunt) {
        
    function getConfigReplacements(configFile, target, openString, closeString) {
        var i, configVars, targetVars, replaces = [];

        // Protège les chaînes à convertir en regex
        var escapeRegexp = /([.*+?^=!:${}()|\[\]\/\\])/g;

        grunt.log.writeln('Checking the target... ');

        if(!(configVars = grunt.file.readJSON(configFile))) {
            grunt.fail.warn('Unable to replace config vars : file ' + configFile + ' could not be opened');
            return null;
        }

        // Si la cible est inconnue on envoie un message d'erreur et on arrête la tâche
        if(!(targetVars = configVars[target])) {
            grunt.fail.warn('Unable to replace config vars : unknown target.');
            return null;
        }
        grunt.log.ok('Target checked!');

        // On convertit les variables en regex pour les remplacements multiples.
        for(i in targetVars) {
            if(targetVars.hasOwnProperty(i)) {
                regexp = new RegExp((openString + i + closeString).replace(escapeRegexp, '$1'), 'g');
                replaces.push([regexp, targetVars[i]]);
                grunt.verbose.writeln('Replacement of *' + i + '* by *' + targetVars[i] + '* found');
            }
        }

        return replaces;
    }
    
    function replaceInFile(filePath, replaces) {
        // On parcourt chaque fichier pour remplacer les variables
        grunt.file.copy(filePath, filePath, {
            process: function(content) {
                // On remplace les variables une à une dans le fichier
                replaces.forEach(function(replace) {
                    content = content.replace(replace[0], replace[1]);
                });
                return content;
            }
        });
    }

    grunt.task.registerTask('replace-config-vars', 'Remplace les variables de configuration selon l\'environnement', function(target) {
        var replaces;

        // Fichier JSON contenant les variables de configuration
        var configFile = 'config.json';
        // Fichier JSON contenant les variables de configuration
        var sourceDirectory = 'dist';
        // Paramètre la forme des remplacements, ici : @@var
        var openString = '@@', closeString = '';

        // On vérifie qu'on a bien un argument
        if(this.args.length !== 1) {
            grunt.fail.warn('Unable to replace config vars : one argument expected, got ' + this.args.length + '.');
            return false;
        }

        // On récupère les remplacements à effectuer
        replaces = getConfigReplacements(configFile, target, openString, closeString);

        grunt.log.writeln('Replacing config vars for *' + target + '* env... ');
        // Cette fonction parcourt récursivement tous les fichiers du répertoire spécifié
        grunt.file.recurse(sourceDirectory, function(absPath, rootDir, subDir, filename) {
            grunt.verbose.writeln('Processing file *' + (subDir || '.') + '/' + filename + '*... ');
            var result = replaceInFile(absPath, replaces);
            return result;
        });
        grunt.log.ok('Every files have been processed!');
    });
}; 