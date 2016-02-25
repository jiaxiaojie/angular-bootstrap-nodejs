describe("花生金服", function () {
    var $controller, $scope, ConfigService, $httpBackend, AccountPeanutCtrl, $state,
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

    describe('用户登录后', function () {
        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.my).respond({
                code: 0,
                text: 'ok',
                data: createTestAccountInfo("true")
            });
            AccountPeanutCtrl = $controller('AccountPeanutCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            $httpBackend.flush();
            expect($scope.accountInfo.accountId).toEqual(createTestAccountInfo("true").accountId);
            expect($scope.hasSigned).toBe(true);
        });

        describe('签到', function () {
            it('未签到时点击签到按钮', function () {
                $httpBackend.whenPOST(ConfigService.apiPath.account.sign).respond({
                    code: 0,
                    text: '签到成功',
                    data: 10
                });
                $scope.sign();
                $httpBackend.flush();
                expect($scope.showSign).toBe(true);
            });
        });
    });


    function createTestLackFieldAccountInfo() {
        return {
            accountId: 5,
            avatar: "https://www.hsbank360.com/upload_files/avatar/20151013105933_792.jpg",
            netAssets: "189000",
            sumProfit: "38000",
            willProfit: "2324",
            availableBalance: "10000",
            //hasSigned: "true",
            hasRemindOfMsg: Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasRemindOfTicket: Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasRemindOfReward: Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasOpenThirdAccount: Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasBindBankCard: Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            nickname: '小二hahaha',
            customerName: '王小二',
            certNum: '234567198878763526',
            mobile: '13566667777',
            email: '34523452@ww.com',
            bankCardNo: '622223334545667'
        };
    }

    function createTestAccountInfo(hasSigned) {
        var accountInfo = createTestLackFieldAccountInfo();
        accountInfo.hasSigned = hasSigned;
        return accountInfo;
    }
});

describe("花生金服记录", function () {

    var $controller, $scope, ConfigService, $httpBackend, AccountPeanutLogCtrl, $state,
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

    describe('getMyIntegralPageList', function () {
        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myIntegralPageList).respond({
                code: 0,
                text: 'ok',
                data: data()
            });
            AccountPeanutLogCtrl = $controller('AccountPeanutLogCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            $httpBackend.flush();
            expect($scope.logPageNumber).toEqual(2);
            expect($scope.yearMonths['2015年10月'].length).toEqual(60);
        });
    });


    function data() {
        var start = 0;
        var limit = 60;
        var data = [];
        while ( limit > 0) {
            data.push({
                opDt: '2015-10-19 11:01:01',
                changeType: 1,
                changeTypeName: '充值',
                changeVal: '+10000',
            });
            start++;
            limit--;
        }
        return data;
    }
});