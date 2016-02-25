'use strict';
(function (angular, hsWechatControllers) {

    AccountTicketCtrl.$inject = ['$scope','Account','Config'];
    function AccountTicketCtrl($scope,Account,Config){
        $scope.tickets = [];
        $scope.ticketCount = 0;
        Account.getAccountInvestmentTickets().then(function(res){
            $scope.tickets = res;
        });
        Account.refreshAccountInfo().then(function(res){
            $scope.ticketCount =  res.bankCard ? res.bankCard.ticketCount : 0;
        });

        $scope.useTicketAmount = useTicketAmount;
        function useTicketAmount(n){
            return n/Config.constants.useTicketAmountRate;
        }
    }


    hsWechatControllers.controller('AccountTicketCtrl', AccountTicketCtrl);
})(angular, hsWechatControllers);