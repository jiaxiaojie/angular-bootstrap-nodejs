describe('StickstateDirective', function () {
    var ele,scope, state, stateProvider, q, rootElement, compile, rootScope,timeout,httpBackend;
    var sticky_1,sticky_2;

    //mock the app
    beforeEach(module('hsWechat'));

    //set router
    beforeEach(module(function ($stateProvider) {
        stateProvider = $stateProvider;
        $stateProvider
            .state('1',{
                url:'/1',
                deepStateRedirect: true,
                sticky: true,
                abstract: true,
                views:{
                    '1':{template: '<div>1</div>'}
                }
            })
            .state('1.1',{
                url:'/1.1',
                template:"<div>1.1</div>"
            })
            .state('1.2',{
                url:'/1.2',
                template:"<div>1.2</div>"
            })
            .state('1.3',{
                url:'/1.3',
                template:"<div>1.3</div>"
            })
            .state('2',{
                url:'/2',
                deepStateRedirect: true,
                abstract: true,
                views:{
                    '2':{template: "<div>2</div>"}
                }
            })
            .state('2.1',{
                url:'/1.1',
                template:"<div>2.1</div>"
            })
            .state('2.2',{
                name:'2.2',
                url:'/2.2',
                template:"<div>2.2</div>"
            })
            .state('2.3',{
                url:'/2.3',
                template:"<div>2.3</div>"
            });
    }));

    beforeEach(function(){
        ele = angular.element('<div><div sticky-state="1"></div><div sticky-state="2"></div></div>');
        module(function($provide){
            $provide.value("$rootElement",ele);
        });

        inject(function ($compile, $rootScope, $state, $q, $rootElement, $httpBackend) {
            compile = $compile;
            state = $state;
            q = $q;
            rootScope = $rootScope;
            rootScope.$state = $state;
            rootScope.state = $state;
            rootElement = $rootElement;
            httpBackend = $httpBackend;
            scope = {};
            compile(ele)(rootScope);
            sticky_1 = ele.children('div').eq(0);
            sticky_2 = ele.children('div').eq(1);
        });
    });

    it('can compile',function(){
        expect(sticky_1.children('div').attr('ui-view')).toBe('1');
        expect(sticky_2.children('div').attr('ui-view')).toBe('2');
    });

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
});