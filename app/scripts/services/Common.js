(function(angular, hsWechatServices){

    /**
     * @ngdoc service
     * @name hsWechat.services.Yeepay
     *
     * @requires $http
     * @requires $q
     * @requires Config
     * @description
     * 易宝相关服务
     */
    Common.$inject = ['$http', '$q','$state','$base64','$window', 'Config','localStorageService','Account','UAService'];
    function Common($http, $q,$state,$base64,$window,Config,localStorageService,Account,UA) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#versionCompare
         * @methodOf hsWechat.services.Common
         * @param {String} v1 版本号1
         * @param {String} v2 版本号2
         * @operator {String} [operator] 判断逻辑符
         * @description
         *  版本比较
         * @return boolean or int
         */
        this.versionCompare = versionCompare;
        function versionCompare(version1 , version2 ,operator ){
            var res = compare(version1,version2);
            if(!operator) return res;
            switch (operator){
                case 'gt':
                case '>':
                    return res === 1;
                case '>=':
                    return res >= 0 ;
                case 'lt':
                case '<':
                    return res === -1;
                case '<=':
                    return res <= 0;
                case 'eq':
                case '=':
                    return res === 0;
            }

            function compare(v1,v2){
                if(v1 == v2) return 0;
                var arr1 = v1.split('.'),
                    arr2 = v2.split('.'),
                    max = arr1.length > arr2.length ? arr1.length : arr2.length;

                for(var i = 0 ;i < max ;i++){
                    var v1 = parseInt(arr1[i] || 0),
                        v2 = parseInt(arr2[i] || 0);

                    if(v1 > v2) return 1;
                    else if(v1 < v2) return -1;
                }
                return  0;
            }
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Common#toHome
         * @methodOf hsWechat.services.Common
         * @param {String}pageName 页面Id，如首页(home)、登录页(login)、帮助中心(help)、卡券（tickets）。App和微信端商量确定，系统内唯一即可。
         * @description
         *  跳转app页面
         */
        function gotoAppView(viewName){
            if(inApp()){
                var sinceVersion = UA.isIOS ? '1.2.0' : '1.3.0.0';  //接口规范将要使用的版本
                var appVersion = getHsbank().getAppVersion ? getHsbank().getAppVersion() : '0.0.0';
                if(versionCompare(appVersion,sinceVersion,'>=')){  //新版本
                    switch (viewName){
                        case 'home':
                        case 'login':
                        case 'help':
                        case 'tickets':
                            getHsbank().gotoView(viewName);
                            break;
                        case 'invest':
                            getHsbank().invest('');
                            break;
                        default :
                            getHsbank().gotoView('home');
                    }
                }else{  //老版本
                    switch (viewName){
                        case 'login':
                            getHsbank().toLoginVC();
                            break;
                        case 'invest':
                            getHsbank().investProject();
                            break;
                        case 'home':
                        default :
                            getHsbank().toAppHome();
                    }
                }

            }
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Common#toHome
         * @methodOf hsWechat.services.Common
         * @description
         *  跳转首页
         */
        this.toHome = toHome;
        function toHome(){
            if(inApp()){
                gotoAppView('home');
            }else{
                $state.go('home.main');
            }
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#toHome
         * @methodOf hsWechat.services.Common
         * @description
         *  跳转登录
         */
        this.toLogin = toLogin;
        function toLogin(){
            if(inApp()){
                gotoAppView('login')
            }else{
                $state.go('sign.main');
            }
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#toInvest
         * @methodOf hsWechat.services.Common
         * @param {string} projectId 项目Id
         * @description
         *  跳转投资
         */
        this.toInvest = toInvest;
        function toInvest(projectId){
            if(inApp()){
                gotoAppView('invest')
            }else{
                $state.go('invest.list');
            }
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Common#toTicket
         * @methodOf hsWechat.services.Common
         * @description
         *  跳转卡券
         */
        this.toTicket = toTicket;
        function toTicket(){
            if(inApp()){
                gotoAppView('tickets');
            }else{
                $state.go('account.ticket.main');
            }
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getServerConfig
         * @methodOf hsWechat.services.Common
         * @description
         *  获取APP配置
         */
        this.getServerConfig = getServerConfig;
        function getServerConfig(){
            return $window.SERVERCONF;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getActivityConfig
         * @methodOf hsWechat.services.Common
         * @description
         *  获取活动数据
         */
        this.getActivityConfig = getActivityConfig;
        function getActivityConfig(){
            return $window.ACTIVITYCONF;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#isMobile
         * @methodOf hsWechat.services.Common
         * @description
         * validate mobile
         * @example
         * <pre>
         *     Yeepay.isMobile(name,idCardNo,mobile).then(function(res) {
         *          //res = isMobile
         *     }, function(reason) {
         *          //reason.data = '获取失败'
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         *
         * @return {promise} promise Common isMobile
         */
        this.isMobile = isMobile;
        function isMobile(mobile) {
            var d = $q.defer();
            $http.post(Config.apiPath.common.isMobile, {mobile: mobile}).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#mobileFilter
         * @methodOf hsWechat.services.Common
         * @description
         * filter \D
         * @example
         * <pre>
         * </pre>
         * @param {String} mobile 手机号码
         * @return filter mobile
         */
        this.mobileFilter = mobileFilter;
        function mobileFilter(m){
            return m.replace('+86','').replace(/\D/g,'');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#darkMobile
         * @methodOf hsWechat.services.Common
         * @description
         *  模糊手机号码中间4位
         */
        this.darkMobile = darkMobile;
        function darkMobile(mobile){
            if(mobile) {
                return mobile.substring(0, 3) + '****' + mobile.substring(7);
            }else{
                return '';
            }
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getChannel
         * @methodOf hsWechat.services.Common
         * @description
         * 获取渠道
         */
        this.getChannel = getChannel;
        function getChannel(){
            return localStorageService.get('channel');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#setChannel
         * @methodOf hsWechat.services.Common
         * @description
         * 设置渠道
         */
        this.setChannel = setChannel;
        function setChannel(channel){
            localStorageService.set('channel',channel);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getInviteMobile
         * @methodOf hsWechat.services.Common
         * @description
         * 获取推荐人加密手机号码
         */
        this.getInviteMobile = getInviteMobile;
        function getInviteMobile(){
            return localStorageService.get('m');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getDecodeInviteMobile
         * @methodOf hsWechat.services.Common
         * @description
         * 获取解码推荐人手机号码
         */
        this.getDecodeInviteMobile = getDecodeInviteMobile;
        function getDecodeInviteMobile(){
            var m = localStorageService.get('m');
            if(m) return $base64.decode(m);
            return m;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#setInviteMobile
         * @methodOf hsWechat.services.Common
         * @description
         * 设置加密手机号码
         */
        this.setInviteMobile = setInviteMobile;
        function setInviteMobile(m){
            localStorageService.set('m',m);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getLotteryInfo
         * @methodOf hsWechat.services.Common
         * @description
         * 获取抽奖信息，有效期30分钟可再次抽奖
         */
        this.getLotteryInfo = getLotteryInfo;
        function getLotteryInfo(){
            var lotteryInfo = localStorageService.get('lotteryInfo');

            if(lotteryInfo && lotteryInfo.timeout > new Date().getTime())
                return lotteryInfo.data;
            return undefined;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#setLotteryInfo
         * @methodOf hsWechat.services.Common
         * @description
         * 设置抽奖信息，有效期30分钟
         */
        this.setLotteryInfo = setLotteryInfo;
        function setLotteryInfo(data){
            var lotteryInfo = {
                data : data,
                timeout : new Date().getTime() + 30*60*1000
            };
            localStorageService.set('lotteryInfo',lotteryInfo);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#removeLotteryInfo
         * @methodOf hsWechat.services.Common
         * @description
         * 删除抽奖信息
         */
        this.removeLotteryInfo = removeLotteryInfo;
        function removeLotteryInfo(){
            localStorageService.remove('lotteryInfo');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#inApp
         * @methodOf hsWechat.services.Common
         * @description
         * 判断是否在APP中运行
         */
        this.inApp = inApp;
        function inApp(){
            return !!$window.hsbank;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getHsbank
         * @methodOf hsWechat.services.Common
         * @description
         * 获取APP中的对象
         */
        this.getHsbank = getHsbank;
        function getHsbank(){
            return $window.hsbank;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#hsbankLog
         * @methodOf hsWechat.services.Common
         * @description
         * APP打印log
         */
        this.hsbankLog = hsbankLog;
        function hsbankLog(str){
            if(inApp()){
                getHsbank().log(str);
            }
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#encodeBase64
         * @methodOf hsWechat.services.Common
         * @description
         * BASE64 加密
         */
        this.encodeBase64 = encodeBase64;
        function encodeBase64(v){
            return $base64.encode(v);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#encodeBase64
         * @methodOf hsWechat.services.Common
         * @description
         * BASE64 解密
         */
        this.decodeBase64 = decodeBase64;
        function decodeBase64(v){
            return $base64.decode(v);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getChannelUserId
         * @methodOf hsWechat.services.Common
         * @description
         * 获取渠道用户ID
         */
        this.getChannelUserId = getChannelUserId;
        function getChannelUserId(){
            return localStorageService.get('subid');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#setChannelUserId
         * @methodOf hsWechat.services.Common
         * @param {string} subid 渠道用户ID
         * @description
         * 设置渠道用户ID
         */
        this.setChannelUserId = setChannelUserId;
        function setChannelUserId(subid){
            localStorageService.set('subid',subid);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#getRegm
         * @methodOf hsWechat.services.Common
         * @description
         * 注册用户手机号
         */
        this.getRegm = getRegm;
        function getRegm(){
            return localStorageService.get('regm');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#setRegm
         * @methodOf hsWechat.services.Common
         * @param {string} regm 用户手机号
         * @description
         * 注册用户手机号
         */
        this.setRegm = setRegm;
        function setRegm(regm){
            localStorageService.set('regm',regm);
        }

    }
    hsWechatServices.service('Common', Common);
})(angular, hsWechatServices);