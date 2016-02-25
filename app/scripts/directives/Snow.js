(function (angular, hsWechatDirectives) {



    /**
     * @ngdoc service
     * @name hsWechat.services.Snow
     * @requires $rootScope
     * @requires $timeout
     * @description
     * 提供Snow的相关服务
     */
    SnowService.$inject = ['$window','$rootScope'];
    function SnowService($window,$rootScope) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Common#toHome
         * @param n {number} 雪花密度
         * @param s {number} 下落速度
         * @description
         *  跳转登录
         */
        this.start = start;
        function start($scope,n){
            $window.createSnow('images/app/friend/', n);
            $scope.$on('$destroy',function(){
                remove();
            });
        }

        this.remove = remove;
        function remove(){
            $window.removeSnow();
        }
    }

    hsWechatDirectives.service('Snow',SnowService);
})(angular, hsWechatDirectives);