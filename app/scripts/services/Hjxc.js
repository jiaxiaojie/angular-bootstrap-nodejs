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
    Hjxc.$inject = ['$http', '$q', '$window'];
    function Hjxc($http, $q, $window) {
        /**
         * @ngdoc function
         * @name hsWechat.services.Hjxc#grantTicket
         * @methodOf hsWechat.services.Hjxc
         *
         * @description
         * grantTicket
         *
         *  @param customerMobile
         *  @param channelCode
         *  @param timestamp
         *  @param verifyCode
         *
         * @example
         * <pre>
         *      Hjxc.grantTicket().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise grantTicket
         */
        this.grantTicket = grantTicket;
        function grantTicket(customerMobile, channelCode, timestamp, verifyCode) {
            var d = $q.defer();
            $http.post($window.SERVERCONF.hjxc.grantTicket, {
                customerMobile: customerMobile,
                channelCode: channelCode,
                timestamp: timestamp,
                verifyCode: verifyCode
            }).then(function (resp) {
                if(resp.data.code == 1){
                    d.resolve(resp.data.ticket);
                }else{
                    d.reject(resp.data);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Hjxc#queryTicketInfosByMobile
         * @methodOf hsWechat.services.Hjxc
         *
         * @description
         * queryTicketInfosByMobile
         *
         *  @param customerMobile
         *  @param timestamp
         *  @param verifyCode
         *  @param channelCode
         *
         * @example
         * <pre>
         *      Hjxc.queryTicketInfosByMobile().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise queryTicketInfosByMobile
         */
        this.queryTicketInfosByMobile = queryTicketInfosByMobile;
        function queryTicketInfosByMobile(customerMobile, channelCode, timestamp, verifyCode) {
            var d = $q.defer();
            $http.post($window.SERVERCONF.hjxc.queryTicketInfosByMobile, {
                customerMobile: customerMobile,
                channelCode: channelCode,
                timestamp: timestamp,
                verifyCode: verifyCode
            }).then(function (resp) {
                if(resp.data.code == 1){
                    d.resolve(resp.data.tickets);
                }else{
                    d.reject(resp.data);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }
    }
    hsWechatServices.service('Hjxc', Hjxc);
})(angular, hsWechatServices);