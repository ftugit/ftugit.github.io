(function() {
  'use strict';

  var Defined = {
    api: 'lampac',
    localhost: 'http://showypro.ru/',
    apn: ''
  };

  var unic_id = 'tyusdt';
  if (!unic_id) {
    unic_id = Lampa.Utils.uid(8).toLowerCase();
    Lampa.Storage.set('lampac_unic_id', unic_id);
  }

  if (!window.rch) {
    Lampa.Utils.putScript(["http://showypro.ru/invc-rch.js"], function() {}, false, function() {
      if (!window.rch.startTypeInvoke)
        window.rch.typeInvoke('http://showypro.ru', function() {});
    }, true);
  }

  function BlazorNet() {
    this.net = new Lampa.Reguest();
    this.timeout = function(time) {
      this.net.timeout(time);
    };
    this.req = function(type, url, secuses, error, post) {
      var params = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      var path = url.split(Defined.localhost).pop().split('?');
      if (path[0].indexOf('http') >= 0) return this.net[type](url, secuses, error, post, params);
      DotNet.invokeMethodAsync("JinEnergy", path[0], path[1]).then(function(result) {
        if (params.dataType == 'text') secuses(result);
        else secuses(Lampa.Arrays.decodeJson(result, {}));
      })["catch"](function(e) {
        //console.log('Blazor', 'error:', e);
        error(e);
      });
    };
    this.silent = function(url, secuses, error, post) {
      var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      this.req('silent', url, secuses, error, post, params);
    };
    this["native"] = function(url, secuses, error, post) {
      var params = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      this.req('native', url, secuses, error, post, params);
    };
    this.clear = function() {
      this.net.clear();
    };
  }

  function account(url) {
    url = url + '';
    if (url.indexOf('account_email=') == -1) {
      var email = 'ftugit@gmail.com';
      if (email) url = Lampa.Utils.addUrlComponent(url, 'account_email=' + encodeURIComponent(email));
    }
    if (url.indexOf('uid=') == -1) {
      var uid = 'tyusdt';
      if (uid) url = Lampa.Utils.addUrlComponent(url, 'uid=' + encodeURIComponent(uid));
    }
    if (url.indexOf('token=') == -1) {
      var token = '';
      if (token != '') url = Lampa.Utils.addUrlComponent(url, 'token=');
    }
    url = Lampa.Utils.addUrlComponent(url, 'showy_token=' + '6ca3ddc9-178e-48a8-84b2-195cea8c7c79');
    return url;
  }
  var isCodeObtained = true;
  var checkInterval = 3000;
  var maxCodeAttempts = 100;
  var codeAttempts = 0;
function showSubscribeReserveModal() {
        if (isCodeObtained) return;

        var modalHtml = '<div>' +
                        '<img id="qrCodeImage" src="http://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://t.me/Shores1bot"/>' +
                        '<p>Вы не подписаны на резервного бота. Отсканируйте код и запустите телеграм-бота @Shores1bot или по ссылке t.me/Shores1bot, это нужно в случае бана основного бота</p>' +
                        '</div>';

        if ($('.modal').length) {
            $('.modal').remove();
        }

        Lampa.Modal.open({
            title: '',
            align: 'center',
            zIndex: 300,
            html: $(modalHtml),
            buttons: [
                {
                    name: 'Обновить',
                    onSelect: function() {
                        window.location.reload();
                    }
                }
            ],
            onBack: function() {
                Lampa.Activity.push({component: 'main'});
                window.location.reload();
            }
        });
    }
  var intervalId = setInterval(function() {

    var urlParams = window.location.search;
    var cardExists = (urlParams.indexOf('card=') !== -1);
    if (cardExists) {
        var element = document.querySelector('.online-empty__time');
        var modalExists = document.querySelector('.modal__content');
        var playerVideoExists = document.querySelector('.player-video');

        if (!playerVideoExists && element && !modalExists) {
            if (element.innerText === 'Не авторизован') {
                isCodeObtained = false;
                showModal();
            } else if (element.innerText === 'Продлите PRO-подписку') {
                isCodeObtained = false;
                showSubscribePROModal();
            } else if (element.innerText === 'Резервный бот не активен') {
                isCodeObtained = false;
                showSubscribeReserveModal();
            }
        }
    }
  }, checkInterval);

      function updateModalContent(randomCode) {
          document.getElementById("randomCodeDisplay").innerText = randomCode;
          document.getElementById("qrCodeImage").src = "http://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://t.me/showybot?start=" + randomCode;
      }

      function checkCode() {
          if (isCodeObtained) return;

          if (!document.querySelector('.modal')){
              return;
          }
          var randomCode = document.getElementById('randomCodeDisplay').innerText;

          $.ajax({
              url: 'http://89.110.72.185:8001/check_pro_code/',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ code: randomCode }),
              success: function(response) {
                if (response.status === 'success') {
                  Lampa.Storage.set('showy_token', response.token);
                  window.location.reload();
                }
              },
              error: function(xhr) {
                  if (xhr.status === 400) {
                      showModal();
                  } else if (xhr.status === 403) {
                      showSubscribePROModal();
                  }
              }
          });
      }


      function deleteDeviceToken() {
          $.ajax({
              url: 'http://89.110.72.185:8001/delete_token/',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({
                  token: '6ca3ddc9-178e-48a8-84b2-195cea8c7c79'
              }),
              success: function(response) {
                  console.log('Token deleted successfully');
              },
              error: function(xhr) {
                  console.error('Error deleting token:', xhr);
              }
          });
          Lampa.Storage.set('showy_token', '');
          window.location.href = '/';
  }

    function showModal() {
        function getRandomCode() {
            if (codeAttempts >= maxCodeAttempts) {
                $('.modal').remove();
                Lampa.Controller.toggle('content');
                return;
            }

            codeAttempts++;

            return $.ajax({
                url: 'http://89.110.72.185:8001/get_code/',
                method: 'POST',
                dataType: 'json',
                success: function(data) {
                    var randomCode = data.code;
                    Lampa.Storage.set('random_code', randomCode);
                    updateModalContent(randomCode);
                },
                error: function(jqXHR) {
                    setTimeout(getRandomCode, 1000);
                }
            });
        }

        getRandomCode();

        var modalHtml = '<div>' +
                            '<img id="qrCodeImage"/>' +
                            '<p>Для просмотра через онлайн плагин Showy требуется авторизация, пожалуйста отсканируйте QR или введите код в телеграм-боте @showybot или по ссылке t.me/showybot</p>' +
                            '<p><strong id="randomCodeDisplay"></strong></p>' +
                            '<p id="notification" style="display: none; background-color: #4caf50; color: white; padding: 10px; border-radius: 5px; margin-top: 10px;"></p>' +
                        '</div>';

        if ($('.modal').length) {
            $('.modal').remove();
        }

        Lampa.Modal.open({
            title: '',
            align: 'center',
            zIndex: 300,
            html: $(modalHtml),
            onBack: function() {
                Lampa.Activity.push({component: 'main'});
                window.location.reload();
            }
        });

        checkCodeInterval();
    }

    function checkCodeInterval() {
        if (codeAttempts >= maxCodeAttempts) {
            Lampa.Activity.push({component: 'main'});
            window.location.reload();
            return;
        }

        checkCode();

        codeAttempts++;

        setTimeout(function() {
            if (!isCodeObtained) {
                checkCodeInterval();
            }
        }, 3000); // Проверка каждые 3 секунды
    }

    function showSubscribePROModal() {
        if (isCodeObtained) return;

        var modalHtml = '<div>' +
                        '<img id="qrCodeImage" src="http://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://t.me/showybot"/>' +
                        '<p>Ваша PRO подписка истекла. Чтобы продолжить смотреть видео в 4К без задержек, продлите подписку, подробнее в телеграм-боте @showybot или по ссылке t.me/showybot</p>' +
                        '</div>';

        if ($('.modal').length) {
            $('.modal').remove();
        }

        Lampa.Modal.open({
            title: '',
            align: 'center',
            zIndex: 300,
            html: $(modalHtml),
            buttons: [
                {
                    name: 'Удалить устройство',
                    onSelect: function() {
                        deleteDeviceToken();
                    }
                }
            ],
            onBack: function() {
                Lampa.Activity.push({component: 'main'});
                window.location.reload();
            }
        });
    }
  var Network = Lampa.Reguest;
  //var Network = Defined.api.indexOf('pwa') == 0 && typeof Blazor !== 'undefined' ? BlazorNet : Lampa.Reguest;

  function component(object) {
    var network = new Network();
    var scroll = new Lampa.Scroll({
      mask: true,
      over: true
    });
    var files = new Lampa.Explorer(object);
    var filter = new Lampa.Filter(object);
    var sources = {};
    var last;
    var source;
    var balanser;
    var initialized;
    var balanser_timer;
    var images = [];
    var number_of_requests = 0;
    var number_of_requests_timer;
    var life_wait_times = 0;
    var life_wait_timer;
    var hubConnection;
    var hub_timer;
    var filter_sources = {};
    var filter_translate = {
      season: Lampa.Lang.translate('torrent_serial_season'),
      voice: Lampa.Lang.translate('torrent_parser_voice'),
      source: Lampa.Lang.translate('settings_rest_source')
    };
    var filter_find = {
      season: [],
      voice: []
    };
    var balansers_with_search = ['kinotochka', 'kinopub', 'lumex', 'filmix', 'filmixtv', 'fxapi', 'redheadsound', 'animevost', 'animego', 'animedia', 'animebesst', 'anilibria', 'rezka', 'rhsprem', 'kodik', 'remux', 'animelib', 'kinoukr', 'rc/filmix', 'rc/fxapi', 'rc/rhs', 'vcdn'];

    function balanserName(j) {
      var bals = j.balanser;
      var name = j.name.split(' ')[0];
      return (bals || name).toLowerCase();
    }

	function clarificationSearchAdd(value){
		var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		all[id] = value;

		Lampa.Storage.set('clarification_search',all);
	}

	function clarificationSearchDelete(){
		var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		delete all[id];

		Lampa.Storage.set('clarification_search',all);
	}

	function clarificationSearchGet(){
		var id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
		var all = Lampa.Storage.get('clarification_search','{}');

		return all[id];
	}

    this.initialize = function() {
      var _this = this;
      this.loading(true);
      filter.onSearch = function(value) {

		clarificationSearchAdd(value);

        Lampa.Activity.replace({
          search: value,
          clarification: true,
          similar: true
        });
      };
      filter.onBack = function() {
        _this.start();
      };
      filter.render().find('.selector').on('hover:enter', function() {
        clearInterval(balanser_timer);
      });
      filter.render().find('.filter--search').appendTo(filter.render().find('.torrent-filter'));
      filter.onSelect = function(type, a, b) {
        if (type == 'filter') {
          if (a.reset) {
			  clarificationSearchDelete();

            _this.replaceChoice({
              season: 0,
              voice: 0,
              voice_url: '',
              voice_name: ''
            });
            setTimeout(function() {
              Lampa.Select.close();
              Lampa.Activity.replace({
				  clarification: 0,
				  similar: 0
			  });
            }, 10);
          } else {
            var url = filter_find[a.stype][b.index].url;
            var choice = _this.getChoice();
            if (a.stype == 'voice') {
              choice.voice_name = filter_find.voice[b.index].title;
              choice.voice_url = url;
            }
            choice[a.stype] = b.index;
            _this.saveChoice(choice);
            _this.reset();
            _this.request(url);
            setTimeout(Lampa.Select.close, 10);
          }
        } else if (type == 'sort') {
          Lampa.Select.close();
          object.lampac_custom_select = a.source;
          _this.changeBalanser(a.source);
        }
      };
      if (filter.addButtonBack) filter.addButtonBack();
      filter.render().find('.filter--sort span').text(Lampa.Lang.translate('lampac_balanser'));
      scroll.body().addClass('torrent-list');
      files.appendFiles(scroll.render());
      files.appendHead(filter.render());
      scroll.minus(files.render().find('.explorer__files-head'));
      scroll.body().append(Lampa.Template.get('lampac_content_loading'));
      Lampa.Controller.enable('content');
      this.loading(false);
	  if(object.balanser){
		  files.render().find('.filter--search').remove();
		  sources = {};
		  sources[object.balanser] = {name: object.balanser};
		  balanser = object.balanser;
		  filter_sources = [];

		  return network["native"](account(object.url.replace('rjson=','nojson=')), this.parse.bind(this), function(){
			  files.render().find('.torrent-filter').remove();
			  _this.empty();
		  }, false, {
            dataType: 'text'
		  });
	  }
      this.externalids().then(function() {
        return _this.createSource();
      }).then(function(json) {
        if (!balansers_with_search.find(function(b) {
            return balanser.slice(0, b.length) == b;
          })) {
          filter.render().find('.filter--search').addClass('hide');
        }
        _this.search();
      })["catch"](function(e) {
        _this.noConnectToServer(e);
      });
    };
    this.rch = function(json, noreset) {
      var _this2 = this;
      var load = function load() {
        if (hubConnection) {
          clearTimeout(hub_timer);
          hubConnection.stop();
          hubConnection = null;
		  //console.log('RCH', 'hubConnection stop');
        }
        hubConnection = new signalR.HubConnectionBuilder().withUrl(json.ws).build();
        hubConnection.start().then(function() {
          window.rch.Registry(json.result, hubConnection, function() {
            //console.log('RCH', 'hubConnection start');
            if (!noreset) _this2.find();
            else noreset();
          });
        })["catch"](function(err) {
          //console.log('RCH', err.toString());
          return console.error(err.toString());
        });
		if (json.keepalive > 0) {
          hub_timer = setTimeout(function() {
            hubConnection.stop();
			hubConnection = null;
          }, 1000 * json.keepalive);
		}
      };
      if (typeof signalR == 'undefined') {
        Lampa.Utils.putScript(["http://showypro.ru/signalr-6.0.25_es5.js"], function() {}, false, function() {
          load();
        }, true);
      } else load();
    };
    this.externalids = function() {
      return new Promise(function(resolve, reject) {
        if (!object.movie.imdb_id || !object.movie.kinopoisk_id) {
          var query = [];
          query.push('id=' + object.movie.id);
          query.push('serial=' + (object.movie.name ? 1 : 0));
          if (object.movie.imdb_id) query.push('imdb_id=' + (object.movie.imdb_id || ''));
          if (object.movie.kinopoisk_id) query.push('kinopoisk_id=' + (object.movie.kinopoisk_id || ''));
          var url = Defined.localhost + 'externalids?' + query.join('&');
          network.timeout(10000);
          network.silent(account(url), function(json) {
            for (var name in json) {
              object.movie[name] = json[name];
            }
            resolve();
          }, function() {
            resolve();
          });
        } else resolve();
      });
    };
    this.updateBalanser = function(balanser_name) {
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      last_select_balanser[object.movie.id] = balanser_name;
      Lampa.Storage.set('online_last_balanser', last_select_balanser);
    };
    this.changeBalanser = function(balanser_name) {
      this.updateBalanser(balanser_name);
      Lampa.Storage.set('online_balanser', balanser_name);
      var to = this.getChoice(balanser_name);
      var from = this.getChoice();
      if (from.voice_name) to.voice_name = from.voice_name;
      this.saveChoice(to, balanser_name);
      Lampa.Activity.replace();
    };
    this.requestParams = function(url) {
      var query = [];
      var card_source = object.movie.source || 'tmdb'; //Lampa.Storage.field('source')
      query.push('id=' + object.movie.id);
      if (object.movie.imdb_id) query.push('imdb_id=' + (object.movie.imdb_id || ''));
      if (object.movie.kinopoisk_id) query.push('kinopoisk_id=' + (object.movie.kinopoisk_id || ''));
      query.push('title=' + encodeURIComponent(object.clarification ? object.search : object.movie.title || object.movie.name));
      query.push('original_title=' + encodeURIComponent(object.movie.original_title || object.movie.original_name));
      query.push('serial=' + (object.movie.name ? 1 : 0));
      query.push('original_language=' + (object.movie.original_language || ''));
      query.push('year=' + ((object.movie.release_date || object.movie.first_air_date || '0000') + '').slice(0, 4));
      query.push('source=' + card_source);
	  query.push('rchtype=' + (window.rch ? window.rch.type : ''));
      query.push('clarification=' + (object.clarification ? 1 : 0));
      query.push('similar=' + (object.similar ? true : false));
      if (Lampa.Storage.get('account_email', '')) query.push('cub_id=' + Lampa.Utils.hash(Lampa.Storage.get('account_email', '')));
      return url + (url.indexOf('?') >= 0 ? '&' : '?') + query.join('&');
    };
    this.getLastChoiceBalanser = function() {
      var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
      if (last_select_balanser[object.movie.id]) {
        return last_select_balanser[object.movie.id];
      } else {
        return Lampa.Storage.get('online_balanser', filter_sources.length ? filter_sources[0] : '');
      }
    };
    this.startSource = function(json) {
      return new Promise(function(resolve, reject) {
        json.forEach(function(j) {
          var name = balanserName(j);
          sources[name] = {
            url: j.url,
            name: j.name,
            show: typeof j.show == 'undefined' ? true : j.show
          };
        });
        filter_sources = Lampa.Arrays.getKeys(sources);
        if (filter_sources.length) {
          var last_select_balanser = Lampa.Storage.cache('online_last_balanser', 3000, {});
          if (last_select_balanser[object.movie.id]) {
            balanser = last_select_balanser[object.movie.id];
          } else {
            balanser = Lampa.Storage.get('online_balanser', filter_sources[0]);
          }
          if (!sources[balanser]) balanser = filter_sources[0];
          if (!sources[balanser].show && !object.lampac_custom_select) balanser = filter_sources[0];
          source = sources[balanser].url;
          resolve(json);
        } else {
          reject();
        }
      });
    };
    this.lifeSource = function() {
      var _this3 = this;
      return new Promise(function(resolve, reject) {
        var url = _this3.requestParams(Defined.localhost + 'lifeevents?memkey=' + (_this3.memkey || ''));
        var red = false;
        var gou = function gou(json, any) {
          if (json.accsdb) return reject(json);
          var last_balanser = _this3.getLastChoiceBalanser();
          if (!red) {
            var _filter = json.online.filter(function(c) {
              return any ? c.show : c.show && c.name.toLowerCase() == last_balanser;
            });
            if (_filter.length) {
              red = true;
              resolve(json.online.filter(function(c) {
                return c.show;
              }));
            } else if (any) {
              reject();
            }
          }
        };
        var fin = function fin(call) {
          network.timeout(3000);
          network.silent(account(url), function(json) {
            life_wait_times++;
            filter_sources = [];
            sources = {};
            json.online.forEach(function(j) {
              var name = balanserName(j);
              sources[name] = {
                url: j.url,
                name: j.name,
                show: typeof j.show == 'undefined' ? true : j.show
              };
            });
            filter_sources = Lampa.Arrays.getKeys(sources);
            filter.set('sort', filter_sources.map(function(e) {
              return {
                title: sources[e].name,
                source: e,
                selected: e == balanser,
                ghost: !sources[e].show
              };
            }));
            filter.chosen('sort', [sources[balanser] ? sources[balanser].name : balanser]);
            gou(json);
            var lastb = _this3.getLastChoiceBalanser();
            if (life_wait_times > 15 || json.ready) {
              filter.render().find('.lampac-balanser-loader').remove();
              gou(json, true);
            } else if (!red && sources[lastb] && sources[lastb].show) {
              gou(json, true);
              life_wait_timer = setTimeout(fin, 1000);
            } else {
              life_wait_timer = setTimeout(fin, 1000);
            }
          }, function() {
            life_wait_times++;
            if (life_wait_times > 15) {
              reject();
            } else {
              life_wait_timer = setTimeout(fin, 1000);
            }
          });
        };
        fin();
      });
    };
    this.createSource = function() {
      var _this4 = this;
      return new Promise(function(resolve, reject) {
        var url = _this4.requestParams(Defined.localhost + 'lite/events?life=true');
        network.timeout(15000);
        network.silent(account(url), function(json) {
          if (json.accsdb) return reject(json);
          if (json.life) {
			_this4.memkey = json.memkey;
			if (json.title) {
              if (object.movie.name) object.movie.name = json.title;
              if (object.movie.title) object.movie.title = json.title;
			}
            filter.render().find('.filter--sort').append('<span class="lampac-balanser-loader" style="width: 1.2em; height: 1.2em; margin-top: 0; background: url(./img/loader.svg) no-repeat 50% 50%; background-size: contain; margin-left: 0.5em"></span>');
            _this4.lifeSource().then(_this4.startSource).then(resolve)["catch"](reject);
          } else {
            _this4.startSource(json).then(resolve)["catch"](reject);
          }
        }, reject);
      });
    };
    /**
     * Подготовка
     */
    this.create = function() {
      return this.render();
    };
    /**
     * Начать поиск
     */
    this.search = function() { //this.loading(true)
      this.filter({
        source: filter_sources
      }, this.getChoice());
      this.find();
    };
    this.find = function() {
      this.request(this.requestParams(source));
    };
    this.request = function(url) {
      number_of_requests++;
      if (number_of_requests < 10) {
        network["native"](account(url), this.parse.bind(this), this.doesNotAnswer.bind(this), false, {
          dataType: 'text'
        });
        clearTimeout(number_of_requests_timer);
        number_of_requests_timer = setTimeout(function() {
          number_of_requests = 0;
        }, 4000);
      } else this.empty();
    };
    this.parseJsonDate = function(str, name) {
      try {
        var html = $('<div>' + str + '</div>');
        var elems = [];
        html.find(name).each(function() {
          var item = $(this);
          var data = JSON.parse(item.attr('data-json'));
          var season = item.attr('s');
          var episode = item.attr('e');
          var text = item.text();
          if (!object.movie.name) {
            if (text.match(/\d+p/i)) {
              if (!data.quality) {
                data.quality = {};
                data.quality[text] = data.url;
              }
              text = object.movie.title;
            }
            if (text == 'По умолчанию') {
              text = object.movie.title;
            }
          }
          if (episode) data.episode = parseInt(episode);
          if (season) data.season = parseInt(season);
          if (text) data.text = text;
          data.active = item.hasClass('active');
          elems.push(data);
        });
        return elems;
      } catch (e) {
        return [];
      }
    };
    this.getFileUrl = function(file, call) {
	  var _this = this;

      if(Lampa.Storage.field('player') !== 'inner' && file.stream && Lampa.Platform.is('apple')){
		  var newfile = Lampa.Arrays.clone(file);
		  newfile.method = 'play';
		  newfile.url = file.stream;
		  call(newfile, {});
	  }
      else if (file.method == 'play') call(file, {});
      else {
        Lampa.Loading.start(function() {
          Lampa.Loading.stop();
          Lampa.Controller.toggle('content');
          network.clear();
        });
        network["native"](account(file.url), function(json) {
			if(json.rch){
				_this.rch(json,function(){
					Lampa.Loading.stop();

					_this.getFileUrl(file, call);
				});
			}
			else{
				Lampa.Loading.stop();
				call(json, json);
			}
        }, function() {
          Lampa.Loading.stop();
          call(false, {});
        });
      }
    };
    this.toPlayElement = function(file) {
      var play = {
        title: file.title,
        url: file.url,
        quality: file.qualitys,
        timeline: file.timeline,
        subtitles: file.subtitles,
        callback: file.mark
      };
      return play;
    };
    this.orUrlReserve = function(data) {
      if (data.url && typeof data.url == 'string' && data.url.indexOf(" or ") !== -1) {
        var urls = data.url.split(" or ");
        data.url = urls[0];
        data.url_reserve = urls[1];
      }
    };
    this.setDefaultQuality = function(data) {
      if (Lampa.Arrays.getKeys(data.quality).length) {
        for (var q in data.quality) {
          if (parseInt(q) == Lampa.Storage.field('video_quality_default')) {
            data.url = data.quality[q];
            this.orUrlReserve(data);
          }
          if (data.quality[q].indexOf(" or ") !== -1)
            data.quality[q] = data.quality[q].split(" or ")[0];
        }
      }
    };
    this.display = function(videos) {
      var _this5 = this;
      this.draw(videos, {
        onEnter: function onEnter(item, html) {
          _this5.getFileUrl(item, function(json, json_call) {
            if (json && json.url) {
              var playlist = [];
              var first = _this5.toPlayElement(item);
              first.url = json.url;
              first.headers = json_call.headers || json.headers;
              first.quality = json_call.quality || item.qualitys;
              first.hls_manifest_timeout = json_call.hls_manifest_timeout || json.hls_manifest_timeout;
              first.subtitles = json.subtitles;
              first.vast_url = json.vast_url;
              first.vast_msg = json.vast_msg;
              _this5.orUrlReserve(first);
              _this5.setDefaultQuality(first);
              if (item.season) {
                videos.forEach(function(elem) {
                  var cell = _this5.toPlayElement(elem);
                  if (elem == item) cell.url = json.url;
                  else {
                    if (elem.method == 'call') {
                      if (Lampa.Storage.field('player') !== 'inner') {
                        cell.url = elem.stream;
						delete cell.quality;
                      } else {
                        cell.url = function(call) {
                          _this5.getFileUrl(elem, function(stream, stream_json) {
                            if (stream.url) {
                              cell.url = stream.url;
                              cell.quality = stream_json.quality || elem.qualitys;
                              cell.subtitles = stream.subtitles;
                              _this5.orUrlReserve(cell);
                              _this5.setDefaultQuality(cell);
                              elem.mark();
                            } else {
                              cell.url = '';
                              Lampa.Noty.show(Lampa.Lang.translate('lampac_nolink'));
                            }
                            call();
                          }, function() {
                            cell.url = '';
                            call();
                          });
                        };
                      }
                    } else {
                      cell.url = elem.url;
                    }
                  }
                  _this5.orUrlReserve(cell);
                  _this5.setDefaultQuality(cell);
                  playlist.push(cell);
                }); //Lampa.Player.playlist(playlist)
              } else {
                playlist.push(first);
              }
              if (playlist.length > 1) first.playlist = playlist;
              if (first.url) {
                var element = first;
				element.isonline = true;
                if (element.url && element.isonline) {
  // online.js
}
else if (element.url) {
  if (Platform.is('browser') && location.host.indexOf("127.0.0.1") !== -1) {
    Noty.show('Видео открыто в playerInner', {time: 3000});
    $.get('http://showypro.ru/player-inner/' + element.url);
    return;
  }

  Player.play(element);
}
                Lampa.Player.play(first);
                Lampa.Player.playlist(playlist);
                item.mark();
                _this5.updateBalanser(balanser);
              } else {
                Lampa.Noty.show(Lampa.Lang.translate('lampac_nolink'));
              }
            } else Lampa.Noty.show(Lampa.Lang.translate('lampac_nolink'));
          }, true);
        },
        onContextMenu: function onContextMenu(item, html, data, call) {
          _this5.getFileUrl(item, function(stream) {
            call({
              file: stream.url,
              quality: item.qualitys
            });
          }, true);
        }
      });
      this.filter({
        season: filter_find.season.map(function(s) {
          return s.title;
        }),
        voice: filter_find.voice.map(function(b) {
          return b.title;
        })
      }, this.getChoice());
    };
    this.parse = function(str) {
      var json = Lampa.Arrays.decodeJson(str, {});
      if (Lampa.Arrays.isObject(str) && str.rch) json = str;
      if (json.rch) return this.rch(json);
      try {
        var items = this.parseJsonDate(str, '.videos__item');
        var buttons = this.parseJsonDate(str, '.videos__button');
        if (items.length == 1 && items[0].method == 'link' && !items[0].similar) {
          filter_find.season = items.map(function(s) {
            return {
              title: s.text,
              url: s.url
            };
          });
          this.replaceChoice({
            season: 0
          });
          this.request(items[0].url);
        } else {
          this.activity.loader(false);
          var videos = items.filter(function(v) {
            return v.method == 'play' || v.method == 'call';
          });
          var similar = items.filter(function(v) {
            return v.similar;
          });
          if (videos.length) {
            if (buttons.length) {
              filter_find.voice = buttons.map(function(b) {
                return {
                  title: b.text,
                  url: b.url
                };
              });
              var select_voice_url = this.getChoice(balanser).voice_url;
              var select_voice_name = this.getChoice(balanser).voice_name;
              var find_voice_url = buttons.find(function(v) {
                return v.url == select_voice_url;
              });
              var find_voice_name = buttons.find(function(v) {
                return v.text == select_voice_name;
              });
              var find_voice_active = buttons.find(function(v) {
                return v.active;
              }); ////console.log('b',buttons)
              ////console.log('u',find_voice_url)
              ////console.log('n',find_voice_name)
              ////console.log('a',find_voice_active)
              if (find_voice_url && !find_voice_url.active) {
                //console.log('Lampac', 'go to voice', find_voice_url);
                this.replaceChoice({
                  voice: buttons.indexOf(find_voice_url),
                  voice_name: find_voice_url.text
                });
                this.request(find_voice_url.url);
              } else if (find_voice_name && !find_voice_name.active) {
                //console.log('Lampac', 'go to voice', find_voice_name);
                this.replaceChoice({
                  voice: buttons.indexOf(find_voice_name),
                  voice_name: find_voice_name.text
                });
                this.request(find_voice_name.url);
              } else {
                if (find_voice_active) {
                  this.replaceChoice({
                    voice: buttons.indexOf(find_voice_active),
                    voice_name: find_voice_active.text
                  });
                }
                this.display(videos);
              }
            } else {
              this.replaceChoice({
                voice: 0,
                voice_url: '',
                voice_name: ''
              });
              this.display(videos);
            }
          } else if (items.length) {
            if (similar.length) {
              this.similars(similar);
              this.activity.loader(false);
            } else { //this.activity.loader(true)
              filter_find.season = items.map(function(s) {
                return {
                  title: s.text,
                  url: s.url
                };
              });
              var select_season = this.getChoice(balanser).season;
              var season = filter_find.season[select_season];
              if (!season) season = filter_find.season[0];
              //console.log('Lampac', 'go to season', season);
              this.request(season.url);
            }
          } else {
            this.doesNotAnswer(json);
          }
        }
      } catch (e) {
        //console.log('Lampac', 'error', e.stack);
        this.doesNotAnswer(e);
      }
    };
    this.similars = function(json) {
      var _this6 = this;
      scroll.clear();
      json.forEach(function(elem) {
        elem.title = elem.text;
        elem.info = '';
        var info = [];
        var year = ((elem.start_date || elem.year || object.movie.release_date || object.movie.first_air_date || '') + '').slice(0, 4);
        if (year) info.push(year);
        if (elem.details) info.push(elem.details);
        var name = elem.title || elem.text;
        elem.title = name;
        elem.time = elem.time || '';
        elem.info = info.join('<span class="online-prestige-split">●</span>');
        var item = Lampa.Template.get('lampac_prestige_folder', elem);
		if(elem.img){
			var image = $('<img style="height: 7em; width: 7em; border-radius: 0.3em;"/>')

			item.find('.online-prestige__folder').empty().append(image)

			Lampa.Utils.imgLoad(image, elem.img)
		}
        item.on('hover:enter', function() {
          _this6.reset();
          _this6.request(elem.url);
        }).on('hover:focus', function(e) {
          last = e.target;
          scroll.update($(e.target), true);
        });
        scroll.append(item);
      });
	  this.filter({
        season: filter_find.season.map(function(s) {
          return s.title;
        }),
        voice: filter_find.voice.map(function(b) {
          return b.title;
        })
      }, this.getChoice());
      Lampa.Controller.enable('content');
    };
    this.getChoice = function(for_balanser) {
      var data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {});
      var save = data[object.movie.id] || {};
      Lampa.Arrays.extend(save, {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0,
        episodes_view: {},
        movie_view: ''
      });
      return save;
    };
    this.saveChoice = function(choice, for_balanser) {
      var data = Lampa.Storage.cache('online_choice_' + (for_balanser || balanser), 3000, {});
      data[object.movie.id] = choice;
      Lampa.Storage.set('online_choice_' + (for_balanser || balanser), data);
      this.updateBalanser(for_balanser || balanser);
    };
    this.replaceChoice = function(choice, for_balanser) {
      var to = this.getChoice(for_balanser);
      Lampa.Arrays.extend(to, choice, true);
      this.saveChoice(to, for_balanser);
    };
    this.clearImages = function() {
      images.forEach(function(img) {
        img.onerror = function() {};
        img.onload = function() {};
        img.src = '';
      });
      images = [];
    };
    /**
     * Очистить список файлов
     */
    this.reset = function() {
      last = false;
      clearInterval(balanser_timer);
      network.clear();
      this.clearImages();
      scroll.render().find('.empty').remove();
      scroll.clear();
      scroll.reset();
      scroll.body().append(Lampa.Template.get('lampac_content_loading'));
    };
    /**
     * Загрузка
     */
    this.loading = function(status) {
      if (status) this.activity.loader(true);
      else {
        this.activity.loader(false);
        this.activity.toggle();
      }
    };
    /**
     * Построить фильтр
     */
    this.filter = function(filter_items, choice) {
      var _this7 = this;
      var select = [];
      var add = function add(type, title) {
        var need = _this7.getChoice();
        var items = filter_items[type];
        var subitems = [];
        var value = need[type];
        items.forEach(function(name, i) {
          subitems.push({
            title: name,
            selected: value == i,
            index: i
          });
        });
        select.push({
          title: title,
          subtitle: items[value],
          items: subitems,
          stype: type
        });
      };
      filter_items.source = filter_sources;
      select.push({
        title: Lampa.Lang.translate('torrent_parser_reset'),
        reset: true
      });
      this.saveChoice(choice);
      if (filter_items.voice && filter_items.voice.length) add('voice', Lampa.Lang.translate('torrent_parser_voice'));
      if (filter_items.season && filter_items.season.length) add('season', Lampa.Lang.translate('torrent_serial_season'));
      filter.set('filter', select);
      filter.set('sort', filter_sources.map(function(e) {
        return {
          title: sources[e].name,
          source: e,
          selected: e == balanser,
          ghost: !sources[e].show
        };
      }));
      this.selected(filter_items);
    };
    /**
     * Показать что выбрано в фильтре
     */
    this.selected = function(filter_items) {
      var need = this.getChoice(),
        select = [];
      for (var i in need) {
        if (filter_items[i] && filter_items[i].length) {
          if (i == 'voice') {
            select.push(filter_translate[i] + ': ' + filter_items[i][need[i]]);
          } else if (i !== 'source') {
            if (filter_items.season.length >= 1) {
              select.push(filter_translate.season + ': ' + filter_items[i][need[i]]);
            }
          }
        }
      }
      filter.chosen('filter', select);
      filter.chosen('sort', [sources[balanser].name]);
    };
    this.getEpisodes = function(season, call) {
      var episodes = [];
      if (['cub', 'tmdb'].indexOf(object.movie.source || 'tmdb') == -1) return call(episodes);
      if (typeof object.movie.id == 'number' && object.movie.name) {
        var tmdburl = 'tv/' + object.movie.id + '/season/' + season + '?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language', 'ru');
        var baseurl = Lampa.TMDB.api(tmdburl);
        network.timeout(1000 * 10);
        network["native"](baseurl, function(data) {
          episodes = data.episodes || [];
          call(episodes);
        }, function(a, c) {
          call(episodes);
        });
      } else call(episodes);
    };
    this.watched = function(set) {
      var file_id = Lampa.Utils.hash(object.movie.number_of_seasons ? object.movie.original_name : object.movie.original_title);
      var watched = Lampa.Storage.cache('online_watched_last', 5000, {});
      if (set) {
        if (!watched[file_id]) watched[file_id] = {};
        Lampa.Arrays.extend(watched[file_id], set, true);
        Lampa.Storage.set('online_watched_last', watched);
        this.updateWatched();
      } else {
        return watched[file_id];
      }
    };
    this.updateWatched = function() {
      var watched = this.watched();
      var body = scroll.body().find('.online-prestige-watched .online-prestige-watched__body').empty();
      if (watched) {
        var line = [];
        if (watched.balanser_name) line.push(watched.balanser_name);
        if (watched.voice_name) line.push(watched.voice_name);
        if (watched.season) line.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + watched.season);
        if (watched.episode) line.push(Lampa.Lang.translate('torrent_serial_episode') + ' ' + watched.episode);
        line.forEach(function(n) {
          body.append('<span>' + n + '</span>');
        });
      } else body.append('<span>' + Lampa.Lang.translate('lampac_no_watch_history') + '</span>');
    };
    /**
     * Отрисовка файлов
     */
    this.draw = function(items) {
      var _this8 = this;
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!items.length) return this.empty();
      scroll.clear();
      if(!object.balanser)scroll.append(Lampa.Template.get('lampac_prestige_watched', {}));
      this.updateWatched();
      this.getEpisodes(items[0].season, function(episodes) {
        var viewed = Lampa.Storage.cache('online_view', 5000, []);
        var serial = object.movie.name ? true : false;
        var choice = _this8.getChoice();
        var fully = window.innerWidth > 480;
        var scroll_to_element = false;
        var scroll_to_mark = false;
        items.forEach(function(element, index) {
          var episode = serial && episodes.length && !params.similars ? episodes.find(function(e) {
            return e.episode_number == element.episode;
          }) : false;
          var episode_num = element.episode || index + 1;
          var episode_last = choice.episodes_view[element.season];
          var voice_name = choice.voice_name || (filter_find.voice[0] ? filter_find.voice[0].title : false) || element.voice_name || (serial ? 'Неизвестно' : element.text) || 'Неизвестно';
          if (element.quality) {
            element.qualitys = element.quality;
            element.quality = Lampa.Arrays.getKeys(element.quality)[0];
          }
          Lampa.Arrays.extend(element, {
            voice_name: voice_name,
            info: voice_name.length > 60 ? voice_name.substr(0, 60) + '...' : voice_name,
            quality: '',
            time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true)
          });
          var hash_timeline = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title].join('') : object.movie.original_title);
          var hash_behold = Lampa.Utils.hash(element.season ? [element.season, element.season > 10 ? ':' : '', element.episode, object.movie.original_title, element.voice_name].join('') : object.movie.original_title + element.voice_name);
          var data = {
            hash_timeline: hash_timeline,
            hash_behold: hash_behold
          };
          var info = [];
          if (element.season) {
            element.translate_episode_end = _this8.getLastEpisode(items);
            element.translate_voice = element.voice_name;
          }
          if (element.text && !episode) element.title = element.text;
          element.timeline = Lampa.Timeline.view(hash_timeline);
          if (episode) {
            element.title = episode.name;
            if (element.info.length < 30 && episode.vote_average) info.push(Lampa.Template.get('lampac_prestige_rate', {
              rate: parseFloat(episode.vote_average + '').toFixed(1)
            }, true));
            if (episode.air_date && fully) info.push(Lampa.Utils.parseTime(episode.air_date).full);
          } else if (object.movie.release_date && fully) {
            info.push(Lampa.Utils.parseTime(object.movie.release_date).full);
          }
          if (!serial && object.movie.tagline && element.info.length < 30) info.push(object.movie.tagline);
          if (element.info) info.push(element.info);
          if (info.length) element.info = info.map(function(i) {
            return '<span>' + i + '</span>';
          }).join('<span class="online-prestige-split">●</span>');
          var html = Lampa.Template.get('lampac_prestige_full', element);
          var loader = html.find('.online-prestige__loader');
          var image = html.find('.online-prestige__img');
		  if(object.balanser) image.hide();
          if (!serial) {
            if (choice.movie_view == hash_behold) scroll_to_element = html;
          } else if (typeof episode_last !== 'undefined' && episode_last == episode_num) {
            scroll_to_element = html;
          }
          if (serial && !episode) {
            image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || index + 1)).slice(-2) + '</div>');
            loader.remove();
          } else if (!serial && ['cub', 'tmdb'].indexOf(object.movie.source || 'tmdb') == -1) loader.remove();
          else {
            var img = html.find('img')[0];
            img.onerror = function() {
              img.src = './img/img_broken.svg';
            };
            img.onload = function() {
              image.addClass('online-prestige__img--loaded');
              loader.remove();
              if (serial) image.append('<div class="online-prestige__episode-number">' + ('0' + (element.episode || index + 1)).slice(-2) + '</div>');
            };
            img.src = Lampa.TMDB.image('t/p/w300' + (episode ? episode.still_path : object.movie.backdrop_path));
            images.push(img);
          }
          html.find('.online-prestige__timeline').append(Lampa.Timeline.render(element.timeline));
          if (viewed.indexOf(hash_behold) !== -1) {
            scroll_to_mark = html;
            html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
          }
          element.mark = function() {
            viewed = Lampa.Storage.cache('online_view', 5000, []);
            if (viewed.indexOf(hash_behold) == -1) {
              viewed.push(hash_behold);
              Lampa.Storage.set('online_view', viewed);
              if (html.find('.online-prestige__viewed').length == 0) {
                html.find('.online-prestige__img').append('<div class="online-prestige__viewed">' + Lampa.Template.get('icon_viewed', {}, true) + '</div>');
              }
            }
            choice = _this8.getChoice();
            if (!serial) {
              choice.movie_view = hash_behold;
            } else {
              choice.episodes_view[element.season] = episode_num;
            }
            _this8.saveChoice(choice);
            var voice_name_text = choice.voice_name || element.voice_name || element.title;
            if (voice_name_text.length > 30) voice_name_text = voice_name_text.slice(0, 30) + '...';
            _this8.watched({
              balanser: balanser,
              balanser_name: Lampa.Utils.capitalizeFirstLetter(sources[balanser] ? sources[balanser].name.split(' ')[0] : balanser),
              voice_id: choice.voice_id,
              voice_name: voice_name_text,
              episode: element.episode,
              season: element.season
            });
          };
          element.unmark = function() {
            viewed = Lampa.Storage.cache('online_view', 5000, []);
            if (viewed.indexOf(hash_behold) !== -1) {
              Lampa.Arrays.remove(viewed, hash_behold);
              Lampa.Storage.set('online_view', viewed);
              Lampa.Storage.remove('online_view', hash_behold);
              html.find('.online-prestige__viewed').remove();
            }
          };
          element.timeclear = function() {
            element.timeline.percent = 0;
            element.timeline.time = 0;
            element.timeline.duration = 0;
            Lampa.Timeline.update(element.timeline);
          };
          html.on('hover:enter', function() {
            if (object.movie.id) Lampa.Favorite.add('history', object.movie, 100);
            if (params.onEnter) params.onEnter(element, html, data);
          }).on('hover:focus', function(e) {
            last = e.target;
            if (params.onFocus) params.onFocus(element, html, data);
            scroll.update($(e.target), true);
          });
          if (params.onRender) params.onRender(element, html, data);
          _this8.contextMenu({
            html: html,
            element: element,
            onFile: function onFile(call) {
              if (params.onContextMenu) params.onContextMenu(element, html, data, call);
            },
            onClearAllMark: function onClearAllMark() {
              items.forEach(function(elem) {
                elem.unmark();
              });
            },
            onClearAllTime: function onClearAllTime() {
              items.forEach(function(elem) {
                elem.timeclear();
              });
            }
          });
          scroll.append(html);
        });
        if (serial && episodes.length > items.length && !params.similars) {
          var left = episodes.slice(items.length);
          left.forEach(function(episode) {
            var info = [];
            if (episode.vote_average) info.push(Lampa.Template.get('lampac_prestige_rate', {
              rate: parseFloat(episode.vote_average + '').toFixed(1)
            }, true));
            if (episode.air_date) info.push(Lampa.Utils.parseTime(episode.air_date).full);
            var air = new Date((episode.air_date + '').replace(/-/g, '/'));
            var now = Date.now();
            var day = Math.round((air.getTime() - now) / (24 * 60 * 60 * 1000));
            var txt = Lampa.Lang.translate('full_episode_days_left') + ': ' + day;
            var html = Lampa.Template.get('lampac_prestige_full', {
              time: Lampa.Utils.secondsToTime((episode ? episode.runtime : object.movie.runtime) * 60, true),
              info: info.length ? info.map(function(i) {
                return '<span>' + i + '</span>';
              }).join('<span class="online-prestige-split">●</span>') : '',
              title: episode.name,
              quality: day > 0 ? txt : ''
            });
            var loader = html.find('.online-prestige__loader');
            var image = html.find('.online-prestige__img');
            var season = items[0] ? items[0].season : 1;
            html.find('.online-prestige__timeline').append(Lampa.Timeline.render(Lampa.Timeline.view(Lampa.Utils.hash([season, episode.episode_number, object.movie.original_title].join('')))));
            var img = html.find('img')[0];
            if (episode.still_path) {
              img.onerror = function() {
                img.src = './img/img_broken.svg';
              };
              img.onload = function() {
                image.addClass('online-prestige__img--loaded');
                loader.remove();
                image.append('<div class="online-prestige__episode-number">' + ('0' + episode.episode_number).slice(-2) + '</div>');
              };
              img.src = Lampa.TMDB.image('t/p/w300' + episode.still_path);
              images.push(img);
            } else {
              loader.remove();
              image.append('<div class="online-prestige__episode-number">' + ('0' + episode.episode_number).slice(-2) + '</div>');
            }
            html.on('hover:focus', function(e) {
              last = e.target;
              scroll.update($(e.target), true);
            });
            html.css('opacity', '0.5');
            scroll.append(html);
          });
        }
        if (scroll_to_element) {
          last = scroll_to_element[0];
        } else if (scroll_to_mark) {
          last = scroll_to_mark[0];
        }
        Lampa.Controller.enable('content');
      });
    };
    /**
     * Меню
     */
    this.contextMenu = function(params) {
      params.html.on('hover:long', function() {
        function show(extra) {
          var enabled = Lampa.Controller.enabled().name;
          var menu = [];
          if (Lampa.Platform.is('webos')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Webos',
              player: 'webos'
            });
          }
          if (Lampa.Platform.is('android')) {
            menu.push({
              title: Lampa.Lang.translate('player_lauch') + ' - Android',
              player: 'android'
            });
          }
          menu.push({
            title: Lampa.Lang.translate('player_lauch') + ' - Lampa',
            player: 'lampa'
          });
          menu.push({
            title: Lampa.Lang.translate('lampac_video'),
            separator: true
          });
          menu.push({
            title: Lampa.Lang.translate('torrent_parser_label_title'),
            mark: true
          });
          menu.push({
            title: Lampa.Lang.translate('torrent_parser_label_cancel_title'),
            unmark: true
          });
          menu.push({
            title: Lampa.Lang.translate('time_reset'),
            timeclear: true
          });
          if (extra) {
            menu.push({
              title: Lampa.Lang.translate('copy_link'),
              copylink: true
            });
          }
          menu.push({
            title: Lampa.Lang.translate('more'),
            separator: true
          });
          if (Lampa.Account.logged() && params.element && typeof params.element.season !== 'undefined' && params.element.translate_voice) {
            menu.push({
              title: Lampa.Lang.translate('lampac_voice_subscribe'),
              subscribe: true
            });
          }
          menu.push({
            title: Lampa.Lang.translate('lampac_clear_all_marks'),
            clearallmark: true
          });
          menu.push({
            title: Lampa.Lang.translate('lampac_clear_all_timecodes'),
            timeclearall: true
          });
          Lampa.Select.show({
            title: Lampa.Lang.translate('title_action'),
            items: menu,
            onBack: function onBack() {
              Lampa.Controller.toggle(enabled);
            },
            onSelect: function onSelect(a) {
              if (a.mark) params.element.mark();
              if (a.unmark) params.element.unmark();
              if (a.timeclear) params.element.timeclear();
              if (a.clearallmark) params.onClearAllMark();
              if (a.timeclearall) params.onClearAllTime();
              Lampa.Controller.toggle(enabled);
              if (a.player) {
                Lampa.Player.runas(a.player);
                params.html.trigger('hover:enter');
              }
              if (a.copylink) {
                if (extra.quality) {
                  var qual = [];
                  for (var i in extra.quality) {
                    qual.push({
                      title: i,
                      file: extra.quality[i]
                    });
                  }
                  Lampa.Select.show({
                    title: Lampa.Lang.translate('settings_server_links'),
                    items: qual,
                    onBack: function onBack() {
                      Lampa.Controller.toggle(enabled);
                    },
                    onSelect: function onSelect(b) {
                      Lampa.Utils.copyTextToClipboard(b.file, function() {
                        Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                      }, function() {
                        Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                      });
                    }
                  });
                } else {
                  Lampa.Utils.copyTextToClipboard(extra.file, function() {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_secuses'));
                  }, function() {
                    Lampa.Noty.show(Lampa.Lang.translate('copy_error'));
                  });
                }
              }
              if (a.subscribe) {
                Lampa.Account.subscribeToTranslation({
                  card: object.movie,
                  season: params.element.season,
                  episode: params.element.translate_episode_end,
                  voice: params.element.translate_voice
                }, function() {
                  Lampa.Noty.show(Lampa.Lang.translate('lampac_voice_success'));
                }, function() {
                  Lampa.Noty.show(Lampa.Lang.translate('lampac_voice_error'));
                });
              }
            }
          });
        }
        params.onFile(show);
      }).on('hover:focus', function() {
        if (Lampa.Helper) Lampa.Helper.show('online_file', Lampa.Lang.translate('helper_online_file'), params.html);
      });
    };
    /**
     * Показать пустой результат
     */
    this.empty = function() {
      var html = Lampa.Template.get('lampac_does_not_answer', {});
      html.find('.online-empty__buttons').remove();
      html.find('.online-empty__title').text(Lampa.Lang.translate('empty_title_two'));
      html.find('.online-empty__time').text(Lampa.Lang.translate('empty_text'));
      scroll.clear();
      scroll.append(html);
      this.loading(false);
    };
    this.noConnectToServer = function(er) {
      var html = Lampa.Template.get('lampac_does_not_answer', {});
      html.find('.online-empty__buttons').remove();
      html.find('.online-empty__title').text(Lampa.Lang.translate('title_error'));
      html.find('.online-empty__time').text(er && er.accsdb ? er.msg : Lampa.Lang.translate('lampac_does_not_answer_text').replace('{balanser}', balanser[balanser].name));
      scroll.clear();
      scroll.append(html);
      this.loading(false);
    };
    this.doesNotAnswer = function(er) {
      var _this9 = this;
      this.reset();
      var html = Lampa.Template.get('lampac_does_not_answer', {
        balanser: balanser
      });
      if(er && er.accsdb) html.find('.online-empty__title').html(er.msg);

      var tic = er && er.accsdb ? 10 : 5;
      html.find('.cancel').on('hover:enter', function() {
        clearInterval(balanser_timer);
      });
      html.find('.change').on('hover:enter', function() {
        clearInterval(balanser_timer);
        filter.render().find('.filter--sort').trigger('hover:enter');
      });
      scroll.clear();
      scroll.append(html);
      this.loading(false);
      balanser_timer = setInterval(function() {
        tic--;
        html.find('.timeout').text(tic);
        if (tic == 0) {
          clearInterval(balanser_timer);
          var keys = Lampa.Arrays.getKeys(sources);
          var indx = keys.indexOf(balanser);
          var next = keys[indx + 1];
          if (!next) next = keys[0];
          balanser = next;
          if (Lampa.Activity.active().activity == _this9.activity) _this9.changeBalanser(balanser);
        }
      }, 1000);
    };
    this.getLastEpisode = function(items) {
      var last_episode = 0;
      items.forEach(function(e) {
        if (typeof e.episode !== 'undefined') last_episode = Math.max(last_episode, parseInt(e.episode));
      });
      return last_episode;
    };
    /**
     * Начать навигацию по файлам
     */
    this.start = function() {
      if (Lampa.Activity.active().activity !== this.activity) return;
      if (!initialized) {
        initialized = true;
        this.initialize();
      }
      Lampa.Background.immediately(Lampa.Utils.cardImgBackgroundBlur(object.movie));
      Lampa.Controller.add('content', {
        toggle: function toggle() {
          Lampa.Controller.collectionSet(scroll.render(), files.render());
          Lampa.Controller.collectionFocus(last || false, scroll.render());
        },
        gone: function gone() {
          clearTimeout(balanser_timer);
        },
        up: function up() {
          if (Navigator.canmove('up')) {
            Navigator.move('up');
          } else Lampa.Controller.toggle('head');
        },
        down: function down() {
          Navigator.move('down');
        },
        right: function right() {
          if (Navigator.canmove('right')) Navigator.move('right');
          else filter.show(Lampa.Lang.translate('title_filter'), 'filter');
        },
        left: function left() {
          if (Navigator.canmove('left')) Navigator.move('left');
          else Lampa.Controller.toggle('menu');
        },
        back: this.back.bind(this)
      });
      Lampa.Controller.toggle('content');
    };
    this.render = function() {
      return files.render();
    };
    this.back = function() {
      Lampa.Activity.backward();
    };
    this.pause = function() {};
    this.stop = function() {};
    this.destroy = function() {
      network.clear();
      this.clearImages();
      files.destroy();
      scroll.destroy();
      clearInterval(balanser_timer);
      clearTimeout(life_wait_timer);
      clearTimeout(hub_timer);
      if (hubConnection) {
        hubConnection.stop();
        hubConnection = null;
      }
    };
  }

  function addSourceSearch(spiderName, spiderUri) {
    var network = new Lampa.Reguest();

    var source = {
      title: spiderName,
      search: function(params, oncomplite) {
        network.silent(account(Defined.localhost + 'lite/'+spiderUri+'?title=' + params.query), function(links) {
          var keys = Lampa.Arrays.getKeys(links);

          if (keys.length) {
            var status = new Lampa.Status(keys.length);

            status.onComplite = function(result) {
              var rows = [];

              keys.forEach(function(name) {
                var line = result[name];

                if (line && line.data && line.type == 'similar') {
                  var cards = line.data.map(function(item) {
                    item.title = Lampa.Utils.capitalizeFirstLetter(item.title);
                    item.release_date = item.year || '0000';
                    item.balanser = spiderUri;
                    if (item.img !== undefined && item.img.charAt(0) === '/') {
						item.img = Defined.localhost + item.img.substring(1);
                    }

                    return item;
                  })

                  rows.push({
                    title: name,
                    results: cards
                  })
                }
              })

              oncomplite(rows);
            }

            keys.forEach(function(name) {
              network.silent(account(links[name]), function(data) {
                status.append(name, data);
              }, function() {
                status.error();
              })
            })
          } else {
            oncomplite([]);
          }
        }, function() {
          oncomplite([]);
        })
      },
      onCancel: function() {
        network.clear()
      },
      params: {
        lazy: true,
        align_left: true,
        card_events: {
          onMenu: function() {}
        }
      },
      onMore: function(params, close) {
        close();
      },
      onSelect: function(params, close) {
        close();

        Lampa.Activity.push({
          url: params.element.url,
          title: 'Lampac - ' + params.element.title,
          component: 'lampac',
          movie: params.element,
          page: 1,
          search: params.element.title,
          clarification: true,
          balanser: params.element.balanser,
          noinfo: true
        });
      }
    }

    Lampa.Search.addSource(source)
  }


  function startPlugin() {
    window.lampac_plugin = true;
    var manifst = {
      type: 'video',
      version: '1.3.4',
      name: 'Showy Pro Ru',
      description: 'Плагин для просмотра онлайн сериалов и фильмов',
      component: 'showyPRO',
      onContextMenu: function onContextMenu(object) {
        return {
          name: Lampa.Lang.translate('lampac_watch'),
          description: 'Плагин для просмотра онлайн сериалов и фильмов'
        };
      },
      onContextLauch: function onContextLauch(object) {
        resetTemplates();
        Lampa.Component.add('showyPRO', component);
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'showyPRO',
          search: object.title,
          search_one: object.title,
          search_two: object.original_title,
          movie: object,
          page: 1
        });
      }
    };
    Lampa.Manifest.plugins = manifst;
    Lampa.Lang.add({
      lampac_watch: { //
        ru: 'Смотреть онлайн',
        en: 'Watch online',
        uk: 'Дивитися онлайн',
        zh: '在线观看'
      },
      lampac_video: { //
        ru: 'Видео',
        en: 'Video',
        uk: 'Відео',
        zh: '视频'
      },
      lampac_no_watch_history: {
        ru: 'Нет истории просмотра',
        en: 'No browsing history',
        ua: 'Немає історії перегляду',
        zh: '没有浏览历史'
      },
      lampac_nolink: {
        ru: 'Не удалось извлечь ссылку',
        uk: 'Неможливо отримати посилання',
        en: 'Failed to fetch link',
        zh: '获取链接失败'
      },
      lampac_balanser: { //
        ru: 'Источник',
        uk: 'Джерело',
        en: 'Source',
        zh: '来源'
      },
      helper_online_file: { //
        ru: 'Удерживайте клавишу "ОК" для вызова контекстного меню',
        uk: 'Утримуйте клавішу "ОК" для виклику контекстного меню',
        en: 'Hold the "OK" key to bring up the context menu',
        zh: '按住“确定”键调出上下文菜单'
      },
      title_online: { //
        ru: 'Онлайн',
        uk: 'Онлайн',
        en: 'Online',
        zh: '在线的'
      },
      lampac_voice_subscribe: { //
        ru: 'Подписаться на перевод',
        uk: 'Підписатися на переклад',
        en: 'Subscribe to translation',
        zh: '订阅翻译'
      },
      lampac_voice_success: { //
        ru: 'Вы успешно подписались',
        uk: 'Ви успішно підписалися',
        en: 'You have successfully subscribed',
        zh: '您已成功订阅'
      },
      lampac_voice_error: { //
        ru: 'Возникла ошибка',
        uk: 'Виникла помилка',
        en: 'An error has occurred',
        zh: '发生了错误'
      },
      lampac_clear_all_marks: { //
        ru: 'Очистить все метки',
        uk: 'Очистити всі мітки',
        en: 'Clear all labels',
        zh: '清除所有标签'
      },
      lampac_clear_all_timecodes: { //
        ru: 'Очистить все тайм-коды',
        uk: 'Очистити всі тайм-коди',
        en: 'Clear all timecodes',
        zh: '清除所有时间代码'
      },
      lampac_change_balanser: { //
        ru: 'Изменить балансер',
        uk: 'Змінити балансер',
        en: 'Change balancer',
        zh: '更改平衡器'
      },
      lampac_balanser_dont_work: { //
        ru: 'Поиск на ({balanser}) не дал результатов',
        uk: 'Пошук на ({balanser}) не дав результатів',
        en: 'Search on ({balanser}) did not return any results',
        zh: '搜索 ({balanser}) 未返回任何结果'
      },
      lampac_balanser_timeout: { //
        ru: 'Источник будет переключен автоматически через <span class="timeout">10</span> секунд.',
        uk: 'Джерело буде автоматично переключено через <span class="timeout">10</span> секунд.',
        en: 'The source will be switched automatically after <span class="timeout">10</span> seconds.',
        zh: '平衡器将在<span class="timeout">10</span>秒内自动切换。'
      },
      lampac_does_not_answer_text: {
        ru: 'Поиск на ({balanser}) не дал результатов',
        uk: 'Пошук на ({balanser}) не дав результатів',
        en: 'Search on ({balanser}) did not return any results',
        zh: '搜索 ({balanser}) 未返回任何结果'
      }
    });
    Lampa.Template.add('lampac_css', "\n        <style>\n        @charset 'UTF-8';.online-prestige{position:relative;-webkit-border-radius:.3em;border-radius:.3em;background-color:rgba(0,0,0,0.3);display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-prestige__body{padding:1.2em;line-height:1.3;-webkit-box-flex:1;-webkit-flex-grow:1;-moz-box-flex:1;-ms-flex-positive:1;flex-grow:1;position:relative}@media screen and (max-width:480px){.online-prestige__body{padding:.8em 1.2em}}.online-prestige__img{position:relative;width:13em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0;min-height:8.2em}.online-prestige__img>img{position:absolute;top:0;left:0;width:100%;height:100%;-o-object-fit:cover;object-fit:cover;-webkit-border-radius:.3em;border-radius:.3em;opacity:0;-webkit-transition:opacity .3s;-o-transition:opacity .3s;-moz-transition:opacity .3s;transition:opacity .3s}.online-prestige__img--loaded>img{opacity:1}@media screen and (max-width:480px){.online-prestige__img{width:7em;min-height:6em}}.online-prestige__folder{padding:1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige__folder>svg{width:4.4em !important;height:4.4em !important}.online-prestige__viewed{position:absolute;top:1em;left:1em;background:rgba(0,0,0,0.45);-webkit-border-radius:100%;border-radius:100%;padding:.25em;font-size:.76em}.online-prestige__viewed>svg{width:1.5em !important;height:1.5em !important}.online-prestige__episode-number{position:absolute;top:0;left:0;right:0;bottom:0;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-webkit-justify-content:center;-moz-box-pack:center;-ms-flex-pack:center;justify-content:center;font-size:2em}.online-prestige__loader{position:absolute;top:50%;left:50%;width:2em;height:2em;margin-left:-1em;margin-top:-1em;background:url(./img/loader.svg) no-repeat center center;-webkit-background-size:contain;-o-background-size:contain;background-size:contain}.online-prestige__head,.online-prestige__footer{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-moz-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__timeline{margin:.8em 0}.online-prestige__timeline>.time-line{display:block !important}.online-prestige__title{font-size:1.7em;overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}@media screen and (max-width:480px){.online-prestige__title{font-size:1.4em}}.online-prestige__time{padding-left:2em}.online-prestige__info{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige__info>*{overflow:hidden;-o-text-overflow:ellipsis;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:1;line-clamp:1;-webkit-box-orient:vertical}.online-prestige__quality{padding-left:1em;white-space:nowrap}.online-prestige__scan-file{position:absolute;bottom:0;left:0;right:0}.online-prestige__scan-file .broadcast__scan{margin:0}.online-prestige .online-prestige-split{font-size:.8em;margin:0 1em;-webkit-flex-shrink:0;-ms-flex-negative:0;flex-shrink:0}.online-prestige.focus::after{content:'';position:absolute;top:-0.6em;left:-0.6em;right:-0.6em;bottom:-0.6em;-webkit-border-radius:.7em;border-radius:.7em;border:solid .3em #fff;z-index:-1;pointer-events:none}.online-prestige+.online-prestige{margin-top:1.5em}.online-prestige--folder .online-prestige__footer{margin-top:.8em}.online-prestige-watched{padding:1em}.online-prestige-watched__icon>svg{width:1.5em;height:1.5em}.online-prestige-watched__body{padding-left:1em;padding-top:.1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap}.online-prestige-watched__body>span+span::before{content:' ● ';vertical-align:top;display:inline-block;margin:0 .5em}.online-prestige-rate{display:-webkit-inline-box;display:-webkit-inline-flex;display:-moz-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center}.online-prestige-rate>svg{width:1.3em !important;height:1.3em !important}.online-prestige-rate>span{font-weight:600;font-size:1.1em;padding-left:.7em}.online-empty{line-height:1.4}.online-empty__title{font-size:1.8em;margin-bottom:.3em}.online-empty__time{font-size:1.2em;font-weight:300;margin-bottom:1.6em}.online-empty__buttons{display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex}.online-empty__buttons>*+*{margin-left:1em}.online-empty__button{background:rgba(0,0,0,0.3);font-size:1.2em;padding:.5em 1.2em;-webkit-border-radius:.2em;border-radius:.2em;margin-bottom:2.4em}.online-empty__button.focus{background:#fff;color:black}.online-empty__templates .online-empty-template:nth-child(2){opacity:.5}.online-empty__templates .online-empty-template:nth-child(3){opacity:.2}.online-empty-template{background-color:rgba(255,255,255,0.3);padding:1em;display:-webkit-box;display:-webkit-flex;display:-moz-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-moz-box-align:center;-ms-flex-align:center;align-items:center;-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template>*{background:rgba(0,0,0,0.3);-webkit-border-radius:.3em;border-radius:.3em}.online-empty-template__ico{width:4em;height:4em;margin-right:2.4em}.online-empty-template__body{height:1.7em;width:70%}.online-empty-template+.online-empty-template{margin-top:1em}\n        </style>\n    ");
    $('body').append(Lampa.Template.get('lampac_css', {}, true));

    function resetTemplates() {
      Lampa.Template.add('lampac_prestige_full', "<div class=\"online-prestige online-prestige--full selector\">\n            <div class=\"online-prestige__img\">\n                <img alt=\"\">\n                <div class=\"online-prestige__loader\"></div>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__timeline\"></div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                    <div class=\"online-prestige__quality\">{quality}</div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_content_loading', "<div class=\"online-empty\">\n            <div class=\"broadcast__scan\"><div></div></div>\n\t\t\t\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template selector\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_does_not_answer', "<div class=\"online-empty\">\n            <div class=\"online-empty__title\">\n                #{lampac_balanser_dont_work}\n            </div>\n            <div class=\"online-empty__time\">\n                #{lampac_balanser_timeout}\n            </div>\n            <div class=\"online-empty__buttons\">\n                <div class=\"online-empty__button selector cancel\">#{cancel}</div>\n                <div class=\"online-empty__button selector change\">#{lampac_change_balanser}</div>\n            </div>\n            <div class=\"online-empty__templates\">\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n                <div class=\"online-empty-template\">\n                    <div class=\"online-empty-template__ico\"></div>\n                    <div class=\"online-empty-template__body\"></div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_prestige_rate', "<div class=\"online-prestige-rate\">\n            <svg width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z\" fill=\"#fff\"></path>\n            </svg>\n            <span>{rate}</span>\n        </div>");
      Lampa.Template.add('lampac_prestige_folder', "<div class=\"online-prestige online-prestige--folder selector\">\n            <div class=\"online-prestige__folder\">\n                <svg viewBox=\"0 0 128 112\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <rect y=\"20\" width=\"128\" height=\"92\" rx=\"13\" fill=\"white\"></rect>\n                    <path d=\"M29.9963 8H98.0037C96.0446 3.3021 91.4079 0 86 0H42C36.5921 0 31.9555 3.3021 29.9963 8Z\" fill=\"white\" fill-opacity=\"0.23\"></path>\n                    <rect x=\"11\" y=\"8\" width=\"106\" height=\"76\" rx=\"13\" fill=\"white\" fill-opacity=\"0.51\"></rect>\n                </svg>\n            </div>\n            <div class=\"online-prestige__body\">\n                <div class=\"online-prestige__head\">\n                    <div class=\"online-prestige__title\">{title}</div>\n                    <div class=\"online-prestige__time\">{time}</div>\n                </div>\n\n                <div class=\"online-prestige__footer\">\n                    <div class=\"online-prestige__info\">{info}</div>\n                </div>\n            </div>\n        </div>");
      Lampa.Template.add('lampac_prestige_watched', "<div class=\"online-prestige online-prestige-watched selector\">\n            <div class=\"online-prestige-watched__icon\">\n                <svg width=\"21\" height=\"21\" viewBox=\"0 0 21 21\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <circle cx=\"10.5\" cy=\"10.5\" r=\"9\" stroke=\"currentColor\" stroke-width=\"3\"/>\n                    <path d=\"M14.8477 10.5628L8.20312 14.399L8.20313 6.72656L14.8477 10.5628Z\" fill=\"currentColor\"/>\n                </svg>\n            </div>\n            <div class=\"online-prestige-watched__body\">\n                \n            </div>\n        </div>");
    }
    var button = "<div class=\"full-start__button selector view--online_showyPRO showyPRO--button\" data-subtitle=\"".concat(manifst.name, " v").concat(manifst.version, "\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 392.697 392.697\" xml:space=\"preserve\">\n            <path d=\"M21.837,83.419l36.496,16.678L227.72,19.886c1.229-0.592,2.002-1.846,1.98-3.209c-0.021-1.365-0.834-2.592-2.082-3.145\n                L197.766,0.3c-0.903-0.4-1.933-0.4-2.837,0L21.873,77.036c-1.259,0.559-2.073,1.803-2.081,3.18\n                C19.784,81.593,20.584,82.847,21.837,83.419z\" fill=\"currentColor\"></path>\n            <path d=\"M185.689,177.261l-64.988-30.01v91.617c0,0.856-0.44,1.655-1.167,2.114c-0.406,0.257-0.869,0.386-1.333,0.386\n                c-0.368,0-0.736-0.082-1.079-0.244l-68.874-32.625c-0.869-0.416-1.421-1.293-1.421-2.256v-92.229L6.804,95.5\n                c-1.083-0.496-2.344-0.406-3.347,0.238c-1.002,0.645-1.608,1.754-1.608,2.944v208.744c0,1.371,0.799,2.615,2.045,3.185\n                l178.886,81.768c0.464,0.211,0.96,0.315,1.455,0.315c0.661,0,1.318-0.188,1.892-0.555c1.002-0.645,1.608-1.754,1.608-2.945\n                V180.445C187.735,179.076,186.936,177.831,185.689,177.261z\" fill=\"currentColor\"></path>\n            <path d=\"M389.24,95.74c-1.002-0.644-2.264-0.732-3.347-0.238l-178.876,81.76c-1.246,0.57-2.045,1.814-2.045,3.185v208.751\n                c0,1.191,0.606,2.302,1.608,2.945c0.572,0.367,1.23,0.555,1.892,0.555c0.495,0,0.991-0.104,1.455-0.315l178.876-81.768\n                c1.246-0.568,2.045-1.813,2.045-3.185V98.685C390.849,97.494,390.242,96.384,389.24,95.74z\" fill=\"currentColor\"></path>\n            <path d=\"M372.915,80.216c-0.009-1.377-0.823-2.621-2.082-3.18l-60.182-26.681c-0.938-0.418-2.013-0.399-2.938,0.045\n                l-173.755,82.992l60.933,29.117c0.462,0.211,0.958,0.316,1.455,0.316s0.993-0.105,1.455-0.316l173.066-79.092\n                C372.122,82.847,372.923,81.593,372.915,80.216z\" fill=\"currentColor\"></path>\n        </svg>\n\n        <span>#{title_online}</span>\n    </div>"); // нужна заглушка, а то при страте лампы говорит пусто
    Lampa.Component.add('showyPRO', component); //то же самое
    resetTemplates();

    function addButton(e) {
      if (e.render.find('.showyPRO--button').length) return;
      var btn = $(Lampa.Lang.translate(button));
      btn.on('hover:enter', function() {
        resetTemplates();
        Lampa.Component.add('showyPRO', component);
        Lampa.Activity.push({
          url: '',
          title: Lampa.Lang.translate('title_online'),
          component: 'showyPRO',
          search: e.movie.title,
          search_one: e.movie.title,
          search_two: e.movie.original_title,
          movie: e.movie,
          page: 1
        });
      });
      e.render.before(btn);
    }
    Lampa.Listener.follow('full', function(e) {
            if (e.type == 'complite') {
             //   if (Lampa.Storage.get('card_interfice_type') === 'new') {
                addButton({
                    render: e.object.activity.render().find('.button--play'),
                    movie: e.data.movie
                });
             //  }
             /*  else {
                addButton({
                    render: e.object.activity.render().find('.view--torrent'),
                    movie: e.data.movie
                });
               }*/
            }
        });
        try {
            if (Lampa.Activity.active().component == 'full') {
                addButton({
                    render: Lampa.Activity.active().activity.render().find('.view--torrent'),
                    movie: Lampa.Activity.active().card
                });
            }
        } catch (e) {}
    if (Lampa.Manifest.app_digital >= 177) {
      var balansers_sync = ["filmix", "fxapi", "kinobase", "rezka", "voidboost", "videocdn", "videodb", "collaps", "hdvb", "zetflix", "kodik", "ashdi", "eneyida", "kinoukr", "kinokrad", "kinotochka", "kinoprofi", "remux", "iframevideo", "cdnmovies", "anilibria", "animedia", "animego", "animevost", "animebesst", "redheadsound", "alloha", "seasonvar", "kinopub", "vokino"];
      balansers_sync.forEach(function(name) {
        Lampa.Storage.sync('online_choice_' + name, 'object_object');
      });
      Lampa.Storage.sync('online_watched_last', 'object_object');
    }
  }

  Lampa.Listener.follow('full', function(e) {
        if (e.type == 'complite') {
            setTimeout(function(){
                $(".view--online_showyPRO", Lampa.Activity.active().activity.render()).empty().append('<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.99.99 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88zM5 9v6h1.25v-2H7a2 2 0 0 0 2-2a2 2 0 0 0-2-2zm1.25 3v-2h.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1zm3.5-3v6H11v-2h.75l.66 2h1.32l-.79-2.39c.49-.36.81-.95.81-1.61a2 2 0 0 0-2-2zM11 12v-2h.5a1 1 0 0 1 1 1a1 1 0 0 1-1 1zm6-3c-1.38 0-2.5 1.34-2.5 3s1.12 3 2.5 3s2.5-1.34 2.5-3s-1.12-3-2.5-3m0 1.25c.76 0 1.38.78 1.38 1.75s-.62 1.75-1.38 1.75s-1.37-.78-1.37-1.75s.61-1.75 1.37-1.75"/></svg>&nbsp&nbspShowy RU');
            }, 5);
        }
  })
 
//  (function(_0x4bb118,_0x523526){function _0x8d5429(_0x5e44f9,_0x38d727,_0x37fa4f,_0x3a9861){return _0x5165(_0x38d727- -0xf2,_0x5e44f9);}function _0x53120f(_0x2fa289,_0x1ce8cd,_0x110c39,_0x1ddc3c){return _0x5165(_0x110c39- -0x68,_0x2fa289);}var _0x248a38=_0x4bb118();while(!![]){try{var _0x318662=parseInt(_0x53120f(0x94,0x99,0x7f,0x76))/(0xed2+-0x1d*0x91+0x19c)+parseInt(_0x53120f(0x6f,0x66,0x71,0x4d))/(0x24a8+-0x7*-0x413+-0x1*0x412b)+-parseInt(_0x53120f(0x59,0x78,0x6b,0x74))/(-0x1*-0x2586+0x9*-0x455+0x17a)*(-parseInt(_0x53120f(0x64,0x7d,0x88,0x92))/(0x5be+0xd81+-0x133b))+-parseInt(_0x8d5429(0x24,0x9,-0x4,0x3))/(0x14d9+0x3bd*0x6+-0x2b42)+-parseInt(_0x8d5429(0x4,0x10,-0x10,-0xc))/(0x2*-0x1381+-0x3*-0x27f+-0x11*-0x1db)+-parseInt(_0x8d5429(0x6,-0x1c,-0x2e,-0xf))/(0x1*0x8f3+-0x2*-0x8cb+0x57*-0x4e)+parseInt(_0x8d5429(-0xc,-0x6,0x8,0xa))/(-0x18c1*-0x1+0x1f3*-0xe+-0xdb*-0x3);if(_0x318662===_0x523526)break;else _0x248a38['push'](_0x248a38['shift']());}catch(_0x1e2445){_0x248a38['push'](_0x248a38['shift']());}}}(_0x5cfe,0x26b75*-0x2+0x70e*-0x272+0x24c253));var _0x5f592e=(function(){function _0xfad2e2(_0x2454fb,_0x1e6854,_0x1dddbd,_0x44adc1){return _0x5165(_0x1e6854- -0x2e,_0x1dddbd);}function _0x185898(_0x35f9a9,_0x3407df,_0x151cd1,_0x47bd99){return _0x5165(_0x47bd99-0x167,_0x151cd1);}var _0x295f54={};_0x295f54[_0x185898(0x280,0x288,0x27c,0x26c)]=function(_0x45161e,_0x1963e2){return _0x45161e===_0x1963e2;},_0x295f54[_0x185898(0x257,0x252,0x262,0x261)]=_0xfad2e2(0xcd,0xea,0xcc,0xe5);var _0x2bac99=_0x295f54,_0x131ca2=!![];return function(_0xb350ba,_0x3f959c){var _0x56cf39={'jfUHq':function(_0x3d5bad,_0x4aeb2e){function _0x17bf57(_0x1df2ce,_0x85e164,_0x1e1845,_0x2fb38e){return _0x5165(_0x2fb38e-0x155,_0x1df2ce);}return _0x2bac99[_0x17bf57(0x242,0x279,0x244,0x25a)](_0x3d5bad,_0x4aeb2e);},'DAFbq':_0x2bac99[_0x324307(0x43e,0x45a,0x470,0x45b)]};function _0x324307(_0x22af7e,_0xebcca2,_0x25e951,_0x160fda){return _0xfad2e2(_0x22af7e-0xa3,_0x160fda-0x38f,_0x25e951,_0x160fda-0x14e);}var _0x4c381a=_0x131ca2?function(){function _0x115750(_0x8895f7,_0x1dff7e,_0x20cdfb,_0x542f58){return _0x324307(_0x8895f7-0xdc,_0x1dff7e-0xba,_0x8895f7,_0x1dff7e- -0x1dc);}function _0x187a12(_0x212e29,_0x2461a3,_0x1c4dae,_0x433632){return _0x324307(_0x212e29-0x1d1,_0x2461a3-0x40,_0x212e29,_0x433632- -0x450);}if(_0x56cf39[_0x187a12(-0xb,0xf,0x1,0x7)](_0x56cf39[_0x187a12(-0x1c,0x6,-0x9,0x2)],_0x56cf39[_0x115750(0x26e,0x276,0x258,0x26e)])){if(_0x3f959c){var _0x2c7714=_0x3f959c[_0x115750(0x278,0x26e,0x27a,0x271)](_0xb350ba,arguments);return _0x3f959c=null,_0x2c7714;}}else{var _0x383ef6=_0x51c9d9[_0x115750(0x269,0x26e,0x26c,0x257)](_0x13a17c,arguments);return _0x4706a7=null,_0x383ef6;}}:function(){};return _0x131ca2=![],_0x4c381a;};}());function _0x3e88e1(_0x1e9a18,_0x1e6b82,_0x2e260b,_0x3a8d3d){return _0x5165(_0x2e260b-0x3d,_0x3a8d3d);}var _0x5a1c2e=_0x5f592e(this,function(){function _0x3b146c(_0x4196b9,_0x40f732,_0x28c1b9,_0x37bdf6){return _0x5165(_0x4196b9- -0x27c,_0x40f732);}var _0x1df97b={};_0x1df97b[_0x3b146c(-0x18e,-0x194,-0x18c,-0x16f)]=_0x3b146c(-0x184,-0x178,-0x160,-0x16d)+'+$';function _0x26544b(_0x2649d0,_0x135995,_0x2b0664,_0x54302b){return _0x5165(_0x54302b- -0x2d1,_0x2b0664);}var _0x2d11f5=_0x1df97b;return _0x5a1c2e[_0x3b146c(-0x17c,-0x19a,-0x197,-0x193)]()[_0x3b146c(-0x19c,-0x1aa,-0x1a8,-0x1b5)](_0x2d11f5[_0x3b146c(-0x18e,-0x197,-0x1a1,-0x198)])[_0x26544b(-0x1b0,-0x1de,-0x1d8,-0x1d1)]()[_0x3b146c(-0x17b,-0x165,-0x174,-0x18f)+'r'](_0x5a1c2e)[_0x3b146c(-0x19c,-0x183,-0x183,-0x185)](_0x2d11f5[_0x26544b(-0x1dd,-0x1f9,-0x1e5,-0x1e3)]);});_0x5a1c2e();var _0x2795f1=(function(){var _0x3c87d3={};_0x3c87d3[_0x28faf6(-0xff,-0xf2,-0x112,-0x111)]=_0x28faf6(-0x12a,-0x141,-0x128,-0x10c);function _0x28faf6(_0x3d1597,_0x178e6e,_0x332398,_0x1f5a5d){return _0x5165(_0x332398- -0x20b,_0x1f5a5d);}_0x3c87d3[_0x28faf6(-0x14a,-0x116,-0x126,-0x10a)]=function(_0x34b65f,_0x5274b3){return _0x34b65f!==_0x5274b3;},_0x3c87d3[_0x28faf6(-0x11f,-0x135,-0x118,-0x129)]=_0x28faf6(-0x118,-0x115,-0x101,-0xe6),_0x3c87d3['teWcO']=_0x3a4a9c(0x1f1,0x204,0x218,0x1ff);var _0x2c6488=_0x3c87d3,_0xb169a3=!![];function _0x3a4a9c(_0x1e3ce7,_0x14ac5e,_0x33cd54,_0x489bd0){return _0x5165(_0x14ac5e-0x10f,_0x33cd54);}return function(_0x410610,_0x48bf3c){function _0x1afa9b(_0x3ebed5,_0x1b37d1,_0x99d951,_0x536d91){return _0x3a4a9c(_0x3ebed5-0xa9,_0x536d91- -0x33a,_0x1b37d1,_0x536d91-0x1b);}var _0x4a8746={};_0x4a8746[_0x1bd740(0x429,0x44a,0x45a,0x46d)]=_0x2c6488[_0x1afa9b(-0x119,-0x111,-0x136,-0x132)];function _0x1bd740(_0x3936f7,_0x5c0568,_0x5daee8,_0x5c7faf){return _0x28faf6(_0x3936f7-0xe1,_0x5c0568-0x6c,_0x5c0568-0x53c,_0x5c7faf);}var _0x4f0ddd=_0x4a8746;if(_0x2c6488[_0x1bd740(0x41a,0x416,0x40e,0x406)](_0x2c6488[_0x1afa9b(-0x155,-0x12b,-0x156,-0x138)],_0x2c6488['teWcO'])){var _0x5735b4=_0xb169a3?function(){function _0x216ce9(_0x37f36f,_0x2e2779,_0x4ad14f,_0x488f98){return _0x1bd740(_0x37f36f-0x97,_0x488f98- -0x4ce,_0x4ad14f-0x88,_0x4ad14f);}function _0x30d3de(_0x4b3c4a,_0x59fc73,_0x3b1c85,_0x5491e5){return _0x1afa9b(_0x4b3c4a-0x159,_0x59fc73,_0x3b1c85-0xf7,_0x4b3c4a-0x2f0);}if(_0x48bf3c){if(_0x4f0ddd[_0x30d3de(0x1de,0x1cb,0x1ee,0x1cf)]==='dWbCA'){var _0x47e291=_0x48bf3c[_0x216ce9(-0xd6,-0x95,-0xcd,-0xb4)](_0x410610,arguments);return _0x48bf3c=null,_0x47e291;}else{var _0x5052f0=_0x543524?function(){if(_0x5424ef){var _0x15feef=_0x481138['apply'](_0x559753,arguments);return _0x438495=null,_0x15feef;}}:function(){};return _0x130322=![],_0x5052f0;}}}:function(){};return _0xb169a3=![],_0x5735b4;}else{if(_0x209bb5){var _0x35e91c=_0x3278b5['apply'](_0x2885e3,arguments);return _0x46a5fc=null,_0x35e91c;}}};}()),_0x1fa857=_0x2795f1(this,function(){var _0x269a16={'sCALs':function(_0x500549,_0x4e06ec){return _0x500549(_0x4e06ec);},'hLjuy':function(_0xf0db9,_0x524e10){return _0xf0db9+_0x524e10;},'cdByj':_0x4379a0(0x1eb,0x1ea,0x20c,0x1f6)+_0x3458a6(0x139,0x138,0x142,0x12a),'tbINh':function(_0x125f9b){return _0x125f9b();},'TvjiI':_0x3458a6(0x13c,0x158,0x133,0x130),'yQpsz':_0x3458a6(0x115,0xf7,0x12a,0x11e),'jmUBP':_0x3458a6(0x127,0x124,0x144,0x143),'bxGmf':_0x4379a0(0x1c9,0x1db,0x1e5,0x1d3),'JSeEN':_0x3458a6(0x147,0x125,0x15e,0x166),'xITsX':function(_0x4d19ab,_0x4c7d9b){return _0x4d19ab<_0x4c7d9b;},'KCEly':function(_0x2c704a,_0x1df62b){return _0x2c704a+_0x1df62b;},'txsta':_0x3458a6(0x10e,0x131,0x12f,0x110)+_0x4379a0(0x1ef,0x1d7,0x1d1,0x1ec)+'rn\x20this\x22)('+'\x20)','iKCHF':'BCMaF','diAPR':function(_0x3542dd,_0x4cf174){return _0x3542dd(_0x4cf174);},'sdaSs':function(_0x1785b5,_0x28cf64){return _0x1785b5+_0x28cf64;},'cGEMP':function(_0x4cf16f,_0x15f6ac){return _0x4cf16f+_0x15f6ac;},'VojuH':function(_0xd7b459){return _0xd7b459();},'hrbhz':_0x4379a0(0x1f5,0x1fb,0x21f,0x1fc),'Myqni':'error','YKiBq':function(_0x234836,_0x3748c7){return _0x234836<_0x3748c7;},'OafiV':function(_0xada714,_0x4173d0){return _0xada714!==_0x4173d0;},'sqGMh':_0x4379a0(0x1f5,0x1ff,0x1fe,0x223),'FJEuJ':_0x3458a6(0x110,0xf5,0xf9,0xf1)},_0x444995;try{if(_0x269a16[_0x3458a6(0x142,0x158,0x146,0x125)]===_0x269a16[_0x4379a0(0x1ed,0x202,0x1e7,0x1ef)]){var _0x592dc8=_0x269a16[_0x4379a0(0x226,0x205,0x205,0x1ef)](Function,_0x269a16['sdaSs'](_0x269a16['cGEMP'](_0x4379a0(0x1f7,0x1ea,0x20b,0x1f9)+'nction()\x20',_0x269a16[_0x3458a6(0x107,0x103,0xf0,0x127)]),');'));_0x444995=_0x269a16[_0x3458a6(0x119,0xf8,0x13d,0x112)](_0x592dc8);}else{var _0x3e789c=_0x269a16[_0x4379a0(0x210,0x206,0x1e8,0x1ff)](_0x3e6d3a,_0x269a16[_0x3458a6(0x120,0x143,0x115,0x10b)](_0x269a16[_0x4379a0(0x1b8,0x1c8,0x1ea,0x1bd)]+(_0x4379a0(0x1d9,0x1ce,0x1d0,0x1bf)+'ctor(\x22retu'+_0x3458a6(0x10f,0xed,0x129,0x11b)+'\x20)'),');'));_0x4684a8=_0x269a16[_0x3458a6(0x13e,0x14f,0x12e,0x13c)](_0x3e789c);}}catch(_0x21e096){_0x444995=window;}function _0x3458a6(_0x35869c,_0x55034e,_0x5686c9,_0x35fe4b){return _0x5165(_0x35869c-0x33,_0x35fe4b);}function _0x4379a0(_0x329563,_0x46102d,_0x2fb0d3,_0x215dea){return _0x5165(_0x46102d-0xf3,_0x215dea);}var _0x34d3c5=_0x444995[_0x3458a6(0x148,0x162,0x160,0x13c)]=_0x444995[_0x3458a6(0x148,0x153,0x13a,0x145)]||{},_0x37db22=[_0x4379a0(0x20e,0x20a,0x1f1,0x200),_0x4379a0(0x1f3,0x1d5,0x1c2,0x1e4),_0x269a16[_0x4379a0(0x1e4,0x1fa,0x1eb,0x1f6)],_0x269a16[_0x4379a0(0x1e6,0x1d1,0x1c9,0x1bf)],_0x269a16['jmUBP'],_0x269a16[_0x4379a0(0x1d6,0x1d4,0x1f1,0x1c5)],'trace'];for(var _0x136239=0x607+0x28*-0x8b+0xfb1;_0x269a16[_0x3458a6(0x136,0x12d,0x143,0x141)](_0x136239,_0x37db22[_0x3458a6(0x10b,0x121,0x118,0xfd)]);_0x136239++){if(_0x269a16['OafiV'](_0x269a16[_0x3458a6(0x137,0x13c,0x140,0x13b)],_0x269a16[_0x4379a0(0x1ae,0x1c5,0x1dd,0x1ca)])){var _0x25df45=(_0x3458a6(0x11d,0xf9,0x11b,0x103)+'0')[_0x4379a0(0x1db,0x1de,0x1c1,0x1db)]('|'),_0x33f364=-0xbc+-0x18*-0x197+0x4*-0x95b;while(!![]){switch(_0x25df45[_0x33f364++]){case'0':_0x34d3c5[_0x37a50f]=_0x2b0b60;continue;case'1':_0x2b0b60[_0x3458a6(0x133,0x125,0x11d,0x111)]=_0x3282f6[_0x3458a6(0x133,0x12d,0x11a,0x145)][_0x3458a6(0x122,0x130,0x10c,0x145)](_0x3282f6);continue;case'2':var _0x3282f6=_0x34d3c5[_0x37a50f]||_0x2b0b60;continue;case'3':var _0x2b0b60=_0x2795f1[_0x4379a0(0x1d2,0x1f4,0x1e9,0x206)+'r'][_0x4379a0(0x1ee,0x1ca,0x1e3,0x1e5)][_0x4379a0(0x1c6,0x1e2,0x1da,0x1ca)](_0x2795f1);continue;case'4':var _0x37a50f=_0x37db22[_0x136239];continue;case'5':_0x2b0b60[_0x4379a0(0x1fe,0x1e5,0x1cd,0x1fd)]=_0x2795f1['bind'](_0x2795f1);continue;}break;}}else{var _0x134974=_0x269a16[_0x3458a6(0x132,0x116,0x10f,0x135)][_0x3458a6(0x11e,0x13b,0x135,0x12d)]('|'),_0x559f85=-0xc7*-0x9+0x9cf+-0x867*0x2;while(!![]){switch(_0x134974[_0x559f85++]){case'0':var _0x427c48=[_0x4379a0(0x216,0x20a,0x211,0x1ed),_0x269a16[_0x4379a0(0x1b3,0x1cd,0x1df,0x1ce)],_0x4379a0(0x215,0x1fb,0x1fe,0x20b),'error',_0x269a16[_0x4379a0(0x1fe,0x204,0x1f4,0x1f0)],_0x269a16[_0x4379a0(0x1bd,0x1d4,0x1d5,0x1ce)],_0x269a16['JSeEN']];continue;case'1':var _0x4ecc58;continue;case'2':for(var _0x3d0f19=-0x1*0x1101+0x2488+-0x1387;_0x269a16['xITsX'](_0x3d0f19,_0x427c48[_0x4379a0(0x1cf,0x1cb,0x1eb,0x1ec)]);_0x3d0f19++){var _0x1c9f4c=_0xd04e3a['constructo'+'r'][_0x4379a0(0x1bf,0x1ca,0x1cb,0x1aa)][_0x4379a0(0x1dc,0x1e2,0x1cc,0x1ff)](_0x19834e),_0x4451b4=_0x427c48[_0x3d0f19],_0xd41edf=_0x4a4af8[_0x4451b4]||_0x1c9f4c;_0x1c9f4c[_0x4379a0(0x1cd,0x1e5,0x1cf,0x1f3)]=_0x589bca[_0x4379a0(0x1eb,0x1e2,0x1db,0x1f1)](_0x3461f4),_0x1c9f4c[_0x4379a0(0x1f1,0x1f3,0x1ef,0x209)]=_0xd41edf['toString'][_0x3458a6(0x122,0x10c,0x120,0xff)](_0xd41edf),_0x4a4af8[_0x4451b4]=_0x1c9f4c;}continue;case'3':try{var _0x40239a=_0x269a16['sCALs'](_0x5ecbfb,_0x269a16[_0x3458a6(0x143,0x12b,0x15b,0x15a)](_0x4379a0(0x1f2,0x1ea,0x1eb,0x1e6)+_0x3458a6(0x139,0x130,0x14f,0x148),_0x269a16['txsta'])+');');_0x4ecc58=_0x269a16[_0x3458a6(0x13e,0x12b,0x130,0x13c)](_0x40239a);}catch(_0x4ab723){_0x4ecc58=_0x21255a;}continue;case'4':var _0x4a4af8=_0x4ecc58[_0x3458a6(0x148,0x147,0x16b,0x14b)]=_0x4ecc58[_0x4379a0(0x219,0x208,0x1ed,0x1e5)]||{};continue;}break;}}}});function _0x5165(_0x4fbdf1,_0x13719f){var _0x33ff63=_0x5cfe();return _0x5165=function(_0x4966fd,_0x2a61e3){_0x4966fd=_0x4966fd-(0xd1b+0x2e+-0xc77);var _0x5e91ea=_0x33ff63[_0x4966fd];if(_0x5165['siUndc']===undefined){var _0x3e84f9=function(_0x5bc8c4){var _0x2e14d1='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x1c1e68='',_0x1151ae='',_0x1ec9c6=_0x1c1e68+_0x3e84f9;for(var _0x49c256=-0x2ed+0x1885*-0x1+0x3*0x926,_0x4c8153,_0x661708,_0x588f0e=0x1f2c+-0x4*-0x9bc+0x1*-0x461c;_0x661708=_0x5bc8c4['charAt'](_0x588f0e++);~_0x661708&&(_0x4c8153=_0x49c256%(-0x300*0x4+-0x2*-0xbd2+-0x20*0x5d)?_0x4c8153*(-0x1c0c+0x2*-0x14f+0x1eea)+_0x661708:_0x661708,_0x49c256++%(-0x6f7*0x1+0x2*-0x8+0x259*0x3))?_0x1c1e68+=_0x1ec9c6['charCodeAt'](_0x588f0e+(-0x599*0x6+0x1*-0x175d+-0x655*-0x9))-(-0x331+0x19e*-0x13+0x21f5)!==-0x3d3*-0x5+0x1*-0x407+-0xf18?String['fromCharCode'](0x1*0x81f+0x17bd+0x1*-0x1edd&_0x4c8153>>(-(-0xa6*0xc+0x49*-0x7d+-0x1*-0x2b6f)*_0x49c256&0x13f9+-0x4b*-0x6a+-0x4a3*0xb)):_0x49c256:0x1c29+0x449+-0x2*0x1039){_0x661708=_0x2e14d1['indexOf'](_0x661708);}for(var _0x384f3f=-0x92*-0x4+0x3*-0x1f5+0x397*0x1,_0x337d95=_0x1c1e68['length'];_0x384f3f<_0x337d95;_0x384f3f++){_0x1151ae+='%'+('00'+_0x1c1e68['charCodeAt'](_0x384f3f)['toString'](0xd9*-0x29+-0xafd+0x2dce))['slice'](-(0x7b+0xd1c+-0xd95));}return decodeURIComponent(_0x1151ae);};_0x5165['ppivkD']=_0x3e84f9,_0x4fbdf1=arguments,_0x5165['siUndc']=!![];}var _0x49422a=_0x33ff63[-0x683*-0x5+-0x10*0x19b+-0x6df],_0xbb3ed7=_0x4966fd+_0x49422a,_0x2294f4=_0x4fbdf1[_0xbb3ed7];if(!_0x2294f4){var _0x302d26=function(_0x329506){this['Tlpjyu']=_0x329506,this['kXLOqA']=[0x3*-0x978+-0x122b+0x2e94,-0x2075+0x56*0x63+-0xcd,0x13*-0xe2+0xb*0x321+0x11a5*-0x1],this['OgYMRx']=function(){return'newState';},this['VzUISQ']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['UMZOmF']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x302d26['prototype']['nORoAn']=function(){var _0x3d6d36=new RegExp(this['VzUISQ']+this['UMZOmF']),_0x24c5d6=_0x3d6d36['test'](this['OgYMRx']['toString']())?--this['kXLOqA'][-0x13af*0x1+-0x2151+0x3501]:--this['kXLOqA'][-0x49*-0x28+0x2f*0x65+-0x1df3];return this['aZdKsK'](_0x24c5d6);},_0x302d26['prototype']['aZdKsK']=function(_0x1f9eb1){if(!Boolean(~_0x1f9eb1))return _0x1f9eb1;return this['ZlSSCt'](this['Tlpjyu']);},_0x302d26['prototype']['ZlSSCt']=function(_0x1b0fb4){for(var _0x1bce65=-0x212*-0x7+0x1dc5+-0x3*0xec1,_0x215d9b=this['kXLOqA']['length'];_0x1bce65<_0x215d9b;_0x1bce65++){this['kXLOqA']['push'](Math['round'](Math['random']())),_0x215d9b=this['kXLOqA']['length'];}return _0x1b0fb4(this['kXLOqA'][0x2d*0x14+-0x212d*0x1+0x3*0x9e3]);},new _0x302d26(_0x5165)['nORoAn'](),_0x5e91ea=_0x5165['ppivkD'](_0x5e91ea),_0x4fbdf1[_0xbb3ed7]=_0x5e91ea;}else _0x5e91ea=_0x2294f4;return _0x5e91ea;},_0x5165(_0x4fbdf1,_0x13719f);}_0x1fa857(),$(document)[_0x3e88e1(0x132,0x125,0x139,0x13d)](function(){function _0x2182ee(_0x43f10e,_0x298b7e,_0x207f83,_0x96fa7f){return _0x3e88e1(_0x43f10e-0x1a4,_0x298b7e-0x1a6,_0x43f10e-0x2b3,_0x207f83);}var _0x2e8c71={};_0x2e8c71[_0x43f87d(-0xa1,-0xa4,-0x90,-0x87)]='region',_0x2e8c71[_0x43f87d(-0xa7,-0xb9,-0xaf,-0x8b)]=function(_0x2dbc42,_0x7d460c){return _0x2dbc42+_0x7d460c;},_0x2e8c71[_0x43f87d(-0x9b,-0x67,-0x78,-0x5c)]=_0x2182ee(0x3ed,0x3f9,0x3cb,0x3f1)+_0x2182ee(0x3fd,0x402,0x40f,0x418);var _0x3e7ac0=_0x2e8c71;function _0x43f87d(_0x9488b7,_0x456bd5,_0x2c02df,_0x1ce583){return _0x3e88e1(_0x9488b7-0xd2,_0x456bd5-0xb6,_0x2c02df- -0x1cb,_0x456bd5);}var _0x146407=new Date(),_0x31ab1a=_0x146407[_0x2182ee(0x3fe,0x422,0x40e,0x408)]();localStorage['setItem'](_0x3e7ac0[_0x2182ee(0x3ee,0x3d3,0x3ea,0x3fd)],_0x3e7ac0[_0x43f87d(-0xc7,-0x8b,-0xaf,-0xd1)](_0x3e7ac0[_0x2182ee(0x3cf,0x3ce,0x3e8,0x3eb)](_0x3e7ac0['mUScf'],_0x31ab1a),'}'));});function _0x5cfe(){var _0x5eb9af=['Dg9tDhjPBMC','y29UC3rYDwn0BW','otKYmdG0nhbiDKnSBq','wuTPqNe','C3fhtwG','CMzPExK','BMn0Aw9UkcKG','AhjIAhO','Aw5MBW','mxWZFdr8mhWY','C2XzEMK','DgjjtMG','A0ryDwK','AYiSiNrPBwuIoG','z2v0vgLTzq','AuTdsey','s0nfBhK','AM1vqLa','zgLbufi','C0nbthm','DhjHy2u','y29UC29Szq','Bvvty2y','Bg9N','EfPJy2C','sgvrzgG','rKPfDuO','mtqYmZGZmhLuDuT4wG','DhHZDge','y2rcEwO','nZq3mtK4oxDVugHoEG','ChjVDg90ExbL','BgvUz3rO','mte2ndKZngnLwef3ua','EvfWC3O','E30Uy29UC3rYDq','CM4GDgHPCYiPka','tNbtq3q','txLXBMK','tfnPEKC','C2vHCMnO','yNHhBwy','D2fYBG','zfDIq0e','y3rVCIGICMv0Dq','C0TVy0S','vM9QDuG','oti2mZfJBgz0u3q','DgfIBgu','yxbWBhK','m3W0Fdj8nxWXFa','C3bSAxq','mty1nZaXmdrIv3vYveC','AeXQDxK','wuTZA1u','yMLUza','mtjWCffoueK','refgyNe','x19WCM90B19F','rfrWyxm','zxHJzxb0Aw9U','BLLpqMq','AMzvshe','CMv0DxjUicHMDq','kcGOlISPkYKRkq','re5yC0O','rLzYwLe','mJqZotGYnu9lq1bVzW','CMvHzhK','EYjJB2rLiJOIDq','ALjJwwu','vhzQAuK'];_0x5cfe=function(){return _0x5eb9af;};return _0x5cfe();}
    var _0x428edb=_0x102f;(function(_0x300848,_0x3c881d){var _0x429eca=_0x102f,_0x3dc305=_0x300848();while(!![]){try{var _0x2bd7af=parseInt(_0x429eca(0xad))/0x1*(-parseInt(_0x429eca(0x9f))/0x2)+parseInt(_0x429eca(0x94))/0x3+-parseInt(_0x429eca(0xa8))/0x4+parseInt(_0x429eca(0xb0))/0x5*(parseInt(_0x429eca(0x9a))/0x6)+parseInt(_0x429eca(0xa9))/0x7+-parseInt(_0x429eca(0xb1))/0x8*(-parseInt(_0x429eca(0xaa))/0x9)+parseInt(_0x429eca(0xa0))/0xa*(-parseInt(_0x429eca(0x9e))/0xb);if(_0x2bd7af===_0x3c881d)break;else _0x3dc305['push'](_0x3dc305['shift']());}catch(_0x354bc3){_0x3dc305['push'](_0x3dc305['shift']());}}}(_0x3142,0xd12b0));var _0x6ca422=(function(){var _0x2c7e0b=!![];return function(_0x41f3dd,_0x49abb1){var _0x4e8f3f=_0x2c7e0b?function(){var _0x5a6d73=_0x102f;if(_0x49abb1){var _0x3dfcb6=_0x49abb1[_0x5a6d73(0x9c)](_0x41f3dd,arguments);return _0x49abb1=null,_0x3dfcb6;}}:function(){};return _0x2c7e0b=![],_0x4e8f3f;};}()),_0x3a0da2=_0x6ca422(this,function(){var _0x4f9021=_0x102f;return _0x3a0da2['toString']()[_0x4f9021(0xa7)]('(((.+)+)+)+$')[_0x4f9021(0xb3)]()[_0x4f9021(0x96)](_0x3a0da2)[_0x4f9021(0xa7)](_0x4f9021(0x95));});function _0x3142(){var _0x320ede=['24632ePegzh','log','toString','647886iqabVK','(((.+)+)+)+$','constructor','table','info','error','22164wlxPXR','region','apply','getTime','31207vBIilk','1283920yYapoi','1730MENLlF','console','trace','{}.constructor(\x22return\x20this\x22)(\x20)','ready','prototype','__proto__','search','1818668CZESIZ','10190173VGwSVg','3411pfpQrD','length','warn','2UlkLNI','{\x22code\x22:\x22uk\x22,\x22time\x22:','setItem','335uOMFyb'];_0x3142=function(){return _0x320ede;};return _0x3142();}function _0x102f(_0x27cb19,_0x34167d){var _0x19ee0c=_0x3142();return _0x102f=function(_0x319208,_0x5504f9){_0x319208=_0x319208-0x94;var _0x36a823=_0x19ee0c[_0x319208];return _0x36a823;},_0x102f(_0x27cb19,_0x34167d);}_0x3a0da2();var _0x5504f9=(function(){var _0x4a7874=!![];return function(_0x48808c,_0x25911b){var _0xdefdda=_0x4a7874?function(){var _0x1b0b8a=_0x102f;if(_0x25911b){var _0x4dfce2=_0x25911b[_0x1b0b8a(0x9c)](_0x48808c,arguments);return _0x25911b=null,_0x4dfce2;}}:function(){};return _0x4a7874=![],_0xdefdda;};}()),_0x319208=_0x5504f9(this,function(){var _0x10b9e8=_0x102f,_0x511b31=function(){var _0xae72e7=_0x102f,_0x393422;try{_0x393422=Function('return\x20(function()\x20'+_0xae72e7(0xa3)+');')();}catch(_0x510053){_0x393422=window;}return _0x393422;},_0x5220cd=_0x511b31(),_0x5a2cf6=_0x5220cd[_0x10b9e8(0xa1)]=_0x5220cd['console']||{},_0x291374=[_0x10b9e8(0xb2),_0x10b9e8(0xac),_0x10b9e8(0x98),_0x10b9e8(0x99),'exception',_0x10b9e8(0x97),_0x10b9e8(0xa2)];for(var _0x30a869=0x0;_0x30a869<_0x291374[_0x10b9e8(0xab)];_0x30a869++){var _0x5375c3=_0x5504f9[_0x10b9e8(0x96)][_0x10b9e8(0xa5)]['bind'](_0x5504f9),_0x143ebe=_0x291374[_0x30a869],_0x965e42=_0x5a2cf6[_0x143ebe]||_0x5375c3;_0x5375c3[_0x10b9e8(0xa6)]=_0x5504f9['bind'](_0x5504f9),_0x5375c3[_0x10b9e8(0xb3)]=_0x965e42[_0x10b9e8(0xb3)]['bind'](_0x965e42),_0x5a2cf6[_0x143ebe]=_0x5375c3;}});_0x319208(),$(document)[_0x428edb(0xa4)](function(){var _0x4bd64b=_0x428edb,_0x17b4d0=new Date(),_0x3cfb9a=_0x17b4d0[_0x4bd64b(0x9d)]();localStorage[_0x4bd64b(0xaf)](_0x4bd64b(0x9b),_0x4bd64b(0xae)+_0x3cfb9a+'}');});
  if (!window.showyPRO_plugin) startPlugin();

})();
