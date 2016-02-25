'use strict';
(function (angular, hsWechatControllers) {

    AccountRecommendCtrl.$inject = ['$scope','$state','Account','Common','UAService'];
    function AccountRecommendCtrl($scope,$state,Account,Common,UA){
        //Deleted by wenqiang
        //不需要登陆
        //$scope.earningAmount = 0;
        //$scope.earningTicketAmount = 0;
        //Account.getMyInvitationStat().then(function(res){
        //    $scope.earningAmount = res.earningAmount;
        //    $scope.earningTicketAmount = res.earningTicketAmount;
        //},function(reason){
        //});

        $scope.appShare = appShare;
        function appShare(){
            if(Common.inApp()){
                var appRootUrl = Common.getServerConfig().appRootUrl;
                var data = $state.current.data;
                var link = UA.isIOS ? 'http://m.hsbank360.com/sign/register' : 'http://m.hsbank360.com/sign/register?nothing';
                var imgUrl = /^https?.*$/.test(data.$wechatShareImgUrl) ? data.$wechatShareImgUrl :  appRootUrl + data.$wechatShareImgUrl;
                Common.getHsbank().activityShare(data.$wechatShareTitle,data.$wechatShareDesc,link,imgUrl);
            }
        }
    }

    hsWechatControllers.controller('AccountRecommendCtrl', AccountRecommendCtrl);

    RecommendDetailCtrl.$inject = ['$scope','$state','Account'];
    function RecommendDetailCtrl($scope,$state,Account){
        $scope.earningAmount = 0;
        $scope.earningTicketAmount = 0;
        Account.getMyInvitationStat().then(function(res){
            $scope.earningAmount = res.earningAmount;
            $scope.earningTicketAmount = res.earningTicketAmount;
        },function(reason){
        });
        //首次加载
        RecommendEarning($scope,Account);
        RecommendEarningTicket($scope,Account);

        $scope.loadMore = loadMore;
        $scope.detailTab = $state.params && $state.params.tab? $state.params.tab  : 1 ;
        $scope.setDetailTab = function(tab){
            $scope.detailTab = tab;
        }
        function loadMore(tab){
            if($scope.detailTab === 1){
                $scope.loadMoreEarning();
            }else{
                $scope.loadMoreEarningTicket();
            }
        }
        function RecommendEarning($scope,Account){
            $scope.pageSize = 10;
            $scope.pageNumber = 1;
            $scope.earningList = [];
            $scope.loadMoreEarning = loadMoreEarning;
            function loadMoreEarning(){
                Account.getMyEarningPageList($scope.pageSize, $scope.pageNumber).then(function(page) {
                    if(page.length > 0) {
                        $scope.pageNumber++;
                        $scope.earningList = $scope.earningList.concat(page);
                    }
                }, function(reason) {

                });
            }
            loadMoreEarning();
        }
        function RecommendEarningTicket($scope,Account){
            $scope.ticketPageSize = 20;
            $scope.ticketPageNumber = 1;
            $scope.tickets = [];
            $scope.loadMoreEarningTicket = loadMoreEarningTicket;
            function loadMoreEarningTicket(){
                Account.getMyEarningTicketPageList($scope.ticketPageSize, $scope.ticketPageNumber).then(function(page) {
                    if(page.length > 0) {
                        $scope.ticketPageNumber++;
                        $scope.tickets = $scope.tickets.concat(page);
                    }
                }, function(reason) {

                });
            }
            loadMoreEarningTicket();
        }
    }
    hsWechatControllers.controller('RecommendDetailCtrl', RecommendDetailCtrl);

    RecommendMyCtrl.$inject = ['$scope','Account'];
    function RecommendMyCtrl($scope,Account){
        $scope.pageSize = 20;
        $scope.pageNumber = 1;
        $scope.friends = [];
        $scope.loading = false;
        $scope.refreshLoading = false;
        $scope.loadMore = loadMore;
        function loadMore(refresh){
            if($scope.refreshLoading || $scope.loading ) return;
            if(refresh){
                $scope.refreshLoading = true;
                $scope.pageNumber = 1;
            }else{
                $scope.loading = true;
            }

            Account.getMyInvitationPageList($scope.pageSize, $scope.pageNumber).then(function(page) {
                if(refresh){
                    $scope.friends = [];
                    $scope.refreshLoading = false;
                }else{
                    $scope.loading = false;
                }

                if(page.length > 0) {
                    $scope.pageNumber++;
                    $scope.friends = $scope.friends.concat(page);
                }
            }, function(reason) {

            });
        }
        loadMore(); //首次加载



        $scope.my = {};
        Account.getMyInvitationStat().then(function(res){
            $scope.my = res;
        },function(reason){
        });
    }

    hsWechatControllers.controller('RecommendMyCtrl', RecommendMyCtrl);

})(angular, hsWechatControllers);