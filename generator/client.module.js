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

module.exports = function (_, gulp, install, conflict, template, rename, inquirer, colors, gutil, exec, fs, path, injectAngularModules) {
    //create angular module
    gulp.task('client-module', clientModule);

    function clientModule(done) {
        var args = this.args;

        if (!this.args[0]) {
            console.log('###########################################################'.yellow);
            console.log('#####   Incorrect usage                               #####'.yellow);
            console.log('#####   Try slush appkit:client-module <moduleName>   #####'.yellow);
            console.log('#####   Example: `slush appkit:client-module user`    #####'.yellow);
            console.log('###########################################################'.yellow);
            return done();
        }

        inquirer.prompt([
            //{ type: 'input', name: 'module', message: 'What is the module?', default: gulp.args.join(' ') },
            //{ type: 'input', name: 'name', message: 'What is the name of controller?', default: gulp.args.join(' ') },
            { type: 'confirm', name: 'moveon', message: 'Continue?' }
        ],
            function (answers) {
                if (!answers.moveon) {
                    return done();
                }
                answers.moduleName = args[0];
                answers.moduleNameStartCase = _.startCase(args[0]).split(' ').join('');

                var inject = [__dirname + '/../template/angular/module/**'];
                gulp.src(inject) // Note use of __dirname to be relative to generator              
                    .pipe(template(answers))                 // Lodash template support
                    .pipe(rename(function (path) {
                        if (path.extname) {
                            path.basename = answers.moduleName + '.' + path.basename;
                        }
                        if (path.basename[0] === '_') { //rename _ to .
                            path.basename = '.' + path.basename.slice(1);
                        }
                    }))
                    .pipe(conflict('./client/src/app/modules/' + answers.moduleName))                    // Confirms overwrites on file conflicts            
                    .pipe(gulp.dest('./client/src/app/modules/' + answers.moduleName))                   // Without __dirname here = relative to cwd

                    .on('end', function () {
                        //generates client app.module.js   
                        injectAngularModules(answers.name).on('end', function () {
                            setTimeout(function () {
                                console.log('##################################################'.green);
                                console.log('#####                                        #####'.green);
                                console.log('#####   Client module successfully created   #####'.green);
                                console.log('#####                                        #####'.green);
                                console.log('##################################################'.green);
                                done();
                            }, 500);
                        });
                    })
                    .resume();
            });
    }
}