'use strict';
(function (angular, hsWechatControllers) {
    AccountOverviewCtrl.$inject = ['$scope','Account','Tip'];
    function AccountOverviewCtrl($scope,Account,Tip){
        $scope.accountInfo = {};
        Account.refreshAccountInfo().then(function(res) {
            $scope.accountInfo = res;
        });
    }

    hsWechatControllers.controller('AccountOverviewCtrl', AccountOverviewCtrl);
})(angular, hsWechatControllers);