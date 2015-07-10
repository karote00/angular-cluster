var app = angular.module('app', []);

app.controller('clusterCtrl', ['$scope', function($scope) {
	$scope.metaData = [];
	var dataLength = 50000;
	for(var i = 0; i < dataLength; i++) {
		$scope.metaData.push(i + 1);
	}

	$scope.nextControl = {};

}]);

app.directive('cluster', [function() {
	return {
		restrict: 'A',
		replace: true,
		scope: {
			metaData: '=',
			control: '='
		},
		link: function(scope, elem, attr) {
			scope.ctrl = scope.control || {};

			scope.dt = -1;
			var data = scope.metaData;
			var t = 0;
			var count = data.length / 10;
			var ratio = Math.pow(3 / 4, 2);
			if(count < 50) count = 50;
			else if(count > 100) count = 100;
			scope.scrollHeight = 20 * data.length;
			var max = Math.ceil(data.length / Math.round(count * ratio));
			var changePos = Math.round(count * ratio) * 20;

			scope.$watch('dt', function(v) {
				scope.data = [];
				t = 0;
				for(var i = v * Math.round(count * ratio); i < data.length; i++) {
					if(t == count) {
						t = 0;
						break;
					}

					scope.data.push(data[i]);
					t++;
				}
			});

			scope.ctrl.init = function() {
				scope.dt = 0;
			};

			scope.ctrl.init();

			scope.ctrl.next = function(n) {
				if(scope.dt > max || n > max) scope.dt = max;
				else scope.dt = n || ++scope.dt;
				scope.expandHeight = scope.dt * Math.round(count * ratio) * 20;
			};

			scope.ctrl.prev = function(n) {
				if(scope.dt < 0 || n < 0) scope.dt = 0;
				else scope.dt = n || --scope.dt;
				scope.expandHeight = scope.dt * Math.round(count * ratio) * 20;
			}

			elem.scroll(function() {
				var eCurPos = elem.scrollTop();

				var to = eCurPos - (scope.dt + 1) * changePos;

				if(to > 0) {
					if(to > changePos) {
						var cur = Math.round(eCurPos / changePos);
						scope.ctrl.next(cur);
						scope.$apply();
					} else {
						scope.ctrl.next();
						scope.$apply();
					}
				} else {
					if(-to > changePos) {
						var cur = Math.round(eCurPos / changePos) - 1;
						scope.ctrl.prev(cur);
						scope.$apply();
					} else {
						if((to + changePos) < 0) {
							scope.ctrl.prev();
							scope.$apply();
						}
					}
				}
			});
		},
		templateUrl: 'template/column.html'
	}
}]);