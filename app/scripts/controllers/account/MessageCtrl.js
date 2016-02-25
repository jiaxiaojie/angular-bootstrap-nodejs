'use strict';
(function (angular, hsWechatControllers) {

    AccountMessageCtrl.$inject = ['$scope', '$timeout', '$rootElement', '$sce', 'SharedState', 'Account', 'Tip', 'Message', 'Loading'];
    function AccountMessageCtrl($scope, $timeout, $rootElement, $sce, SharedState, Account, Tip, Message, Loading) {

        //根据标签获取消息IDs
        $scope.activeTab = 1;
        $scope.messageIds = [];
        $scope.getMsgIds = getMsgIds;
        function getMsgIds() {
            if ($scope.activeTab == 1) {//账户消息
                for (var i in $scope.accountMessages) {
                    if ($scope.accountMessages[i].status != 2) {
                        $scope.messageIds = $scope.messageIds.concat($scope.accountMessages[i].messageId);
                    }
                }
            } else if ($scope.activeTab == 2) {//系统消息
                for (var i in $scope.systemMessages) {
                    if ($scope.systemMessages[i].status != 2) {
                        $scope.messageIds = $scope.messageIds.concat($scope.systemMessages[i].messageId);
                    }
                }
            }
        }

        //切换标签
        $scope.loadMore = function (refresh) {
            switch ($scope.activeTab) {
                case 1:
                    loadMoreAccount(refresh);
                    break;
                case 2:
                    loadMoreSystem(refresh);
                    break;
            }
        };

        //我的消息-账户消息
        $scope.pageSizeAccount = 20;
        $scope.pageNumberAccount = 1;
        $scope.accountMessages = [];
        $scope.loadMoreAccount = loadMoreAccount;
        function loadMoreAccount(refresh) {
            if (refresh) {
                $scope.pageNumberAccount = 1;
            }
            Loading.show(function () {
                Message.accountMessagePageList($scope.pageSizeAccount, $scope.pageNumberAccount).then(function (page) {
                    Loading.hide();
                    if (refresh) {
                        $scope.accountMessages = [];
                    }
                    if (page.length > 0) {
                        $scope.pageNumberAccount++;
                        $scope.accountMessages = $scope.accountMessages.concat(page);
                    }
                    loadMoreSystem(true);
                    Loading.hide();
                });
            }, refresh);
        }
        loadMoreAccount(true);

        //我的消息-系统消息
        $scope.pageSizeSystem = 20;
        $scope.pageNumberSystem = 1;
        $scope.systemMessages = [];
        $scope.loadMoreSystem = loadMoreSystem;
        function loadMoreSystem(refresh) {
            if (refresh) {
                $scope.pageNumberSystem = 1;
            }
            Loading.show(function () {
                Message.systemMessagePageList($scope.pageSizeSystem, $scope.pageNumberSystem).then(function (page) {
                    Loading.hide();
                    if (refresh) {
                        $scope.systemMessages = [];
                    }
                    if (page.length > 0) {
                        $scope.pageNumberSystem++;
                        $scope.systemMessages = $scope.systemMessages.concat(page);
                    }
                    Loading.hide();
                });
            }, refresh);
        }

        //开关，点击标记已读
        $scope.isOpen = false;
        $scope.openAndRead = openAndRead;
        function openAndRead(messageId, status) {
            $scope.messageId = messageId;
            $scope.isOpen = !$scope.isOpen;
            if (status != 2) {//未读消息，点击标记为已读
                Message.read(messageId).then(function (res) {
                    if ($scope.activeTab == 1) {
                        loadMoreAccount(true);
                    }else if ($scope.activeTab == 2) {
                        loadMoreSystem(true);
                    }
                }, function (reason) {
                });
            }
        }

        //弹窗
        $scope.readAll = readAll;
        function readAll() {
            getMsgIds();
            if ($scope.messageIds.length > 0) {
                SharedState.turnOn('modalContact');
            } else {
                Tip.show('没有未读消息', 3000, '#showTip');
            }
        }

        //确认全部已读
        $scope.readAllConfirm = readAllConfirm;
        function readAllConfirm() {
            getMsgIds();
            Message.read($scope.messageIds).then(function (res) {
                SharedState.turnOff('modalContact');
                if ($scope.activeTab == 1) {
                    loadMoreAccount(true);
                }else if ($scope.activeTab == 2) {
                    loadMoreSystem(true);
                }
            }, function (reason) {
            });
        }

    }

    hsWechatControllers.controller('AccountMessageCtrl', AccountMessageCtrl);


})(angular, hsWechatControllers);