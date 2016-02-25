'use strict';
(function (angular, hsWechatControllers) {
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('more', {
                url: '/more',
                abstract: true,
                views:{
                    'more':{
                        templateUrl: "scripts/views/more/layout.html"
                    }
                }
            })
            .state('more.main', {
                url: '/',
                templateUrl: "scripts/views/more/main.html",
                controller:'MoreMainCtrl',
                data:{$navbarDirection:'go', $navbarTitle:'更多', $navbarShow:true}
            })
            .state('more.safe', {
                url: '/safe/:projectId?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/safe.html",
                data:{$navbarDirection:'push', $navbarTitle:'安全保障',$navbarPopDefault:'more.main', $navbarShow:true},
                controller:'MoreSafeCtrl'
            })
            .state('more.yeepayAgreement?_hideNavbar&_hideNavbarBottom', {
                url: '/yeepayAgreement',
                templateUrl: "scripts/views/more/safe/yeepayAgreement.html",
                data:{$navbarDirection:'push', $navbarTitle:'花生金服与易宝支付合作协议',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.sunAgreement?_hideNavbar&_hideNavbarBottom', {
                url: '/sunAgreement',
                templateUrl: "scripts/views/more/safe/sunAgreement.html",
                data:{$navbarDirection:'push', $navbarTitle:'花生金服与阳光财险支付合作协议',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.reserveFund?_hideNavbar&_hideNavbarBottom', {
                url: '/reserveFund',
                templateUrl: "scripts/views/more/safe/reserveFund.html",
                data:{$navbarDirection:'push', $navbarTitle:'资金托管报告',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.law?_hideNavbar&_hideNavbarBottom', {
                url: '/law',
                templateUrl: "scripts/views/more/safe/law.html",
                data:{$navbarDirection:'push', $navbarTitle:'法律文件',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help', {
                url: '/help',
                abstract: true,
                templateUrl: "scripts/views/more/help/layout.html"
            })
            .state('more.help.main', {
                url: '/?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/main.html",
                data:{$navbarDirection:'push', $navbarTitle:'帮助中心',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help.one', {
                url: '/one?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/help1.html",
                data:{$navbarDirection:'push', $navbarTitle:'新手入门',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help.two', {
                url: '/two?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/help2.html",
                data:{$navbarDirection:'push', $navbarTitle:'注册/登录',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help.three', {
                url: '/three?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/help3.html",
                data:{$navbarDirection:'push', $navbarTitle:'充值/提现',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help.four', {
                url: '/four?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/help4.html",
                data:{$navbarDirection:'push', $navbarTitle:'投资/赎回',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help.five', {
                url: '/five?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/help5.html",
                data:{$navbarDirection:'push', $navbarTitle:'产品介绍',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.help.six', {
                url: '/six?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/help/help6.html",
                data:{$navbarDirection:'push', $navbarTitle:'名词解释',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.about', {
                url: '/about',
                templateUrl: "scripts/views/more/about.html",
                controller:'MoreAboutCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'关于我们',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.company', {
                url: '/company?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/more/company.html",
                data:{$navbarDirection:'push', $navbarTitle:'公司简介',$navbarPopDefault:'more.main', $navbarShow:true}
            })
            .state('more.cache', {
                url: '/cache',
                templateUrl: "scripts/views/more/cache.html",
                controller:'MoreCacheCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'清除缓存',$navbarPopDefault:'more.main', $navbarShow:true}
            })
        ;
    }
    hsWechatControllers.config(initConfig);

})(angular, hsWechatControllers);