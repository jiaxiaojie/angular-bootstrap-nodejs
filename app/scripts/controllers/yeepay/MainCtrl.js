'use strict';
(function (angular, hsWechatControllers) {

    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('yeepay', {
                url: '/yeepay',
                abstract: true,
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay':{
                        templateUrl: "scripts/views/yeepay/layout.html"
                    }
                }
            })
            .state('yeepay.register', {
                url: '/register/:mobile',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.register':{
                        templateUrl: "scripts/views/yeepay/register.html",
                        controller:'YeepayRegisterCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'易宝资金托管账户', $navbarShow:true, $needAuth:true}
            })
            .state('yeepay.recharge', {
                url: '/recharge',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.recharge':{
                        templateUrl: "scripts/views/yeepay/recharge.html",
                        controller:'YeepayCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'快捷充值', $navbarShow:true,$navbarPopDefault:'account.main', $needAuth:true}
            })
            .state('yeepay.withdrawals', {
                url: '/withdrawals',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.withdrawals':{
                        templateUrl: "scripts/views/yeepay/withdrawals.html",
                        controller:'YeepayWithdrawCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'提现', $navbarShow:true,$navbarPopDefault:'account.main', $needAuth:true}
            })
            .state('yeepay.bindBankCard', {
                url: '/bindBankCard',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.bindBankCard':{
                        templateUrl: "scripts/views/yeepay/Boundbankcard.html",
                        controller:'YeepayBindBankCardCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'绑卡', $navbarShow:true, $needAuth:true}
            })
            .state('yeepay.goToYeepay', {
                url: '/goToYeepay',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.goToYeepay':{
                        templateUrl: "scripts/views/yeepay/GoToYeepay.html",
                        controller:'YeepayRegisterCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'开通易宝账户', $navbarShow:true}
            })
            .state('yeepay.large', {
                url: '/large',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.large':{
                        templateUrl: "scripts/views/yeepay/large.html",
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'网银大额充值', $navbarShow:true,$navbarPopDefault:'account.main'}
            })
            .state('yeepay.range', {
                url: '/range?_hideNavbar&_hideNavbarBottom',
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'yeepay.range':{
                        templateUrl: "scripts/views/yeepay/range.html",
                        controller:'YeepayRangeCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'快捷充值限额', $navbarShow:true,$navbarPopDefault:'account.main'}
            });
    }
    hsWechatControllers.config(initConfig);

})(angular, hsWechatControllers);