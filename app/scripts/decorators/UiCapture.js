(function (angular, hsWechatDecorators) {

    /**
     * 为了兼容ui-router-extras stickyState
     * 修改了mobile-angular-ui ui-content-for
     */
    decoratorConfig.$inject = ['$provide'];
    function decoratorConfig($provide) {

        decorator.$inject = ['$delegate', '$state', 'Capture'];
        function decorator($delegate, $state,  Capture){
            var directive = $delegate[0];
            directive.compile = function (tElem, tAttrs) {
                var rawContent = tElem.html();
                if(tAttrs.uiDuplicate === null || tAttrs.uiDuplicate === undefined) {
                    // no need to compile anything!
                    tElem.html('');
                    tElem.remove();
                }
                return function(scope, elem, attrs) {
                    //when link the ele, store the state name;
                    var eleStateName = $state.current.name;
                    //Capture.setContentFor(attrs.uiContentFor, rawContent, scope);
                    function chainHasStick(){

                    }
                    var sticky = $state.$current.sticky;
                    if(!sticky){
                        var p = $state.$current.parent;
                        if(p){
                            sticky = p.sticky;
                        }
                        while(p && !sticky){
                            p = p.parent;
                            if(p){
                                sticky = p.sticky;
                            }
                        }
                    }
                    if(!sticky){
                        Capture.setContentFor(attrs.uiContentFor, rawContent, scope);
                    }else{
                        scope.$on('$stateChangeSuccess', function (event, next, current) {
                            if(next.name === eleStateName){
                                Capture.setContentFor(attrs.uiContentFor, rawContent, scope);
                            }
                        });
                    }
                };
            };
            return $delegate;
        }
        $provide.decorator('uiContentForDirective', decorator);
    }

    hsWechatDecorators.config(decoratorConfig);

})(angular, hsWechatDecorators);