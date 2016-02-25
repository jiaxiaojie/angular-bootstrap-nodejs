describe('TipDirective', function () {
    var ele,scope, state, stateProvider, q, rootElement, compile, rootScope,httpBackend;

    //mock the app
    beforeEach(module('hsWechat'));

    //set router
    beforeEach(module(function ($stateProvider) {
        stateProvider = $stateProvider;
        $stateProvider
            .state('one',{
                url:'/one',
                template:"<div>one</div>"
            });
    }));

    beforeEach(function(){
        ele = angular.element('<div><input ng-modal="mobile" clear-id="mobile"/><span clear-for="mobile"></span></div>');
        module(function($provide){
            $provide.value("$rootElement",ele);
        });

        inject(function ($compile, $rootScope, $state, $q, $rootElement, $httpBackend,_$controller_,Tip) {
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
        })
    });


    it('can clear for input', function () {
        var input = $j(ele).find('[clear-id]');
        input.val('test');
        expect(input.val()).toBe('test');
        $j(ele).find('[clear-for]').click();
        expect(input.val()).toBe('');
    });

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
});