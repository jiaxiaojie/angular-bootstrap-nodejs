'use strict';
(function (angular, hsWechatControllers) {
    AccountNoviceCtrl.$inject = ['$scope','Account'];
    function AccountNoviceCtrl($scope,Account){
        $scope.novite = {};
        $scope.novite.hasLogin = Account.hasLogin();

        if($scope.novite.hasLogin){
            Account.refreshAccountInfo().then(function(res){
                $scope.novite.hasOpenThirdAccount = res.hasOpenThirdAccount == 1;
                $scope.novite.hasRecharged = res.hasRecharged == 0;
                $scope.novite.isNotNewUser = res.isNewUser != 0;
            });
        }
    }

    hsWechatControllers.controller('AccountNoviceCtrl', AccountNoviceCtrl);
})(angular, hsWechatControllers);