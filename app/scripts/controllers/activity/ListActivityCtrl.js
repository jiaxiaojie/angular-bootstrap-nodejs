'use strict';
(function (angular, hsWechatControllers) {

    ListActivityCtrl.$inject = ['$sce', '$scope', '$state', '$window'];
    function ListActivityCtrl($sce, $scope, $state,$window){
        $scope.activityList = $window.ACTIVITYCONF;

        /**
         * @param type "0不跳转,1跳转项目，2跳转内部state，3跳转外部网页",
         * @param target "type等于1表示项目ID，2表示内部state名称，3表示url",
         */
        $scope.go = function(activity){
            switch(activity.type-0){
                case 0:
                    break;
                case 1:
                    $state.go('invest.item.projectDetail',{"projectId":activity.target});
                    break;
                case 2:
                    $state.go(activity.target,activity.targetParams);
                    break;
                case 3:
                    $state.go('activity.detail',{"key":activity.key});
                    break;
            }
        }
    }

    hsWechatControllers.controller('ListActivityCtrl', ListActivityCtrl);
})(angular, hsWechatControllers);