// ==UserScript==
// @author		RePod
// @name		PSDLE for Greasemonkey
// @description	Improving everyone's favorite online download list, one loop at a time. This will be updated infrequently, mostly for stability.
// @namespace	https://github.com/RePod/psdle
// @homepage	https://repod.github.io/psdle/
// @version		1.034
// @require		https://code.jquery.com/jquery-1.11.1.min.js
// @include		https://store.sonyentertainmentnetwork.com/*
// @updateURL	https://repod.github.io/psdle/psdle.user.js
// @downloadURL	https://repod.github.io/psdle/psdle.user.js
// @icon		https://repod.github.io/psdle/logo/6_psdle_64px.png
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2014 RePod

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//The license information above is also available in PSDLE's GitHub repository located here: https://github.com/RePod/psdle
//TO-DO:
// - All the things!

var repod = {};
repod.psdle = {
	gamelist: [], gamelist_cur: [],
	entitlement_cache: {}, sku_id_cache: {}, api_cache: [],
	lang: {},
	lang_cache: {
		"en": {
			"def": "us",
			"us": {"local":"English","startup":"Waiting on page to load.","columns":{"icon":"Icon","name":"Name","platform":"Platform","size":"Size","date":"Date"},"labels":{"export_view":"Export View","games":"Games","avatar":"Avatars","demo":"Demos","unlock":"Unlocks","pass":"Passes","pack":"Packs","theme":"Themes","addon":"Add-ons","app":"Applications","unknown":"Unknown","page":"Page"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"Error: Browser does not have JSON.stringify.","yes":"Yes","no":"No","use_api":"Use API for in-depth scanning? (Beta, buggy)","use_entitled_api":"Use Entitlements API? (For PS+/bundles/etc, contains purchase information)","regex_search":"Search by game title (/regex/id)"}}
		},
		"es": {
			"def": "mx",
			"mx": {"local":"Español","startup":"Esperando en la página se cargue.","columns":{"icon":"Icono","name":"Nombre","platform":"Plataforma","size":"Tamaño","date":"Fecha"},"labels":{"export_view":"Exportar vista","games":"juegos","avatar":"avatares","demo":"población","unlock":"descubrir","pass":"adelantar","pack":"paquete","theme":"Temas","addon":"Complementos","app":"Aplicaciones","unknown":"Desconocido","page":"paje"},"strings":{"delimiter":"Ingrese delimitador:","stringify_error":"Error: Navegador no tiene JSON.stringify.","yes":"Sí","no":"No","use_api":"Utilice la API para la exploración en profundidad? (Beta, con errores)","regex_search":"Búsqueda por título del juego (/regex/id)"}} // Caaz, somebody.
		},
		"de": {
			"def": "de",
			"de": {"local":"Deutsch","startup":"Seite wird geladen, bitte warten.","columns":{"icon":"Symbol","name":"Name","platform":"Plattform","size":"Größe","date":"Datum"},"labels":{"export_view":"Exportiere Ansicht","games":"Spiele","avatar":"Spielerbilder","demo":"Demos","unlock":"Freischaltbares","pass":"Pässe","pack":"Bündel","theme":"Themen","addon":"Erweiterungen","app":"Anwendungen","unknown": "Unbekannt","page":"Seite"},"strings":{"delimiter":"Geben sie ein Trennzeichen ein","stringify_error":"Fehler: Browser fehlt \"JSON.stringify\".","yes":"Ja","no":"Nein","use_api": "Möchten Sie mit Hilfe der API einen Tiefenscan ausführen? (Beta Version, möglicherweise treten Fehler auf)","regex_search": "Spiele titel eingeben für direkte suche (/regex/id)"}} // Provided by /u/_MrBubbles
		},
		"ru": {
			"def": "ru",
			"ru": {"local":"Русский","startup":"Ожиданиезагрузкистраниц...","columns":{"icon":"Иконка","name":"Название","platform":"Платформа","size":"Размер","date":"Дата"},"labels":{"export_view":"ExportView","games":"Игры","avatar":"Аватары","demo":"Демо-версии","unlock":"Разблокировки","pass":"Сезонныепропуски","pack":"Набор","theme":"Темы","addon":"Дополенния","app":"Приложения","unknown":"Неизвестно","page":"Страница"},"strings":{"delimiter":"Введитеразделитель: ","stringify_error":"Ошибка: вбраузереотсутствуетJSON.stringify.","yes":"Да","no":"Нет","use_api":"ИспользоватьAPIдляглубокогосканирования?(бета,работаетнестабильно)","regex_search":"Поискпоназваниюигры(/regex/id)"}} //Provided by MorbertDou (issue #2)
		},
		"ps": {
			"def": "pi",
			"pi": {"local":"Pirate","startup":"Ye be waitin on da page.","columns":{"icon":"Doubloon","name":"Title","platform":"Ship","size":"Boat","date":"Date"},"labels":{"export_view":"Compass","games":"Booty","avatar":"Shipmates","demo":"Plans","unlock":"Keys","pass":"Sails","pack":"Treasure Hoard","theme":"Paint","addon":"Cannons","app":"Galley","unknown":"Davey Jones' Locker","page":"Map"},"strings":{"delimiter":"Enter delimiter:","stringify_error":"The sea don't have a JSON.stringify.","yes":"Yargh","no":"Nay","use_api":"Use da API fer deep digging? (Beta, buggy)","regex_search":"Set a course for booty (/regex/id)"}}, //Arcon
			"dz": {"local":"Dovahzul","startup":"Saraan fah deykel wah genun.","columns":{"icon":"Andiir","name":"For","platform":"Palaar","size":"Raaz","date":"Zahtiid"},"labels":{"export_view":"Sav Fahzon","games":"Kred","avatar":"Rahnunahst","demo":"Gor","unlock":"Bex","pass":"Rahn","pack":"Edrah","theme":"Niin","addon":"Malur","app":"Mii","unknown":"Vomindok","page":"Deykel"},"strings":{"delimiter":"Haav krenok:","stringify_error":"Tozein Hi dreh ni lost JSON.stringify","yes":"Geh","no":"Nid","use_api":"Nuft API fah ko rud tovit?  (Gor, lost diron)","regex_search":"Tovit naal kred tet (/qurnen/id)"}}, // Caaz
			"ha": {"local":"H4k3r","startup":"G4th3ring rez0urc3s.","columns":{"icon":"1con","name":"H4ndle","platform":"P|a+f0rm","size":"S1z3","date":"D4te"},"labels":{"export_view":"D0x","games":"W4rez","avatar":"4va+ar","demo":"Freeware","unlock":"H4x","pass":"Pa55e5","pack":"Pax","theme":"R1cez","addon":"Add-0ns","app":"S0f+w4r3","unknown":"?","page":"P4g3"},"strings":{"delimiter":"5pli+ by:","stringify_error":"3rr0r: No JSON.stringify.","yes":"Y","no":"N","use_api":"D33p sc4n with API? (Beta, buggy)","regex_search":"grep (/regex/id)"}} //Caaz
		}
	},
	determineLanguage: function(e,f) {
		e = (e) ? e.split("-") : this.config.language.split("-");
		if (f === true) { this.lang = {}; this.lang = this.lang_cache.en.us; }
		if (e[0] in this.lang_cache) {
			if (e[1] in this.lang_cache[e[0]]) {
				if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][e[1]]); }
				e = e[0]+"-"+e[1];
			} else {
				if (f === true) { $.extend(true,this.lang,this.lang_cache[e[0]][this.lang_cache[e[0]].def]); }
				e = e[0]+"-"+this.lang_cache[e[0]].def;
			}
		} else {
			e = "en-us";
		}
		return e;
	},
	generateLangBox: function(e) {
		var temp = "<select id='lang_select'>";
		e = (e) ? this.determineLanguage(e) : this.determineLanguage();
		for (var i in this.lang_cache) {
			for (var h in this.lang_cache[i]) {
				if (!!this.lang_cache[i][h].local) {
					var a = (e == i+"-"+h) ? "selected='selected'" : "";
					temp += "<option "+a+" value='"+i+"-"+h+"'>"+this.lang_cache[i][h].local+" ["+i+"-"+h+"]</option>";
				}
			}
		}
		temp += "</select>";
		return temp;
	},
	init: function() {
		var that = this;
		this.config = {
			game_page: "",
			game_api: "",
			entitled_api: "https://store.sonyentertainmentnetwork.com/kamaji/api/chihiro/00_09_000/gateway/store/v1/users/me/internal_entitlements?start=",
			totalgames: 1,
			delay: 1000,
			lastsort: "",
			lastsort_r: false,
			language: window.location.href.match(/\/([a-z]{2}\-(?:[a-z]{4}-)?[a-z]{2})\//i)[1],
			deep_search: false,
			deep_waiting: 0,
			deep_current: 0,
			api_url: "",
			last_search: "",
			check_entitlements: false,
			entitlements_count: 0,
			entitlements_total: 1,
			entitlements_plus: 0,
		}; 
		this.determineLanguage(this.config.language,true);
		this.injectCSS();
		$(document).on('change', "#sub_container > select#lang_select", function() { that.config.language = $(this).val(); that.determineLanguage($(this).val(),true); that.genDisplay(); });
		this.genDisplay();
		this.exportTable.parent = this;
		return 1;
	},
	parsePage: function() {
		var that = this;
		if (this.gamelist.length >= this.config.totalgames) {
			clearInterval(this.config.timerID);
			this.checkEntitlements();
		} else if (Number($(".range").text().split("-")[0]) > this.gamelist.length) {
			$("#psdle_status").text((this.gamelist.length/24+1)+" / "+Math.ceil(this.config.totalgames/24));
			$("li.cellDlItemGame").each(function() {
				var id = (that.gamelist.length +1);
				var t = $(this).clone();
				var icon = t.find(".thumbPane").find("img").attr("src");
				var url = t.find(".thumbPane").parent().attr("href");
				if (that.config.game_page == "") { that.config.game_page = url.match(/(.+?=).+/).pop(); }
				t = t.find(".mediaInfo");
				var gametitle = t.find(".gameTitle").text();
				var size = t.find(".size").text().replace("|","");
				var platform = []; t.find(".playableOn > a").each(function() { platform.push($(this).text()); });
				var date = t.find(".purchaseDate").text().replace("|","");
				var gid = url.split("=").pop();
				if (!that.entitlement_cache[gid]) { that.entitlement_cache[gid] = []; }
				that.entitlement_cache[gid].push({"glid":(id -1),"gid":""});
				that.gamelist.push({id:id,pid:gid,title:gametitle,size:size,platform:platform,date:date,icon:icon,deep_type:"unknown"});
				if (that.config.deep_search) {
					if (!!icon && !!icon.match(/(.+?)\/image\?.*$/)) {
						that.config.deep_waiting++;
						if (that.config.game_api == "") {
							that.config.game_api = icon.match(/^((?:.+?)\/)[^\/]+\/[^\/]+$/).pop();
							$.each(that.api_cache,function(a,b) { $.getJSON(that.config.game_api+b.gid,function(data) { that.parseDeep(b.id,data); }); });
						}
						$.getJSON(icon.match(/(.+?)\/image\?.*$/).pop(),function(data) { that.parseDeep(id,data); });
					} else {
						if (that.config.game_api !== "") {
							$.getJSON(that.config.game_api+gid,function(data) { that.parseDeep(id,data); });
						} else {
							that.api_cache.push({id:id,gid:gid});
						}
					}
				}
			});
			$("#psdle_progressbar > #psdle_bar").animate({"width":Math.round((this.gamelist.length/24) / Math.ceil(this.config.totalgames/24) * 100)+"%"});
			if (this.gamelist.length >= this.config.totalgames) {
				//if (this.config.deep_waiting <= 1) {
					clearInterval(this.config.timerID);
					this.checkEntitlements();
				//}
			} else {
				this.nextPage();
			}
		}
	},
	startTimer: function(delay) {
		var that = this;
		delay = (delay) ? delay : this.config.delay;
		this.config.timerID = setInterval(function(){that.parsePage();},delay);
		return 1;
	},
	nextPage: function() {
		//.trigger("click") wasn't working in Chrome, here's a native solution.
		$('.navLinkNext').eq(0)[0].dispatchEvent(new MouseEvent("click",{canBubble:true,cancelable:true}));
	},
	genDisplay:function(mode) {
		var that = this, yn = "<span class='psdle_fancy_bar'><span id='yes' class='psdle_btn'>"+that.lang.strings.yes+"</span> <span id='no' class='psdle_btn'>"+that.lang.strings.no+"</span></span>";
		if (!$("#muh_games_container").length) { $("body").append("<div id='muh_games_container' />"); }
		$(document).off("click",".psdle_btn");
		$("#muh_games_container").slideUp('slow', function() {
			var a = "<div id='sub_container'><a href='//repod.github.io/psdle/' target='_blank'><img src='//repod.github.io/psdle/logo/3_psdle_mini.png' style='display:inline-block;font-size:200%;font-weight:bold' alt='psdle' /></a></span>";
			if (!mode) {
				a += "<br />"+that.lang.strings.use_api+"<br />"+yn+"<br />"+that.generateLangBox()+"</div>";
				$(document).one('click',".psdle_btn",function () { that.config.deep_search = ($(this).attr("id") == "yes") ? true : false; that.genDisplay("entitled_api"); });
			} else if (mode == "entitled_api") {
				a += "<br />"+that.lang.strings.use_entitled_api+"<br />"+yn+"</div>";
				$(document).one('click',".psdle_btn",function () { that.config.check_entitlements = ($(this).attr("id") == "yes") ? true : false; that.genDisplay("progress"); });
			} else if (mode == "progress") {
				$("#sub_container > select").off("change"); $(".psdle_btn").off("click");
				a += "<br /><div id='psdle_progressbar'><div id='psdle_bar'>&nbsp;</div></div><br /><span id='psdle_status'>"+that.lang.startup+"</span>";
				var t = 0;
				$("li.cellDlItemGame:even").each(function() {
					$("html, body").animate({scrollTop: $(this).offset().top}, 200).promise().done(function() {
						t++;
						if (t == $("li.cellDlItemGame:even").length) {	
							$('html, body').animate({scrollTop: 0}, 0);
							that.config.totalgames = Number($(".statsText").text().match(/(\d+)/g).pop());
							that.startTimer();
						}
					});
				});
			}
			$("#muh_games_container").html(a).slideDown('slow');
		});
		return 1;
	},
	checkEntitlements: function() {
		$("#psdle_status").text(this.lang.startup);
		if (this.config.check_entitlements) {
			if (this.config.entitlements_count < this.config.entitlements_total) {
				var that = this;
				$.getJSON(this.config.entitled_api+this.config.entitlements_count+"&size=100&fields=game_meta%2Cdrm_def",function(e) { that.parseEntitlements(e); });
			} else {
				if (this.config.deep_search) {
					this.checkSkus();
				} else {
					this.genTable();
				}
			}
		} else {
			this.genTable();
		}
	},
	checkSkus: function() {
		var that = this;
		$.each(that.sku_id_cache,function(a,b) {
			$.each(b, function(c,d) {
				if (that.entitlement_cache[a] && that.entitlement_cache[a][c]) {
					//$.extend(true,that.gamelist[that.entitlement_cache[a][c].glid],b[c]);
					var id = that.entitlement_cache[a][c].glid;
					if (b[c].pid && b[c].pid.length > 0) { that.gamelist[id].pid = b[c].pid; }
					that.gamelist[id].plus = b[c].plus;
					if (that.gamelist[id].icon && that.gamelist[id].icon.indexOf("pc/img/furniture") > -1 && b[c].icon && b[c].icon.length > 0) { that.gamelist[id].icon = b[c].icon; }
				}
			});
		});
		this.genTable();
	},
	genTable: function() {
		clearInterval(this.config.timerID); //Just in case.
		$("#muh_games_container").css({"position":"absolute"});
		$("#sub_container").html(this.genSearchOptions()).append("<span id='table_stats'></span><br /><table id='muh_table' style='display:inline-block;text-align:left'><thead><tr><th>"+this.lang.columns.icon+"</th><th id='sort_name'>"+this.lang.columns.name+"</th><th title='Approximate, check store page for all supported platforms.'>"+this.lang.columns.platform+"</th><th id='sort_size'>"+this.lang.columns.size+"</th><th id='sort_date'>"+this.lang.columns.date+"</th></tr></thead><tbody>"+this.genTableContents()+"</tbody></table>");
		this.sortGamelist("#sort_date");
		return 1;
	},
	regenTable: function() {
		$("#muh_table > tbody").html(this.genTableContents());
		return 1;
	},
	genTableContents: function() {
		this.exportTable.destroy();
		this.gamelist_cur = [];
		var that = this, temp = "", safesys = this.safeSystemCheck(), plus = 0;
		var search = (!!$("#psdle_search_text")) ? $("#psdle_search_text").val() : this.config.last_search;
		$("#psdle_search_text").removeClass("negate_regex");
		$.each(this.gamelist,function(index,val) {
			var sys = that.safeGuessSystem(val.platform);
			if ($.inArray(sys,safesys) > -1) { 
				var a = true, t = val.title;
				if (that.config.deep_search) {
					if ($("span[id=filter_"+val.deep_type+"]").hasClass("toggled_off")) { a = false; }
				}				
				if (a == true && search !== "") {
					var regex = search.match(/^\/(.+?)\/([imgd]+)?$/i);
					a = (!!regex && !!regex[2] && regex[2].toLowerCase().indexOf("d") >= 0) ? true : false;
					if (a) { $("#psdle_search_text").addClass("negate_regex"); regex[2] = regex[2].replace("d",""); }
					if (!!regex) { if (RegExp((regex[1])?regex[1]:search,(regex[2])?regex[2]:"").test(t)) { a = !a; } }
					else if (t.toLowerCase().indexOf(search.toLowerCase()) >= 0) { a = !a; }
				}
				if (a == true) {
					var u = that.config.game_page+val.pid, is_plus = "";
					if (val.plus === true && that.config.check_entitlements) { is_plus = "is_plus"; plus++; }
					temp += "<tr class='"+is_plus+"'><td style='max-width:31px;max-height:31px;'><a target='_blank' href='"+u+"'><img title='"+that.lang.labels.page+" #"+Math.ceil(val.id/24)+"' src='"+val.icon+"' class='psdle_game_icon' /></a></td><td><a class='psdle_game_link' target='_blank' href='"+u+"'>"+t+"</a></td><td>"+sys+"</td><td>"+val.size+"</td><td>"+val.date+"</td></tr>";
					that.gamelist_cur.push(val);
				}
			}
		});
		that.config.last_search = search;
		$("#table_stats").html(this.gamelist_cur.length+((this.config.check_entitlements)?" (<div id='psdleplus' style='display:inline-block' /> "+plus+")":"")+" / "+this.gamelist.length);
		if (this.config.check_entitlements) { $("#psdleplus").css($(".psPlusIcon").css(["background-image","height","width","background-repeat","background-position"])); }
		return temp;
	},
	genSearchOptions: function() {
		//TO-DO: Not this. Make scalable.
		var that = this;
		
		//Delegated handlers.
		$(document).keypress(function(e) { if (e.which == 13 && $("#psdle_search_text").is(":focus")) { that.regenTable(); } });
		$(document).on("click","span[id^=system_], span[id^=filter_]", function() { $(this).toggleClass("toggled_off"); that.regenTable(); });
		$(document).on("click","th[id^=sort_]", function() { that.sortGamelist($(this)); });
		$(document).on("click","span[id=export_view]", function() { that.exportTable.display(); });
		$(document).on("blur", "#psdle_search_text", function() { that.regenTable(); });
		
		//Search options.
		var temp = '<span id="search_options" style="text-align:center;">' +
					'<span><span class="psdle_fancy_but" id="export_view">'+this.lang.labels.export_view+'</span></span> ' +
					'<span class="psdle_fancy_bar">';
		if (this.config.deep_search) { temp += '<span id="system_ps1">PS1</span><span id="system_ps2">PS2</span>'; }
		temp +=		'<span id="system_ps3">PS3</span>' +
					'<span id="system_ps4">PS4</span>' +
					'<span id="system_psp">PSP</span>' +
					'<span id="system_psv">PS Vita</span></span>';
		if (1 == 2 /* Queue enabled? */) { temp += ' <span><span class="psdle_fancy_but toggled_off" id="dl_queue">Queue</span></span>'; }
		if (this.config.deep_search) {					
		temp +=		'<br /><span class="psdle_fancy_bar">' +
					'<span id="filter_downloadable_game">'+this.lang.labels.games+'</span>' +
					'<span id="filter_avatar">'+this.lang.labels.avatar+'</span>' +
					'<span id="filter_demo">'+this.lang.labels.demo+'</span>'+
					'<span id="filter_add_on">'+this.lang.labels.addon+'</span>' +
					'<span id="filter_application">'+this.lang.labels.app+'</span>' +
					'<span id="filter_theme">'+this.lang.labels.theme+'</span>' +
					'<span id="filter_unknown">'+this.lang.labels.unknown+'</span></span><br />';
		}
		temp += "<input type='text' id='psdle_search_text' placeholder='"+this.lang.strings.regex_search+"' />";			
		temp += '</span><br />';
		return temp;
	},
	sortGamelist: function(e) {
		var that = this;
		e = $(e).attr("id");
		if (e == "sort_date") {
			this.gamelist.sort(function (a, b) {
				if (a.id > b.id) { return 1; }
				if (a.id < b.id) { return -1; }
				return 0;
			});
		}
		if (e == "sort_name") {
			this.gamelist.sort(function (a, b) {
				if (a.title.toLocaleLowerCase() > b.title.toLocaleLowerCase()) { return 1; }
				if (a.title.toLocaleLowerCase() < b.title.toLocaleLowerCase()) { return -1; }
				return 0;
			});	
		}
		if (e == "sort_size") {
			this.gamelist.sort(function (a, b) {
				if (that.returnKB(a.size) > that.returnKB(b.size)) { return 1; }
				if (that.returnKB(a.size) < that.returnKB(b.size)) { return -1; }
				return 0;
			});
		}
		if (e == this.config.lastsort) {
			if (!this.config.lastsort_r) {
				this.gamelist.reverse();
			}
			this.config.lastsort_r = !this.config.lastsort_r;
		} else {
			this.config.lastsort_r = false;
		}
		$("#psdle_sort_display").remove();
		$("#"+e).append("<span id='psdle_sort_display' class='psdle_sort_"+((this.config.lastsort_r)?"asc":"desc")+"' />");
		this.config.lastsort = e;
		this.regenTable();
		return 1;
	},
	safeSystemCheck: function() {
		var temp = [];
		$("span[id^=system_]:not('.toggled_off')").each(function() { temp.push($(this).text()); });
		return temp;
	},
	safeGuessSystem: function(e) {
		//Quick, dirty, and easy.
		var sys = e.join(" ").replace("™","");
		if (sys == "PS3 PSP PS Vita" || sys == "PS3 PSP") { sys = "PSP"; }
		if (sys == "PS3 PS Vita") { sys = "PS Vita"; }
		return sys;
	},
	injectCSS: function() {
		var temp = "#muh_games_container { display:none;position:fixed;top:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center } #sub_container { background-color:#fff; padding:20px; } #psdle_progressbar { overflow:hidden;display:inline-block;width:400px;height:16px;border:1px solid #999;margin:10px;border-radius:10px; } #psdle_bar { background-color:#2185f4;width:0%;height:100%;border-radius:10px; } .psdle_btn { cursor:pointer;border-radius:13px;background-color:#2185f4;color:#fff;padding:1px 15px;display:inline-block;margin:5px auto; }" + //Startup
					"th[id^=sort] { cursor:pointer; } table,th,td{border:1px solid #999;border-collapse:collapse;} th {padding:5px;} td a.psdle_game_link {display:block;width:100%;height:100%;color:#000 !important;padding:3px;} th, tr:hover{background-color:#ccc;} .is_plus{background-color:#FFFC0D;}" + //Table
					"#psdle_search_text { margin:5px auto;padding:5px 10px;font-size:large;max-width:600px;width:100%;border-style:solid;border-radius:90px; } .negate_regex { background-color:#FF8080;color:#fff; } span[id^=system_], span[id^=filter_], span#export_view, span#dl_queue { font-weight:bold; text-transform:uppercase; font-size:small; color:#fff; background-color:#2185f4; display:inline-block; margin-right:2px; margin-bottom:5px; padding:1px 15px; cursor:pointer; } .psdle_fancy_but { border-radius:12px; } .psdle_fancy_bar > span:first-child { border-radius:12px 0px 0px 12px; } .psdle_fancy_bar > span:last-child { border-radius:0px 12px 12px 0px; } .toggled_off { opacity:0.4; }" + //Search buttons
					".psdle_game_icon { max-width:100%;vertical-align:middle }" + //Content icons
					".psdle_sort_asc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-bottom: 5px solid black; } .psdle_sort_desc { float:right; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid black; }"; //Sorting
		$("head").append("<style type='text/css'>"+temp+"</style>");
		return 1;
	},
	returnKB: function(e) {
		e = e.match(/([\d+\.]+)([a-z]+)/i);
		var f = e[1];
		if (e[2] == "GB") { f *= 1000000; }
		if (e[2] == "MB") { f *= 1000; }
		if (e[2] == "KB") { f *= 1; }
		return f;
	},
	exportTable: {
		display: function() {
			this.destroy();
			var w = 600;
			$("#search_options").append("<span id='sotextarea' style='display:none'><br /><textarea></textarea></span>");
			$("#sotextarea > textarea").css({"width":w,"max-width":w}).text(this.delimited(prompt(this.parent.lang.strings.delimiter,"	"))).select().parent().delay(500).slideDown();
		},
		destroy: function() { $("#sotextarea").remove(); },
		json: function() { return (!!JSON.stringify) ? JSON.stringify(this.parent.gamelist_cur) : this.parent.lang.strings.stringify_error; },
		delimited: function(e) {
			var that = this, sep = (e) ? e : "	";
			var t = this.parent.lang.columns.name+sep+this.parent.lang.columns.platform+sep+this.parent.lang.columns.size+sep+this.parent.lang.columns.date+"\n";
			$.each(this.parent.gamelist_cur, function(a,b) {
			  t += b.title+sep+that.parent.safeGuessSystem(b.platform)+sep+b.size+sep+b.date+"\n";
			});
			return t;
		}
	},
	parseDeep: function(id,data,sku) {
		id--;
		if (!!this.gamelist[id]) {
			if (sku) {
				if (!data.codeName) {
					if (data.images) { this.gamelist[id].icon = data.images[3].url; }
					if (data.id) { this.gamelist[id].url = this.gamelist[id].url.replace(/cid=.+?$/,"cid="+data.id); }
				}
				this.config.deep_current++;
				if (this.config.deep_current == this.config.deep_waiting) {
					this.genTable();
				}
			} else {
				var sys;
				if (data.default_sku.entitlements.length == 1) {
					if (!!data.metadata.game_subtype) {
						if (!!data.metadata.game_subtype.values[0].match(/(PS(?:1|2)) Classic/)) { sys = data.metadata.game_subtype.values[0].match(/(PS(?:1|2)) Classic/).pop(); }
						else if (!!data.metadata.primary_classification.values[0].match(/(PS(?:1|2))_Classic/i)) { sys = data.metadata.secondary_classification.values[0].match(/(PS(?:1|2))_Classic/i).pop(); }
						else if (!!data.metadata.secondary_classification.values[0].match(/(PS(?:1|2))_Classic/i)) { sys = data.metadata.secondary_classification.values[0].match(/(PS(?:1|2))_Classic/i).pop(); }
					} else if (!!data.metadata.playable_platform) { sys = data.metadata.playable_platform.values; } 
				}
				//metadata.game_subtype.values[0] -- PS1/PS2 Classic/Demo/Character/Bundle
				//top_category -- downloadable_game, avatar, demo, etc.
				if (!!sys) { this.gamelist[id].platform = [sys]; }
				this.gamelist[id].deep_type = data.top_category;
			}
		}		
	},
	parseEntitlements: function(data) {
		var that = this;
		this.config.entitlements_total = data.total_results;
		$.each(data.entitlements,function(index,value) {
			var plus = false, id, eimg;
			if (value.drm_def) {
				if (!that.sku_id_cache[value.sku_id]) { that.sku_id_cache[value.sku_id] = []; }
				id = value.license.entitlement_id;
				eimg = (value.drm_def && value.drm_def.image_url) ? value.drm_def.image_url+"&w=124&h=124" : "";
				
				/*if (that.entitlement_cache[id] && img !== "") {
					$.each(that.entitlement_cache[id], function(a,b) {
						if (that.gamelist[b.glid].icon.indexOf("pc/img/furniture") >= 0) {
							that.gamelist[b.glid].icon = img;
						}
					});
				}*/
				
				//that.gamelist[a.glid].icon = img;
				
				
				//Some index don't have drm_def, if we don't check we'll crash.
				//PS4 games don't have this at all, check feature_type.
				if (value.drm_def.rewards) {
					//Likewise?
					if (value.drm_def.rewards[0].rewardType == 2 || value.drm_def.rewards[0].rewardType == 3) {
						if (value.license && value.license.infinite_duration !== true) {
							plus = true;
							that.config.entitlements_plus++;
						}
					}
				}
			} else if (value.feature_type == 3) {
				id = "", eimg = "", plus = true;
				that.config.entitlements_plus++;
			}
			
			if (id !== undefined && eimg !== undefined) {
				if (!that.sku_id_cache[value.product_id]) { that.sku_id_cache[value.product_id] = []; }
				that.sku_id_cache[value.product_id].push({"pid":id,"icon":eimg,"plus":plus});
			}
		});
		this.config.entitlements_count += data.entitlements.length;
		$("#psdle_progressbar > #psdle_bar").animate({"width":Math.round((this.config.entitlements_count / this.config.entitlements_total) * 100)+"%"});
		$("#psdle_status").text(this.config.entitlements_count+" / "+this.config.entitlements_total);
		this.checkEntitlements();
	},
	dlQueue: {
		//Easter egg. Soon(tm).
		batch: {
			cache: {},
			get: function() {
			
			},
			add: function(id,sys) {
				
			}
		},
		generate: {
			display: function() {
				//Generate table from batch.
			}
		}
	}
};

var a = setInterval(function(a){ if ($("li.cellDlItemGame").length) { clearInterval(repod.psdle.config.timerID); repod.psdle.init(); } },1000);
repod.psdle.config = {"timerID":a};