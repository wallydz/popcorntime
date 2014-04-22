(function(App) {
    "use strict";
        

    var MovieDetail = Backbone.Marionette.ItemView.extend({
        template: '#movie-detail-tpl',
        className: 'app-overlay',


        events: {
            'click .movie-btn-watch': 'startStreaming',
            'click .movie-detail-close': 'closeDetails',
            'click #switch-hd-on': 'enableHD',
            'click #switch-hd-off': 'disableHD'
        },

        onShow: function() {
            console.log('Show movie detail', this.model);

            var torrents = this.model.get('torrents');

            if(torrents['720p'] !== undefined && torrents['1080p'] !== undefined) {
            
            var torrentUrl = torrents['1080p'].url;
            this.model.set('quality', torrents['1080p'].url);

            }
            else if(torrents['1080p'] !== undefined ) {
            
            var torrentUrl = torrents['1080p'].url;
            this.model.set('quality', torrents['1080p'].url);

            }   else if(torrents['720p'] !== undefined ) {
            
            var torrentUrl = torrents['720p'].url;
            this.model.set('quality', torrents['720p'].url);

            }
            console.logger.debug(this.model.get('quality'));
        },

        onClose: function() {},
        showCover: function() {},

        startStreaming: function() {
            //var torrents = this.model.get('torrents');
            //var torrentUrl = torrents['720p'].url;
            console.logger.log(this.model.get('quality'));
            var torrentStart = new Backbone.Model({torrent: this.model.get('quality'), backdrop: this.model.get('backdrop')});

            App.vent.trigger('stream:start', torrentStart);
        },

        closeDetails: function() {
			App.vent.trigger('movie:closeDetail'); 	
        },

        enableHD: function () {

        var torrents = this.model.get('torrents');
        console.logger.debug('HD Enabled');


        if(torrents['1080p'] !== undefined) {
            var torrents = this.model.get('torrents');
            var torrentUrl = torrents['1080p'].url;
            this.model.set('quality', torrents['1080p'].url);
            console.logger.debug(this.model.get('quality'));
        }
        },

        disableHD: function () {

        var torrents = this.model.get('torrents');
        console.logger.debug('HD Disabled');
        console.logger.log(torrents['720p']);

        if(torrents['720p'] !== undefined) {
            var torrents = this.model.get('torrents');
             this.model.set('quality', torrents['720p'].url);
             console.logger.debug(this.model.get('quality'));
        }

        }

    });

    App.View.MovieDetail = MovieDetail;
})(window.App);