'use strict';
(function (angular, hsWechatControllers) {

    BankCardCtrl.$inject = ['$scope','SharedState','Account','Yeepay'];
    function BankCardCtrl($scope,SharedState,Account,Yeepay){

        $scope.unboundlingCard = unboundlingCard;
        function unboundlingCard(){
            Yeepay.unbundlingBankCard().then(function(res){
                SharedState.turnOn('mybankcardtip02');
                getAccountInfo();
            });
        }
        function getAccountInfo(){
            Account.refreshAccountInfo().then(function(res){
                $scope.accountInfo = res;
            });
        }
        getAccountInfo();
    }


    hsWechatControllers.controller('BankCardCtrl', BankCardCtrl);
})(angular, hsWechatControllers);