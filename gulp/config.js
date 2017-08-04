/* eslint-disable one-var */
const environment = require('./environment');

const
    /* General */
    PORT = 5001,
    TITLE = 'Gulp Development Stack',

    /* Paths */
    NPM = './node_modules',
    DEVELOPMENT_BASE = './src',
    BUILD_BASE = './dist',

    /* Gulp */
    GULP_ALL = ['./gulpfile.js', './gulp/**/*.js'],

    /* CSS */
    CSS_BASE = `${DEVELOPMENT_BASE}/styles`,
    CSS_ENTRY = `${CSS_BASE}/Innogy/**/*.scss`,
    CSS_ALL = `${CSS_BASE}/**/*.scss`,
    CSS_BUILD = `${BUILD_BASE}/css/Innogy`,
    CSS_TPL_PATH = '/css',
    CSS_BUILD_INNOGY = `${BUILD_BASE}/css`,

    /* JavaScript */
    JS_BASE = `${DEVELOPMENT_BASE}/app`,
    JS_MAIN_FILENAME = 'app.js',
    JS_ENTRY = `${JS_BASE}/${JS_MAIN_FILENAME}`,
    JS_ALL = `${JS_BASE}/**/*.js`,
    JS_VENDOR_ALL = `${JS_BASE}/vendor/**/*.js`,
    JS_BUILD = `${BUILD_BASE}/js/Innogy`,
    JS_TPL_PATH = `${BUILD_BASE}/js`,
    JS_BUILD_INNOGY = `${BUILD_BASE}/js`,

    JS_REACT_MAIN_FILENAME = 'app-forms.js',
    JS_REACT_ENTRY = `${JS_BASE}/${JS_REACT_MAIN_FILENAME}`,

    /* Fonts */
    FONTS_BASE = `${DEVELOPMENT_BASE}/fonts`,
    FONTS_BUILD = `${BUILD_BASE}/fonts`,

    /* GFX */
    GFX_BASE = `${DEVELOPMENT_BASE}/gfx`,
    GFX_BUILD = `${BUILD_BASE}/gfx`,
    GFX_TPL_PATH = '/gfx',

    /* SVG */
    SVG_BASE = `${GFX_BASE}/svg`,
    SVG_SINGLE_ALL = `${SVG_BASE}/*.svg`,
    SVG_SPRITE_ALL = [
        `${SVG_BASE}/**/*.svg`,
        `!${SVG_SINGLE_ALL}`
    ],
    SVG_BUILD = `${GFX_BUILD}/svg`,
    SVG_BUILD_SPRITES = `${SVG_BUILD}/sprites`,
    SVG_TPL_PATH = `${GFX_TPL_PATH}/svg`,
    SVG_SPRITES_TPL_PATH = `${SVG_TPL_PATH}/sprites`,

    /* Favicon */
    FAVICON_COLORS = {
        fg: '#e83a29',
        bg: '#ffffff'
    },
    FAVICON_BASE = `${GFX_BASE}`,
    FAVICON_SOURCE = `${FAVICON_BASE}/favicon-source.png`,
    FAVICON_JSON = 'faviconData.json',

    IMAGES_ALL = [
        `${GFX_BASE}/**/*.{jpg,jpeg,png,gif}`,
        `${SVG_SINGLE_ALL}`,
        `!${FAVICON_SOURCE}`
    ],

    /* Templates */
    TEMPLATE_BASE = `${DEVELOPMENT_BASE}/tpl`,
    TEMPLATE_PAGES = `${TEMPLATE_BASE}/*.nunj`,
    TEMPLATE_ALL = `${TEMPLATE_BASE}/**/*.nunj`,

    /* HTML */
    HTML_ALL = `${DEVELOPMENT_BASE}/*.html`,
    HTML_BUILD = `${BUILD_BASE}/*.html`,

    /* Styleguide */
    STYLEGUIDE_BASE = './styleguide',
    STYLEGUIDE_HOMEPAGE = '../../styleguide.md',
    STYLEGUIDE_DEST = `${STYLEGUIDE_BASE}/styleguide`,
    STYLEGUIDE_TEMPLATE = `${NPM}/styleguide/dist`,

    // deploy
    DEPLOY_HOST = '',
    DEPLOY_USERNAME = '',
    DEPLOY_PASSWORD = '',
    DEPLOY_DEST = '/home/deploy/packages',

    // api
    API = `${DEVELOPMENT_BASE}/api/api.js`,
    API_PORT = 5003,

    SM_STYLES = './src/sm/css',
    SM_JS = './src/sm/js',
    SM_FONTS = './src/sm/fonts';

module.exports = {
    PORT,
    TITLE,
    environment,

    NPM,
    DEVELOPMENT_BASE,
    BUILD_BASE,
    GULP_ALL,

    CSS_BASE,
    CSS_ENTRY,
    CSS_ALL,
    CSS_BUILD,
    CSS_TPL_PATH,
    CSS_BUILD_INNOGY,

    JS_REACT_MAIN_FILENAME,
    JS_REACT_ENTRY,

    JS_BASE,
    JS_MAIN_FILENAME,
    JS_ENTRY,
    JS_ALL,
    JS_VENDOR_ALL,
    JS_BUILD,
    JS_TPL_PATH,
    JS_BUILD_INNOGY,

    FONTS_BASE,
    FONTS_BUILD,

    GFX_BASE,
    GFX_BUILD,
    GFX_TPL_PATH,
    IMAGES_ALL,
    FAVICON_COLORS,
    FAVICON_BASE,
    FAVICON_SOURCE,
    FAVICON_JSON,
    SVG_BASE,
    SVG_SINGLE_ALL,
    SVG_SPRITE_ALL,
    SVG_BUILD,
    SVG_BUILD_SPRITES,
    SVG_TPL_PATH,
    SVG_SPRITES_TPL_PATH,

    TEMPLATE_BASE,
    TEMPLATE_PAGES,
    TEMPLATE_ALL,
    HTML_ALL,
    HTML_BUILD,

    STYLEGUIDE_BASE,
    STYLEGUIDE_HOMEPAGE,
    STYLEGUIDE_DEST,
    STYLEGUIDE_TEMPLATE,

    DEPLOY_HOST,
    DEPLOY_USERNAME,
    DEPLOY_PASSWORD,
    DEPLOY_DEST,

    API,
    API_PORT,

    SM_STYLES,
    SM_JS,
    SM_FONTS
};
/* eslint-enable one-var */



// export default {
//     paths: {
//         gulpfile: './gulpfile.babel.js',
//         npm: './node_modules',
//         src: {
//             base: './src',
//             nodeModules: './node_modules',
//             styles: {
//                 base: './src/styles',
//                 entry: [
//                     './src/styles/Innogy/**/*.scss'
//                 ],
//                 all: './src/styles/**/*.scss',
//                 dest: './src/css',
//                 destInnogy: './src/css/Innogy'
//             },
//             app: {
//                 base: './src/app',
//                 entry: './src/app/app.js',
//                 all: './src/app/**/*.js',
//                 dest: './src/js',
//                 destInnogy: './src/js/Innogy'
//             },
//             react: {
//                 base: './src/app',
//                 entry: './src/app/app-forms.js',
//                 all: './src/app/app-forms/**/*.js',
//                 dest: './src/js',
//                 destInnogy: './src/js/Innogy'
//             },
//             tpl: {
//                 base: './src/tpl',
//                 entry: './src/tpl/*.nunj',
//                 all: './src/tpl/**/*.nunj'
//             },
//             icon: {
//                 entry: './src/gfx/svg/*.svg',
//                 dest: './src/gfx/icon'
//             },
//             fonts: {
//                 dest: './src/fonts'
//             },
//             html: './src/*.html'
//         },
//         dist: {
//             base: './dist',
//             css: './dist/css',
//             cssInnogy: './dist/css/Innogy',
//             js: './dist/js',
//             jsInnogy: './dist/js/Innogy',
//             react: './dist/js',
//             icon: './dist/gfx/icon',
//             html: './dist/*.html',
//             fonts: './dist/fonts'
//         },
//         sm: {
//             styles: './src/sm/css',
//             js: './src/sm/js',
//             fonts: './src/sm/fonts'
//         }
//     },
//     names: {
//         js: {
//             src: 'app.js',
//             min: 'app.min.js'
//         },
//         react: {
//             src: 'app-forms.js',
//             min: 'app-forms.min.js'
//         }
//     }
// };
