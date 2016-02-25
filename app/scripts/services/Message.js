(function (angular, hsWechatServices) {
    /**
     * @ngdoc service
     * @name hsWechat.services.Current
     * @requires $http
     * @requires $q
     * @requires hsWechat.services.Config
     * @description
     * 消息服务
     */
    Message.$inject = ['$http', '$q', 'Config'];
    function Message($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Message#accountMessagePageList
         * @methodOf hsWechat.services.Message
         *
         * @description
         * 我的消息-账户消息分页列表
         *
         *  @param  pageSize
         *  @param  pageNumber
         *
         * @example
         * <pre>
         *      Message.accountMessagePageList(pageSize,pageNumber).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.accountMessagePageList = accountMessagePageList;
        function accountMessagePageList(pageSize,pageNumber) {
            var d = $q.defer();
            $http.post(Config.apiPath.message.accountMessagePageList, {
                pageSize: pageSize,
                pageNumber: pageNumber
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Message#systemMessagePageList
         * @methodOf hsWechat.services.Message
         *
         * @description
         * 我的消息-系统消息分页列表
         *
         *  @param  pageSize
         *  @param  pageNumber
         *
         * @example
         * <pre>
         *      Message.systemMessagePageList(pageSize,pageNumber).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.systemMessagePageList = systemMessagePageList;
        function systemMessagePageList(pageSize,pageNumber) {
            var d = $q.defer();
            $http.post(Config.apiPath.message.systemMessagePageList, {
                pageSize: pageSize,
                pageNumber: pageNumber
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Message#read
         * @methodOf hsWechat.services.Message
         *
         * @description
         * 标记已读
         *
         *  @param  messageIds
         *
         * @example
         * <pre>
         *      Message.read(messageIds).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.read = read;
        function read(messageIds) {
            var d = $q.defer();
            $http.post(Config.apiPath.message.read, {
                messageIds: messageIds
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

    }

    hsWechatServices.service('Message', Message);
})(angular, hsWechatServices);