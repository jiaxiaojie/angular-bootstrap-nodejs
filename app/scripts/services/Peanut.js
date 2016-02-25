(function (angular, hsWechatServices) {

    /**
     * @ngdoc service
     * @name hsWechat.services.Peanut
     *
     * @requires $http
     * @requires $q
     * @requires Config
     */
    Peanut.$inject = ['$http', '$q', 'Config'];
    function Peanut($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#customerAddressAdd
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 新增收件人地址
         *
         *  @param  showName
         *  @param  mobile
         *  @param  address
         *  @param  postCode
         *  @param  isDefault
         *
         * @example
         * <pre>
         *      Peanut.customerAddressAdd().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise customerAddressAdd
         */
        this.customerAddressAdd = customerAddressAdd;
        function customerAddressAdd(showName, mobile, address, postCode, isDefault) {
            var d = $q.defer();
            $http.post(Config.apiPath.account.customerAddressAdd, {
                showName: showName,
                mobile: mobile,
                address: address,
                postCode: postCode,
                isDefault: isDefault
            }).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#customerAddressDelete
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 删除收件人地址
         *
         *  @param showName
         *  @param mobile
         *  @param address
         *  @param postCode
         *  @param isDefault
         *
         * @example
         * <pre>
         *      Peanut.customerAddressDelete().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise customerAddressDelete
         */
        this.customerAddressDelete = customerAddressDelete;
        function customerAddressDelete(addressId) {
            var d = $q.defer();
            $http.post(Config.apiPath.account.customerAddressDelete, {
                addressId: addressId
            }).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#customerAddressEdit
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 修改收件人地址
         *
         *  @param addressId
         *  @param showName
         *  @param mobile
         *  @param address
         *  @param postCode
         *  @param isDefault
         *
         * @example
         * <pre>
         *      Peanut.customerAddressEdit().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise customerAddressEdit
         */
        this.customerAddressEdit = customerAddressEdit;
        function customerAddressEdit(addressId, showName, mobile, address, postCode, isDefault) {
            var d = $q.defer();
            $http.post(Config.apiPath.account.customerAddressEdit, {
                addressId: addressId,
                showName: showName,
                mobile: mobile,
                address: address,
                postCode: postCode,
                isDefault: isDefault
            }).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#customerAddressPageList
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 查询收件人地址分页列表
         *
         *  @param {Integer} pageSize 页容量
         *  @param {Integer} pageNumber 页码
         *
         * @example
         * <pre>
         *      Peanut.customerAddressPageList().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise customerAddressPageList
         */
        this.customerAddressPageList = customerAddressPageList;
        function customerAddressPageList(pageSize, pageNumber) {
            var d = $q.defer();

            if (!angular.isNumber(pageSize) || pageSize < 1) {
                pageSize = Config.constants.page.defaultPageSize;
            }
            if (!angular.isNumber(pageNumber) || pageNumber < 1) {
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.account.customerAddressPageList, {
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
         * @name hsWechat.services.Peanut#confirmOrder
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 确认订单
         *
         *  @param productId
         *  @param productCount
         *  @param addressId
         *
         * @example
         * <pre>
         *      Peanut.confirmOrder().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise confirmOrder
         */
        this.orderConfirm = orderConfirm;
        function orderConfirm(productId, productCount, addressId) {
            var d = $q.defer();
            $http.post(Config.apiPath.account.orderConfirm, {
                productId: productId,
                productCount: productCount,
                addressId: addressId
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#productPageList
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 查询商品分页列表
         *
         *  @param {Integer} pageSize 页容量
         *  @param {Integer} pageNumber 页码
         *
         * @example
         * <pre>
         *      Peanut.customerAddressPageList().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise productPageList
         */
        this.productPageList = productPageList;
        function productPageList(pageSize, pageNumber) {
            var d = $q.defer();

            if (!angular.isNumber(pageSize) || pageSize < 1) {
                pageSize = Config.constants.page.defaultPageSize;
            }
            if (!angular.isNumber(pageNumber) || pageNumber < 1) {
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.mall.productPageList, {
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
         * @name hsWechat.services.Peanut#productDetail
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 查询商品详情
         *
         *  @param productId
         *
         * @example
         * <pre>
         *      Peanut.productDetail().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise productDetail
         */
        this.productDetail = productDetail;
        function productDetail(productId) {
            var d = $q.defer();

            $http.post(Config.apiPath.mall.productDetail, {
                productId: productId
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#orderPageList
         * @methodOf hsWechat.services.Peanut
         *
         * @description
         * 查询兑换记录
         *
         *  @param {Integer} pageSize 页容量
         *  @param {Integer} pageNumber 页码
         *
         * @example
         * <pre>
         *      Peanut.orderPageList().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise orderPageList
         */
        this.orderPageList = orderPageList;
        function orderPageList(pageSize, pageNumber) {
            var d = $q.defer();

            if (!angular.isNumber(pageSize) || pageSize < 1) {
                pageSize = Config.constants.page.defaultPageSize;
            }
            if (!angular.isNumber(pageNumber) || pageNumber < 1) {
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.account.orderPageList, {
                pageSize: pageSize,
                pageNumber: pageNumber
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }
    }
    hsWechatServices.service('Peanut', Peanut);

})(angular, hsWechatServices);
