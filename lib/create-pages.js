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
				try{
					let dataStr = fs.readFileSync(item,'utf-8');
					if(dataStr!==''){
						let data=eval("("+dataStr+")");
						if(item.indexOf('sub-packages')>-1){
							for(let key in data){
								if(key=='preloadRule'){
									pagesData['preloadRule']=data['preloadRule'];
								}else if(key=='subPackages'){
									if(pagesData['subPackages']){
										for(let i=0; i< data['subPackages'].length;i++ ){
											let item=data['subPackages'][i];
											let isIdentical=false;
											for(let a=0;a<pagesData['subPackages'].length;a++){
												let srcItem=pagesData['subPackages'][a];
												if(JSON.stringify(srcItem)==JSON.stringify(item)){
													isIdentical=true;
													break;
												}
											}
											if(!isIdentical){
												pagesData['subPackages'].push(item);
											}
										}
									}else{
										pagesData['subPackages']=data['subPackages'];
									}
								}else if(key=='pages'){
									if(pagesData['subPackages']){
										let pp=path.dirname(item).replace(path.resolve(),'').split(path.sep);
										let root = pp[1]+'/'+pp[2];
										let hasRoot=false;
										for(let i=0;i<pagesData['subPackages'].length;i++){
											let packAge=pagesData['subPackages'][i];
											if(packAge.root==root){
												hasRoot=true;
												for(let a=0;a<data['pages'].length;a++){
													let isIdentical=false;
													let item=data['pages'][a];
													for(let b=0;b<packAge.pages.length;b++){
														if(JSON.stringify(packAge.pages[b])==JSON.stringify(item)){
															isIdentical=true;
															break;
														}
													}
													if(!isIdentical){
														packAge.pages.push(item);
													}
												}
											}
										}
										if(!hasRoot){
											pagesData['subPackages'].push({
												'root':root,
												'pages':data['pages']
											})
										}
									}else{
										pagesData['subPackages']=[];
										let pp=path.dirname(item).replace(path.resolve(),'').split(path.sep);
										let root = pp[1]+'/'+pp[2];
										pagesData['subPackages'].push({
											'root':root,
											'pages':data['pages']
										})
									}
								}
							}
						}else{
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
						
					}
					
				}catch(err){
					console.error('JSON解析失败，文件->'+item);
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