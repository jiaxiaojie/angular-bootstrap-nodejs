/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("投资测试", function () {

    var $controller, $scope, ConfigService, $httpBackend, AccountInvestCtrl, $state,
        $rootScope, $location, $compile, $rootElement;

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


    describe("投资卷测试", function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myInvestment).respond({
                code: 0,
                text: 'ok',
                data: {
                    totalInvestment: 87800,
                    receiveMoney: 988,
                    tipMsg: '距下期收款还有2天, 金额10.22元',
                    projectList: createInvestmentProjects()
                }
            });
            AccountInvestCtrl = $controller('AccountInvestCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
            expect($scope.investmentTenderingList.length + $scope.investmentHoldingList.length + $scope.investmentFinishedList.length).toEqual(10);
        });

        it('截断字符测试', function () {
            var testString = "testString";
            var length = 4;
            expect($scope.subString(testString, length)).toEqual("test...");
        });

    });

    function createInvestmentProjects() {
        var start = 0;
        var limit = 10;
        var projects = [];

        var max = 35;
        var types = ['商圈贷', '车辆抵押', '个人信用贷', '典当融资租赁'];
        while (start < max && limit > 0) {
            var type = Math.floor(Math.random() * 4);
            projects.push({
                projectId: start,
                projectName: types[type] + '-' + start,
                projectType: type,
                projectTypeName: types[type],
                repaymentMode: 1,
                repaymentModeName: ["等额本息", "先息后本", "一次性还本付息"][start % 3],
                amount: 1000000,
                receivedProfit: 36000,
                willProfit: 64000,
                status: [3, 5, 7][start % 3],//project status constant:3-PROJECT_STATUS_INVESTMENT,5-PROJECT_STATUS_REPAYMENTING,7-PROJECT_STATUS_END
                statusName: ["立即投资", "还款中", "已结束"][start % 3],
                annualizedRate: Math.floor(Math.random() * 20) * 0.01,
                isNewUser: ['0', '1'][start % 2],
                isRecommend: ['0', '1'][start % 2],
                remainingDays: 55
            });
            start++;
            limit--;
        }
        return projects;
    }

});


describe("投资测试", function () {

    var $controller, $scope, ConfigService, $httpBackend, AccountInvestDetailCtrl, $state,
        $rootScope, $location, $compile, $rootElement;

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


    describe("投资卷详情测试", function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myInvestmentDetail).respond({
                code: 0,
                text: 'ok',
                data: {
                        recordId:1
                    }
            });
            AccountInvestDetailCtrl = $controller('AccountInvestDetailCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
            expect($scope.record.recordId).toEqual(1);
        });


    });
});