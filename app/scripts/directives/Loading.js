(function (angular, hsWechatDirectives) {


    /**
     * @ngdoc service
     * @name hsWechat.directives.Loading
     * @requires $rootScope
     * @requires $timeout
     * @description
     * 提供Loading的相关服务
     */
    LoadingService.$inject = ['$rootScope','$timeout','$q','SharedState'];
    function LoadingService($rootScope,$timeout,$q,SharedState) {


        this.mask = mask;
        function mask(fun){
            $q.when($rootScope.$eval(fun)).then(function(){
                SharedState.turnOn('maskModal');
            });
        }

        this.hideMask = hideMask;
        function hideMask(){
            SharedState.turnOff('maskModal');
        }


        this.refresh = refresh;
        function refresh(){
            $rootScope.$broadcast('showLoadingEvent',true);
        }

        this.show = show;
        function show(getData,isRefresh){
            $timeout(function(){
                $rootScope.$broadcast('showLoadingEvent',getData,isRefresh);
            });
        }

        this.hide = hide;
        function hide(){
            $rootScope.$broadcast('hideLoadingEvent');
        }
    }

    hsWechatDirectives.service('Loading', LoadingService);


    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:LoadingDirective
     *
     * @restrict AC
     *
     * @description
     * LoadingDirective
     * @example
     * <pre>
     * </pre>
     */
    LoadingDirective.$inject = [];
    function LoadingDirective(){
        return {
            restrict: 'ACE',
            replace:false,
            scope:true,
            template : function(ele, attrs){
                var refreshLoading = '<div class="app-content-loading invest-bottom-loading text-center" ng-show="refreshLoading"><i class="fa fa-spinner fa-spin loading-spinner"></i></div>';
                var loading = '<div class="app-content-loading invest-bottom-loading text-center" ng-show="loading"><i class="fa fa-spinner fa-spin loading-spinner"></i></div>';
                ele.prepend(refreshLoading).append(loading);
            },
            controller: ['$scope','$element', '$attrs','$interval', function ($scope,$element, $attrs,$interval) {
                $scope.$on('showLoadingEvent', function(e,getData,isRefresh){
                    if($scope.refreshLoading || $scope.loading ) return;
                    $scope.$eval(getData);
                    $scope.$apply(function(){
                        $scope.refreshLoading = !!isRefresh;
                        $scope.loading = !isRefresh;
                    });
                });
                $scope.$on('hideLoadingEvent', function(e){
                    $scope.refreshLoading = false;
                    $scope.loading = false;
                });
            }]
        };
    }

    hsWechatDirectives.directive('loading', LoadingDirective);

})(angular, hsWechatDirectives);