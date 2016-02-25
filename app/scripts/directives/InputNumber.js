(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:InputNumberDirective
     * @restrict A
     * @description
     *  只允许输入数字，inputNumber为允许输入的小数
     *  说明：不支持QQ浏览器
     * @example
     * <pre>
     *     <div marquee speed='60' [height='300']> <div>
     * </pre>
     */
    InputNumberDirective.$inject = ['UAService'];
    function InputNumberDirective(UA){
        return {
            restrict: 'A',
            replace:false,
            link: function(scope, element, attrs) {
                //QQ浏览器不支持获取keyCode
                var isSupport = UA.getUA().indexOf('MQQBrowser') == -1;
                if(isSupport){
                    var _self = element[0],isPass,isDot,
                    n = attrs['inputNumber']-0;
                    element.bind('keydown',function(event){
                        isPass = false,isDot = false;
                        event = event || window.event;
                        var keyCode = event.keyCode || event.which,v = _self.value;
                        // 数字
                        if (keyCode >= 48 && keyCode <= 57 ){isPass = true;}
                        // 小数字键盘
                        if (keyCode >= 96 && keyCode <= 105){isPass = true;}
                        // Backspace键
                        if (keyCode == 8){isPass = true;}
                        // . 小数点
                        if (keyCode == 190 || keyCode == 110){isPass = true;isDot = true;}

                        if(isPass){
                            var index = v.indexOf('.');
                            if(index != -1 && isDot){ //不允许多个.
                                isPass = false;
                            }else if(index != -1 && keyCode != 8 && v.length - index > n){ //几位小数
                                isPass = false;
                            }
                        }
                        if(!isPass){event.preventDefault();}
                    });
                }
            }
        };
    }

    hsWechatDirectives.directive('inputNumber', InputNumberDirective);

})(angular, hsWechatDirectives);