(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:PreviewDirective
     *
     * @restrict A
     *
     * @description
     * PreviewDirective
     * @example
     * <pre>
     * </pre>
     */
    PreviewDirective.$inject = ['$rootElement'];
    function PreviewDirective($rootElement){
        return {
            restrict: 'AE',
            replace:false,
            templateUrl : 'scripts/directives/Preview.tpl.html',
            scope:{
                imgArray : '=preview',
                index : '=default'
            },
            controller: ['$scope','$element', '$attrs','$rootElement', function ($scope,$element, $attrs,$rootElement) {
                $scope.index = $scope.index || 0;
                $scope.next = function(i){
                    $scope.index+=i;
                    if($scope.index===$scope.imgArray.length){
                        $scope.index=0;
                    }else if($scope.index === -1){
                        $scope.index=$scope.imgArray.length - 1;
                    }
                }
            }],
            link: function(scope, element, attrs) {

            }
        };
    }

    hsWechatDirectives.directive('preview', PreviewDirective);

})(angular, hsWechatDirectives);