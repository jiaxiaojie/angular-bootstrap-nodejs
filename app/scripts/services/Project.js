(function (angular, hsWechatServices) {

    /**
     * @ngdoc service
     * @name hsWechat.services.Project
     *
     * @requires $q
     * @requires $http
     */
    Project.$inject = ['$http', '$q', 'Config'];
    function Project($http, $q, Config) {

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object|Object[]} projects
         * @param {string|string[]} otherFields
         * @return {Boolean}
         */
        function projectsHaveBasicFields(projects, otherFields) {
            return true;
            if (!angular.isArray(projects)) {
                projects = [projects];
            }
            var fields = ['projectId','projectName','projectType','projectTypeName','repaymentMode','repaymentModeName','amount','rate','status','statusName','annualizedRate','projectDuration','safeguardMode','safeguardModeName','isNewUser','isRecommend','isUseTicket','isCanAssign'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in projects){
                var project = projects[i];
                for(var j in fields){
                    if(!angular.isDefined(project[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object|Object[]} projectDetail
         * @param {string|string[]} otherFields
         * @return {Boolean}
         */
        function projectDetailHaveBasicFields(projectDetail, otherFields) {
            var fields = ['projectId','projectName','projectType','projectTypeName','repaymentMode','repaymentModeName','planAmount','amount','rate','status','statusName','annualizedRate','borrowersUser','projectDuration','startingAmount','biddingDeadline','projectIntroduce','useMethod','transferCode','transferConstraint','riskInfo','investmentCount','isNewUser','isRecommend','isUseTicket','isCanAssign'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in fields){
                if(!angular.isDefined(projectDetail[fields[i]])){
                    return false;
                }
            }
            return true;
        }

        /**
         * @description all projects must have the right type code
         *
         * @param {Object|Object[]} projects projects
         * @param {number} type type code
         * @returns {boolean}
         */
        function projectsTypeError(projects, type){
            if (!angular.isArray(projects)) {
                projects = [projects];
            }
            if((typeof type == 'undefined') || type-0 <= 0)return false;
            for(i in projects){
                var project = projects[i];
                if(project.projectTypeCode != type){
                    return true;
                }
            }
            return false;
        }

        /**
         * @description check the plan fields
         * @param {Object|Object[]} items list items
         * @param {String[]=} otherFields more fields
         * @returns {boolean} false when fields're missing
         */
        function checkProjectRepaymentPlanFields(items, otherFields){
            if (!angular.isArray(items)) {
                items = [items];
            }
            var fields = ['planDate', 'planMoney', 'principal', 'interest', 'remainingPrincipal', 'status'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(i in items){
                var item = items[i];
                for(j in fields){
                    if(!angular.isDefined(item[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * @description check the invest records fields
         * @param {Object|Object[]} items list items
         * @param {String[]=} otherFields more fields
         * @returns {boolean} false when fields're missing
         */
        function checkInvestRecordsFields(items, otherFields){
            if (!angular.isArray(items)) {
                items = [items];
            }
            var fields = ['investmentUser', 'opTerm', 'opDt', 'amount'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(i in items){
                var item = items[i];
                for(j in fields){
                    if(!angular.isDefined(item[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#getRecommendProjects
         * @methodOf hsWechat.services.Project
         *
         * @description
         * get the recommend projects on the home screen
         *
         * @example
         * <pre>
         *     Project.getRecommendProjects().then(function(projects){
         *          $scope.recommendProjects = projects;
         *     });
         * </pre>
         *
         * @returns {promise} promise the projects with basic fields
         */
        this.getRecommendProjects = getRecommendProjects;
        function getRecommendProjects() {
            var d = $q.defer();
            $http.post(Config.apiPath.project.recommend).then(function (res) {
                var projects = res;
                if (!(projects instanceof Array) || !projectsHaveBasicFields(projects)) {
                    d.reject('system error');
                } else {
                    d.resolve(projects);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#getProjectsPageList
         * @methodOf hsWechat.services.Project
         *
         * @description
         * get all projects from server
         *
         * @example
         * <pre>
         *     Project.getProjectsPageList().then(function(projects){
         *          $scope.projects = projects;
         *     });
         * </pre>
         * @param {number} pageSize 页容量
         * @param {number} pageNumber 页码
         *
         * @returns {promise} promise the projects with basic fields
         */
        this.getProjectsPageList = getProjectsPageList;
        function getProjectsPageList(pageSize, pageNumber) {
            var d = $q.defer();

            if(!angular.isNumber(pageSize) || pageSize < 1){
                pageSize = Config.constants.page.defaultPageSize;
            }
            if(!angular.isNumber(pageNumber) || pageNumber < 1){
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.project.pageList, {pageSize:pageSize, pageNumber: pageNumber}).then(function (res) {
                var projects = res;
                //if (!(projects instanceof Array) || !projectsHaveBasicFields(projects) || projectsTypeError(projects, type)) {
                if (!(projects instanceof Array) || !projectsHaveBasicFields(projects)) {
                    d.reject('system error');
                } else {
                    d.resolve(projects);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#getProjectDetail
         * @methodOf hsWechat.services.Project
         *
         * @description
         * get one project detail from server
         *
         * @example
         * <pre>
         *     Project.getProjectDetail().then(function(project){
         *          $scope.project = project;
         *     });
         * </pre>
         *
         * @param {number} projectId interger db primary key
         *
         * @returns {promise} promise the project with all fields
         */
        this.getProjectDetail = getProjectDetail;
        function getProjectDetail(projectId) {
            var d = $q.defer();

            if(isNaN(projectId) || projectId<1){
                d.reject('arg error');
                return d.promise;
            } else {
                projectId -= 0;
            }

            $http.post(Config.apiPath.project.detail, {projectId: projectId}).then(function (res) {
                var project = res;
                if ( !projectDetailHaveBasicFields(project)) {
                    d.reject('system error');
                } else {
                    d.resolve(project);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#getProjectRepaymentPlan
         * @methodOf hsWechat.services.Project
         *
         * @description
         * get one project detail from server
         *
         * @example
         * <pre>
         *     Project.getProjectDetail().then(function(project){
         *          $scope.project = project;
         *     });
         * </pre>
         *
         * @param {number} projectId interger db primary key
         *
         * @returns {promise} promise the plan list
         */
        this.getProjectRepaymentPlan = getProjectRepaymentPlan;
        function getProjectRepaymentPlan(projectId){
            var d = $q.defer();

            if(isNaN(projectId) || projectId<1){
                d.reject('arg error');
                return d.promise;
            } else {
                projectId -= 0;
            }

            $http.post(Config.apiPath.project.repaymentPlan, {projectId: projectId}).then(function (res) {
                var list = res;
                if (! angular.isArray(list) || !checkProjectRepaymentPlanFields(list)) {
                    d.reject('system error');
                } else {
                    d.resolve(list);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#getInvestmentRecords
         * @methodOf hsWechat.services.Project
         *
         * @description
         * get one project detail from server
         *
         * @example
         * <pre>
         *     Project.getProjectDetail().then(function(project){
         *          $scope.project = project;
         *     });
         * </pre>
         *
         * @param {number} projectId interger db primary key
         * @param {number} start pagination
         * @param {number} limit pagination
         *
         * @returns {promise} promise invest list
         */
        this.getInvestmentRecords = getInvestmentRecords;
        function getInvestmentRecords(projectId) {
            var d = $q.defer();

            if(isNaN(projectId) || projectId<1){
                d.reject('arg error');
                return d.promise;
            } else {
                projectId -= 0;
            }

            $http.post(Config.apiPath.project.investmentRecords, {projectId:projectId}).then(function (res) {
                var list = res;
                if (! angular.isArray(list) || !checkInvestRecordsFields(list)) {
                    d.reject('system error');
                } else {
                    d.resolve(list);
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#interestCalculation
         * @methodOf hsWechat.services.Project
         *
         * @description
         * 收益计算
         *
         * @example
         * <pre>
         *     Project.interestCalculation(projectId, amount).then(function(res){
         *          res = 100;
         *     }, function(reason) {
         *          reason = '计算失败';
         *     });;
         * </pre>
         *
         * @param {int} projectId integer db primary key
         * @param {number} amount
         *
         * @returns {promise} promise interest
         */
        this.interestCalculation = interestCalculation;
        function interestCalculation(projectId, amount) {
            var d = $q.defer();

            if(isNaN(projectId) || projectId<1 || isNaN(amount)){
                d.reject('arg error');
                return d.promise;
            } else {
                projectId -= 0;
            }

            $http.post(Config.apiPath.project.interestCalculation, {projectId:projectId, amount:amount}).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Project#getAgreement
         * @methodOf hsWechat.services.Project
         *
         * @description
         * 获取借款协议
         *
         * @param {int} projectId integer db primary key
         * @param {number} amount
         *
         * @example
         * <pre>
         *     Project.getAgreement().then(function(res){
         *
         *     }, function(reason) {
         *
         *     });
         * </pre>
         *
         *
         * @returns {promise} promise
         */
        this.getAgreement = getAgreement;
        function getAgreement(projectId, amount) {
            var d = $q.defer();
            $http.post(Config.apiPath.agreement.investment, {projectId:projectId, amount:amount}).then(function (res) {
                d.resolve(res);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }



        function getAllTransfers(start, limit, order) {

        }

        function getTransferDetail(transferId) {

        }

        function getTransferRecords(transferId, start, limit) {

        }
    }

    hsWechatServices.service('Project', Project);

})(angular, hsWechatServices);
