const fs = require('fs');
const path = require('path');

module.exports=class{
	constructor() {
	    
	}
	
	static init(){
		return new this();
	}
	
	start(){
		console.log('开始目录初始化...');
		this.createDir();
		this.createFile();
		console.log('目录初始化完成...');
	}
	
	createDir(){
		let watchDirs = [
			path.join(path.resolve(), "pages"),
			path.join(path.resolve(), "config"),
			path.join(path.resolve(), "workers"),
			path.join(path.resolve(), "sub-packages")
		];
		watchDirs.forEach((item)=>{
			if(!fs.existsSync(item)){
				fs.mkdirSync(item);
				console.log('创建目录',item);
			}
		})
	}
	
	copyDirectory(src, dest) {
	  if (!fs.existsSync(src)) {
	    return false;
	  }
	  if (!fs.existsSync(dest)) {
	    fs.mkdirSync(dest);
	  }
	  var dirs = fs.readdirSync(src);
	  dirs.forEach((item)=>{
	    var item_path = path.join(src, item);
	    var temp = fs.statSync(item_path);
	    if (temp.isFile()) { // 是文件
	      // console.log("Item Is File:" + item);
	      fs.copyFileSync(item_path, path.join(dest, item));
	    } else if (temp.isDirectory()){ // 是目录
	      // console.log("Item Is Directory:" + item);
	      this.copyDirectory(item_path, path.join(dest, item));
	    }
	  });
	}
	
	createFile(){
		let pagesJsonFilePath=path.join(path.resolve(),'pages.json');
		let pagesData={};
		if(fs.existsSync(pagesJsonFilePath)){
			let dataStr=fs.readFileSync(pagesJsonFilePath,'utf-8');
			pagesData=eval("("+dataStr+")");
		}
		//------
		let condition=path.join(path.resolve(),'config','condition.json');
		if(!fs.existsSync(condition)){
			let jsonData={};
			if(pagesData['condition']){
				jsonData["condition"]=pagesData['condition'];
			}
			fs.writeFileSync(condition,JSON.stringify(jsonData));
			console.log('创建文件',condition);
		}
		//------
		let easyCom=path.join(path.resolve(),'config','easy-com.json');
		if(!fs.existsSync(easyCom)){
			let jsonData={};
			if(pagesData['easycom']){
				jsonData["easycom"]=pagesData['easycom'];
			}
			fs.writeFileSync(easyCom,JSON.stringify(jsonData));
			console.log('创建文件',easyCom);
		}
		//------
		let globalStyle=path.join(path.resolve(),'config','global-style.json');
		if(!fs.existsSync(globalStyle)){
			let jsonData={};
			if(pagesData['globalStyle']){
				jsonData["globalStyle"]=pagesData['globalStyle'];
			}
			fs.writeFileSync(globalStyle,JSON.stringify(jsonData));
			console.log('创建文件',globalStyle);
		}
		//------
		let tabBar=path.join(path.resolve(),'config','tab-bar.json');
		if(!fs.existsSync(tabBar)){
			let jsonData={};
			if(pagesData['tabBar']){
				jsonData["tabBar"]=pagesData['tabBar'];
			}
			fs.writeFileSync(tabBar,JSON.stringify(jsonData));
			console.log('创建文件',tabBar);
		}
		
		//------
		let workConfig=path.join(path.resolve(),'workers','config.json');
		if(!fs.existsSync(workConfig)){
			let jsonData={};
			if(pagesData['workers']){
				jsonData["workers"]=pagesData['workers'];
			}
			fs.writeFileSync(workConfig,JSON.stringify(jsonData));
			console.log('创建文件',workConfig);
		}
		//------
		let pagesDir = path.join(path.resolve(),'pages');
		let pagesDirItems = fs.readdirSync(pagesDir);
		pagesDirItems.forEach(item => {
			let dirPath=path.join(pagesDir, item);
			if (fs.statSync(dirPath).isDirectory()) {
				let itemRouterFilePath=path.join(pagesDir,item,'router.json');
				if(!fs.existsSync(itemRouterFilePath)){
					let jsonData={
						"pages":[]
					};
					if(pagesData['pages']){
						pagesData['pages'].forEach(item=>{
							console.log(path.join(path.resolve(), '/'+item.path,'../'),dirPath);
							if(path.join(path.resolve(), '/'+item.path,'../').indexOf(dirPath)>-1){
								jsonData['pages'].push(item);
							}
						});
						fs.writeFileSync(itemRouterFilePath,JSON.stringify(jsonData));
						console.log('创建文件',itemRouterFilePath);
					}
				}
			}
		});
		
		//-----
		let subPackAgesDir = path.join(path.resolve(),'sub-packages');
		if(pagesData['subPackages']){
			if(!fs.existsSync(subPackAgesDir)){
				fs.mkdirSync(subPackAgesDir);
			}
			pagesData['subPackages'].forEach(_package=>{
				let _packagePath=path.join(path.resolve(),_package.root);
				let targetPath = path.join(subPackAgesDir,_package.root);
				if(!fs.existsSync(targetPath)){
					this.copyDirectory(_packagePath,targetPath);
				}
			});
			
			let subPackagesJsonFilePath=path.join(path.resolve(),'sub-packages','sub-packages.json');
			if(!fs.existsSync(subPackagesJsonFilePath)){
				
				pagesData['subPackages'].forEach(item=>{
					item.root='sub-packages/'+item.root
				});
				let jsonData={
					"subPackages":pagesData['subPackages']
				};
				fs.writeFileSync(subPackagesJsonFilePath,JSON.stringify(jsonData));
				console.log('创建文件',subPackagesJsonFilePath);
			}
			
			if(pagesData['preloadRule']){
				let preloadRuleJsonFilePath=path.join(path.resolve(),'sub-packages','preload-rule.json');
				if(!fs.existsSync(preloadRuleJsonFilePath)){
					let jsonData={
						"preloadRule":{}
					};
					for(let page in pagesData['preloadRule']){
						let newPage='sub-packages/'+page;
						jsonData['preloadRule'][newPage]=pagesData['preloadRule'][page];
					}
					
					fs.writeFileSync(preloadRuleJsonFilePath,JSON.stringify(jsonData));
					console.log('创建文件',preloadRuleJsonFilePath);
				}
			}
			
		}
		
		
		//------------------
		
		
	}
}