/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("推荐测试", function () {

    var $controller, $scope, ConfigService, $httpBackend, AccountRecommendCtrl, $state,
        $rootScope, $location, $compile, $rootElement,RecommendDetailCtrl,RecommendMyCtrl;

    beforeEach(module('hsWechat'));
    beforeEach(function () {
        ele = angular.element('<div><div sticky-state="account"></div><div sticky-state="sign"></div><div tip></div></div>');
        module(function ($provide) {
            $provide.value("$rootElement", ele);
        });
    });

    beforeEach(inject(function ($injector) {

        $controller = $injector.get('$controller');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
        $state = $injector.get('$state');
        $rootScope = $injector.get('$rootScope');
        $location = $injector.get('$location');
        $compile = $injector.get('$compile');
        $rootElement = $injector.get('$rootElement');
    }));

    beforeEach(function () {

        $compile(ele)($rootScope);

        $httpBackend.whenGET('scripts/directives/Tip.tpl.html')
            .respond('<tip-span ui-state="modalTip">{{msg}}</tip-span>');

        $httpBackend.whenGET('scripts/views/sign/layout.html')
            .respond('<div sticky-state="sign.main"></div>');

        $httpBackend.whenGET('scripts/views/sign/main.html')
            .respond('');

        $httpBackend.whenGET('scripts/views/account/layout.html')
            .respond('<div sticky-state="account.main"></div>');

        $httpBackend.whenGET('scripts/views/account/main.html')
            .respond('');

        $httpBackend.whenGET('scripts/views/home/layout.html')
            .respond('<div sticky-state="home.main"></div>');

        $httpBackend.whenGET('scripts/views/home/main.html')
            .respond('');
    });

    describe('用户推荐', function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myInvitationStat).respond({
                code: 0,
                text: 'ok',
                data: {
                    earningAmount: 10,
                    earningTicketAmount: 5
                }
            });
            AccountRecommendCtrl = $controller('AccountRecommendCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
            expect($scope.earningAmount).toEqual(10);
            expect($scope.earningTicketAmount).toEqual(5);
        });

    });


    describe('推荐详情', function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myInvitationStat).respond({
                code: 0,
                text: 'ok',
                data: {
                    earningAmount: 10,
                    earningTicketAmount: 5
                }
            });
            $httpBackend.whenPOST(ConfigService.apiPath.account.myEarningPageList).respond({
                code: 0,
                text: 'ok',
                data: [
                    {test: 1},
                    {test: 1},
                    {test: 1},
                    {test: 1},
                    {test: 1}
                ]
            });
            $httpBackend.whenPOST(ConfigService.apiPath.account.myEarningTicketPageList).respond({
                code: 0,
                text: 'ok',
                data: [
                    {test: 1},
                    {test: 1},
                    {test: 1},
                    {test: 1},
                    {test: 1}
                ]
            });
            RecommendDetailCtrl = $controller('RecommendDetailCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
            expect($scope.earningAmount).toEqual(10);
            expect($scope.earningTicketAmount).toEqual(5);
            expect($scope.earningList.length).toEqual(5);
            expect($scope.tickets.length).toEqual(5);
        });

    });

    describe('我的推荐', function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myInvitationPageList).respond({
                code: 0,
                text: 'ok',
                data: data()
            });
            $httpBackend.whenPOST(ConfigService.apiPath.account.myInvitationStat).respond({
                code: 0,
                text: 'ok',
                data: {
                    registerCount:1,
                    nameAuthCount:2,
                    investAccount:3
                }
            });
            RecommendMyCtrl = $controller('RecommendMyCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
            expect($scope.pageNumber).toEqual(2);
            expect($scope.friends.length).toEqual(60);
            expect($scope.registerCount).toEqual(1);
            expect($scope.nameAuthCount).toEqual(2);
            expect($scope.investAccount).toEqual(3);
        });

    });

    function data() {
        var start = 0;
        var limit = 60;
        var data = [];
        while (limit > 0) {
            data.push({
                name: '2015-10-19 11:01:01'
            });
            start++;
            limit--;
        }
        return data;
    }

});
