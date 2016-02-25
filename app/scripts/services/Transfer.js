(function(angular, hsWechatServices){

    /**
     * @ngdoc service
     * @name hsWechat.services.Transfer
     *
     * @requires $q
     * @requires $http
     * @description
     * 债权转让相关的服务
     */
    Transfer.$inject = ['$http','$q'];
    function Transfer($http,$q){

        /**
         * @ngdoc function
         * @name hsWechat.services.Transfer#getAllTransfer
         * @methodOf hsWechat.services.Transfer
         *
         * @description
         * 获取转让列表
         * @returns {Object|Array} description
         */
        this.getAllTransfer = getAllTransfer;
        function getAllTransfer(start, limit, order){

        }
    }

    hsWechatServices.service('Transfer', Transfer);
})(angular, hsWechatServices);