(function(angular, hsLib){

    /**
     * @ngdoc service
     * @name hsWechat.services.Log
     * @description
     *  日志Provide
     */
    LogProvide.$inject = [];
    function LogProvide() {


        /**
         * Log service
         */
        this.$get = $get;
        $get.$inject = ['$window','$injector'];
        function $get($window,$injector){
            var config;

            //初始化配置
            function init(options) {
                config = !$window.LOGCONF.allowReplace ? $window.LOGCONF :
                    angular.extend({}, $window.LOGCONF, options);
            }
            {//init config and override window.alert
                init();
                if (!!config.alertLevel) {
                    $window.alert = function (str) {
                        log(config.alertLevel)(str);
                    }
                }
            }

            function formatError(arg) {
                if (arg instanceof Error) {
                    if (arg.stack) {
                        arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                            ? 'Error: ' + arg.message + '\n' + arg.stack
                            : arg.stack;
                    } else if (arg.sourceURL) {
                        arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                    }
                }
                return arg;
            }


            //日志处理
            function log(level) {
                return function(arg){
                    if (!config.enabled) return;
                    level = level || config.defaultLevel;
                    var msg = formatError(arg); //异常信息
                    if (!!config.consolePrint) { //打印控制台信息
                        console[level](msg);
                    }

                    var $http = $injector.get('$http'),
                        localStorageService = $injector.get('localStorageService');
                    /**
                     * 获取当前用户的手机号码
                     */
                    function getCurrentMobile(){
                        if(localStorageService.get("account.token") && localStorageService.get('account.info')){ //已登录
                            return localStorageService.get('account.info').mobile;
                        }
                        return "";
                    }

                    /**
                     * 获取客户端唯一ID
                     */
                    function getClientId(){
                        var clientId = localStorageService.get('clientId');
                        if(!clientId){
                            var clientId = new Date().getTime() + "" + Math.round(2<<20);
                            localStorageService.set('clientId',clientId);
                        }
                        return clientId;
                    }

                    angular.forEach(config.appenders, function (o) {
                        var ls = o.levels;
                        for (var i = 0; i < ls.length; i++) {
                            if (ls[i] == level) { //日志发送
                                var data = {
                                    t: new Date().getTime(),//当前时间毫秒数
                                    s: msg, //日志信息
                                    level: level, //日志级别
                                    clientId : getClientId(), //客户端唯一ID
                                    mobile : getCurrentMobile(),//用户手机号
                                    ua : new UAParser().getUA()//User Agent
                                };
                                $http.post(o.remote, data);
                                break;
                            }
                        }
                    });
                };
            }

            return {
                init : init,
                log: log('log'),
                debug: log('debug'),
                info: log('info'),
                warn: log('warn'),
                error: log('error')
            }
        }
    }
    hsLib.provider('Log', LogProvide);
})(angular, hsLib);