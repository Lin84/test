const
		webpack = require( 'webpack' );

module.exports = {
	context : '',
	entry :   {
		'Device.service' : ['./Device.service.js'],
		'Device.test' :    './test/test.js'
	},
	output :  {
		path :     __dirname + '/dist',
		filename : '[name].js'
	},
	module :  {
		loaders : [
			{
				test :    /\.jsx?$/,
				exclude : /(node_modules(?!\/rxjs))/,
				loader :  'babel',
				query :   {
					presets : [ 'es2015', 'stage-0' ],
					plugins : [ 'transform-runtime' ]
				}
			}
		]
	},
	plugins : [
		new webpack.EnvironmentPlugin( [
			'NODE_ENV'
		] )
	]
};
