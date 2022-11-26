'use strict';
game.import('character',function(lib,game,ui,get,ai,_status){
	return {
		//strategy and battle, "sb" in short
		name:'sb',
		connect:true,
		character:{
			sb_yujin:['male','wei',4,['sbxiayuan','sbjieyue']],
			sb_huaxiong:['male','qun','3/4/1',['new_reyaowu','sbyangwei']],
			liucheng:['female','qun',3,['splveying','spyingwu']],
			sp_yangwan:['female','shu',3,['spmingxuan','spxianchou']],
			sb_huangzhong:['male','shu',4,['sbliegong']],
			bol_caocao:['male','wei',4,['boljianxiong','bolqingzheng','bolhujia'],['zhu']],
			bol_zhouyu:['male','wu',3,['bolyingzi','bolfanjian']],
            bol_huanggai:['male','wu','2/4/2',['bolkurou','bolzhaxiang']],
            bol_xiahoushi:['female','shu',3,['bolqiaoshi','bolyanyu'],['die_audio']],
		},
		skill:{
			//于禁
			sbxiayuan:{
				audio:2,
				trigger:{global:'damageEnd'},
				direct:true,
				filter:function(event,player){
					return event.hujia&&!event.player.hujia&&event.player.isIn()&&player.countCards('h')>1&&!player.hasSkill('sbxiayuan_round',null,false,false);
				},
				content:function(){
					'step 0'
					player.addTempSkill('sbxiayuan_round','roundStart');
					player.chooseToDiscard(2,'h',get.prompt('sbxiayuan',trigger.player),'弃置两张手牌，令其获得'+get.cnNumber(trigger.hujia)+'点护甲').set('goon',get.attitude(player,trigger.player)>0).set('ai',function(card){
						if(!_status.event.goon) return 0;
						return 5-get.value(card);
					}).logSkill=['sbxiayuan',trigger.player];
					'step 1'
					if(result.bool){
						var target=trigger.player;
						player.logSkill('sbxiayuan',target);
						target.changeHujia(trigger.hujia);
						game.delayx();
					}
					else player.removeSkill('sbxiayuan_round');
				},
				subSkill:{round:{charlotte:true}},
				ai:{expose:0.2},
			},
			sbjieyue:{
				audio:2,
				trigger:{player:'phaseJieshuBegin'},
				direct:true,
				content:function(){
					'step 0'
					player.chooseTarget(lib.filter.notMe,get.prompt('sbjieyue'),'令一名其他角色获得1点护甲，然后该角色可以交给你一张牌。').set('ai',function(target){
						return get.attitude(_status.event.player,target)/Math.sqrt(Math.min(1,target.hp+target.hujia));
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						event.target=target;
						player.logSkill('sbjieyue',target);
						target.changeHujia(1);
						target.chooseCard('he','是否交给'+get.translation(player)+'一张牌？').set('ai',(card)=>0.1-get.value(card));
					}
					else event.finish();
					'step 2'
					if(result.bool){
						player.gain(result.cards,target,'giveAuto');
					}
				},
				ai:{
					threaten:2.7,
					expose:0.2,
				},
			},
			//华雄
			sbyangwei:{
				audio:2,
				enable:'phaseUse',
				filter:function(event,player){
					return !player.hasSkill('sbyangwei_counter',null,null,false);
				},
				content:function(){
					player.draw(2);
					player.addTempSkill('sbyangwei_effect');
					player.addSkill('sbyangwei_counter');
				},
				ai:{
					order:9,
					result:{player:1},
				},
				subSkill:{
					effect:{
						audio:'sbyangwei',
						equipSkill:false,
						inherit:'qinggang_skill',
						charlotte:true,
						nopop:true,
						mod:{
							targetInRange:function(card){
								if(card.name=='sha') return true;
							},
							cardUsable:function(card,player,num){
								if(card.name=='sha') return num+1;
							},
						},
						mark:true,
						marktext:'威',
						intro:{content:'使用【杀】的次数上限+1且无距离限制且无视防具'},
					},
					counter:{
						trigger:{player:'phaseJieshu'},
						silent:true,
						popup:false,
						forced:true,
						charlotte:true,
						onremove:true,
						content:function(){
							if(!player.storage.sbyangwei_counter) player.storage.sbyangwei_counter=true;
							else player.removeSkill('sbyangwei_counter');
						},
					},
				},
			},
			//黄忠
			sbliegong:{
				audio:2,
				mod:{
				 cardnature:function(card,player){
				 	if(!player.getEquip(1)&&get.name(card,player)=='sha') return false;
				 },
				},
				trigger:{player:'useCardToPlayered'},
				filter:function(event,player){
					return !event.getParent()._sbliegong_player&&event.targets.length==1&&event.card.name=='sha'&&player.getStorage('sbliegong').length>0;
				},
				prompt2:function(event,player){
					var str='',storage=player.getStorage('sbliegong');
					if(storage.length>1){
						str+=('展示牌堆顶的'+get.cnNumber(storage.length-1)+'张牌并增加伤害；且');
					}
					str+=('令'+get.translation(event.target)+'不能使用花色为');
					for(var i=0;i<storage.length;i++){
						str+=get.translation(storage[i]);
					}
					str+=('的牌响应'+get.translation(event.card));
					return str;
				},
				logTarget:'target',
				check:function(event,player){
					var target=event.target;
					if(get.attitude(player,target)>0) return false;
					if(target.hasSkillTag('filterDamage',null,{
						player:player,
						card:event.card,
					})) return false;
					var storage=player.getStorage('sbliegong');
					if(storage.length>=4) return true;
					if(storage.length<3) return false;
					if(target.hasShan()) return storage.contains('heart')&&storage.contains('diamond');
					return true;
				},
				content:function(){
					var storage=player.getStorage('sbliegong').slice(0);
					var num=storage.length-1;
					var evt=trigger.getParent();
					if(num>0){
						if(typeof evt.baseDamage!='number') evt.baseDamage=1;
						var cards=get.cards(num);
						player.showCards(cards.slice(0),get.translation(player)+'发动了【烈弓】');
						while(cards.length>0){
							var card=cards.pop();
							if(storage.contains(get.suit(card,false))) evt.baseDamage++;
							ui.cardPile.insertBefore(card,ui.cardPile.firstChild);
						}
						game.updateRoundNumber();
					}
					evt._sbliegong_player=player;
					player.addTempSkill('sbliegong_clear');
					var target=trigger.target;
					target.addTempSkill('sbliegong_block');
					if(!target.storage.sbliegong_block) target.storage.sbliegong_block=[];
					target.storage.sbliegong_block.push([evt.card,storage]);
					lib.skill.sbliegong.updateBlocker(target);
				},
				updateBlocker:function(player){
					var list=[],storage=player.storage.sbliegong_block;
					if(storage&&storage.length){
						for(var i of storage) list.addArray(i[1]);
					}
					player.storage.sbliegong_blocker=list;
				},
				ai:{
					threaten:3.5,
					directHit_ai:true,
					halfneg:true,
					skillTagFilter:function(player,tag,arg){
						if(arg&&arg.card&&arg.card.name=='sha'){
							var storage=player.getStorage('sbliegong');
							if(storage.length<3||!storage.contains('heart')||!storage.contains('diamond')) return false;
							var target=arg.target;
							if(target.hasSkill('bagua_skill')||target.hasSkill('bazhen')||target.hasSkill('rw_bagua_skill')) return false;
							return true;
						}
						return false;
					},
				},
				intro:{
					content:'已记录花色：$',
					onunmark:true,
				},
				group:'sbliegong_count',
				subSkill:{
					clear:{
						trigger:{player:'useCardAfter'},
						forced:true,
						charlotte:true,
						popup:false,
						filter:function(event,player){
							return event._sbliegong_player==player;
						},
						content:function(){
							player.unmarkSkill('sbliegong');
						},
					},
					block:{
						mod:{
							cardEnabled:function(card,player){
								if(!player.storage.sbliegong_blocker) return;
								var suit=get.suit(card);
								if(suit=='none') return;
								var evt=_status.event;
								if(evt.name!='chooseToUse') evt=evt.getParent('chooseToUse');
								if(!evt||!evt.respondTo||evt.respondTo[1].name!='sha') return;
								if(player.storage.sbliegong_blocker.contains(suit)) return false;
							},
						},
						trigger:{
							player:['damageBefore','damageCancelled','damageZero'],
							target:['shaMiss','useCardToExcluded','useCardToEnd'],
							global:['useCardEnd'],
						},
						forced:true,
						firstDo:true,
						charlotte:true,
						onremove:function(player){
							delete player.storage.sbliegong_block;
							delete player.storage.sbliegong_blocker;
						},
						filter:function(event,player){
							if(!event.card||!player.storage.sbliegong_block) return false;
							for(var i of player.storage.sbliegong_block){
								if(i[0]==event.card) return true;
							}
							return false;
						},
						content:function(){
							var storage=player.storage.sbliegong_block;
							for(var i=0;i<storage.length;i++){
								if(storage[i][0]==trigger.card){
									storage.splice(i--,1);
								}
							}
							if(!storage.length) player.removeSkill('sbliegong_block');
							else lib.skill.sbliegong.updateBlocker(target);
						},
					},
					count:{
						trigger:{
							player:'useCard',
							target:'useCardToTargeted',
						},
						forced:true,
						filter:function(event,player,name){
							if(name!='useCard'&&player==event.player) return false;
							var suit=get.suit(event.card);
							if(!lib.suit.contains(suit)) return false;
							if(player.storage.sbliegong&&player.storage.sbliegong.contains(suit)) return false;
							return true;
						},
						content:function(){
							player.markAuto('sbliegong',[get.suit(trigger.card)]);
						},
					},
				},
			},
			//刘赪
			splveying:{
				audio:2,
				trigger:{player:'useCardAfter'},
				forced:true,
				filter:function(event,player){
					return event.card.name=='sha'&&player.countMark('splveying')>1;
				},
				logTarget:'targets',
				content:function(){
					player.removeMark('splveying',2);
					for(var i of trigger.targets) player.discardPlayerCard(i,true,'he');
				},
				marktext:'椎',
				intro:{
					name:'椎(掠影/莺舞)',
					name2:'椎',
					content:'mark',
				},
				group:'splveying_add',
				subSkill:{
					add:{
						trigger:{player:'useCardToPlayered'},
						forced:true,
						usable:2,
						filter:function(event,player){
							return event.card.name=='sha'&&player.isPhaseUsing();
						},
						content:function(){
							player.addMark('splveying',1);
						},
					},
				},
			},
			spyingwu:{
				group:'spyingwu_add',
				audio:2,
				trigger:{player:'useCardAfter'},
				forced:true,
				locked:false,
				filter:function(event,player){
					return  player.hasSkill('splveying')&&(get.type(event.card)=='trick'&&!get.tag(event.card,'damage'))&&player.countMark('splveying')>1;
				},
				content:function(){
					player.removeMark('splveying',2);
					player.chooseUseTarget('sha',false);
				},
				ai:{combo:'splveying'},
				subSkill:{
					add:{
						trigger:{player:'useCardToPlayered'},
						forced:true,
						locked:false,
						usable:2,
						filter:function(event,player){
							return player.hasSkill('splveying')&&(get.type(event.card)=='trick'&&!get.tag(event.card,'damage'))&&player.isPhaseUsing();
						},
						content:function(){
							player.addMark('splveying',1);
						},
					},
				},
			},
			//手杀杨婉
			spmingxuan:{
				audio:2,
				trigger:{player:'phaseUseBegin'},
				forced:true,
				filter:function(event,player){
					var list=player.getStorage('spmingxuan');
					return player.countCards('h')>0&&game.hasPlayer(function(current){
						return current!=player&&!list.contains(current);
					});
				},
				content:function(){
					'step 0'
					var suits=[],hs=player.getCards('h');
					for(var i of hs) suits.add(get.suit(i,player));
					var list=player.getStorage('spmingxuan'),num=Math.min(suits.length,game.countPlayer(function(current){
						return current!=player&&!list.contains(current);
					}));
					player.chooseCard('h',true,[1,num],'瞑昡：请选择至多'+get.cnNumber(num)+'张花色各不相同的手牌',function(card,player){
						if(!ui.selected.cards.length) return true;
						var suit=get.suit(card);
						for(var i of ui.selected.cards){
							if(get.suit(i,player)==suit) return false;
						}
						return true;
					}).set('complexCard',true).set('ai',(card)=>6-get.value(card));
					'step 1'
					if(result.bool){
						var list=player.getStorage('spmingxuan'),cards=result.cards.randomSort();
						var targets=game.filterPlayer((current)=>(current!=player&&!list.contains(current))).randomGets(cards.length).sortBySeat();
						player.line(targets,'green');
						for(var i=0;i<targets.length;i++){
							targets[i].gain(cards[i],player);
							player.$giveAuto(cards[i],targets[i]);
						}
						event.targets=targets;
						event.num=0;
					}
					else event.finish();
					'step 2'
					game.delayx();
					'step 3'
					if(num<targets.length){
						var target=targets[num];
						event.num++;
						if(target.isIn()){
							event.target=target;
							target.chooseToUse(function(card,player,event){
								if(get.name(card)!='sha') return false;
									return lib.filter.filterCard.apply(this,arguments);
								},'对'+get.translation(player)+'使用一张杀，否则交给其一张牌，且其摸一张牌').set('targetRequired',true).set('complexSelect',true).set('filterTarget',function(card,player,target){
								if(target!=_status.event.sourcex&&!ui.selected.targets.contains(_status.event.sourcex)) return false;
								return lib.filter.targetEnabled.apply(this,arguments);
							}).set('sourcex',player).set('addCount',false);
						}
						else{
							if(event.num<targets.length) event.redo();
							else event.finish();
						}
					}
					'step 4'
					if(result.bool){
						player.markAuto('spmingxuan',[target]);
						if(event.num<targets.length) event.goto(3);
						else event.finish();
					}
					else{
						var he=target.getCards('he');
						if(he.length){
							if(he.length==1) event._result={bool:true,cards:he};
							else target.chooseCard('he',true,'交给'+get.translation(player)+'一张牌')
						}
						else{
							if(event.num<targets.length) event.goto(3);
							else event.finish();
						}
					}
					'step 5'
					if(result.bool){
						player.gain(result.cards,target,'giveAuto');
						player.draw();
					}
					if(event.num<targets.length) event.goto(3);
				},
				intro:{content:'已被$使用过杀'},
			},
			spxianchou:{
				audio:2,
				trigger:{player:'damageEnd'},
				direct:true,
				filter:function(event,player){
					return event.source&&event.source.isIn()&&game.hasPlayer(function(current){
						return current!=player&&current!=event.source;
					});
				},
				content:function(){
					'step 0'
					player.chooseTarget(get.prompt2('spxianchou'),function(card,player,target){
						return target!=player&&target!=_status.event.getTrigger().source;
					}).set('ai',function(target){
						return get.attitude(target,_status.event.player)*Math.sqrt(target.countCards('he'));
					});
					'step 1'
					if(result.bool){
						var target=result.targets[0];
						event.target=target;
						player.logSkill('spxianchou',target);
						player.line2([target,trigger.source]);
						target.chooseToDiscard('he','是否弃置一张牌，视为对'+get.translation(trigger.source)+'使用一张【杀】？').set('ai',function(card){
							if(_status.event.goon) return 8-get.value(card);
							return 0;
						}).set('goon',((target.canUse('sha',trigger.source,false)?get.effect(trigger.source,{name:'sha',isCard:true},target,target):0)+get.recoverEffect(player,target,target))>0);
					}
					else event.finish();
					'step 2'
					if(result.bool){
						if(target.canUse('sha',trigger.source,false)) target.useCard({name:'sha',isCard:true},trigger.source,false);
						else event.finish();
					}
					else event.finish();
					'step 3'
					if(target.hasHistory('sourceDamage',function(evt){
						var card=evt.card;
						if(!card||card.name!='sha') return false;
						var evtx=evt.getParent('useCard');
						return evtx.card==card&&evtx.getParent()==event;
					})){
						target.draw();
						player.recover();
					}
				},
			},
			//谋曹操
			boljianxiong:{
            group:'boljianxiong_start',
            marktext:'治世',
            intro:{name:'治世',content:'mark'},
            trigger:{player:'damageEnd'},
            filter:function(event,player){
            var bool1=(get.itemtype(event.cards)=='cards'&&get.position(event.cards[0],true)=='o'),bool2=(1-player.countMark('boljianxiong')>0);
            return bool1||bool2;
            },
            prompt2:function(event,player){
            var str='',bool1=(get.itemtype(event.cards)=='cards'&&get.position(event.cards[0],true)=='o'),bool2=(1-player.countMark('boljianxiong')>0);
            if(bool1) str+='获得'+get.translation(event.cards);
            if(bool1&&bool2) str+='并';
            if(bool2) str+='摸'+get.cnNumber(1-player.countMark('boljianxiong'))+'张牌';
            str+='，然后可以失去1枚“治世”标记';
            return str;
            },
            frequent:true,
            content:function(){
            'step 0'
            var num=1-player.countMark('boljianxiong');
            if(get.itemtype(trigger.cards)=='cards'&&get.position(trigger.cards[0],true)=='o') player.gain(trigger.cards,'gain2');
            if(num>0) player.draw(num,'nodelay');
            'step 1'
            if(player.hasMark('boljianxiong')) player.chooseBool('是否失去1枚“治世”标记？').set('choice',player.countCards('h')>4?true:false);
            else event.finish();
            'step 2'
            if(result.bool) player.removeMark('boljianxiong',1);
            },
            ai:{
            maixie:true,
            maixie_hp:true,
            effect:{
            target:function(card,player,target){
            if(player.hasSkillTag('jueqing',false,target)) return [1,-1];
            if(get.tag(card,'damage')&&player!=target){
            var cards=card.cards,evt=_status.event;
            if(evt.player==target&&card.name=='damage'&&evt.getParent().type=='card') cards=evt.getParent().cards.filterInD();
            if(target.hp<=1) return;
            if(get.itemtype(cards)!='cards') return;
            for(var i of cards){
            if(get.name(i,target)=='tao') return [1,5];
            }
            if(get.value(cards,target)>=(7+target.getDamagedHp())) return [1,3];
            return [1,0.6];
            }
            },
            },
            },
            subSkill:{
            start:{
            trigger:{global:'phaseBefore',player:'enterGame'},
            filter:function(event,player){
            return event.name!='phase'||game.phaseNumber==0;
            },
            direct:true,
            content:function(){
            'step 0'
            var list=[0,1,2];
            player.chooseControl(list).set('prompt',get.prompt('boljianxiong')).set('prompt2','获得任意枚“治世”标记').set('ai',function(){
            return list.randomGet();
            });
            'step 1'
            if(result.control!=0){
            player.logSkill('boljianxiong');
            player.addMark('boljianxiong',result.control);
            }
            },
            },
            },
            },
            bolqingzheng:{
            trigger:{player:'phaseUseBegin'},
            filter:function(event,player){
            var list=[];
            for(var card of player.getCards('h')){
            if(!list.contains(get.suit(card,player))) list.push(get.suit(card,player));
            }
            return list.length>=Math.max(1,3-player.countMark('boljianxiong'))&&game.hasPlayer(function(current){
            return current!=player&&current.countCards('h');
            });
            },
            checkx:function(event,player){
            return game.hasPlayer(function(current){
            return current.countDiscardableCards('h',player)>0&&get.effect(current,{name:'guohe_copy2'},player,player)>0;
            });
            },
            direct:true,
            content:function(){
            'step 0'
            event.count=Math.max(1,3-player.countMark('boljianxiong'));
            'step 1'
            var suits=[];
            for(var card of player.getCards('h')){
            if(!suits.contains(get.suit(card,player))) suits.push(get.suit(card,player));
            }
            suits.sort();
            suits.reverse();
            var switchToAuto=function(){
            _status.imchoosing=false;
            if(lib.skill.bolqingzheng.checkx(trigger,player)) event._result={
            bool:true,
            suits:suits.randomGets(event.count),
            };
            else event._result={
            bool:false,
            suits:[],
            };
            if(event.dialog) event.dialog.close();
            if(event.control) event.control.close();
            };
            var chooseButton=function(suits){
            var event=_status.event;
            if(!event._result) event._result={};
            event._result.suits=[];
            var resSuit=event._result.suits;
            var dialog=ui.create.dialog('###'+get.prompt('bolqingzheng')+'（须弃置'+get.cnNumber(event.count)+'种花色）'+'###'+lib.translate.bolqingzheng_info,'forcebutton','hidden');
            event.dialog=dialog;
            dialog.addText('花色');
            var table=document.createElement('div');
            table.classList.add('add-setting');
            table.style.margin='0';
            table.style.width='100%';
            table.style.position='relative';
            for(var i=0;i<suits.length;i++){
            var td=ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
            td.link=suits[i];
            table.appendChild(td);
            td.innerHTML='<span>'+get.translation(suits[i])+'</span>';
            td.addEventListener(lib.config.touchscreen?'touchend':'click',function(){
            if(_status.dragged) return;
            if(_status.justdragged) return;
            _status.tempNoButton=true;
            setTimeout(function(){
            _status.tempNoButton=false;
            },500);
            var link=this.link;
            if(!this.classList.contains('bluebg')){
            if(resSuit.length>=event.count) return;
            resSuit.add(link);
            this.classList.add('bluebg');
            }
            else{
            this.classList.remove('bluebg');
            resSuit.remove(link);
            }
            });
            }
            dialog.content.appendChild(table);
            dialog.add('　　');
            dialog.open();

            event.switchToAuto=function(){
            event.dialog.close();
            event.control.close();
            game.resume();
            _status.imchoosing=false;
            };
            event.control=ui.create.control('ok',function(link){
            if(resSuit.length&&resSuit.length<event.count) return;
            event.dialog.close();
            event.control.close();
            game.resume();
            _status.imchoosing=false;
            });
            for(var i=0;i<event.dialog.buttons.length;i++){
            event.dialog.buttons[i].classList.add('selectable');
            }
            game.pause();
            game.countChoose();
            };
            if(event.isMine()){
            chooseButton(suits);
            }
            else if(event.isOnline()){
            event.player.send(chooseButton,suits);
            event.player.wait();
            game.pause();
            }
            else{
            switchToAuto();
            }
            'step 2'
            var map=event.result||result;
            if(map&&map.suits&&map.suits.length){
            player.logSkill('bolqingzheng');
            var list=[];
            list.addArray(player.getCards('h',function(card){
            return map.suits.contains(get.suit(card));
            }));
            if(list.length){
            player.discard(list);
            event.num=list.length;
            }
            else event.finish();
            }
            else event.finish();
            'step 3'
            player.chooseTarget('请选择【奸雄】的目标','观看目标角色的手牌并弃置其一种花色的所有牌',true,function(card,player,target){
            return target!=player&&target.countCards('h');
            }).set('ai',function(target){
            var player=_status.event.player;
            return (target.countCards('h')+3)*get.effect(target,{name:'guohe_copy2'},player,player);
            });
            'step 4'
            var list=[];
            var target=result.targets[0];
            event.target=target;
            player.line(target);
            for(var card of target.getCards('h')){
            if(!list.contains(get.suit(card,target))) list.push(get.suit(card,target));
            }
            list.sort();
            player.chooseControl(list).set('ai',function(){
            return list.randomGet();
            }).set('dialog',['弃置'+get.translation(target)+'一种花色的所有牌','hidden',target.getCards('h')]);
            'step 5'
            var numx=target.getCards('h',function(card){
            return get.suit(card)==result.control;
            }).length;
            player.line(target);
            target.discard(target.getCards('h',function(card){
            return get.suit(card)==result.control;
            }));
            if(numx<num) target.damage();
            if(player.countMark('boljianxiong')<2&&player.hasSkill('boljianxiong')) player.chooseBool('是否获得1枚“治世”标记？').set('choice',player.countCards('h')>4?false:true);
            else event.finish();
            'step 6'
            if(result.bool) player.addMark('boljianxiong',1);
            },
            },
            //夏侯氏
bolqiaoshi:{
trigger:{player:'damageEnd'},
filter:function(event,player){
return event.source&&event.source.isIn()&&event.source!=player;
},
usable:1,
direct:true,
content:function(){
'step 0'
_status.bolqiaoshi_judging=true;
trigger.source.chooseBool(get.prompt2('bolqiaoshi')).set('choice',get.attitude(trigger.source,player)>0);
'step 1'
delete _status.bolqiaoshi_judging;
if(result.bool){
player.logSkill('bolqiaoshi',trigger.source);
player.recover(trigger.num);
trigger.source.draw(2);
}
else player.storage.counttrigger.bolqiaoshi--;
},
ai:{
effect:{
target:function(card,player,target){
if(!_status.bolqiaoshi_judging&&get.tag(card,'damage')&&target!=player&&get.attitude(target,player)>0&&target.hp>1&&(!target.storage.counttrigger||!target.storage.counttrigger.bolqiaoshi)) return [0,0.5,0,0.5];
},
},
},
},
bolyanyu:{
enable:'phaseUse',
filter:function(event,player){
return player.countCards('h','sha')>0;
},
filterCard:{name:'sha'},
usable:4,
content:function(){
player.draw();
player.addTempSkill('bolyanyu2','phaseUseAfter');
player.addMark('bolyanyu2',1,false);
},
ai:{
basic:{order:1},
result:{player:1},
},
},
bolyanyu2:{
onremove:true,
trigger:{player:'phaseUseEnd'},
filter:function(event,player){
return player.hasMark('bolyanyu2');
},
direct:true,
content:function(){
'step 0'
player.chooseTarget(get.prompt('bolyanyu'),'令一名其他角色摸'+get.cnNumber(player.countMark('bolyanyu2'))+'张牌',lib.filter.notMe).set('ai',function(target){
return get.attitude(_status.event.player,target);
});
'step 1'
if(result.bool){
var target=result.targets[0];
player.logSkill('bolyanyu',target);
target.draw(player.countMark('bolyanyu2'));
}
},
},

     //周瑜黄盖
     bolyingzi:{
     getNum:function(player){
     var num=0;
     if(player.countCards('h')>=2) num++;
     if(player.hp>=2) num++;
     if(player.countCards('e')>=1) num++;
     return num;
     },
     trigger:{player:'phaseDrawBegin2'},
     filter:function(event,player){
     return lib.skill.bolyingzi.getNum(player)>0;
     },
     forced:true,
     content:function(){
     var num=lib.skill.bolyingzi.getNum(player);
     trigger.num+=num;
     player.addTempSkill('bolyingzi_keep');
     player.addMark('bolyingzi_keep',num,false);
     },
     subSkill:{
     keep:{
     charlotte:true,
     onremove:true,
     mark:true,
     intro:{content:'手牌上限+#'},
     mod:{
     maxHandcard:function(player,num){
     return num+player.countMark('bolyingzi_keep');
     },
     },
     },
     },
     },
     bolfanjian:{
     init:function(player){
     player.storage.bolfanjian=[];
     },
     intro:{content:'本阶段已扣置过$花色的牌'},
     group:'bolfanjian_clear',
     subSkill:{
     silent:{
     charlotte:true,
     init:function(player){
     player.storage.bolfanjian=[];
     player.unmarkSkill('bolfanjian');
     },
     },
     clear:{
     charlotte:true,
     trigger:{player:['phaseUseBefore','phaseUseAfter']},
     direct:true,
     firstDo:true,
     content:function(){
     player.storage.bolfanjian=[];
     player.unmarkSkill('bolfanjian');
     },
     },
     },
     enable:'phaseUse',
     filter:function(event,player){
     if(player.hasSkill('bolfanjian_silent')) return false;
     return player.countCards('h',function(card){
     return !player.storage.bolfanjian.contains(get.suit(card));
     });
     },
     filterCard:function(card,player){
     return !player.storage.bolfanjian.contains(get.suit(card));
     },
     filterTarget:lib.filter.notMe,
     discard:false,
     lose:false,
     delay:false,
     content:function(){
     'step 0'
     var list=[];
     for(var suit of lib.suit) list.push(suit);
     list.removeArray(player.storage.bolfanjian);
     player.$throw(cards.length,1000);
     player.lose(cards,ui.ordering);
     game.log(player,'扣置了一张手牌');
     player.chooseControl(lib.suit).set('prompt','请声明一个花色').set('ai',function(){
     return list.randomGet();
     });
     'step 1'
     player.popup(get.translation(result.control));
     game.log(player,'声明了','#y'+get.translation(result.control));
     event.boolx=(get.suit(cards[0])==result.control);
     var num;
     if(target.isTurnedOver()) num=1;
     else if(target.hp>2) num=0;
     else num=1;
     target.chooseControl().set('choiceList',[
     '猜测此牌花色与'+get.translation(player)+'声明的是否一致',
     '将武将牌翻面并令'+get.translation(player)+'的【反间】于本回合失效'
     ]).set('ai',function(){
     return num;
     });
     'step 2'
     game.log(target,'选择',(result.index==1?'#y不猜测':'#g猜测'));
     if(result.index==1){
     player.addTempSkill('bolfanjian_silent');
     target.turnOver();
     player.showCards(cards,get.translation(player)+'扣置的牌');
     target.gain(cards,'gain2');
     event.finish();
     }
     else target.chooseBool('请猜测'+get.translation(player)+'声明的与其扣置的花色是否一致').set('choice',Math.random()>0.75-player.storage.bolfanjian.length*0.25);
     'step 3'
     target.popup(result.bool?'相同':'不相同');
     game.log(target,'认为'+get.translation(player)+'声明的与其扣置的花色','#y'+(result.bool?'相同':'不相同'));
     player.storage.bolfanjian.push(get.suit(cards[0]));
     player.markSkill('bolfanjian');
     player.syncStorage('bolfanjian');
     player.showCards(cards,get.translation(player)+'扣置的牌');
     target.gain(cards,'gain2');
     if((event.boolx&&!result.bool)||(!event.boolx&&result.bool)){
     target.popup('猜错！','wood');
     game.log(target,'猜测','#y错误');
     target.loseHp();
     }
     else{
     player.addTempSkill('bolfanjian_silent');
     target.popup('猜对！','wood');
     game.log(target,'猜测','#g正确');
     }
     },
     ai:{
     order:7,
     expose:0.25,
     result:{
     target:function(player,target){
     if(target.isTurnedOver()) return 2;
     if(player.storage.bolfanjian.length>=3) return false;
     return -1;
     },
     },
     },
     },
     bolkurou:{
     group:'bolkurou_hujia',
     trigger:{player:'phaseUseBegin'},
     filter:function(event,player){
     return player.countCards('he');
     },
     direct:true,
     content:function(){
     'step 0'
     player.chooseCardTarget({
     prompt:get.prompt('bolkurou'),
     prompt2:'将一张牌交给一名其他角色并失去体力',
     filterCard:true,
     position:'he',
     filterTarget:lib.filter.notMe,
     ai1:function(card){
     if(card.name=='du') return 1000;
     return 20-get.value(card);
     },
     ai2:function(target){
     var player=_status.event.player,att=get.attitude(player,target);
     if(player.hp<=1+(['tao','jiu'].contains(ui.selected.cards[0].name)?1:0)) return false;
     if(ui.selected.cards[0].name=='du') return -att;
     return att+20;
     },
     });
     'step 1'
     if(result.bool){
     player.logSkill('bolkurou',result.targets[0]);
     result.targets[0].gain(result.cards,player,'giveAuto');
     player.loseHp(['tao','jiu'].contains(result.cards[0].name)?2:1);
     }
     },
     subSkill:{
     hujia:{
     trigger:{player:'loseHpEnd'},
     forced:true,
     locked:false,
     content:function(){
     player.changeHujia(trigger.num*2);
     },
     },
     },
     },
     bolzhaxiang:{
     mod:{
     cardUsable:function(card,player,num){
     if(player.countUsed()<player.getDamagedHp()) return Infinity;
     },
     targetInRange:function(card,player){
     if(player.countUsed()<player.getDamagedHp()) return true;
     },
     aiOrder:function(player,card,num){
     var name=get.name(card);
     if(name=='sha') return num+10;
     if(name=='tao') return num/10;
     if(get.tag(card,'damage')||get.type(card)=='trick') return num+3;
     },
     },
     mark:true,
     intro:{
     markcount:function(storage,player){
     if(!_status.currentPhase) return undefined;
     return Math.max(0,player.getDamagedHp()-player.countUsed());
     },
     content:function(storage,player){
     var str='<li>诈降增益：'+Math.max(0,player.getDamagedHp()-player.countUsed())+'/'+player.getDamagedHp();
     str+='<br><li>使用前'+get.cnNumber(player.getDamagedHp())+'张牌无距离和次数限制且不可被响应，摸牌阶段多摸'+get.cnNumber(player.getDamagedHp())+'张牌';
     return str;
     },
     },
     group:'bolzhaxiang_mark',
     trigger:{player:['useCard','phaseDrawBegin2']},
     filter:function(event,player){
     if(event.name=='useCard') return _status.currentPhase&&player.countUsed()<=player.getDamagedHp();
     return player.getDamagedHp()>0;
     },
     forced:true,
     content:function(){
     if(trigger.name=='useCard'){
     game.log(trigger.card,'不可被响应');
     trigger.directHit.addArray(game.players);
     }
     else trigger.num+=player.getDamagedHp();
     },
     subSkill:{
     mark:{
     trigger:{global:'phaseBegin',player:['useCard','changeHp']},
     direct:true,
     priority:1,
     content:function(){
     player.markSkill('bolzhaxiang');
     player.syncStorage('bolzhaxiang');
     },
     },
     },
     },


		},
		translate:{
			sp_yangwan:'手杀杨婉',
			spmingxuan:'瞑昡',
			spmingxuan_info:'锁定技。出牌阶段开始时，你须选择至多X张花色各不相同的手牌（X为未选择过选项一的角色），将这些牌随机交给这些角色中的等量角色。然后这些角色依次选择一项：⒈对你使用一张【杀】。⒉交给你一张牌，然后你摸一张牌。',
			spxianchou:'陷仇',
			spxianchou_info:'当你受到有来源的伤害后，你可选择一名不为伤害来源的其他角色。该角色可以弃置一张牌，然后视为对伤害来源使用一张【杀】（无距离限制）。若其因此【杀】造成了伤害，则其摸一张牌，你回复1点体力。',
			liucheng:'刘赪',
			splveying:'掠影',
			splveying_info:'锁定技。①每回合限两次，当你使用【杀】指定目标后，你获得一个“椎”。②当你使用的【杀】结算结束后，若你的“椎”数大于1，则你弃置两个“椎”，然后弃置所有目标角色的各一张手牌。',
			spyingwu:'莺舞',
			spyingwu_info:'若你拥有〖掠影〗，则：①每回合限两次，当你使用非伤害类普通锦囊牌指定目标后，你获得一个“椎”。②当你使用的非伤害类普通锦囊牌结算结束后，若你的“椎”数大于1，则你弃置两个“椎”，然后可以视为使用一张【杀】。',
			sb_huangzhong:'谋黄忠',
			sbliegong:'烈弓',
			sbliegong_info:'①若你的装备区内没有武器牌，则你手牌区内所有【杀】的属性视为无属性。②当你使用牌时，或成为其他角色使用牌的目标后，你记录此牌的花色。③当你使用【杀】指定唯一目标后，若你〖烈弓②〗的记录不为空，则你可亮出牌堆顶的X张牌（X为你〖烈弓②〗记录过的花色数-1），令此【杀】的伤害值基数+Y（Y为亮出牌中被〖烈弓②〗记录过花色的牌的数量），且目标角色不能使用〖烈弓②〗记录过花色的牌响应此【杀】。此【杀】使用结算结束后，你清除〖烈弓②〗的记录。',
			sb_huaxiong:'谋华雄',
			sbyangwei:'扬威',
			sbyangwei_info:'出牌阶段，你可以摸两张牌，令此技能于你的下下个结束阶段前失效，且你获得如下效果直到回合结束：使用【杀】无距离限制，次数上限+1且无视防具。',
			sb_yujin:'谋于禁',
			sbxiayuan:'狭援',
			sbxiayuan_info:'每轮限一次。其他角色受到伤害后，若其因此伤害触发过护甲效果且其没有护甲，则你可弃置两张手牌，令其获得X点护甲（X为其因此伤害触发护甲效果而失去的护甲数量）。',
			sbjieyue:'节钺',
			sbjieyue_info:'结束阶段，你可以令一名其他角色获得1点护甲。然后其可以交给你一张牌。',
			bol_caocao:'谋曹操',
            boljianxiong:'奸雄',
            boljianxiong_info:'游戏开始时，你可以获得至多2枚“治世”标记。当你受到伤害后，你可以获得对你造成伤害的牌并摸X张牌（X为1-你拥有的“治世”标记数，且X至少为0），然后你可以失去1枚“治世”标记。',
            bolqingzheng:'清正',
            bolqingzheng_info:'出牌阶段开始时，你可以弃置手牌种Y种花色的所有牌（Y为3-你拥有的“治世”标记数，且Y至少为1）并选择一名其他角色，你观看其手牌并弃置其一种花色的所有牌，然后若你弃置的牌数大于其，你对其造成1点伤害。然后若你拥有〖奸雄〗且你拥有的“治世”标记数小于2，你可以选择获得1枚“治世”标记。',
            bolhujia:'护驾',
            bolhujia_info:'主公技，每轮限一次，当你受到伤害时，你可以将此伤害转移给一名其他魏势力角色。',
            bol_xiahoushi:'谋夏侯氏',
            bolqiaoshi:'樵拾',
            bolqiaoshi_info:'每回合限一次，当你受到其他角色造成的伤害后，伤害来源可以令你回复等同此次伤害的体力值，然后其摸两张牌。',
            bolyanyu:'燕语',
            bolyanyu_info:'出牌阶段限四次，你可以弃置一张【杀】并摸一张牌；出牌阶段结束时，你可以令一名其他角色摸X张牌（X为你本阶段以此法重铸【杀】的次数）。',
            bol_zhouyu:'谋周瑜',
            bolyingzi:'英姿',
            bolyingzi_info:'锁定技，摸牌阶段开始时，你每满足下面一项，本阶段你的额外摸牌数+1且本回合你的手牌上限+1：①手牌数不小于2；②体力值不小于2；③装备区中的牌数不小于1。',
            bolfanjian:'反间',
            bolfanjian_info:'出牌阶段，你可以选择一名其他角色并扣置一张牌，然后声明一个花色，其须选择一项：①猜测你扣置的牌的花色与你声明的是否一致；②将武将牌翻面，且此技能失效直至回合结束。然后你展示扣置的牌并令其获得此牌，若其选择猜测，则：若其猜对，此技能失效直至回合结束；若猜错，其失去1点体力。',
            bol_huanggai:'谋黄盖',
            bolkurou:'苦肉',
            bolkurou_info:'出牌阶段开始时，你可以将一张牌交给一名其他角色，然后失去1点体力（若你交出的牌为【桃】或【酒】，则改为失去2点体力）。当你失去1点体力后，你获得2点护甲。',
            bolzhaxiang:'诈降',
            bolzhaxiang_info:'锁定技，你每回合使用的前X张牌无距离和次数限制且不可被响应；摸牌阶段，你多摸X张牌（X为你已损失的体力值）。',
		},
	};
});
