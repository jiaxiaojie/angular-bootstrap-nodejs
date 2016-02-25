(function (angular, hsWechatServices) {
    /**
     * @ngdoc service
     * @name hsWechat.services.SmsCode
     * @requires $http
     * @requires $q
     * @requires hsWechat.services.Config
     * @description
     * 验证码相关服务
     */
    SmsCode.$inject = ['$http', '$q', 'Config'];
    function SmsCode($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.SmsCode#sendSmsCode
         * @methodOf hsWechat.services.SmsCode
         *
         * @description
         * send sms code
         *
         * @example
         * <pre>
         *     SmsCode.sendSmsCode(mobile).then(function(res){
         *          //res == true
         *     }, then(res){
         *          //res == '请30秒后，再发送'
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         *
         * @returns {promise} promise true for success send
         */
        this.sendSmsCode = sendSmsCode;
        function sendSmsCode(mobile){
            var d = $q.defer();

            $http.post(Config.apiPath.account.sendSmsCode, {mobile:mobile}).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                if(reason.status == 499) {
                    d.resolve(reason.data);
                } else {
                    d.reject(reason);
                }
            });
            return d.promise;
        }
    }

    hsWechatServices.service('SmsCode', SmsCode);
})(angular, hsWechatServices);