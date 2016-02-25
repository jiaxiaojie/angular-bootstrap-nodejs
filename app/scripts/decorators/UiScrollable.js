//如果scrollable里面有左右滑动的幻灯片，允许滚动
(function (angular, hsWechatDecorators) {

    decoratorConfig.$inject = ['$provide'];
    function decoratorConfig($provide) {

        //幻灯片的时候禁止 `overthrow`
        decorator.$inject = ['$delegate'];
        function decorator($delegate) {
            var directive = $delegate[0];

            directive.compile = function () {
                return function (iScope, iElement, iAttrs) {
                    if(iElement[0].querySelectorAll('[rn-carousel]').length > 0){
                        overthrow.forget();
                    }
                }
            };

            return $delegate;
        }
        $provide.decorator('scrollableContentDirective', decorator);
    }

    hsWechatDecorators.config(decoratorConfig);

})(angular, hsWechatDecorators);