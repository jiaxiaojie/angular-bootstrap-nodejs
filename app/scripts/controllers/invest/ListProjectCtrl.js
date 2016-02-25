'use strict';
(function (angular, hsWechatControllers) {

    InvestListProjectCtrl.$inject = ['$http', '$scope', '$state', 'Project', 'Account', '$timeout', '$element', 'Loading', 'Current'];
    function InvestListProjectCtrl($http, $scope, $state, Project, Account, $timeout, $element, Loading, Current) {

        //获取活花生项目列表
        function loadMoreCurrent() {
            Current.pageList(1, 1).then(function (res) {
                $scope.currents = res;
            });
        }


        $scope.getProjectList = function () {
            if ($scope.sortField) {
                var arr = [];
                angular.forEach($scope.projectList, function (o) {
                    if (o.status == 3) arr.push(o);
                });
                return arr;
            }

            return $scope.projectList;
        };

        //获取项目列表
        $scope.pageSize = 10;
        $scope.pageNumber = 1;
        $scope.projectList = [];
        $scope.loadMore = loadMore;
        function loadMore(refresh) {
            Loading.show(function () {
                if (refresh) {
                    loadMoreCurrent();
                    $scope.pageNumber = 1;
                }
                Project.getProjectsPageList($scope.pageSize, $scope.pageNumber).then(function (page) {
                    Loading.hide();
                    if (refresh) {
                        $scope.projectList = [];
                        $scope.projectListOrder = [];
                    }
                    if (page.length > 0) {
                        $scope.pageNumber++;
                        $scope.projectList = $scope.projectList.concat(page);
                    }
                }, function (reason) {
                });

            }, refresh);
        }

        //首次加载
        loadMore(true);
        //向下取整
        $scope.round = round;
        function round(number) {
            return Math.round(number);
        }

        //截断字符串并加上省略号
        $scope.subString = subString;
        function subString(str, length) {
            return str.length <= length ? str : str.substr(0, length) + '...';
        }

        //order by
        $scope.sortField = undefined;
        $scope.reverse = false;
        $scope.sort = function (filedName) {
            if (!filedName) {
                $scope.reverse = false;
                $scope.sortField = filedName;
                return
            }
            if ($scope.sortField === filedName) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.sortField = filedName;
                switch (filedName) {
                    case 'annualizedRate':
                        $scope.reverse = true;
                        break;
                    default:
                        $scope.reverse = false;
                }
            }
        }

    }

    hsWechatControllers.controller('InvestListProjectCtrl', InvestListProjectCtrl);
})(angular, hsWechatControllers);