'use strict';
(function (angular, hsWechatControllers) {
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: "/home",
                abstract: true,
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'home':{
                        templateUrl: "scripts/views/home/layout.html"
                    }
                }
            })
            .state('home.main', {
                url: "/",
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'home.main':{
                        templateUrl: "scripts/views/home/main.html",
                        controller:'HomeMainCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'main', $navbarShow:false}
            })
            .state('home.help', {
                url: "/",
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'home.help':{
                        templateUrl: "scripts/views/home/help.html",
                        controller:'HomeMainCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'help', $navbarShow:false}
            })
            .state('home.about', {
                url: "/",
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'home.about':{
                        templateUrl: "scripts/views/home/about.html",
                        controller:'HomeMainCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'about', $navbarShow:false}
            });
    }
    hsWechatControllers.config(initConfig);

    /**
     * @ngdoc controller
     *
     */
    HomeMainCtrl.$inject = ['$http', '$scope', '$state', '$location','$window', 'Project', 'Event','Account'];
    function HomeMainCtrl($http, $scope, $state, $location,$window, Project, Event,Account){
        $scope.slides = [];
        $scope.go = function(activity){
            switch(activity.type-0){
                case 1:
                    $location.url(activity.target);
                    break;
                case 2:
                    $state.go('invest.item.projectDetail',{"projectId":activity.target});
                    break;
            }
        };
        Event.getRecommendEvents().then(function(res){
            $scope.slides = res;
        });

        $scope.projects = [];
        Project.getRecommendProjects().then(function(projects) {
            $scope.projects = projects;
        }, function(reason) {

        });


        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if(toState.name == 'home.main'){
                $scope.accountInfo = {};
                if(Account.hasLogin()){
                    Account.getAccountInfo().then(function(res){
                        $scope.accountInfo = res;
                    });
                }
            }
        });
    }

    hsWechatControllers.controller('HomeMainCtrl', HomeMainCtrl);
})(angular, hsWechatControllers);