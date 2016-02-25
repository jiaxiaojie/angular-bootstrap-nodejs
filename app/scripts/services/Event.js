(function (angular, hsWechatServices) {

    /**
     * @ngdoc service
     * @name hsWechat.services.Event
     *
     * @requires $q
     * @requires $http
     */
    Event.$inject = ['$http', '$q', 'Config'];
    function Event($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Event#getRecommendEvents
         * @methodOf hsWechat.services.Event
         *
         * @description
         * get recommend event list
         *
         * @return {promise} promise the events with basic fields
         */
        this.getRecommendEvents = getRecommendEvents;
        function getRecommendEvents() {
            var d = $q.defer();
            $http.post(Config.apiPath.event.recommend).then(function (res) {
                d.resolve(res);
            }, function (res) {
                d.reject(res);
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Event#lottery
         * @methodOf hsWechat.services.Event
         *
         * @description
         * lottery
         * @return {promise} promise the events with basic fields
         */
        this.lottery = lottery;
        function lottery() {
            var d = $q.defer();
            $http.post(Config.apiPath.event.lottery).then(function (res) {
                d.resolve(res);
            }, function (res) {
                d.reject(res);
            });
            return d.promise;
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Event#getLotteryPrizeList
         * @methodOf hsWechat.services.Event
         * @description
         * getLotteryPrizeList
         * @return {promise} promise the events with basic fields
         */
        this.getLotteryPrizeList = getLotteryPrizeList;
        function getLotteryPrizeList() {
            var d = $q.defer();
            $http.post(Config.apiPath.event.lotteryPrizeList).then(function (res) {
                d.resolve(res);
            }, function (res) {
                d.reject(res);
            });
            return d.promise;
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Event#getInvestmentList
         * @methodOf hsWechat.services.Event
         * @param type{string} 类型（week:周排行；month:月排行）
         * @param year{string} 年份
         * @param month{string} 月份
         * @param month{string} 当月第N周
         * @description
         * 投资排行
         * @return {promise} promise the events with basic fields
         */
        this.getInvestmentList = getInvestmentList;
        function getInvestmentList(type) {
            var d = $q.defer();
            $http.post(Config.apiPath.event.investmentList,{type:type}).then(function (res) {
                d.resolve(res);
            }, function (res) {
                d.reject(res);
            });
            return d.promise;
        }
    }

    hsWechatServices.service('Event', Event);

})(angular, hsWechatServices);
