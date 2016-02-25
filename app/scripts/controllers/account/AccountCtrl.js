'use strict';
(function (angular, hsWechatControllers) {
    AccountMainCtrl.$inject = ['$http', '$scope', '$state', 'Account', 'Tip', 'Loading', 'SharedState'];
    function AccountMainCtrl($http, $scope, $state, Account, Tip, Loading, SharedState) {
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


        //修改密码
        $scope.oldPassword = "";
        $scope.newPassword = "";
        $scope.confirmPassword = "";
        $scope.changePassword = changePassword;
        function changePassword() {
            Account.changePassword($scope.oldPassword, $scope.newPassword).then(function (res) {
                Tip.show('密码修改成功', 1000, '#changePasswordBtn');
                $state.go('account.main');
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#oldPassword');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#oldPassword');
                }
            });
        }

        var pwdReg = /^[a-zA-Z\d]{6,16}$/;

        $scope.canChangePassword = function () {
            return $scope.oldPassword.length > 0 && pwdReg.test($scope.newPassword) && $scope.newPassword == $scope.confirmPassword;
        };
        //新密码输入框焦点移出事件
        $scope.newPasswordBlur = function () {
            if (!pwdReg.test($scope.newPassword)) {
                Tip.show('密码为6-16位数字或英文字母', 3000, '#changePasswordBtn');
            } else if ($scope.newPassword != $scope.confirmPassword && $scope.confirmPassword.length > 0) {
                Tip.show('确认密码输入不一致', 3000, '#changePasswordBtn');
            }


        };
        //确认密码输入框焦点移出事件
        $scope.confirmPasswordBlur = function () {
            if ($scope.newPassword != $scope.confirmPassword) {
                Tip.show('确认密码输入不一致', 3000, '#changePasswordBtn');
            }
        };

        //登出
        $scope.logout = function () {
            Account.logout();
            $state.go('home.main');
            Tip.show('退出成功', 1000, '#mobileLi');
        };

        $scope.isShowAccountMoney = Account.isShowAccountMoney();
        $scope.changeShowAccountMoneyStatus = function () {
            if ($scope.isShowAccountMoney) {
                Account.hideAccountMoney();
            } else {
                Account.showAccountMoney();
            }
            $scope.isShowAccountMoney = Account.isShowAccountMoney();
        };
        //判断是否为空对象
        $scope.isEmptyObject = isEmptyObject;
        function isEmptyObject(obj) {
            for (var i in obj) {
                return false;
            }
            return true;
        }

        //签到
        $scope.showSignTip = false;
        $scope.signValue = 0;
        $scope.sign = function () {
            Account.sign().then(function (res) {
                Account.refreshAccountInfo();
                $scope.hasSigned = true;
                $scope.signValue = res;
                $scope.showSignTip = true;
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#investLi');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#investLi');
                }
            });
        };
        //绑定银行卡
        $scope.toBindBankCard = function () {
            if ($scope.accountInfo.hasOpenThirdAccount != '1') {
                //$state.go('yeepay.register', {mobile : $scope.accountInfo.mobile});
                SharedState.turnOn('modalContact');
            } else {
                $state.go('yeepay.bindBankCard');
            }
        };

    }

    hsWechatControllers.controller('AccountMainCtrl', AccountMainCtrl);


    AccountLogCtrl.$inject = ['$http', '$scope', '$state', 'Account', 'Tip', 'Loading'];
    function AccountLogCtrl($http, $scope, $state, Account, Tip, Loading) {
        //交易记录
        $scope.yearMonths = {};
        $scope.logPageSize = 20;
        $scope.logPageNumber = 1;
        $scope.loadMoreLog = loadMoreLog;
        function loadMoreLog(refresh) {
            Loading.show(function () {
                if (refresh) $scope.logPageNumber = 1;
                Account.getTransactionRecord($scope.logPageSize, $scope.logPageNumber).then(function (page) {
                    Loading.hide();
                    if (refresh) $scope.yearMonths = {};
                    if (page.length > 0) {
                        $scope.logPageNumber++;
                        for (var log in page) {
                            var year = page[log].opDt.substr(0, 4);
                            var month = page[log].opDt.substr(5, 2);
                            var yearMonth = year + '年' + month + '月';
                            if (angular.isDefined($scope.yearMonths[yearMonth])) {
                                $scope.yearMonths[yearMonth] = $scope.yearMonths[yearMonth].concat([page[log]]);
                            } else {
                                $scope.yearMonths[yearMonth] = [page[log]];
                            }
                        }
                    }
                }, function (reason) {

                });
            }, refresh);

        }

        //首次加载
        loadMoreLog("refresh");
    }

    hsWechatControllers.controller('AccountLogCtrl', AccountLogCtrl);
})(angular, hsWechatControllers);