'use strict';
(function (angular, hsWechatControllers) {
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function initConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('event', {
                url: '/event',
                abstract: true,
                deepStateRedirect: true,
                views:{
                    'event':{
                        templateUrl: "scripts/views/event/layout.html"
                    }
                }
            })
            .state('event.download2', {
                url: '/download2?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/event/download2.html",
                controller:'EventDownloadCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'下载客户端', $navbarShow:true,$navbarPopDefault:'home.main',
                    $wechatShareTitle:'花生金服APP下载',
                    $wechatShareDesc:'m.hsbank360.com',
                    $wechatShareImgUrl:'/images/app/logo.png',
                    $wechatShareLink:'/event/download2?_hideNavbar&_hideNavbarBottom'
                }
            })
            .state('event.friend', {
                url: '/friend?_hideNavbar&_hideNavbarBottom',
                templateUrl: "scripts/views/event/friend.html",
                controller:'EventFriendCtrl',
                data:{$navbarDirection:'push', $navbarTitle:'邀请好友', $navbarShow:true,$navbarPopDefault:'home.main',
                    $wechatShareTitle:'新手好礼等你拿',
                    $wechatShareDesc:'注册花生金服就送200元以上红包，年化8%-16%高收益，真正好福利，就等你来拿！',
                    $wechatShareImgUrl:'/images/app/event/friend.png',
                    $wechatShareLink:'/sign/register?_hideNavbar&_hideNavbarBottom'
                }
            })
            .state('event.hjxc', {
                url: '/hjxc?_hideNavbar&_hideNavbarBottom',
                controller:'EventHjxcCtrl',
                templateUrl: "scripts/views/event/hjxc.html",
                data:{$navbarDirection:'push', $navbarTitle:'会员专享', $navbarShow:true,$navbarPopDefault:'home.main',$needAuth:true}
            })
        ;
    }
    hsWechatControllers.config(initConfig);
})(angular, hsWechatControllers);