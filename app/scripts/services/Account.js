(function (angular, hsWechatServices) {
    /**
     * @ngdoc service
     * @name hsWechat.services.Account
     * @requires $http
     * @requires $q
     * @requires localStorageService https://github.com/grevory/angular-local-storage
     * @requires hsWechat.services.Config
     * @description
     * 用户相关的服务
     */
    Account.$inject = ['$http', '$q', 'localStorageService', 'Config'];
    function Account($http, $q ,localStorageService, Config) {

        /**
         * real login into system
         *
         * @param token
         */
        this.setLogin = setLogin;
        function setLogin(token){
            localStorageService.set('account.token', token);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#unsetLogin
         * @methodOf hsWechat.services.Account
         *
         * @description
         * customer exit login
         *
         * @example
         * <pre>
         *     User.unsetLogin()
         * </pre>
         *
         */
        this.unsetLogin = unsetLogin;
        function unsetLogin(){
            localStorageService.remove('account.token');
            localStorageService.remove('account.info');
        }

        function getToken(){
            return localStorageService.get('account.token');
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#refreshAccountInfo
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 更新并返回用户信息
         *
         * @example
         * <pre>
         *     Account.refreshAccountInfo().then(function(res) {
         *          //res = baseInfo
         *     }, function(reason) {
         *          //reason = errorMsg
         *     });
         * </pre>
         *
         * @return {promise} promise whether the account info
         */
        this.refreshAccountInfo = refreshAccountInfo;
        function refreshAccountInfo(){
            var d = $q.defer();
            $http.post(Config.apiPath.account.my).then(function (res) {
                var accountInfo = res;
                if(accountInfoHaveBasicFields(accountInfo)) {
                    localStorageService.set('account.info', accountInfo);
                    d.resolve(accountInfo);
                } else {
                    d.reject('system error');
                }
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#getAccountInfo
         * @methodOf hsWechat services.Account
         *
         * @description
         * 获取用户信息
         *
         * @example
         * <pre>
         *     Account.getAccountInfo().then(function(res) {
         *          //res = {}
         *     });
         * </pre>
         *
         * @return {promise} promise the account baseInfo
         */
        this.getAccountInfo = getAccountInfo;
        function getAccountInfo(){
            var d = $q.defer();
            if(!localStorageService.get('account.info')){
                refreshAccountInfo().then(function(res) {
                    d.resolve(res);
                }, function(reason) {
                    d.reject(reason);
                });
            } else {
                d.resolve(localStorageService.get('account.info'));
            }
            return d.promise;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object|Object[]} accountInfo
         * @param {String|String[]} otherFields
         * @return {Boolean}
         */
        function accountInfoHaveBasicFields(accountInfo, otherFields) {
            var fields = ['accountId','avatar','nickname','customerName','certNum','mobile','email','bankCardNo',
                'netAssets','sumProfit','willProfit','availableBalance','hasSigned','hasRemindOfMsg','hasRemindOfTicket',
                'hasRemindOfReward','hasOpenThirdAccount','hasBindBankCard'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in fields){
                if(angular.isUndefined(accountInfo[fields[i]])){
                    return false;
                }
            }
            return true;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Account#hasRegistered
         * @methodOf hsWechat.services.Account
         *
         * @description
         * check the user registered?
         *
         * @example
         * <pre>
         *     Account.hasRegistered(mobile).then(function(res){
         *          //res == true
         *          //res == false
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         *
         * @returns {promise} promise whether the mobile registered?
         */
        this.hasRegistered = hasRegistered;
        function hasRegistered(mobile){
            var d = $q.defer();

            $http.post(Config.apiPath.account.hasRegistered, {mobile:mobile}).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#register
         * @methodOf hsWechat.services.User
         *
         * @description
         * sign up the customer
         *
         * @example
         * <pre>
         *     Account.register(mobile, password, smscode, invite).then(function(res){
         *          // res == true
         *     }, function(reson){
         *          //reson == '验证码错误 或者 密码不符合规则'
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         * @param {String} password 密码
         * @param {String} smscode 验证码
         * @param {String} invite 邀请码
         *
         * @returns {promise} promise true for success
         */
        this.register = register;
        function register(mobile, password, smsCode, inviteCode,channel,channelUserId,lotteryToken){
            var d = $q.defer();

            var data = {
                mobile:mobile,
                password:password,
                smsCode:smsCode,
            };
            if(inviteCode) data.inviteCode = inviteCode;
            if(channel) data.channel = channel;
            if(lotteryToken) data.lotteryToken = lotteryToken;
            if(channelUserId) data.subid = channelUserId;
            $http.post(Config.apiPath.account.register,data).then(function (res) {
                setLogin(res.token);
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#loginPassword
         * @methodOf hsWechat.services.Account
         *
         * @description
         * sign in the account by password
         *
         * @example
         * <pre>
         *     Account.loginPassword(mobile, password).then(function(res){
         *          // res == true
         *     }, function(reason){
         *          //reason == '用户名或者密码错误'
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         * @param {String} password 密码
         *
         * @returns {promise} promise true for success
         */
        this.loginPassword = loginPassword;
        function loginPassword(mobile, password){
            var d = $q.defer();

            $http.post(Config.apiPath.account.login, {
                mobile:mobile,
                password:password
            }).then(function (res) {
                setLogin(res.token);
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#loginSmsCode
         * @methodOf hsWechat.services.Account
         *
         * @description
         * sign in the account by smsCode
         *
         * @example
         * <pre>
         *     Account.loginSmsCode(mobile, smsCode).then(function(res){
         *          // res == true
         *     }, function(reason){
         *          //reason == '用户名或者短信验证码错误'
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         * @param {String} smsCode 短信验证码
         *
         * @returns {promise} promise true for success
         */
        this.loginSmsCode = loginSmsCode;
        function loginSmsCode(mobile, smsCode){
            var d = $q.defer();

            $http.post(Config.apiPath.account.login, {
                mobile:mobile,
                smsCode:smsCode
            }).then(function (res) {
                setLogin(res.token);
                d.resolve(true);
            }, function (reason) {
                if(reason.status == 499){
                    d.reject(reason.data);
                }else{
                    d.reject(reason);
                }
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#resetPassword
         * @methodOf hsWechat.services.Account
         *
         * @description
         * reset password
         * need smsCode
         *
         * @example
         * <pre>
         *     Account.resetPassword(mobile, smsCode, newPassword).then(function(res){
         *          // res == true
         *     }, function(reason){
         *          //reason == '还没有注册'
         *          //reason == '验证码错误'
         *     });
         * </pre>
         * @param {String} mobile 手机号码
         * @param {string} smsCode 验证码
         * @param {String} newPassword 新密码
         *
         * @returns {promise} promise true for success
         */
        this.resetPassword = resetPassword;
        function resetPassword(mobile, smsCode, newPassword){
            var d = $q.defer();

            $http.post(Config.apiPath.account.resetPassword, {
                mobile:mobile,
                smsCode:smsCode,
                newPassword:newPassword
            }).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                if(reason.status == 499){
                    d.resolve(reason.data);
                }else{
                    d.reject(reason);
                }
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#changePassword
         * @methodOf hsWechat.services.Account
         *
         * @description
         * change password
         * need smsCode
         *
         * @example
         * <pre>
         *     Account.changePassword(oldPassword, newPassword).then(function(res){
         *          // res == true
         *     }, function(reason){
         *          //reason == '还没有注册'
         *     });
         * </pre>
         * @param {String} oldPassword 旧密码
         * @param {String} newPassword 新密码
         *
         * @returns {promise} promise true for success
         */
        this.changePassword = changePassword;
        function changePassword(oldPassword, newPassword){
            var d = $q.defer();

            $http.post(Config.apiPath.account.changePassword, {
                oldPassword:oldPassword,
                newPassword:newPassword
            }).then(function (res) {
                d.resolve(true);
            }, function (reason) {
                d.reject(reason);
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#saveEmail
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 保存Email
         *
         * @example
         * <pre>
         *     Account.saveEmail(email).then(function(res){
         *          // res = true
         *     }, function(reason){
         *          //reason = '邮箱已被使用'
         *     });
         * </pre>
         * @param {string} email Email
         *
         * @returns {promise} promise true for success
         */
        this.saveEmail = saveEmail;
        function saveEmail(email) {
            var d = $q.defer();

            $http.post(Config.apiPath.account.saveEmail, {email:email}).then(function(res) {
                refreshAccountInfo();
                d.resolve(true);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#saveNickName
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 保存昵称
         *
         * @example
         * <pre>
         *     Account.saveNickName(nickName).then(function(res){
         *          // res = true
         *     }, function(reason){
         *          //reason = '昵称已被使用'
         *     });
         * </pre>
         * @param {string} nickName 昵称
         *
         * @returns {promise} promise true for success
         */
        this.saveNickName = saveNickName;
        function saveNickName(nickName) {
            var d = $q.defer();

            $http.post(Config.apiPath.account.saveNickName, {nickName:nickName}).then(function(res) {
                d.resolve(true);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#transactionRecord
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 获取交易记录分页列表
         *
         * @example
         * <pre>
         *     Account.transactionRecord(pageSize, pageNumber).then(function(res){
         *          // res = transactionRecords
         *     }, function(reason){
         *          //reason = '获取失败'
         *     });
         * </pre>
         * @param {Integer} pageSize 页容量
         * @param {Integer} pageNumber 页码
         *
         * @returns {promise} promise true for success
         */
        this.getTransactionRecord = getTransactionRecord;
        function getTransactionRecord(pageSize, pageNumber) {
            var d = $q.defer();

            if(!angular.isNumber(pageSize) || pageSize < 1){
                pageSize = Config.constants.page.defaultPageSize;
            }
            if(!angular.isNumber(pageNumber) || pageNumber < 1){
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.account.transactionRecord, {pageSize : pageSize, pageNumber : pageNumber}).then(function(res) {
                var transactionRecords = res;
                if(!(transactionRecords instanceof Array) || transactionRecordsHaveBasicFields(transactionRecords)) {
                    d.resolve(res);
                } else {
                    d.reject('system error');
                }
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object|Object[]} project
         * @return {Boolean}
         */
        function transactionRecordsHaveBasicFields(transactionRecords, otherFields) {
            if (!angular.isArray(transactionRecords)) {
                transactionRecords = [transactionRecords];
            }
            var fields = ['opDt', 'changeType', 'changeTypeName', 'changeVal'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(i in transactionRecords){
                var transactionRecord = transactionRecords[i];
                for(j in fields){
                    if(!angular.isDefined(transactionRecord[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#repaymentCalendar
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 获取用户某一年月的还款日历
         *
         * @example
         * <pre>
         *     Account.repaymentCalendar(year, month).then(function(res) {
         *          res = [{day: 5, amount: 3500, status: 1}]
         *     }, function(reason) {
         *          reason = '获取失败'
         *     })
         * </pre>
         * @param {string} year 年
         * @param {string} month 月
         *
         * @return {promise} customer one month repaymentCalendar
         */
        this.getRepaymentCalendar = getRepaymentCalendar;
        function getRepaymentCalendar(year, month) {
            var d = $q.defer();
            $http.post(Config.apiPath.account.repaymentCalendar,{'year' : year, 'month' : month}).then(function(res) {
                var repaymentCalendar = res;
                if(!(repaymentCalendar instanceof Array) || repaymentCalendarHaveBasicFields(repaymentCalendar)) {
                    d.resolve(res);
                } else {
                    d.reject('system error');
                }
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object|Object[]} project
         * @return {Boolean}
         */
        function repaymentCalendarHaveBasicFields(repaymentCalendar, otherFields) {
            if (!angular.isArray(repaymentCalendar)) {
                repaymentCalendar = [repaymentCalendar];
            }
            var fields = ['day', 'amount', 'status'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(i in repaymentCalendar){
                var repaymentDay = repaymentCalendar[i];
                for(j in fields){
                    if(!angular.isDefined(repaymentDay[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#logout
         * @methodOf hsWechat.services.Account
         *
         * @description
         * logout, always clear token
         *
         * @example
         * <pre>
         *     Account.logout();
         * </pre>
         *
         */
        this.logout = logout;
        function logout(){
            var d = $q.defer();
            $http.post(Config.apiPath.account.logout).then(function(res) {
                //d.resolve(res);
            }, function(reason) {
                //d.reject(reason);
            });
            unsetLogin();
            d.resolve(true);
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#myInvestment
         * @methodOf hsWechat.services.Account
         *
         * @description
         * get customer investments info
         *
         * @example
         * <pre>
         *      Account.investment().then(function(res) {
         *          res = investments
         *      });
         * </pre>
         * @returns {promise} promise account investments with basic field
         */
        this.getMyInvestment = getMyInvestment;
        function getMyInvestment(flag) {
            var d = $q.defer();

            $http.post(Config.apiPath.account.myInvestment,{flag:flag}).then(function(res) {
                var investments = res;
                if(investmentsHaveBasicFields(investments)) {
                    d.resolve(investments);
                } else {
                    d.reject('system error');
                }
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Account#myInvestment
         * @methodOf hsWechat.services.Account
         *
         * @description
         * get customer investments info
         *
         * @example
         * <pre>
         *      Account.getMyInvestmentDetail().then(function(res) {
         *          res = investments
         *      });
         * </pre>
         * @returns {promise} promise account investments with basic field
         */
        this.getMyInvestmentDetail = getMyInvestmentDetail;
        function getMyInvestmentDetail(recordId) {
            var d = $q.defer();

            $http.post(Config.apiPath.account.myInvestmentDetail,{recordId:recordId}).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#getWithdrawInfo
         * @methodOf hsWechat.services.Account
         *
         * @description
         * get account withdraw info
         *
         * @example
         * <pre>
         *      Account.getWithdrawInfo().then(function(res) {
         *          res = investments;
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise} promise account withdraw info
         */
        this.getWithdrawInfo = getWithdrawInfo;
        function getWithdrawInfo() {
            var d = $q.defer();

            $http.post(Config.apiPath.account.beforeWithdraw).then(function(res) {
                var withdrawInfo = res;
                if(withdrawInfoHaveBasicFields(withdrawInfo)) {
                    d.resolve(withdrawInfo);
                } else {
                    d.reject('system error');
                }
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object} withdrawInfo
         * @param {String|String[]} otherFields
         * @return {Boolean}
         */
        function withdrawInfoHaveBasicFields(withdrawInfo, otherFields) {
            var fields = ['cardNo','cardStatusCode','bankCode','bankName','bankLogo','amount','ticketCount'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in fields){
                if(angular.isUndefined(withdrawInfo[fields[i]])){
                    return false;
                }
            }
            return true;
        }

        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object} investments
         * @param {String|String[]} otherFields
         * @return {Boolean}
         */
        function investmentsHaveBasicFields(investments, otherFields) {
            var fields = ['projectList', 'receiveMoney', 'tipMsg', 'totalInvestment'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in fields){
                if(angular.isUndefined(investments[fields[i]])){
                    return false;
                }
            }
            return investmentProjectsHaveBasicFields(investments.projectList);
        }
        /**
         * @description
         * check field, we need some must fields
         *
         * @param {Object} investmentProjects
         * @param {String|String[]} otherFields
         * @return {Boolean}
         */
        function investmentProjectsHaveBasicFields(investmentProjects, otherFields) {
            if (!angular.isArray(investmentProjects)) {
                investmentProjects = [investmentProjects];
            }
            var fields = ['projectId','projectName','projectType','projectTypeName','repaymentMode','repaymentModeName','amount','receivedProfit','willProfit','status','statusName','annualizedRate','isNewUser','isRecommend','remainingDays'];
            if(angular.isDefined(otherFields))fields = fields.concat(otherFields);
            for(var i in investmentProjects){
                var investmentProject = investmentProjects[i];
                for(var j in fields){
                    if(!angular.isDefined(investmentProject[fields[j]])){
                        return false;
                    }
                }
            }
            return true;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#hasLogin
         * @methodOf hsWechat.services.Account
         *
         * @description
         * check customer has login
         *
         * @example
         * <pre>
         *     User.hasLogin() === true;
         * </pre>
         *
         */
        this.hasLogin = hasLogin;
        function hasLogin(){
            return !!(getToken());
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#sign
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 签到
         *
         * @example
         * <pre>
         *      Account.getWithdrawInfo().then(function(res) {
         *          res = investments;
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise} 签到变化的积分值
         */
        this.sign = sign;
        function sign() {
            var d = $q.defer();

            $http.post(Config.apiPath.account.sign).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#getAccountInvestmentTickets
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 获取用户的现金券列表
         *
         * @example
         * <pre>
         *      Account.getAccountInvestmentTickets().then(function(res) {
         *          res = ticketsList;
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise} 用户的现金券列表
         */
        this.getAccountInvestmentTickets = getAccountInvestmentTickets;
        function getAccountInvestmentTickets() {
            var d = $q.defer();

            $http.post(Config.apiPath.account.myTickets).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#myEarningPageList
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 推荐有奖-奖励现金分页列表
         *
         * @example
         * <pre>
         *      Account.myEarningPageList().then(function(res) {
         *          res = ticketsList;
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise}
         */
        this.getMyEarningPageList = getMyEarningPageList;
        function getMyEarningPageList(pageSize,pageNumber) {
            var d = $q.defer();
            if(!angular.isNumber(pageSize) || pageSize < 1){
                pageSize = Config.constants.page.defaultPageSize;
            }
            if(!angular.isNumber(pageNumber) || pageNumber < 1){
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.account.myEarningPageList, {pageSize : pageSize, pageNumber : pageNumber}).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#myEarningTicketPageList
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 推荐有奖-奖励现金券分页列表
         *
         * @example
         * <pre>
         *      Account.myEarningTicketPageList().then(function(res) {
         *          res = ticketsList;
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise}
         */
        this.getMyEarningTicketPageList = getMyEarningTicketPageList;
        function getMyEarningTicketPageList(pageSize,pageNumber) {
            var d = $q.defer();
            if(!angular.isNumber(pageSize) || pageSize < 1){
                pageSize = Config.constants.page.defaultPageSize;
            }
            if(!angular.isNumber(pageNumber) || pageNumber < 1){
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.account.myEarningTicketPageList, {pageSize : pageSize, pageNumber : pageNumber}).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Account#myInvitationPageList
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 推荐有奖-好友分页列表
         *
         * @example
         * <pre>
         *      Account.myInvitationPageList().then(function(res) {
         *          res = ticketsList;
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise}
         */
        this.getMyInvitationPageList = getMyInvitationPageList;
        function getMyInvitationPageList(pageSize,pageNumber) {
            var d = $q.defer();
            if(!angular.isNumber(pageSize) || pageSize < 1){
                pageSize = Config.constants.page.defaultPageSize;
            }
            if(!angular.isNumber(pageNumber) || pageNumber < 1){
                pageNumber = Config.constants.page.defaultPageNumber;
            }

            $http.post(Config.apiPath.account.myInvitationPageList, {pageSize : pageSize, pageNumber : pageNumber}).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Account#myInvitationStat
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 推荐有奖-好友分页列表
         *
         * @example
         * <pre>
         *      Account.myInvitationStat().then(function(res) {
         *          res = //{"registerCount":100,"nameAuthCount":80,"investAccount":50,"earningAmount":300,"earningTicketAmount":300}}
         *      }, function(reason) {
         *          reason = '获取失败';
         *      });
         * </pre>
         * @returns {promise}
         */
        this.getMyInvitationStat = getMyInvitationStat;
        function getMyInvitationStat() {
            var d = $q.defer();
            $http.post(Config.apiPath.account.myInvitationStat).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }




        /**
         * @ngdoc function
         * @name hsWechat.services.Account#isShowAccountMoney
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 是否显示用户余额
         *
         * @example
         * <pre>
         *      Account.isShowAccountMoney();
         * </pre>
         * @returns 显示返回true 否则返回false
         */
        this.isShowAccountMoney = isShowAccountMoney;
        function isShowAccountMoney() {
            var m = localStorageService.get("account.isShowAccountMoney");
            return m != false;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#showAccountMoney
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 显示用户余额
         *
         * @example
         * <pre>
         *      Account.showAccountMoney();
         * </pre>
         */
        this.showAccountMoney = showAccountMoney;
        function showAccountMoney() {
            localStorageService.set("account.isShowAccountMoney", true);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#hideAccountMoney
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 隐藏用户余额
         *
         * @example
         * <pre>
         *      Account.hideAccountMoney();
         * </pre>
         */
        this.hideAccountMoney = hideAccountMoney;
        function hideAccountMoney() {
            localStorageService.set("account.isShowAccountMoney", false);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.User#hasNotLogin
         * @methodOf hsWechat.services.User
         *
         * @description
         * check user has not login
         *
         * @example
         * <pre>
         *     User.hasNotLogin() === true;
         * </pre>
         *
         */
        this.hasNotLogin = hasNotLogin;
        function hasNotLogin(){
            return !hasLogin();
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#hasNotLogin
         * @methodOf hsWechat.services.Account
         *
         * @description
         * check user has not login
         *
         * @example
         * <pre>
         *     User.hasNotLogin() === true;
         * </pre>
         *
         */
        this.getMyIntegralPageList = getMyIntegralPageList;
        function getMyIntegralPageList(pageSize,pageNumber){
            var d = $q.defer();
            $http.post(Config.apiPath.account.myIntegralPageList,{pageSize:pageSize,pageNumber:pageNumber}).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Account#repaymentPlan
         * @methodOf hsWechat.services.Account
         *
         * @description
         * 得到指定投资记录的还款计划
         * @example
         * <pre>
         *     Account.repaymentPlan(recordId);
         * </pre>
         *
         */
        this.repaymentPlan = repaymentPlan;
        function repaymentPlan(recordId){
            var d = $q.defer();
            $http.post(Config.apiPath.account.repaymentPlan,{recordId:recordId}).then(function(res) {
                d.resolve(res);
            }, function(reason) {
                d.reject(reason);
            });

            return d.promise;
        }


        /*====================================
         =            capital balance        =
         ====================================*/
        function getGain(){

        }

        function getGainLog(start, limit){

        }

        function getBalance(){

        }

        function getBalanceLog(start, limit){

        }

        function getNetAssets(){

        }

        function getNetAssetsDetail(){

        }

        function getPlatformAmount(){

        }

        function getPlatformAmountLog(start, limit){

        }

        /*====================================
         =            invest and transfer    =
         ====================================*/
        function getInvestList(type, start, limit){

        }

        function transferInvest(investRecordId){

        }

        function cancelTransferInvest(investRecordId){

        }

        function getLoanList(type, start, limit){

        }

        function getLoanRepayPlan(projectId){

        }

        function invest(projectIdOrTransferId, amount, platformAmount, ticketIds, type){

        }

        function getInvestRecord(investRecordId){

        }

        /*====================================
         =      change info                  =
         ====================================*/
        function changeEmail(captcha, newEmail){

        }

        function newPassword(captcha, oldPass, newPass){

        }

        function changeProfile(){

        }

        /*====================================
         =      tiket                        =
         ====================================*/
        function getTiketList(type, start, limit){

        }

        /*====================================
         =      integral                     =
         ====================================*/
        function getIntegralLog(start, limit){

        }

        function checkIn(){

        }

        /*====================================
         =      messages                     =
         ====================================*/
        function getInfoMessageList(start, limit){

        }

        function getSiteNoticeList(start, limit){

        }

        function markMessageAsRead(messageIds, type){

        }

        function deleteInfoMessages(messageIds){

        }

        /*====================================
         =      send feedback                =
         ====================================*/
        function sendFeedBack(content, contact){

        }
    }

    hsWechatServices.service('Account', Account);
})(angular, hsWechatServices);