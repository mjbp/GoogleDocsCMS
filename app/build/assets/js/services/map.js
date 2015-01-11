/*global angular, google, console, InfoBox*/
'use strict';

var module = angular.module('map', []);

module.factory('Map', ['$q', '$window', function($q, $window) {
    var self = this,
		zoom,
		locations,
		person,
		trigger,
		boundary;
	
	this.config = {
		styles : [
			{stylers: [{visibility: "on"}, {saturation: -100, hue: '#ff0000' }]},
			{featureType: "road.local", stylers: [{ visibility: "simplified" }]},
			{featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }]},
			{featureType: "landscape.man_made", stylers: [{ visibility: "on" }]},
			{featureType: "transit", stylers: [{ visibility: "om" }]}
		],
		stylesZoomed : [
			{stylers: [{ visibility: 'on' }, {saturation: -100, hue: '#ff0000' }]},
			{featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'off'}]},
			{featureType: 'poi', elementType: 'labels', stylers: [{visibility: 'off'}]},
			{featureType: 'landscape.man_made', stylers: [{ visibility: 'off'}]},
			{featureType: 'transit', stylers: [{ visibility: 'off'}]}
		],
		markerIcon : {
			bar : '/assets/img/icon/bottle.svg',
			shop : '/assets/img/icon/shop.svg',
			person : '/assets/img/icon/direction.min.svg'
		},
		infobox : {
			closeButton : '/assets/img/icon/close.svg'
		}
	};
	
	this.markers = [];
	
	this.makeMarker = function(m) {
		var latlng = new google.maps.LatLng(m.latitude, m.longitude);
		self.markers.push(new google.maps.Marker({
			position: latlng,
			id: m.id,
			clickable: (m.type === 'person' ? false : true),
			infoxBoxData: {
				name: m.name,
				url: '/#/location/' + m.id
			},
			type: m.type,
			icon: self.config.markerIcon[m.type]
		}));
		boundary.extend(latlng);
		return self;
	};
	
	this.initMarkers = function() {
		boundary = new google.maps.LatLngBounds();
		for (var i = 0; i < locations.length; i += 1) {
        	self.makeMarker(locations[i]);
		}
		if(person !== null) {
			self.makeMarker(person);
		}
		return self;
	};
	
	this.overlay = {
		template : '<div class="infobox"><div class="infobox-inner" id="infobox"><a href="{{url}}"><h1>{{name}}</h1></a></div></div>',
        parseTemplate : function (data) {
			return this.template.split('{{url}}').join(data.url)
								.split('{{name}}').join(data.name);
        }
	};
	
	this.clearMarkers = function() {
		if (self.markers.length > 0) {
			for (var i = 0; i < self.markers.length; ++i) {
				self.markers[i].setMap(null);
			}
			self.markers.length = 0;
		}
		return self;
	};
	
	
	this.clickMarker = function() {
		if (!!self.infobox) {
			self.infobox.close(self.map, this);
		}
		self.infobox = new InfoBox({content: self.overlay.parseTemplate(this.infoxBoxData),
			disableAutoPan: false,
			zIndex: null,
			maxWidth: 0,
			boxStyle: {
				width:'180px',
				opacity: 1
			},
            pixelOffset: new google.maps.Size(-90, -70),
			closeBoxMargin: '4px 4px 4px 4px',
			isHidden: false,
            closeBoxURL: self.config.infobox.closeButton,
            infoBoxClearance: new google.maps.Size(1, 1),
			pane: 'floatPane',
			enableEventPropagation: false
         });
		
		self.infobox.open(self.map, this);

		google.maps.event.addListener(self.map, 'click', function () {self.infobox.close(self.map, this); });
	
	};
	
	this.placeMarkers = function() {
		for (var i = 0; i < self.markers.length; ++i) {
			self.markers[i].setMap(self.map);
			if (self.markers[i].type !== 'person') {
				google.maps.event.addListener(self.markers[i], 'click', self.clickMarker);
			}
			if(trigger) {
				google.maps.event.trigger(self.markers[i], 'click');
			}
		}
	};
	
	this.setBoundary = function () {
		if (self.markers.length > 1) {
			self.map.fitBounds(boundary);
		} else {
			self.map.setCenter(boundary.getCenter());
			self.map.setZoom(zoom);
		}
		return self;
	};
	
	this.drawMap = function() {
		 var mapOptions = {
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'ELPMMap']
				},
				scaleControl: false,
				mapTypeControl: false,
				overviewMapControl: true,
				panControl: false,
				rotateControl: false,
				streetViewControl: true,
				zoomControl: true
		 };
		
		self.map = new google.maps.Map($window.document.getElementById('map'), mapOptions);
		self.map.mapTypes.set('CBEMap', new google.maps.StyledMapType(self.config.styles, {name: 'CBEMap'}));
		self.map.mapTypes.set('CBEMapZoomed', new google.maps.StyledMapType(self.config.stylesZoomed, {name: 'CBEMapZoomed'}));
		self.map.setMapTypeId('CBEMap');
		
		self.setBoundary();
		
		self.placeMarkers();
		
		return self;
	};
	
	this.refresh = function(opts) {
		locations = opts.locations;
		self.clearMarkers()
			.initMarkers()
			.setBoundary()
			.placeMarkers();
	};
	
	this.init = function(opts) {
		locations = opts.locations;
		trigger = opts.trigger || null;
		person = opts.person || null;
		zoom = opts.zoom || 14;
		
		self.clearMarkers()
			.initMarkers()
			.drawMap();
	};
	
	this.asyncGoogleMapAPI = function() {
		var deferred = $q.defer(),
			promises = [],
			API = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&callback=GoogleMapsAPILoaded',
			infobox = '/assets/js/infobox/infobox.js',
			GoogleMapsAPILoaded = function(p) {
        		appendScript(infobox, function() {
						deferred.resolve($window.google.maps);
						return deferred.promise;
					 });
			},
			appendScript = function(src, cb) {
				var script = $window.document.createElement('script');
				script.src = src;
				if (!!cb) {
					script.onload = cb;
				}
        		$window.document.body.appendChild(script);
			};
			
		
		$window.GoogleMapsAPILoaded = GoogleMapsAPILoaded;
		
		if (angular.isDefined($window.google)) {
        	self.deferred.resolve($window.google.maps);
          	return self.deferred.promise;
		}
        appendScript(API);
		
		return deferred.promise;
	};
	
	return this;
}]);