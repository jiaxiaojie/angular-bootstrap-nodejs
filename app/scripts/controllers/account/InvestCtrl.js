'use strict';
(function (angular, hsWechatControllers) {
    AccountInvestCtrl.$inject = ['$scope','$state','$stateParams', 'Account','Navbar'];
    function AccountInvestCtrl($scope,$state, $stateParams, Account,Navbar) {
        $scope.activeTab = 2;
        if($stateParams.activeTab) {
            $scope.activeTab = $stateParams.activeTab;
        }
        /*
         flag=1(投标中)：对应status=3(投标中)、对应status=4(投标结束)
         flag=2(持有中)：status=5(还款中)
         flag=3(已结束)：对应status=6(还款结束)、status=7(清算结束)
         */
        //用户投标中投资
        $scope.investmentTenderingList = [];
        //用户持有中投资
        $scope.investmentHoldingList = [];
        //用户已结束投资
        $scope.investmentFinishedList = [];

        Account.getMyInvestment(1).then(function(res) {
            $scope.investmentTenderingList = $scope.investmentTenderingList.concat(res.projectList);
        });
        Account.getMyInvestment(2).then(function(res) {
            $scope.investmentHoldingList = $scope.investmentHoldingList.concat(res.projectList);
        });
        Account.getMyInvestment(3).then(function(res) {
            $scope.investmentFinishedList = $scope.investmentFinishedList.concat(res.projectList);
        });

        $scope.goUrl = function(url) {
            $location.path(url);
        };
        //截断字符串并加上省略号
        $scope.subString = subString;
        function subString(str, length) {
            return str.length <= length ? str : str.substr(0, length) + '...';
        }

        $scope.detail = function(project,activeTab){
            var state = Navbar.getStateByPop(0);
            state.params.activeTab = activeTab;
            $state.go('account.investDetail',{recordId:project.recordId});
        };

        //order by
        $scope.sortField = 'opDt';
        $scope.reverse = true;
        $scope.sort = function(filedName){
            if ($scope.sortField === filedName) {
                $scope.reverse = !$scope.reverse;
            }else {
                $scope.sortField = filedName;
                switch (filedName){
                    case 'annualizedRate':
                        $scope.reverse = true;
                        break;
                    case 'opDt':
                        $scope.reverse = true;
                        break;
                    default:
                        $scope.reverse = false;
                }
            }
        }
    }

    hsWechatControllers.controller('AccountInvestCtrl', AccountInvestCtrl);


    AccountInvestDetailCtrl.$inject = ['$scope', '$stateParams', 'Account'];
    function AccountInvestDetailCtrl($scope, $stateParams, Account) {
        $scope.recordId = $stateParams.recordId;
        $scope.record = {};

        Account.getMyInvestmentDetail($scope.recordId).then(function(res) {
            $scope.record = res;
        }, function(reason) {
        });
    }

    hsWechatControllers.controller('AccountInvestDetailCtrl', AccountInvestDetailCtrl);

    AccountInvestPlanCtrl.$inject = ['$scope', '$stateParams', 'Account'];
    function AccountInvestPlanCtrl($scope, $stateParams, Account) {
        $scope.recordId = $stateParams.recordId;
        $scope.data = [] ;
        Account.repaymentPlan($scope.recordId).then(function(res) {
            $scope.data = res;
        }, function(reason) {
        });
    }

    hsWechatControllers.controller('AccountInvestPlanCtrl', AccountInvestPlanCtrl);
})(angular, hsWechatControllers);