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
	
	createFile(){
		let condition=path.join(path.resolve(),'config','condition.json');
		if(!fs.existsSync(condition)){
			fs.writeFileSync(condition,`{}`);
			console.log('创建文件',condition);
		}
		
		let easyCom=path.join(path.resolve(),'config','easy-com.json');
		if(!fs.existsSync(easyCom)){
			fs.writeFileSync(easyCom,`{}`);
			console.log('创建文件',easyCom);
		}
		
		let globalStyle=path.join(path.resolve(),'config','global-style.json');
		if(!fs.existsSync(globalStyle)){
			fs.writeFileSync(globalStyle,`{}`);
			console.log('创建文件',globalStyle);
		}
		
		let tabBar=path.join(path.resolve(),'config','tab-bar.json');
		if(!fs.existsSync(tabBar)){
			fs.writeFileSync(tabBar,`{}`);
			console.log('创建文件',tabBar);
		}
		
		let preloadRule=path.join(path.resolve(),'sub-packages','preload-rule.json');
		if(!fs.existsSync(tabBar)){
			fs.writeFileSync(preloadRule,`{}`);
			console.log('创建文件',preloadRule);
		}
		
		let workConfig=path.join(path.resolve(),'workers','config.json');
		if(!fs.existsSync(tabBar)){
			fs.writeFileSync(workConfig,`{}`);
			console.log('创建文件',workConfig);
		}
		
		let pagesDir = path.join(path.resolve(),'pages');
		let pagesDirItems = fs.readdirSync(pagesDir);
		pagesDirItems.forEach(item => {
			if (fs.statSync(path.join(pagesDir, item)).isDirectory()) {
				let itemRouterFilePath=path.join(pagesDir,item,'router.json');
				if(!fs.existsSync(itemRouterFilePath)){
					fs.writeFileSync(itemRouterFilePath,`{"pages": []}`);
					console.log('创建文件',itemRouterFilePath);
				}
			}
		});
		
		let subPackAgesDir = path.join(path.resolve(),'sub-packages');
		let subPackAgesDirItems = fs.readdirSync(subPackAgesDir);
		subPackAgesDirItems.forEach(item => {
			if (fs.statSync(path.join(subPackAgesDir, item)).isDirectory()) {
				let itemRouterFilePath=path.join(subPackAgesDir,item,'router.json');
				if(!fs.existsSync(itemRouterFilePath)){
					fs.writeFileSync(itemRouterFilePath,`{"subPackages": []}`);
					console.log('创建文件',itemRouterFilePath);
				}
			}
		});
	}
}