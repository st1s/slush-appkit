/**
 * slush-appkit provides a modular workflow to scaffold and build web applications
 * 
 * Software licensed under MIT, maintained by @stewones. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in http://slush-appkit.stpa.co
 *
 * Copyright © 2014 Stewan Pacheco <talk@stpa.co>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var args = require('yargs').argv;
var ngConstant = require('gulp-angular-constant');
var rename = require("gulp-rename");
var path = require('path');
var conf = require('./conf');
var browserSync = require('browser-sync');
var _ = require('lodash');


gulp.task('appkit', ['enviroment', 'settings']);
//enviroment config constants
gulp.task('enviroment', function () {
    var config = require('../../appkit.json');
    var env = args.env || 'development';
    var envConfig = config.environment[env];
    return ngConstant({
        name: 'app.env',
        constants: envConfig,
        stream: true
    }).pipe($.uglify({
        preserveComments: $.uglifySaveLicense
    })).pipe(rename('app.env.constant.js')).pipe(gulp.dest('./src/app/constants'));
});

//app settings constants
gulp.task('settings', function () {
    var config = require('../../appkit.json');
    return ngConstant({
        name: 'app.setting',
        constants: config.application,
        stream: true
    }).pipe($.uglify({
        preserveComments: $.uglifySaveLicense
    })).pipe(rename('app.setting.constant.js')).pipe(gulp.dest('./src/app/constants'));
});