'use strict';
(function (angular, hsWechatControllers) {

    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('account', {
                url: '/account',
                abstract: true,
                views:{
                    'account':{
                        templateUrl: "scripts/views/account/layout.html"
                    }
                }
            })
            .state('account.main', {
                url: '/',
                templateUrl: "scripts/views/account/main.html",
                controller:'AccountMainCtrl',
                data:{$navbarDirection:'go', $navbarTitle:'', $navbarShow:false, $needAuth:true}
            })
            .state('account.invest', {
                url: '/invest/:activeTab',
                templateUrl: "scripts/views/account/invest/main.html",
                controller:'AccountInvestCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'我的投资',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.investDetail', {
                url: '/invest/detail/:recordId',
                templateUrl: "scripts/views/account/invest/detail.html",
                controller:'AccountInvestDetailCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'投资详情',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.investPlan', {
                url: '/invest/plan/:recordId',
                templateUrl: "scripts/views/account/invest/plan.html",
                controller:'AccountInvestPlanCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'还款计划',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.log', {
                url: '/log',
                templateUrl: "scripts/views/account/log.html",
                controller:'AccountLogCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'交易记录',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.info', {
                url: '/info',
                templateUrl: "scripts/views/account/info.html",
                controller:'AccountMainCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'账户信息',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.password', {
                url: '/password',
                templateUrl: "scripts/views/account/password.html",
                controller:'AccountMainCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'修改登录密码', $navbarPopDefault:'account.main',$navbarShow:true, $needAuth:true}
            })
            .state('account.calendar', {
                url: '/calendar',
                templateUrl: "scripts/views/account/calendar.html",
                controller:'AccountMainCtrl',
                data:{$navbarDirection:'go', $navbarTitle:'回款日历',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.message', {
                url: '/message',
                templateUrl: "scripts/views/account/message.html",
                controller:'AccountMessageCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'我的消息',$navbarPopDefault:'account.main', $navbarShow:true, $needAuth:true}
            })
            .state('account.recommend', {
                url: '/recommend',
                abstract: true,
                templateUrl: "scripts/views/account/recommend/layout.html"
            })
            .state('account.recommend.main', {
                url: '/?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/account/recommend/main.html",
                controller:'AccountRecommendCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'邀请有奖', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:false,
                    $wechatShareTitle:'新手好礼等你拿',
                    $wechatShareDesc:'注册花生金服就送200元以上红包，年化8%-16%高收益，真正好福利，就等你来拿！',
                    $wechatShareImgUrl:'/images/app/event/recommend/recommend.png',
                    $wechatShareLink:'/sign/register?_hideNavbar&_hideNavbarBottom'
                }
            })
            .state('account.recommend.detail', {
                url: '/detail/:tab',
                templateUrl: "scripts/views/account/recommend/detail.html",
                controller:'RecommendDetailCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'奖励详情', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.recommend.my', {
                url: '/my',
                templateUrl: "scripts/views/account/recommend/my.html",
                controller:'RecommendMyCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'我的邀请', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.ticket', {
                url: '/ticket',
                abstract: true,
                templateUrl: "scripts/views/account/ticket/layout.html"
            })
            .state('account.ticket.main', {
                url: '/',
                templateUrl: "scripts/views/account/ticket/main.html",
                controller:'AccountTicketCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'卡券', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut', {
                url: '/peanut',
                abstract: true,
                sticky: false,
                templateUrl: "scripts/views/account/peanut/layout.html"
            })
            .state('account.peanut.main', {
                url: '/',
                sticky: true,
                views:{
                    'account.peanut.main':{
                        templateUrl: "scripts/views/account/peanut/main.html",
                        controller:'AccountPeanutCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'我的花生豆', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.log', {
                url: '/log',
                templateUrl: "scripts/views/account/peanut/log.html",
                controller:'AccountPeanutLogCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'花生豆记录', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.rule', {
                url: '/rule?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/account/peanut/rule.html",
                data:{$navbarDirection:'push', $navbarTitle:'花生豆规则', $navbarShow:true,$navbarPopDefault:'account.main'}

            })
            .state('account.peanut.addAddress', {
                url: '/addAddress/:productId/:productCount',
                templateUrl: "scripts/views/account/peanut/addAddress.html",
                controller:'AccountPeanutAddAddressCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'新增地址', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.changeAddress', {
                url: '/changeAddress/:addressId/:productId/:productCount',
                templateUrl: "scripts/views/account/peanut/changeAddress.html",
                controller:'AccountPeanutChangeAddressCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'修改地址', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.selectAddress', {
                url: '/selectAddress/:productId/:productCount',
                templateUrl: "scripts/views/account/peanut/selectAddress.html",
                controller:'AccountPeanutSelectAddressCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'选择地址', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.confirmOrder', {
                url: '/confirmOrder/:addressId/:productId/:productCount',
                templateUrl: "scripts/views/account/peanut/confirmOrder.html",
                controller:'AccountPeanutConfirmOrderCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'确认订单', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.finishPay', {
                url: '/finishPay/:productId/:productCount/:addressId/:orderCode/:createDt',
                templateUrl: "scripts/views/account/peanut/finishPay.html",
                controller:'AccountPeanutFinishPayCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'支付完成', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.exchangeRecord', {
                url: '/exchangeRecord',
                templateUrl: "scripts/views/account/peanut/exchangeRecord.html",
                controller:'AccountPeanutExchangeRecordCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'兑换记录', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.peanutPark', {
                url: '/peanutPark',
                sticky: true,
                views:{
                    'account.peanut.peanutPark':{
                        templateUrl: "scripts/views/account/peanut/peanutPark.html",
                        controller:'AccountPeanutCtrl'
                    }
                },
                data:{$navbarDirection:'push', $navbarTitle:'花生乐园', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.peanut.productDetail', {
                url: '/productDetail/:productId?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/account/peanut/productDetail.html",
                controller:'AccountPeanutProductDetailCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'商品详情', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.novice', {
                url: '/novice',
                abstract: true,
                templateUrl: "scripts/views/account/novice/layout.html"
            })
            .state('account.novice.main', {
                url: '/',
                templateUrl: "scripts/views/account/novice/main.html",
                controller:'AccountNoviceCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'新手寻宝任务', $navbarShow:true,$navbarPopDefault:'home.main'}
            })
            .state('account.overview', {
                url: '/overview',
                abstract: true,
                templateUrl: "scripts/views/account/overview/layout.html"
            })
            .state('account.overview.main', {
                url: '/',
                templateUrl: "scripts/views/account/overview/main.html",
                controller:'AccountOverviewCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'账户总览', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
            .state('account.current', {
                url: '/current',
                abstract: false,
                deepStateRedirect: {default: 'account.current.myCurrent'},
                templateUrl: "scripts/views/account/current/layout.html"
            })
            .state('account.current.projectDetail', {
                url: '/projectDetail/:projectId',
                templateUrl: "scripts/views/account/current/projectDetail.html",
                controller:'CurrentCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'活花生产品详情', $navbarShow:true,$navbarPopDefault:'invest.list'}
            })
            .state('account.current.invest', {
                url: '/invest/:projectId',
                templateUrl: "scripts/views/account/current/invest.html",
                controller:'myCurrentInvestCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'投资金额', $navbarShow:true, $needAuth:true,$navbarPopDefault:'invest.list'}
            })
            .state('account.current.investSuccess', {
                url: '/investSuccess/:amount',
                templateUrl: "scripts/views/account/current/investSuccess.html",
                controller:'myCurrentInvestSuccessCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'投资成功', $navbarShow:true, $needAuth:true,$navbarPopDefault:'invest.list'}
            })
            .state('account.current.redeem', {
                url: '/redeem/:projectId/:amount',
                templateUrl: "scripts/views/account/current/redeem.html",
                controller:'redeemCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'赎回', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.redeemSuccess', {
                url: '/redeemSuccess',
                templateUrl: "scripts/views/account/current/redeemSuccess.html",
                data:{$navbarDirection:'push', $navbarTitle:'赎回活花生', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.pick', {
                url: '/pick/:projectId/:amount',
                templateUrl: "scripts/views/account/current/pick.html",
                controller:'redeemCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'提取收益', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.pickSuccess', {
                url: '/pickSuccess',
                templateUrl: "scripts/views/account/current/pickSuccess.html",
                data:{$navbarDirection:'push', $navbarTitle:'提取成功', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.intro', {
                url: '/intro?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/account/current/intro.html",
                data:{$navbarDirection:'push', $navbarTitle:'活花生', $navbarShow:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.myCurrent', {
                url: '/myCurrent',
                templateUrl: "scripts/views/account/current/myCurrent.html",
                controller:'myCurrentCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'我的活花生', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.myCurrentDetail', {
                url: '/myCurrentDetail/:projectId',
                templateUrl: "scripts/views/account/current/myCurrentDetail.html",
                controller:'myCurrentDetailCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'我的活花生详情', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.financeDetail', {
                url: '/financeDetail/:projectId',
                templateUrl: "scripts/views/account/current/financeDetail.html",
                controller:'financeDetailCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'资金明细', $navbarShow:true, $needAuth:true,$navbarPopDefault:'account.main'}
            })
            .state('account.current.agreement', {
                url: '/agreement/:projectId?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/account/current/agreement.html",
                controller:'CurrentAgreementCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'投资协议', $navbarShow:true,$navbarPopDefault:'account.main'}
            })
            .state('account.bankcard', {
                url: '/bankcard',
                abstract: false,
                deepStateRedirect: {default: 'account.bankcard.myBankCard'},
                templateUrl: "scripts/views/account/bankcard/layout.html"
            })
            .state('account.bankcard.myBankCard', {
                url: '/myBankCard',
                templateUrl: "scripts/views/account/bankcard/myBankCard.html",
                controller:'BankCardCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'我的银行卡', $navbarShow:true,$navbarPopDefault:'account.main',$needAuth:true}
            })
        ;
    }
    hsWechatControllers.config(initConfig);
})(angular, hsWechatControllers);