'use strict';
(function (angular, hsWechatControllers) {
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sign', {
                url: '/sign',
                abstract: true,
                deepStateRedirect: true,
                views:{
                    'sign':{
                        templateUrl: "scripts/views/sign/layout.html"
                    }
                }
            })
            .state('sign.register', {
                url: '/register?_hideNavbar&_hideNavbarBottom&m',
                deepStateRedirect: true,
                sticky: false,
                views:{
                    'sign.register':{
                        templateUrl: "scripts/views/sign/register.html",
                        controller:'SignRegisterCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'注册', $navbarShow:true,$rejectAccess:'login',$redirectState:'account.main'}
            })
            .state('sign.main', {
                url: '/',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'sign.main':{
                        templateUrl: "scripts/views/sign/main.html",
                        controller:'SignCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'注册/登录', $navbarShow:true}
            })
            .state('sign.in', {
                url: '/in/:mobile',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'sign.in':{
                        templateUrl: "scripts/views/sign/in.html",
                        controller:'SignInCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'注册', $navbarShow:true}
            })
            .state('sign.up', {
                url: '/up/:mobile',
                deepStateRedirect: true,
                sticky: false,
                views:{
                    'sign.up':{
                        templateUrl: "scripts/views/sign/up.html",
                        controller:'SignUpCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'请输入登录密码', $navbarShow:true}
            })
            .state('sign.pass', {
                url: '/pass/:mobile',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'sign.pass':{
                        templateUrl: "scripts/views/sign/pass.html",
                        controller:'SignPassCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'找回密码', $navbarShow:true}
            })
            .state('sign.success', {
                url: '/success/:mobile',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'sign.success':{
                        templateUrl: "scripts/views/sign/success.html",
                        controller:'SignSuccessCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'注册成功', $navbarShow:true}
            })
            .state('sign.agreementSign', {
                url: '/agreementSign?_hideNavbar&_hideNavbarBottom',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'sign.agreementSign':{
                        templateUrl: "scripts/views/sign/agreementSign.html",
                        //controller:'SignSuccessCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'注册协议', $navbarShow:true,$navbarPopDefault:'sign.main'}
            })

            }
    hsWechatControllers.config(initConfig);


    /**
     * @ngdoc controller
     *
     */
    SignMainCtrl.$inject = ['$http', '$scope','$state', 'Account'];
    function SignMainCtrl($http, $scope, $state, Account){
    }

    hsWechatControllers.controller('SignMainCtrl', SignMainCtrl);

})(angular, hsWechatControllers);