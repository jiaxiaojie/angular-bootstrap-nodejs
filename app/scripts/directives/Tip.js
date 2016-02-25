(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc service
     * @name hsWechat.directives.Tip
     * @requires $rootScope
     * @requires $timeout
     * @description
     * 提供Tip的相关服务
     */
    Tip.$inject = ['$rootScope'];
    function Tip($rootScope) {
        /**
         * @ngdoc function
         * @name hsWechat.services.Tip.show
         * @methodOf hsWechat.directives.Tip
         * @param {String} msg 信息
         * @param {int} timeout 提示时间（可选）默认1.5秒
         * @param {String} selector 
         * @description 显示提示信息
         */
        this.show = show;
        function show(msg,timeout,selector){
            if(typeof timeout == 'string'){
                selector = timeout;
                timeout = 1500
            }
            if(!timeout) timeout = 1500;
            $rootScope.$broadcast('tipShow', msg ,timeout,selector);
        }


        /**
         * @ngdoc function
         * @name hsWechat.services.Tip.showError
         * @methodOf hsWechat.directives.Tip
         * @param {String} msg 错误信息
         * @param {int} timeout 提示时间
         * @description 显示错误信息
         */
        this.showError = show;

        /**
         * @ngdoc function
         * @name hsWechat.services.Tip.showPopover
         * @methodOf hsWechat.directives.Tip
         * @param {String} msg 提示信息
         * @param {String} selector
         * @param {String} [direction] 显示方向 //left、right、top、bottom
         * @param {String} [width] 显示popover宽度
         * @description 显示 popover 信息
         */
        this.showPopover = showPopover;
        function showPopover(msg,selector,direction,width){
            $rootScope.$broadcast('showPopover',msg,selector,direction,width);
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Tip.hidePopover
         * @methodOf hsWechat.directives.Tip
         * @description 隐藏 popover
         */
        this.hidePopover = hidePopover;
        function hidePopover(){
            $rootScope.$broadcast('hidePopover');
        }
        /**
         * @ngdoc function
         * @name hsWechat.services.Tip.showNovice
         * @methodOf hsWechat.directives.Tip
         * @param {String} level 步骤
         * @description 显示 Novice 信息
         */
        this.showNovice = showNovice;
        function showNovice(level){
            $rootScope.level = level;
        }

        /**
         * @ngdoc function
         * @name hsWechat.services.Tip.hideNovice
         * @methodOf hsWechat.directives.Tip
         * @description 隐藏 novice task
         */
        this.hideNovice = hideNovice;
        function hideNovice(){
            delete $rootScope['level'];
        }
    }
    hsWechatDirectives.service('Tip', Tip);




    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:tip
     *
     * @restrict A
     *
     * @description
     * TipDirective
     * @example
     * <pre>
     *     <div class="modal invest-calculator ng-scope" ui-if="modalTip" ui-state="modalTip" ui-default="false">
     *      <div class="modal-dialog">
     *              <div class="modal-body text-center">
     *                  <span class="login-tip">{{msg}}</span>
     *              </div>
     *       </div>
     *      </div>
     * </pre>
     */
    TipDirective.$inject = ['Tip'];
    function TipDirective(Tip){
        return {
            restrict: 'A',
            replace:false,
            scope:{},
            //template:'<div tip></div>',

            templateUrl:'scripts/directives/Tip.tpl.html',

            controller: ['$scope', '$element', '$attrs','$timeout','$rootElement','$window', 'SharedState',function ($scope, $element, $attrs,$timeout,$rootElement,$window, SharedState) {
                $scope.msg = "";
                $scope.myStyle ={};
                $scope.$on('tipShow', function(e,msg,timeout,selector){
                    $scope.msg = msg;
                    SharedState.turnOn('modalTip');
                    $timeout(function(){
                        SharedState.turnOff('modalTip');
                    },timeout);

                    var selectorObj = $rootElement[0].querySelectorAll(selector)[0];
                    if(selectorObj){
                        var position = getPosition(selectorObj);
                        $scope.myStyle.top = position.top+10+'px';
                    }else{
                        $scope.myStyle.top =  ($window.innerHeight-30)/2 + 'px';
                    }
                });
            }]
        };
    }

    hsWechatDirectives.directive('tip', TipDirective);

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:tipPopoverStatic
     * @restrict A
     * @description
     * PopoverDirective
     * @example
     * <pre>
     *      <div class="popover fade in" ng-class="direction" role="tipMsgAccount"  ng-style="myStyle" ui-outer-click="outerClick()">
     *      <div class="arrow"></div>
     *          <div class="popover-content" ng-bind="msg"></div>
     *      </div>
     * </pre>
     */
    TipPopoverStaticDirective.$inject = ['Tip'];
    function TipPopoverStaticDirective(Tip){
        return {
            restrict: 'A',
            replace:false,
            scope:{},
            templateUrl:'scripts/directives/Popover.tpl.html',
            controller: ['$scope', '$element', '$attrs','$rootElement','$window','$timeout',function ($scope, $element, $attrs,$rootElement,$window,$timeout) {
                var defLeft = 2,windowWidth = $window.innerWidth, maxWidth = windowWidth - defLeft*2,defWidth = 280,
                    defStyle =  {maxWidth:maxWidth+'px',display:'block',visibility : 'hidden'};
                $scope.msg = "";
                $scope.direction = "";
                $scope.myStyle = {};

                $scope.$on('showPopover', function(e,msg,selector,direction,width){
                    var selectorObj = typeof selector == 'string'? $rootElement[0].querySelectorAll(selector)[0]
                         : angular.element(selector)[0];
                    if(selectorObj){
                        $scope.msg = msg;
                        $scope.direction = direction || "bottom";
                        var currWidth = (width ? width : defWidth );

                        $scope.myStyle = angular.extend({},defStyle,{
                            width:currWidth+'px'
                        });

                        $timeout(function(){
                            var position = getPosition(selectorObj);
                            var currHeight = $element[0].querySelector('.popover').offsetHeight,
                                widthHalf = currWidth/ 2,
                                objWidth = selectorObj.offsetWidth,
                                objHeight = selectorObj.offsetHeight,
                                currTop,currLeft;
                            var arrow = $element[0].querySelector('.arrow');

                            switch ($scope.direction){
                                case 'right':
                                case 'left':
                                    currLeft = $scope.direction == 'right' ? position.left + objWidth : position.left - currWidth;
                                    currTop = position.top - currHeight/2 + objHeight/2;
                                    break;
                                case 'top':
                                case 'bottom':
                                    currTop = $scope.direction == 'top' ?position.top-currHeight : position.top + selectorObj.offsetHeight;
                                    if(widthHalf > position.left){
                                        arrow.style.left = position.left + objWidth/2 - defLeft +'px';
                                        currLeft = defLeft;
                                    }else if(widthHalf > windowWidth-position.left){
                                        arrow.style.left = currWidth - (windowWidth-position.left-defLeft) +objWidth/2 + 'px';
                                        currLeft = windowWidth - currWidth - defLeft;
                                    }else{
                                        arrow.style.left = '50%';
                                        currLeft = position.left + objWidth/2 -  widthHalf;
                                    }
                            }


                            $scope.myStyle = angular.extend({},defStyle,{
                                visibility : 'visible',
                                width:currWidth+'px',
                                top:currTop+'px',
                                left:currLeft+'px'
                            });
                        });
                    }else{
                        throw new Error('not find selector: "'+ selector +'"');
                    }
                });

                $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                    Tip.hidePopover();
                });

                $scope.outerClick = function(){
                    Tip.hidePopover();
                };

                $scope.$on('hidePopover', function(e){
                    $scope.msg = "";
                    $scope.direction = "";
                    $scope.myStyle.visibility = 'hidden';
                });
            }]
        };
    }
    hsWechatDirectives.directive('tipPopoverStatic', TipPopoverStaticDirective);


    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:tipPopover
     * @restrict A
     * @description
     * TipPopoverBindDirectives
     * @example
     * <pre>
     *      <i class="icon-question-mark" tip-popover msg="测试" direction="bottom" fixedWidth="100"></i>
     * </pre>
     */
    TipPopoverDirectives.$inject = ['Tip','$timeout'];
    function TipPopoverDirectives(Tip,$timeout){
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind("click",function(e){
                    $timeout(function(){  //优先执行hide popover
                        e.preventDefault();
                        Tip.showPopover(attrs['msg'],element,attrs['direction'],attrs['fixedWidth']);
                    });
                });
            }
        };
    }
    hsWechatDirectives.directive('tipPopover', TipPopoverDirectives);

    function getPosition(o)
    {
        var temp={};
        temp.left=temp.right=temp.top=temp.bottom=0;
        var oWidth=o.offsetWith,oHeight=o.offsetheight;
        while(o && o!=document.body)
        {
            temp.left+=o.offsetLeft;
            temp.top+=o.offsetTop;
            o=o.offsetParent;
        }
        temp.right=temp.left+oWidth;
        temp.bottom=temp.top+temp.oHeight;
        return temp;
    }
})(angular, hsWechatDirectives);