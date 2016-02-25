'use strict';
(function (angular, hsWechatControllers) {

    YeepayCtrl.$inject = ['$window', '$scope', '$sce', '$state', '$stateParams', '$base64', 'Yeepay', 'Account', 'Navbar', 'Tip'];
    function YeepayCtrl($window, $scope, $sce, $state, $stateParams, $base64, Yeepay, Account, Navbar, Tip){
        $scope.accountInfo = {};

        function getAccountInfo() {
            Account.getAccountInfo().then(function(res) {
                $scope.accountInfo = res;
            }, function(reason) {

            });
        }

        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if(toState.name == 'yeepay.recharge') {
                getAccountInfo();
            }
        });

        $scope.isAmount = isAmount;

        //充值
        $scope.getRechargeUrl = getRechargeUrl;
        function getRechargeUrl(amount) {
            var callbackUrl = $base64.encode(getCallbackURL($state,$window.SERVERCONF.appRootUrl,Navbar.getStateByPop(1))+($scope.accountInfo.hasRecharged == 0?'':'?level=3'));
            Yeepay.getRechargeUrl(amount, callbackUrl).then(function(res) {
                $window.location.href = res;
            }, function(reason) {
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#amount');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#amount');
                }
            });
        }
    }

    hsWechatControllers.controller('YeepayCtrl', YeepayCtrl);

    YeepayWithdrawCtrl.$inject = ['$window', '$scope', '$sce', '$state', '$stateParams', '$base64', 'Yeepay', 'Account', 'Navbar', 'Tip'];
    function YeepayWithdrawCtrl($window, $scope, $sce, $state, $stateParams, $base64, Yeepay, Account, Navbar, Tip){
        $scope.accountInfo = {};

        function getAccountInfo() {
            Account.getAccountInfo().then(function(res) {
                $scope.accountInfo = res;
                if($scope.accountInfo.bankCard.ticketCount <= 0) {
                    $scope.isUseWithdrawTicket = false;
                    $scope.isUseWithdrawTicketClass = "icon-radio-yellow-nor";
                    $scope.useWithdrawText = "未选择";
                }
            }, function(reason) {

            });
        }
        $scope.$on('$stateChangeSuccess', function(event, toState) {
            if(toState.name == 'yeepay.withdrawals') {
                getAccountInfo();
            }
        });

        $scope.isAmount = isAmount;
        //提现
        $scope.getWithdrawUrl = getWithdrawUrl;
        $scope.isUseWithdrawTicket = true;
        $scope.isUseWithdrawTicketClass = "icon-radio-yellow-sel";
        $scope.useWithdrawText = "已选择";
        function getWithdrawUrl() {
            if(!isAmount($scope.amount)){
                Tip.show('请输入正确的数字', 3000, '#amount');
                return;
            }
            var callbackUrl = $base64.encode(getCallbackURL($state,$window.SERVERCONF.appRootUrl,Navbar.getStateByPop(1)));
            Yeepay.getWithdrawUrl($scope.amount, $scope.isUseWithdrawTicket, callbackUrl).then(function(res) {
                $window.location.href = res;
            }, function(reason) {
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#amount');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#amount');
                }
            });
        }

        //能否提现
        $scope.canWith = function () {
            if ($scope.isUseWithdrawTicket) {
                return isAmount($scope.amount) && $scope.amount<=$scope.accountInfo.bankCard.amount
            } else {
                return isAmount($scope.amount) && $scope.amount+2<=$scope.accountInfo.bankCard.amount
            }

        };

        $scope.changeUseWithdrawTicket = function() {
            if($scope.accountInfo.bankCard.ticketCount > 0) {
                $scope.isUseWithdrawTicket = $scope.isUseWithdrawTicket ? false : true;
                if ($scope.isUseWithdrawTicket) {
                    $scope.isUseWithdrawTicketClass = "icon-radio-yellow-sel";
                    $scope.useWithdrawText = "已选择";
                } else {
                    $scope.isUseWithdrawTicketClass = "icon-radio-yellow-nor";
                    $scope.useWithdrawText = "未选择";
                }
            }
        };
    }

    hsWechatControllers.controller('YeepayWithdrawCtrl', YeepayWithdrawCtrl);


    YeepayBindBankCardCtrl.$inject = ['$window', '$scope', '$sce', '$state', '$stateParams', '$base64', 'Yeepay', 'Account', 'Navbar', 'Tip'];
    function YeepayBindBankCardCtrl($window, $scope, $sce, $state, $stateParams, $base64, Yeepay, Account, Navbar, Tip){
        //绑卡
        $scope.getBindBankCardUrl = function() {
            var callbackUrl = $base64.encode(getCallbackURL($state,$window.SERVERCONF.appRootUrl,Navbar.getStateByPop(1)));
            Yeepay.getBindBankCardUrl(callbackUrl).then(function(res) {
                $window.location.href = res;
            }, function(reason) {
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#bindBankCardBtn');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#bindBankCardBtn');
                }
            });
        };
    }

    hsWechatControllers.controller('YeepayBindBankCardCtrl', YeepayBindBankCardCtrl);

    function getCallbackURL($state,appRootUrl,state){
        if(state){
            var urls = [];
            var names = state.state.name.split('.');
            var i = names.length;
            while(i--){
                var stateName = names.slice(0,i+1).join('.');
                urls.splice(0,0,$state.get(stateName).url);
            }
            var callbackURL = appRootUrl + '/#' + urls.join('');
            var params = state.params;
            if(params){
                for(var key in params){
                    callbackURL = callbackURL.replace(':'+key,params[key]);
                }
            }
            return  callbackURL;
        } else{
            return appRootUrl + '/#/account/';
        }
    }


    YeepayRegisterCtrl.$inject = ['$window', '$scope', '$sce', '$state', '$stateParams', '$base64', 'Yeepay', 'Account', 'Navbar', 'Tip'];
    function YeepayRegisterCtrl($window, $scope, $sce, $state, $stateParams, $base64, Yeepay, Account, Navbar, Tip){
        //注册
        $scope.mobile = $stateParams.mobile;
        if(!isMobile($scope.mobile)) {
            Account.getAccountInfo().then(function(res){
                $scope.mobile = res.mobile;
            });
        }
        $scope.registerIframeSrc = "";
        $scope.isShowRegisterIframe = false;
        $scope.realName = "";
        $scope.idCardNo = "";

        $scope.canRegister = function() {
            return $scope.realName.length > 0 && $scope.idCardNo.length == 18;
        };

        $scope.getYeepayRegisterUrl = getYeepayRegisterUrl;
        function getYeepayRegisterUrl() {
            var callbackUrl = $base64.encode(getCallbackURL($state,$window.SERVERCONF.appRootUrl,Navbar.getStateByPop(1))+'?level=2');
            Yeepay.getRegisterUrl($scope.realName, $scope.idCardNo, $scope.mobile, callbackUrl).then(function(res) {
                $window.location.href = res;
            }, function(reason) {
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#idCardNo');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#realName');
                }
            });
        }
    }
    hsWechatControllers.controller('YeepayRegisterCtrl', YeepayRegisterCtrl);

    YeepayRangeCtrl.$inject = ['$scope',];
    function YeepayRangeCtrl($scope){
        $scope.banks = [
            {"name":"工商银行","icon":"icbc","single":"1万元","day":"2万元","month":"2万元"},
            {"name":"农业银行","icon":"abc","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"中国银行","icon":"boc","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"建设银行","icon":"ccb","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"光大银行","icon":"ceb","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"浦发银行","icon":"spdb","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"兴业银行","icon":"cib","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"招商银行","icon":"cmb","single":"5万元","day":"5万元","month":"10万元"},
            {"name":"交通银行","icon":"boco","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"民生银行","icon":"cmbc","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"华夏银行","icon":"hx","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"中信银行","icon":"ecitic","single":"5万元","day":"10万元","month":"10万元"},
            {"name":"广发银行","icon":"gdb","single":"5万元","day":"10万元","month":"10万元"}
        ];
    }
    hsWechatControllers.controller('YeepayRangeCtrl', YeepayRangeCtrl);
    /**
     * @description
     * 判断amount是否是金额，若能转化为小数且大于0则返回true，否则返回false
     * @return if is amount return true, else return false
     */
    function isAmount(amount) {
        if(!isNaN(amount) && parseFloat(amount) > 0) {
            return true;
        }
        return false;
    }

    /**
     * @description
     * 判断手机号是否合法
     * @return if is mobile return true, else return false
     */
    function isMobile(mobile) {
        return !!mobile && mobile.length == 11;
    }
})(angular, hsWechatControllers);