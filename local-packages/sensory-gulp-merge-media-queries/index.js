var gutil       = require( 'gulp-util' );
var PluginError = gutil.PluginError;
var through     = require( 'through2' );
var defaults    = require( 'lodash.defaults' );
var parseCss    = require( 'css-parse' );
var path        = require( 'path' );

var PLUGIN_NAME = 'gulp-combine-media-queries';

module.exports = function ( options ) {
  'use strict';

  // Default options
  var allowedUnits = 'em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax';
  var unitRegExp   = new RegExp( '/(' + allowedUnits + ')/g' );

  var options = defaults( options || {}, {
    log :               false,
    path:               false,
    ext :               false,
    use_external :      false,
    separate_external : false,
    default_unit :      'px'
  } );

  // Log info only when 'options.log' is set to true
  var log = function ( message ) {
    if ( options.log ) {
      gutil.log( message );
    }
  };

  // Write merged media queries to file
  var writeToFile = function ( base, path, contents ) {
    var f = new gutil.File( {
      base :     base,
      path :     path,
      contents : new Buffer( contents )
    } );

    log( gutil.colors.cyan( 'File ' + path + ' created.' ) );
    return f;
  };

  // Get media breakpoint definitions
  var getMediaBreakPoints = function ( str, mode ) {
    var reg = new RegExp( '(' + mode + ')([0-9]*)(' + allowedUnits + ')', 'g' );
    var res;
    var matches;

    while ( (matches = reg.exec( str )) !== null ) {
      if ( matches.index === reg.lastIndex ) {
        reg.lastIndex++;
      }

      if ( ( ( mode == 'minwidth' || mode === 'minheight' ) && ( !res || ( matches[ 3 ] < res[ 3 ] ) ) )
              || ( ( mode == 'maxwidth' || mode === 'maxheight' ) && ( !res || ( matches[ 3 ] > res[ 3 ] ) ) ) ) {
        res = matches;
      }
    }

    return res;
  }

  // Process Imports
  var processImport = function ( cssImport ) {
    var strCss = '@import ' + cssImport.import + ';' + '\n\n';
    return strCss;
  };

  // Process comments
  var processComment = function ( comment ) {
    var strCss = '/*' + comment.comment + '*/';
    return strCss;
  };

  // Process declaration
  var processDeclaration = function ( declaration ) {
    var strCss = declaration.property + ': ' + declaration.value + ';';
    return strCss;
  };

  // Check declarations type
  var commentOrDeclaration = function ( declarations ) {
    var strCss = '';
    if ( declarations.type === 'declaration' ) {
      strCss += '\n\t' + processDeclaration( declarations );
    } else if ( declarations.type === 'comment' ) {
      strCss += ' ' + processComment( declarations );
    }
    return strCss;
  };

  // Process normal CSS rule
  var processRule = function ( rule ) {
    var strCss = '';
    strCss += rule.selectors.join( ',\n' ) + ' {';
    rule.declarations.forEach( function ( rules ) {
      strCss += commentOrDeclaration( rules );
    } );
    strCss += '\n}\n\n';
    return strCss;
  };

  // Check rule type
  var commentOrRule = function ( rule ) {
    var strCss = '';
    if ( rule.type === 'rule' ) {
      strCss += processRule( rule );
    } else if ( rule.type === 'comment' ) {
      strCss += processComment( rule ) + '\n\n';
    }
    return strCss;
  };

  // Check keyframe type
  var commentOrKeyframe = function ( frame ) {
    var strCss = '';
    if ( frame.type === 'keyframe' ) {
      strCss += frame.values.join( ',' ) + ' {';
      frame.declarations.forEach( function ( declaration ) {
        strCss += commentOrDeclaration( declaration );
      } );
      strCss += '\n}\n\n';
    } else if ( frame.type === 'comment' ) {
      strCss += processComment( frame ) + '\n\n';
    }
    return strCss;
  };

  // Process media queries
  var processMedia = function ( media ) {
    var strCss = '';
    strCss += '@media ' + media.rule + ' {\n\n';
    media.rules.forEach( function ( rule ) {
      strCss += commentOrRule( rule );
    } );
    strCss += '}\n\n';
    log( '  @media ' + media.rule );

    return strCss;
  };

  // Process keyframes
  var processKeyframes = function ( key ) {
    var strCss = '';
    strCss += '@' + (typeof key.vendor !== 'undefined' ?
                     key.vendor :
                     '') + 'keyframes ' + key.name + ' {\n\n';
    key.keyframes.forEach( function ( keyframe ) {
      strCss += commentOrKeyframe( keyframe );
    } );
    strCss += '}\n\n';

    return strCss;
  };

  function transform ( file, enc, cb ) {

    if ( file.isNull() ) {
      this.push( file );
      return cb();
    }

    if ( file.isStream() ) {
      this.emit( 'error', new PluginError( PLUGIN_NAME, 'Streaming not supported' ) );
      return cb();
    }

    var filename       = path.relative( file.cwd, file.path );
    var source         = file.contents.toString( 'utf8' );
    var cssJson        = parseCss( source );
    var strStyles      = [];
    var strMediaStyles = [];
    var processedCSS   = {};

    log( 'File ' + filename + ' found.' );

    processedCSS.imports         = [];
    processedCSS.base            = [];
    processedCSS.media           = [];
    processedCSS.media.all       = [];
    processedCSS.media.minWidth  = [];
    processedCSS.media.maxWidth  = [];
    processedCSS.media.minHeight = [];
    processedCSS.media.maxHeight = [];
    processedCSS.media.print     = [];
    processedCSS.media.blank     = [];
    processedCSS.keyframes       = [];

    // For every rule in the stylesheet...
    cssJson.stylesheet.rules.forEach( function ( rule ) {

      // If the rule type is an import
      if ( rule.type === 'import' ) {
        processedCSS.imports.push( rule );
      }

      // if the rule is a media query...
      if ( rule.type === 'media' ) {

        // Create 'id' based on the query (stripped from spaces and dashes etc.)
        var strMedia = rule.media.replace( /[^A-Za-z0-9]/ig, '' );

        // Create an array with all the media queries with the same 'id'
        var item = processedCSS.media.filter( function ( element ) {
          return (element.val === strMedia);
        } );

        // If there are no media queries in the array, define details
        if ( item.length < 1 ) {
          var mediaObj     = {};
          mediaObj.sortVal = parseFloat( rule.media.match( /\d+/g ) );
          mediaObj.rule    = rule.media;
          mediaObj.val     = strMedia;
          mediaObj.rules   = [];

          processedCSS.media.push( mediaObj );
        }

        // Compare the query to other queries
        var i = 0, matched = false;
        processedCSS.media.forEach( function ( elm ) {
          if ( elm.val === strMedia ) {
            matched = true;
          }
          if ( !matched ) {
            i++;
          }
        } );

        // Push every merged query
        rule.rules.forEach( function ( mediaRule ) {
          if ( mediaRule.type === 'rule' || 'comment' ) {
            processedCSS.media[ i ].rules.push( mediaRule );
          }
        } );

      } else if ( rule.type === 'keyframes' ) {
        processedCSS.keyframes.push( rule );

      } else if ( rule.type === 'rule' || 'comment' ) {
        processedCSS.base.push( rule );
      }
    } );

    // Sort media queries by kind, this is needed to output them in the right order
    processedCSS.media.forEach( function ( item ) {
      if ( item.rule.match( /min-width/ ) ) {
        processedCSS.media.minWidth.push( item );
      } else if ( item.rule.match( /min-height/ ) ) {
        processedCSS.media.minHeight.push( item );
      } else if ( item.rule.match( /max-width/ ) ) {
        processedCSS.media.maxWidth.push( item );
      } else if ( item.rule.match( /max-height/ ) ) {
        processedCSS.media.maxHeight.push( item );
      } else if ( item.rule.match( /print/ ) ) {
        processedCSS.media.print.push( item );
      } else if ( item.rule.match( /all/ ) ) {
        processedCSS.media.all.push( item );
      } else {
        processedCSS.media.blank.push( item );
      }
    } );

    // Function to determine sort order
    var determineSortOrder = function ( a, b, isMax ) {
      var sortValA = a.sortVal,
          sortValB = b.sortVal;
      isMax        = typeof isMax !== 'undefined' ?
                     isMax :
                     false;

      // consider print for sorting if sortVals are equal
      if ( sortValA === sortValB ) {
        if ( a.rule.match( /print/ ) ) {
          // a contains print and should be sorted after b
          return 1;
        }
        if ( b.rule.match( /print/ ) ) {
          // b contains print and should be sorted after a
          return -1;
        }
      }

      // return descending sort order for max-(width|height) media queries
      if ( isMax ) {
        return sortValB - sortValA;
      }

      // return ascending sort order
      return sortValA - sortValB;
    };

    // Sort media.all queries ascending
    processedCSS.media.all.sort( function ( a, b ) {
      return determineSortOrder( a, b );
    } );

    // Sort media.minWidth queries ascending
    processedCSS.media.minWidth.sort( function ( a, b ) {
      return determineSortOrder( a, b );
    } );

    // Sort media.minHeight queries ascending
    processedCSS.media.minHeight.sort( function ( a, b ) {
      return determineSortOrder( a, b );
    } );

    // Sort media.maxWidth queries descending
    processedCSS.media.maxWidth.sort( function ( a, b ) {
      return determineSortOrder( a, b, true );
    } );

    // Sort media.maxHeight queries descending
    processedCSS.media.maxHeight.sort( function ( a, b ) {
      return determineSortOrder( a, b, true );
    } );

    // Function to output CSS Imports
    var outputImports = function ( base ) {
      base.forEach( function ( rule ) {
        strStyles += processImport( rule );
      } );
    };

    // Function to output base CSS
    var outputBase = function ( base ) {
      base.forEach( function ( rule ) {
        strStyles += commentOrRule( rule );
      } );
    };

    //
    var outputCombinedMedia = function ( item ) {
      var mode;

      if ( item.val.indexOf( 'minwidth' ) >= 0 ) {
        mode = 'minwidth';
      }

      else if ( item.val.indexOf( 'minheight' ) >= 0 ) {
        mode = 'minheight';
      }

      else if ( item.val.indexOf( 'maxwidth' ) >= 0 ) {
        mode = 'maxwidth';
      }

      else if ( item.val.indexOf( 'maxheight' ) >= 0 ) {
        mode = 'maxheight';
      }

      var mbp = getMediaBreakPoints( item.val, mode );

      if ( mbp ) {
        var tmp,
            tmpMinVal = -1;

        for ( var key in options.separate_external ) {
          var bpoint    = options.separate_external[ key ];
          var minWidth  = parseInt( bpoint.min || bpoint.minWidth || null );
          var maxWidth  = parseInt( bpoint.max || bpoint.maxWidth || null );
          var minHeight = parseInt( bpoint.minHeight || null );
          var maxHeight = parseInt( bpoint.maxHeight || null );

          if ( mode === 'minwidth' && mbp[ 2 ] >= minWidth ) {
            tmp = key;
          }

          else if ( mode === 'minheight' && mbp[ 2 ] >= minHeight ) {
            tmp = key;
          }

          else if ( mode === 'maxwidth' && ( tmpMinVal < 0 || minWidth < tmpMinVal ) ) {
            tmpMinVal = minWidth;
            tmp       = key;
          }

          else if ( mode === 'maxheight' && ( tmpMinVal < 0 || minHeight < tmpMinVal ) ) {
            tmpMinVal = minHeight;
            tmp       = key;
          }
        }

        if ( !tmp || tmp === 'base' ) {
          strStyles += processMedia( item );
        }

        else {
          if ( typeof strMediaStyles[ tmp ] === 'undefined' ) {
            strMediaStyles[ tmp ] = [];
          }

          strMediaStyles[ tmp ] += processMedia( item );
        }
      }
    };

    // Function to output media queries
    var outputMedia = function ( media ) {
      if ( options.use_external ) {
        media.forEach( function ( item ) {

          if ( typeof options.separate_external === 'object' ) {
            outputCombinedMedia( item );
          } else {
            strMediaStyles[ item.val ] = processMedia( item );
          }
        } );
      } else {
        media.forEach( function ( item ) {
          strStyles += processMedia( item );
        } );
      }
    };

    // Function to output keyframes
    var outputKeyFrames = function ( keyframes ) {
      keyframes.forEach( function ( keyframe ) {
        strStyles += processKeyframes( keyframe );
      } );
    };

    // Check if the imports CSS was processed and print them
    if ( processedCSS.imports.length !== 0 ) {
      outputImports( processedCSS.imports );
    }

    // Check if base CSS was processed and print them
    if ( processedCSS.base.length !== 0 ) {
      outputBase( processedCSS.base );
    }

    // Check if media queries were processed and print them in order
    if ( processedCSS.media.length !== 0 ) {
      log( 'Processed media queries:' );
      outputMedia( processedCSS.media.blank );
      outputMedia( processedCSS.media.all );
      outputMedia( processedCSS.media.minWidth );
      outputMedia( processedCSS.media.minHeight );
      outputMedia( processedCSS.media.maxWidth );
      outputMedia( processedCSS.media.maxHeight );
      outputMedia( processedCSS.media.print );
    }

    // Check if keyframes were processed and print them
    if ( processedCSS.keyframes.length !== 0 ) {
      outputKeyFrames( processedCSS.keyframes );
    }

    // Define the new export path
    if ( options.path ) {
    }

    // Define the new file extension
    if ( options.ext ) {
      console.log("file.path: " , file.path);
      file.path = gutil.replaceExtension( file.path, options.ext );
    }

    filename = path.relative( file.cwd, file.path );

    // Write the new file
    file.contents = new Buffer( strStyles );
    log( gutil.colors.cyan( 'File ' + filename + ' created.' ) );

    if ( options.use_external && processedCSS.media.length !== 0 ) {

      if ( options.separate_external === true || typeof options.separate_external === 'object' ) {

        for ( var key in strMediaStyles ) {
          if ( strMediaStyles.hasOwnProperty( key ) ) {
            this.push( writeToFile( file.base, filename.replace( '.css', '.' + key + '.css' ), strMediaStyles[ key ] ) );
          }
        }
      } else {
        this.push( writeToFile( file.base, filename.replace( '.css', '.responsive.css' ), strMediaStyles.join() ) );
      }
    }

    this.push( file );
    cb();
  }

  return through.obj( transform );
};