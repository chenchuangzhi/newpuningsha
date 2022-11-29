game.import('extension', function(lib, game, ui, get, ai, _status) {
	
	
	/*-----------------分割线-----------------*/
	// 调用启动页代码
	// 定义 layoutPath
	let layoutPath = lib.assetURL + 'extension/手杀ui/';
	/*-----------------分割线-----------------*/
	// 调用css
	if (lib.config.extension_手杀ui_qiDongYe == 'on') {
		lib.init.css(layoutPath, 'qidongye/layout_old'); /*动态启动页css文件*/
	};
	/***********************分割线**********************/
	if (lib.config.extension_手杀ui_qiDongYe == 'othersOn') {
		lib.init.css(layoutPath, 'qidongye/layout_new'); /*大启动页css文件*/
	};
	/*-----------------分割线-----------------*/
	
	
	//武将搜索代码摘抄至扩展ol
	var kzol_create_characterDialog = ui.create.characterDialog;
	ui.create.characterDialog = function() {
		var dialog = kzol_create_characterDialog.apply(this, arguments);
		if (lib.config.mode == 'stone') return dialog;
		var content_container = dialog.childNodes[0];
		var content = content_container.childNodes[0];
		var switch_con = content.childNodes[0];
		var buttons = content.childNodes[1];
		var div = ui.create.div('');
		div.style.height = '35px';
		div.style.width = 'calc(100%)';
		div.style.top = '-2px';
		div.style.left = '0px';
		div.style['white-space'] = 'nowrap';
		div.style['text-align'] = 'center';
		div.style['line-height'] = '26px';
		div.style['font-size'] = '24px';
		div.style['font-family'] = 'xinwei';
		div.innerHTML = '搜索：' +
			'<input type="text" style="width:150px;"></input>' +
			'←' +
			'<select size="1" style="width:75px;height:21px;">' +
			'<option value="name">名称翻译</option>' +
			'<option value="name1">名称</option>' +
			'<option value="skill">技能翻译</option>' +
			'<option value="skill1">技能</option>' +
			'<option value="skill2">技能叙述</option>' +
			'</select>';
		var input = div.querySelector('input');
		input.onkeydown = function(e) {
			e.stopPropagation();
			if (e.keyCode == 13) {
				var value = this.value;
				var choice = div.querySelector('select').options[div.querySelector('select')
				.selectedIndex].value;
				if (value) {
					if (game.say1) game.say1('搜索完成');
					//if(dialog.currentcaptnode2) dialog.currentcaptnode2.classList.remove('thundertext');
					//if(dialog.currentcaptnode) dialog.currentcaptnode.classList.remove('thundertext');
					for (var i = 0; i < buttons.childNodes.length; i++) {
						buttons.childNodes[i].classList.add('nodisplay');
						var name = buttons.childNodes[i].link;
						var skills;
						if (lib.character[name] != undefined) {
							skills = lib.character[name][3];
						};
						if (choice == 'name1') {
							if (name.indexOf(value) != -1) {
								buttons.childNodes[i].classList.remove('nodisplay');
							};
						} else if (choice == 'skill') {
							if (skills != undefined && skills.length > 0) {
								for (var j = 0; j < skills.length; j++) {
									var skill = skills[j];
									if (get.translation(skill).indexOf(value) != -1) {
										buttons.childNodes[i].classList.remove('nodisplay');
									};
								};
							};
						} else if (choice == 'skill1') {
							if (skills != undefined && skills.length > 0) {
								for (var j = 0; j < skills.length; j++) {
									var skill = skills[j];
									if (skill.indexOf(value) != -1) {
										buttons.childNodes[i].classList.remove('nodisplay');
									};
								};
							};
						} else if (choice == 'skill2') {
							if (skills != undefined && skills.length > 0) {
								for (var j = 0; j < skills.length; j++) {
									var skill = skills[j];
									if (lib.translate[skill + '_info'] != undefined && lib.translate[
											skill + '_info'].indexOf(value) != -1) {
										buttons.childNodes[i].classList.remove('nodisplay');
									};
								};
							};
						} else {
							if (get.translation(name).indexOf(value) != -1) {
								buttons.childNodes[i].classList.remove('nodisplay');
							};
						};
					};
				} else {
					if (game.say1) game.say1('请先输入需要搜索武将的名字');
				};
			};
		};
		input.onmousedown = function(e) {
			e.stopPropagation();
		};
		if (lib.config['extension_武将卡牌搜索器_enable'] == true) {
			if (lib.config['extension_扩展ol_zyxj_search1'] != false) {
				if (window.诗笺_manual != undefined) {
					div.style.height = '58px';
					div.innerHTML += '<br><button>武将卡牌搜索器</button>';
					var button = div.querySelector('button');
					button.onclick = function() {
						window.诗笺_manual.show();
					};
				};
			};
		};
		switch_con.insertBefore(div, switch_con.firstChild);
		/*
		for(var i=0;i<buttons.childNodes.length;i++){
			var name=buttons.childNodes[i].link;
			if(name!=undefined&&name.indexOf('kzsg_')!=-1){
				buttons.childNodes[i].style.display='none';
			};
		};
		*/
		return dialog;
	}

	var app = {
		name: '手杀ui',
		each: function(obj, fn, node) {
			if (!obj) return node;
			if (typeof obj.length === 'number') {
				for (var i = 0; i < obj.length; i++) {
					if (fn.call(node, obj[i], i) === false) {
						break;
					}
				}
				return node;
			}
			for (var i in obj) {
				if (fn.call(node, obj[i], i) === false) {
					break;
				}
			}
			return node;
		},
		isFunction: function(fn) {
			return typeof fn === 'function';
		},
		event: {
			listens: {},
			on: function(name, listen, remove) {
				if (!this.listens[name]) {
					this.listens[name] = [];
				}
				this.listens[name].push({
					listen: listen,
					remove: remove,
				});
				return this;
			},
			off: function(name, listen) {
				return app.each(this.listens[name], function(item, index) {
					if (listen === item || listen === item.listen) {
						this.listens[name].splice(index, 1);
					}
				}, this);
			},
			emit: function(name) {
				var args = Array.from(arguments).slice(1);
				return app.each(this.listens[name], function(item) {
					item.listen.apply(null, args);
					item.remove && this.off(name, item);
				}, this);
			},
			once: function(name, listen) {
				return this.on(name, listen, true);
			},
		},
		create: {},
		listens: {},
		plugins: [],
		pluginsMap: {},
		path: {
			ext: function(path, ext) {
				ext = ext || app.name;
				return lib.assetURL + 'extension/' + ext + '/' + path;
			},
		},
		on: function(event, listen) {
			if (!app.listens[event]) {
				app.listens[event] = [];
			}
			app.listens[event].add(listen);
		},
		once: function(event, listen) {
			if (!app.listens[event]) {
				app.listens[event] = [];
			}
			app.listens[event].push({
				listen: listen,
				remove: true,
			});
		},
		off: function(event, listen) {
			var listens = app.listens[event] || [];
			var filters = listen ? listens.filter(function(item) {
				return item === listen || item.listen === listen;
			}) : listens.slice(0);
			filters.forEach(function(item) {
				listens.remove(item);
			});
		},
		emit: function(event) {
			var args = Array.from(arguments).slice(1);
			var listens = app.listens[event] || [];
			listens.forEach(function(item) {
				if (typeof item === 'function') {
					item.apply(null, args);
				} else if (typeof item.listen === 'function') {
					item.listen.apply(null, args);
					item.remove && listens.remove(item);
				}
			});
		},
		import: function(fn) {
			var obj = fn(lib, game, ui, get, ai, _status, app);
			if (obj) {
				if (obj.name) app.pluginsMap[obj.name] = obj;
				if (obj.precontent && (!obj.filter || obj.filter())) obj.precontent();
			}
			app.plugins.push(obj);
		},
		importPlugin: function(data, setText) {
			if (!window.JSZip) {
				var args = arguments;
				lib.init.js(lib.assetURL + 'game', 'jszip', function() {
					app.importPlugin.apply(app, args);
				});
				return;
			}
			setText = typeof setText === 'function' ? setText : function() {};
			var zip = new JSZip(data);
			var dirList = [],
				fileList = [];
			for (var i in zip.files) {
				if (/\/$/.test(i)) {
					dirList.push('extension/' + app.name + '/' + i);
				} else if (!/^extension\.(js|css)$/.test(i)) {
					fileList.push({
						id: i,
						path: 'extension/' + app.name + '/' + i.split('/').reverse().slice(1)
							.reverse().join('/'),
						name: i.split('/').pop(),
						target: zip.files[i],
					});
				}
			}

			var total = dirList.length + fileList.length;
			var finish = 0;
			var isNode = lib.node && lib.node.fs;

			var writeFile = function() {
				var file = fileList.shift();
				if (file) {
					setText('正在导入(' + (++finish) + '/' + total + ')...')
					game.writeFile(isNode ? file.target.asNodeBuffer() : file.target
						.asArrayBuffer(), file.path, file.name, writeFile);
				} else {
					alert('导入完成');
					setText('导入插件');
				}
			};
			var ensureDir = function() {
				if (dirList.length) {
					setText('正在导入(' + (++finish) + '/' + total + ')...')
					game.ensureDirectory(dirList.shift(), ensureDir);
				} else {
					writeFile();
				}
			};
			ensureDir();
		},
		loadPlugins: function(callback) {
			game.getFileList('extension/' + app.name, function(floders) {
				var total = floders.length;
				var current = 0;
				if (total === current) {
					callback();
					return;
				}
				var loaded = function() {
					if (++current === total) {
						callback();
					}
				};
				floders.forEach(function(dir) {
				if ( game.getExtensionConfig('无名补丁', 'enable') && lib.config.extension_无名补丁_xindimage == true ) {
					game.readFile('extension/' + app.name + '/' + dir + '/main.js',
					function(data) {
						var binarry = new Uint8Array(data);
						var blob = new Blob([binarry]);
						var reader = new FileReader();
						reader.readAsText(blob);
						reader.onload = function() {
							eval(reader.result);
							loaded();
						};
					},
					function(e) {
						console.info(e);
						loaded();
					});
					} else {
					game.readFile('extension/' + app.name + '/' + dir + '/main1.js',
					function(data) {
						var binarry = new Uint8Array(data);
						var blob = new Blob([binarry]);
						var reader = new FileReader();
						reader.readAsText(blob);
						reader.onload = function() {
							eval(reader.result);
							loaded();
						};
					},
					function(e) {
						console.info(e);
						loaded();
					});
					}
				});
			});
		},
		reWriteFunction: function(target, name, replace, str) {
			if (name && typeof name === 'object') {
				return app.each(name, function(item, index) {
					app.reWriteFunction(target, index, item[0], item[1]);
				}, target);
			}

			var plugins = app.pluginsMap;
			if ((typeof replace === 'string' || replace instanceof RegExp) &&
				(typeof str === 'string' || str instanceof RegExp)) {
				var funcStr = target[name].toString().replace(replace, str);
				eval('target.' + name + ' = ' + funcStr);
			} else {
				var func = target[name];
				target[name] = function() {
					var result, cancel;
					var args = Array.from(arguments);
					var args2 = Array.from(arguments);
					if (typeof replace === 'function') cancel = replace.apply(this, [args].concat(
						args));
					if (typeof func === 'function' && !cancel) result = func.apply(this, args);
					if (typeof str === 'function') str.apply(this, [result].concat(args2));
					return cancel || result;
				};
			}
			return target[name];
		},
		reWriteFunctionX: function(target, name, replace, str) {
			if (name && typeof name === 'object') {
				return app.each(name, function(item, index) {
					app.reWriteFunction(target, index, item);
				}, target);
			}
			if (Array.isArray(replace)) {
				var item1 = replace[0];
				var item2 = replace[1];
				var item3 = replace[2];
				if (item3 === 'append') {
					item2 = item1 + item2;
				} else if (item3 === 'insert') {
					item2 = item2 + item1;
				}
				if (typeof item1 === 'string') {
					item1 = RegExp(item1);
				}
				if (item1 instanceof RegExp && typeof item2 === 'string') {
					var funcStr = target[name].toString().replace(item1, item2);
					eval('target.' + name + ' = ' + funcStr);
				} else {
					var func = target[name];
					target[name] = function() {
						var arg1 = Array.from(arguments);
						var arg2 = Array.from(arguments);
						var result;
						if (app.isFunction(item1)) result = item1.apply(this, [arg1].concat(arg1));
						if (app.isFunction(func) && !result) result = func.apply(this, arg1);
						if (app.isFunction(item2)) item2.apply(this, [result].concat(arg2));
						return result;
					};
				}
			} else {
				console.info(arguments);
			}
			return target[name];
		},
		
		waitAllFunction: function(fnList, callback) {
			var list = fnList.slice(0);
			var runNext = function() {
				var item = list.shift();
				if (typeof item === 'function') {
					item(runNext);
				} else if (list.length === 0) {
					callback();
				} else {
					runNext();
				}
			};
			runNext();
		},
		
		element: {
			runNext: {
				setTip: function(tip) {
					console.info(tip);
				},
			},
		},
		
		get: {
			playerSkills: function(node, arg1, arg2) {
				var skills = node.getSkills(arg1, arg2).slice(0);
				skills.addArray(Object.keys(node.forbiddenSkills));
				skills.addArray(Object.keys(node.disabledSkills).filter(function(k) {
					return !node.hiddenSkills.contains(k) &&
						node.disabledSkills[k].length &&
						node.disabledSkills[k][0] === k + '_awake';
				}));
				return skills;
			},
			skillInfo: function(skill, node) {
				var obj = {};
				obj.id = skill;
				if (lib.translate[skill + '_ab']) {
					obj.name = lib.translate[skill + '_ab'];
					obj.nameSimple = lib.translate[skill + '_ab'];
				} else if (lib.translate[skill]) {
					obj.name = lib.translate[skill];
					obj.nameSimple = lib.translate[skill].slice(0, 2);
				}
				obj.info = lib.skill[skill];
				if (node) {
					if (node.forbiddenSkills[skill]) obj.forbidden = true;
					if (node.disabledSkills[skill]) obj.disabled = true;
					if (obj.info.temp || !node.skills.contains(skill)) obj.temp = true;
					if (obj.info.frequent || obj.info.subfrequent) obj.frequent = true;
					if (obj.info.clickable && node.isIn() && node.isUnderControl(true)) obj.clickable =
						true;
					if (obj.info.nobracket) obj.nobracket = true;
				}
				obj.translation = get.skillInfoTranslation(skill);
				obj.translationSource = lib.translate[skill + '_info'];
				obj.translationAppend = lib.translate[skill + '_append'];
				if (obj.info && obj.info.enable) {
					obj.type = 'enable';
				} else {
					obj.type = 'trigger';
				}
				return obj;
			},
		},
		
		listen: function(node, func) {
			node.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func);
			return function() {
				node.removeEventLisnter(lib.config.touchscreen ? 'touchend' : 'click', func);
			};
		},
		
		mockTouch: function(node) {
			var event = new Event(lib.config.touchscreen ? 'touchend' : 'click');
			node.dispatchEvent(event);
			return node;
		},
		
		nextTick: function(func, time) {
			var funcs;
			if (Array.isArray(func)) funcs = func;
			else funcs = [func];
			var next = function() {
				var item = funcs.shift();
				if (item) {
					setTimeout(function() {
						item();
						next();
					}, time || 0);
				}
			};
			next();
		},
	};

	return {
		name: app.name,
		content: function(config, pack) {
		
			//------------------------//
			//AI进度条
			if (get.mode() != 'connect' && lib.config.extension_手杀ui_JDTS) {
				lib.onover.push(function(bool) {
					if (document.getElementById("jindutiao")) {
						document.getElementById("jindutiao").remove()
					}
				});
				
				lib.skill._jindutiaoO = {
					trigger: {
						player: ['phaseBegin','useCardAfter']
					},
					filter: function(event, player) {
						return player != game.me && _status.currentPhase == player;
					},
					forced: true,
					charlotte: true,
					content: function() {
						if (document.getElementById("jindutiao")) {
							document.getElementById("jindutiao").remove()
						}
					
					
					
						if (lib.config['extension_十周年UI_newDecadeStyle']== "on") {
							//----------十周年样式--------//
							var boxContent = document.createElement('div')
							boxContent.setAttribute('id', 'jindutiao')
							boxContent.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) *8/162);width: var(--w);height: var(--h);left:1.5px;bottom:-8.2px;"

							var boxTime = document.createElement('div')
							boxTime.data = 120
							boxTime.style.cssText =
								"z-index:88;width: 115px;height: 3.3px;margin:1px;background-color: #F3C43A;position: absolute;top: 0px;border-radius: 3px;"
							boxContent.appendChild(boxTime)

							var imgBg = document.createElement('img')
							imgBg.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SZNSC/timeX.png'
							imgBg.style.cssText =
								"position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) * 8/162);width: var(--w);height: var(--h);top: 0;"
							boxContent.appendChild(imgBg)
							//--------------------//
						
						} else {
						
							//--------手杀样式-------------//
							var boxContent = document.createElement('div')
							boxContent.setAttribute('id', 'jindutiao')
							boxContent.style.cssText =
									"display:block;position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) *4/145);width: var(--w);height: var(--h);left:3.5px;bottom:-6.2px;"

							var boxTime = document.createElement('div')
							boxTime.data = 125
							boxTime.style.cssText =
								"z-index:92;--w: 33px;--h: calc(var(--w) * 4/120);width: var(--w);height: var(--h);margin:1px;background-color: #dd9900;position: absolute;top: 0px;"
							boxContent.appendChild(boxTime)

							var imgBg = document.createElement('img')
							imgBg.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/time.png'
							imgBg.style.cssText =
								"position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) * 4/145);width: var(--w);height: var(--h);top: 0;"
							boxContent.appendChild(imgBg)

						//-------------------------//
						
						}
					
					
						player.appendChild(boxContent)
						window.timer = setInterval(() => {
							boxTime.data--
							boxTime.style.width = boxTime.data + 'px'
							if (boxTime.data == 0) {
								clearInterval(window.timer);
								boxContent.remove()
							}
						}, 150); //进度条时间
					},
					
					group: ['_jindutiaoO_jieshuA'],
					subSkill: {
						//进度条消失
						jieshuA: {
							trigger: {
								player: ['phaseEnd','dieBegin'],
							},
							filter: function(event, player) {
								return player != game.me && _status.currentPhase == player;
							},
							forced: true,
							charlotte: true,
							content: function() {
								if (window.timer) {
									clearInterval(window.timer);
								}
								if (document.getElementById("jindutiao")) {
									document.getElementById("jindutiao").remove()
								}
							},
						},
					},
				}
					
				//------------回合外进度条----------//
				lib.skill._jindutiaoA = {
					trigger:{
						player:['useCardBegin','respondBegin']
						// player:["shaBegin","shanBegin","taoBegin","jiuBegin","wuxieBegin","jinchanBegin","caochuanBegin","respondBegin","useCardBegin"]
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return _status.currentPhase != player&&player!=game.me;
					},
					content: function() {
						if (window.timer) {
							clearInterval(window.timer);
						}
						if (document.getElementById("jindutiaoX")) {
							document.getElementById("jindutiaoX").remove()
						}
							if (lib.config['extension_十周年UI_newDecadeStyle'] == "on"){
								//-----------十周年样式------------//
								var boxContent = document.createElement('div')
								boxContent.setAttribute('id', 'jindutiaoX')
								boxContent.style.cssText =
									"display:block;position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) *8/162);width: var(--w);height: var(--h);left:1.5px;bottom:-8.2px;"

								var boxTime = document.createElement('div')
								boxTime.data = 120
								boxTime.style.cssText =
									"z-index:92;width: 115px;height: 3.3px;margin:1px;background-color: #F3C43A;position: absolute;top: 0px;border-radius: 3px;"
								boxContent.appendChild(boxTime)

								var imgBg = document.createElement('img')
								imgBg.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SZNSC/timeX.png'
								imgBg.style.cssText =
									"position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) * 8/162);width: var(--w);height: var(--h);top: 0;"
								boxContent.appendChild(imgBg)
								//-----------------------------//

							} else {

								//-------------手杀样式----------//
								var boxContent = document.createElement('div')
								boxContent.setAttribute('id', 'jindutiaoX')
								boxContent.style.cssText =
									"display:block;position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) *4/145);width: var(--w);height: var(--h);left:3.5px;bottom:-6.2px;"

								var boxTime = document.createElement('div')
								boxTime.data = 125
								boxTime.style.cssText =
									"z-index:92;--w: 33px;--h: calc(var(--w) * 4/120);width: var(--w);height: var(--h);margin:1px;background-color: #dd9900;position: absolute;top: 0px;"
								boxContent.appendChild(boxTime)

								var imgBg = document.createElement('img')
								imgBg.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/time.png'
								imgBg.style.cssText =
									"position:absolute;z-index:91;--w: 122px;--h: calc(var(--w) * 4/145);width: var(--w);height: var(--h);top: 0;"
								boxContent.appendChild(imgBg)
								//---------------------------//	
							}
						
						
						player.appendChild(boxContent)

						window.timer = setInterval(() => {
							boxTime.data--
							boxTime.style.width = boxTime.data + 'px'
							if (boxTime.data == 0) {
								clearInterval(window.timer);
								boxContent.remove()
								//点击托管ui.click.auto();
							}
						}, 100); //进度条时间

					},
					group: ['_jindutiaoA_jieshuB'],
					subSkill: {
						jieshuB: {
							trigger: {
								player:['useCardEnd','respondEnd','dieBegin']
							},
							forced: true,
							charlotte: true,
							filter: function (event, player) {
								//var cardname=event.cards[0].name
								return player!=game.me&&_status.currentPhase != player;
							},
							content: function() {
								if (window.timer) {
									clearInterval(window.timer);
								}
								if (document.getElementById("jindutiaoX")) {
									document.getElementById("jindutiaoX").remove()
								}
							},
						},
					},
				}
				//-------------------//
			}

			//-------出牌中提示---------//
			lib.skill._chupaiA = {
				trigger: {
					player:'phaseUseBegin'
				},
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
				},
				content: function () {
					var a = player.getElementsByClassName("playertip")
					if (a.length <= 0) {
						var tipAB = document.createElement("img");
							tipAB.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tip.png';
							tipAB.classList.add("playertip")
							tipAB.style.cssText = 
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";
							player.appendChild(tipAB)
						}
					}
				}

				lib.skill._chupaiB = {
					trigger: {
						player:['phaseUseEnd','dieBegin'],
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var b = event.player.getElementsByClassName("playertip")
						return b.length > 0&&player!=game.me;
					},
					content: function () {
						var b = trigger.player.getElementsByClassName("playertip")
						b[0].parentNode.removeChild(b[0])	
					}
				}

				//----弃牌提示-----//
				lib.skill._chupaiC = {
					trigger: {
						player:'phaseDiscardBegin'
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return player!=game.me && lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var a = player.getElementsByClassName("playertipQP")
						if (a.length <= 0) {
							var tipCD = document.createElement("img");
							tipCD.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tipQP.png';
							tipCD.classList.add("playertipQP")
							tipCD.style.cssText = 
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";
							player.appendChild(tipCD)	
						}
					}
				}

				lib.skill._chupaiD = {
					trigger: {
						player:['phaseDiscardEnd','dieBegin'],
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var c = event.player.getElementsByClassName("playertipQP")
						return c.length > 0&&player!=game.me;
					},
					content: function () {
						var c = trigger.player.getElementsByClassName("playertipQP")
						c[0].parentNode.removeChild(c[0])	
					}
				}
				//-----------------//

				//-----闪思考----//
				lib.skill._chupaiE = {
					trigger:{
						player:['useCardBegin','respondBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						// if(!player.countCards('h','shan')) return false;
						return event.card.name=='shan'&&_status.currentPhase != player&&player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var d = player.getElementsByClassName("playertipshan")
						if (d.length <= 0) {
						var tipEF = document.createElement("img");
							tipEF.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tipshan.png';
							tipEF.classList.add("playertipshan")
							tipEF.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";	
							player.appendChild(tipEF)
						}
					}
				}

				lib.skill._chupaiF = {
					trigger: {
						player:['useCardEnd','respondEnd','dieBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var e = event.player.getElementsByClassName("playertipshan")
						return e.length > 0&&player!=game.me&&_status.currentPhase != player&&event.card.name=='shan';;
					},
					content: function () {
						var e = trigger.player.getElementsByClassName("playertipshan")
						e[0].parentNode.removeChild(e[0])	
					}
				}
				//--------------//

				//-----杀思考----//
				lib.skill._chupaiG = {
					trigger:{
						player:['useCardBegin','respondBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						// if(!player.countCards('h','sha')) return false;
						return event.card.name=='sha'&&_status.currentPhase != player&&player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var e = player.getElementsByClassName("playertipsha")
						if (e.length <= 0) {
		  
			
		  
						var tipGH = document.createElement("img");
							tipGH.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tipsha.png';
							tipGH.classList.add("playertipsha")
							tipGH.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";
							player.appendChild(tipGH)	
						}
					}
				}

				lib.skill._chupaiH = {
					trigger: {
						player:['useCardEnd','respondEnd','dieBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var f = event.player.getElementsByClassName("playertipsha")
						return f.length > 0&&player!=game.me&&_status.currentPhase != player&&event.card.name=='sha';
					},
					content: function () {
						var f = trigger.player.getElementsByClassName("playertipsha")
						f[0].parentNode.removeChild(f[0])
					}
				}
				//--------------//
	
				//-----桃思考----//
				lib.skill._chupaiM = {
					trigger:{
						player:['useCardBegin','respondBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						// if(!player.countCards('h','sha')) return false;
						return event.card.name=='tao'&&_status.currentPhase != player&&player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var k = player.getElementsByClassName("playertiptao")
						if (k.length <= 0) {
							var tipMN = document.createElement("img");
							tipMN.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tiptao.png';
							tipMN.classList.add("playertiptao")
							tipMN.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";
							player.appendChild(tipMN)
						}
					}
				}

				lib.skill._chupaiN = {
					trigger: {
						player:['useCardEnd','respondEnd','dieBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var l = event.player.getElementsByClassName("playertiptao")
						return l.length > 0&&player!=game.me&&_status.currentPhase != player&&event.card.name=='tao';
					},
					content: function () {
						var l = trigger.player.getElementsByClassName("playertiptao")
						l[0].parentNode.removeChild(l[0])	
					}
				}
				//--------------//

				//-----酒思考----//
				lib.skill._chupaiO = {
					trigger:{
						player:['useCardBegin','respondBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						// if(!player.countCards('h','sha')) return false;
						return event.card.name=='jiu'&&_status.currentPhase != player&&player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var n = player.getElementsByClassName("playertipjiu")
						if (n.length <= 0) {
							var tipOP = document.createElement("img");
							tipOP.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tipjiu.png';
							tipOP.classList.add("playertipjiu")
							tipOP.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";
							player.appendChild(tipOP)
						}
					}
				}

				/*lib.skill._chupaiP = {
					trigger: {
						player:['useCardEnd','respondEnd','dieBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var m = event.player.getElementsByClassName("playertipjiu")
						return m.length > 0&&player!=game.me&&_status.currentPhase != player&&event.card.name=='jiu';
//不明原因name报错
					},
					content: function () {
						var m = trigger.player.getElementsByClassName("playertipjiu")
						m[0].parentNode.removeChild(m[0])	
					}
				}*/
				//--------------//

				//----无懈思考----//
				lib.skill._chupaiI = {
					trigger:{
						player:['useCardBegin','respondBegin','phaseJudge']
					},
					forced: true,
					charlotte: true,
					filter: function(event, player) {
						if (event.card.storage && event.card.storage.nowuxie) return false;
						var card = event.card;
						if (event.name == 'phaseJudge' && card.viewAs) card = {
							name: card.viewAs
						};
						var info = get.info(card);
						if (info.wuxieable === false) return false;
						return event.card.name=='wuxie'&&_status.currentPhase != player&&player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var g = player.getElementsByClassName("playertipwuxie")
						if (g.length <= 0) {
							var tipIJ = document.createElement("img");
							tipIJ.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tipwuxie.png';
							tipIJ.classList.add("playertipwuxie")
							tipIJ.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";	
							player.appendChild(tipIJ)
						}
					}
				}

				lib.skill._chupaiJ = {
					trigger: {
						player:['useCardEnd','respondEnd','dieBegin','phaseEnd']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var h = event.player.getElementsByClassName("playertipwuxie")
						return h.length > 0&&player!=game.me&&_status.currentPhase != player&&event.card.name=='wuxie';
					},
					content: function () {
						var h = trigger.player.getElementsByClassName("playertipwuxie")
						h[0].parentNode.removeChild(h[0])
					}
				}
	
				//------判断，摸牌提示---------//
				lib.skill._chupaiK = {
					trigger: {
						player:['phaseJudgeBegin','phaseDrawBegin']
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return player!=game.me &&lib.config['extension_十周年UI_newDecadeStyle'] != "on";
					},
					content: function () {
						var l = player.getElementsByClassName("playertipplay")
						if (l.length <= 0) {
							var tipKL = document.createElement("img");
							tipKL.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SSSC/tipplay.png';
							tipKL.classList.add("playertipplay")
							tipKL.style.cssText =
								"display:block;position:absolute;z-index:91;--w: 133px;--h: calc(var(--w) * 50/431);width: var(--w);height: var(--h);bottom:-22px;";	
							player.appendChild(tipKL)
						}
					}
				}
		
				lib.skill._chupaiL = {
					trigger: {
						player:['phaseJudgeEnd','phaseDrawEnd','phaseEnd','dieBegin'],
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						var m = event.player.getElementsByClassName("playertipplay")
						return m.length > 0&&player!=game.me;
					},
					content: function () {
						var m = trigger.player.getElementsByClassName("playertipplay")
						m[0].parentNode.removeChild(m[0])	
					}
				}
				//-----------------//

				//---------------------------//
				//狗托播报
				if (config.GTBB) {
					var txcsanm = {}
					var gddf = function() {
						var player = "玩家";
						var my = lib.config.connect_nickname;
						var suiji = ["氪金抽66", "卡宝真可爱", "蒸蒸日上", "√卡视我如父", "麒麟弓免疫枸杞", "坏可宣（老坏批）", "六千大败而归",
						"开局酒古锭", "遇事不决刷个乐", "见面两刀喜相逢", "改名出66", "时代的六万五", "韩旭", "狗卡司马", "ogx",
						"狗卡不如无名杀", "王八万", "一拳兀突骨", "开局送神将", "丈八二桃", "装甲车车", "等我喝口酒", "Samuri", "马",
						"Log-Frunki", "aoe银钱豹", "没有丈八就托管", "无中yyds", "给咸鱼鸽鸽打call", "小零二哟～", "长歌最帅了",
						"大猫有侠者之风", "布灵布灵❤️", "我爱～摸鱼🐠～", "小寻寻真棒", "呲牙哥超爱笑", "是俺杀哒", "阿七阿七",
						"祖安·灰晖是龙王", "吃颗桃桃好遗计", "好可宣✓良民", "藏海表锅好", "金乎？木乎？水乎！！", "无法也无天", "西风不识相",
						"神秘喵酱", "星城在干嘛？", "子鱼今天摸鱼了吗？", "阳光苞里有阳光", "诗笺的小裙裙", "轮回中的消逝", "乱踢jb的云野",
						"小一是不是...是不是...", "美羊羊爱瑟瑟", "化梦的星辰", "杰哥带你登dua郎", "世中君子人", "叹年华未央", "短咕咕",
						"洛天依？！", "黄老板是好人～", "来点瑟瑟文和", "鲨鱼配辣椒", "萝卜～好萝卜", "废城君", "E佬细节鬼才",
						"感到棘手要怀念谁？", "半价小薯片", "JK欧拉欧拉欧拉", "新年快乐","周子鱼yu","遗计两个桃","诗笺","废城","狗卡你妈没了","我最擅长精测和白嫖","白金之星","不吃萝卜吃桃桃","子琪","吾名潘凤","黄金之心","海贼王","米线","暴走p","绝望の滋味","萝卜吃米洛","badcen","卡慕sama","大橙子","天使的回忆","群猫娘","红叔","黑猫大少爷","我的回合，抽卡！","让我康康！","粽子羊","我们的游戏正在蒸蒸日上","老萌Loun","对勾对勾w","逍遥散人","狗","一介品神","琅琊少年诸葛氪","一只快乐盖子","我是嘉然小姐的狗","姐姐砍我","古神","JOJO","派蒙","派魔","空","荧","钟离","凯尔希","浊心斯卡蒂","白笙","神奇陆夫人","您","废物","品神三花火攻未中","将军走此小道","华雄上也行","麦乐鸡块侠","麦乐鸡块贼","大碗拿铁","大碗咖啡","猫","chara","只有红猹可以吗","Frisk","中二摇滚羊","百里守约","杀批","原批","粥批","996","你热爱的就是你的手牌","看满离","万能导入发我，不小心删了","吃白饭的","木美人","山山峰峰","萤火虫の怨","李特斯","带刀侍卫","来世还做方块人","凋零斯拉","血舞crazy","心竹","花小烙","王境泽","真香真香","农批","铸时匠","哈利·波特","伏地魔","杨杨和夏季","叔叔的马什么时候死啊","蒙古上单","初音未来","你就是初音未来吧","啤酒烧烤","屁股肉","黑白女皇","戏の子","『』小醉°","逆态度","周杰伦赛高！","我永远喜欢森蚺！","断发表降心","无名杀真的太棒了","豹子头","孙悟空","孙悟空的师傅","三足金乌","陆压","段佳泽","喷水龙王","米忽悠真会坑钱","鹰角的利刃","月圆小魔女","卡夫卡","大番茄","老番茄","是のの不是的的","被玩坏了","番茄炒鸡蛋","你是什么垃圾","散人牌相声","千秋","君莫笑","干将","莫邪","千机伞","逐烟霞","可可爱爱大宝","盛情难却","三国杀劣强第一！","EDG牛逼！","卢本伟牛逼","EK鲁比","生日快乐是个呆瓜","红蓝酱","洋葱","你作业写完了吗","望影の方舟six","Igallta","重生","NOYM","早晚杀了rr","不是人","全场唯一预言家","过年了给冲儿来刀狠的","狗托","七七","小丑僵尸","舞王僵尸","温柔叙","黑皇帝","cty'max","不记仇的钟会","品神今天走小道了吗","嘉然今晚吃什么","关注嘉然顿顿解馋","对话，余华","第七天","活着","大伊万","法棍","天山童姥","吉利服","黑椒墨鱼","苏酥_SUSU_","一生一世二百五","包子入侵",
						"北川真木","野蛮qwq","超级大煎饼","幸运的一一","晋元帝","衫脚福闻","铭骑","鬼刃","利姆露","对立","光","姜米條","村头鱼","海贼王路飞","卡普","莫娜","元","竹林七贤","污妖王","千面千面","春の纪光","策划的马","元芳你怎么看？","正义人","123456789","小猫小狗","迪奥娜","大败而归","吃个桃桃好凉凉","春蚕","贾大爷","悍跳预言家","比利比利","你/我是什么垃圾？","键盘手","那个男人","孙家天下孙家兵","成就54320","张角：杀我","我玩了9年不比你强？","你们的武将怎么都那么阴间啊","狗卡的阴兵","我是拖","献祭十年寿命求中神郭"
					].randomGet();
					var name = [suiji, my].randomGet();
					var v = ["通过", "使用", "开启"].randomGet();
					var story = ["周年", "五一", "踏青", "牛年", "开黑", "冬至", "春分", "鼠年", "盛典", "魏魂", "群魂", "蜀魂",
						"吴魂", "猪年", "圣诞", "国庆", "狗年", "金秋", "奇珍", "元旦", "小雪", "冬日", "招募", "梦之回廊",
						"虎年", "新春", "七夕", "大雪", "端午", "武将", "中秋", "庆典"
					].randomGet();
					var box = ["盒子", "宝盒", "礼包", "福袋", "礼盒", "庆典", "盛典"].randomGet();
					var a = "获得了";
					//皮肤
					var pifu = ["界钟会×1", "王朗×1", "马钧×1", "司马昭×1", "司马师×1", "王平×1", "诸葛瞻×1", "张星彩×1",
						"董允×1", "关索×1", "骆统×1", "周处*1", "界步练师*1", "界朱然*1", "贺齐*1", "苏飞*1", "公孙康×1",
						"杨彪×1", "刘璋×1", "张仲景×1", "司马徽×1", "曹婴×1", "徐荣×1", "史诗宝珠*66", "史诗宝珠*33",
						"麒麟生角·魏延*1", "史诗宝珠*10", "刘焉×1", "孙寒华×1", "戏志才×1", "界曹真×1", "曹婴×1", "王粲×1",
						"界于禁×1", "郝昭×1", "界黄忠×1", "鲍三娘×1", "周群×1", "赵襄×1", "马云禄×1", "孙皓×1", "留赞×1",
						"吴景×1", "界徐盛×1", "许攸×1", "杜预×1", "界李儒×1", "张让×1", "麹义×1", "司马徽×1", "界左慈×1",
						"鲍三娘×1", "界徐盛×1", "南华老仙×1", "韩旭の大饼*100", "神郭嘉×1", "吴景×1", "周处×1", "杜预×1",
						"司马师×1", "羊微瑜×1", "神曹操×1"
					].randomGet();
				
					//-------带品质-----//			
					/* //武将
					var wujiang = ["限定*谋定天下·陆逊*1（动+静）", "限定*谋定天下·周瑜*1（动+静）", "限定*谋定天下·卧龙诸葛*1（动+静）", "限定*谋定天下·司马懿*1（动+静）", "限定*谋定天下·郭嘉*1（动+静）", "限定*谋定天下·贾诩*1（动+静）", "限定*谋定天下·荀彧*1（动+静）", "传说*龙困于渊·刘协（动+静）*1", "限定*花好月圆·貂蝉*1（动+静）", "限定*花好月圆·甄姬*1（动+静）","限定*花好月圆·马云騄*1（动+静）", "限定*花好月圆·黄月英*1（动+静）", "限定*花好月圆·sp蔡文姬*1（动+静）", "限定*花好月圆·sp孙尚香*1（动+静）", "限定*花好月圆·大乔*1（动+静）", "限定*花好月圆·小乔*1（动+静）",  "传说*星花柔矛·张星彩*1（动+静）",
						"史诗*呼啸生风·许褚*1（动+静）", "立冬牛年*牛年立冬·司马懿*1（动+静）", "立冬牛年*牛年立冬·张春华*1（动+静）", "史诗*鹰视狼顾·司马懿*1（动+静）", "史诗*洛水神韵·甄姬*1（动+静）",
						"史诗*登锋陷阵·张辽*1（动+静）", "史诗*十胜十败·郭嘉*1（动+静）", "端午史诗*猪年端午·曹丕*1（动+静）", "清明牛年*牛年清明·甄姬*1（动+静）", "清明牛年*牛年清明·曹丕*1（动+静）", "史诗*背水一战·张郃*1（动+静）",
						"史诗*神兵天降·邓艾*1（动+静）", "史诗*独来固志·王基*1（动+静）", "圣诞史诗*猪年圣诞·刘备*1（动+静）", "圣诞史诗*猪年圣诞·sp孙尚香*1（动+静）", "史诗*啸风从龙·关羽*1（动+静）",
						"史诗*西凉雄狮·马超*1（动+静）", "史诗*鏖战赤壁·黄盖*1（动+静）", "史诗*星流霆击·孙尚香*1（动+静）", "圣诞史诗*猪年圣诞·陆逊*1（动+静）",
						"七夕鼠年*鼠年七夕·貂蝉*1（动+静）", "七夕鼠年*鼠年七夕·吕布*1（动+静）", "史诗*迅雷风烈·张角*1（动+静）", "史诗*一往无前·袁绍*1（动+静）", "史诗*盛气凌人·许攸*1（动+静）",
						"清明史诗*玄天通冥·神曹操*1（动+静）", "史诗*魂牵梦绕·灵雎*1（动+静）", "史诗*超脱于世·庞德公*1（动+静）", "清明史诗*孟章诛邪·神诸葛亮*1（动+静）", "清明史诗*监兵噬魅·神吕布*1（动+静）", "清明史诗*陵光引灵·神周瑜*1（动+静）",
						"史诗*雄踞益州·刘焉*1（动+静）", "春节史诗*鼠年春节·兀突骨*1（动+静）", "端午牛年*牛年端午·孙鲁班*1（动+静）", "史诗*灵魂歌王·留赞*1（动+静）",
						"史诗*花容月貌·孙茹*1（动+静）", "春节猪年*猪年春节·孙鲁育*1（动+静）", "史诗*长沙桓王·孙笨*1（动+静）", "史诗*如花似朵·小乔*1（动+静）",
						"史诗*嫣然一笑·鲍三娘*1", "史诗*锐不可当·张翼*1（动+静）", "中秋史诗*鼠年中秋·关索*1（动+静）", "史诗*花海舞枪·马云禄*1（动+静）",
						"史诗*木牛流马·黄月英*1（动+静）", "史诗*锋芒毕露·曹婴*1（动+静）", "史诗*长坂败备·曹纯*1（动+静）", "史诗*龙袭星落·王朗*1（动+静）",
						"史诗*举棋若定·戏志才*1（动+静）", "史诗*泰山捧日·程昱*1（动+静）", "冬至鼠年*鼠年冬至·王元姬*1(动+静)",
						"七夕史诗*牛年七夕·步练师*1（动+静）", "史诗*万人辟易·神甘宁*1", "史诗*巾帼花舞·马云禄*1（动+静）", "银币*66666", "将魂*66666",
						"史诗*琪花瑶草·徐氏*1（动+静）", "史诗*肝胆相照·星甘宁*1（动+静）",
						"天牢令*100" ].randomGet();
					*/		
					//--------------//			
					
					//武将
					var wujiang = ["谋定天下·陆逊*1（动+静）", "龙困于渊·刘协（动+静）*1", "星花柔矛·张星彩*1（动+静）",
						"呼啸生风·许褚*1（动+静）", "牛年立冬·司马懿*1（动+静）", "鹰视狼顾·司马懿*1（动+静）", "洛水神韵·甄姬*1（动+静）",
						"登锋陷阵·张辽*1（动+静）", "十胜十败·郭嘉*1（动+静）", "猪年端午·曹丕*1（动+静）", "背水一战·张郃*1（动+静）",
						"神兵天降·邓艾*1（动+静）", "独来固志·王基*1（动+静）", "猪年圣诞·刘备*1（动+静）", "哮风从龙·关羽*1（动+静）",
						"西凉雄狮·马超*1（动+静）", "鏖战赤壁·黄盖*1（动+静）", "星流霆击·孙尚香*1（动+静）", "猪年圣诞·陆逊*1（动+静）",
						"鼠年七夕·貂蝉*1（动+静）", "迅雷风烈·张角*1（动+静）", "一往无前·袁绍*1（动+静）", "盛气凌人·许攸*1（动+静）",
						"玄冥天通·神曹操*1（动+静）", "魂牵梦绕·灵雎*1（动+静）", "肝胆相照·⭐甘宁*1（动+静）", "超脱于世·庞德公*1（动+静）",
						"雄踞益州·刘焉*1（动+静）", "鼠年春节·兀突骨*1（动+静）", "牛年端午·孙鲁班*1（动+静）", "灵魂歌王·留赞*1（动+静）",
						"花容月貌·孙茹*1（动+静）", "猪年春节·孙鲁育*1（动+静）", "长沙桓王·孙笨*1（动+静）", "如花似朵·小乔*1（动+静）",
						"嫣然一笑·鲍三娘*1", "锐不可当·张翼*1（动+静）", "鼠年中秋·关索*1（动+静）", "花海舞枪·马云禄*1（动+静）",
						"木牛流马·黄月英*1（动+静）", "锋芒毕露·曹婴*1（动+静）", "长坂败备·曹纯*1（动+静）", "龙袭星落·王朗*1（动+静）",
						"举棋若定·戏志才*1（动+静）", "泰山捧日·程昱*1（动+静）", "冬日·王元姬（动态+静态）*1",
						"牛年七夕·步练师动态包*1（动+静）", "神甘宁×1", "巾帼花舞·马云禄*1（动+静）", "银币*66666", "将魂*66666",
						"琪花瑶草·徐氏*1（动+静）", "肝胆相照·星甘宁*1（动+静）", "星流霆击·孙尚香（动+静）*1", "锋芒毕露·曹婴*1（动+静）"
					].randomGet();
					//更改对应播报颜色
					var gold = ['<font color="#56e4fa">' + pifu + '</font>', '<font color="#f3c20f">' + wujiang + '</font>'
					].randomGet();
					var d = [",大家快恭喜TA吧！", ",大家快恭喜TA吧。无名杀是一款非盈利游戏(づ ●─● )づ", ",祝你新的一年天天开心，万事如意" ].randomGet();
					txcsanm.div2.innerHTML =
						'<marquee direction="left" behavior="scroll" scrollamount=10" loop="1" width="100%" height="50" align="absmiddle" >' +
						'<font  face="FZLBJW">' + player + '<font color="#efe8dc">' + '<b>' + name +
						'</b>' + '</font>' + v + '<font color="#22c622">' + '<b>' + story + box +
						'</b>' + '</font>' + a + '<b>' + gold + '</b>' + d + '</font>' + '</marquee>';
					};
					var id = setInterval(function() {
						if (!txcsanm.div.parentNode && ui.window) {
							ui.window.appendChild(txcsanm.div);
							clearInterval(id);
							gddf();
							setInterval(gddf, 20000);
						}
					}, 5000);
					txcsanm.div = ui.create.div('');
					txcsanm.div2 = ui.create.div('', txcsanm.div);
					txcsanm.div.style.cssText =
						"pointer-events:none;width:100%;height:25px;font-size:23px;z-index:6;";
					txcsanm.div2.style.cssText =
						"pointer-events:none;background:rgba(0,0,0,0.5);width:100%;height:27px;";
				}

				//阶段提示
				if (config.JDTS) {
					//---------------------------------//
					//等待响应 
					lib.skill._jd_ddxyA = {
						trigger: {
							player: ['chooseToRespondBegin'],
						},
						direct: true,
						filter: function(event, player) {
							return player == game.me && _status.auto == false;
						},
						content: function() {
							if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
								game.as_showImage('extension/手杀ui/lbtn/images/SSSC/ddxy.jpg', [3, 58, 7, 6], true)
							} else {
								game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/ddxy.png', [3, 65, 12, 6], true)
							}
						},
					};

					//成为杀的目标开始
					lib.skill._jd_ddxyB = {
						trigger: {
							target: 'shaBegin',
						},
						filter: function(event, player) {
							return game.me == event.target;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
								game.as_showImage('extension/手杀ui/lbtn/images/SSSC/ddxy.jpg', [3, 58, 7, 6], true)
							} else {
								game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/ddxy.png', [3, 65, 12, 6], true)
							}
						},
					};

					lib.skill._jd_ddxyC = {
						trigger: {
							player: ['useCardToBegin', 'phaseJudge']
						},
						filter: function(event, player) {
							if (event.card.storage && event.card.storage.nowuxie) return false;
							var card = event.card;
							if (event.name == 'phaseJudge' && card.viewAs) card = {
								name: card.viewAs
							};
							var info = get.info(card);
							if (info.wuxieable === false) return false;
							if (event.name != 'phaseJudge') {
								if (event.getParent().nowuxie) return false;
								if (!event.target) {
									if (info.wuxieable) return true;
									return false;
								}
								if (event.player.hasSkillTag('playernowuxie', false, event.card))
								return false;
								if (get.type(event.card) != 'trick' && !info.wuxieable) return false;
							}
							return player == game.me && _status.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
								game.as_showImage('extension/手杀ui/lbtn/images/SSSC/ddxy.jpg', [3, 58, 7, 6], true)
							} else {
								game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/ddxy.png', [3, 65, 12, 6], true)
							}
						},
					};

					//使用或打出闪后
					lib.skill._jd_shiyongshanD = {
						forced: true,
						charlotte: true,
						trigger: {
							player: ["useCard", "respondAfter"],
						},
						filter: function(event, player) {
							return player == game.me && event.card.name == 'shan';
						},
						content: function() {
							game.as_removeImage();
							if (_status.as_showImage_phase) {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/' + _status
										.as_showImage_phase + '.jpg', [3, 58, 7, 6], true);
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/' + _status
										.as_showImage_phase + '.png', [3, 65, 12, 6], true);
								}
							}
						},
					};

					//等待响应及游戏结束 
					lib.skill._jd_ddxyE = {
						trigger: {
							player: ['chooseToRespondEnd', 'useCardToEnd', 'phaseJudgeEnd', 'respondSha',
								'shanBegin'
							],
						},
						filter: function(event, player) {
							return player == game.me && _status.auto == false;
						},
						direct: true,
						content: function() {
							game.as_removeImage();
							if (_status.as_showImage_phase) {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/' + _status
										.as_showImage_phase + '.jpg', [3, 58, 7, 6], true);
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/' + _status
										.as_showImage_phase + '.png', [3, 65, 12, 6], true);
								}
							}
						},
					};

					//玩家死亡消失 
					lib.skill._jd_wjsw = {
						trigger: {
							global: 'dieAfter'
						},

						filter: function(event, player) {
							return player == game.me && _status.auto == false;
						},
						forced: true,
						charlotte: true,
						content: function() {
							game.as_removeImage();
						},
					};

					//游戏结束消失
					lib.onover.push(function(bool) {
						game.as_removeImage();
					});

					//对方正在思考
					lib.skill._jd_dfsk = {
						trigger: {
							global: ['phaseBegin', 'phaseEnd', 'phaseJudgeBegin', 'phaseDrawBegin',
								'phaseUseBegin', 'phaseDiscardBegin'
							],
						},
						charlotte: true,
						forced: true,
						filter: function(event, player) {
							//剩余人数两人时
							if (game.players.length == 2 && _status.currentPhase != game.me)
						return true;
						},
						content: function() {
							if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
								game.as_showImage('extension/手杀ui/lbtn/images/SSSC/dfsk.jpg', [3, 58, 7, 6], true)
							} else {
								game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/dfsk.png', [3, 65, 12, 6], true)
							}
						},
					};

					//回合开始
					lib.skill._jd_hhks = {
						trigger: {
							player: ['phaseBefore', 'phaseBegin'],
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status
								.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (event.triggername == 'phaseBefore') {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/hhks.jpg', [3, 58, 7,
										6
									], true)
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/hhks.png', [3, 65, 12,
										6
									], true)
								}
								_status.as_showImage_phase = 'hhks';
							} else if (_status.as_showImage_phase && _status.as_showImage_phase ==
								'hhks') {
								game.as_removeImage();
								delete _status.as_showImage_phase;
							}
						},
					};

					//判定阶段
					lib.skill._jd_pdjd = {
						trigger: {
							player: ['phaseJudgeBegin', 'phaseJudgeEnd'],
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status
								.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (event.triggername == 'phaseJudgeBegin') {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/pdjd.jpg', [3, 58, 7, 6], true)
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/pdjd.png', [3, 65, 12, 6], true)
								}
								_status.as_showImage_phase = 'pdjd';
							} else if (_status.as_showImage_phase && _status.as_showImage_phase ==
								'pdjd') {
								game.as_removeImage();
								delete _status.as_showImage_phase;
							}
						},
					};

					//摸牌阶段
					lib.skill._jd_mpjd = {
						trigger: {
							player: ['phaseDrawBegin', 'phaseDrawEnd'],
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status
								.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (event.triggername == 'phaseDrawBegin') {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/mpjd.jpg', [3, 58, 7, 6], true)
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/mpjd.png', [3, 65, 12, 6], true)
								}
								_status.as_showImage_phase = 'mpjd';
							} else if (_status.as_showImage_phase && _status.as_showImage_phase ==
								'mpjd') {
								game.as_removeImage();
								delete _status.as_showImage_phase;
							}
						},
					};

					//出牌阶段
					lib.skill._jd_cpjd = {
						trigger: {
							player: ['phaseUseBegin', 'phaseUseEnd'],
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status
								.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (event.triggername == 'phaseUseBegin') {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/cpjd.jpg', [3, 58, 7, 6], true)
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/cpjd.png', [3, 65, 12, 6], true)
								}
								_status.as_showImage_phase = 'cpjd';
							} else if (_status.as_showImage_phase && _status.as_showImage_phase ==
								'cpjd') {
								game.as_removeImage();
								delete _status.as_showImage_phase;
							}
						},
					};

					//弃牌阶段
					lib.skill._jd_qpjd = {
						trigger: {
							player: ['phaseDiscardBegin', 'phaseDiscardEnd'],
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status
								.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (event.triggername == 'phaseDiscardBegin') {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/qpjd.jpg', [3, 58, 7,
										6
									], true)
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/qpjd.png', [3, 65, 12,
										6
									], true)
								}
								_status.as_showImage_phase = 'qpjd';
							} else if (_status.as_showImage_phase && _status.as_showImage_phase ==
								'qpjd') {
								game.as_removeImage();
								delete _status.as_showImage_phase;
							}
						},
					};

					//回合结束
					lib.skill._jd_hhjs = {
						trigger: {
							player: ['phaseEnd', 'phaseAfter']
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status
								.auto == false;
						},
						charlotte: true,
						forced: true,
						content: function() {
							if (event.triggername == 'phaseEnd') {
								if (lib.config.extension_手杀ui_JDTSYangshi == "1") {
									game.as_showImage('extension/手杀ui/lbtn/images/SSSC/hhjs.jpg', [3, 58, 7, 6], true)
								} else {
									game.as_showImage('extension/手杀ui/lbtn/images/SZNSC/hhjs.png', [3, 65, 12, 6], true)
								}
								_status.as_showImage_phase = 'hhjs';
							} else if (_status.as_showImage_phase && _status.as_showImage_phase ==
								'hhjs') {
								game.as_removeImage();
								delete _status.as_showImage_phase;
							}
						},
					};
				//---------------------------------//
				}

				//进度条
				if (get.mode() != 'connect' && config.jindutiao == true) {
					lib.onover.push(function(bool) {
						if (document.getElementById("jindutiao")) {
							document.getElementById("jindutiao").remove()
						}
					});

					lib.skill._jindutiao = {
						trigger: {
							player: ['phaseBegin', 'useCardAfter']
						},
						filter: function(event, player) {
							return player == game.me && _status.currentPhase == player && _status.auto == false;
						},
						forced: true,
						content: function() {
							if (window.timer) {
								clearInterval(window.timer);
							}
							if (document.getElementById("jindutiao")) {
								document.getElementById("jindutiao").remove()
							}
							//-------样式1-------//
							if (lib.config.extension_手杀ui_jindutiaoYangshi == "1") {
								//手杀进度条样式
								var boxContent = document.createElement('div')
								boxContent.setAttribute('id', 'jindutiao')
								boxContent.style.cssText =
									"background-color: rgba(0,0,0,0.5);width: 590px;height:10px;border-radius: 1000px;box-shadow:0px 0px 5px #ccc inset,0px 0px 2px #FFFFD5;overflow: hidden;border:1px solid #41351D;position: fixed;bottom: calc(23% + 18px);left: calc(50% - 295px); z-index: -0.5;"
								
								var boxTime = document.createElement('div')
								boxTime.data = 600
								boxTime.style.cssText =
									"background-image: linear-gradient(#ffff13, #cf1023, #c3761e);width: 600px;height:10px; z-index: -4;"
								boxContent.appendChild(boxTime)
							}

							//-------样式2-----//
							if (lib.config.extension_手杀ui_jindutiaoYangshi == "2") {
								//十周年PC端进度条样式
								var boxContent = document.createElement('div')
								boxContent.setAttribute('id', 'jindutiao')
								boxContent.style.cssText =
									"width: 400px;height:24px;position: fixed;bottom: calc(23% + 18px);display: block;margin: 0 32% !important; z-index: -0.4;"

								var boxTime = document.createElement('div')
								boxTime.data = 300
								boxTime.style.cssText =
									"width:280px;height:2px;margin:14px 0 0 85px;background-color: #E2E20A;border-right:10px solid #FFF;position: absolute;top: 4px; z-index: -0.4;"
								boxContent.appendChild(boxTime)

								var imgBg = document.createElement('img')
								imgBg.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SZNSC/jindutiao.png'
								imgBg.style.cssText =
									"width: 400px;height:40px;position: absolute;top: 0; z-index: -0.5;"
								boxContent.appendChild(imgBg)
							}

							//-------样式3-----//
							if (lib.config.extension_手杀ui_jindutiaoYangshi == "3") {
								//十周年客户端进度条样式
								var boxContent = document.createElement('div')
								boxContent.setAttribute('id', 'jindutiao')
								/*进度条区域框框*/
								boxContent.style.cssText =
									"width: 500px;height:20px;position: fixed;bottom: calc(23% + 22px);box-shadow:none;display: block;margin: 0 0 !important;border-radius: 4px;left: calc(50% - 250px); z-index: -0.4;"

								var boxTime = document.createElement('div')
								boxTime.data = 300
								boxTime.style.cssText =
									/*进度条内容*/
									"width:482px;height:18px;background-color: #F4C336;border-top:1px solid #FFF;border-bottom:1px solid #FFF;border-left:1px solid #FFF;position: absolute;top: 1px;margin-right:5px;margin-left:4px;margin-top:2px;border-radius: 4px; z-index: -0.4;"
								boxContent.appendChild(boxTime)

						
								var imgBg = document.createElement('img')
								imgBg.src = lib.assetURL + 'extension/手杀ui/lbtn/images/SZNSC/jindutiao2.png'
								imgBg.style.cssText =
									"width: 500px;height:25px;position: absolute;top: 0;opacity: 0.9; z-index: -0.5;"
								boxContent.appendChild(imgBg)
							}

							document.body.appendChild(boxContent)
							window.timer = setInterval(() => {
								boxTime.data--
								boxTime.style.width = boxTime.data + 'px'
								if (boxTime.data == 0) {
									clearInterval(window.timer);
									boxContent.remove()
									//点击托管ui.click.auto();
								}
							}, 100); //进度条时间
						},

						group: ['_jindutiao_jieshu', '_jindutiao_jieshuB'],
						subSkill: {
							jieshu: {
								trigger: {
									player: 'phaseEnd'
								},
								forced: true,
								content: function() {
									if (window.timer) {
										clearInterval(window.timer);
									}
									if (document.getElementById("jindutiao")) {
										document.getElementById("jindutiao").remove()
									}
								},
							},
							jieshuB: {
								trigger: {
									player: 'useCardBegin'
								},
								filter: function(event, player) {
									return event.card && get.type(event.card, 'trick') == 'trick';
								},
								forced: true,
								content: function() {
									if (window.timer) {
										clearInterval(window.timer);
									}
									if (document.getElementById("jindutiao")) {
										document.getElementById("jindutiao").remove()
									}
								},
							},
						},
					}
				}

				lib.skill._wuxie = {
				trigger: {
					player: ['useCardToBegin', 'phaseJudge']
				},
				priority: 5,
				popup: false,
				forced: true,
				filter: function(event, player) {
					if (event.card.storage && event.card.storage.nowuxie) return false;
					var card = event.card;
					if (event.name == 'phaseJudge' && card.viewAs) card = {
						name: card.viewAs
					};
					var info = get.info(card);
					if (info.wuxieable === false) return false;
					if (event.name != 'phaseJudge') {
						if (event.getParent().nowuxie) return false;
						if (!event.target) {
							if (info.wuxieable) return true;
							return false;
						}
						if (event.player.hasSkillTag('playernowuxie', false, event.card))
						return false;
						if (get.type(event.card) != 'trick' && !info.wuxieable) return false;
					}
					return true;
				},
				forceLoad: true,
				content: function() {
					'step 0'
					delete event.wuxieresult;
					delete event.wuxieresult2;
					if (trigger.multitarget) {
						event.targets = trigger.targets;
					}
					event.target = trigger.target;
					if (event.triggername == 'phaseJudge') {
						event.target = trigger.player;
					}
					event.sourcex = event.targets || event.target;
					if (!event.targets && trigger.targets && trigger.targets.length == 1) {
						event.sourcex2 = trigger.player;
					}
					event.source = trigger.player;
					if (event.state == undefined) event.state = true;
					event.card = trigger.card;
					event._global_waiting = true;
					event.tempnowuxie = (trigger.targets && trigger.targets.length > 1 && !trigger
						.multitarget);
					event.filterCard = function(card, player) {
						if (get.name(card) != 'wuxie') return false;
						return lib.filter.cardEnabled(card, player, 'forceEnable');
					};
					event.send = function(player, state, isJudge, card, source, target, targets, id,
						id2, tempnowuxie, skillState) {
						if (skillState) {
							player.applySkills(skillState);
						}
						state = state ? 1 : -1;
						var str = '';
						if (isJudge) {
							str += get.translation(source) + '的';
						}
						if (isJudge) {
							str += get.translation(card, 'viewAs');
						} else {
							str += get.translation(card);
						}
						if ((targets || target) && !isJudge) {
							str += '对' + get.translation(targets || target);
						}
						str += '将' + (state > 0 ? '生效' : '失效') + '，是否无懈？';

						if (player.isUnderControl(true) && !_status.auto && !ui.tempnowuxie &&
							tempnowuxie) {
							var translation = get.translation(card.name);
							if (translation.length >= 4) {
								translation = lib.translate[card.name + '_ab'] || translation
									.slice(0, 2);
							}
							ui.tempnowuxie = ui.create.control('不无懈' + translation, ui.click
								.tempnowuxie, 'stayleft');
							ui.tempnowuxie._origin = id2;
						}
						var next = player.chooseToUse({
							filterCard: function(card, player) {
								if (get.name(card) != 'wuxie') return false;
								return lib.filter.cardEnabled(card, player,
									'forceEnable');
							},
							prompt: str,
							type: 'wuxie',
							state: state,
							_global_waiting: true,
							ai1: function() {
								if (isJudge) {
									var name = card.viewAs || card.name;
									var info = lib.card[name];
									if (info && info.ai && info.ai.wuxie) {
										var aiii = info.ai.wuxie(source, card,
											source, _status.event.player, state);
										if (typeof aiii == 'number') return aiii;
									}
									if (Math.abs(get.attitude(_status.event.player,
											source)) < 3) return 0;
									if (source.hasSkillTag('nowuxie_judge') ||
										source.hasSkillTag('guanxing') && (source !=
											player || !source.hasSkill(
												'guanxing_fail'))) return 0;
									if (name != 'lebu' && name != 'bingliang') {
										if (source != _status.event.player) {
											return 0;
										}
									}
									var card2;
									if (name != card.name) {
										card2 = {
											name: name
										};
									} else {
										card2 = card;
									}
									var eff = get.effect(source, card2, source,
										source);
									if (eff >= 0) return 0;
									return state * get.attitude(_status.event
										.player, source);
								} else if (target) {
									var triggerevent = _status.event.getTrigger();
									if (triggerevent && triggerevent.parent &&
										triggerevent.parent.postAi &&
										triggerevent.player.isUnknown(_status.event
											.player)) {
										return 0;
									}
									var info = get.info(card);
									if (info.ai && info.ai.wuxie) {
										var aiii = info.ai.wuxie(target, card,
											source, _status.event.player, state);
										if (typeof aiii == 'number') return aiii;
									}
									if (info.multitarget && targets) {
										var eff = 0;
										for (var i = 0; i < targets.length; i++) {
											eff += get.effect(targets[i], card,
												source, _status.event.player)
										}
										return -eff * state;
									}
									if (Math.abs(get.attitude(_status.event.player,
											target)) < 3) return 0;
									return -get.effect(target, card, source, _status
										.event.player) * state;
								} else {
									var triggerevent = _status.event.getTrigger();
									if (triggerevent && triggerevent.parent &&
										triggerevent.parent.postAi &&
										triggerevent.player.isUnknown(_status.event
											.player)) {
										return 0;
									}
									var info = get.info(card);
									if (info.ai && info.ai.wuxie) {
										var aiii = info.ai.wuxie(target, card,
											source, _status.event.player, state);
										if (typeof aiii == 'number') return aiii;
									}
									if (Math.abs(get.attitude(_status.event.player,
											source)) < 3) return 0;
									return -get.attitude(_status.event.player,
										source) * state;
								}
							},
							source: target,
							source2: targets,
							id: id,
							id2: id2
						});
						if (event.stateplayer && event.statecard) next.set('respondTo', [event
							.stateplayer, event.statecard
						]);
						else if (!isJudge) {
							next.set('respondTo', [source, card]);
						}
						if (game.online) {
							_status.event._resultid = id;
							game.resume();
						} else {
							next.nouse = true;
						}
					};
					event.settle = function() {
						if (!event.state) {
							if (event.triggername == 'phaseJudge') {
								trigger.untrigger();
								trigger.cancelled = true;
							} else {
								trigger.cancel();
								if (event.guowuxie == true) {
									if (trigger.target.identity != 'ye' && trigger.target
										.identity != 'unknown') {
										trigger.getParent().excluded.addArray(game.filterPlayer(
											function(current) {
												return current.identity == trigger
													.target.identity;
											}));
									}
								}
							}
						}
						event.finish();
					};
					'step 1'
					var list = game.filterPlayer(function(current) {
						if (event.nowuxie) return false;
						if (event.directHit && event.directHit.contains(current))
						return false;
						if (event.triggername == 'phaseJudge') {
							if (game.checkMod(trigger.card, player, current, 'unchanged',
									'wuxieJudgeEnabled', current) == false) return false;
							if (game.checkMod(trigger.card, player, current, 'unchanged',
									'wuxieJudgeRespondable', player) == false) return false;
							if (event.stateplayer && event.statecard && (game.checkMod(event
										.statecard, event.stateplayer, player, current,
										'unchanged', 'wuxieRespondable', event.stateplayer
										) == false)) return false;
						} else {
							if (!event.statecard && trigger.getParent().directHit.contains(
									current)) return false;
							if (game.checkMod(trigger.card, player, trigger.target, current,
									'unchanged', 'wuxieEnabled', current) == false)
							return false;
							if (game.checkMod(trigger.card, player, trigger.target, current,
									'unchanged', 'wuxieRespondable', player) == false)
								return false;
							if (event.stateplayer && event.statecard && (game.checkMod(event
									.statecard, event.stateplayer, trigger.player,
									current, 'unchanged', 'wuxieRespondable', event
									.stateplayer) == false)) return false;
						}
						return current.hasWuxie();
					});
					event.list = list;
					event.id = get.id();
					list.sort(function(a, b) {
						return get.distance(event.source, a, 'absolute') - get.distance(
							event.source, b, 'absolute');
					});
					'step 2'
					if (event.list.length == 0) {
						event.settle();
					} else if (_status.connectMode && (event.list[0].isOnline() || event.list[0] ==
							game.me)) {
						event.goto(4);
					} else {
						event.current = event.list.shift();
						event.send(event.current, event.state, event.triggername == 'phaseJudge',
							event.card, event.source, event.target, event.targets, event.id,
							trigger.parent.id, event.tempnowuxie);
					}
					'step 3'
					if (result.bool) {
						event.wuxieresult = event.current;
						event.wuxieresult2 = result;
						event.goto(8);
					} else {
						event.goto(2);
					}
					'step 4'
					var id = event.id;
					var sendback = function(result, player) {
						if (result && result.id == id && !event.wuxieresult && result.bool) {
							event.wuxieresult = player;
							event.wuxieresult2 = result;
							game.broadcast('cancel', id);
							if (_status.event.id == id && _status.event.name == 'chooseToUse' &&
								_status.paused) {
								return (function() {
									event.resultOL = _status.event.resultOL;
									ui.click.cancel();
									if (ui.confirm) ui.confirm.close();
								});
							}
						} else {
							if (_status.event.id == id && _status.event.name == 'chooseToUse' &&
								_status.paused) {
								return (function() {
									event.resultOL = _status.event.resultOL;
								});
							}
						}
					};

					var withme = false;
					var withol = false;
					var list = event.list;
					for (var i = 0; i < list.length; i++) {
						if (list[i].isOnline()) {
							withol = true;
							list[i].wait(sendback);
							list[i].send(event.send, list[i], event.state, event.triggername ==
								'phaseJudge',
								event.card, event.source, event.target, event.targets, event.id,
								trigger.parent.id, event.tempnowuxie, get.skillState(list[i]));
							list.splice(i--, 1);
						} else if (list[i] == game.me) {
							withme = true;
							event.send(list[i], event.state, event.triggername == 'phaseJudge',
								event.card, event.source, event.target, event.targets, event.id,
								trigger.parent.id, event.tempnowuxie);
							list.splice(i--, 1);
						}
					}
					if (!withme) {
						event.goto(6);
					}
					if (_status.connectMode) {
						if (withme || withol) {
							for (var i = 0; i < game.players.length; i++) {
								game.players[i].showTimer();
							}
						}
					}
					event.withol = withol;
					'step 5'
					if (result && result.bool && !event.wuxieresult) {
						game.broadcast('cancel', event.id);
						event.wuxieresult = game.me;
						event.wuxieresult2 = result;
					}
					'step 6'
					if (event.withol && !event.resultOL) {
						game.pause();
					}
					'step 7'
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].hideTimer();
					}
					'step 8'
					if (event.wuxieresult && event.wuxieresult2 && event.wuxieresult2.skill) {
						var info = get.info(event.wuxieresult2.skill);
						if (info && info.precontent && !game.online) {
							var next = game.createEvent('pre_' + event.wuxieresult2);
							next.setContent(info.precontent);
							next.set('result', event.wuxieresult2);
							next.set('player', event.wuxieresult);
						}
					}
					'step 9'
					if (event.wuxieresult) {
						var next = event.wuxieresult.useResult(event.wuxieresult2);
						if (event.stateplayer && event.statecard) next.respondTo = [event
							.stateplayer, event.statecard
						];
						else if (event.triggername != 'phaseJudge') {
							next.respondTo = [trigger.player, trigger.card];
						}
					}
					'step 10'
					if (event.wuxieresult) {
						if (result.wuxied) {
							event.nowuxie = result.nowuxie;
							event.directHit = result.directHit;
							event.stateplayer = event.wuxieresult;
							if (event.wuxieresult2 && event.wuxieresult2.used) {
								event.statecard = event.wuxieresult2.used;
							} else {
								event.statecard = true;
							}
							event.state = !event.state;
							event.goto(1);
						} else event.settle();
					} else if (event.list.length) {
						event.goto(2);
					} else {
						event.settle();
					}
					delete event.resultOL;
					delete event.wuxieresult;
					delete event.wuxieresult2;
				}
			}
			return function(next) {
				app.waitAllFunction([
					function(_next) {
						lib.init.css(lib.assetURL + 'extension/' + app.name, 'extension',
							_next);
					},
					function(_next) {
						app.loadPlugins(function() {
							var plugins = app.plugins.slice(0);
							var runNext = function() {
								var item = plugins.shift();
								if (!item) return _next();
								if (item.filter && !item.filter()) return runNext();
								if (item.content) return item.content(runNext);
								runNext();
							};
							Object.assign(runNext, app.element.runNext);
							runNext();
						});
					},
				], next);
			};

		},

		precontent: function() {
        delete lib.extensionMenu['extension_手杀ui'].delete;

		//函数框架
	//--------聊天框架-------//	
			//----------------------------------------------------------------------------------------//
	
	if(!window.chatRecord) window.chatRecord=[];
	game.addChatWord=function(strx){
		if(window.chatRecord.length>30){//设置一下上限30条，不设也行，把这个if删除即可
			window.chatRecord.remove(window.chatRecord[0]);
		}
		if(strx){
			window.chatRecord.push(strx);
		}
		var str=(window.chatRecord[0]||'')+'<br>';
		if(window.chatRecord.length>1){
			for(var i=1;i<window.chatRecord.length;i++){
				str+='<br>'+window.chatRecord[i]+'<br>';
			}
		}
		if(window.chatBackground2!=undefined) game.updateChatWord(str);
	}

		 //----------------------------------------------------------------------------------------//

//开始聊天框部分
	game.showChatWordBackgroundX=function(){
		if(window.chatBg!=undefined&&window.chatBg.show){//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
			window.chatBg.hide();
			window.chatBg.show=false;
			if(window.dialog_lifesay){
				if(window.dialog_lifesay.show) window.dialog_lifesay.style.left='-'+window.dialog_lifesay.style.width;
				setTimeout(function(){
					window.dialog_lifesay.hide();
					window.dialog_lifesay.show=false;
				},1000);
			}
			if(window.dialog_emoji){
				if(window.dialog_emoji.show) window.dialog_emoji.style.top='100%';
				setTimeout(function(){
					window.dialog_emoji.hide();
					window.dialog_emoji.show=false;
				},1000);
			}
			if(window.chatBackground){
				if(window.chatBackground.show) window.chatBackground.style.left='100%';
				setTimeout(function(){
					window.chatBackground.hide();
					window.chatBackground.show=false;
				},1000);
			}
			return ;
		}
		var dialogChat={};
		//聊天框整体
		window.chatBg=ui.create.div('hidden');
		window.chatBg.classList.add('popped');
		window.chatBg.classList.add('static');
		window.chatBg.show=true;
		window.chatBg.style.cssText="display: block;--w: 420px;--h: calc(var(--w) * 430/911);width: var(--w);height: var(--h);position: fixed;left:30%;bottom:5%;opacity: 1;background-size: 100% 100%;background-color: transparent;z-index:99;";
		window.chatBg.style.transition='all 1.5s';
		/*window.chatBg.style.height='170px';//调整对话框背景大小，位置
		window.chatBg.style.width='550px';
			window.chatBg.style.left='calc(50%-130px)';
		window.chatBg.style.top='calc(100% - 470px)';
		window.chatBg.style.opacity=1;*/
		window.chatBg.setBackgroundImage('extension/手杀ui/sayplay/images/chat.png');
		/*window.chatBg.style.backgroundSize="100% 100%";
		window.chatBg.style.transition='all 0.5s';
		window.chatBg.style['box-shadow']='none';*/
		ui.window.appendChild(window.chatBg);
		
		var clickFK=function(div){
			div.style.transition='opacity 0.5s';
			div.addEventListener(lib.config.touchscreen?'touchstart':'mousedown',function(){
				this.style.transform='scale(0.95)';
			});
			div.addEventListener(lib.config.touchscreen?'touchend':'mouseup',function(){
				this.style.transform='';
			});
			div.onmouseout=function(){
				this.style.transform='';
			};
		};
	//--------------------------------//	
		game.open_lifesay=function(){
			//打开常用语函数
			if(window.dialog_emoji){
				if(window.dialog_emoji.show) window.dialog_emoji.style.top='100%';
				setTimeout(function(){
					window.dialog_emoji.hide();
					window.dialog_emoji.show=false;
				},1000);
			}
			if(window.chatBackground){
				if(window.chatBackground.show) window.chatBackground.style.left='100%';
				setTimeout(function(){
					window.chatBackground.hide();
					window.chatBackground.show=false;
				},1000);
			}
			if(window.dialog_lifesay!=undefined&&window.dialog_lifesay.show){//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
				window.dialog_lifesay.hide();
				window.dialog_lifesay.show=false;
				return ;
			}
			var dialogLife={};
			window.dialog_lifesay=ui.create.div('hidden');
			window.dialog_lifesay.style['z-index']=999999999;
			window.dialog_lifesay.classList.add('popped');
			window.dialog_lifesay.classList.add('static');
			window.dialog_lifesay.show=true;
			window.dialog_lifesay.style.height='300px';//整个常用语对话框的宽高
			window.dialog_lifesay.style.width='600px';//对话框的宽度，由每一条的内容字数决定，可自行调整，使用固定大小避免手机和电脑像素不同导致冲突
			window.dialog_lifesay.style.left='-'+window.dialog_lifesay.style.width;//这里弄一个右移的动画
			setTimeout(function(){
				window.dialog_lifesay.style.left='calc( 50% - 300px)';//整个对话框的位置
			},100);
			window.dialog_lifesay.style.top='calc( 20% - 100px)';//整个对话框的位置
			window.dialog_lifesay.style.transition='all 1s';
			window.dialog_lifesay.style.opacity=1;
			window.dialog_lifesay.style.borderRadius='8px';
			window.dialog_lifesay.style.backgroundSize="100% 100%";
			window.dialog_lifesay.setBackgroundImage('extension/手杀ui/sayplay/images/nobg.png');//把背景dialog设置为透明
			window.dialog_lifesay.style['box-shadow']='none';
			ui.window.appendChild(window.dialog_lifesay);
			dialogLife.background=window.dialog_lifesay;
			window.dialog_lifesayBgPict=ui.create.div('hidden');//这是现在的背景颜色的div，外层div
			window.dialog_lifesayBgPict.style.height='100%';
			window.dialog_lifesayBgPict.style.width='100%';
			window.dialog_lifesayBgPict.style.left='0%';
			window.dialog_lifesayBgPict.style.top='0%';
			window.dialog_lifesayBgPict.style.borderRadius='8px';
			window.dialog_lifesayBgPict.style.backgroundSize="100% 100%";
			window.dialog_lifesayBgPict.setBackgroundImage('extension/手杀ui/sayplay/images/saydiv.png');
			window.dialog_lifesayBgPict.style['box-shadow']='none';
			window.dialog_lifesay.appendChild(window.dialog_lifesayBgPict);
			window.dialog_lifesayBgColor=ui.create.div('hidden');//这是原来的背景颜色的div，内层div
			window.dialog_lifesayBgColor.style.height='70%';
			window.dialog_lifesayBgColor.style.width='80%';
			window.dialog_lifesayBgColor.style.left='10%';
			window.dialog_lifesayBgColor.style.top='10%';
			window.dialog_lifesayBgColor.style.borderRadius='8px';
			window.dialog_lifesayBgColor.setBackgroundImage('extension/手杀ui/sayplay/images/nobg.png');//把背景设置为透明
			//window.dialog_lifesayBgColor.style.backgroundColor='black';
			window.dialog_lifesayBgColor.style['overflow-y']='scroll';
			lib.setScroll(window.dialog_lifesayBgColor);
			window.dialog_lifesay.appendChild(window.dialog_lifesayBgColor);
			window.lifesayWord=[//添加常用语
				"能不能快点呀，兵贵神速啊",
				"主公，别开枪，自己人",
				"小内再不跳，后面还怎么玩啊",
				"你们怎么忍心就这么让我酱油了",
				"我，我惹你们了吗",
				"姑娘，你真是条汉子",
				"三十六计，走为上，容我去去便回",
				"人心散了，队伍不好带啊",
				"昏君，昏君啊",
				"风吹鸡蛋壳，牌去人安乐",
				"小内啊，您老悠着点儿",
				"不好意思，刚才卡了",
				"你可以打得再烂一点吗",
				"哥们儿，给力点行吗",
				"哥，交个朋友吧",
				"妹子，交个朋友吧",
			];
			for(var i=0;i<window.lifesayWord.length;i++){
				window['dialog_lifesayContent_'+i]=ui.create.div('hidden','',function(){
					game.me.say('<font color=white>'+this.content);
					window.dialog_lifesay.delete();
					delete window.dialog_lifesay;
					window.dialog_lifesay=undefined;
					game.playAudio("..", "extension", "手杀ui/sayplay/audio",this.pos+"_" +game.me.sex);
				});
				window['dialog_lifesayContent_'+i].style.height='10%';//每一条内容的高度，可以用px也可以用百分比，由你喜欢
				window['dialog_lifesayContent_'+i].style.width='100%';//每一条内容的宽度，默认与整个对话框宽度挂钩以美观，具体百分比可自己调整
				window['dialog_lifesayContent_'+i].style.left='0%';
				window['dialog_lifesayContent_'+i].style.top='0%';
				window['dialog_lifesayContent_'+i].style.position='relative';
				window['dialog_lifesayContent_'+i].pos=i;
				window['dialog_lifesayContent_'+i].content=window.lifesayWord[i];
				window['dialog_lifesayContent_'+i].innerHTML='<font color=white>'+window.lifesayWord[i]+'</font>';//显示的字体可以自己改
				window.dialog_lifesayBgColor.appendChild(window['dialog_lifesayContent_'+i]);
				clickFK(window['dialog_lifesayContent_'+i]);
			}
		}
		//常用语按钮
		window.chatButton1=ui.create.div('hidden','',game.open_lifesay);
		window.chatButton1.style.cssText="display: block;--w: 80px;--h: calc(var(--w) * 82/98);width: var(--w);height: var(--h);left:40px;bottom:25px;transition:none;background-size:100% 100%";
		/*window.chatButton1.style.height='70px';
		window.chatButton1.style.width='80px';
		window.chatButton1.style.left='40px';
		window.chatButton1.style.bottom='10px';
		window.chatButton1.style.transition='none';
		window.chatButton1.style.backgroundSize="100% 100%";*/
		window.chatButton1.setBackgroundImage('extension/手杀ui/sayplay/images/lifesay.png');
		
		lib.setScroll(window.chatButton1);
		window.chatBg.appendChild(window.chatButton1);
		clickFK(window.chatButton1);
	//-----------------------------------//	
	//-----------互动框---------//
	game.open_hudong=function(){
			//打开互动框函数
				if(window.dialog_hudong!=undefined&&dialog_hudong.show){//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
			window.dialog_hudong.hide();
			window.dialog_hudong.show=false;
			return ;
		}
		
		}
	//------菜篮子框------//
	window.hudongkuang=ui.create.div('hidden','',game.open_hudong);
		window.hudongkuang.style.cssText="display: block;--w: 315px;--h: calc(var(--w) * 135/142);width: var(--w);height: var(--h);left:-280px;bottom:-30px;transition:none;background-size:100% 100%;pointer-events:none;";	
		window.hudongkuang.setBackgroundImage('extension/手杀ui/sayplay/images/hudong.png');		
		window.chatBg.appendChild(window.hudongkuang);	
	//-------------------------//
	
	//------1--美酒-------//
	game.open_meijiu=function(){
			//打开美酒函数
			//这里
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	var target=this;
	if(window.meijiu.thrownn==true){
	for (let i = 0; i < 10; i++) {
    setTimeout(() => {
    if(i<=8)
	game.me.throwEmotion(this,'hehua');	
	else game.me.throwEmotion(this,'wine');
	window.shuliang.innerText=window.shuliang.innerText-1;
	}, 100 * i);
    setTimeout(() => {
    if(i<=8)
	target.throwEmotion(game.me,'hehua');
	else target.throwEmotion(game.me,'wine');
	},100*i+500) 
         }}
	}	
	}		
		}
	window.meijiu=ui.create.div('hidden','',game.open_meijiu);
		window.meijiu.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-155px;bottom:173px;transition:none;background-size:100% 100%";
		window.meijiu.setBackgroundImage('extension/手杀ui/sayplay/meijiu.png');
		//这里
		window.meijiu.onclick=function(){
			window.meijiu.thrownn=true;
		}
		window.chatBg.appendChild(window.meijiu);
		lib.setScroll(window.meijiu);
		clickFK(window.meijiu);
	//-------------------//
	
	//---2-----鲜花-------//
	game.open_xianhua=function(){
			//打开鲜花函数(改为荷花)
			//这里
				var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	if(window.xianhua.thrownn==true)
	game.me.throwEmotion(this,'hehua');
	window.shuliang.innerText=window.shuliang.innerText-1;	
	}	
	}
		}
	window.xianhua=ui.create.div('hidden','',game.open_xianhua);
		window.xianhua.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-230px;bottom:173px;transition:none;background-size:100% 100%";
		window.xianhua.setBackgroundImage('extension/手杀ui/sayplay/xianhua.png');
		//这里
	window.xianhua.onclick=function(){
			window.xianhua.thrownn=true;
		}	
		window.chatBg.appendChild(window.xianhua);
		lib.setScroll(window.xianhua);
		clickFK(window.xianhua);
	//-------------------//

	//-----3---拖鞋-------//
	
	game.open_tuoxie=function(){	
			//打开拖鞋函数
			//这里
		var list=game.players;
		var num=10;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){	
	var target=this;
	if(window.tuoxie.thrownn==true){
	for (let i = 0; i < num; i++) {
     setTimeout(() => {
     if(i<=8)
	{game.me.throwEmotion(this,'egg');	
	window.shuliang.innerText=window.shuliang.innerText-1;}
	else {game.me.throwEmotion(this,'shoe');
	window.shuliang.innerText=window.shuliang.innerText-1;}
	}, 100 * i);
	setTimeout(() => {
   if(i<=8)target.throwEmotion(game.me,'egg');
	else target.throwEmotion(game.me,'shoe')
	},100*i+1000)
        }}
	}}}
	window.tuoxie=ui.create.div('hidden','',game.open_tuoxie);
		window.tuoxie.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-155px;bottom:105px;transition:none;background-size:100% 100%";
		window.tuoxie.setBackgroundImage('extension/手杀ui/sayplay/tuoxie.png');
		//这里
		window.tuoxie.onclick=function(){
			window.tuoxie.thrownn=true;
		}
		window.chatBg.appendChild(window.tuoxie);
		lib.setScroll(window.tuoxie);
		clickFK(window.tuoxie);
	//-------------------//
	
	//-----4---鸡蛋-------//
	game.open_jidan=function(){		
			//打开鸡蛋函数
			//这里
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	if(window.jidan.thrownn==true)
	{game.me.throwEmotion(this,'egg');	
	window.shuliang.innerText=window.shuliang.innerText-1;}
	}	
	}		
			}
	window.jidan=ui.create.div('hidden','',game.open_jidan);
		window.jidan.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-230px;bottom:105px;transition:none;background-size:100% 100%";
		window.jidan.onclick=function(){
			window.jidan.thrownn=true;
		}	
		//这里
		window.jidan.setBackgroundImage('extension/手杀ui/sayplay/jidan.png');
		window.chatBg.appendChild(window.jidan);
		lib.setScroll(window.jidan);
		clickFK(window.jidan);
	//-------------------//
	
	//-----5--菜篮-------//
	game.open_cailan=function(){
			//打开菜篮函数(改为大酒杯)
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	var target=this;
	if(window.cailan.thrownn==true){
	for (let i = 0; i < 10; i++) {
     setTimeout(() => {
     if(i<=8)
	game.me.throwEmotion(this,'wine');	
	else game.me.throwEmotion(this,'wine');
	window.shuliang.innerText=window.shuliang.innerText-1;
	}, 100 * i);
	setTimeout(() => {
	if(i<=8)target.throwEmotion(game.me,'wine');
	else target.throwEmotion(game.me,'wine')
	},100*i+1000)
        }}
	}	
	}	
			}
	window.cailan=ui.create.div('hidden','',game.open_cailan);
		window.cailan.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-80px;bottom:173px;transition:none;background-size:100% 100%";
		window.cailan.setBackgroundImage('extension/手杀ui/sayplay/cailan.png');
		window.cailan.onclick=function(){
			window.cailan.thrownn=true;
		}	
		window.chatBg.appendChild(window.cailan);
		lib.setScroll(window.cailan);
		clickFK(window.cailan);
	//-------------------//
	
	//------6--七彩-------//
	game.open_qicai=function(){
			//打开七彩函数(大拖鞋)
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	var target=this;
	if(window.qicai.thrownn==true){
	for (let i = 0; i < 10; i++) {
     setTimeout(() => {
     if(i<=8)
	game.me.throwEmotion(this,'shoe');	
	else game.me.throwEmotion(this,'shoe');
	window.shuliang.innerText=window.shuliang.innerText-1;
	}, 100 * i);
	setTimeout(() => {
	if(i<=8)target.throwEmotion(game.me,'shoe');
	else target.throwEmotion(game.me,'shoe')
	},100*i+1000)
        }}
	}	
	}	
			}
	window.qicai=ui.create.div('hidden','',game.open_qicai);
		window.qicai.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-80px;bottom:105px;transition:none;background-size:100% 100%";	
		window.qicai.setBackgroundImage('extension/手杀ui/sayplay/qicai.png');
		window.qicai.onclick=function(){
			window.qicai.thrownn=true;
		}
		window.chatBg.appendChild(window.qicai);
		lib.setScroll(window.qicai);
		clickFK(window.qicai);
	//-------------------//
	
	//-----7---小酒-------//
	game.open_xiaojiu=function(){
			//打开小酒函数(改为灯笼)
			//这里
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	if(window.xiaojiu.thrownn==true)
	{game.me.throwEmotion(this,'denglong');
	window.shuliang.innerText=window.shuliang.innerText-1;}	
	}
	}
			}
	window.xiaojiu=ui.create.div('hidden','',game.open_xiaojiu);
		window.xiaojiu.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-230px;bottom:36px;transition:none;background-size:100% 100%";
		window.xiaojiu.onclick=function(){
			window.xiaojiu.thrownn=true;
		}
		//这里
		window.xiaojiu.setBackgroundImage('extension/手杀ui/sayplay/xiaojiu.png');
		window.chatBg.appendChild(window.xiaojiu);
		lib.setScroll(window.xiaojiu);
		clickFK(window.xiaojiu);
	//-------------------//
	
	//-----8---雪球------//
	game.open_xueqiu=function(){
			//打开雪球函数(改为烟花)			
			//这里
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	if(window.xueqiu.thrownn==true)
	{game.me.throwEmotion(this,'yanhua');
	window.shuliang.innerText=window.shuliang.innerText-1;}	
	}
	}
			}
	window.xueqiu=ui.create.div('hidden','',game.open_xueqiu);
		window.xueqiu.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-155px;bottom:36px;transition:none;background-size:100% 100%";	
		window.xueqiu.onclick=function(){
			window.xueqiu.thrownn=true;
		}
		//这里
		window.xueqiu.setBackgroundImage('extension/手杀ui/sayplay/xueqiu.png');	
		window.chatBg.appendChild(window.xueqiu);
		lib.setScroll(window.xueqiu);
		clickFK(window.xueqiu);
	//-------------------//

	//------9-虚无-------//
	game.open_xuwu=function(){
			//打开虚无函数(改为鲜花)
        	//这里
			var list=game.players;
	for(i=0;i<game.players.length;i++){
	list[i].onclick=function(){
	if(window.xuwu.thrownn==true)
	{game.me.throwEmotion(this,'flower');
	window.shuliang.innerText=window.shuliang.innerText-1;}	
	}
	}
			}
	window.xuwu=ui.create.div('hidden','',game.open_xuwu);
		window.xuwu.style.cssText="display: block;--w: 63px;--h: calc(var(--w) * 50/50);width: var(--w);height: var(--h);left:-80px;bottom:36px;transition:none;background-size:100% 100%";	
		window.xuwu.onclick=function(){
			window.xuwu.thrownn=true;
		}
		//这里
		window.xuwu.setBackgroundImage('extension/手杀ui/sayplay/xuwu.png');
		window.chatBg.appendChild(window.xuwu);
		lib.setScroll(window.xuwu);
		clickFK(window.xuwu);
	//-------------------//


	//--------菜篮子-------//
		
	    window.cailanzi=ui.create.div('hidden','');
		window.cailanzi.style.cssText="display: block;--w: 100px;--h: calc(var(--w) * 59/150);width: var(--w);height: var(--h);left:-230px;bottom:250px;transition:none;background-size:100% 100%";
		
		window.cailanzi.setBackgroundImage('extension/手杀ui/sayplay/cailanzi.png');
	
		window.chatBg.appendChild(window.cailanzi);
	
	        window.shuliang = ui.create.node('div');
		    window.shuliang.innerText=Math.floor(Math.random()*(999-100+1)+100);
		    window.shuliang.style.cssText="display: block;left:-180px;bottom:260px;font-family:'shousha';color:#97856a;font-weight: 900; text-shadow:none;transition:none;background-size:100% 100%";	
		
		window.chatBg.appendChild(window.shuliang);
	//-------------------//
	

		game.open_emoji=function(){//打开emoji函数
			if(window.dialog_lifesay){
				if(window.dialog_lifesay.show) window.dialog_lifesay.style.left='-'+window.dialog_lifesay.style.width;
				setTimeout(function(){
					window.dialog_lifesay.hide();
					window.dialog_lifesay.show=false;
				},1000);
			}
			if(window.chatBackground){
				if(window.chatBackground.show) window.chatBackground.style.left='100%';
				setTimeout(function(){
					window.chatBackground.hide();
					window.chatBackground.show=false;
				},1000);
			}
			if(window.dialog_emoji!=undefined&&window.dialog_emoji.show){//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
				window.dialog_emoji.hide();
				window.dialog_emoji.show=false;
				return ;
			}
			var dialogEmoji={};
			window.dialog_emoji=ui.create.div('hidden');
			window.dialog_emoji.style['z-index']=999999999;
			window.dialog_emoji.classList.add('popped');
			window.dialog_emoji.classList.add('static');
			window.dialog_emoji.show=true;
			window.dialog_emoji.style.height='280px';//整个选择emoji对话框的宽高
			window.dialog_emoji.style.width='360px';
			window.dialog_emoji.style.left='calc( 50% - 180px)';
			window.dialog_emoji.style.top='100%';//这里弄一个上移的动画
			window.dialog_emoji.style.transition='all 1s';
			setTimeout(function(){
				window.dialog_emoji.style.top='calc( 25% - 50px )';//上移后的位置
			},100);
			window.dialog_emoji.style.opacity=1;
			window.dialog_emoji.style.borderRadius='8px';
			window.dialog_emoji.style.backgroundSize="100% 100%";
			window.dialog_emoji.setBackgroundImage('extension/手杀ui/sayplay/images/nobg.png');//把背景dialog设置为透明
			window.dialog_emoji.style['box-shadow']='none';
			ui.window.appendChild(window.dialog_emoji);
			dialogEmoji.background=window.dialog_emoji;
			window.dialog_emojiBgPict=ui.create.div('hidden');//这是现在外层div
			window.dialog_emojiBgPict.style.height='100%';
			window.dialog_emojiBgPict.style.width='100%';
			window.dialog_emojiBgPict.style.left='0%';
			window.dialog_emojiBgPict.style.top='0%';
			window.dialog_emojiBgPict.style.borderRadius='8px';
			window.dialog_emojiBgPict.style.backgroundSize="100% 100%";
			window.dialog_emojiBgPict.setBackgroundImage('extension/手杀ui/sayplay/images/saydiv.png');
			window.dialog_emojiBgPict.style['box-shadow']='none';
			window.dialog_emoji.appendChild(window.dialog_emojiBgPict);
			window.dialog_emojiBgColor=ui.create.div('hidden');//这是内层div
			window.dialog_emojiBgColor.style.height='70%';
			window.dialog_emojiBgColor.style.width='80%';
			window.dialog_emojiBgColor.style.left='10%';
			window.dialog_emojiBgColor.style.top='10%';
			window.dialog_emojiBgColor.style.borderRadius='8px';
			window.dialog_emojiBgColor.style.backgroundSize="100% 100%";
			window.dialog_emojiBgColor.setBackgroundImage('extension/手杀ui/sayplay/images/nobg.png');//把背景设置为透明
			window.dialog_emojiBgColor.style['overflow-y']='scroll';
			lib.setScroll(window.dialog_emojiBgColor);
			window.dialog_emoji.appendChild(window.dialog_emojiBgColor);
			for(var i=0;i<50;i++){
				window['dialog_emojiContent_'+i]=ui.create.div('hidden','',function(){
					game.me.say('<img style=width:34px height:34px src="'+lib.assetURL+'extension/手杀ui/sayplay/emoji/'+this.pos+'.png">');
					window.dialog_emoji.delete();
					delete window.dialog_emoji;
					window.dialog_emoji=undefined;
				});
				window['dialog_emojiContent_'+i].style.height='34px';//单个表情的宽高
				window['dialog_emojiContent_'+i].style.width='34px';
				window['dialog_emojiContent_'+i].style.left='0px';
				window['dialog_emojiContent_'+i].style.top='0px';
				window['dialog_emojiContent_'+i].style.position='relative';
				window['dialog_emojiContent_'+i].pos=i;
				window['dialog_emojiContent_'+i].setBackgroundImage('extension/手杀ui/sayplay/emoji/'+i+'.png');
				window['dialog_emojiContent_'+i].style.backgroundSize="100% 100%";
				window.dialog_emojiBgColor.appendChild(window['dialog_emojiContent_'+i]);
				clickFK(window['dialog_emojiContent_'+i]);
			}
		}
		window.chatButton2=ui.create.div('hidden','',game.open_emoji);
		window.chatButton2.style.cssText="display: block;--w: 80px;--h: calc(var(--w) * 82/98);width: var(--w);height: var(--h);left:150px;bottom:25px;transition:none;background-size:100% 100%";
		/*window.chatButton2.style.height='70px';
		window.chatButton2.style.width='80px';
		window.chatButton2.style.left='150px';
		window.chatButton2.style.bottom='10px';
		window.chatButton2.style.transition='none';
		window.chatButton2.style.backgroundSize="100% 100%";*/
		window.chatButton2.setBackgroundImage('extension/手杀ui/sayplay/emoji.png');
		
		lib.setScroll(window.chatButton2);
		window.chatBg.appendChild(window.chatButton2);
		clickFK(window.chatButton2);
		
		game.open_jilu=function(){//打开记录函数
			game.showChatWord();
		}
		window.chatButton3=ui.create.div('hidden','',game.open_jilu);
		window.chatButton3.style.cssText="display: block;--w: 80px;--h: calc(var(--w) * 82/98);width: var(--w);height: var(--h);left:260px;bottom:25px;transition:none;background-size:100% 100%";
		/*window.chatButton3.style.height='70px';
		window.chatButton3.style.width='80px';
		window.chatButton3.style.left='260px';
		window.chatButton3.style.bottom='10px';
		window.chatButton3.style.transition='none';
		window.chatButton3.style.backgroundSize="100% 100%";*/
		window.chatButton3.setBackgroundImage('extension/手杀ui/sayplay/images/jilu.png');
		
		lib.setScroll(window.chatButton3);
		window.chatBg.appendChild(window.chatButton3);
		clickFK(window.chatButton3);
		
		window.chatSendBottom=ui.create.div('','',function(){//发送按钮
			if(!window.input) return ;
			if(window.input.value==undefined) return ;
			window.sendInfo('<font color=white>'+window.input.value);
		});
		window.chatSendBottom.style.cssText="display: block;--w: 100px;--h: calc(var(--w) * 62/160);width: var(--w);height: var(--h);left:70%;top:33px;transition:none;background-size:100% 100%;text-align:center;border-randius:8px;";
		/*window.chatSendBottom.style.height='50px';
		window.chatSendBottom.style.width='25%';
		window.chatSendBottom.style.left='calc( 60% + 62px )';
		window.chatSendBottom.style.top='23px';
		window.chatSendBottom.style.transition='none';
		window.chatSendBottom.style['text-align']='center';
		window.chatSendBottom.style.borderRadius='8px';
		window.chatSendBottom.style.backgroundSize="100% 100%";*/
		
		window.chatSendBottom.setBackgroundImage('extension/手杀ui/sayplay/images/buttonsend.png');
		window.chatSendBottom.innerHTML='<span style="color:white;font-size:27px;font-weight:400;font-family:shousha">发送</span>';		
		window.chatBg.appendChild(window.chatSendBottom);
		clickFK(window.chatSendBottom);
		game.updateChatWord=function(str){
			window.chatBackground2.innerHTML=str;
		}
		game.addChatWord();
		
		window.sendInfo=function(content){
			game.me.say(content);
			window.input.value='';
		}
		//房间
		window.chatInputOut=ui.create.div('hidden');
		window.chatInputOut.style.cssText="display: block;--w: 265px;--h: calc(var(--w) * 50/280);width: var(--w);height: var(--h);left:30px;top:30px;transition:none;background-size:100% 100%;pointer-events:none;z-index:6;";
		/*window.chatInputOut.style.height='22px';
		window.chatInputOut.style.width='60%';
		window.chatInputOut.style.left='40px';
		window.chatInputOut.style.top='40px';
		window.chatInputOut.style.transition='none';
		window.chatInputOut.style.backgroundSize="100% 100%";*/
		window.chatInputOut.style.backgroundImage="url('"+lib.assetURL+"extension/手杀ui/sayplay/images/sayX.png')";
		
		window.chatBg.appendChild(window.chatInputOut);
		//输入框
		window.chatInput=ui.create.dialog('hidden');
		window.chatInput.style.height='22px';
		window.chatInput.style.width='42%';//设置输入框宽度
		window.chatInput.style.left='27%';
		window.chatInput.style.top='42px';
		window.chatInput.style.transition='none';
		window.chatBg.appendChild(window.chatInput);
		window.ipt=ui.create.div();
		window.ipt.style.height='22px';
		window.ipt.style.width='100%';
		window.ipt.style.top='0px';
		window.ipt.style.left='0px';
		window.ipt.style.margin='0px';
		window.ipt.style.borderRadius='0px';
		window.ipt.style['background-image']='linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4))';
		//window.ipt.style['box-shadow']='rgba(0, 0, 0, 0.4) 0 0 0 1px, rgba(0, 0, 0, 0.2) 0 3px 10px';
		if(window.input&&window.input.value) window.input_value=window.input.value;
		window.ipt.innerHTML='<input type="text" value='+(window.input_value||"点击左下角关闭，重新打开才能停止砸蛋效果")+' style="color:white;font-family:shousha;width:calc(100% - 10px);text-align:left;"></input>';
		window.input=window.ipt.querySelector('input');
		window.input.style.backgroundImage="url('"+lib.assetURL+"extension/手杀ui/sayplay/images/say.png')";
		window.input.style.backgroundSize="120% 120%";
		window.input.style['box-shadow']='none';
		window.input.onclick=function(e){
			e.stopPropagation();
		};
		window.input.onfocus=function(){
			if(this.value=='点击左下角关闭，重新打开才能停止砸蛋效果') this.value='';
		};
		window.input.onkeydown=function(e){
			e.stopPropagation();
			if(e.keyCode==13){
				var value=this.value;
				if(!value) return ;
				if(typeof value!='string') value=''+value;
				window.sendInfo(value);
			};
		};
		window.chatInput.add(window.ipt);
	}

//结束聊天框部分

		 //----------------------------------------------------------------------------------------//

	//聊天记录栏
	game.showChatWord=function(){
		if(window.dialog_lifesay){
			if(window.dialog_lifesay.show) window.dialog_lifesay.style.left='-'+window.dialog_lifesay.style.width;
			setTimeout(function(){
				window.dialog_lifesay.hide();
				window.dialog_lifesay.show=false;
			},1000);
		}
		if(window.dialog_emoji){
			if(window.dialog_emoji.show) window.dialog_emoji.style.top='100%';
			setTimeout(function(){
				window.dialog_emoji.hide();
				window.dialog_emoji.show=false;
			},1000);
		}
		if(window.chatBackground!=undefined&&window.chatBackground.show){//控制面板打开，首次调用此函数时打开面板，再次调用时关闭
			window.chatBackground.hide();
			window.chatBackground.show=false;
			return ;
		}
		window.chatBackground=ui.create.div('hidden');
		window.chatBackground.style['z-index']=999999999;
		//window.chatBackground.classList.add('popped');
		window.chatBackground.classList.add('static');
		window.chatBackground.show=true;
		window.chatBackground.style.transition='all 1s';
		window.chatBackground.style.height='330px';//调整对话框背景大小，位置
		window.chatBackground.style.width='600px';
		window.chatBackground.style.top='calc( 20% - 100px )';//这里弄一个左移的动画
		window.chatBackground.style.left='100%';//这里弄一个左移的动画
		setTimeout(function(){
			window.chatBackground.style.left='calc( 50% - 300px)';//左移后的位置
		},100);
		window.chatBackground.style.bottom='calc( '+window.chatBg.style.height+' + '+'5px )';
		window.chatBackground.style.opacity=1;
		window.chatBackground.style.borderRadius='10px';
		game.mouseChatDiv=function(div){;//查看时显示，不查看时，对话框虚化
			if(lib.device==undefined){
				div.onmouseover=function(){
					this.style.opacity=1.0;
				};
				div.onmouseout=function(){
					this.style.opacity=0.25;
				};
			}
			else{
				div.onclick=function(){
					if(div.style.opacity==0.25) this.style.opacity=0.75;
					else this.style.opacity=0.25;
				}
			}
		}
		game.mouseChatDiv(window.chatBackground);
		window.chatBackground.style.backgroundSize="100% 100%";
		window.chatBackground.setBackgroundImage('extension/手杀ui/sayplay/images/nobg.png');//把背景dialog设置为透明
		window.chatBackground.style['box-shadow']='none';
		ui.window.appendChild(window.chatBackground);
		
		window.chatBackgroundPict=ui.create.div('hidden');//外层div
		window.chatBackgroundPict.style.height='100%';
		window.chatBackgroundPict.style.width='100%';
		window.chatBackgroundPict.style.left='0%';
		window.chatBackgroundPict.style.bottom='0%';
		window.chatBackgroundPict.style.transition='none';
		window.chatBackgroundPict.style.backgroundColor='none';
		window.chatBackgroundPict.style.borderRadius='8px';
		window.chatBackgroundPict.style.backgroundSize="100% 100%";
		window.chatBackgroundPict.setBackgroundImage('extension/手杀ui/sayplay/images/saydiv.png');
		window.chatBackgroundPict.style['box-shadow']='none';
		window.chatBackground.appendChild(window.chatBackgroundPict);
		
		window.chatBackgroundColor=ui.create.div('hidden');//内层div
		window.chatBackgroundColor.style.height='70%';
		window.chatBackgroundColor.style.width='80%';
		window.chatBackgroundColor.style.left='10%';
		window.chatBackgroundColor.style.top='10%';
		window.chatBackgroundColor.style.transition='none';
		window.chatBackgroundColor.style.borderRadius='8px';
		window.chatBackgroundColor.style.backgroundSize="100% 100%";
		window.chatBackgroundColor.setBackgroundImage('extension/手杀ui/sayplay/images/nobg.png');//把背景设置为透明
		window.chatBackground.appendChild(window.chatBackgroundColor);
		
		window.chatBackground2=ui.create.div('hidden');
		window.chatBackground2.style.height='100%';
		window.chatBackground2.style.width='100%';
		window.chatBackground2.style.left='0%';
		window.chatBackground2.style.bottom='0%';
		window.chatBackground2.style.transition='none';
		window.chatBackground2.style['text-align']='left';
		window.chatBackground2.innerHTML='';
		window.chatBackground2.style['overflow-y']='scroll';
		lib.setScroll(window.chatBackground2);
		window.chatBackgroundColor.appendChild(window.chatBackground2);
		game.addChatWord();
	}

		 //----------------------------------------------------------------------------------------//
/*
//开始if不是联机
if(lib.config.mode!='connect'){
	lib.skill._wmkzSayChange={
		trigger:{
			global:["gameStart","phaseBegin","phaseAfter","useCardAfter"],
		},
		forced:true,
		filter:function(event,player){
			return player.change_sayFunction!=true;
		},
		content:function(){
			player.change_sayFunction=true;
			player.sayTextWord=player.say;
			player.say=function(str){//对应上面函数，把其他player的发言记录到框里
				game.addChatWord('<font color=red>'+get.translation(''+player.name)+'</font><font color=white>：'+str+'</font>');
				player.sayTextWord(str);
			}
		},
	}
}
//结束if不是联机
*/				
		 //----------------------------------------------------------------------------------------//

			//阶段提示框架（俺杀）
			//自定义播放图片
			game.as_removeText = function() {
				if (_status.as_showText) {
					_status.as_showText.remove();
					delete _status.as_showText;
				}
				if (_status.as_showImage) {
					_status.as_showImage.show();
				}
			}
			game.as_showText = function(str, pos, time, font, size, color) {
				if (!str) return false;
				if (!pos || !Array.isArray(pos)) {
					pos = [0, 0, 100, 100];
				}
				if (!time || (isNaN(time) && time !== true)) time = 3;
				if (!font) font = 'shousha';
				if (!size) size = 16;
				if (!color) color = '#ffffff';
				if (_status.as_showText) {
					_status.as_showText.remove();
					delete _status.as_showText;
				}

				var div = ui.create.div('', str, ui.window);
				div.style.cssText = 'z-index:-3; pointer-events:none; font-family:' + font +
					'; font-size:' + size + 'px; color:' + color + '; line-height:' + size * 1.2 +
					'px; text-align:center; left:' + (pos[0] + pos[2] / 2) + '%; top:' + pos[1] +
					'%; width:0%; height:' + pos[3] +
					'%; position:absolute; transition-property:all; transition-duration:1s';
				_status.as_showText = div;

				if (_status.as_showImage) {
					_status.as_showImage.hide();
				}

				setTimeout(function() {
					div.style.left = pos[0] + '%';
					div.style.width = pos[2] + '%';
				}, 1);

				if (time === true) return true;
				setTimeout(function() {
					if (_status.as_showText) {
						_status.as_showText.remove();
						delete _status.as_showText;
					}
					if (_status.as_showImage) {
						_status.as_showImage.show();
					}
				}, time * 1000);

				return true;
			}
			game.as_removeImage = function() {
				if (_status.as_showImage) {
					_status.as_showImage.remove();
					delete _status.as_showImage;
				}
			}
			game.as_showImage = function(url, pos, time) {
				if (!url) return false;
				if (!pos || !Array.isArray(pos)) {
					pos = [0, 0, 100, 100];
				}
				if (!time || (isNaN(time) && time !== true)) time = 3;
				if (_status.as_showImage) {
					_status.as_showImage.remove();
					delete _status.as_showImage;
				}

				var div = ui.create.div('', '', ui.window);
				div.style.cssText = 'z-index:-1; pointer-events:none; left:' + (pos[0] + pos[2] / 2) +
					'%; top:' + pos[1] + '%; width:0%; height:' + pos[3] +
					'%; position:absolute; background-size:100% 100%; background-position:center center; background-image:url(' +
					lib.assetURL + url + '); transition-property:all; transition-duration:1s';
				_status.as_showImage = div;

				if (_status.as_showText) {
					_status.as_showImage.hide();
				}

				setTimeout(function() {
					div.style.left = pos[0] + '%';
					div.style.width = pos[2] + '%';
				}, 1);

				if (time === true) return true;
				setTimeout(function() {
					if (_status.as_showImage) {
						_status.as_showImage.remove();
						delete _status.as_showImage;
					}
				}, time * 1000);

				return true;
			};


			//-----华丽分割线-----// 

			// if (get.mode() == 'boss') return
			lib.init.onload = function() {
				ui.updated();
				game.documentZoom = game.deviceZoom;
				if (game.documentZoom != 1) {
					ui.updatez();
				}
				ui.background = ui.create.div('.background');
				ui.background.style.backgroundSize = "cover";
				ui.background.style.backgroundPosition = '50% 50%';
				if (lib.config.image_background && lib.config.image_background != 'default' && lib
					.config.image_background.indexOf('custom_') != 0) {
					ui.background.setBackgroundImage('image/background/' + lib.config.image_background +
						'.jpg');
					if (lib.config.image_background_blur) {
						ui.background.style.filter = 'blur(8px)';
						ui.background.style.webkitFilter = 'blur(8px)';
						ui.background.style.transform = 'scale(1.05)';
					}
				}
				document.documentElement.style.backgroundImage = '';
				document.documentElement.style.backgroundSize = '';
				document.documentElement.style.backgroundPosition = '';
				document.body.insertBefore(ui.background, document.body.firstChild);
				document.body.onresize = ui.updatexr;
				if (lib.config.touchscreen) {
					document.body.addEventListener('touchstart', function(e) {
						this.startX = e.touches[0].clientX / game.documentZoom;
						this.startY = e.touches[0].clientY / game.documentZoom;
						_status.dragged = false;
					});
					document.body.addEventListener('touchmove', function(e) {
						if (_status.dragged) return;
						if (Math.abs(e.touches[0].clientX / game.documentZoom - this.startX) >
							10 ||
							Math.abs(e.touches[0].clientY / game.documentZoom - this.startY) >
							10) {
							_status.dragged = true;
						}
					});
				}

				if (lib.config.image_background.indexOf('custom_') == 0) {
					ui.background.style.backgroundImage = "none";
					game.getDB('image', lib.config.image_background, function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							var data = fileLoadedEvent.target.result;
							ui.background.style.backgroundImage = 'url(' + data + ')';
							if (lib.config.image_background_blur) {
								ui.background.style.filter = 'blur(8px)';
								ui.background.style.webkitFilter = 'blur(8px)';
								ui.background.style.transform = 'scale(1.05)';
							}
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.card_style == 'custom') {
					game.getDB('image', 'card_style', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.card_stylesheet) {
								ui.css.card_stylesheet.remove();
							}
							ui.css.card_stylesheet = lib.init.sheet(
								'.card:not(*:empty){background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.cardback_style == 'custom') {
					game.getDB('image', 'cardback_style', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.cardback_stylesheet) {
								ui.css.cardback_stylesheet.remove();
							}
							ui.css.cardback_stylesheet = lib.init.sheet(
								'.card:empty,.card.infohidden{background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
					game.getDB('image', 'cardback_style2', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.cardback_stylesheet2) {
								ui.css.cardback_stylesheet2.remove();
							}
							ui.css.cardback_stylesheet2 = lib.init.sheet(
								'.card.infohidden:not(.infoflip){background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.hp_style == 'custom') {
					game.getDB('image', 'hp_style1', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.hp_stylesheet1) {
								ui.css.hp_stylesheet1.remove();
							}
							ui.css.hp_stylesheet1 = lib.init.sheet(
								'.hp:not(.text):not(.actcount)[data-condition="high"]>div:not(.lost){background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
					game.getDB('image', 'hp_style2', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.hp_stylesheet2) {
								ui.css.hp_stylesheet2.remove();
							}
							ui.css.hp_stylesheet2 = lib.init.sheet(
								'.hp:not(.text):not(.actcount)[data-condition="mid"]>div:not(.lost){background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
					game.getDB('image', 'hp_style3', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.hp_stylesheet3) {
								ui.css.hp_stylesheet3.remove();
							}
							ui.css.hp_stylesheet3 = lib.init.sheet(
								'.hp:not(.text):not(.actcount)[data-condition="low"]>div:not(.lost){background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
					game.getDB('image', 'hp_style4', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.hp_stylesheet4) {
								ui.css.hp_stylesheet4.remove();
							}
							ui.css.hp_stylesheet4 = lib.init.sheet(
								'.hp:not(.text):not(.actcount)>.lost{background-image:url(' +
								fileLoadedEvent.target.result + ')}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.player_style == 'custom') {
					ui.css.player_stylesheet = lib.init.sheet(
						'#window .player{background-image:none;background-size:100% 100%;}');
					game.getDB('image', 'player_style', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.player_stylesheet) {
								ui.css.player_stylesheet.remove();
							}
							ui.css.player_stylesheet = lib.init.sheet(
								'#window .player{background-image:url("' +
								fileLoadedEvent.target.result +
								'");background-size:100% 100%;}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.border_style == 'custom') {
					game.getDB('image', 'border_style', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.border_stylesheet) {
								ui.css.border_stylesheet.remove();
							}
							ui.css.border_stylesheet = lib.init.sheet();
							ui.css.border_stylesheet.sheet.insertRule(
								'#window .player>.framebg{display:block;background-image:url("' +
								fileLoadedEvent.target.result + '")}', 0);
							ui.css.border_stylesheet.sheet.insertRule(
								'.player>.count{z-index: 3 !important;border-radius: 2px !important;text-align: center !important;}',
								0);
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.control_style == 'custom') {
					game.getDB('image', 'control_style', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.control_stylesheet) {
								ui.css.control_stylesheet.remove();
							}
							ui.css.control_stylesheet = lib.init.sheet(
								'#window .control,.menubutton:not(.active):not(.highlight):not(.red):not(.blue),#window #system>div>div{background-image:url("' +
								fileLoadedEvent.target.result + '")}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}
				if (lib.config.menu_style == 'custom') {
					game.getDB('image', 'menu_style', function(fileToLoad) {
						if (!fileToLoad) return;
						var fileReader = new FileReader();
						fileReader.onload = function(fileLoadedEvent) {
							if (ui.css.menu_stylesheet) {
								ui.css.menu_stylesheet.remove();
							}
							ui.css.menu_stylesheet = lib.init.sheet(
								'html #window>.dialog.popped,html .menu,html .menubg{background-image:url("' +
								fileLoadedEvent.target.result +
								'");background-size:cover}');
						};
						fileReader.readAsDataURL(fileToLoad, "UTF-8");
					});
				}

				var proceed2 = function() {
					var mode = lib.imported.mode;
					var card = lib.imported.card;
					var character = lib.imported.character;
					var play = lib.imported.play;
					delete window.game;
					var i, j, k;
					for (i in mode[lib.config.mode].element) {
						if (!lib.element[i]) lib.element[i] = [];
						for (j in mode[lib.config.mode].element[i]) {
							if (j == 'init') {
								if (!lib.element[i].inits) lib.element[i].inits = [];
								lib.element[i].inits.push(mode[lib.config.mode].element[i][j]);
							} else {
								lib.element[i][j] = mode[lib.config.mode].element[i][j];
							}
						}
					}
					for (i in mode[lib.config.mode].ai) {
						if (typeof mode[lib.config.mode].ai[i] == 'object') {
							if (ai[i] == undefined) ai[i] = {};
							for (j in mode[lib.config.mode].ai[i]) {
								ai[i][j] = mode[lib.config.mode].ai[i][j];
							}
						} else {
							ai[i] = mode[lib.config.mode].ai[i];
						}
					}
					for (i in mode[lib.config.mode].ui) {
						if (typeof mode[lib.config.mode].ui[i] == 'object') {
							if (ui[i] == undefined) ui[i] = {};
							for (j in mode[lib.config.mode].ui[i]) {
								ui[i][j] = mode[lib.config.mode].ui[i][j];
							}
						} else {
							ui[i] = mode[lib.config.mode].ui[i];
						}
					}
					for (i in mode[lib.config.mode].game) {
						game[i] = mode[lib.config.mode].game[i];
					}
					for (i in mode[lib.config.mode].get) {
						get[i] = mode[lib.config.mode].get[i];
					}
					lib.init.start = mode[lib.config.mode].start;
					lib.init.startBefore = mode[lib.config.mode].startBefore;
					if (game.onwash) {
						lib.onwash.push(game.onwash);
						delete game.onwash;
					}
					if (game.onover) {
						lib.onover.push(game.onover);
						delete game.onover;
					}
					lib.config.banned = lib.config[lib.config.mode + '_banned'] || [];
					lib.config.bannedcards = lib.config[lib.config.mode + '_bannedcards'] || [];

					lib.rank = window.noname_character_rank;
					delete window.noname_character_rank;
					for (i in mode[lib.config.mode]) {
						if (i == 'element') continue;
						if (i == 'game') continue;
						if (i == 'ai') continue;
						if (i == 'ui') continue;
						if (i == 'get') continue;
						if (i == 'config') continue;
						if (i == 'onreinit') continue;
						if (i == 'start') continue;
						if (i == 'startBefore') continue;
						if (lib[i] == undefined) lib[i] = (Array.isArray(mode[lib.config.mode][
							i
						])) ? [] : {};
						for (j in mode[lib.config.mode][i]) {
							lib[i][j] = mode[lib.config.mode][i][j];
						}
					}
					if (typeof mode[lib.config.mode].init == 'function') {
						mode[lib.config.mode].init();
					}

					var connectCharacterPack = [];
					var connectCardPack = [];
					for (i in character) {
						if (character[i].character) {
							lib.characterPack[i] = character[i].character
						}
						for (j in character[i]) {
							if (j == 'mode' || j == 'forbid') continue;
							if (j == 'connect') {
								connectCharacterPack.push(i);
								continue;
							}
							if (j == 'character' && !lib.config.characters.contains(i) && lib.config
								.mode != 'connect') {
								if (lib.config.mode == 'chess' && get.config('chess_mode') ==
									'leader') {
									for (k in character[i][j]) {
										lib.hiddenCharacters.push(k);
									}
								} else if (lib.config.mode != 'boss' || i != 'boss') {
									continue;
								}
							}
							if (Array.isArray(lib[j]) && Array.isArray(character[i][j])) {
								lib[j].addArray(character[i][j]);
								continue;
							}
							for (k in character[i][j]) {
								if (j == 'character') {
									if (!character[i][j][k][4]) {
										character[i][j][k][4] = [];
									}
									if (character[i][j][k][4].contains('boss') ||
										character[i][j][k][4].contains('hiddenboss')) {
										lib.config.forbidai.add(k);
									}
									if (lib.config.forbidai_user && lib.config.forbidai_user
										.contains(k)) {
										lib.config.forbidai.add(k);
									}
									for (var l = 0; l < character[i][j][k][3].length; l++) {
										lib.skilllist.add(character[i][j][k][3][l]);
									}
								}
								if (j == 'skill' && k[0] == '_' && (!lib.config.characters.contains(
										i) || (lib.config.mode == 'connect' && !character[i]
										.connect))) {
									continue;
								}
								if (j == 'translate' && k == i) {
									lib[j][k + '_character_config'] = character[i][j][k];
								} else {
									if (lib[j][k] == undefined) {
										if (j == 'skill' && lib.config.mode == 'connect' && !
											character[i].connect) {
											lib[j][k] = {
												nopop: character[i][j][k].nopop,
												derivation: character[i][j][k].derivation
											};
										} else {
											lib[j][k] = character[i][j][k];
										}
										if (j == 'card' && lib[j][k].derivation) {
											if (!lib.cardPack.mode_derivation) {
												lib.cardPack.mode_derivation = [k];
											} else {
												lib.cardPack.mode_derivation.push(k);
											}
										}
									} else if (Array.isArray(lib[j][k]) && Array.isArray(character[
											i][j][k])) {
										lib[j][k].addArray(character[i][j][k]);
									} else {
										console.log('dublicate ' + j + ' in character ' + i +
											':\n' + k + '\n' + ': ' + lib[j][k] + '\n' +
											character[i][j][k]);
									}
								}
							}
						}
					}
					var connect_avatar_list = [];
					for (var i in lib.character) {
						connect_avatar_list.push(i);
					}
					connect_avatar_list.sort(lib.sort.capt);
					for (var i = 0; i < connect_avatar_list.length; i++) {
						var ia = connect_avatar_list[i];
						lib.mode.connect.config.connect_avatar.item[ia] = lib.translate[ia];
					}
					if (lib.config.mode != 'connect') {
						var pilecfg = lib.config.customcardpile[get.config('cardpilename') ||
							'当前牌堆'];
						if (pilecfg) {
							lib.config.bannedpile = get.copy(pilecfg[0] || {});
							lib.config.addedpile = get.copy(pilecfg[1] || {});
						} else {
							lib.config.bannedpile = {};
							lib.config.addedpile = {};
						}
					} else {
						lib.cardPackList = {};
					}
					for (i in card) {
						lib.cardPack[i] = [];
						if (card[i].card) {
							for (var j in card[i].card) {
								if (!card[i].card[j].hidden && card[i].translate[j + '_info']) {
									lib.cardPack[i].push(j);
								}
							}
						}
						for (j in card[i]) {
							if (j == 'mode' || j == 'forbid') continue;
							if (j == 'connect') {
								connectCardPack.push(i);
								continue;
							}
							if (j == 'list') {
								if (lib.config.mode == 'connect') {
									lib.cardPackList[i] = card[i][j];
								} else {
									if (lib.config.cards.contains(i)) {
										var pile;
										if (typeof card[i][j] == 'function') {
											pile = card[i][j]();
										} else {
											pile = card[i][j];
										}
										lib.cardPile[i] = pile.slice(0);
										if (lib.config.bannedpile[i]) {
											for (var k = 0; k < lib.config.bannedpile[i]
												.length; k++) {
												pile[lib.config.bannedpile[i][k]] = null;
											}
										}
										for (var k = 0; k < pile.length; k++) {
											if (!pile[k]) {
												pile.splice(k--, 1);
											}
										}
										if (lib.config.addedpile[i]) {
											for (var k = 0; k < lib.config.addedpile[i]
												.length; k++) {
												pile.push(lib.config.addedpile[i][k]);
											}
										}
										lib.card.list = lib.card.list.concat(pile);
									}
								}
							} else {
								for (k in card[i][j]) {
									if (j == 'skill' && k[0] == '_' && (!lib.config.cards.contains(
											i) || (lib.config.mode == 'connect' && !card[i]
											.connect))) {
										continue;
									}
									if (j == 'translate' && k == i) {
										lib[j][k + '_card_config'] = card[i][j][k];
									} else {
										if (lib[j][k] == undefined) {
											if (j == 'skill' && lib.config.mode == 'connect' && !
												card[i].connect) {
												lib[j][k] = {
													nopop: card[i][j][k].nopop,
													derivation: card[i][j][k].derivation
												};
											} else {
												lib[j][k] = card[i][j][k];
											}
										} else console.log('dublicate ' + j + ' in card ' + i +
											':\n' + k + '\n' + lib[j][k] + '\n' + card[i][j][k]);
										if (j == 'card' && lib[j][k].derivation) {
											if (!lib.cardPack.mode_derivation) {
												lib.cardPack.mode_derivation = [k];
											} else {
												lib.cardPack.mode_derivation.push(k);
											}
										}
									}
								}
							}
						}
					}
					if (lib.cardPack.mode_derivation) {
						for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
							if (typeof lib.card[lib.cardPack.mode_derivation[i]].derivation ==
								'string' && !lib.character[lib.card[lib.cardPack.mode_derivation[i]]
									.derivation]) {
								lib.cardPack.mode_derivation.splice(i--, 1);
							} else if (typeof lib.card[lib.cardPack.mode_derivation[i]]
								.derivationpack == 'string' && !lib.config.cards.contains(lib.card[
									lib.cardPack.mode_derivation[i]].derivationpack)) {
								lib.cardPack.mode_derivation.splice(i--, 1);
							}
						}
						if (lib.cardPack.mode_derivation.length == 0) {
							delete lib.cardPack.mode_derivation;
						}
					}
					if (lib.config.mode != 'connect') {
						for (i in play) {
							if (lib.config.hiddenPlayPack.contains(i)) continue;
							if (play[i].forbid && play[i].forbid.contains(lib.config.mode))
								continue;
							if (play[i].mode && play[i].mode.contains(lib.config.mode) == false)
								continue;
							for (j in play[i].element) {
								if (!lib.element[j]) lib.element[j] = [];
								for (k in play[i].element[j]) {
									if (k == 'init') {
										if (!lib.element[j].inits) lib.element[j].inits = [];
										lib.element[j].inits.push(play[i].element[j][k]);
									} else {
										lib.element[j][k] = play[i].element[j][k];
									}
								}
							}
							for (j in play[i].ui) {
								if (typeof play[i].ui[j] == 'object') {
									if (ui[j] == undefined) ui[j] = {};
									for (k in play[i].ui[j]) {
										ui[j][k] = play[i].ui[j][k];
									}
								} else {
									ui[j] = play[i].ui[j];
								}
							}
							for (j in play[i].game) {
								game[j] = play[i].game[j];
							}
							for (j in play[i].get) {
								get[j] = play[i].get[j];
							}
							for (j in play[i]) {
								if (j == 'mode' || j == 'forbid' || j == 'init' || j == 'element' ||
									j == 'game' || j == 'get' || j == 'ui' || j == 'arenaReady')
									continue;
								for (k in play[i][j]) {
									if (j == 'translate' && k == i) {
										// lib[j][k+'_play_config']=play[i][j][k];
									} else {
										if (lib[j][k] != undefined) {
											console.log('dublicate ' + j + ' in play ' + i + ':\n' +
												k + '\n' + ': ' + lib[j][k] + '\n' + play[i][j][
													k
												]);
										}
										lib[j][k] = play[i][j][k];
									}
								}
							}
							if (typeof play[i].init == 'function') play[i].init();
							if (typeof play[i].arenaReady == 'function') lib.arenaReady.push(play[i]
								.arenaReady);
						}
					}

					lib.connectCharacterPack = [];
					lib.connectCardPack = [];
					for (var i = 0; i < lib.config.all.characters.length; i++) {
						var packname = lib.config.all.characters[i];
						if (connectCharacterPack.contains(packname)) {
							lib.connectCharacterPack.push(packname)
						}
					}
					for (var i = 0; i < lib.config.all.cards.length; i++) {
						var packname = lib.config.all.cards[i];
						if (connectCardPack.contains(packname)) {
							lib.connectCardPack.push(packname)
						}
					}
					if (lib.config.mode != 'connect') {
						for (i = 0; i < lib.card.list.length; i++) {
							if (lib.card.list[i][2] == 'huosha') {
								lib.card.list[i] = lib.card.list[i].slice(0);
								lib.card.list[i][2] = 'sha';
								lib.card.list[i][3] = 'fire';
							} else if (lib.card.list[i][2] == 'leisha') {
								lib.card.list[i] = lib.card.list[i].slice(0);
								lib.card.list[i][2] = 'sha';
								lib.card.list[i][3] = 'thunder';
							}
							if (!lib.card[lib.card.list[i][2]]) {
								lib.card.list.splice(i, 1);
								i--;
							} else if (lib.card[lib.card.list[i][2]].mode &&
								lib.card[lib.card.list[i][2]].mode.contains(lib.config.mode) ==
								false) {
								lib.card.list.splice(i, 1);
								i--;
							}
						}
					}

					if (lib.config.mode == 'connect') {
						_status.connectMode = true;
					}
					if (window.isNonameServer) {
						lib.cheat.i();
					} else if (lib.config.dev && (!_status.connectMode || lib.config.debug)) {
						lib.cheat.i();
					}
					lib.config.sort_card = get.sortCard(lib.config.sort);
					delete lib.imported.character;
					delete lib.imported.card;
					delete lib.imported.mode;
					delete lib.imported.play;
					for (var i in lib.init) {
						if (i.indexOf('setMode_') == 0) {
							delete lib.init[i];
						}
					}

					var loadExtensionCallback = function() {
						delete lib.extensions;

						if (lib.init.startBefore) {
							lib.init.startBefore();
							delete lib.init.startBefore;
						}
						ui.create.arena();
						game.createEvent('game', false).setContent(lib.init.start);
						if (lib.mode[lib.config.mode] && lib.mode[lib.config.mode]
							.fromextension) {
							var startstr = mode[lib.config.mode].start.toString();
							if (startstr.indexOf('onfree') == -1) {
								setTimeout(lib.init.onfree, 500);
							}
						}
						delete lib.init.start;
						game.loop();
						app.emit('createArenaAfter');
					};
					if (!_status.connectMode) {
						var loadNextExtension = function() {
							var obj = lib.extensions.shift();
							if (obj) {
								try {
									_status.extension = obj[0];
									_status.evaluatingExtension = obj[3];
									if (obj[4]) {
										if (obj[4].character) {
											for (var j in obj[4].character.character) {
												game.addCharacterPack(get.copy(obj[4]
													.character));
												break;
											}
										}
										if (obj[4].card) {
											for (var j in obj[4].card.card) {
												game.addCardPack(get.copy(obj[4].card));
												break;
											}
										}
										if (obj[4].skill) {
											for (var j in obj[4].skill.skill) {
												game.addSkill(j, obj[4].skill.skill[j],
													obj[4].skill.translate[j], obj[4].skill
													.translate[j + '_info']);
											}
										}
									}
									var func = obj[1](obj[2], obj[4]);
									if (typeof func === 'function') {
										func(loadNextExtension);
									} else {
										loadNextExtension();
									}
								} catch (e) {
									console.log(e);
									loadNextExtension();
								}
							} else {
								delete _status.extension;
								delete _status.evaluatingExtension;
								loadExtensionCallback();
							}
						};
						loadNextExtension();
					} else {
						loadExtensionCallback();
					}
				}
				var proceed = function() {
					if (!lib.db) {
						try {
							lib.storage = JSON.parse(localStorage.getItem(lib.configprefix + lib
								.config.mode));
							if (typeof lib.storage != 'object') throw ('err');
							if (lib.storage == null) throw ('err');
						} catch (err) {
							lib.storage = {};
							localStorage.setItem(lib.configprefix + lib.config.mode, "{}");
						}
						proceed2();
					} else {
						game.getDB('data', lib.config.mode, function(obj) {
							lib.storage = obj || {};
							proceed2();
						});
					}
				};



				if (!lib.imported.mode || !lib.imported.mode[lib.config.mode]) {
					window.inSplash = true;
					clearTimeout(window.resetGameTimeout);
					delete window.resetGameTimeout;
					var clickedNode = false;
					var clickNode = function() {
						if (clickedNode) return;
						this.classList.add('clicked');
						clickedNode = true;
						lib.config.mode = this.link;
						game.saveConfig('mode', this.link);
						
						
						if (game.layout != 'mobile' && lib.layoutfixed.indexOf(lib.config.mode) !==
							-1) {
							game.layout = 'mobile';
							ui.css.layout.href = lib.assetURL + 'layout/' + game.layout +
								'/layout.css';
						} else if (game.layout == 'mobile' && lib.config.layout != 'mobile' && lib
							.layoutfixed.indexOf(lib.config.mode) === -1) {
							game.layout = lib.config.layout;
							if (game.layout == 'default') {
								ui.css.layout.href = '';
							} else {
								ui.css.layout.href = lib.assetURL + 'layout/' + game.layout +
									'/layout.css';
							}
						}
						
						
						
						splash.delete(1000);
						delete window.inSplash;
						window.resetGameTimeout = setTimeout(lib.init.reset, 5000);

						this.listenTransition(function() {
							lib.init.js(lib.assetURL + 'mode', lib.config.mode, proceed);
						}, 500);
					}
					var downNode = function() {
						this.classList.add('glow');
					}
					var upNode = function() {
						this.classList.remove('glow');
					}
					var splash = ui.create.div('#splash', document.body);
					if (lib.config.touchscreen) {
						splash.classList.add('touch');
						lib.setScroll(splash);
					}
					if (lib.config.player_border != 'wide') {
						splash.classList.add('slim');
					}
					splash.dataset.radius_size = lib.config.radius_size;
					for (var i = 0; i < lib.config.all.mode.length; i++) {
						var node = ui.create.div('.hidden', splash, clickNode);
						node.link = lib.config.all.mode[i];
						ui.create.div(node, '.splashtext', get.verticalStr(get.translation(lib.config
							.all.mode[i])));
						if (lib.config.all.stockmode.indexOf(lib.config.all.mode[i]) != -1) {
							
							/*-----------------分割线-----------------*/
							// 启动页素材调用
							// 动态启动页素材调用
							if (lib.config.extension_手杀ui_qiDongYe == 'on') {
								ui.create.div(node, '.avatar').setBackgroundImage('extension/手杀ui/qiDongYe/new/' + lib.config.all.mode[i] + '.jpg'); }
							// 大启动页素材调用
							if (lib.config.extension_手杀ui_qiDongYe == 'othersOn') {
								ui.create.div(node, '.avatar').setBackgroundImage('extension/手杀ui/qiDongYe/big/' + lib.config.all.mode[i] + '.jpg'); }
							// 选择关闭时调用本体素材
							if (lib.config.extension_手杀ui_qiDongYe == 'off') {
								ui.create.div(node, '.avatar').setBackgroundImage('image/splash/' + lib.config.all.mode[i] + '.jpg'); }
							/*-----------------分割线-----------------*/
							
						} else {
							var avatarnode = ui.create.div(node, '.avatar');
							var avatarbg = lib.mode[lib.config.all.mode[i]].splash;
							if (avatarbg.indexOf('ext:') == 0) {
								avatarnode.setBackgroundImage(avatarbg.replace(/ext:/, 'extension/'));
							} else {
								avatarnode.setBackgroundDB(avatarbg);
							}
						}
						if (!lib.config.touchscreen) {
							node.addEventListener('mousedown', downNode);
							node.addEventListener('mouseup', upNode);
							node.addEventListener('mouseleave', upNode);
						}
						setTimeout((function(node) {
							return function() {
								node.show();
							}
						}(node)), i * 100);
					}
					if (lib.config.mousewheel) {
						splash.onmousewheel = ui.click.mousewheel;
					}
				} else {
					proceed();
				}
				localStorage.removeItem(lib.configprefix + 'directstart');
				delete lib.init.init;
			};

			if (lib.config.dev) {
				window.app = app;
			}

		},

		config: {
			KZJS: {
				name: '<div class="shousha">扩展介绍<font size="5px" color="gold">⇨</font></div>',
				clear: true,
				onclick: function() {
					if (this.KZJS == undefined) {
						var more = ui.create.div('.KZJS', '<div style="border: 1px solid gray">' +
							'<font size=2px>' +
							'本扩展偏向于细节上的美化，附带一点娱乐性，需要搭配十周年UI使用，以便拥有更好的扩展体验<br>' +
							'在众多大佬的帮助下，本扩展拥有了很高的还原度。感谢为爱发电的大佬们<br>(*˘︶˘*).｡.:*♡<br>' +
							'无名杀是非盈利游戏，祝你游戏愉快</font></div>');
						this.parentNode.insertBefore(more, this.nextSibling);
						this.KZJS = more;
						this.innerHTML = '<div class="shousha">扩展介绍<font size="5px">⇩</font></div>';
					} else {
						this.parentNode.removeChild(this.KZJS);
						delete this.KZJS;
						this.innerHTML = '<div class="shousha">扩展介绍<font size="5px">⇨</font></div>';
					};
				}
			},
			CKGX: {
				"name": "<span class=\"texiaotext\" style=\"color:yellow\">【点击查看更新】</span>",
				"init": "1",
				"intro": "查看更新内容",
				"item": {
					"1": " ",
					"0": " ",
					"2":"<span style=\"animation: -webkit-animation:fairy 20s infinite;animation:fairy 10s infinite;\">子琪在3.23版本基础上使用无名补丁进行更新</span>",
					"3":"(づ ●─● )づ",
					"4":"",
					"5":"<span class=\"playext\" style=\"color:#87CEFA\">更新内容 > > > </span><br><br><span class=\"playext\" style=\"color:gold\">界面优化</span><li>判断扩展设备运行端，调整对应参数，不会出现字体色彩显示异常的情况了。一些新彩蛋<br><span class=\"playext\" style=\"color:yellow\">资料页&&二级菜单</span><li>手杀样式下，长按武将可以显示武将资料（滑稽）。手杀样式or十周年样式下，点击右上角的菜单按钮可以弹出二级菜单选项。（包括：将军请走此小道）<br><span class=\"playext\" style=\"color:pink\">细节优化</span><li>添加手杀样式下的人机出牌指示，调整字体渐变色。添加了很多很多的注释，便于玩家进行参数修改<br><span class=\"playext\" style=\"color:gold\">AI进度条</span><li>添加手杀样式and十周年样式下的人机出牌进度条，以及回合外进度条<br><span class=\"playext\" style=\"color:orange\">启动页功能</span><li>不用再通过替换本体文件来实现启动页美化了。扩展内可切换。感谢阳光微凉提供美化素材<br><span class=\"playext\" style=\"color:blue\">聊天框架</span><li>感谢群小乔的帮助，手杀样式下，点击左下角的聊天按钮，可以弹出聊天框，需要配件祖安武将之类的扩展进行使用。如果【说话】扩展处于开启状态，将打开新聊天框。<br><br><br><br>",		
					
					"6": "<span style=\"animation: -webkit-animation:fairy 20s infinite;animation:fairy 10s infinite;\">最新日期:1.25</span>",
					"7": "～(￣▽￣～)~",
					"8": " ",
					"9": "<span class=\"playext\" style=\"color:#87CEFA\">更新内容 > > > </span><br><br><span class=\"playext\" style=\"color:gold\">修复bug</span><li>修复无懈可击，整理手牌不能使用的bug<br><span class=\"playext\" style=\"color:yellow\">狗托播报</span><li>由群友提出想法，在游戏对局中界面顶部出现滚动栏（有彩蛋）<br><span class=\"playext\" style=\"color:pink\">细节优化</span><li>进度条素材优化，界面布局再优化<br><span class=\"playext\" style=\"color:orange\">彩色渐变字体</span><li>仿手杀的技能字体，感觉不太像。<br><br><br><br>",
				}
			},
			MX: {
				"name": "鸣谢表",
				"init": "1",
				"item": {
					"1": "点击查看",
					"2": "永远的萌新",
					"3": "Empty city°",
					"4": "阿七",
					"5": "神秘喵",
					"6": "꧁꫞꯭✨fly✨꯭꫞꧂",
					"7": "俺杀",
					"8": "呲牙哥",
					"9": "寻",
					"10": "喋血长歌",
					"11": "弩弩弩",
					"12": "萝卜",
					"13": "可宣",
					"14": "黄老板",
					"15": "只叹年华未央",
					"16": "风雪弥漫",
					"17": "阳光微凉",
					"18": "零二哟",
					"19": "群小乔",

				},
				"textMenu": function(node, link) {
					lib.setScroll(node.parentNode);
					node.parentNode.style.transform = "translateY(-100px)";
					node.parentNode.style.height = "500px";
					node.parentNode.style.width = "300px";
					//node.style.width="400px";
					switch (link) {
						case "1":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/MX.png><br>鸣谢名单";
							break;
						case "2":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zXY.png><br>提供技术指导，修复无懈可击bug。整理手牌bug。";
							break;
						case "3":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zE.png><br>参与更新测试，完善手杀样式细节优化，提出顶部滚动栏意见";
							break;
						case "4":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zAQ.png><br>提供素材美化，手牌，菜单按钮等。";
							break;
						case "5":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zSMM.png><br>提供技术指导，非常感谢(●—●)";
							break;
						case "6":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zfly.png><br>提供魔改框架，手牌显示等等";
							break;
						case "7":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zAS.png><br>提供技术指导，阶段提示框架和代码，身份提示等";
							break;
						case "8":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zCYG.png><br>提供技术指导，进度条技术，添加图片框架";
							break;
						case "9":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zX.png><br>更新样式切换功能，文件分开调用";
							break;
						case "10":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zDXZG.png><br>提供宝贵意见和帮助";
							break;
						case "11":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zNU.png><br>提供手杀素材";
							break;
						case "12":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zLB.png><br>提供素材和意见";
							break;
						case "13":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zKX.png><br>提供帮助和狗托播报的部分文案";
							break;
						case "14":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zHLB.png><br>提供部分素材和帮助";
							break;
						case "15":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zZTNH.png><br>提供帮助，部分细节代码，参与测试";
							break;
						case "16":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zFXMM.png><br>提供帮助和手杀样式的一些细节建议";
							break;
						case "17":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zYGWL.png><br>提供美化页素材和帮助";
							break;
						case "18":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zLE.png><br>提供建议和渐变色图片方案";
							break;
					  	case "19":
							node.innerHTML = "<img style=width:50px src=" + lib.assetURL +
								"extension/手杀ui/lbtn/images/MX/zXQ.png><br>提供聊天框架和技术指导";
							break;
					}
				},
			},

			ZLLT:{
				init: true,
				name: "资料页露头(重启生效)",
				intro: "手杀样式下，点击武将资料页会适配露头皮肤。",
			},
			jindutiao: {
				init: true,
				intro: "自己回合内显示进度条带素材，十周年",
				name: "进度条"
			},
			jindutiaoYangshi: {
				name: "进度条样式",
				init: "1",
				intro: "切换进度条样式，可根据个人喜好切换手杀进度条或十周年进度条，切换后重启生效",
				item: {
					"1": "手杀进度条",
					"2": "十周年PC端进度条",
					"3": "十周年客户端进度条",
				},
			},
			JDTS: {
				init: true,
				intro: "在自己回合内显示对应阶段图片提示，回合外AI显示进度条",
				name: "阶段提示"
			},
			JDTSYangshi: {
				name: "阶段提示样式",
				init: "1",
				intro: "切换阶段提示样式，可根据个人喜好切换",
				item: {
					"1": "手杀阶段提示",
					"2": "十周年阶段提示",
				},
			},
			GTBB: {
				init: false,
				intro: "开启后，顶部会出现滚动播报栏。PS:狗托误我啊！",
				name: "狗托播报"
			},
			yangShi: {
				name: '<b><font color=\"#00FFFF\">界面布局',
				init: 'on',
				intro: '切换手杀UI界面样式，初始为手杀样式，可根据个人喜好切换手杀样式或十周年样式，切换后重启生效',
				item: {
					on: '<b><font color=\"#80FF80\">手杀样式',
					off: '<b><font color=\"#FFFF00\">十周年样式',
				},
			},
			qiDongYe: {
				name: '<b><font color=\"#FF0000\">启动页',
				init: 'othersOn',
				intro: '可直接通过此功能切换启动页样式',
				item: {
					on: '<b><font color=\"#FF3000\">启动页-动态',
					othersOn: '<b><font color=\"#0080FF\">启动页-大图',
					off: '<b><font color=\"#00FF00\">关闭',
				},
			},
			
			import: {
				name: '该扩展原作者为程序猿（暂时没有得到原作者允许）',
				clear: true,
			},
		},
		package:{
		intro: "子琪使用无名补丁提供的代码修改方法进行更新，并补充新的砸蛋道具。</br>砸蛋道具的图片素材位于image/emotion/throw_emotion/，</br>音效素材位于audio/effect/。</br>修复了关闭无名补丁扩展的【转换修改】功能后报错的BUG",
		},
		editable: false,
	};
});
