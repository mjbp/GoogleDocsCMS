'use strict';

var module = angular.module('googleDocs', []);

module.factory('GoogleDocs', ['$q',  function($q) {
    var self = this,
		key = '1FXG7ydpEEVySkTOWeCXyVdASHhd4fQXj9wojAaSem68',
		data = [];
	
	this.deferred = $q.defer();
	
	this.success = function(data) {
		self.deferred.resolve(data);
	};
		
	this.error = function(error) {
		console.log('not allowed');
		self.deferred.reject(error);
	};
	
    /**
     * get data
     * @param callback
     */
    this.getContent = function() {
		ds = new Miso.Dataset({
			importer : Miso.Dataset.Importers.GoogleSpreadsheet,
			parser : Miso.Dataset.Parsers.GoogleSpreadsheet,
			key : key,
			worksheet : '1'
		});

		ds.fetch({ 
			success : function() {
				//self.success(ds);
				ds.each(function(row, rowIndex) {
					//console.log(JSON.stringify(row) + ': ' + rowIndex);
					data.push(row);
				});
				self.success(data)
			 },
			 error : function() {
				 self.error();
			 }
		});
		return self.deferred.promise;
    };
	
	
	
	return this;
}]);
