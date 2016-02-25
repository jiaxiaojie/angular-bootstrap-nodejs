'use strict';
(function (angular, hsWechatControllers) {
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('invest', {
                url: '/invest',
                abstract: true,
                deepStateRedirect: false,
                sticky: false,
                views:{
                    'invest':{
                        templateUrl: "scripts/views/invest/layout.html"
                    }
                }
            })
            .state('invest.list', {
                url: '/list',
                abstract: false,
                deepStateRedirect: {default: 'invest.list.project'},
                sticky: true,
                views:{
                    'invest.list':{
                        templateUrl: "scripts/views/invest/list/layout.html"
                    }
                }
            })
            .state('invest.list.project', {
                url: '/project',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'invest.list.project':{
                        templateUrl: "scripts/views/invest/list/project.html",
                        controller:'InvestListProjectCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'投资', $navbarShow:true}
            })
            .state('invest.list.transfer', {
                url: '/transfer',
                deepStateRedirect: true,
                sticky: true,
                views:{
                    'invest.list.transfer':{
                        templateUrl: "scripts/views/invest/list/transfer.html",
                        controller:'InvestListTransferCtrl'
                    }
                },
                data:{$navbarDirection:'go', $navbarTitle:'投资列表', $navbarShow:true}
            })
            .state('invest.item', {
                url: '/',
                abstract: true,
                views:{
                    'invest.item':{
                        templateUrl: "scripts/views/invest/item/layout.html"
                    }
                }
            })
            .state('invest.item.projectDetail', {
                url: 'detail/project/:projectId',
                templateUrl: "scripts/views/invest/item/detail/project.html",
                controller:'DetailProjectCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.documents', {
                url: 'detail/documents/:projectId',
                templateUrl: "scripts/views/invest/item/detail/documents.html",
                controller:'DocumentsProjectCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'相关文件', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.projectPlan', {
                url: 'plan/project/:projectId',
                templateUrl: "scripts/views/invest/item/plan/project.html",
                controller:'projectPlanCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'还款计划', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.projectInvestor', {
                url: 'investor/project/:projectId',
                templateUrl: "scripts/views/invest/item/investor/project.html",
                controller:'projectInvestor',
                data:{$navbarDirection:'push', $navbarTitle:'投资列表', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.projectMore', {
                url: 'more/project/:projectId?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/invest/item/more/project.html",
                controller:'moreDetailCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'更多详情', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.projectRiskInfo', {
                url: 'riskInfo/project?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/invest/item/riskInfo/project.html",
                controller:'RiskInfoProjectCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'风控信息', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.projectBuy', {
                url: 'buy/project/:projectId/:amount',
                templateUrl: "scripts/views/invest/item/buy/project.html",
                controller:'BuyProjectCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'确认投资', $navbarShow:true, $needAuth:true,$navbarPopDefault:'invest.list'}
            })
            .state('invest.item.agreement', {
                url: 'buy/agreement/:projectId/:amount?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/invest/item/buy/agreement.html",
                controller:'AccountInvestAgreementCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'借款协议', $navbarShow:true, $needAuth:true,$navbarPopDefault:'invest.list'}
            })
        ;
    }
    hsWechatControllers.config(initConfig);
})(angular, hsWechatControllers);