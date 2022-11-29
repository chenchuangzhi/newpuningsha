app.import(function (lib, game, ui, get, ai, _status, app) {
	
	/*-----------------分割线-----------------*/
	/*-----------------分割线-----------------*/
	if (lib.config.extension_手杀ui_yangShi == 'on') {
	// 手杀样式身份加载显示
	game.ui_identityShow_update=function(){
		var identityShow=game.ui_identityShow;
		var str='';
		if(lib.config.mode=='guozhan'){
			var list=['unknown'].concat(lib.group);
			for(var i=0;i<list.length;i++){
				var num=game.countPlayer(function(current){
					return current.identity==list[i];
				});
				if(num) str+=get.translation(list[i])+' x '+num+' '
			}
		}
		else{
			var zhu=game.countPlayer(function(current){
				return current.identity=='zhu'||current.identity=='rZhu'||current.identity=='bZhu';
			})
			var zhong=game.countPlayer(function(current){
				return current.identity=='zhong'||current.identity=='rZhong'||current.identity=='bZhong'||current.identity=='mingzhong';
			})
			var fan=game.countPlayer(function(current){
				return current.identity=='fan'||current.identity=='rYe'||current.identity=='bYe';
			})
			var nei=game.countPlayer(function(current){
				return current.identity=='nei'||current.identity=='rNei'||current.identity=='bNei';
			})
			if(zhu>0) str+='<font color="#ae5f35">'+get.translation('zhu')+'</font> x '+zhu+' ';
			if(zhong>0) str+='<font color="#e9d765">'+get.translation('zhong')+'</font> x '+zhong+' ';
			if(fan>0) str+='<font color="#87a671">'+get.translation('fan')+'</font> x '+fan+' ';
			if(nei>0) str+='<font color="#9581c4">'+get.translation('nei')+'</font> x '+nei;
		}
		
		
		str+='<br>'+get.translation(game.me.identity+'_win_option');
		// identityShow.innerHTML='<span style="font-family:shousha; font-size: 17.5px; font-weight: 700; text-align: right; line-height: 20px; color: #FFFFAA; -webkit-text-stroke: 0px #000000;">'+str+'</span>';
		
		if(lib.device == 'ios' || lib.device == 'android') {
		identityShow.innerHTML='<span style="font-family:shousha; font-size: 17.5px; font-weight: 700; text-align: right; line-height: 20px; color: #958371; -webkit-text-stroke: 0.2px #000000; text-shadow:-0.8px -0.8px 1px #2b1f19，0.8px 0.8px 1px #2b1f19;">'+str+'</span>';
		} else {
		identityShow.innerHTML='<span style="font-family:shousha; font-size: 17.5px; font-weight: 700; text-align: right; line-height: 20px; color: #958371; text-shadow:-0.8px -0.8px 1px #2b1f19，0.8px 0.8px 1px #2b1f19;">'+str+'</span>'; 
		}
	}
	
	game.ui_identityShow_init=function(){
		if(game.ui_identityShow==undefined){
			game.ui_identityShow=ui.create.div('','身份加载中......');
			game.ui_identityShow.style.top='-0.5px';
			game.ui_identityShow.style.left='63.5px';
			ui.arena.appendChild(game.ui_identityShow);
		}
	}
	
	lib.arenaReady.push(function(){
		//身份：normal,zhong,purple
		if(lib.config.mode=='identity'||lib.config.mode=='doudizhu'||lib.config.mode=='guozhan'){
			if(lib.config.mode=='doudizhu'){
				//斗地主
				var translate={
					zhu:'击败农民',
					fan:'击败地主',
					undefined:'未选择阵营',
				}
			} else if(lib.config.mode=='guozhan'){
				//国战
				var translate={
					undefined:'未选择势力',
					unknown:'保持隐蔽',
					ye:'击败所有非野势力角色',
				}
				for(var i=0;i<lib.group.length;i++){
					translate[lib.group[i]]='击败所有非'+get.translation(lib.group[i])+'势力角色';
				}
			} else if(lib.config.mode=='identity'&&get.config('identity_mode')=='purple'){
				//身份：3v3v2
				var translate={
					rZhu:'击杀冷方主公与野心家',
					rZhong:'协助暖方主公<br>击杀冷方主公与野心家',
					rYe:'找出冷方野心家<br>击杀左右其他玩家',
					rNei:'协助冷方主公<br>击杀暖方主公与野心家',
					bZhu:'击杀暖方主公与野心家',
					bZhong:'协助冷方主公<br>击杀暖方主公与野心家',
					bYe:'找出暖方野心家<br>击杀左右其他玩家',
					bNei:'协助暖方主公<br>击杀冷方主公与野心家',
				}
			} else {
				//身份：标准、明忠
				var translate={
					zhu:'推测场上身份<br>击败反贼内奸',
					zhong:'保护主公<br>取得最后胜利',
					fan:'找出反贼队友<br>全力击败主公',
					nei:'找出反贼忠臣<br>最后击败主公',
				}
			}
			for(var i in translate){
				lib.translate[i+'_win_option']=translate[i];
			}
			game.ui_identityShow_init();
			setInterval(function(){
					game.ui_identityShow_update();
			},1000);
		}
	});
	
	}
	/*-----------------分割线-----------------*/
	
	
	
	
	
	
	
	
	
	
		/*-----------------分割线-----------------*/
		if (lib.config.extension_手杀ui_yangShi == 'on') {
			// 手杀样式界面按键
			// 菜单
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/SSSC/button.png"
			head.style.cssText="display: block;--w: 130px;--h: calc(var(--w) * 1080/1434);width: var(--w);height: var(--h);position: absolute;bottom: calc(100% - 98px);left: calc(100% - 126.2px);background-color: transparent;z-index:1"
			document.body.appendChild(head);
			
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/SSSC/liaotian.png"
			head.style.cssText="display: block;--w: 125px;--h: calc(var(--w) * 1019/1400);width: var(--w);height: var(--h);position: absolute;top: calc(100% - 90px);right: calc(100% - 122px);background-color: transparent;z-index:3"
			head.onclick=function(){
				if(lib.config['extension_说话_enable']){
					game.showChatWordBackground();
				} else {
					game.showChatWordBackgroundX();
				}
			}
			document.body.appendChild(head);
			
			var head = ui.create.node('div');
			head.style.cssText="display: block;width: 134px;height: 103px;position: absolute;top: 0px;right: -8px;background-color: transparent;z-index:1"
			head.onclick = function() {
				game.playAudio('../extension/手杀ui/lbtn/images/SSSC/label.mp3');
				var popuperContainer = ui.create.div('.popup-container', {background: "rgb(0,0,0,0)"}, ui.window);
				popuperContainer.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SSSC/caidan.mp3');
					event.stopPropagation();
					popuperContainer.delete(200);
				});
				var yemian = ui.create.div('.yemian', popuperContainer);
				var shezhi = ui.create.div('.shezhi', popuperContainer);
				shezhi.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SSSC/xuanzhe.mp3');
					if(!ui.click.configMenu) return;
					game.closePopped();
					game.pause2();
					ui.click.configMenu();
					ui.system1.classList.remove('shown');
					ui.system2.classList.remove('shown');
				});
				var tuichu = ui.create.div('.tuichu', popuperContainer);
				tuichu.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SSSC/xuanzhe.mp3');
					window.location.reload();
				});
				var taopao = ui.create.div('.taopao', popuperContainer);
				taopao.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SSSC/xuanzhe.mp3');
					game.reload();
				});
				var touxiang = ui.create.div('.touxiang', popuperContainer);
				touxiang.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SSSC/xuanzhe.mp3');
					game.over();
				});
				var tuoguan = ui.create.div('.tuoguan', popuperContainer);
				tuoguan.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SSSC/xuanzhe.mp3');
					ui.click.auto();
				});
			}
			
			document.body.appendChild(head)
			
			/*-----------------分割线-----------------*/
			
			if(lib.device == 'ios' || lib.device == 'android'){
			// 房间号
			var head = ui.create.node('div');
			head. innerText="房间号:"
			head.style.cssText="display: block; position: absolute; top: 86px; color: #97856A; right: 123px; font-size:20px; letter-spacing: 1.5px; font-family:shousha; font-weight: 900; text-shadow:-1.7px 0px 2.5px #2B1F19, 0px -1.7px 2.5px #2B1F19, 1.7px 0px 2.5px #2B1F19 ,0px 1.7px 2.5px #2B1F19; -webkit-text-stroke: 0.5px black !important; z-index:1; "
			document.body.appendChild(head);
			
			// 房间号码
			var head = ui.create.node('div');
			head. innerText=num=Math.floor(Math.random()*(999999-100000+1)+100000);
			head.style.cssText="display: block; position: absolute; top: 85px; right: 58px; font-size:21px; font-family:'shousha'; color: #97856A; font-weight: 900; text-shadow:-1.7px 0px 2.5px #2B1F19, 0px -1.7px 2.5px #2B1F19, 1.7px 0px 2.5px #2B1F19 ,0px 1.7px 2.5px #2B1F19; -webkit-text-stroke: 0.5px black !important; z-index:1"
			document.body.appendChild(head);
			
			} else {
			
			// 房间号
			var head = ui.create.node('div');
			head. innerText="房间号:"
			head.style.cssText="display: block; position: absolute; top: 86px; color: #97856A; right: 123px; font-size:20px; letter-spacing: 1.5px; font-family:shousha; font-weight: 900; text-shadow:-1.7px 0px 2.5px #2B1F19, 0px -1.7px 2.5px #2B1F19, 1.7px 0px 2.5px #2B1F19 ,0px 1.7px 2.5px #2B1F19; -webkit-text-stroke: 0px black !important; z-index:1; "
			document.body.appendChild(head);
			
			// 房间号码
			var head = ui.create.node('div');
			head. innerText=num=Math.floor(Math.random()*(999999-100000+1)+100000);
			head.style.cssText="display: block; position: absolute; top: 85px; right: 58px; font-size:21px; font-family:'shousha'; color: #97856A; font-weight: 900; text-shadow:-1.7px 0px 2.5px #2B1F19, 0px -1.7px 2.5px #2B1F19, 1.7px 0px 2.5px #2B1F19 ,0px 1.7px 2.5px #2B1F19; -webkit-text-stroke: 0px black !important; z-index:1"
			document.body.appendChild(head);
			}
			
			/*-----------------分割线-----------------*/
			
			// 边框
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/SSSC/shenfen.png"
			head.style.cssText="display: block;width: 30%;height: 9.2%;position: absolute;top: 0px;left: -26px;background-color: transparent;z-index:-1"
			document.body.appendChild(head);
		
		/***********************分割线**********************/
		
		} else {
		
		/***********************分割线**********************/
		
			// 十周年样式界面按键
			// 界面阴影
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/SZNSC/yinying.png"
			head.style.cssText="display: block;width: 100%;height: 40%;position: absolute;bottom: 0px;background-color: transparent;z-index:-4"
			document.body.appendChild(head);
			
			// 菜单
			/*
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/button3.png"
			head.style.cssText="display: block;width: 164px;height: 120px;position: absolute;top: 0px;right: 0px;background-color: transparent;z-index:1"
			head.onclick = function() {
				// head.remove()
				if(!ui.click.configMenu) return;
				game.closePopped();
				game.pause2();
				ui.click.configMenu();
				ui.system1.classList.remove('shown');
				ui.system2.classList.remove('shown');
			}
			document.body.appendChild(head);
			*/
			/***********************分割线**********************/
			
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/SZNSC/button3.png"
			head.style.cssText="display: block;--w: 56px;--h: calc(var(--w) * 74/71);width: var(--w);height: var(--h);position: absolute;bottom: calc(100% - 69px);left: calc(100% - 112.5px);background-color: transparent;z-index:1"
			head.onclick = function(){
				head.style.transform='scale(0.95)';
			}
			document.body.appendChild(head);
			
			var head = ui.create.node('div');
			head.style.cssText="display: block;--w: 56px;--h: calc(var(--w) * 74/71);width: var(--w);height: var(--h);position: absolute;bottom: calc(100% - 69px);left: calc(100% - 112.5px);background-color: transparent;z-index:1"
			head.onclick = function() {
				game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/click.mp3');
				var popuperContainer = ui.create.div('.popup-container', {background: "rgb(0,0,0,0)"}, ui.window);
				popuperContainer.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/back.mp3');
					event.stopPropagation();
					popuperContainer.delete(200);
				});
				var HOME = ui.create.div('.HOME', popuperContainer);
				var SZ = ui.create.div('.SZ', popuperContainer);
				SZ.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/button.mp3');
					if(!ui.click.configMenu) return;
					game.closePopped();
					game.pause2();
					ui.click.configMenu();
					ui.system1.classList.remove('shown');
					ui.system2.classList.remove('shown');
				});
				var LK = ui.create.div('.LK', popuperContainer);
				LK.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/button.mp3'); 
					window.location.reload();
				});
				var BJ = ui.create.div('.BJ', popuperContainer);
				BJ.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/button.mp3');
					// 换背景
					var Backgrounds =["人间安乐","兵临城下","兵荒马乱","三国开黑节","华灯初上","天书乱斗","朝堂之上","校园行","桃园风格","汉室当兴","游卡桌游"];
					ui.background.setBackgroundImage("extension/手杀ui/lbtn/images/background/"+Backgrounds.randomGet()+".jpg");
				});
				var TX = ui.create.div('.TX', popuperContainer);
				TX.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/button.mp3');
					game.over();
				});
				var TG = ui.create.div('.TG', popuperContainer);
				TG.addEventListener('click', event => {
					game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/button.mp3');
					ui.click.auto();
				});
			}
			document.body.appendChild(head);
			/***********************分割线**********************/
			
			// 整理手牌
			var head = ui.create.node('img');
			head.src= lib.assetURL + "extension/手杀ui/lbtn/images/SZNSC/zhengli.png"
			// 整理手牌，若有显示左右偏移，自行调节right属性
			// head.style.cssText="display: block;width: 80px;height: 26px;position: absolute;bottom: 1%;right: 295px;background-color: transparent;z-index:4"
			head.style.cssText="display: block;--w: 88px;--h: calc(var(--w) * 81/247);width: var(--w);height: var(--h);position: absolute;top: calc(100% - 33px);left: calc(100% - 380px);background-color: transparent;z-index:4"

			
			head.onclick = function() {
				// head.onclick=ui.click.sortCard;
				var cards = game.me.getCards("hs");
				var sort2 = function(b, a) {
				if (a.name != b.name) return lib.sort.card(a.name, b.name);
					else if (a.suit != b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
					else return a.number - b.number;
				};
				if (cards.length > 1) {
					cards.sort(sort2);
					cards.forEach(function(i, j) {
						game.me.node.handcards1.insertBefore(cards[j], game.me.node.handcards1.firstChild);
				});
				dui.queueNextFrameTick(dui.layoutHand, dui);
				}
			}
			document.body.appendChild(head);
		}
		/*-----------------分割线-----------------*/
	
	
	
	
	
	
	
	
	
	
	
	
	var plugin = {
		name: 'lbtn',
		filter: function () {
			return !['chess', 'tafang', 'stone', 'connect'].contains(get.mode());
		},
		content: function (next) {
			lib.skill._uicardupdate = {
				trigger: { player: 'phaseJieshuBegin' },
				forced: true,
				unique: true,
				popup: false,
				silent: true,
				noLose: true,
				noGain: true,
				noDeprive: true,
				priority: -Infinity,
				filter: function (event, player) {
					return player==game.me
				},
				content: function () {
					if(ui.updateSkillControl) ui.updateSkillControl(game.me, true);
				}
			},
			
			app.waitAllFunction([
				function(next) {
					game.saveConfig('custom_button', false);
					next();
				},
				function (next) {
				/*-----------------分割线-----------------*/
				// 界面显示附件
				if (lib.config.extension_手杀ui_yangShi == 'on') {
					if (lib.device == 'ios' || lib.device == 'android') {
						lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main1_mobile', next);
					} else {
						lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main1_pc', next);
					}
				} else {
					lib.init.css(lib.assetURL + 'extension/' + app.name + '/' + plugin.name, 'main2', next);
				}
				/*-----------------分割线-----------------*/
				},
			], next);
		},
		
		precontent: function () {
			app.reWriteFunction(game, {
				updateRoundNumber: [function() {
					if (ui.cardRoundTime) {
						ui.cardRoundTime.updateRoundCard();
					}
				}],
			});
			Object.assign(game.videoContent, {
				createCardRoundTime: function() {
					ui.cardRoundTime = plugin.create.cardRoundTime();
				},
				createhandcardNumber: function() {
					ui.handcardNumber = plugin.create.handcardNumber();
				},
				updateCardRoundTime: function(opts) {
					if (!ui.cardRoundTime) return;
					ui.cardRoundTime.node.roundNumber.innerHTML = '<span>第' + game.roundNumber + '轮</span>';
					ui.cardRoundTime.setNumberAnimation(opts.cardNumber);
				},
				updateCardnumber: function(opts) {
					if (!ui.handcardNumber) return;
					// ui.handcardNumber.setNumberAnimation(opts.cardNumber);
				},
			});
			app.reWriteFunction(ui.create, {
				me: [function() {
					plugin.create.control();
				}, null],
				arena: [null, function() {
					if (ui.time3) {
						clearInterval(ui.time3.interval);
							ui.time3.delete();
					}
					if (ui.cardPileNumber) ui.cardPileNumber.delete();
					ui.cardRoundTime = plugin.create.cardRoundTime();
					ui.handcardNumber = plugin.create.handcardNumber();
				}],
				cards: [null, function() {
					if (ui.cardRoundTime) {
						ui.cardRoundTime.updateRoundCard();
					}
				}],
			});
			
			app.reWriteFunction(lib.configMenu.appearence.config, {
				update: [null, function(res, config, map) {
					map.control_style.hide();
					map.custom_button.hide();
					map.custom_button_system_top.hide();
					map.custom_button_system_bottom.hide();
					map.custom_button_control_top.hide();
					map.custom_button_control_bottom.hide();
					map.radius_size.hide();
				}],
			});
			
			ui.create.confirm = function(str, func) {
				var confirm = ui.confirm;
				if (!confirm) {
					confirm = ui.confirm = plugin.create.confirm();
				}
				confirm.node.ok.classList.add('disabled');
				confirm.node.cancel.classList.add('disabled');
				if (_status.event.endButton) {
					ui.confirm.node.cancel.classList.remove('disabled');
				}
				if (str) {
					if (str.indexOf('o') !== -1) {
						confirm.node.ok.classList.remove('disabled');
					}
					if (str.indexOf('c') !== -1) {
						confirm.node.cancel.classList.remove('disabled');
					}
					confirm.str = str;
				}
				if (func) {
					confirm.custom = func;
				}
				ui.updatec();
				confirm.update();
			};
		},
		
		
		create: {
			control: function() {
			},
			confirm: function () {
			//确定文本
			
			if (lib.config.extension_手杀ui_yangShi == 'on') {
				var confirm = ui.create.control('<span></span>', 'cancel');
			} else {
				var confirm = ui.create.control('<span>确定</span>', 'cancel');
			}
			
				confirm.classList.add('lbtn-confirm');
				confirm.node = {
					ok: confirm.firstChild,
					cancel: confirm.lastChild,
				};
				if(_status.event.endButton){
					_status.event.endButton.close();
					// delete event.endButton;
				}
				confirm.node.ok.link = 'ok';
				confirm.node.ok.classList.add('primary');
				confirm.node.cancel.classList.add('primary2');
				confirm.custom = plugin.click.confirm;
				app.reWriteFunction(confirm, {
					close: [function() {
						this.classList.add('closing');
					}],
				});
				for (var k in confirm.node) {
					confirm.node[k].classList.add('disabled');
					confirm.node[k].removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', ui.click.control);
					confirm.node[k].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function(e) {
						e.stopPropagation();
						if (this.classList.contains('disabled')) {
							if (this.link === 'cancel' && this.dataset.type === 'endButton' && _status.event.endButton) {
								_status.event.endButton.custom();
								ui.confirm.close();
								// ui.updatec();
							}
							return;
						}
						if (this.parentNode.custom) {
							this.parentNode.custom(this.link, this);
						}
					});
				}
				
				
				if (ui.skills2 && ui.skills2.skills.length) {
					var skills = ui.skills2.skills;
					confirm.skills2 = [];
					for (var i = 0; i < skills.length; i++) {
						var item = document.createElement('div');
						item.link = skills[i];
						item.innerHTML = get.translation(skills[i]);
						item.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function(e) {
							e.stopPropagation();
							ui.click.skill(this.link);
						});
						item.dataset.type = 'skill2';
					/*-----------------分割线-----------------*/
					// 全局技能样式
					if (lib.config.extension_手杀ui_yangShi == 'on') {
						// 手杀样式
						confirm.insertBefore(item, confirm.firstChild);
					} else {
						// 十周年样式
						if(ui.updateSkillControl) ui.updateSkillControl(game.me, true);
					}
					/*-----------------分割线-----------------*/
					}
				}
				
				
				confirm.update = function() {
					if (confirm.skills2) {
						if (_status.event.skill && _status.event.skill !== confirm.dataset.skill) {
							confirm.dataset.skill = _status.event.skill;
							confirm.skills2.forEach(function (item) {
								item.remove();
							});
							ui.updatec();
						} else if (!_status.event.skill && confirm.dataset.skill) {
							delete confirm.dataset.skill;
							confirm.skills2.forEach(function (item) {
								confirm.insertBefore(item, confirm.firstChild);
							});
							ui.updatec();
						}
					}
					if(ui.updateSkillControl) ui.updateSkillControl(game.me, true);
				};
				return confirm;
			},
			
			/*-----------------分割线-----------------*/
			handcardNumber: function() {
				var node3 = ui.create.div('.settingButton', ui.arena, plugin.click.setting);
			/*-----------------分割线-----------------*/
			// 局内界面按键
			// 手杀样式
			if (lib.config.extension_手杀ui_yangShi == 'on') {
				var node2 = ui.create.div('.lbtn-controls', ui.arena); // 不同
				ui.create.div('.lbtn-control', node2, '牌序', plugin.click.paixu); // 不同
				ui.create.div('.lbtn-control', node2, '记录', ui.click.pause); // 不同
			} else {
			// 十周年样式
				/* ui.create.div('.lbtn-controls', ui.arena); */ // 不同
				var node5 = ui.create.div('.huanfuButton',ui.arena, plugin.click.huanfu); // 不同
				var node2 = ui.create.div('.jiluButton',ui.arena, ui.click.pause); // 不同
			}
			/*-----------------分割线-----------------*/
				
				var node4 = ui.create.div('.tuoguanButton', ui.arena, ui.click.auto);
				var node = ui.create.div('.handcardNumber', ui.arena).hide();
				
				node.node = {
					cardPicture: ui.create.div('.cardPicture', node),
					cardNumber: ui.create.div('.cardNumber', node),
				};
				
				// 手牌显示
				node.updateCardnumber = function() {
					if (!game.me) return;
					var cardNumber2 = game.me.countCards('h') || 0;
					var cardNumber = game.me.getHandcardLimit() || 0;
					var numbercolor ='white';
					if(cardNumber2>cardNumber) numbercolor ='white';
					if(cardNumber == Infinity) cardNumber = '∞'
				
				/*-----------------分割线-----------------*/
				if (lib.config.extension_手杀ui_yangShi == 'on') {
				// 手杀样式
					this.node.cardNumber.innerHTML = /*'</span>' */'<span style="font-size: 18px;font-family: HYZLSJ">'+ '<font size=5 >' + cardNumber2 +	'</font>' + '<font size=4.5 face="shousha">' + '/' + '<font color=' + numbercolor + ' size=4.8 face="HYZLSJ">' + cardNumber + '</font>'+ '</span>';
				} else {
				// 十周年样式
				this.node.cardNumber.innerHTML = '</span>' + /*'<font color=' + numbercolor + ' > '*/ + cardNumber2+ '</font>' + '<font size=4 face="shousha">' + '/' + '</font>' + cardNumber +'</span>'
				}
				/*-----------------分割线-----------------*/
					// this.setNumberAnimation(cardNumber);
					this.show();
					game.addVideo('updateCardnumber', null, {
						cardNumber: cardNumber,
					});
				};
				
				node.node.cardNumber.interval =	setInterval(function() {
					ui.handcardNumber.updateCardnumber()
				}, 1000);
				// game.addVideo('createCardRoundTime');
				game.addVideo('createhandcardNumber');
				return node;
			},
			// 计数器显示
			cardRoundTime: function() {
				var node = ui.create.div('.cardRoundNumber', ui.arena).hide();
				node.node = {
					cardPileNumber: ui.create.div('.cardPileNumber', node),
					roundNumber: ui.create.div('.roundNumber', node),
					time: ui.create.div('.time', node),
				};
				node.updateRoundCard = function() {
					var cardNumber = ui.cardPile.childNodes.length || 0;
					var roundNumber = game.roundNumber || 0;
					this.node.roundNumber.innerHTML = '<span>第' + game.roundNumber + '轮</span>';
					this.setNumberAnimation(cardNumber);
					this.show();
					game.addVideo('updateCardRoundTime', null, {
						cardNumber: cardNumber,
						roundNumber: roundNumber,
					});
				};

				node.setNumberAnimation = function(num, step) {
					var item = this.node.cardPileNumber;
					clearTimeout(item.interval);
					if (!item._num) {
						item.innerHTML = '<span>' + num + '</span>';
						item._num = num;
					} else {
						if (item._num !== num) {
							if (!step) step = 500 / Math.abs(item._num - num);
							if (item._num > num) item._num--;
							else item._num++;
							item.innerHTML = '<span>' + item._num + '</span>';
							if (item._num !== num) {
								item.interval = setTimeout(function () {
									node.setNumberAnimation(num, step);
								}, step);
							}
						}
					}
				};

				ui.time4 = node.node.time;
				ui.time4.sec = 0;
				ui.time4.interval = setInterval(function() {
					var min = Math.floor(ui.time4.sec / 60);
					var sec = ui.time4.sec % 60;
					if (min < 10) min = '0' + min;
					if (sec < 10) sec = '0' + sec;
					ui.time4.innerHTML = '<span>' + min + ':' + sec + '</span>';
					ui.time4.sec++;
				}, 1000);
				game.addVideo('createCardRoundTime');
				return node;
			},
		},
		
		click: {
			/*
			setting: function() {
				if(lib.extensionMenu.extension_概念武将.zyile_skin_Menu){
					lib.extensionMenu.extension_概念武将.zyile_skin_Menu.onclick();
			} else {
				// head.remove()
				game.closePopped();
				game.pause2();
				ui.click.configMenu();
				ui.system1.classList.remove('shown');
				ui.system2.classList.remove('shown');
				}
			},
			*/
			/*-----------------分割线-----------------*/
			// 换肤函数
			huanfu:function() {
				game.playAudio('../extension/手杀ui/lbtn/images/SZNSC/huanfu.mp3');
				window.zyile_charactercard ? window.zyile_charactercard(player,false)	: ui.click.charactercard(game.me.name,game.zhu,lib.config.mode=='mode_guozhan'?'guozhan':true);
			},
			
			// 排序函数
			paixu: function() {
				var cards = game.me.getCards("hs");
				var sort2 = function(b, a) {
					if (a.name != b.name) return lib.sort.card(a.name, b.name);
					else if (a.suit != b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
					else return a.number - b.number;
				};
				if (cards.length > 1) {
					cards.sort(sort2);
					cards.forEach(function(i, j) {
						game.me.node.handcards1.insertBefore(cards[j], game.me.node.handcards1.firstChild);
					});
					dui.queueNextFrameTick(dui.layoutHand, dui);
				}
			},
			/*-----------------分割线-----------------*/
		
			confirm: function(link, target) {
				if (link === 'ok') {
					ui.click.ok(target);
				} else if (link === 'cancel') {
					ui.click.cancel(target);
				} else if (target.custom) {
					target.custom(link);
				}
			},
		},
		compare: {
			type: function(a, b) {
				if (a === b) return 0;
				var types = ['basic', 'trick', 'delay', 'equip'].addArray([a, b]);
				return types.indexOf(a) - types.indexOf(b);
			},
			name: function(a, b) {
				if (a === b) return 0;
				return a > b ? 1 : -1;
			},
			nature: function(a, b) {
				if (a === b) return 0;
				var nature = [undefined, 'fire', 'thunder'].addArray([a, b]);
				return nature.indexOf(a) - nature.indexOf(b);
			},
			suit: function(a, b) {
				if (a === b) return 0;
				var suit = ['diamond', 'heart', 'club', 'spade'].addArray([a, b]);
				return suit.indexOf(a) - suit.indexOf(b);
			},
			number: function(a, b) {
				return a - b;
			},
		},
	};
	return plugin;
});
