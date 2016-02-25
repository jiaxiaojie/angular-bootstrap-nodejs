'use strict';
(function (angular, hsWechatControllers) {
    MoreMainCtrl.$inject = ['$http', '$scope', '$state', '$stateParams', '$location', 'Account', 'Project', 'More', 'Tip','$timeout'];
    function MoreMainCtrl($http, $scope, $state, $stateParams, $location, Account, Project, More, Tip,$timeout){
        $scope.projectId = $stateParams.projectId;
        $scope.project = {};
        Project.getProjectDetail($scope.projectId).then(function(res) {
            $scope.project = res;
        }, function(reason) {

        });

        $scope.hasLogin = Account.hasLogin;

        $scope.logout = function() {
            Account.logout();
            Tip.show('退出成功', 2000, '#logoutBtn');
        };

        //活动中心
        /*
        $scope.activities = [];
        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.loadMore = loadMore;
        function loadMore() {
            More.getActivityPageList($scope.pageSize, $scope.pageNumber).then(function(page) {
                if(page.length > 0) {
                    $scope.pageNumber++;
                    $scope.activities = $scope.activities.concat(page);
                }
            }, function(reason) {

            });
        }
        //首次加载
        $scope.loadMore();
        */

        $scope.goUrl = function(url) {
            $location.path(url);
        }
    }

    hsWechatControllers.controller('MoreMainCtrl', MoreMainCtrl);

    MoreAboutCtrl.$inject = [ '$scope', '$window'];
    function MoreAboutCtrl($scope,$window){
        $scope.app = $window.SERVERCONF;

    }

    hsWechatControllers.controller('MoreAboutCtrl', MoreAboutCtrl);


    MoreCacheCtrl.$inject = [ 'localStorageService'];
    function MoreCacheCtrl(localStorageService){
        localStorageService.clearAll();
    }

    hsWechatControllers.controller('MoreCacheCtrl', MoreCacheCtrl);


    //安全保障 查看文件

    MoreSafeCtrl.$inject = ['$scope','SharedState'];
    function MoreSafeCtrl($scope,SharedState) {

        $scope.imgArray=[
            ["/images/safe/trusteeship/1.jpg","/images/safe/trusteeship/2.jpg"],
            ["/images/safe/guarantee/1.jpg"],
            ["/images/safe/insurance/1.jpg","/images/safe/insurance/2.jpg","/images/safe/insurance/3.jpg"],
            ["/images/safe/law/1.jpg","/images/safe/law/2.jpg"]
        ];

        $scope.viewBigImg=function(index){
            $scope.index=index;
            SharedState.turnOn('hspopup');
        }
    }

    hsWechatControllers.controller('MoreSafeCtrl', MoreSafeCtrl);

})(angular, hsWechatControllers);