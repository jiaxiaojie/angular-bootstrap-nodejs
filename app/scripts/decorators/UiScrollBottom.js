/**
 * Created by pc on 2015/10/20.
 * @description
 * 解决向下滚动像素误差,像素误差最大允许1像素
 */
(function (angular, hsWechatDecorators) {

    decoratorConfig.$inject = ['$provide'];
    function decoratorConfig($provide) {

        function reached(elem){
            return Math.abs(elem.scrollHeight - (elem.scrollTop + elem.clientHeight)) <= 1;
        }

        decorator.$inject = ['$delegate'];
        function decorator($delegate) {
            var directive = $delegate[0];

            directive.compile = function () {
                return function(scope, elem, attrs) {
                    elem.on('scroll', function () {
                        /* If reached bottom */
                        if (reached(elem[0])) {
                            /* Do what is specified by onScrollBottom */
                            scope.$apply(function () {
                                scope.$eval(attrs['uiScrollBottom']);
                            });
                        }
                    });
                }
            };

            return $delegate;
        }
        $provide.decorator('uiScrollBottomDirective', decorator);
    }

    hsWechatDecorators.config(decoratorConfig);

})(angular, hsWechatDecorators);

