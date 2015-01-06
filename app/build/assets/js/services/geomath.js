CBEApp.service('geomath', function() {
    var self = this;
    var R = 6371000; // earth's radius in meters

    /**
     * calculate distance
     * @param geo1
     * @param geo2
     * @returns {Number}
     */
    this.calculateDistance = function(geo1, geo2) {
        self.convertFromGoogle([geo1, geo2]);
        var dLat = self.toRad(geo1.latitude - geo2.latitude),
			dLon = self.toRad(geo1.longitude - geo2.longitude),
			lat1 = self.toRad(geo2.latitude),
			lat2 = self.toRad(geo1.latitude),
			a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2),
			c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return parseInt(R * c);
    };
    

    /**
     * convert from google lat/long object
     */
    this.convertFromGoogle = function(llobjs) {
       llobjs.forEach( function(llo) {
           if (typeof(llo.lat) != "undefined" && typeof(llo.lng) != "undefined") {
               llo.latitude = llo.lat();
               llo.longitude = llo.lng();
           }
       });
    };

    /**
     * math util to convert lat/long to radians
     * @param value
     * @returns {number}
     */
    this.toRad = function(value) {
        return value * Math.PI / 180;
    };

    /**
     * math util to convert radians to latlong/degrees
     * @param value
     * @returns {number}
     */
    this.toDeg = function(value) {
        return value * 180 / Math.PI;
    };

});