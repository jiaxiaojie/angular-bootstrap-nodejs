/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("overview", function () {
    var $controller, $scope, ConfigService, $httpBackend, AccountOverviewCtrl, $state,
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

    describe('获取用户信息', function () {
        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.my).respond({
                code: 0,
                text: 'ok',
                data: createTestAccountInfo("true")
            });
            AccountOverviewCtrl = $controller('AccountOverviewCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            $httpBackend.flush();
            expect($scope.accountInfo.accountId).toEqual(5);
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





