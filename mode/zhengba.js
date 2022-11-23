'use strict';
game.import('mode',function(lib,game,ui,get,ai,_status){
    return {
        name:'zhengba',
        start:function(){
            "step 0"
			var playback=localStorage.getItem(lib.configprefix+'playback');
			if(playback){
				ui.create.me();
				ui.arena.style.display='none';
				ui.system.style.display='none';
				_status.playback=playback;
				localStorage.removeItem(lib.configprefix+'playback');
				var store=lib.db.transaction(['video'],'readwrite').objectStore('video');
				store.get(parseInt(playback)).onsuccess=function(e){
					if(e.target.result){
						game.playVideoContent(e.target.result.video);
					}
					else{
						alert('播放失败：找不到录像');
						game.reload();
					}
				}
				event.finish();
			}
			else if(!_status.connectMode){
				game.prepareArena(3);
			}
            "step 1"
            if(_status.connectMode){
				_status.mode="zhengba";
				game.waitForPlayer(function(){
						lib.configOL.number=3;
				});
			}
            "step 2"
            if(_status.connectMode){
				if(lib.configOL.number<3){
					lib.configOL.number=3;
				}
				game.randomMapOL();
			}
			else{
				for(var i=0;i<game.players.length;i++){
					game.players[i].getId();
				}
				game.chooseCharacter();
			}
            "step 3"
            if(ui.coin){
				_status.coinCoeff=get.coinCoeff([game.me.name]);
			}
			var map={};
			for(var i in lib.playerOL){
				map[i]=lib.playerOL[i].identity;
			}
			game.broadcast(function(map){
				for(var i in map){
					lib.playerOL[i].identity=map[i];
					lib.playerOL[i].setIdentity();
					lib.playerOL[i].ai.shown=1;
				}
			},map);
            game.syncState();
			event.trigger('gameStart');
			
			var players=get.players(lib.sort.position);
            var info=[];
			for(var i=0;i<players.length;i++){
				info.push({
					name:players[i].name1,
					name2:players[i].name2,
					identity:players[i].identity
				});
			}
			_status.videoInited=true;
			game.addVideo('init',null,info)
            var next=game.gameDraw(game.zhu||game.nei||game.fan||_status.firstAct||game.me);
            next.num=function(player){
                var num=4;
                return num;
            };
            if(_status.connectMode&&lib.configOL.change_card) game.replaceHandcards(game.players.slice(0));
            game.phaseLoop(game.zhu||game.nei||game.fan||_status.firstAct||game.me);
            game.zhu.showGiveup();
        },
        game:{
            addRecord:function(bool){
				if(typeof bool=='boolean'){
					var data=lib.config.gameRecord.zhengba.data;
					var identity=game.me.identity;
					if(!data[identity]){
						data[identity]=[0,0];
					}
					if(bool){
						data[identity][0]++;
					}
					else{
						data[identity][1]++;
					}
					var list=['zhu','fan','nei'];
					var str='';
					for(var i=0;i<list.length;i++){
						if(data[list[i]]){
							str+=lib.translate[list[i]+'2']+'：'+data[list[i]][0]+'胜'+' '+data[list[i]][1]+'负<br>';
						}
					}
					lib.config.gameRecord.zhengba.str=str;
					game.saveConfig('gameRecord',lib.config.gameRecord);
				}
			},
            getState:function(){
				var state={};
				for(var i in lib.playerOL){
					var player=lib.playerOL[i];
					state[i]={identity:player.identity};
				}
				return state;
			},
            updateState:function(state){
				for(var i in state){
					var player=lib.playerOL[i];
					if(player){
						player.identity=state[i].identity;
					}
				}
			},
            updateRoundNumber:function(){
                game.broadcastAll(function(num1,num2,top){
					if(ui.cardPileNumber) ui.cardPileNumber.innerHTML=num1+'轮 剩余牌: '+num2;
					_status.pileTop=top;
				},game.roundNumber,ui.cardPile.childNodes.length,ui.cardPile.firstChild);
            },
            getRoomInfo:function(uiintro){
				if(lib.configOL.banned.length){
					uiintro.add('<div class="text chat">禁用武将：'+get.translation(lib.configOL.banned));
				}
				if(lib.configOL.bannedcards.length){
					uiintro.add('<div class="text chat">禁用卡牌：'+get.translation(lib.configOL.bannedcards));
				}
				uiintro.style.paddingBottom='8px';
			},
            getVideoName:function(){
                // 加载音乐，不知道具体干嘛
				var str=get.translation(game.me.name);
				if(game.me.name2){
					str+='/'+get.translation(game.me.name2);
				}
				var namex;
				switch(_status.mode){
					case 'zhengba':namex='休闲斗地主';break;
				}
				var name=[
					str,
					namex+' - '+lib.translate[game.me.identity+'2']
				];
				return name;
			},
            showIdentity:function(me){
				for(var i=0;i<game.players.length;i++){
					game.players[i].node.identity.classList.remove('guessing');
					game.players[i].identityShown=true;
					game.players[i].ai.shown=1;
					game.players[i].setIdentity(game.players[i].identity);
					if(game.players[i].identity=='zhu'){
						game.players[i].isZhu=true;
					}
				}
				if(_status.clickingidentity){
					for(var i=0;i<_status.clickingidentity[1].length;i++){
						_status.clickingidentity[1][i].delete();
						_status.clickingidentity[1][i].style.transform='';
					}
					delete _status.clickingidentity;
				}
			},
            chooseCharacter:function(){
                var next=game.createEvent('chooseCharacter',false);
				next.showConfig=true;
				next.addPlayer=function(player){
					var list=lib.config.mode_config.identity.identity[game.players.length-3].slice(0);
					var list2=lib.config.mode_config.identity.identity[game.players.length-2].slice(0);
					for(var i=0;i<list.length;i++) list2.remove(list[i]);
					player.identity=list2[0];
				};
				next.removePlayer=function(){
					return game.players.randomGet(game.me,game.zhu,game.nei,game.fan);
				};
				next.ai=function(player,list,list2,back){
					var listc=list.slice(0,2);
					for(var i=0;i<listc.length;i++){
						var listx=lib.characterReplace[listc[i]];
						if(listx&&listx.length) listc[i]=listx.randomGet();
					}
					player.init(listc[0]);
					if(back){
						list.remove(get.sourceCharacter(player.name1));
						list.remove(get.sourceCharacter(player.name2));
						for(var i=0;i<list.length;i++){
							back.push(list[i]);
						}
					}
					if(typeof lib.config.test_game=='string'&&player==game.me.next){
						player.init(lib.config.test_game);
					}
					player.node.name.dataset.nature=get.groupnature(player.group);
				}
				next.setContent(function(){
					"step 0"
					ui.arena.classList.add('choose-character');
					var i;
					var list;
					var list4=[];
					var identityList=['zhu','fan','nei'];
					var chosen=lib.config.continue_name||[];
					game.saveConfig('continue_name');
					event.chosen=chosen;

					var addSetting=function(dialog){
						dialog.add('选择身份').classList.add('add-setting');
						var table=document.createElement('div');
						table.classList.add('add-setting');
						table.style.margin='0';
						table.style.width='100%';
						table.style.position='relative';
						
						var listi=['random','zhu','fan','nei'];
						for(var i=0;i<listi.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.link=listi[i];
							if(td.link===game.me.identity){
								td.classList.add('bluebg');
							}
							table.appendChild(td);
							td.innerHTML='<span>'+get.translation(listi[i]+'2')+'</span>';
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								_status.tempNoButton=true;
								setTimeout(function(){
									_status.tempNoButton=false;
								},500);
								var link=this.link;
								if(game.zhu.name){
									if(link!='random'){
										_status.event.parent.fixedseat=get.distance(game.me,game.zhu,game.fan,'absolute');
									}
									game.zhu.uninit();
									delete game.zhu.isZhu;
									delete game.zhu.identityShown;
								}
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								current=seats.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								if(link=='random'){
									link=['zhu','fan','nei'].randomGet();
									for(var i=0;i<this.parentNode.childElementCount;i++){
										if(this.parentNode.childNodes[i].link==link){
											this.parentNode.childNodes[i].classList.add('bluebg');
										}
									}
								}
								else{
									this.classList.add('bluebg');
								}
								num=get.config('choice_'+link);
								_status.event.parent.swapnodialog=function(dialog,list){
									var buttons=ui.create.div('.buttons');
									var node=dialog.buttons[0].parentNode;
									dialog.buttons=ui.create.buttons(list,'characterx',buttons);
									dialog.content.insertBefore(buttons,node);
									buttons.animate('start');
									node.remove();
									game.uncheck();
									game.check();
									for(var i=0;i<seats.childElementCount;i++){
										if(get.distance(game.zhu,game.me,'absolute')===seats.childNodes[i].link){
											seats.childNodes[i].classList.add('bluebg');
										}
									}
								}
								_status.event=_status.event.parent;
								_status.event.step=0;
								_status.event.identity=link;

								seats.previousSibling.style.display='none';
								seats.style.display='none';
								game.resume();
							});
						}
						dialog.content.appendChild(table);

						dialog.add('选择座位').classList.add('add-setting');
						var seats=document.createElement('div');
						seats.classList.add('add-setting');
						seats.style.margin='0';
						seats.style.width='100%';
						seats.style.position='relative';
						for(var i=2;i<=game.players.length;i++){
							var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
							td.innerHTML=get.cnNumber(i,true);
							td.link=i-1;
							seats.appendChild(td);
							if(get.distance(game.zhu,game.me,'absolute')===i-1){
								td.classList.add('bluebg');
							}
							td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
								if(_status.dragged) return;
								if(_status.justdragged) return;
								if(get.distance(game.zhu,game.me,'absolute')==this.link) return;
								var current=this.parentNode.querySelector('.bluebg');
								if(current){
									current.classList.remove('bluebg');
								}
								this.classList.add('bluebg');
								for(var i=0;i<game.players.length;i++){
									if(get.distance(game.players[i],game.me,'absolute')==this.link){
										game.swapSeat(game.zhu,game.players[i],false);return;
									}
								}
							});
						}
						dialog.content.appendChild(seats);

						dialog.add(ui.create.div('.placeholder.add-setting'));
						dialog.add(ui.create.div('.placeholder.add-setting'));
						if(get.is.phoneLayout()) dialog.add(ui.create.div('.placeholder.add-setting'));
					};
					var removeSetting=function(){
						var dialog=_status.event.dialog;
						if(dialog){
							dialog.style.height='';
							delete dialog._scrollset;
							var list=Array.from(dialog.querySelectorAll('.add-setting'));
							while(list.length){
								list.shift().remove();
							}
							ui.update();
						}
					};
					event.addSetting=addSetting;
					event.removeSetting=removeSetting;
					event.list=[];
					identityList.randomSort();
					if(event.identity){
						identityList.remove(event.identity);
						identityList.unshift(event.identity);
						if(event.fixedseat){
							var zhuIdentity='zhu';
							if(zhuIdentity!=event.identity){
								identityList.remove(zhuIdentity);
								identityList.splice(event.fixedseat,0,zhuIdentity);
							}
							delete event.fixedseat;
						}
						delete event.identity;
					}
					for(i=0;i<game.players.length;i++){
							game.players[i].identity=identityList[i];
							if(identityList[i]=='zhu'){
								game.zhu=game.players[i];
							}
					}

					if(!game.zhu) game.zhu=game.me;
					else{
						game.zhu.setIdentity();
						game.zhu.identityShown=true;
						game.zhu.isZhu=(game.zhu.identity=='zhu');
						game.zhu.node.identity.classList.remove('guessing');
						game.me.setIdentity();
						game.me.node.identity.classList.remove('guessing');
					}
					//选将框分配
					for(i in lib.characterReplace){
						var ix=lib.characterReplace[i];
						for(var j=0;j<ix.length;j++){
							if(chosen.contains(ix[j])||lib.filter.characterDisabled(ix[j])) ix.splice(j--,1);
						}
						if(ix.length){
							event.list.push(i);
							list4.addArray(ix);
						}
					}
					for(i in lib.character){
						if(chosen.contains(i)||list4.contains(i)) continue;
						if(lib.filter.characterDisabled(i)) continue;
						event.list.push(i);
						list4.push(i);
					}
					event.list.randomSort();
					_status.characterlist=list4.slice(0);
					var num=get.config('choice_'+game.me.identity);
					list=event.list.slice(0,num);
					delete event.swapnochoose;
					var dialog;
					if(event.swapnodialog){
						dialog=ui.dialog;
						event.swapnodialog(dialog,list);
						delete event.swapnodialog;
					}
					else{
						var str='选择角色';
						if(_status.brawl&&_status.brawl.chooseCharacterStr){
							str=_status.brawl.chooseCharacterStr;
						}
						dialog=ui.create.dialog(str,'hidden',[list,'characterx']);
						if(!_status.brawl||!_status.brawl.noAddSetting){
							if(get.config('change_identity')){
								addSetting(dialog);
							}
						}
					}
					dialog.setCaption('选择角色');
					game.me.setIdentity();
					
					if(!event.chosen.length){
						game.me.chooseButton(dialog,true).set('onfree',true).selectButton=function(){
							return get.config('double_character')?2:1
						};
					}
					else{
						lib.init.onfree();
					}
					ui.create.cheat=function(){
						_status.createControl=ui.cheat2;
						ui.cheat=ui.create.control('更换',function(){
							if(ui.cheat2&&ui.cheat2.dialog==_status.event.dialog){
								return;
							}
							if(game.changeCoin){
								game.changeCoin(-3);
							}
							
							event.list.randomSort();
							list=event.list.slice(0,num);
							
							var buttons=ui.create.div('.buttons');
							var node=_status.event.dialog.buttons[0].parentNode;
							_status.event.dialog.buttons=ui.create.buttons(list,'characterx',buttons);
							_status.event.dialog.content.insertBefore(buttons,node);
							buttons.animate('start');
							node.remove();
							game.uncheck();
							game.check();
						});
						delete _status.createControl;
					};
					if(lib.onfree){
						lib.onfree.push(function(){
							event.dialogxx=ui.create.characterDialog('heightset');
							if(ui.cheat2){
								ui.cheat2.animate('controlpressdownx',500);
								ui.cheat2.classList.remove('disabled');
							}
						});
					}
					else{
						event.dialogxx=ui.create.characterDialog('heightset');
					}

					ui.create.cheat2=function(){
						ui.cheat2=ui.create.control('自由选将',function(){
							if(this.dialog==_status.event.dialog){
								if(game.changeCoin){
									game.changeCoin(50);
								}
								this.dialog.close();
								_status.event.dialog=this.backup;
								this.backup.open();
								delete this.backup;
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.animate('controlpressdownx',500);
									ui.cheat.classList.remove('disabled');
								}
							}
							else{
								if(game.changeCoin){
									game.changeCoin(-10);
								}
								this.backup=_status.event.dialog;
								_status.event.dialog.close();
								_status.event.dialog=_status.event.parent.dialogxx;
								this.dialog=_status.event.dialog;
								this.dialog.open();
								game.uncheck();
								game.check();
								if(ui.cheat){
									ui.cheat.classList.add('disabled');
								}
							}
						});
						if(lib.onfree){
							ui.cheat2.classList.add('disabled');
						}
					}
					if(!_status.brawl||!_status.brawl.chooseCharacterFixed){
						if(!ui.cheat&&get.config('change_choice'))
						ui.create.cheat();
						if(!ui.cheat2&&get.config('free_choose'))
						ui.create.cheat2();
					}
					"step 1"
					if(ui.cheat){
						ui.cheat.close();
						delete ui.cheat;
					}
					if(ui.cheat2){
						ui.cheat2.close();
						delete ui.cheat2;
					}
					var chooseGroup=false;
					if(event.chosen.length){
						if(lib.character[event.chosen[0]][1]=='shen'){
							chooseGroup=true;
						}
					}
					else if(event.modchosen){
						if(event.modchosen[0]=='random') event.modchosen[0]=result.buttons[0].link;
						else event.modchosen[1]=result.buttons[0].link;
					}
					else if(result.buttons.length==2){
						event.choosed=[result.buttons[0].link,result.buttons[1].link];
						game.addRecentCharacter(result.buttons[0].link,result.buttons[1].link);
						if(lib.character[event.choosed[0]][1]=='shen'){
							chooseGroup=true;
						}
					}
					else{
						event.choosed=[result.buttons[0].link];
						if(lib.character[event.choosed[0]][1]=='shen'){
							chooseGroup=true;
						}
						game.addRecentCharacter(result.buttons[0].link);
					}
					"step 2"
					if(event.chosen.length){
						game.me.init(event.chosen[0],event.chosen[1]);
					}
					else if(event.modchosen){
						game.me.init(event.modchosen[0],event.modchosen[1]);
					}
					else if(event.choosed.length==2){
						game.me.init(event.choosed[0],event.choosed[1]);
					}
					else{
						game.me.init(event.choosed[0]);
					}
					event.list.remove(get.sourceCharacter(game.me.name1));
					event.list.remove(get.sourceCharacter(game.me.name2));
					
					for(var i=0;i<game.players.length;i++){
						if(game.players[i]!=game.me){
							event.list.randomSort();
							event.ai(game.players[i],event.list.splice(0,get.config('choice_'+game.players[i].identity)),null,event.list)
						}
					}
					"step 3"
					for(var i=0;i<game.players.length;i++){
						_status.characterlist.remove(get.sourceCharacter(game.players[i].name1));
						_status.characterlist.remove(get.sourceCharacter(game.players[i].name2));
					}
					setTimeout(function(){
						ui.arena.classList.remove('choose-character');
					},500);

				});
            },
            checkResult:function(){
                if(game.players.length>1) return;
				var me=game.me._trueMe||game.me;
				if(game.zhu.isAlive()){
					if(me==game.zhu){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}

                if(game.fan.isAlive()){
					if(me==game.fan){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}

                if(game.nei.isAlive()){
					if(me==game.nei){
						game.over(true);
					}
					else{
						game.over(false);
					}
				}

			},
            dieAfter:function(source){
                game.checkResult();
            },
        },
        translate:{
			zhu:"蜀",
			fan:"吴",
            nei:"魏",
            random2:"随机",
            zhu2:"蜀",
			fan2:"吴",
            nei2:"魏",
		},
        get:{
			rawAttitude:function(from,to){
				if(from.identity!==to.identity) return -10;
                return 10
			},
		},
        help:{
			'三国争霸':'<div style="margin:10px">游戏规则</div><ul style="margin-top:0"><li>游戏人数<br>游戏人数为3人（魏、蜀、吴各一人）。</li><li>胜利条件<br>杀死其他两个玩家</li>'+
			'<li>死亡奖惩<br>当有人死亡时，击杀者可以选择摸两张牌或回复一点体力。</li></ul>',
		}
    }
})