(function (angular, hsWechatDecorators) {

    /**
     * 为了兼容ui-router-extras stickyState
     * 修改了mobile-angular-ui ui-content-for
     */
    decoratorConfig.$inject = ['$provide'];
    function decoratorConfig($provide) {

        decorator.$inject = ['$delegate', '$animate', '$interpolate', '$parse', '$state', 'SharedState'];
        function decorator($delegate, $animate, $interpolate, $parse, $state,  SharedState){
            var directive = $delegate[0];
            function getBlockNodes(nodes) {
                var node = nodes[0];
                var endNode = nodes[nodes.length - 1];
                var blockNodes = [node];
                do {
                    node = node.nextSibling;
                    if (!node) { break; }
                    blockNodes.push(node);
                } while (node !== endNode);

                return angular.element(blockNodes);
            }
            var parseUiCondition = function(name, attrs, $scope, SharedState, $parse, $interpolate) {
                var expr = attrs[name];
                var needsInterpolation = expr.match(/\{\{/);
                var exprFn;

                if (needsInterpolation) {
                    exprFn = function(context) {
                        var interpolateFn = $interpolate(expr);
                        var parseFn = $parse(interpolateFn($scope));
                        return parseFn(context);
                    };
                } else {
                    exprFn = $parse(expr);
                }

                var uiScopeContext = parseScopeContext(attrs.uiScopeContext);
                return function() {
                    var context;
                    if (uiScopeContext.length) {
                        context = angular.extend({}, SharedState.values());
                        mixScopeContext(context, uiScopeContext, $scope);
                    } else {
                        context = SharedState.values();
                    }
                    return exprFn(context);
                };
            };

            var parseScopeContext = function(attr) {
                if (!attr || attr === '') {
                    return [];
                }
                var vars = attr ? attr.trim().split(/ *, */) : [];
                var res = [];
                for (var i = 0; i < vars.length; i++) {
                    var item = vars[i].split(/ *as */);
                    if (item.length > 2 || item.length < 1) {
                        throw new Error('Error parsing uiScopeContext="' + attr + '"');
                    }
                    res.push(item);
                }
                return res;
            };

            directive.compile = function (tElem, tAttrs) {
                return function ($scope, $element, $attr, ctrl, $transclude) {
                    var block, childScope, previousElements, deWatch,
                        uiIfFn = parseUiCondition('uiIf', $attr, $scope, SharedState, $parse, $interpolate);

                    deWatch = $scope.$watch(uiIfFn, function uiIfWatchAction(value) {
                        if (value) {
                            if($element.parent().length == 0){
                                deWatch();
                            }else if (!childScope) {
                                $transclude(function (clone, newScope) {
                                    childScope = newScope;
                                    clone[clone.length++] = document.createComment(' end uiIf: ' + $attr.uiIf + ' ');
                                    // Note: We only need the first/last node of the cloned nodes.
                                    // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                                    // by a directive with templateUrl when its template arrives.
                                    block = {
                                        clone: clone
                                    };
                                    $animate.enter(clone, $element.parent(), $element);
                                });
                            }
                        } else {
                            if (previousElements) {
                                previousElements.remove();
                                previousElements = null;
                            }
                            if (childScope) {
                                childScope.$destroy();
                                childScope = null;
                            }
                            if (block) {
                                previousElements = getBlockNodes(block.clone);
                                var done = function() {
                                    previousElements = null;
                                };
                                var nga = $animate.leave(previousElements, done);
                                if (nga) {
                                    nga.then(done);
                                }
                                block = null;
                            }
                        }
                    });
                }
            };
            return $delegate;
        }
        $provide.decorator('uiIfDirective', decorator);
    }

    hsWechatDecorators.config(decoratorConfig);

})(angular, hsWechatDecorators);