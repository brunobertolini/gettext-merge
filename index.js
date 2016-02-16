'use strict';

var fs = require('fs');
var colors = require('colors');
var gettextParser = require('gettext-parser');
var argv = require('yargs').argv;

var po = gettextParser.po.parse(fs.readFileSync(argv.po));
var pot = gettextParser.po.parse(require('fs').readFileSync(argv.pot));
var keys = Object.keys(pot.translations['']);

var totals = {
	added: 0,
	changed: 0
};

for (var i = 1; i < keys.length; i++) {
	if (po.translations[''][keys[i]]) {
		pot.translations[''][keys[i]]['msgstr'] = po.translations[''][keys[i]]['msgstr'];

		if (po.translations[''][keys[i]].comments.reference !== pot.translations[''][keys[i]].comments.reference) {
			var comments = {
				changes: [],
				out: po.translations[''][keys[i]].comments.reference.split('\n'),
				in: pot.translations[''][keys[i]].comments.reference.split('\n')
			};

			comments.out.forEach(function(item) {
				if (comments.in.indexOf(item) === -1) {
					comments.changes.push('-'.red + ' ' + item.grey);
				}	
			});

			comments.in.forEach(function(item) {
				if (comments.out.indexOf(item) === -1) {
					comments.changes.push('+'.green + ' ' + item.grey);
				}	
			});
						
			if (comments.changes.length && (!argv.show || argv.show === 'change') ) {
				console.log('[CHANGE]'.yellow, keys[i]);

				comments.changes.map(function(item) {
					console.log(item);
				});
			
				console.log('');
				totals.changed++;
			}
		}
	} else if ((!argv.show || argv.show === 'add')) {
		console.log('[ADD]'.green, keys[i]);
		
		if (pot.translations[''][keys[i]].comments) {
			console.log(pot.translations[''][keys[i]].comments.reference.grey);
		}

		console.log('');
		totals.added++;
	}	
}

pot.headers = po.headers;

if (!argv.debug) {
	fs.writeFileSync(argv.output || argv.po, gettextParser.po.compile(pot));
}

console.log('------------------------------------------'.black);
console.log('Totals:'.black);
console.log(colors.green(totals.added), 'additions'.green);
console.log(colors.yellow(totals.changed), 'changes'.yellow);
console.log('------------------------------------------'.black);