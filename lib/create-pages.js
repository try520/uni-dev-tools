const fs = require('fs');
const path = require('path');
module.exports = class {
	constructor(watchDirs,watchFileName) {
	    this.watchDirs = watchDirs;
		this.watchFileName=watchFileName;
		this.pagesJsonFilePath = path.join(path.resolve(), "pages.json");
		
	}
	
	static init(watchDirs,watchFileName){
		return new this(watchDirs,watchFileName);
	}
	
	start(){
		let pagesData={};
		try{
			
			let files = [];
			this.watchDirs.forEach((item)=>{
				files=files.concat(this.loadFile(item));
			});
			files.forEach(item=>{
				delete require.cache[item];
				let data=require(item);
				if(data && data!==''){
					for(let key in data){
						if(pagesData[key]){
							if(data[key] instanceof Array){
								for(let i=0; i< data[key].length;i++ ){
									let item=data[key][i];
									let isIdentical=false;
									for(let a=0;a<pagesData[key].length;a++){
										let srcItem=pagesData[key][a];
										if(JSON.stringify(srcItem)==JSON.stringify(item)){
											isIdentical=true;
											break;
										}
									}
									if(!isIdentical){
										pagesData[key].push(item);
									}
								}
							}else{
								pagesData[key]=data[key];
							}
						}else{
							pagesData[key]=data[key];
						}
					}
				}
				
				
			});
			
			fs.writeFileSync(this.pagesJsonFilePath,JSON.stringify(pagesData));
			console.log("pages.json 创建完成");
		}catch(err){
			console.error(err);
		}
		
	}
	
	loadFile(dirPath){
		let files = [];
		let dirItems = fs.readdirSync(dirPath);
		dirItems.forEach(item => {
		    if (this.watchFileName.indexOf(item)>-1) {
		        files.push(path.join(dirPath, item));
		    } else {
		        if (fs.statSync(path.join(dirPath, item)).isDirectory()) {
		            let _files = this.loadFile(path.join(dirPath, item));
		            if (_files.length > 0) {
		                files = files.concat(_files);
		            }
		        }
		    }
		});
		return files;
	}
}