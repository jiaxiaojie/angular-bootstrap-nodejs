'use strict';
(function (angular, hsWechatControllers) {
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('activity', {
                url: '/activity',
                abstract: true,
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'activity':{
                        templateUrl: "scripts/views/activity/layout.html"
                    }
                }
            })
            .state('activity.list', {
                url: '/list',
                sticky: true,
                views:{
                    'activity.list':{
                        templateUrl: "scripts/views/activity/list.html",
                        controller:'ListActivityCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'活动列表', $navbarShow:true}
            })
            .state('activity.detail', {
                url: '/detail/:key',
                views:{
                    'activity.list.project':{
                        templateUrl: "scripts/views/activity/detail.html",
                        controller:'DetailActivityCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'活动详情', $navbarShow:true}
            });
    }
    hsWechatControllers.config(initConfig);
})(angular, hsWechatControllers);