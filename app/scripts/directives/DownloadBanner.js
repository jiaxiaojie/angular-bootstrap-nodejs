(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:DownloadBannerDirective
     *
     * @restrict A
     *
     * @description
     * DownloadBannerDirective
     * @example
     * <pre>
     *     <input ng-model="mobile" type="text" class="form-control" placeholder="请输入手机号码" clear-id="mobile">
     *     <span class="input-group-addon" clear-for="mobile">×</span>
     * </pre>
     */
    DownloadBannerDirective.$inject = ['Common'];
    function DownloadBannerDirective(Common){
        return {
            restrict: 'A',
            replace:false,
            templateUrl : 'scripts/directives/DownloadBanner.tpl.html',
            scope:{},
            controller: ['$scope','$element', '$attrs','$rootElement', function ($scope,$element, $attrs,$rootElement) {
                $scope.show = !Common.inApp();
                $scope.draw = draw;
                function draw(){
                    var appBody = $rootElement[0].querySelector('.app-body');
                    appBody.style.paddingTop = ($rootElement.hasClass('hide-navbar-title') ? 0 : 50) + ($scope.show ? 50 : 0)   + 'px';
                }
                $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    draw();
                });
            }],
            link: function(scope, element, attrs) {
                angular.element( element[0].querySelector('.icon-close-white')).bind('click', function(){
                    scope.show = false;
                    scope.draw();
                });
            }
        };
    }

    hsWechatDirectives.directive('downloadBanner', DownloadBannerDirective);

})(angular, hsWechatDirectives);