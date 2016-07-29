module.exports = function (grunt){

    grunt.initConfig({

        /*** ..:: Folder Setup ::.. ***/
        /*Development Folder*/
        SrcFolder : {
            css : 'src/assets/css',
            js : 'src/assets/js',
            images : 'src/assets/images',
            entry : 'src/index.html',
            root : 'src'
        },
        /*Build Folder*/
        BuildFolder : {
            css : 'build/assets/css',
            js : 'build/assets/js',
            images : 'build/assets/images',
            entry : 'build/index.html',
            root : 'build'
        },

        /*** ..:: Task(s) ::..***/
        clean : {
            all : ['<%= BuildFolder.root %>'],
            bundle : ['<%= BuildFolder.js %>/bundle.js','<%= SrcFolder.css%>/sprites.css']
        },
        browserify : {
            bundle : {
                src : '<%= SrcFolder.js %>/**',
                dest : '<%= BuildFolder.js%>/bundle.js'
            }
        },
        htmlmin : {
            options : {
                removeComments : true,
                collapseWhitespace : true,
                collapseBooleanAttributes : true,
                removeRedundantAttributes : true,
                //removeOptionalTags : true
            },
            files : {
                src : '<%= SrcFolder.entry %>',
                dest : '<%= BuildFolder.entry%>'
            }
        },
        sprite : {
            all : {
                src : '<%= SrcFolder.images %>/sprite/**/*.png',
                dest : '<%= SrcFolder.images %>/sprites.png',
                destCss : '<%= SrcFolder.css %>/sprites.css'
            }
        },
        copy : {
            css : {
                files : [
                    {expand : true, cwd:'<%= SrcFolder.css %>', src : '**/*.css', dest:'<%= BuildFolder.css %>/'}
                ]
            },
            images : {
                files : [
                    {expand : true, cwd:'<%= SrcFolder.images %>', src : '*.png', dest:'<%= BuildFolder.images %>'}
                ]
            }
        },
        uglify : {
            js : {
                files: {
                    '<%= BuildFolder.js %>/bundle.min.js': ['<%= BuildFolder.js %>/bundle.js']
                }
            }
        },
        cssmin : {
            options : {
                shorthandCompacting : false,
                roundingPrecision : -1
            },
            target : {
                files : {
                    '<%= BuildFolder.css %>/styles.min.css' : ['<%= SrcFolder.css %>**/*.css']
                }
            }
        },
        watch:{
            css : {
                files : '<%= SrcFolder.css %>**/*.css',
                tasks : ['sprite', 'cssmin', 'clean:bundle']
            },
            js : {
                files : '<%= SrcFolder.js %>**/*.js',
                tasks : ['browserify']
            },
            html : {
                files : '<%= SrcFolder.entry %>',
                tasks : ['htmlmin']
            }
        }

    });

    // Load npm tasks
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-spritesmith');

    //Define grunt tasks
    grunt.registerTask('default',['clean:all','htmlmin', 'browserify', 'sprite','copy:images' , 'cssmin', 'uglify', 'clean:bundle','watch']);
};