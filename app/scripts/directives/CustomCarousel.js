(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:customCarousel
     *
     * @restrict AE
     *
     * @description
     * CustomCarouselDirective
     * @example
     * <pre>
     *     <uib-carousel interval="5000" no-wrap="noWrapSlides" template-url="scripts/directives/Carousel.tpl.html" custom-carousel no-index="false" no-switch="true">
             <uib-slide ng-repeat="slide in slides" template-url="scripts/directives/Carousel.Slide.tpl.html">
             <img ng-src="{{slide.img}}" ng-click="go(slide)" style="margin:auto;">
             </uib-slide>
            </uib-carousel>
     * </pre>
     */
    CustomCarouselDirective.$inject = [];
    function CustomCarouselDirective(){
        return {
            restrict: 'AE',
            replace:false,
            controller: ['$element','$attrs','$timeout',function ( $element,$attrs,$timeout) {
                //$timeout(function(){
                    if($attrs.noIndex == 'true'){
                        angular.element($element[0].querySelectorAll('.carousel-indicators')).addClass('hide');
                    }
                    if($attrs.noSwitch == 'true'){
                        angular.element($element[0].querySelectorAll('.carousel-control')).addClass('hide');
                    }
                //})
            }]
        };
    }

    hsWechatDirectives.directive('customCarousel', CustomCarouselDirective);

})(angular, hsWechatDirectives);