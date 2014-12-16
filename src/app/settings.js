var Q = require('q'),
	os = require('os'),
	path = require('path'),
	_ = require('underscore'),
	data_path = require('nw.gui').App.dataPath;

/** Default settings **/
var Settings = {};

// User interface
Settings.language = 'en';
Settings.coversShowRating = false;
Settings.watchedCovers = 'fade';
Settings.showAdvancedSettings = false;

Settings.postersMinWidth = 134;
Settings.postersMaxWidth = 294;
Settings.postersMinFontSize = 0.8;
Settings.postersMaxFontSize = 1.3;
Settings.postersSizeRatio = (196 / 134);
Settings.postersWidth = Settings.postersMinWidth;
Settings.postersJump = [134, 154, 174, 194, 214, 234, 254, 274, 294];

//Playback

Settings.playNextEpisodeAuto = true;

// Advanced UI
Settings.alwaysOnTop = false;
Settings.theme = 'Official_-_Dark_theme';
Settings.ratingStars = true; //trigger on click in details
Settings.startScreen = 'Movies';
Settings.lastTab = '';

// Movies
Settings.moviesShowQuality = false;
Settings.movies_quality = 'all';

// Subtitles
Settings.subtitle_language = 'none';
Settings.subtitle_size = '28px';
Settings.subtitle_color = '#ffffff';
Settings.subtitle_shadows = 'true';

// More options
Settings.httpApiPort = 8008;
Settings.httpApiUsername = 'popcorn';
Settings.httpApiPassword = 'popcorn';

// User settings (not set here, just init'd)
Settings.traktUsername = '';
Settings.traktPassword = '';
Settings.traktTvVersion = '0.0.2';
Settings.syncOnStart = false;

// Advanced options
Settings.connectionLimit = 100;
Settings.dhtLimit = 500;
Settings.streamPort = 0; // 0 = Random
Settings.tmpLocation = path.join(os.tmpDir(), 'Popcorn-Time');
Settings.databaseLocation = path.join(data_path, 'data');
Settings.deleteTmpOnClose = true;

Settings.vpn = false;
Settings.vpnUsername = false;
Settings.vpnPassword = false;

Settings.tvshowAPI = {
	url: 'http://api.popcorntime.io/',
	ssl: false,
	fingerprint: /"status":"online"/,
	fallbacks: [{
		url: 'http://eztvapi.re/',
		ssl: false,
		fingerprint: /"status":"online"/
	}]
};

Settings.updateEndpoint = {
	url: 'https://popcorntime.io/',
	fingerprint: '32:74:8E:CC:19:3C:94:6A:4E:F8:EA:39:97:69:1C:0D:A8:69:D2:9D',
	fallbacks: []
};

Settings.ytsAPI = {
	url: 'https://yts.re/api/',
	fingerprint: 'D4:7B:8A:2A:7B:E1:AA:40:C5:7E:53:DB:1B:0F:4F:6A:0B:AA:2C:6C',
	fallbacks: [{
		url: 'https://yts.pm/api/',
		fingerprint: 'B6:0A:11:A8:74:48:EB:B4:9A:9C:79:1A:DA:FA:72:BF:F8:8B:0A:B3'
	}, {
		url: 'http://yts.wf/api/',
		ssl: false,
		fingerprint: /YTS - The Official Home of YIFY Movie Torrent Downloads/
	}, {
		url: 'https://yts.io/api/',
		fingerprint: '27:96:21:06:E3:2F:5D:3D:7D:46:13:EF:42:5B:AD:5E:C8:FD:DA:45'
	}, {
		url: 'http://proxy.piratenpartij.nl/yts.re/api/',
		ssl: false,
		fingerprint: /Piratenpartij.nl Proxy/
	}, {
		url: 'https://yts-proxy.net/api/',
		fingerprint: '8E:49:5B:A9:2E:F1:AE:E8:A2:BB:E2:77:E9:C3:BC:D4:5D:4B:66:1F'
	}, { // .wf is listed last due to lack of ECDSA support in nw0.9.2
		url: 'https://yts.wf/api/',
		fingerprint: '77:44:AC:40:4A:B8:A6:83:06:37:5C:56:16:B4:2C:30:B9:75:99:94'
	}, { // .im is listed last due to lack of ECDSA support in nw0.9.2
		url: 'https://yts.im/api/',
		fingerprint: 'AF:67:49:6C:D5:6A:28:0D:BA:36:C0:12:7D:D9:6E:A7:10:3F:99:14'
	}]
};

// App Settings
Settings.version = false;
Settings.dbversion = '0.1.0';
Settings.font = 'tahoma';
Settings.defaultWidth = Math.round(window.screen.availWidth * 0.8);
Settings.defaultHeight = Math.round(window.screen.availHeight * 0.8);

// Miscellaneous

Settings.tv_detail_jump_to = 'next';


var ScreenResolution = {
	get SD() {
		return window.screen.width < 1280 || window.screen.height < 720;
	},
	get HD() {
		return window.screen.width >= 1280 && window.screen.width < 1920 || window.screen.height >= 720 && window.screen.height < 1080;
	},
	get FullHD() {
		return window.screen.width >= 1920 && window.screen.width < 2000 || window.screen.height >= 1080 && window.screen.height < 1600;
	},
	get UltraHD() {
		return window.screen.width >= 2000 || window.screen.height >= 1600;
	},
	get QuadHD() {
		return window.screen.width >= 3000 || window.screen.height >= 1800;
	},
	get Standard() {
		return window.devicePixelRatio <= 1;
	},
	get Retina() {
		return window.devicePixelRatio > 1;
	}
};

var AdvSettings = {

	get: function (variable) {
		if (typeof Settings[variable] !== 'undefined') {
			return Settings[variable];
		}

		return false;
	},

	set: function (variable, newValue) {
		Database.writeSetting({
				key: variable,
				value: newValue
			})
			.then(function () {
				Settings[variable] = newValue;
			});
	},

	setup: function () {
		AdvSettings.performUpgrade();
		return AdvSettings.getHardwareInfo();
	},

	getHardwareInfo: function () {
		if (/64/.test(process.arch)) {
			AdvSettings.set('arch', 'x64');
		} else {
			AdvSettings.set('arch', 'x86');
		}

		switch (process.platform) {
		case 'darwin':
			AdvSettings.set('os', 'mac');
			break;
		case 'win32':
			AdvSettings.set('os', 'windows');
			break;
		case 'linux':
			AdvSettings.set('os', 'linux');
			break;
		default:
			AdvSettings.set('os', 'unknown');
			break;
		}

		return Q();
	},

	checkApiEndpoints: function (endpoints) {
		return Q.all(_.map(endpoints, function (endpoint) {
			return AdvSettings.checkApiEndpoint(endpoint);
		}));
	},

	checkApiEndpoint: function (endpoint, defer) {
		var tls = require('tls'),
			http = require('http'),
			uri = require('url');

		defer = defer || Q.defer();

		if (endpoint.skip) {
			win.debug('Skipping endpoint check for %s', endpoint.url);
			return Q();
		}

		var url = uri.parse(endpoint.url);
		win.debug('Checking %s endpoint', url.hostname);

		if (endpoint.ssl === false) {
			http.get({
				hostname: url.hostname,
				port: url.port || 80,
				agent: false
			}, function (res) {
				res.on('data', function (body) {
					res.removeAllListeners('data');
					// Doesn't match the expected response
					if (!_.isRegExp(endpoint.fingerprint) || !endpoint.fingerprint.test(body.toString('utf8'))) {
						win.warn('[%s] Endpoint fingerprint %s does not match %s',
							url.hostname,
							endpoint.fingerprint,
							body.toString('utf8'));
						if (endpoint.fallbacks.length) {
							var fallback = endpoint.fallbacks.shift();
							endpoint.ssl = undefined;
							_.extend(endpoint, fallback);

							AdvSettings.checkApiEndpoint(endpoint, defer);
							return;
						} else {
							// TODO: should reject here!
						}
					}

					defer.resolve();
				});
			}).setTimeout(5000);
		} else {
			tls.connect(url.port || 443, url.hostname, {
				servername: url.hostname,
				rejectUnauthorized: false
			}, function () {
				this.setTimeout(0);
				this.removeAllListeners('error');
				if (!this.authorized ||
					this.authorizationError ||
					this.getPeerCertificate().fingerprint !== endpoint.fingerprint) {
					// "These are not the certificates you're looking for..."
					// Seems like they even got a certificate signed for us :O
					win.warn('[%s] Endpoint fingerprint %s does not match %s',
						url.hostname,
						endpoint.fingerprint,
						this.getPeerCertificate().fingerprint);
					if (endpoint.fallbacks.length) {
						var fallback = endpoint.fallbacks.shift();
						endpoint.ssl = undefined;
						_.extend(endpoint, fallback);

						AdvSettings.checkApiEndpoint(endpoint, defer);
					} else {
						defer.resolve();
					}
				} else {
					defer.resolve();
				}
				this.end();
			}).on('error', function (err) {
				this.setTimeout(0);
				// No SSL support. That's convincing >.<
				win.warn('[%s] Endpoint does not support SSL, failing',
					url.hostname);
				if (endpoint.fallbacks.length) {
					var fallback = endpoint.fallbacks.shift();
					endpoint.ssl = undefined;
					_.extend(endpoint, fallback);

					AdvSettings.checkApiEndpoint(endpoint, defer);
				} else {
					// TODO: Should probably reject here
					defer.resolve();
				}
				this.end();
			}).on('timeout', function () {
				this.removeAllListeners('error');
				// Connection timed out, we'll say its not available
				win.warn('[%s] Endpoint timed out, failing',
					url.hostname);
				if (endpoint.fallbacks.length) {
					var fallback = endpoint.fallbacks.shift();
					endpoint.ssl = undefined;
					_.extend(endpoint, fallback);

					AdvSettings.checkApiEndpoint(endpoint, defer);
				} else {
					// TODO: Should probably reject here
					defer.resolve();
				}
				this.end();
			}).setTimeout(5000); // Set 5 second timeout
		}

		return defer.promise;
	},

	performUpgrade: function () {
		// This gives the official version (the package.json one)
		gui = require('nw.gui');
		var currentVersion = gui.App.manifest.version;

		if (currentVersion !== AdvSettings.get('version')) {
			// Nuke the DB if there's a newer version
			// Todo: Make this nicer so we don't lose all the cached data
			var cacheDb = openDatabase('cachedb', '', 'Cache database', 50 * 1024 * 1024);

			cacheDb.transaction(function (tx) {
				tx.executeSql('DELETE FROM subtitle');
				tx.executeSql('DELETE FROM metadata');
			});

			// Add an upgrade flag
			window.__isUpgradeInstall = true;
		}
		AdvSettings.set('version', currentVersion);
		AdvSettings.set('releaseName', gui.App.manifest.releaseName);
	},
};
