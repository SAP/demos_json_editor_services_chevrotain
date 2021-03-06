module.exports = function(grunt) {

    var pkg = grunt.file.readJSON('package.json')

    //noinspection UnnecessaryLabelJS
    grunt.initConfig({
        pkg: pkg,

        mocha_istanbul: {
            pudu: {
                src:     'bin/test/pudu',
                options: {
                    mask:           '**/*spec.js',
                    coverageFolder: 'bin/coverage'
                }
            },

            jes: {
                src:     'bin/test/examples/json',
                options: {
                    mask:           '**/*spec.js',
                    coverageFolder: 'bin/coverage'
                }
            },

            css: {
                src:     'bin/test/examples/css',
                options: {
                    mask:           '**/*spec.js',
                    coverageFolder: 'bin/coverage'
                }
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },

            files: {
                src: ['src/pudu/**/*.ts', 'src/examples/**/*.ts', 'test/pudu/**/*.ts', 'test/examples/**/*.ts']
            }
        },

        ts: {
            options: {
                bin:  "ES5",
                fast: "never"

            },

            all: {
                src:     ['src/**/*.ts', 'test/**/*.ts'],
                outDir:  'bin/',
                options: {
                    module : "commonjs",
                    declaration:    false,
                    removeComments: false,
                    sourceMap:      true
                }
            }
        },

        clean: {
            all: ["bin"]
        }
    })

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', [
        'clean:all',
        'tslint',
        'ts:all'
    ])

    grunt.registerTask('test', [
            'build',
            'mocha_istanbul:pudu',
            'mocha_istanbul:jes',
            'mocha_istanbul:css'
        ]
    )
}
