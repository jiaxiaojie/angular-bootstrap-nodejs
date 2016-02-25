/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("卡卷测试", function () {

    var $controller, $scope, ConfigService, $httpBackend, AccountTicketCtrl, $state,
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

    describe('卡卷获取测试', function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.myTickets).respond({
                code: 0,
                text: 'ok',
                data: createTestTickets()
            });
            $httpBackend.whenPOST(ConfigService.apiPath.account.beforeWithdraw).respond({
                code: 0,
                text: 'ok',
                data: {
                    cardNo:"23452134523463456",
                    cardStatusCode:"VERIFIED",
                    bankCode:"NJYH",
                    bankName:"东亚银行",
                    bankLogo:"http://pic.58pic.com/58pic/12/38/92/34i58PICVNP.jpg",
                    amount:1345,
                    ticketCount:5
                }
            });
            AccountTicketCtrl = $controller('AccountTicketCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
            expect($scope.tickets.length).toEqual(10);
            expect($scope.ticketCount).toEqual(5);
        });

    });


    function createTestTickets() {
        var start = 0;
        var limit = 10;
        var tickets = [];
        var max = 15;
        while (start < max && limit > 0) {
            var type = Math.floor(Math.random() * 4);
            tickets.push({
                ticketId: start,
                type: 1,
                typeName: '投资券',
                condition: '满1000元可用',
                amount: 10,
                status: [0, 1, 2][start % 3],
                statusName: ["正常", "已使用", "过期"][start % 3],
                invalidDt: "2015-10-22"
            });
            start++;
            limit--;
        }
        return tickets;
    }


});
