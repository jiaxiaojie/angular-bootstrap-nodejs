(function (angular, hsWechatServices) {

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
    Yeepay.$inject = ['$http', '$q', 'Config'];
    function Yeepay($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#getRegisterUrl
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * Get the Yeepay register url
         *
         * @example
         * <pre>
         *     Yeepay.getRegisterUrl(name,idCardNo,mobile).then(function(res) {
         *          //res = url
         *     }, function(reason) {
         *          //reason.data = '获取失败'
         *     });
         * </pre>
         * @param {String} name 真实姓名
         * @param {String} idCardNo 身份证号码
         * @param {String} mobile 手机号码
         *
         * @return {promise} promise Yeepay register url
         */
        this.getRegisterUrl = getRegisterUrl;
        function getRegisterUrl(realName, idCardNo, mobile, callbackUrl) {
            var d = $q.defer();
            $http.post(Config.apiPath.yeepay.toRegister, {
                realName: realName,
                idCardNo: idCardNo,
                mobile: mobile,
                callbackUrl: callbackUrl
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#getBindBankCardUrl
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * Get the Yeepay bind bankCard url
         *
         * @example
         * <pre>
         *     Yeepay.getBindBankCardUrl().then(function(res) {
         *          //res = url
         *     }, function(reason) {
         *          //reason.data = '获取失败'
         *     });
         * </pre>
         *
         * @return {promise} promise Yeepay bind bankCard url
         */
        this.getBindBankCardUrl = getBindBankCardUrl;
        function getBindBankCardUrl(callbackUrl) {
            var d = $q.defer();
            $http.post(Config.apiPath.yeepay.toBindBankCard, {callbackUrl: callbackUrl}).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#getRechargeUrl
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * Get the Yeepay recharge url
         *
         * @example
         * <pre>
         *     Yeepay.getRechargeUrl().then(function(res) {
         *          //res = url
         *     }, function(reason) {
         *          //reason.data = '获取失败'
         *     });
         * </pre>
         * @param {String} amount 充值金额
         *
         * @return {promise} promise Yeepay recharge url
         */
        this.getRechargeUrl = getRechargeUrl;
        function getRechargeUrl(amount, callbackUrl) {
            var d = $q.defer();

            if (isNaN(amount)) {
                d.reject('arg error');
                return d.promise;
            }

            $http.post(Config.apiPath.yeepay.toRecharge, {
                amount: amount,
                callbackUrl: callbackUrl
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#toCurrentInvest
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * 得到易宝平台活期投资的URL
         *
         * @example
         * <pre>
         *     Yeepay.toCurrentInvest().then(function(res) {
         *          //res = url
         *     }, function(reason) {
         *          //reason.data = '获取失败'
         *     });
         * </pre>
         * @param {String} projectId 项目ID
         * @param {String} amount 投资金额
         *
         * @return {promise} promise Yeepay getToInvestUrl url
         */
        this.toCurrentInvest = toCurrentInvest;
        function toCurrentInvest(projectId, amount, callbackUrl) {
            var d = $q.defer();
            if (isNaN(amount)) {
                d.reject('arg error');
                return d.promise;
            }
            $http.post(Config.apiPath.yeepay.toCurrentInvest, {
                projectId: projectId,
                amount: amount,
                callbackUrl: callbackUrl
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#getRechargeUrl
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * Get the Yeepay withdraw url
         *
         * @example
         * <pre>
         *     Yeepay.getWithdrawUrl().then(function(res) {
         *          //res = url
         *     }, function(reason) {
         *          //reason.data = '获取失败'
         *     });
         * </pre>
         * @param {String} amount 提现金额
         *
         * @return {promise} promise Yeepay withdraw url
         */
        this.getWithdrawUrl = getWithdrawUrl;
        function getWithdrawUrl(amount, useTicket, callbackUrl) {
            var d = $q.defer();

            if (isNaN(amount)) {
                d.reject('arg error');
                return d.promise;
            }

            $http.post(Config.apiPath.yeepay.toWithdraw, {
                amount: amount,
                useTicket: useTicket,
                callbackUrl: callbackUrl
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#unbundlingBankCard
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * Get the Yeepay withdraw url
         *
         * @example
         * <pre>
         *
         * </pre>
         *
         * @return {promise} promise Yeepay invest url
         */
        this.unbundlingBankCard = unbundlingBankCard;
        function unbundlingBankCard() {
            var d = $q.defer();
            $http.post(Config.apiPath.yeepay.toUnBindBankCard).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#getWithdrawUrl
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * Get the Yeepay withdraw url
         *
         * @example
         * <pre>
         *
         * </pre>
         * @param {String} projectId 项目Id
         * @param {String} transferProjectId 转让编号
         * @param {String} amount 投资金额
         * @param {String} ticketIds 优惠券Ids
         * @param {String} ticketAmount 优惠券金额
         * @param {String} platformAmount 平台垫付金额
         * @param {String} type 直投（"1"）、债权转让（"2"）
         *
         * @return {promise} promise Yeepay invest url
         */
        this.getWithdrawUrl = getWithdrawUrl;
        function getWithdrawUrl(amount, useTicket, callbackUrl) {
            var d = $q.defer();

            if (isNaN(amount)) {
                d.reject('arg error');
                return d.promise;
            }

            $http.post(Config.apiPath.yeepay.toWithdraw, {
                amount: amount,
                useTicket: useTicket,
                callbackUrl: callbackUrl
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Yeepay#getWithdrawUrl
         * @methodOf hsWechat.services.Yeepay
         *
         * @description
         * 获取平台投资url
         *
         * @example
         * <pre>
         *
         * </pre>
         * @param {String} projectId 项目Id
         * @param {String} transferProjectId 转让编号
         * @param {String} amount 投资金额
         * @param {String} ticketIds 优惠券Ids
         * @param {String} ticketAmount 优惠券金额
         * @param {String} platformAmount 平台垫付金额
         * @param {String} type 直投（"1"）、债权转让（"2"）
         *
         * @return {promise} promise Yeepay invest url
         */
        this.getInvestUrl = getInvestUrl;
        function getInvestUrl(projectId, transferProjectId, amount, ticketIds, ticketAmount, platformAmount, type, callbackUrl) {
            var d = $q.defer();

            if (isNaN(amount)) {
                d.reject('arg error');
                return d.promise;
            }

            $http.post(Config.apiPath.yeepay.toInvest, {
                projectId: projectId,
                transferProjectId: transferProjectId,
                amount: amount,
                ticketIds: ticketIds,
                ticketAmount: ticketAmount,
                platformAmount: platformAmount,
                type: type,
                callbackUrl: callbackUrl
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }
    }

    hsWechatServices.service('Yeepay', Yeepay);
})(angular, hsWechatServices);