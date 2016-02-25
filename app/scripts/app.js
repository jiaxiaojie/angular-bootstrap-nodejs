'use strict';
/*--app config--*/
/*--activity config--*/
/*--log config--*/
var hsLib = angular.module('hsLib', []);
var hsWechat = angular.module('hsWechat', ['hsLib','ngAnimate', 'ngTouch', 'ui.router', 'ui.bootstrap', 'base64', 'angular-md5', 'LocalStorageModule',
    'mobile-angular-ui', 'mobile-angular-ui.gestures', 'ngPostMessage', 'ct.ui.router.extras.sticky',
    'ct.ui.router.extras.dsr', 'ct.ui.router.extras.statevis', 'hsWechat.controllers', 'hsWechat.services',
    'hsWechat.directives', 'hsWechat.decorators', 'hsWechat.tpls']);
var hsWechatControllers = angular.module('hsWechat.controllers', []);
var hsWechatServices = angular.module('hsWechat.services', []);
var hsWechatFilters = angular.module('hsWechat.filters', []);
var hsWechatDirectives = angular.module('hsWechat.directives', ['ui.router']);
var hsWechatDecorators = angular.module('hsWechat.decorators', ['ui.router', 'mobile-angular-ui']);
var hsWechatTpls = angular.module('hsWechat.tpls', []);

(function(angular,hsLib){

    /**
     * 日志拦截器
     */
    logInterceptor.$inject = ['$location','$window', '$rootScope','$rootElement','$timeout','Log'];
    function logInterceptor($location,$window,$rootScope, $rootElement,$timeout,Log) {

        //angular框架外的error拦截
        $window.onerror = function(e,f){
            Log.error('document loaded error:'+e + "\n at " + f);
        };

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            $timeout(function(){ //stateChangeSuccess最后一个执行
                //图片加载失败
                $rootElement.find('img').bind('error',function(e,f){
                    //图片加载失败日志记录
                    Log.warn('GET '+this.src + ' 404 (Not Found)\n at '+ $window.SERVERCONF.appRootUrl + $location.path());
                });
            });
        });
    }
    hsLib.run(logInterceptor);


    //重写angular $logProvider#$get,用于日志记录
    initConfig.$inject = ['$logProvider','LogProvider'];
    function initConfig($logProvider,LogProvider) {
        if(window.LOGCONF.enabled){
            $logProvider.$get = LogProvider.$get;
        }
    }

    hsLib.config(initConfig);
})(angular,hsLib);

(function (angular, hsWechat) {

    /**
     * @type {string[]}
     */
    initConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];
    function initConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
        $locationProvider.html5Mode({
            enabled : true, //如果为真，将依托历史。pushState如果支持改变网址。将回落到散列前缀的路径中不支持的浏览器pushState。
            requireBase : true, //当html5Mode启用，指定是否一标记需要存在,如果启用和requireBase是真实的，并且基本标记不存在，当一个错误将被抛出$location注入
            rewriteLinks :true //当html5Mode启用，启用/禁用URL重写为相对链接。
        });
        $urlRouterProvider.otherwise("/home/");
    }

    hsWechat.config(initConfig);

})(angular, hsWechat);

(function (angular, hsWechatServices) {

    initConfig.$inject = ['$httpProvider'];
    function initConfig($httpProvider) {

        //自定义http解释器
        customHttpInterceptor.$inject = ['$q', '$rootScope', '$window', '$base64', 'Config', 'localStorageService','UAService'];
        function customHttpInterceptor($q, $rootScope, $window, $base64, Config, localStorageService,UA) {
            return {
                'response': function (response) {
                    if (!Config.pathIsApi(response.config.url)) {
                        return response;
                    } else if (!angular.isDefined(response.data.code)) {
                        response.status = 599;
                        response.data = '后台请求错误';
                        return $q.reject(response);
                    } else if (response.data.code - 0 !== 0) {
                        if (response.data.code == 1) {
                            $rootScope.$broadcast('invalidTokenEvent');
                        }
                        response.status = 499;
                        response.code = response.data.code;
                        response.data = response.data.text;
                        return $q.reject(response);
                    } else {
                        return response.data.data;
                    }
                },
                'request': function (reqConfig) {
                    if (!Config.pathIsApi(reqConfig.url)) {
                        return reqConfig;
                    } else if (angular.isUndefined(reqConfig.data)) {
                        reqConfig.data = {};
                    }

                    if ($window.SERVERCONF && $window.SERVERCONF.apiBaseUrl) {
                        reqConfig.url = $window.SERVERCONF.apiBaseUrl + reqConfig.url;
                    }
                    reqConfig.data.token = localStorageService.get('account.token');
                    var client = {type: 'wechat', version: $window.SERVERCONF.version, wechat: {ua:UA.getUA()}};
                    reqConfig.data.client = $base64.encode(JSON.stringify(client));

                    return reqConfig;
                }
            };
        }

        $httpProvider.interceptors.push(customHttpInterceptor);

        // Intercept POST requests, convert to standard form encoding
        //POST请求JSON数据转换成formdata
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        $httpProvider.defaults.transformRequest.unshift(function (data, headersGetter) {
            var key, result = [];

            if (typeof data === "string")
                return data;

            for (key in data) {
                if (data.hasOwnProperty(key))
                    result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
            }
            return result.join("&");
        });

    }

    hsWechat.config(initConfig);

    /**
     * navbar pop Interceptor
     */
    navbarPopInterceptor.$inject = ['$rootScope', 'Common'];
    function navbarPopInterceptor($rootScope, Common) {
        var includeStates = ['more.help.main','more.safe','invest.item.projectRiskInfo'];

        $rootScope.$on('navbarPopStart', function (event, toState, toParams, fromState, fromParams) {
            if(Common.inApp() && includeStates.indexOf(fromState.name)!=-1){
                Common.getHsbank().popupView();
                event.preventDefault();
            }
        });
    }

    hsWechat.run(navbarPopInterceptor);


    /**
     * 全局参数
     */
    situationParams.$inject = ['$location','$rootScope', 'Common','Log'];
    function situationParams($location,$rootScope, Common,Log) {
        var params = $location.search();

        Log.info("params :"+JSON.stringify(params));
        if(params){
            //注册渠道
            if (params['ad']) {
                Common.setChannel(params['ad']);
            }
            //base64推荐人手机号码
            if (params['m']) {
                Common.setInviteMobile(params['m']);
            }
            //subid
            if (params['subid']) {
                Common.setChannelUserId(params['subid']);
            }
            //用户的手机号码
            if (params['regm']) {
                Common.setRegm(params['regm']);
            }

        }


        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            //新手任务等级
            $rootScope.level = $location.$$search.level;
        });
    }

    hsWechat.run(situationParams);

    //微信分享测试
    //wechatTest.$inject = ['$location','$rootScope', 'Common','Log'];
    //function wechatTest($location,$rootScope, Common,Log) {
    //    $rootScope.$on('wechatShareOnMenuShareAppMessageSuccess', function () {
    //        alert('分享成功');
    //    });
    //    $rootScope.$on('wechatShareOnMenuShareAppMessageCancel', function () {
    //        alert('分享取消');
    //    });
    //    $rootScope.$on('wechatShareOnMenuShareAppMessageFail', function () {
    //        alert('分享失败');
    //    });
    //}
    //hsWechat.run(wechatTest);

    /**
     * 检查登录权限
     */
    checkAuth.$inject = ['$rootScope', '$state', 'Capture', 'Account', 'Common','Log'];
    function checkAuth($rootScope, $state, Capture, Account, Common,Log) {

        /**
         *无效的token事件
         */
        $rootScope.$on('invalidTokenEvent', function (event) {
            Account.unsetLogin();
            $state.go('sign.main');
        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            /**
             * 设置APP登录状态
             */
            if (Common.inApp()) {
                var token = Common.getHsbank().userIsHasLogin();
                Account.setLogin(token);
                Common.hsbankLog('token:'+token);
            }




            if( !Account.hasLogin() &&  fromState.data){
                var signMainState = $state.get('sign.main');
                signMainState.data.$navbarDirection =  fromState.data.$navbarDirection;
            }

            /**
             * 检查页面登录权限
             */
            if (toState.data && toState.data.$needAuth && !Account.hasLogin()) {//页面登录访问
                event.preventDefault();
                $state.go('sign.main');
            } else if (toState.data && toState.data.$rejectAccess === "login" && Account.hasLogin()) { //页面不允许登录访问
                if (toState.data.$redirectState) {
                    $state.go(toState.data.$redirectState);
                    event.preventDefault();
                }
            }


            /**
             * change state clear for modals
             */
            Capture.setContentFor('modals', '', $rootScope);
        });
    }

    hsWechat.run(checkAuth);


    /**
     * @ngdoc function
     * @name hsWechat.service.WechatJSSDK#setAllShareParams
     * @methodOf hsWechat.service.WechatJSSDK
     *
     * @description
     * 当页面跳转成功，将分享参数写入wechat接口。
     * 需要在MainCtrl.js中的data中指定分享参数
     *
     * @param {title} 分享标题
     * @param {desc} 分享描述
     * @param {imgUrl} 分享图标
     * @param {link} 分享链接（可不传，默认是当前页面的url）
     *
     * <pre>
     * .state('more.safe', {
     *            url: '/safe/:projectId?_hideNavbar&_hideNavbarBottom',
     *            templateUrl: "scripts/views/more/safe.html",
     *            data:{
     *                   $wechatShareTitle:'安全保障',
     *                   $wechatSharedesc:'花生金服安全保障说明',
     *                   $wechatShareimgUrl:'/images/app/20151117-01.jpg',
     *                   $wechatSharelink:'/more/safe'
     *              }
     *        })
     * </pre>
     *
     * @returns {promise} promise true for success
     *
     */
    setShareParam.$inject = ['$rootScope', '$window', 'WechatJSSDK', 'Common', 'Account'];
    function setShareParam($rootScope, $window, WechatJSSDK, Common, Account) {
        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            var $wechatShareImgUrl, $wechatShareTitle, $wechatShareDesc, $wechatShareLink;
            if (toState.data) {
                $wechatShareImgUrl = toState.data.$wechatShareImgUrl || $window.SERVERCONF.wechatShare.imgUrl;
                $wechatShareTitle = toState.data.$wechatShareTitle || $window.SERVERCONF.wechatShare.title;
                $wechatShareDesc = toState.data.$wechatShareDesc || $window.SERVERCONF.wechatShare.desc;
                $wechatShareLink = toState.data.$wechatShareLink || $window.SERVERCONF.appRootUrl;
            } else {
                $wechatShareImgUrl = $window.SERVERCONF.wechatShare.imgUrl;
                $wechatShareTitle = $window.SERVERCONF.wechatShare.title;
                $wechatShareDesc = $window.SERVERCONF.wechatShare.desc;
                $wechatShareLink = $window.SERVERCONF.appRootUrl;
            }

            if (!/^https?.*/.test($wechatShareImgUrl)) {
                $wechatShareImgUrl = $window.SERVERCONF.appRootUrl + $wechatShareImgUrl;
            }
            if (!/^https?.*/.test($wechatShareLink)) {
                $wechatShareLink = $window.SERVERCONF.appRootUrl + $wechatShareLink;
            }

            var connect = $wechatShareLink.lastIndexOf('?') == -1 ? '?' : '&';
            var params = ['ad=4ecd69c4-de42-4aa3-b0e3-05708dc7a054'];
            if (Account.hasLogin()) {
                Account.getAccountInfo().then(function (res) {
                    params.push('m=' + encodeURIComponent(Common.encodeBase64(res.mobile)));
                    $wechatShareLink = $wechatShareLink + connect + params.join('&');
                    WechatJSSDK.setAllShareParams($wechatShareTitle, $wechatShareDesc, $wechatShareLink, $wechatShareImgUrl);
                });
            } else {
                $wechatShareLink = $wechatShareLink + connect + params.join('&');
                WechatJSSDK.setAllShareParams($wechatShareTitle, $wechatShareDesc, $wechatShareLink, $wechatShareImgUrl);
            }
        });
    }

    hsWechat.run(setShareParam);

    /**
     * rootScope fields ,简便html调用
     * <pre>
     *  <a href="" ng-if="getCommon().inApp()"  ng-click="getCommon().getHsbank().investProject()"><b>立即投资</b> >></a>
     * </pre>
     */
    situationHTML.$inject = ['$rootScope', '$injector', 'Account', 'Common'];
    function situationHTML($rootScope,$injector, Account, Common) {
        $rootScope.hasLogin = Account.hasLogin;
        $rootScope.getCommon = function () {
            return Common;
        };
        $rootScope.getService = function (name) {
            return $injector.get(name);
        };
    }

    hsWechat.run(situationHTML);
})(angular, hsWechatServices);

(function (angular, hsWechatControllers) {
    MainController.$inject = ['$scope'];
    function MainController($scope) {
        $scope.navs = [
            {text: "推荐", href: "home.main", icon: "icon-double-square"},
            {text: "投资", href: "invest.list", icon: "icon-copper-coin"},
            {text: "我的", href: "account.main", icon: "icon-purse"},
            {text: "更多", href: "more.main", icon: "icon-three-circle"}
        ];
    }

    hsWechatControllers.controller("MainController", MainController);
})(angular, hsWechatControllers);
