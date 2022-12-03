'use strict';
game.import('character', function (lib, game, ui, get, ai, _status) {
    return {
        //strategy and battle, "sb" in short
        name: 'daba',
        connect: true,
        character: {
            wuzhaoxiang: ['female', 'daba', 4, ['wufanghun', 'wufuhan']],
            weizhaoxiang: ['female', 'daba', 4, ['wufanghun', 'weifuhan']],
            fengdi: ["female", "daba", 4, ["ark_pojun", "ark_bitang"]],
            huafalin: ["female", "daba", 3, ["buwen2", "bangneng2", "shenji2"]],
            helage: ["male", "daba", 3, ["xianyue", "qiusheng", "tashijiangjun"]],
            sp_nengtianshi: ["female", "daba", 3, ["sp_guozai", "sp_zhufu"]],
            xiaozhi: ["male", "daba", 3, ["pika", "penhuo"]],
            pikaqiu: ["male", "daba", 3, ["pika_skill"]],
            penhuolong: ["male", "daba", 3, ["penhuo_skill"]],
            xushimin: ['male', 'daba', 4, ['sbliegong', 'biyue']],
            chenshuai: ['male', 'daba', 4, ['feigong', 'jianyu']],
            mushuihan: ['male', 'daba', 4, ['guaishuai', 'guaichu', 'guaimin']],
            huanshi: ['male', 'daba', 4, ['huanxie', 'yaowan']],
            xukun: ['fmale', 'daba', 4, ['lianxi', 'baozha']],
            dongsheng: ['male', 'daba', 4, ['pashan']],
            zhuangzhou: ['male', 'daba', 4, ['jiekong', 'miankong']],
            yadianna: ['female', 'daba', 4, ['bugui', 'shiye', 'wuquan']],
            mositima: ['female', 'daba', 4, ['xushi']],
        },
        skill: {
            //赵襄
            wufuhan: {
                audio: 'fuhan',
                trigger: { player: 'phaseZhunbeiBegin' },
                unique: true,
                limited: true,
                skillAnimation: true,
                animationColor: 'orange',
                forceunique: true,
                filter: function (event, player) {
                    return player.countMark('fanghun') > 0;
                },
                content: function () {
                    'step 0'
                    if (player.storage.fanghun) player.draw(player.storage.fanghun);
                    player.removeMark('fanghun', player.storage.fanghun);
                    player.awakenSkill('wufuhan');
                    'step 1'
                    var list;
                    if (_status.characterlist) {
                        list = [];
                        for (var i = 0; i < _status.characterlist.length; i++) {
                            var name = _status.characterlist[i];
                            if (lib.character[name][1] == 'wu') list.push(name);
                        }
                    }
                    else if (_status.connectMode) {
                        list = get.charactersOL(function (i) {
                            return lib.character[i][1] != 'wu';
                        });
                    }
                    else {
                        list = get.gainableCharacters(function (info) {
                            return info[1] == 'wu';
                        });
                    }
                    var players = game.players.concat(game.dead);
                    for (var i = 0; i < players.length; i++) {
                        list.remove(players[i].name);
                        list.remove(players[i].name1);
                        list.remove(players[i].name2);
                    }
                    list.remove('zhaoyun');
                    list.remove('re_zhaoyun');
                    list.remove('ol_zhaoyun');
                    list = list.randomGets(Math.max(4, game.countPlayer()));
                    var skills = [];
                    for (var i of list) {
                        skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                            var info = get.info(skill);
                            return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill;
                        }));
                    }
                    if (!list.length || !skills.length) { event.finish(); return; }
                    if (player.isUnderControl()) {
                        game.swapPlayerAuto(player);
                    }
                    var switchToAuto = function () {
                        _status.imchoosing = false;
                        event._result = {
                            bool: true,
                            skills: skills.randomGets(2),
                        };
                        if (event.dialog) event.dialog.close();
                        if (event.control) event.control.close();
                    };
                    var chooseButton = function (list, skills) {
                        var event = _status.event;
                        if (!event._result) event._result = {};
                        event._result.skills = [];
                        var rSkill = event._result.skills;
                        var dialog = ui.create.dialog('请选择获得至多两个技能', [list, 'character'], 'hidden');
                        event.dialog = dialog;
                        var table = document.createElement('div');
                        table.classList.add('add-setting');
                        table.style.margin = '0';
                        table.style.width = '100%';
                        table.style.position = 'relative';
                        for (var i = 0; i < skills.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.link = skills[i];
                            table.appendChild(td);
                            td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                setTimeout(function () {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                if (!this.classList.contains('bluebg')) {
                                    if (rSkill.length >= 2) return;
                                    rSkill.add(link);
                                    this.classList.add('bluebg');
                                }
                                else {
                                    this.classList.remove('bluebg');
                                    rSkill.remove(link);
                                }
                            });
                        }
                        dialog.content.appendChild(table);
                        dialog.add('　　');
                        dialog.open();

                        event.switchToAuto = function () {
                            event.dialog.close();
                            event.control.close();
                            game.resume();
                            _status.imchoosing = false;
                        };
                        event.control = ui.create.control('ok', function (link) {
                            event.dialog.close();
                            event.control.close();
                            game.resume();
                            _status.imchoosing = false;
                        });
                        for (var i = 0; i < event.dialog.buttons.length; i++) {
                            event.dialog.buttons[i].classList.add('selectable');
                        }
                        game.pause();
                        game.countChoose();
                    };
                    if (event.isMine()) {
                        chooseButton(list, skills);
                    }
                    else if (event.isOnline()) {
                        event.player.send(chooseButton, list, skills);
                        event.player.wait();
                        game.pause();
                    }
                    else {
                        switchToAuto();
                    }
                    'step 2'
                    var map = event.result || result;
                    if (map && map.skills && map.skills.length) {
                        for (var i of map.skills) player.addSkillLog(i);
                    }
                    game.broadcastAll(function (list) {
                        game.expandSkills(list);
                        for (var i of list) {
                            var info = lib.skill[i];
                            if (!info) continue;
                            if (!info.audioname2) info.audioname2 = {};
                            info.audioname2.old_yuanshu = 'weidi';
                        }
                    }, map.skills);
                    'step 3'
                    if (player.isMinHp()) player.recover();
                },
            },
            weifuhan: {
                audio: 'fuhan',
                trigger: { player: 'phaseZhunbeiBegin' },
                unique: true,
                limited: true,
                skillAnimation: true,
                animationColor: 'orange',
                forceunique: true,
                filter: function (event, player) {
                    return player.countMark('fanghun') > 0;
                },
                content: function () {
                    'step 0'
                    if (player.storage.fanghun) player.draw(player.storage.fanghun);
                    player.removeMark('fanghun', player.storage.fanghun);
                    player.awakenSkill('weifuhan');
                    'step 1'
                    var list;
                    if (_status.characterlist) {
                        list = [];
                        for (var i = 0; i < _status.characterlist.length; i++) {
                            var name = _status.characterlist[i];
                            if (lib.character[name][1] == 'wei') list.push(name);
                        }
                    }
                    else if (_status.connectMode) {
                        list = get.charactersOL(function (i) {
                            return lib.character[i][1] != 'wei';
                        });
                    }
                    else {
                        list = get.gainableCharacters(function (info) {
                            return info[1] == 'wei';
                        });
                    }
                    var players = game.players.concat(game.dead);
                    for (var i = 0; i < players.length; i++) {
                        list.remove(players[i].name);
                        list.remove(players[i].name1);
                        list.remove(players[i].name2);
                    }
                    list.remove('zhaoyun');
                    list.remove('re_zhaoyun');
                    list.remove('ol_zhaoyun');
                    list = list.randomGets(Math.max(4, game.countPlayer()));
                    var skills = [];
                    for (var i of list) {
                        skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                            var info = get.info(skill);
                            return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill;
                        }));
                    }
                    if (!list.length || !skills.length) { event.finish(); return; }
                    if (player.isUnderControl()) {
                        game.swapPlayerAuto(player);
                    }
                    var switchToAuto = function () {
                        _status.imchoosing = false;
                        event._result = {
                            bool: true,
                            skills: skills.randomGets(2),
                        };
                        if (event.dialog) event.dialog.close();
                        if (event.control) event.control.close();
                    };
                    var chooseButton = function (list, skills) {
                        var event = _status.event;
                        if (!event._result) event._result = {};
                        event._result.skills = [];
                        var rSkill = event._result.skills;
                        var dialog = ui.create.dialog('请选择获得至多两个技能', [list, 'character'], 'hidden');
                        event.dialog = dialog;
                        var table = document.createElement('div');
                        table.classList.add('add-setting');
                        table.style.margin = '0';
                        table.style.width = '100%';
                        table.style.position = 'relative';
                        for (var i = 0; i < skills.length; i++) {
                            var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
                            td.link = skills[i];
                            table.appendChild(td);
                            td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
                            td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                                if (_status.dragged) return;
                                if (_status.justdragged) return;
                                _status.tempNoButton = true;
                                setTimeout(function () {
                                    _status.tempNoButton = false;
                                }, 500);
                                var link = this.link;
                                if (!this.classList.contains('bluebg')) {
                                    if (rSkill.length >= 2) return;
                                    rSkill.add(link);
                                    this.classList.add('bluebg');
                                }
                                else {
                                    this.classList.remove('bluebg');
                                    rSkill.remove(link);
                                }
                            });
                        }
                        dialog.content.appendChild(table);
                        dialog.add('　　');
                        dialog.open();

                        event.switchToAuto = function () {
                            event.dialog.close();
                            event.control.close();
                            game.resume();
                            _status.imchoosing = false;
                        };
                        event.control = ui.create.control('ok', function (link) {
                            event.dialog.close();
                            event.control.close();
                            game.resume();
                            _status.imchoosing = false;
                        });
                        for (var i = 0; i < event.dialog.buttons.length; i++) {
                            event.dialog.buttons[i].classList.add('selectable');
                        }
                        game.pause();
                        game.countChoose();
                    };
                    if (event.isMine()) {
                        chooseButton(list, skills);
                    }
                    else if (event.isOnline()) {
                        event.player.send(chooseButton, list, skills);
                        event.player.wait();
                        game.pause();
                    }
                    else {
                        switchToAuto();
                    }
                    'step 2'
                    var map = event.result || result;
                    if (map && map.skills && map.skills.length) {
                        for (var i of map.skills) player.addSkillLog(i);
                    }
                    game.broadcastAll(function (list) {
                        game.expandSkills(list);
                        for (var i of list) {
                            var info = lib.skill[i];
                            if (!info) continue;
                            if (!info.audioname2) info.audioname2 = {};
                            info.audioname2.old_yuanshu = 'weidi';
                        }
                    }, map.skills);
                    'step 3'
                    if (player.isMinHp()) player.recover();
                },
            },
            wufanghun: {
                mod: {
                    aiValue: function (player, card, num) {
                        if (card.name != 'sha' && card.name != 'shan') return;
                        var geti = function () {
                            var cards = player.getCards('hs', function (card) {
                                return card.name == 'sha' || card.name == 'shan';
                            });
                            if (cards.contains(card)) {
                                return cards.indexOf(card);
                            }
                            return cards.length;
                        };
                        return Math.max(num, [7, 5, 5, 3][Math.min(geti(), 3)]);
                    },
                },
                locked: false,
                audio: 'fanghun',
                inherit: 'fanghun',
                trigger: {
                    player: 'useCard',
                    target: 'useCardToTargeted',
                },
            },
            //风笛
            "ark_pojun": {
                trigger: { player: "useCardToBegin" },
                logTarget: "target",
                filter: function (evt) {
                    return evt.target && evt.card && evt.card.name == "sha" && evt.target.countCards('h');
                },
                check: function (evt, me) {
                    var noh = evt.target.hasSkillTag("noh", false, {
                        target: me,
                        cards: evt.target.get("h"),
                    }, true), att = get.attitude(me, evt.target);
                    if (att > 0 && noh === true) return true;
                    if (att < 0 && noh === true) return evt.target.countCards("h") / 2 > evt.target.hp;
                    if (att <= 0 && noh !== true) return true;
                    return false;
                },
                content: function () {
                    "step 0"
                    var hs = trigger.target.getCards('h');
                    hs.sort(function (a, b) {
                        return get.value(b, player) - get.value(a, player);
                    });
                    trigger.target.chooseCard([1, hs.length], "请分配你的手牌(选择的卡牌为第一份，未选择的为第二份)").set('ai', function (card) {
                        var rand = _status.event.rand;
                        var list = _status.event.list;
                        if (_status.event.att) {
                            if (ui.selected.cards.length >= Math.ceil(list.length / 2)) return 0;
                            var value = get.value(card);
                            return 9 - value;
                        }
                        if (ui.selected.cards.length >= Math.floor(list.length / 2)) return 0;
                        return (list.indexOf(card) % 2 == rand) ? 1 : 0;
                    }).set('rand', (Math.random() < 0.6) ? 1 : 0).set('list', hs).set('att', get.attitude(trigger.target, player) > 0);
                    "step 1"
                    event.cards1 = result.cards || [];
                    event.cards2 = trigger.target.getCards('h', function (card) {
                        return !event.cards1.contains(card);
                    });
                    "step 2"
                    var num1 = event.cards1.length, num2 = event.cards2.length;
                    event.videoId = lib.status.videoId++;
                    var d = function (id, event) {
                        var dialog = ui.create.dialog("【" + get.translation(event.name) + "】", 'forcebutton');
                        dialog.addText('要弃置哪份牌？');
                        var table = ui.create.div({
                            margin: '2%',
                            width: '80%',
                            height: "120px",
                            textAlign: 'center',
                            position: 'relative',
                            background: "rgba(0,0,0,0.3)",
                            boxShadow: "rgba(0, 0, 0, 0.4) 0 0 0 1px",
                            borderRadius: "6px",
                            transition: "all 0.3s",
                            overflow: "auto",
                            whiteSpace: "nowrap"
                        });
                        table.classList.add('add-setting');
                        table.addEventListener("wheel", function (e) {
                            e.preventDefault();
                            table.scrollLeft += e.deltaY;
                        });
                        Object.assign(dialog.style, {
                            background: "rgba(0,0,0,0.2)",
                            boxShadow: "rgba(0, 0, 0, 0.3) 0 0 0 1px",
                            borderRadius: "6px",
                        });
                        table.innerHTML = "<span style=position:fixed;left:35%;>第一份牌(共" + get.cnNumber(event.cards1.length) + "张)</span><br>";
                        var table2 = table.cloneNode(true);
                        table2.innerHTML = "<span style=position:fixed;left:35%;>第二份牌(共" + get.cnNumber(event.cards2.length) + "张)</span><br>";
                        dialog.add(table);
                        dialog.add(table2);
                        for (var i of event.cards1) ui.create.button(null, "blank", table);
                        for (var i of event.cards2) ui.create.button(null, "blank", table2);
                        dialog.videoId = id;
                    };
                    if (player.isOnline()) player.send(d, event.videoId, event);
                    if (event.isMine()) d(event.videoId, event);
                    player.chooseControl("第一份", "第二份").set('choice', num1 > num2 ? 0 : 1);
                    "step 3"
                    if (result.index > -1) trigger.target.discard(event["cards" + (result.index + 1)] || []);
                    game.broadcastAll('closeDialog', event.videoId);
                }
            },

            "ark_bitang": {
                subSkill: {
                    sha: {
                        mod: {
                            cardUsable: function (card) {
                                if (card.name == 'sha') return Infinity;
                            },
                        },
                        mark: true,
                        intro: {
                            content: "使用【杀】无次数限制",
                        },
                        sub: true,
                    },
                    a: { sub: true },
                },
                trigger: {
                    player: "useCard",
                },
                forced: true,
                filter: function (event, player, _, skill) {
                    return !player.hasSkill(skill + '_a') && event.card.name == 'sha' && player.isPhaseUsing();
                },
                content: function () {
                    'step 0'
                    if (!player.hasSkill('ark_bitang_sha')) {
                        player.addTempSkill('ark_bitang_sha');
                        event.finish();
                    };
                    'step 1'
                    player.chooseToDiscard('he', { subtype: 'equip1' }, '请弃置一张武器牌或失去一点体力').set('ai', function (card) {
                        var player = get.player();
                        return player.hasSha() ? 8 - get.value(card) : player.hp > 2 ? 0 : 100 - get.value(card);
                    });
                    'step 2'
                    if (!result.cards) {
                        player.loseHp();
                        player.addTempSkill(event.name + '_a');
                        player.removeSkill(event.name + '_sha', true);
                    };
                },
                ai: {
                    effect: {
                        player: function (card, player, target) {
                            if (get.name(card) == 'sha' && player.hp < 3 && player.hasSkill('ark_bitang_sha') && !player.getEquip(1)) return [0, -1, 0, -1];
                        },
                    },
                },
            },
            //华法琳
            buwen2: {
                group: ['manjia1', 'manjia2']
            },
            manjia1: {
                trigger: { target: ['useCardToBefore', 'shaBegin'] },
                forced: true,
                priority: 6,
                filter: function (event, player, name) {
                    if (name == 'shaBegin') return lib.skill.tengjia3.filter(event, player);
                    return lib.skill.tengjia1.filter(event, player);
                },
                content: function () {
                    trigger.cancel();
                },
                ai: {
                    effect: {
                        target: function (card, player, target, current) {

                            return lib.skill.tengjia1.ai.effect.target.apply(this, arguments);
                        }
                    }
                }
            },
            manjia2: {
                trigger: { player: 'damageBegin3' },
                filter: function (event, player) {

                    if (event.nature == 'fire') return true;
                },
                forced: true,
                check: function () {
                    return false;
                },
                content: function () {
                    trigger.num++;
                },
                ai: {
                    effect: {
                        target: function (card, player, target, current) {

                            return lib.skill.tengjia2.ai.effect.target.apply(this, arguments);
                        }
                    }
                }
            },
            bangneng2: {
                trigger: { global: 'useCard' },
                filter: function (event, player) {
                    return event.card.name == 'sha' && event.player != player &&
                        player.countCards('h') > 0;
                },
                content: function () {
                    'step 0'
                    player.chooseCard('选择一张牌置于牌堆顶', 'he', true);
                    'step 1'
                    player.lose(result.cards, ui.cardPile, 'insert');
                    player.draw(1, 'bottom');
                },
            },
            shenji2: {
                enable: "phaseUse",
                usable: 1,
                filter: function (event, player) {
                    return player.countCards('h') > 0;
                },
                content: function () {
                    "step 0"
                    player.chooseToDiscard('h') // 选择弃置一张手牌
                    "step 1"
                    if (result.bool) { // 有没有弃置手牌
                        player.chooseTarget(true) // 选择目标
                    }
                    "step 2"
                    if (result.bool && result.targets && result.targets.length > 0) { // 是否选择了目标
                        let r = result.targets // 选择的目标数组
                        // trigger是选择的目标
                        r[0].addSkill("wusheng") // 给该角色增加神技
                    }
                },
            },

            xianyue: {
                mod: {
                    globalFrom: function (player, target, distance) {
                        if (!player.getEquip(1)) return distance - 2;
                    },
                },
                trigger: {
                    source: "damageSource",
                },
                forced: true,
                filter: function (event, player) {
                    return player.isDamaged() && event.card;
                },
                content: function () {
                    player.recover(trigger.num);
                },
            },
            qiusheng: {
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == 'sha') {
                            return num + player.getDamagedHp();
                        }
                    },
                },
                trigger: {
                    player: "dying",
                },
                usable: 1,
                forced: true,
                content: function () {
                    'step 0'
                    player.draw(4);
                    var stat = player.getStat();
                    stat.card = {};
                    for (var i in stat.skill) {
                        var bool = false;
                        var info = lib.skill[i];
                        if (info.enable != undefined) {
                            if (typeof info.enable == 'string' && info.enable == 'phaseUse') bool = true;
                            else if (typeof info.enable == 'object' && info.enable.contains('phaseUse')) bool = true;
                        }
                        if (bool) stat.skill[i] = 0;
                    }
                    'step 1'
                    player.phaseUse();
                },
            },
            tashijiangjun: {
                trigger: {
                    player: "recoverBegin",
                },
                forced: true,
                filter: function (event, player) {
                    if (event.getParent(2).skill == 'xianyue') return false;
                    return true;
                },
                content: function () {
                    trigger.cancel();
                },
                ai: {
                    hpUnRe: true,
                },
            },

            //sp能天使
            "sp_guozai": {
                group: ["sp_guozai_pro2begin"],
                firstDo: true,
                trigger: {
                    player: "useCard1",
                },
                forced: true,
                filter: function (event, player) {
                    return event.card.name == 'sha' && player.countUsed('sha', true) > 1 && event.getParent().type == 'phase';
                },
                content: function () {
                },
                mod: {
                    cardUsable: function (card, player, num) {
                        if (card.name == 'sha') return num + 1;
                    },
                    //                    attackFrom: function (from, to, distance, player) {
                    //                        return distance - Infinity;
                    //                    },
                },
                subSkill: {
                    "pro2": {
                        enable: "chooseToUse",
                        filterCard: function (card, player) {
                            return get.color(card) == player.storage.sp_guozai_color;
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                        },
                        viewAsFilter: function (player) {
                            return player.countCards('hes', function (card) {
                                return get.color(card) == player.storage.sp_guozai_color;
                            });
                        },
                        check: function (card) {
                            return 4 - get.value(card)
                        },
                        prompt: function () {
                            var player = _status.event.player;
                            var str = '将一张' + (player.storage.sp_guozai_color == 'red' ? '红' : '黑') + '色牌当做【杀】使用';
                            return str;
                        },
                        sub: true,
                    },
                    "pro2begin": {
                        trigger: {
                            player: "phaseZhunbeiBegin",
                        },
                        filter: function (event, player) {
                            return true
                        },
                        popup: false,
                        prompt: "过载：你可以进行一次判定，此回合内你可以将与判定牌同颜色的牌视为【杀】使用",
                        content: function () {
                            'step 0'
                            player.logSkill('sp_guozai')
                            player.judge();
                            'step 1'
                            player.gain(result.card, 'gain2');
                            player.storage.sp_guozai_color = result.color
                            player.addTempSkill('sp_guozai_pro2')
                        },
                        sub: true,
                    },
                },
            },
            "sp_zhufu": {
                trigger: {
                    global: "gameDrawAfter",
                    player: "enterGame",
                },
                direct: true,
                filter: function (event, player) {
                    return game.players.length > 1;
                },
                content: function () {
                    'step 0'
                    player.chooseTarget('你可以选择【祝福】的目标', lib.translate.sp_zhufu_info, function (card, player, target) {
                        return target != player
                    }).set('ai', function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (att > 0) return att + 1;
                        if (att == 0) return Math.random();
                        return att;
                    }).animate = false;
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.logSkill('sp_zhufu', target)
                        player.gainMaxHp(true);
                        player.recover();
                        target.gainMaxHp(true);
                        target.recover();
                    }
                },
            },
            //小智
            penhuo: {
                enable: "phaseUse",
                usable: 1,
                init: function (player) {
                    player.storage["penhuo"] = false
                },
                filter: function (event, player) {
                    return !player.storage["penhuo"]
                },
                content: function () {
                    var fellow = game.addPlayer(9, "penhuolong", "");
                    fellow.directgain(get.cards(4));
                    fellow.addSkill("penhuo_skill")
                    fellow.side = true;
                    fellow.ai.friend.push(player);
                    fellow.identity = player.identity;
                    player.storage["penhuo"] = true
                }
            },
            pika: {
                enable: "phaseUse",
                usable: 1,
                init: function (player) {
                    player.storage["pika"] = false
                },
                filter: function (event, player) {
                    return !player.storage["pika"]
                },
                content: function () {
                    var fellow = game.addPlayer(10, "pikaqiu", "");
                    fellow.directgain(get.cards(4));
                    fellow.addSkill("pika_skill")
                    fellow.side = true;
                    fellow.ai.friend.push(player);
                    fellow.identity = player.identity;
                    player.storage["pika"] = true
                },
                ai: {
                    order: 6,
                    result: {
                        player: 1
                    }
                }
            },
            penhuo_skill: {
                forced: true,
                trigger: { source: "damageBegin" },
                content: function () {
                    trigger.card && (trigger.card.nature = 'fire')
                }
            },
            pika_skill: {
                forced: true,
                trigger: { source: "damageBegin" },
                content: function () {
                    trigger.card && (trigger.card.nature = 'thunder')
                }
            },
            //黄忠
            sbliegong: {
                audio: 2,
                mod: {
                    cardnature: function (card, player) {
                        if (!player.getEquip(1) && get.name(card, player) == 'sha') return false;
                    },
                },
                trigger: { player: 'useCardToPlayered' },
                filter: function (event, player) {
                    return !event.getParent()._sbliegong_player && event.targets.length == 1 && event.card.name == 'sha' && player.getStorage('sbliegong').length > 0;
                },
                prompt2: function (event, player) {
                    var str = '', storage = player.getStorage('sbliegong');
                    if (storage.length > 1) {
                        str += ('展示牌堆顶的' + get.cnNumber(storage.length - 1) + '张牌并增加伤害；且');
                    }
                    str += ('令' + get.translation(event.target) + '不能使用花色为');
                    for (var i = 0; i < storage.length; i++) {
                        str += get.translation(storage[i]);
                    }
                    str += ('的牌响应' + get.translation(event.card));
                    return str;
                },
                logTarget: 'target',
                check: function (event, player) {
                    var target = event.target;
                    if (get.attitude(player, target) > 0) return false;
                    if (target.hasSkillTag('filterDamage', null, {
                        player: player,
                        card: event.card,
                    })) return false;
                    var storage = player.getStorage('sbliegong');
                    if (storage.length >= 4) return true;
                    if (storage.length < 3) return false;
                    if (target.hasShan()) return storage.contains('heart') && storage.contains('diamond');
                    return true;
                },
                content: function () {
                    var storage = player.getStorage('sbliegong').slice(0);
                    var num = storage.length - 1;
                    var evt = trigger.getParent();
                    if (num > 0) {
                        if (typeof evt.baseDamage != 'number') evt.baseDamage = 1;
                        var cards = get.cards(num);
                        player.showCards(cards.slice(0), get.translation(player) + '发动了【烈弓】');
                        while (cards.length > 0) {
                            var card = cards.pop();
                            if (storage.contains(get.suit(card, false))) evt.baseDamage++;
                            ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
                        }
                        game.updateRoundNumber();
                    }
                    evt._sbliegong_player = player;
                    player.addTempSkill('sbliegong_clear');
                    var target = trigger.target;
                    target.addTempSkill('sbliegong_block');
                    if (!target.storage.sbliegong_block) target.storage.sbliegong_block = [];
                    target.storage.sbliegong_block.push([evt.card, storage]);
                    lib.skill.sbliegong.updateBlocker(target);
                },
                updateBlocker: function (player) {
                    var list = [], storage = player.storage.sbliegong_block;
                    if (storage && storage.length) {
                        for (var i of storage) list.addArray(i[1]);
                    }
                    player.storage.sbliegong_blocker = list;
                },
                ai: {
                    threaten: 3.5,
                    directHit_ai: true,
                    halfneg: true,
                    skillTagFilter: function (player, tag, arg) {
                        if (arg && arg.card && arg.card.name == 'sha') {
                            var storage = player.getStorage('sbliegong');
                            if (storage.length < 3 || !storage.contains('heart') || !storage.contains('diamond')) return false;
                            var target = arg.target;
                            if (target.hasSkill('bagua_skill') || target.hasSkill('bazhen') || target.hasSkill('rw_bagua_skill')) return false;
                            return true;
                        }
                        return false;
                    },
                },
                intro: {
                    content: '已记录花色：$',
                    onunmark: true,
                },
                group: 'sbliegong_count',
                subSkill: {
                    clear: {
                        trigger: { player: 'useCardAfter' },
                        forced: true,
                        charlotte: true,
                        popup: false,
                        filter: function (event, player) {
                            return event._sbliegong_player == player;
                        },
                        content: function () {
                            player.unmarkSkill('sbliegong');
                        },
                    },
                    block: {
                        mod: {
                            cardEnabled: function (card, player) {
                                if (!player.storage.sbliegong_blocker) return;
                                var suit = get.suit(card);
                                if (suit == 'none') return;
                                var evt = _status.event;
                                if (evt.name != 'chooseToUse') evt = evt.getParent('chooseToUse');
                                if (!evt || !evt.respondTo || evt.respondTo[1].name != 'sha') return;
                                if (player.storage.sbliegong_blocker.contains(suit)) return false;
                            },
                        },
                        trigger: {
                            player: ['damageBefore', 'damageCancelled', 'damageZero'],
                            target: ['shaMiss', 'useCardToExcluded', 'useCardToEnd'],
                            global: ['useCardEnd'],
                        },
                        forced: true,
                        firstDo: true,
                        charlotte: true,
                        onremove: function (player) {
                            delete player.storage.sbliegong_block;
                            delete player.storage.sbliegong_blocker;
                        },
                        filter: function (event, player) {
                            if (!event.card || !player.storage.sbliegong_block) return false;
                            for (var i of player.storage.sbliegong_block) {
                                if (i[0] == event.card) return true;
                            }
                            return false;
                        },
                        content: function () {
                            var storage = player.storage.sbliegong_block;
                            for (var i = 0; i < storage.length; i++) {
                                if (storage[i][0] == trigger.card) {
                                    storage.splice(i--, 1);
                                }
                            }
                            if (!storage.length) player.removeSkill('sbliegong_block');
                            else lib.skill.sbliegong.updateBlocker(target);
                        },
                    },
                    count: {
                        trigger: {
                            player: 'useCard',
                            target: 'useCardToTargeted',
                        },
                        forced: true,
                        filter: function (event, player, name) {
                            if (name != 'useCard' && player == event.player) return false;
                            var suit = get.suit(event.card);
                            if (!lib.suit.contains(suit)) return false;
                            if (player.storage.sbliegong && player.storage.sbliegong.contains(suit)) return false;
                            return true;
                        },
                        content: function () {
                            player.markAuto('sbliegong', [get.suit(trigger.card)]);
                        },
                    },
                },
            },
            // 市民闭月
            biyue: {
                audio: 2,
                trigger: { player: 'phaseJieshuBegin' },
                frequent: true,
                preHidden: true,
                content: function () {
                    player.draw();
                },
            },

            //陈帅
            feigong: {
                animationStr: '非攻',
                trigger: { source: 'damageBefore' },
                content: function () {
                    'step 0'
                    player.chooseTarget(1, function (card, player, trigger) {
                        return trigger.hp !== trigger.maxHp
                    })
                    'step 1'
                    if (result.bool) {
                        var r = result.targets[0]
                        trigger.cancel();
                        r.recover(Math.min(r.getDamagedHp(), trigger.num))
                    }
                },
                ai: {
                    effect: {
                        threaten: 1.1,
                        player: function (card, player, target) {
                            if (player.hp < player.maxHp - 1) return 1.5
                        },
                        target: function (card, player, target) {
                            if (target.hp === 1) return 1.0
                        }
                    }
                }
            },
            jianyu: {
                animationStr: '箭雨',
                trigger: { player: 'phaseUseBegin' },
                direct: true,
                filter: function (event, player) {
                    let r
                    let s = player.stat
                    for (let i = s.length - 2; i > 0; i--) {
                        if (s[i].isMe) {
                            r = s[i]
                            break
                        }
                    }
                    if (!r) {
                        return true
                    }
                    if (!r.damage) {
                        return true
                    }
                    return r.damage < 1
                },
                content: function () {
                    player.chooseUseTarget({ name: 'wanjian', isCard: true }, get.prompt('jianyu'), '视为使用一张【万箭齐发】').logSkill = 'jianyu';
                },
            },

            //沐水涵
            guaishuai: {
                forced: true,
                trigger: { global: 'useCardToPlayered' },// 使用卡盘指定别人
                filter: function (event, player, game) {
                    if (!event.isFirstTarget) return false;   //指定第一个目标时才发动，防止一个万剑摸14牌
                    //if(get.type(event.card)!='trick') return false;  //如果是锦囊牌
                    if (get.info(event.card).multitarget) return false;  //牌是多目标的牌
                    if (!event.targets.includes(player)) return false;  //目标有自己
                    if (event.targets.length < 2) return false;   //目标数大于1
                    return player.hp > 0;
                },
                content: function () {
                    player.draw(2);
                },
            },
            guaichu: {
                forced: true,
                trigger: { player: 'damageEnd' },// 受到伤害时
                filter: function (event, player, game) {
                    if (_status.currentPhase !== player) { // 必须在自己回合内受到伤害才会触发
                        return false
                    }
                    return true
                },
                content: function () {
                    player.draw(2);
                },
            },
            guaimin: {
                forced: true,
                trigger: { global: 'phaseDiscardAfter' },
                filter: function (event, player,) {
                    return event.player != player; //不包含自己,则其他角色
                },
                content: function () {
                    player.addTempSkill('guaimin2', 'phaseBefore'); // 添加临时技能，直到回合结束
                },
            },
            guaimin2: {
                forced: true,
                trigger: { global: 'drawAfter' },
                filter: function (event, player,) {
                    return event.player != player; //不包含自己,则其他角色
                },
                content: function () {
                    player.draw(2);
                },
            },
            //幻始
            huanxie: {
                enable: 'phaseUse',
                usable: 1,
                skillAnimation: true,
                animationColor: 'metal',
                content: function () {
                    "step 0"
                    event.delay = false;
                    event.targets = game.filterPlayer();
                    event.targets.remove(player);
                    event.targets.sort(lib.sort.seat);
                    player.line(event.targets, 'green');
                    event.targets2 = event.targets.slice(0);
                    event.targets3 = event.targets.slice(0);
                    "step 1"
                    player.draw(5);
                    player.removeSkill('huanxie');
                    "step 2"
                    if (event.targets.length) {
                        event.current = event.targets.shift()
                        if (event.current.countCards('e')) event.delay = true;
                        event.current.discard(event.current.getCards('e')).delay = false;
                    }
                    "step 3"
                    if (event.delay) game.delay(0.5);
                    event.delay = false;
                    if (event.targets.length) event.goto(2);
                    "step 4"
                    if (event.targets3.length) {
                        var target = event.targets3.shift();
                        target.chooseToDiscard(100, 'h', true).delay = false;
                        if (target.countCards('h')) event.delay = true;
                    }
                    "step 5"
                    if (event.delay) game.delay(0.5);
                    event.delay = false;
                    if (event.targets3.length) event.goto(4);
                },
                ai: {
                    basic: {
                        order: 20
                    },
                    player: function (player) {
                        if (player.countCards('he', 'zhuge')) return 1
                        if (player.hp < 2) return 1
                        return -1
                    }
                }
            },
            yaowan: {
                forced: true,
                trigger: { player: 'phaseJieshuBegin' },
                filter: function (event, player,) {
                    return !player.hasSkill('huanxie'); //不包含自己,则其他角色
                },
                content: function () {
                    player.die(); // 添加临时技能，直到回合结束
                },
            },

            //最爱的坤坤
            lianxi: {
                forced: true,
                trigger: { player: 'phaseZhunbeiBegin' },
                init: function (player) {
                    player.storage.start = new Date().getTime()
                },
                filter: function (event, player) {
                    const end = new Date().getTime()
                    return end - player.storage.start > 150000;
                },
                content: function () {
                    player.removeSkill('lianxi')
                    player.addSkill('changtiao');
                },
            },
            changtiao: {
                forced: true,
                mark: true,
                locked: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content: function (storage, player, skill) {
                        if (player.storage.changtiao == true) return '锁定技，阶段开始时，你摸一张牌，然后本阶段内你的杀且无使用次数限制';
                        return '锁定技，阶段开始时，你摸一张牌，然后本阶段内你的杀无距离限制';
                    },
                },
                trigger: { player: 'phaseZhunbeiBegin' },
                content: function () {
                    'step 0'
                    player.changeZhuanhuanji('changtiao');
                    player.draw(1);
                    'step 1'
                    if (player.storage.changtiao != true) {
                        player.addTempSkill('changtiao_2', 'phaseUseAfter');
                    }
                    else {
                        player.addTempSkill('changtiao_1', 'phaseUseAfter');
                    };

                },
                subSkill: {
                    '1': {
                        mod: {
                            cardUsable: function (card, player, num) {
                                return Infinity;
                            },
                        },
                    },
                    '2': {
                        mod: {
                            targetInRange: function (card) {
                                return true;
                            },
                        },
                    },
                },
            },
            baozha: {
                enable: 'phaseUse',
                usable: 1,
                intro: {//标记介绍
                    name2: '毒奶',
                    content: '已有#个看一眼'
                },
                content: function () {
                    "step 0"
                    player.chooseTarget(true) // 选择目标
                    "step 1"
                    if (result.bool && result.targets && result.targets.length > 0) { // 是否选择了目标
                        let r = result.targets // 选择的目标数组
                        r[0].viewHandcards(player)
                        // trigger是选择的目标
                        r[0].addMark("baozha")
                        if (r[0].countMark('baozha') == 2) {
                            r[0].damage(1, player, 'fire');
                            r[0].removeMark('baozha');
                            r[0].removeMark('baozha');
                            game.countPlayer(function (target) {
                                if (r[0] != target && get.distance(r[0], target) <= 1) {
                                    target.damage(1, r[0], 'fire');
                                }
                            });
                        }
                    }
                }
            },

            //张东升
            "pashan": {

                trigger: {
                    player: "useCardEnd"
                },
                direct: true,
                filter: function (event, player) {
                    var num = get.number(event.card) || 13;
                    return player.hasCard(function (card) {
                        return get.number(card) > num;
                    }, 'he');
                },
                content: function () {
                    "step 0"
                    var next = player.chooseCard(
                        'he',
                        function (card, player, event) {
                            return get.number(card) > _status.event.number;
                        },
                        function (card) {
                            return 13 - get.number(card) - get.value(card) / 2;
                        }
                    );
                    next.set('prompt', get.prompt2('pashan'));
                    next.set('number', get.number(trigger.card));
                    "step 1"
                    if (result.bool) {
                        player.logSkill('pashan');
                        player.loseToDiscardpile(result.cards);
                        player.draw(result.cards.length);
                        player.storage['pashan'] = get.number(result.cards[0]);
                        player.addTempSkill('pashan_shun');
                    }
                },
                subSkill: {
                    shun: {
                        onremove: true,
                        trigger: {
                            player: "useCardToBegin"
                        },
                        direct: true,
                        content: function () {
                            "step 0"
                            if (get.number(trigger.card) <= player.storage['pashan']) {
                                event.finish();
                            }
                            player.removeSkill('pashan_shun');
                            player.draw(1);
                        },
                        sub: true
                    }
                }
            },

            //庄周
            "jiekong": {
                group: ["jiekong_skip"],
                subSkill: {
                    skip: {
                        trigger: {
                            global: ["phaseDiscardSkipped", "phaseDiscardCancelled", 'phaseDrawCancelled', "phaseJudgeSkipped", "phaseDrawSkipped",
                                "phaseUseSkipped", "phaseUseCancelled", "turnOverAfter"],
                        },
                        direct: true,
                        filter: function (event, player) {
                            if (event.name == "turnOver") return !event.player.isTurnedOver();
                            return true;
                        },
                        content: function () {
                            var a = 0;
                            'step 0'
                            switch (event.triggername) {
                                case 'phaseJudgeSkipped':
                                    var str = '判定';

                                    break;
                                case 'phaseDrawCancelled':
                                case 'phaseDrawSkipped':
                                    var str = '摸牌';
                                    break;
                                case 'phaseUseCancelled':
                                case 'phaseUseSkipped':
                                    var str = '出牌';
                                    break;
                                case 'phaseDiscardCancelled':
                                case 'phaseDiscardSkipped':
                                    var str = '弃牌';

                                    break;
                                case 'turnOverAfter':
                                    var str = '回合';

                                    break;
                            }
                            var a = event.triggername.slice(-9);
                            if (a == "Cancelled")
                                a = 1;
                            if (a == 0)
                                player.chooseTarget(get.prompt('jiekong'), '令一名角色执行一个额外的' + str + (str == "回合" ? "" : '阶段'), false).set('skipped', event.triggername);
                            if (a == 1)
                                player.chooseTarget(get.prompt('jiekong'), '令一名角色执行一个额外的' + str + (str == "回合" ? "" : '阶段'), false).set('cancelled', event.triggername);
                            'step 1'
                            if (result.bool) {
                                var target = result.targets[0];
                                var skipped = trigger.name == "turnOver" ? "phase" : event.triggername.slice(0, -7);
                                var a = event.triggername.slice(-9);
                                if (a == "Cancelled")
                                    skipped = event.triggername.slice(0, -9);
                                player.logSkill('jiekong', target);
                                target[skipped]();
                                target[cancelled]();
                            }
                        },
                        sub: true,
                    },
                },
            },

            "miankong": {
                trigger: {
                    target: ["rewriteGainResult", "rewriteDiscardResult"],
                },
                direct: true,
                preHidden: true,
                filter: function (event, player) {
                    return event.player != player;
                },
                content: function () {
                    'step 0'
                    trigger.cancel()
                    'step 1'
                    if (event.triggername == 'rewriteGainResult') {
                        trigger.player.draw()
                    } else {
                        var card = get.cards()
                        trigger.player.lose(card, ui.discardPile);
                        trigger.player.$throw(card, 1000);
                        game.log(card, '进入了弃牌堆');
                    }
                },
            },

            //雅典娜
            "bugui": {
                group: ["bugui_1", "bugui_2"],
                isCanDraw: function (player) {
                    var huase = lib.suit.every(function (suit) {
                        return player.hasCard(function (card) {
                            return get.suit(card) == suit;
                        }, "h");
                    })
                    return (player.countCards('h') < 6 && !huase)
                },
                subSkill: {
                    "1": {

                        trigger: {
                            player: ["phaseZhunbeiBegin", "phaseJudgeBefore", "phaseDrawBefore", "phaseDiscardBefore", "phaseJieshuBegin"],
                        },
                        forced: true,
                        content: function () {
                            trigger.cancel();
                        },
                        sub: true,
                    },
                    "2": {
                        trigger: {
                            player: "phaseUseEnd",
                        },
                        frequent: true,
                        filter: function (event, player) {
                            return lib.skill.bugui.isCanDraw(player)
                        },
                        content: function () {
                            'step 0'
                            player.draw(1);
                            'step 1'
                            if (lib.skill.bugui.isCanDraw(player)) event.goto(0)
                        },
                        sub: true,
                    },
                },
            },

            shiye: {
                trigger: {
                    player: "dying",
                },
                content: function () {
                    "step 0"
                    player.chooseTarget(get.distance(player, target) <= 1);
                    "step 1"
                    if (result.bool) {
                        let r = result.targets // 选择的目标数组
                        r[0].addSkill('nszhaoxin')
                        player.removeSkill('shiye');
                    }
                },
            },

            wuquan: {
                trigger: {
                    player: "dying",
                },
                filter: function (event, player) {
                    return !player.isTurnedOver();
                },

                content: function () {
                    player.turnOver();
                    var a = game.countPlayer() - 1;
                    if (a > 3)
                        a = 3;
                    player.recover(a);
                    player.discard(player.getCards('h'));
                },

            },

            xushi: {
                forced: true,
                trigger: { global: "phaseBefore" },
                content: function () {
                    "step 0"
                    trigger.cancel();
                    trigger.player.phaseJieshu();
                    "step 1"
                    trigger.player.phaseDiscard();
                    "step 2"
                    trigger.player.phaseUse();
                    "step 3"
                    trigger.player.phaseDraw();
                    "step 4"
                    trigger.player.phaseJudge();
                    "step 5"
                    trigger.player.phaseZhunbei();
                    if (trigger.player != player) {
                        event.finish();
                    }
                    "step 6"
                    trigger.player.phaseZhunbei();
                    "step 7"
                    trigger.player.phaseJudge();
                    "step 8"
                    trigger.player.phaseDraw();
                    "step 9"
                    trigger.player.phaseUse();
                    "step 10"
                    trigger.player.phaseDiscard();
                    "step 11"
                    trigger.player.phaseJieshu();
                }
            },

        },
        translate: {
            wuzhaoxiang: '吴赵襄',
            weizhaoxiang: '魏赵襄',
            wufanghun: '芳魂',
            wufanghun_info: '当你使用【杀】或成为【杀】的目标后，你获得1个“梅影”标记；你可以移去1个“梅影”标记来发动〖龙胆〗并摸一张牌。',
            wufuhan: '扶汉',
            wufuhan_info: '限定技，回合开始时，你可以移去所有"梅影"标记并摸等量的牌，然后从X张吴势力武将牌中选择并获得至多两个技能（限定技、觉醒技、隐匿技、使命技、主公技除外）。若此时你是体力值最低的角色，你回复1点体力（X为场上角色数，且X∈[4,+∞)）。',
            weifuhan: '扶汉',
            weifuhan_info: '限定技，回合开始时，你可以移去所有"梅影"标记并摸等量的牌，然后从X张魏势力武将牌中选择并获得至多两个技能（限定技、觉醒技、隐匿技、使命技、主公技除外）。若此时你是体力值最低的角色，你回复1点体力（X为场上角色数，且X∈[4,+∞)）。',
            fengdi: '风笛',
            "ark_pojun": "破军",
            "ark_pojun_info": "当你使用【杀】指定一个目标后，你可以令其将手牌分为两份，然后你弃置其中的一份。",
            "ark_bitang": "闭膛",
            "ark_bitang_info": "锁定技，你使用【杀】无次数限制，然后当你在出牌阶段使用超过一张杀后，须在该【杀】结算后选择一项：①弃置一张武器牌；②失去1点体力，且本回合此技能失效。",
            huafalin: '华法琳',
            buwen2: '不稳定血浆',
            buwen2_info: '锁定技，你视为装备着藤甲',
            bangneng2: '帮能',
            bangneng2_info: '当其他角色使用杀时，你可以将一张牌置于牌堆顶，然后从牌堆底摸一张牌',
            shenji2: '神技',
            shenji2_info: '出牌阶段限一次，你可以弃置一张牌，并指定一名角色，该角色获取将红牌当杀的神技',
            helage: '赫拉格',
            xianyue: "弦月",
            xianyue_info: "锁定技，你造成伤害时回复1点体力。当你的体力不以此法回复时，防止之。",
            qiusheng: "求生",
            qiusheng_info: "全名求生剑法，锁定技，出牌阶段，你可额外使用X张【杀】（X为你已损体力值）。每回合限一次，你进入濒死状态时摸四张牌，并开始一个独立的出牌阶段。",
            tashijiangjun: "他是将军！",
            tashijiangjun_info: "",
            sp_nengtianshi: 'sp能天使',
            sp_guozai: "过载",
            sp_guozai_info: "准备阶段，你可以进行一次判定并获得判定牌，此回合内你可以将与判定牌同颜色的牌视为【杀】使用且使用杀次数加1",
            sp_zhufu: "祝福",
            sp_zhufu_info: "游戏开始时，你可以选择一名其他角色，你与其体力上限与体力值+1",
            xiaozhi: "小智",
            pika: "皮卡",
            penhuo: "喷火",
            pika_info: "限定技，出牌阶段，你可以召唤一个皮卡丘",
            penhuo_info: "限定技，出牌阶段，你可以召唤一个喷火龙",
            pikaqiu: "皮卡丘",
            penhuolong: "喷火龙",
            pika_skill: "皮卡",
            pika_skill_info: "锁定技。你的伤害均视为雷电伤害",
            penhuo_skill: "喷火",
            penhuo_skill_info: "锁定技。你的伤害均视为火焰伤害",
            xushimin: "许市民",
            mushuihan: "沐水涵",
            guaichu: "怪厨",
            guaichu_info: "你的回合内，你每受到一点伤害，你摸两张手牌",
            guaishuai: "怪帅",
            guaishuai_info: "当你成为牌目标时，若此牌目标大于1，你摸两张牌",
            guaimin: "怪民",
            guaimin_info: "当有其他角色在回合结束阶段摸牌时，你摸两张牌",
            biyue: "闭月",
            sbliegong: '烈弓',
            sbliegong_info: '①若你的装备区内没有武器牌，则你手牌区内所有【杀】的属性视为无属性。②当你使用牌时，或成为其他角色使用牌的目标后，你记录此牌的花色。③当你使用【杀】指定唯一目标后，若你〖烈弓②〗的记录不为空，则你可亮出牌堆顶的X张牌（X为你〖烈弓②〗记录过的花色数-1），令此【杀】的伤害值基数+Y（Y为亮出牌中被〖烈弓②〗记录过花色的牌的数量），且目标角色不能使用〖烈弓②〗记录过花色的牌响应此【杀】。此【杀】使用结算结束后，你清除〖烈弓②〗的记录。',
            chenshuai: '陈帅',
            feigong: '非攻',
            feigong_info: '每当你对其他角色造成伤害后，你可以阻止该伤害，并令一名非满血玩家回复对应伤害的血量（若玩家损失血量小于对应伤害，则目标玩家回复至满血）',
            jianyu: '箭雨',
            jianyu_info: '若你的上一回合没有造成伤害，则出牌阶段开始时，你可以选择发动该技能，视为你使用一张【万箭齐发】',
            huanshi: '幻始',
            huanxie: '幻屑',
            huanxie_info: '【限定技】出牌阶段，你可以摸五张牌，然后弃置其他所有角色的所有牌',
            yaowan: '药丸',
            yaowan_info: '回合结束阶段，若你没有"幻屑技能"，则你死亡',
            xukun: '蔡徐坤',
            lianxi: '练习',
            lianxi_info: '觉醒技，游戏开始时，你进行练习，游戏一分钟相当于一年；当你练习时长2年半后。回合开始阶段，你获得“唱跳”。',
            baozha: '爆炸',
            baozha_info: '出牌阶段限一次，你可以令一名角色观看你的手牌，然后获得看一眼标记。若此时标记大于1，该角色消除看一眼标记，然后该角色进行爆炸。（爆炸：你对与你距离为1的角色（包括你）造成一点火焰伤害）',
            changtiao: '唱跳',
            changtiao_info: '唱跳：转换技 唱：准备阶段，你摸一张牌，然后本回合使用牌没有距离限制。跳：准备阶段，你摸一张牌，然后本回合使用牌没有次数限制',
            dongsheng: '张东升',
            pashan: '爬山',
            pashan_info: '你使用一张牌后，可以重铸一张点数更大的牌。你本回合使用的下一张牌时，若之点数大于该次重铸掉的牌，你摸一张牌',
            zhuangzhou: '庄周',
            jiekong: '解控',
            jiekong_info: '当一名角色跳过某一阶段时，你可令一名角色执行一个额外的对应阶段；当一名角色从背面翻回正面时，你可令一名角色执行一个额外回合。',
            //            dieshang:'叠伤',
            //            dieshang_info:'当你对一名角色造成x+1次伤害后，你的杀对其造成的伤害永久加1（x为对该角色加伤害的点数）',
            miankong: '免控',
            miankong_info: '锁定技，当其他角色获得/弃置你的牌时，改为摸一张牌/将牌堆顶一张牌置于弃牌堆',
            yadianna: '雅典娜',
            bugui: "不归",
            bugui_info: "锁定技，你只有出牌阶段（其余阶段均跳过）。出牌阶段结束后，你从牌堆底摸牌至手牌中的花色数为4或手牌数为6",
            shiye: '视野',
            shiye_info: '限定技，当你进入濒死状态，你可以选择一名距离为1的角色，其获得技能昭心（锁定技，你始终展示手牌）',
            wuquan: '无泉',
            wuquan_info: '锁定技，当你进入濒死状态，若你正面朝上，则回x点体力并翻面，然后弃置所有手牌(x为场上存活的角色且最多为3)',
            mositima: '莫斯提马',
            xushi: '序匙',
            xushi_info: '锁定技，当你存活时，全场的回合是逆序的。你的逆序回合结束后，获得一个额外的正序回合'
        },
    };
});
