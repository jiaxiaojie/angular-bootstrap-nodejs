(function (angular, hsWechatDirectives) {

    /**
     * @ngdoc directive
     * @name hsWechat.directives.directive:MarqueeDirective
     * @restrict A
     * @description
     * 向上无缝滚动 marquee up
     * @example
     * <pre>
     *     <div marquee speed='60' [height='300']> <div>
     * </pre>
     */
    MarqueeDirective.$inject = [];
    function MarqueeDirective(){
        return {
            restrict: 'A',
            replace:false,
            compile : function(ele, attrs){
                ele.html('<div>'+ele.html()+'</div><div>'+ele.html()+'</div>');
            },
            controller: ['$element', '$attrs','$interval', function ($element, $attrs,$interval) {
                var speed = $attrs.speed || 60;
                var children =$element.children('div'),
                    d1= children[0],d2=children[1],
                    d = $element[0];
                if($attrs.height) d.style.height= $attrs.height + 'px';
                d.style.overflow= 'hidden';
                $interval(function(){
                    if(d1.offsetHeight-d.scrollTop<=0){
                        d.scrollTop-=d1.offsetHeight;
                    } else{
                        d.scrollTop++
                    }
                },speed);
            }]
        };
    }

    hsWechatDirectives.directive('marquee', MarqueeDirective);

})(angular, hsWechatDirectives);