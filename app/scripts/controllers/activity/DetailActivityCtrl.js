'use strict';
(function (angular, hsWechatControllers) {

    DetailActivityCtrl.$inject = ['$scope', '$sce','$state','$window','Common'];
    function DetailActivityCtrl($scope,$sce,$state,$window,Common){

        var activity;
        angular.forEach($window.ACTIVITYCONF,function(o) {
            if (o.key == $state.params.key) {
                activity = o;
            }
        });
        //$scope.src = $sce.trustAsUrl($state.params.src);
        if(activity && activity.type-0 === 3){
            if(Common.inApp()){
                $window.location.href=activity.target+'?inApp=true&v='+$window.SERVERCONF.version;
            }else{
                $window.location.href=activity.target;
            }
            return;
            //$scope.src =$sce.trustAsResourceUrl(activity.target);
        }

        angular.element($window).on('message', function(e) {
            if(e.data.event == 'activityGoUrl') {
                $state.go(e.data.params.state);
            }
        });
    }

    hsWechatControllers.controller('DetailActivityCtrl', DetailActivityCtrl);
})(angular, hsWechatControllers);