(function (angular, hsWechatServices) {

    /**
     * @ngdoc service
     * @name hsWechat.services.Event
     *
     * @requires $q
     * @requires $http
     */
    ActivityProvider.$inject = [];
    function ActivityProvider() {

        var event = {},
            internalArr = ['Config','$q','$http']; //内置Service对象
        /**
         * @ngdoc function
         * @name hsWechat.provider.ActivityProvider#pushFn
         * @methodOf hsWechat.provider.ActivityProvider
         * @description
         * Activity服务添加业务
         * @example
         * <pre>
         *     ActivityProvider.pushFn('XXX',function(){
         *     });
         * </pre>
         * @param {String} arr 业务名称
         * @param {function} fn 业务逻辑
         */
        this.pushFn = function(name,fn){
            event[name] = fn;
        };
        /**
         * @ngdoc function
         * @name hsWechat.provider.ActivityProvider#addAttribute
         * @methodOf hsWechat.provider.ActivityProvider
         * @description
         * 增加内置服务对象
         * @example
         * <pre>
         *     ActivityProvider.addAttribute([]);
         * </pre>
         * @param {String[]} arr 内置服务名称
         */
        this.pushServices  = pushServices;
        function pushServices(arr){
            internalArr = internalArr.concat(arr);
        }

        this.$get = $get;
        $get.$inject = ['$injector'];
        function $get($injector) {
            return angular.extend(event, {
                getService: function(name) {
                    return $injector.get(name);
                }},
                function getAllInternalObject(){
                    var obj={};
                    angular.forEach(internalArr,function(o){
                        obj[o] =  $injector.get(o);
                    });
                    return obj;
                }()
            );
        }
    }

    hsWechatServices.provider('Activity', ActivityProvider);

})(angular, hsWechatServices);
