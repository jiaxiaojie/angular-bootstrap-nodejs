describe('NavbarDirective', function () {
    var ele, scope, state, stateProvider, q, rootElement, compile, rootScope, navTitle,NavbarService;

    function $get(what) {
        return jasmine.getEnv().currentSpec.$injector.get(what);
    }

    //mock the app
    beforeEach(module('hsWechat'));

    //require ui.router
    beforeEach(module('ui.router'));
    beforeEach(module('ct.ui.router.extras.sticky'));
    beforeEach(module('ct.ui.router.extras.dsr'));

    //set router
    beforeEach(module(function ($stateProvider) {
        stateProvider = $stateProvider;
        $stateProvider
            .state('home', {
                url: "/home",
                abstract: false,
                template: "<ui-view></ui-view>"
            })
            .state('home.main', {
                url: "/",
                template: "<div>home.main</div>",
                data: {$navbarDirection: 'go', $navbarTitle: 'home.main', $navbarShow: false}
            }).state('one',{
                url:'/one',
                template:"<div>one</div>",
                data: {$navbarDirection: 'push', $navbarTitle: 'one',$navbarPopDefault:'home.main', $navbarShow: true}
            }).state('two',{
                url:'/two',
                template:"<div>two</div>",
                data: {$navbarDirection: 'push', $navbarTitle: 'two',$navbarPopDefault:'home.main', $navbarShow: true}
            }).state('three',{
                url:'/three',
                template:"<div>three</div>",
                data: {$navbarDirection: 'go', $navbarTitle: 'three', $navbarShow: true}
            }).state('hide',{
                url:'/hide',
                template:"<div>hide</div>",
                data: {$navbarDirection: 'push', $navbarTitle: 'hide', $navbarShow: false}
            });

        var states = [];
        //for sticky
        states.push({
            name:'1',
            url:'/1',
            template:'<div ui-view="1.1"></div><div ui-view="1.2"></div>'
        });
        states.push({
            name:'1.1',
            url:'/1/1',
            views:{'1.1':{template:'<div>1.1<input type="text"></div>'}},
            deepStateRedirect: true,
            sticky: true
        });
        states.push({
            name:'1.2',
            url:'/1/2',
            views:{'1.2':{template:'<div>1.2<textarea>otherthing</textarea></div>'}},
            deepStateRedirect: true,
            sticky: true
        });


        states.push({
            name:'2',
            url:'/2',
            template:'<div ui-view="2.1" ng-show="state.includes(\'2.1\')"></div><div ui-view="2.2" ng-show="state.includes(\'2.2\')"></div>'
        });
        states.push({
            name:'2.1',
            url:'/2/1',
            views:{'2.1':{template:'<div>2.1<input type="text" /><div ui-view="2.1.1" ng-show="state.includes(\'2.1.1\')" class="v211"></div><div ui-view="2.1.2" ng-show="state.includes(\'2.1.2\')" class="v212"></div></div>'}},
            deepStateRedirect: true,
            sticky: true,
            data: {$navbarDirection: 'push', $navbarTitle: '2.1', $navbarShow: true}
        });
        states.push({
            name:'2.1.1',
            url:'/2/1/1',
            views:{'2.1.1':{template:'<div>2.1.1<input type="text" /><input type="tel" class="tel1"></div>'}},
            deepStateRedirect: true,
            sticky: true,
            data: {$navbarDirection: 'push', $navbarTitle: '2.1.1', $navbarShow: true}
        });
        states.push({
            name:'2.1.2',
            url:'/2/1/2',
            views:{'2.1.2':{template:'<div>2.1.2<input type="text" /><input type="tel" class="tel2"></div>'}},
            deepStateRedirect: true,
            sticky: true,
            data: {$navbarDirection: 'push', $navbarTitle: '2.1.2', $navbarShow: true}
        });
        states.push({
            name:'2.2',
            url:'/2/2',
            views:{'2.2':{template:'<div>2.2</div>'}},
            deepStateRedirect: true,
            sticky: true,
            data: {$navbarDirection: 'push', $navbarTitle: '2.2', $navbarShow: true}
        });

        angular.forEach(states, function(state) { $stateProvider.state(state); });
    }));

    beforeEach(function(){
        ele = angular.element('<div><div navbar class="navbar-absolute-top"></div><div ui-view></div><div class="navbar-absolute-bottom"></div></div>');
        module(function($provide){
           $provide.value("$rootElement",ele);
        });

        inject(function ($compile, $rootScope, $state, $q, $rootElement, $httpBackend,Navbar) {
            compile = $compile;
            state = $state;
            q = $q;
            rootScope = $rootScope;
            rootScope.$state = $state;
            rootScope.state = $state;
            rootElement = $rootElement;
            NavbarService = Navbar;

            compile($rootElement)(rootScope);

            $httpBackend.whenGET('scripts/directives/Navbar.tpl.html')
                .respond('<nav class="navbar navbar-app navbar-absolute-top" ng-show="show">' +
                '<div class="navbar-brand navbar-brand-center"><span ng-bind="title"></span></div>' +
                '<div class="btn-group pull-left" ng-hide="hideGobackButton">' +
                '<button class="btn"><i class="fa fa-bars"></i>返回</button></div>' +
                '<div class="btn-group pull-right" ui-yield-to="navbarAction"></div></nav>');
            $httpBackend.flush();
            navTitle = $rootElement.find('span');
        })
    });

    it('can update the title', function () {

        state.transitionTo('home.main', {}, {});
        rootScope.$digest();

        expect(navTitle.html()).toBe('');

    });

    it('can popup', function () {

        state.transitionTo('one', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('one');

        state.transitionTo('two', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('two');

        ele.find('button').click();
        rootScope.$digest();
        expect(navTitle.html()).toBe('one');

        state.transitionTo('two', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('two');
    });

    /*it('after state.go, pop throw error', function () {

        state.transitionTo('one', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('one');

        state.transitionTo('two', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('two');

        state.transitionTo('three', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('three');

        expect(function(){
            ele.find('button').click()
        }).toThrowError(Error, 'no prev state');

    });*/

    it('can hide navbar', function () {
        state.transitionTo('hide', {}, {});
        rootScope.$digest();//ng-hide
        expect(ele.find('nav')).toBeHidden();
    });

    it('sticky ok ', function () {
        state.transitionTo('1.1', {}, {});
        rootScope.$digest();
        ele.find('input').val('something');
        state.transitionTo('1.2', {}, {});
        rootScope.$digest();
        state.transitionTo('1.1', {}, {});
        rootScope.$digest();
        expect(ele.find('input').val()).toBe('something');
        expect(ele.find('textarea').val()).toBe('otherthing');

    });

    it('sticky into ok', function () {

        //go into deep
        state.transitionTo('2.1.2', {}, {});
        rootScope.$digest();
        $j(ele).find('.tel2').val('13564335614');
        state.transitionTo('2.2', {}, {});//parent.sibling
        rootScope.$digest();
        state.transitionTo('2.1', {}, {});//go back parent
        rootScope.$digest();
        expect($j(ele).find('.tel2').val()).toBe('13564335614');
        expect($j(ele).find('.v211')).toHaveClass('ng-hide');
        expect($j(ele).find('.v212')).not.toHaveClass('ng-hide');
        expect(state.current).toBe(state.get('2.1.2'));//means me,
    });

    it('concat navbar with sticky', function () {


        state.transitionTo('2.2', {}, {});//go 2.2, then go back
        rootScope.$digest();
        expect(navTitle.html()).toBe('2.2');

        //go into deep
        state.transitionTo('2.1.2', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('2.1.2');
        $j(ele).find('.tel2').val('13564335614');

        ele.find('button').click();
        rootScope.$digest();
        expect(navTitle.html()).toBe('2.2');//back success

        expect( $j(ele).find('.tel2').val()).toBe('13564335614');//view is in stack

    });

    it('can hide navbar-absolute-bottom', function () {
        state.transitionTo('1.1', {}, {});
        rootScope.$digest();
        expect($j(ele).find('.navbar-absolute-bottom').css("display")).not.toBe("none"); //show

        state.transitionTo('2.1.1', {}, {});
        rootScope.$digest();
        expect($j(ele).find('.navbar-absolute-bottom').css("display")).toBe("none"); //hide
    });


    it('NavbarService can popup', function () {

        state.transitionTo('three', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('three');

        state.transitionTo('one', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('one');

        state.transitionTo('two', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('two');

        NavbarService.pop(2);
        rootScope.$digest();
        expect(navTitle.html()).toBe('three');

        state.transitionTo('one', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('one');

        NavbarService.pop();
        rootScope.$digest();
        expect(navTitle.html()).toBe('three');
    });

    it('can setter navbar title ',function () {
        state.transitionTo('one', {}, {});
        rootScope.$digest();
        expect(navTitle.html()).toBe('one');

        NavbarService.setTitle("two");
        rootScope.$digest();
        expect(navTitle.html()).toBe('two');
    });

    afterEach(function () {
        ele = null;
        navTitle = null;
    });
});