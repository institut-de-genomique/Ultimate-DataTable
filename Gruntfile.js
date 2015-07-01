 module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	 concat: {
		options: {
		  banner: '/*! <%= pkg.name %> version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> \n Ultimate DataTable is distributed open-source under CeCILL FREE SOFTWARE LICENSE. Check out http://www.cecill.info/ for more information about the contents of this license.\n*/\n',
		  separator: ';',
		},
		distJs: {
		  src: ['src/datatable-core.js', 'src/directives/*.js', 'src/filters/*.js', 'src/services/*.js', 'src/templates/*.js'],
		  dest: 'dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js',
		},
		distJsNoTemplate: {
		  src: ['src/datatable-core.js', 'src/directives/*.js', 'src/filters/*.js', 'src/services/*.js'],
		  dest: 'dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>-no-template.js',
		},
		distCss: {
		  src: ['src/css/*.css'],
		  dest: 'dist/<%= pkg.version %>/css/<%= pkg.name %>-<%= pkg.version %>.css',
		}
	},
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> version <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> \n Ultimate DataTable is distributed open-source under CeCILL FREE SOFTWARE LICENSE. Check out http://www.cecill.info/ for more information about the contents of this license.\n*/\n',
		report: 'min',
        mangle: false
      },
      buildJs: {
        src: 'dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js'
      },
	  buildJsNoTemplate: {
        src: 'dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>-no-template.js',
        dest: 'dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>-no-template.min.js'
      }
    },
	cssmin: {
	  options: {
		shorthandCompacting: false,
		roundingPrecision: -1
	  },
	  target: {
		files: {
		  'dist/<%= pkg.version %>/css/<%= pkg.name %>-<%= pkg.version %>.min.css': ['dist/<%= pkg.version %>/css/<%= pkg.name %>-<%= pkg.version %>.css']
		}
	  }
	}
  });

  // Load the plugin that provides the uglify, concat and cssmin task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','cssmin']);

};