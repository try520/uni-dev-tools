const Watch=require('./lib/watch').init();
const Init=require('./lib/init').init();
module.exports = class {
	constructor() {
	    
	}
	
	static init(){
		return new this();
	}
	
	initialization(){
		Init.start();
	}
	
	watch(){
		Watch.start();
	}
}