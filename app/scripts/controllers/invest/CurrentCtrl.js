'use strict';
(function (angular, hsWechatControllers) {

    CurrentCtrl.$inject = ['$scope', '$state', '$stateParams', '$sce', 'Current', 'Account', 'Navbar'];
    function CurrentCtrl($scope, $state, $stateParams, $sce, Current, Account, Navbar) {

        //获取活花生项目详情
        $scope.projectId = $stateParams.projectId;
        Current.getCurrentProjectDetail($scope.projectId).then(function (res) {
            $scope.currentProjectDetail = res;
            $scope.currentProjectDetail.startDate = res.startDate.replace('(工作日)', '');
            $scope.currentProjectDetail.introduce = $sce.trustAsHtml(res.introduce.replace(/\r\n/g, '</br>'));
            $scope.currentProjectDetail.investmentScope = $sce.trustAsHtml(res.investmentScope.replace(/\r\n/g, '</br>'));
            $scope.currentProjectDetail.buyRule = $sce.trustAsHtml(res.buyRule.replace(/\r\n/g, '</br>'));
            $scope.currentProjectDetail.interestCalculateRule = $sce.trustAsHtml(res.interestCalculateRule.replace(/\r\n/g, '</br>'));
            $scope.currentProjectDetail.fee = $sce.trustAsHtml(res.fee.replace(/\r\n/g, '</br>'));
            Navbar.setTitle(res.projectName);
        }, function (reason) {

        });

        //跳转到立即投资页面
        $scope.invest = invest;
        function invest() {
            $state.go('account.current.invest', {
                projectId: $scope.projectId
            });
        }
    }

    hsWechatControllers.controller('CurrentCtrl', CurrentCtrl);


    myCurrentInvestCtrl.$inject = ['$scope', '$state', '$stateParams', '$window', '$base64', 'Current', 'Account', 'Navbar', 'Yeepay', 'Tip', 'Loading'];
    function myCurrentInvestCtrl($scope, $state, $stateParams, $window, $base64, Current, Account, Navbar, Yeepay, Tip, Loading) {

        //刷新用户信息
        $scope.accountInfo = {};
        $scope.accountInfo.current = [];
        $scope.accountInfo.current.availableAmount = '';
        $scope.invest = {amount: ''};

        $scope.hasSigned = false;
        function getAccountInfo() {
            Loading.mask(function () {
                Account.refreshAccountInfo().then(function (res) {
                    $scope.accountInfo = res;
                    $scope.accountInfo.current.availableAmount = res.current.availableAmount;
                    $scope.hasSigned = res.hasSigned == 'true';
                }, function (reason) {

                }).finally(function () {
                    Loading.hideMask();
                });
            });
        }

        getAccountInfo();

        $scope.currentProjectDetail = [];
        $scope.currentProjectDetail.amount = '';
        //获取活花生项目详情
        $scope.projectId = $stateParams.projectId;
        Current.getCurrentProjectDetail($scope.projectId).then(function (res) {
            $scope.currentProjectDetail = res;
            $scope.currentProjectDetail.amount = res.amount;
        }, function (reason) {

        });

        //$scope.investAmount = '';

        //是否能充值
        //$scope.canRecharge = function () {
        //return $scope.investAmount <= $scope.currentProjectDetail.amount && $scope.investAmount <= $scope.accountInfo.current.availableAmount;
        //};

        //是否能投资
        $scope.canBuy = function () {
            return $scope.invest.amount <= $scope.currentProjectDetail.amount && $scope.invest.amount <= $scope.accountInfo.current.availableAmount && $scope.invest.amount > 0;
        };

        //充值
        $scope.getRechargeUrl = getRechargeUrl;
        function getRechargeUrl(amount) {
            var callbackUrl = $base64.encode(getCallbackURL($state, $window.SERVERCONF.appRootUrl, Navbar.getStateByPop(1)) + ($scope.accountInfo.hasRecharged == 0 ? '' : '?level=3'));
            Yeepay.getRechargeUrl(amount, callbackUrl).then(function (res) {
                $window.location.href = res;
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#recharge');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#recharge');
                }
            });
        }

        //确认投资
        $scope.toCurrentInvest = toCurrentInvest;
        function toCurrentInvest() {
            var callbackUrl = $base64.encode($window.SERVERCONF.appRootUrl + '/account/current/investSuccess/' + $scope.invest.amount);
            Yeepay.toCurrentInvest($scope.projectId, $scope.invest.amount, callbackUrl).then(function (res) {
                $window.location.href = res;
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#confirmInvest');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#confirmInvest');
                }
            });
        }


    }

    hsWechatControllers.controller('myCurrentInvestCtrl', myCurrentInvestCtrl);


    myCurrentInvestSuccessCtrl.$inject = ['$scope', '$stateParams'];
    function myCurrentInvestSuccessCtrl($scope, $stateParams) {
        $scope.amount = $stateParams.amount;
    }

    hsWechatControllers.controller('myCurrentInvestSuccessCtrl', myCurrentInvestSuccessCtrl);


    myCurrentCtrl.$inject = ['$scope', 'Current', 'Account'];
    function myCurrentCtrl($scope, Current, Account) {

        //刷新用户信息
        $scope.accountInfo = {};
        $scope.hasSigned = false;
        function getAccountInfo() {

            Account.refreshAccountInfo().then(function (res) {
                $scope.accountInfo = res;
                $scope.hasSigned = res.hasSigned == 'true';
            }, function (reason) {

            });
        }

        getAccountInfo();

        //获取我的活花生列表
        Current.myCurrent().then(function (res) {
            $scope.myCurrents = res;
        }, function (reason) {

        });

    }

    hsWechatControllers.controller('myCurrentCtrl', myCurrentCtrl);

    myCurrentDetailCtrl.$inject = ['$scope', '$state', '$stateParams', 'Current', 'Account', 'Navbar', 'Loading'];
    function myCurrentDetailCtrl($scope, $state, $stateParams, Current, Account, Navbar, Loading) {
        //刷新用户信息
        $scope.accountInfo = {};
        $scope.hasSigned = false;
        function getAccountInfo() {
            Loading.mask(function () {
                Account.refreshAccountInfo().then(function (res) {
                    $scope.accountInfo = res;
                    $scope.hasSigned = res.hasSigned == 'true';
                }, function (reason) {
                }).finally(function () {
                    Loading.hideMask();
                });
            });
        }

        getAccountInfo();
        //获取我的活花生详情
        $scope.projectId = $stateParams.projectId;
        $scope.myCurrentDetail = [];
        $scope.myCurrentDetail.project = [];
        $scope.myCurrentDetail.project.status = '';
        $scope.getMyCurrentDetail = getMyCurrentDetail;
        function getMyCurrentDetail() {
            Current.myCurrentDetail($scope.projectId).then(function (res) {
                $scope.myCurrentDetail = res;
                $scope.myCurrentDetail.project.status = res.project.status;
                $scope.myCurrentDetail.project.annualizedRate = res.project.annualizedRate * 100;
                Navbar.setTitle($scope.myCurrentDetail.project.projectName);
            }, function (reason) {
            });
        }

        getMyCurrentDetail();

        //跳转到提取页面
        $scope.redeemInterest = redeemInterest;
        function redeemInterest() {
            $state.go('account.current.pick', {
                projectId: $scope.projectId,
                amount: $scope.myCurrentDetail.account.interest
            });
        }

        //跳转到赎回页面
        $scope.redeemPrincipal = redeemPrincipal;
        function redeemPrincipal() {
            $state.go('account.current.redeem', {
                projectId: $scope.projectId,
                amount: $scope.myCurrentDetail.account.canRedeemPrincipal
            });
        }

        //能否跳转投资
        $scope.canInvest = function () {
            return $scope.myCurrentDetail.project.status == 3;
        };

        //跳转到投资页面
        $scope.invest = invest;
        function invest() {
            $state.go('account.current.invest', {
                projectId: $scope.projectId
            });
        }

        //跳转到资金明细页面
        $scope.financeDetail = financeDetail;
        function financeDetail() {
            $state.go('account.current.financeDetail', {
                projectId: $scope.projectId
            });
        }

    }

    hsWechatControllers.controller('myCurrentDetailCtrl', myCurrentDetailCtrl);


    financeDetailCtrl.$inject = ['$scope', '$stateParams', 'Current', 'Loading'];
    function financeDetailCtrl($scope, $stateParams, Current, Loading) {

        $scope.loadMore = function (refresh) {
            switch ($scope.activeTab) {
                case 1:
                    loadMoreRedeemInterest(refresh);
                    break;
                case 2:
                    loadMoreInvest(refresh);
                    break;
                case 3:
                    loadMoreRedeemInvest(refresh);
                    break;
            }
        };


        //查询资金明细
        $scope.projectId = $stateParams.projectId;

        $scope.changeTypeInterest = '0';
        $scope.changeTypePrincipal = '1';

        //收息明细
        $scope.type = '';
        $scope.pageSizeRedeemInterest = 20;
        $scope.pageNumberRedeemInterest = 1;
        $scope.redeemInterests = [];
        $scope.loadMoreRedeemInterest = loadMoreRedeemInterest;
        function loadMoreRedeemInterest(refresh) {
            if (refresh) {
                $scope.pageNumberRedeemInterest = 1;
            }
            Loading.show(function () {
                Current.myCurrentInterestPageList($scope.pageSizeRedeemInterest, $scope.pageNumberRedeemInterest, $scope.projectId, $scope.type).then(function (page) {
                    Loading.hide();
                    if (refresh) {
                        $scope.redeemInterests = [];
                    }
                    if (page.length > 0) {
                        $scope.pageNumberRedeemInterest++;
                        $scope.redeemInterests = $scope.redeemInterests.concat(page);
                    }
                    loadMoreRedeemInvest(true); //3首次加载
                    Loading.hide();
                });
            }, refresh);

        }


        //投资明细
        $scope.pageSizeInvest = 20;
        $scope.pageNumberInvest = 1;
        $scope.invests = [];
        $scope.loadMoreInvest = loadMoreInvest;
        function loadMoreInvest(refresh) {
            if (refresh) {
                $scope.pageNumberInvest = 1;
            }
            Loading.show(function () {
                Current.myCurrentPrincipalPageList($scope.pageSizeInvest, $scope.pageNumberInvest, $scope.projectId, $scope.changeTypeInterest).then(function (page) {
                    if (refresh) $scope.invests = [];
                    if (page.length > 0) {
                        $scope.pageNumberInvest++;
                        $scope.invests = $scope.invests.concat(page);
                    }
                    loadMoreRedeemInterest(true); //1首次加载
                    Loading.hide();
                });
            }, refresh);

        }

        loadMoreInvest(true); //2首次加载

        //赎回明细（投资）
        $scope.pageSizeRedeemInvest = 20;
        $scope.pageNumberRedeemInvest = 1;
        $scope.redeems = [];
        $scope.loadMoreRedeemInvest = loadMoreRedeemInvest;
        function loadMoreRedeemInvest(refresh) {
            if (refresh) {
                $scope.pageNumberRedeemInvest = 1;
            }
            Loading.show(function () {
                Current.myCurrentPrincipalPageList($scope.pageSizeRedeemInvest, $scope.pageNumberRedeemInvest, $scope.projectId, $scope.changeTypePrincipal).then(function (page) {
                    if (refresh) $scope.redeems = [];
                    if (page.length > 0) {
                        $scope.pageNumberRedeemInvest++;
                        $scope.redeems = $scope.redeems.concat(page);
                        for (var i in $scope.redeems) {
                            $scope.redeems[i].changeVal = $scope.redeems[i].changeVal.replace('-', '');
                        }
                    }
                    Loading.hide();
                });
            }, refresh);
        }


    }

    hsWechatControllers.controller('financeDetailCtrl', financeDetailCtrl);

    redeemCtrl.$inject = ['$scope', '$state', '$stateParams', 'Current', 'Tip'];
    function redeemCtrl($scope, $state, $stateParams, Current, Tip) {

        $scope.projectId = $stateParams.projectId;
        $scope.amount = $stateParams.amount;

        //双向绑定参数，封装在对象内，避免失效
        $scope.redeem = {
            interest: '',
            principal: ''
        };

        //是否能提取
        $scope.canRedeemInterest = function () {
            return $scope.redeem.interest <= $scope.amount && $scope.redeem.interest > 0;
        };

        //是否能赎回
        $scope.canRedeemPrincipal = function () {
            return $scope.redeem.principal <= $scope.amount && $scope.redeem.principal > 0;
        };

        //提取
        $scope.redeemInterest = redeemInterest;
        function redeemInterest() {
            Current.redeemInterest($scope.projectId, $scope.redeem.interest).then(function (res) {
                $state.go('account.current.pickSuccess');
            }, function (reason) {
                Tip.show(reason.data, 3000, '#showTip');
            });
        }

        //赎回
        $scope.redeemPrincipal = redeemPrincipal;
        function redeemPrincipal() {
            Current.redeemPrincipal($scope.projectId, $scope.redeem.principal).then(function (res) {
                $state.go('account.current.redeemSuccess');
            }, function (reason) {
                Tip.show(reason.data, 3000, '#showTip');
            });

        }

    }

    hsWechatControllers.controller('redeemCtrl', redeemCtrl);

    CurrentAgreementCtrl.$inject = ['$scope', '$stateParams', 'Current'];
    function CurrentAgreementCtrl($scope, $stateParams, Current) {
        //获取活期产品协议
        $scope.projectId = $stateParams.projectId;
        Current.getCurrentAgreement($scope.projectId).then(function (res) {
            $scope.agreement = res;
        }, function (reason) {
        });

    }

    hsWechatControllers.controller('CurrentAgreementCtrl', CurrentAgreementCtrl);

    function getCallbackURL($state, appRootUrl, state) {
        if (state) {
            var urls = [];
            var names = state.state.name.split('.');
            var i = names.length;
            while (i--) {
                var stateName = names.slice(0, i + 1).join('.');
                urls.splice(0, 0, $state.get(stateName).url);
            }
            var callbackURL = appRootUrl + '/#' + urls.join('');
            var params = state.params;
            if (params) {
                for (var key in params) {
                    callbackURL = callbackURL.replace(':' + key, params[key]);
                }
            }
            return callbackURL;
        } else {
            return appRootUrl + '/#/account/';
        }
    }


})(angular, hsWechatControllers);