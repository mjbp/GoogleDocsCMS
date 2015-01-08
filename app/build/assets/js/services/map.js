/*global angular, google, console*/ 
'use strict';

var module = angular.module('map', []);

module.factory('Map', ['$q', '$window', function($q, $window) {
    var self = this,
		zoom,
		locations,
		person,
		boundary;
	
	this.config = {
		styles : [
			{stylers:[{ visibility: "on" }, {saturation: -100, hue: '#ff0000' }]},
			{featureType: "road.local", stylers: [{ visibility: "simplified" }]},
			{featureType: "poi",elementType: "labels", stylers: [{ visibility: "off" }]},
			{featureType: "landscape.man_made",stylers: [{ visibility: "on" }]},
			{featureType: "transit",stylers: [{ visibility: "om" }]}
		],
		stylesZoomed : [
			{stylers: [{ visibility: "on" },{ saturation: -100, hue: '#ff0000' }]},
			{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},
			{featureType: "poi",elementType: "labels",stylers: [{ visibility: "off" }]},
			{featureType: "landscape.man_made", stylers: [{ visibility: "off" }]},
			{featureType: "transit",stylers: [{ visibility: "off" }]} 
		],
		markerIcon : {
			bar : '/assets/img/icons/bar.svg',
			shop : '/assets/img/icons/shop.svg',
			person : '/assets/img/icons/user.svg'
		},
		infobox : {
			closeButton : '/assets/img/icons/map-info-close.svg'
		}
	};
	
	this.deferred = $q.defer();
	this.markers = [];
	/*
	this.markerClickListener = function () {
		
		infobox = new InfoBox({content: parseTemplate(this.image, this.url, this.address),
					   disableAutoPan: false,
					   maxWidth: 150,
					   zIndex: null,
					   boxStyle: {background: 'url(/assets/img/ui/infobox-bg.png) 0 0 no-repeat', opacity: 1, width: "250px", height: "96px"},
					   pixelOffset: new google.maps.Size(-202, -96),
						closeBoxURL: '/assets/img/ui/infobox-close.png',
					   infoBoxClearance: new google.maps.Size(1, 1)
				  });
		infobox.open(map, this);
		
		google.maps.event.addListener(map, 'click', function () {infobox.close(map, this); });
		
	};
	*/
	
	this.makeMarker = function(m) {
		var latlng = new google.maps.LatLng(m.latitude, m.longitude);
		self.markers.push(new google.maps.Marker({
			position: latlng,
			id: m.id,
			clickable: true,
			//icon: self.config.markerIcon[m.type],
			url: '/#/detail/' + m.id || null
		}));
		boundary.extend(latlng);
		return this;
	};
	
	this.createMarkers = function() {
		boundary = new google.maps.LatLngBounds();
		
		for (var i = 0; i < locations.length; i += 1) {
        	self.makeMarker(locations[i]);
		}
		return self;
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
		
		if (typeof self.map === "undefined") {
			self.map = new google.maps.Map($window.document.getElementById('map'), mapOptions);
			self.map.mapTypes.set('CBEMap', new google.maps.StyledMapType(self.config.styles, {name: 'CBEMap'}));
			self.map.mapTypes.set('CBEMapZoomed', new google.maps.StyledMapType(self.config.stylesZoomed, {name: 'CBEMapZoomed'}));
			self.map.setMapTypeId('CBEMap');
		}
		if (self.markers.length > 1) {
			self.map.fitBounds(boundary);
		} else {
			self.map.setCenter(boundary.getCenter());
			self.map.setZoom(zoom);
		}

		for (var i = 0; i < self.markers.length; ++i) {
			self.markers[i].setMap(self.map);
			/*
			if (markers[i].address !== undefined) {
				google.maps.event.addListener(markers[i], 'click', mapClick);
			}*/
		}
	};
	
	self.refresh = function() {
		
	};
	
	this.init = function(opts) {
		locations = opts.locations;
		person = opts.person || null;
		zoom = opts.zoom || 14;
		self.clearMarkers()
			.createMarkers()
			.drawMap();
	};
	
	this.asyncGoogleMapAPI = function() {
		var API = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&callback=GoogleMapsAPILoaded',
			GoogleMapsAPILoaded = function(p) {
				self.deferred.resolve($window.google.maps);
				return self.deferred.promise;
				//To DO - load infoBox...
			},
			script = $window.document.createElement('script');
		
		$window.GoogleMapsAPILoaded = GoogleMapsAPILoaded;
		
		if (angular.isDefined($window.google)) {
			console.log('API already loaded...');
        	self.deferred.resolve($window.google.maps);
          	return self.deferred.promise;
		}
	
        script.src = API;
        $window.document.body.appendChild(script);
		
		return self.deferred.promise;
	};
	
	return this;
}]);