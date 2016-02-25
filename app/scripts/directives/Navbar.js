(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc service
     * @name hsWechat.directives.Navbar
     * @requires $state
     * @requires $rootScope
     * @description
     * 提供Navbar的相关服务
     */
    Navbar.$inject = ['$state','$rootScope'];
    function Navbar($state,$rootScope) {
        var stack = [],isPoping = false;

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#getStateByPop
         * @methodOf hsWechat.directives.Navbar
         * @param {Number} level
         * @description
         * get state info  by pop level
         */
        this.getStateByPop = function(level){
            if(isNaN(level)) level = 1;

            if(canPop(level)){
                return stack[stack.length-1-level];
            }
            return null;
        };

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#pop
         * @methodOf hsWechat.directives.Navbar
         * @param {Number} level
         * @description
         * 后退几步，默认1（可选）
         */
        this.pop = function(level){
            if(isNaN(level)) level = 1;
            isPoping = true;

            if(!canPop(level)){
                throw  new Error('no prev state');
            }
            var len = stack.length, index = len-level-1;
            var from = stack[len-1];  //FROM STATE
            var to = stack[index];  //TO STATE

            if($rootScope.$broadcast('navbarPopStart',to.state,to.params, from.state, from.params).defaultPrevented){
                $rootScope.$broadcast('navbarPopCancel',to.state,to.params, from.state, from.params);
                return false;
            }
            $state.go(to.state.name ,to.params);
            $rootScope.$broadcast('navbarPopSuccess',to.state,to.params,from.state, from.params);
            stack.splice(index+1,len-index-1);
            return true;
        };

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#setPoping
         * @methodOf hsWechat.directives.Navbar
         * @param {boolean} isPoping
         * @description
         * 设置isPoping
         */
        this.setPoping = function(_isPoping){
            isPoping = _isPoping;
        };

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#checkPoping
         * @methodOf hsWechat.directives.Navbar
         * @returns {boolean}
         * @description
         * 是否能够POP检查是否为POP动作
         */
        this.checkPoping = function(){
            return isPoping;
        };

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#canPop
         * @methodOf hsWechat.directives.Navbar
         * @param level 后退几步，默认1（可选）
         * @returns {boolean} 是否能够POP
         * @description 是否能够后退
         */
        this.canPop = canPop;
        function canPop(level){
            if(isNaN(level)) level = 1;
            return level < stack.length;
        }


        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#isEmptyStack
         * @methodOf hsWechat.directives.Navbar
         * @returns {boolean}
         * @description 判断stack是否为空
         */
        this.isEmptyStack = isEmptyStack;
        function isEmptyStack(){
            return stack == null || stack.length === 0;
        }

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#init
         * @methodOf hsWechat.directives.Navbar
         * @param {Object} current
         * @description 初始化Navbar
         */
        this.init = init;
        function init(current){
            stack = [];
            isPoping = false;
            stack.push(current);
        }

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#push
         * @methodOf hsWechat.directives.Navbar
         * @param {Object} current
         * @param {number} i
         * @description
         * 添加当前state
         */
        this.push = push;
        function push(current){
            stack.push(current);
        };

        /**
         * @ngdoc function
         * @name hsWechat.directives.Navbar#setTitle
         * @methodOf hsWechat.directives.Navbar
         * @param {String} title navbar标题
         * @description 修改navbar标题
         */
        this.setTitle = function(title){
            $rootScope.$broadcast('navbarTitleChange', title);
        };
    }

    hsWechatDirectives.service('Navbar', Navbar);




    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:navbar
     *
     * @requires ui.router.state.$state
     * @requires ui.router.state.$stateParams
     *
     * @restrict A
     *
     * @description
     * this directive stack the $state of ui-router.
     * we can push the new state on the state stack,
     * then simply popup this state to go back the old state
     *
     * @example
     * when give the state config as following
     * <pre>
     *     $stateProvider.state('three',{
     *          url:'/three',
     *          template:"<div>three</div>",
     *          data: {$navbarDirection: 'go', $navbarTitle: 'three', $navbarShow: true}});
     * </pre>
     * insert the tag into html document:
     * <pre>
     *     <div navbar></div>
     * </pre>
     * when $state.go('three'), we get the following html:
     * <pre>
     *     <nav ng-show="show"><button>返回</button><span>three</span></nav>
     * </pre>
     * click the button, stack view will popup to old state
     *
     * configs:
     *
     * `$navbarDirection` : *go* clear the stack; *push* push the new state to the stack, can pop up later.
     *
     * `$navbarTitle`: navbar title
     *
     * `$navbarShow`: show or hide the navbar
     *
     * `$navbarPopDefault`: If direction is 'push', we need the default prev state.
     * If no default, the default set to its parent.
     * If default's parent is abstract, prev will be parent of parent, and so on
     *
     * @throws Error "no prev state provide"
     *
     *
     */
    NavbarDirective.$inject = ['Navbar'];
    function NavbarDirective(Navbar) {
        return {
            restrict: 'A',
            replace:true,
            scope:{},
            //template:'<nav ng-show="show"><button ng-hide="hideGobackButton">返回</button><span>{{title}}</span></nav>',

            templateUrl:'scripts/directives/Navbar.tpl.html',

            link: function(scope, element, attrs) {
                element.find('button').bind('click', function(){
                    Navbar.pop();
                });
            },

            controller: ['$scope', '$element', '$attrs', '$state', '$rootElement','Capture', function ($scope, $element, $attrs, $state, $rootElement,Capture) {
                //push,
                function onStateChangeSuccessEvent(event, toState, toParams, fromState, fromParams) {
                    var hideNavbar = false, hideNavbarBottom = false;
                    if(toState.data && toState.data.$hideNavbarBottom )
                        hideNavbarBottom = toState.data.$hideNavbarBottom ? true : false;

                    if(toParams && toParams._hideNavbar)
                        hideNavbar = toParams._hideNavbar ? true : false;
                    if(toParams && toParams._hideNavbarBottom )
                        hideNavbarBottom = toParams._hideNavbarBottom ? true : false;
                    $scope.hideGobackButton = false;
                    $scope.show = (toState.data && toState.data.$navbarShow ? true : false) && !hideNavbar;
                    $scope.title = toState.data && toState.data.$navbarTitle;

                    if(!toState.data || !toState.data.$navbarDirection || toState.data.$navbarDirection == 'go'){
                        Navbar.init({state:toState, params:toParams});
                    }else if(toState.data.$navbarDirection == 'push'){
                        if(!Navbar.checkPoping()){
                            if($scope.show && Navbar.isEmptyStack()){
                                //when can not popup, we need a default;
                                var def = toState.name;
                                if(toState.data && toState.data.$navbarPopDefault){
                                    def = toState.data.$navbarPopDefault+'.nothing';
                                }
                                var names = def.split('.');
                                var i = names.length;
                                while(--i){
                                    def = names.slice(0,i).join('.');
                                    var tmp = $state.get(def);
                                    if(tmp && !tmp.abstract){
                                        Navbar.push({state:tmp});
                                        break;
                                    }else{
                                        continue;
                                    }
                                }
                            }
                            Navbar.push({state:toState, params:toParams});
                        }else{
                            Navbar.setPoping(false);
                        }

                    }

                    if(!Navbar.canPop()){
                        $scope.hideGobackButton = true;
                    }

                    if($scope.show){
                        $rootElement.removeClass('hide-navbar-title');
                    }else{
                        $rootElement.addClass('hide-navbar-title');
                    }

                    var nab = $rootElement[0].querySelector(".navbar-absolute-bottom");
                    if(nab){
                        if(($scope.show && !$scope.hideGobackButton) || hideNavbarBottom){
                            $rootElement.removeClass('has-navbar-bottom');
                            nab.style["display"]="none";
                        }else{
                            $rootElement.addClass('has-navbar-bottom');
                            nab.style["display"]="block";
                        }
                    }

                }
                $scope.$on('$stateChangeSuccess', onStateChangeSuccessEvent);

                $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
                    Capture.setContentFor('navbarAction','',$scope);
                });

                $scope.$on('navbarTitleChange', function(event,title){
                    $scope.title = title;
                });
            }]
        };
    }

    hsWechatDirectives.directive('navbar', NavbarDirective);

})(angular, hsWechatDirectives);