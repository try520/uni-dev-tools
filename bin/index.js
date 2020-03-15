#!/usr/bin/env node

const program = require('commander');
var pkg = require('../package.json');
const Watch=require('../lib/watch').init();
const init=require('../lib/init').init();

program.command('init').description('对应用进行初始化,创建config目录、sub-packages目录、workers目录，这步不是必须，你也可以在今后的开发中，自己创建').action(function(cmd){
	 init.start();
});

program.command('watch').description('对相关文件及目录进行监控')
.action(function(){
	  Watch.start();
});

program.version(pkg.version, '-v, --version').parse(process.argv)

