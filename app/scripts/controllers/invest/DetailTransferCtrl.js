'use strict';
(function (angular, hsWechatControllers) {

    InvestDetailTransferCtrl.$inject = ['$http', '$scope', '$state', '$stateParams', 'Project', 'Account'];
    function InvestDetailTransferCtrl($http, $scope, $state, $stateParams, Project, Account){
        $scope.projectId = $stateParams.projectId;
    }

    hsWechatControllers.controller('InvestDetailTransferCtrl', InvestDetailTransferCtrl);
})(angular, hsWechatControllers);