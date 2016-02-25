describe('ClearIdDirective', function () {
    var ele,tipMsg,scope, state, stateProvider, q, rootElement, compile, rootScope,timeout,httpBackend,controller,TipService;

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
        ele = angular.element('<div tip></div>');
        module(function($provide){
            $provide.value("$rootElement",ele);
        });

        inject(function ($compile, $rootScope, $state, $q, $rootElement, $httpBackend,$timeout,_$controller_,Tip) {
            compile = $compile;
            state = $state;
            q = $q;
            rootScope = $rootScope;
            rootScope.$state = $state;
            rootScope.state = $state;
            rootElement = $rootElement;
            timeout = $timeout;
            httpBackend = $httpBackend;
            TipService = Tip;
            controller = _$controller_;
            scope = {};


            compile(ele)(rootScope);

            $httpBackend.whenGET('scripts/directives/Tip.tpl.html')
                .respond('<div class="modal invest-calculator ng-scope" ui-if="modalTip" ui-state="modalTip" ui-default="false">'+
                '<div class="modal-dialog"><div class="modal-body text-center"><span class="login-tip text-center">{{msg}}</span></div> </div> </div>');
            $httpBackend.flush();
            tipMsg = $rootElement.find('span');
        })
    });

    beforeEach(function(){
        hsWechat.controller('SleepController', function sleepController($scope, $timeout) {
            $scope.sleep = function(callback,timemillis){
                $timeout(function(){
                    if(typeof callback == 'function') callback();
                },timemillis);
            }
        });
    });

    describe('execute Tip.show', function () {

        it('can show Tip',function(){
            state.transitionTo('one', {}, {});
            rootScope.$digest();
            expect(tipMsg.length).toBe(0);

            TipService.show('msg',1000);
            rootScope.$digest();
            tipMsg = rootElement.find('span');
            expect(tipMsg.length).toBe(1);
            expect(tipMsg.html()).toBe('msg');
        });

        it('can sleep',function(){
            scope.x = 1;
            var sleepController = controller('SleepController', { $scope: scope });
            scope.sleep(function(){
                scope.x = 2;
            },500);
            scope.sleep(function(){
                scope.x = 3;
            },1000);

            scope.sleep(function(){
                scope.x = 4;
            },600);

            // flush timeout(s) for all code under test.
            timeout.flush();
            // this will throw an exception if there are any pending timeouts.
            timeout.verifyNoPendingTasks();
            expect(scope.x).toBe(3);
        });

        it('hide Tip of show Tip timeout',function(){
            state.transitionTo('one', {}, {});
            rootScope.$digest();

            TipService.show('msg',1000);
            rootScope.$digest();
            tipMsg= rootElement.find('span');
            expect(tipMsg.length).toBe(1);
            expect(tipMsg.html()).toBe('msg');

            var sleepController = controller('SleepController', { $scope: scope });
            scope.sleep(function(){
                tipMsg = rootElement.find('span');
            },2000);
            timeout.flush();
            timeout.verifyNoPendingTasks();
            expect(tipMsg.length).toBe(0);
        });
    });

    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
});