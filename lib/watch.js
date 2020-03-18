const fs = require('fs');
const path = require('path');
const CreatePages = require('./create-pages');
module.exports = class {
	constructor() {
		this.watchDirs = [
			path.join(path.resolve(), "pages"),
			path.join(path.resolve(), "config"),
			path.join(path.resolve(), "workers"),
			path.join(path.resolve(), "sub-packages")
		];
		
		this.watchFileName ="router.json,condition.json,easy-com.json,global-style.json,config.json,tab-bar.json,preload-rule.json,sub-packages.json";
	}
	
	static init(){
		return new this();
	}
	
	start(){
		console.log(
			"uni-app 开发辅助工具启动成功,开始监听文件变化...该工具只为简化开发人员工作,优化多人开发模式,负责将pages.json中的配置分解再合并的自动化工作,解决pages.json混乱的问题。因此pages.json不需要提交,pages.json 将会由其他文件自动生成"
		);
		let pagesJsonFilePath = path.join(path.resolve(), "pages.json");
		let createPages = CreatePages.init(this.watchDirs, this.watchFileName);
		createPages.start();
		this.watchDirs.forEach((item) => {
			((_path)=> {
				fs.watch(_path, {
					recursive: true
				}, (eventType, filename)=> {
					let filePath = path.join(_path, filename);
					let fileName = path.basename(filePath);
					// console.log(eventType,filename);
					if (this.watchFileName.indexOf(fileName) > -1) {
						if (fs.existsSync(pagesJsonFilePath)) {
							let state = fs.statSync(pagesJsonFilePath);
							let lastEditTime = state.mtimeMs;
							let now = new Date().getTime();
							if (now - lastEditTime > 20) {
								createPages.start();
							}
						}
					}
		
				});
			})(item);
		});
	}
}





