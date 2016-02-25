(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:ClearIdDirective
     *
     * @restrict A
     *
     * @description
     * ClearIdDirective
     * @example
     * <pre>
     *     <input ng-model="mobile" type="text" class="form-control" placeholder="请输入手机号码" clear-id="mobile">
     *     <span class="input-group-addon" clear-for="mobile">×</span>
     * </pre>
     */
    ClearIdDirective.$inject = ['$rootElement'];
    function ClearIdDirective($rootElement){
        return {
            restrict: 'A',
            require : '?ngModel',
            replace:false,
            link: function(scope, element, attrs, ngModel) {
                angular.element( $rootElement[0].querySelector('[clear-for='+attrs['clearId']+']')).bind('click', function(){
                    element.val('');
                    if(ngModel){
                        scope.$apply(function() {
                            ngModel.$setViewValue('');
                        });
                    }
                });
            }
        };
    }

    hsWechatDirectives.directive('clearId', ClearIdDirective);

})(angular, hsWechatDirectives);