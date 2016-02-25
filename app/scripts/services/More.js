(function (angular, hsWechatServices) {

    /**
     * @ngdoc service
     * @name hsWechat.services.More
     *
     * @requires $http
     * @requires $q
     */
    More.$inject = ['$http', '$q', 'Config'];
    function More($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Event#getActivityPageList
         * @methodOf hsWechat.services.Event
         *
         * @example
         * <pre>
         *      More.getActivityPageList(10,1).then(function(res) {
         *          res = data;
         *      }, function(reason) {
         *          reason = reason;
         *      });
         * </pre>
         *
         * @description
         * 获取活动分页列表
         *
         * @return {promise} promise the activity pageList with basic fields
         */
        this.getActivityPageList = getActivityPageList;
        function getActivityPageList(pageSize, pageNumber) {
            var d = $q.defer();

            if(!angular.isNumber(pageSize) || pageSize < 1){
                pageSize = Config.constants.page.defaultPageSize;
            }
            if(!angular.isNumber(pageNumber) || pageNumber < 1){
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.more.activityPageList, {pageSize:pageSize, pageNumber: pageNumber}).then(function (res) {
                var activityPageList = res;
                if(activitiesHaveBasicFields(activityPageList)) {
                    d.resolve(activityPageList);
                } else {
                    d.reject('system error');
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object|Object[]} activities
         * @param {string|string[]} otherFields
         * @return {Boolean}
         */
        function activitiesHaveBasicFields(activities, otherFields) {
            if (!angular.isArray(activities)) {
                activities = [activities];
            }
            var fields = ['imageUrl','title','type','target'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in activities){
                var activity = activities[i];
                for(var j in fields){
                    if(!angular.isDefined(activity[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }
    }

    hsWechatServices.service('More', More);

})(angular, hsWechatServices);
