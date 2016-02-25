(function (angular, hsWechatServices) {
    /**
     * @ngdoc service
     * @name hsWechat.services.Current
     * @requires $http
     * @requires $q
     * @requires hsWechat.services.Config
     * @description
     * 活花生服务
     */
    Current.$inject = ['$http', '$q', 'Config'];
    function Current($http, $q, Config) {

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#getCurrentProjectDetail
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 得到指定活期项目的详情信息
         *
         *  @param  projectId
         *
         * @example
         * <pre>
         *      Peanut.getCurrentProjectDetail(projectId).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.getCurrentProjectDetail = getCurrentProjectDetail;
        function getCurrentProjectDetail(projectId) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.detail, {
                projectId: projectId
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#interestCalculation
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 活期收益计算
         *
         *  @param  projectId
         *  @param  amount
         *
         * @example
         * <pre>
         *      Peanut.interestCalculation(projectId,amount).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.interestCalculation = interestCalculation;
        function interestCalculation(projectId,amount) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.interestCalculation, {
                projectId: projectId,
                amount: amount
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#myCurrent
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 我的活花生
         *
         * @example
         * <pre>
         *      Peanut.myCurrent().then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.myCurrent = myCurrent;
        function myCurrent() {
            var d = $q.defer();
            $http.post(Config.apiPath.current.myCurrent, {
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#myCurrentDetail
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 我的活花生--项目详情
         *
         * @param  projectId
         *
         * @example
         * <pre>
         *      Peanut.myCurrentDetail(projectId).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.myCurrentDetail = myCurrentDetail;
        function myCurrentDetail(projectId) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.myCurrentDetail, {
                projectId: projectId
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#myCurrentInterestPageList
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 指定活花生项目的利息变化（收息或赎回）分页列表
         *
         * @param  pageSize
         * @param  pageNumber
         * @param  projectId
         * @param  changeType
         *
         * @example
         * <pre>
         *      Peanut.myCurrentInterestPageList(pageSize,pageNumber,projectId,changeType).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.myCurrentInterestPageList = myCurrentInterestPageList;
        function myCurrentInterestPageList(pageSize,pageNumber,projectId,changeType) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.myCurrentInterestPageList, {
                pageSize: pageSize,
                pageNumber: pageNumber,
                projectId: projectId,
                changeType: changeType
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#myCurrentPrincipalPageList
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 指定活花生项目的本金变化（投资或赎回）分页列表
         *
         * @param  pageSize
         * @param  pageNumber
         * @param  projectId
         * @param  changeType
         *
         * @example
         * <pre>
         *      Peanut.myCurrentPrincipalPageList(pageSize,pageNumber,projectId,changeType).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.myCurrentPrincipalPageList = myCurrentPrincipalPageList;
        function myCurrentPrincipalPageList(pageSize,pageNumber,projectId,changeType) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.myCurrentPrincipalPageList, {
                pageSize: pageSize,
                pageNumber: pageNumber,
                projectId: projectId,
                changeType: changeType
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#pageList
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 活期项目分页列表
         *
         * @param  pageSize
         * @param  pageNumber
         *
         * @example
         * <pre>
         *      Peanut.pageList(pageSize,pageNumber).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.pageList = pageList;
        function pageList(pageSize,pageNumber) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.pageList, {
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
         * @name hsWechat.services.Peanut#redeemInterest
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 提取收益
         *
         * @param  projectId
         * @param  amount
         *
         * @example
         * <pre>
         *      Peanut.redeemInterest(projectId,amount).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.redeemInterest = redeemInterest;
        function redeemInterest(projectId,amount) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.redeemInterest, {
                projectId: projectId,
                amount: amount
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#redeemPrincipal
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 赎回本金
         *
         * @param  projectId
         * @param  amount
         *
         * @example
         * <pre>
         *      Peanut.redeemPrincipal(projectId,amount).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.redeemPrincipal = redeemPrincipal;
        function redeemPrincipal(projectId,amount) {
            var d = $q.defer();
            $http.post(Config.apiPath.current.redeemPrincipal, {
                projectId: projectId,
                amount: amount
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Peanut#getCurrentAgreement
         * @methodOf hsWechat.services.Current
         *
         * @description
         * 获取活期产品协议
         *
         * @param  projectId
         *
         * @example
         * <pre>
         *      Peanut.getCurrentAgreement(projectId,amount).then(function(res) {
         *           d.resolve(res);
         *      }, function(reason) {
         *          d.reject(reason);
         *      });
         * </pre>
         * @returns {promise} promise
         */
        this.getCurrentAgreement = getCurrentAgreement;
        function getCurrentAgreement(projectId) {
            var d = $q.defer();
            $http.post(Config.apiPath.agreement.current, {
                projectId: projectId
            }).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }


    }

    hsWechatServices.service('Current', Current);
})(angular, hsWechatServices);