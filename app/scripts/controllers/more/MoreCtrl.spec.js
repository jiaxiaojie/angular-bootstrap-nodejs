/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("更多测试", function () {

    var $controller, $scope, ConfigService, $httpBackend, AccountMainCtrl, $state,
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

    describe('已登录', function () {

        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.project.detail).respond({
                code: 0,
                text: 'ok',
                data: createTestProject()
            });
            localStorageService.set('account.token', '123');
            AccountMainCtrl = $controller('MoreMainCtrl', {$scope: $scope});
        });

        it('正常获取', function () {
            $httpBackend.flush();
        });



    });

    function createTestProject() {
        var project = createTestLackFieldProject();
        project.biddingDeadline = '2015-09-05';
        return project;
    }

    function createTestLackFieldProject() {
        var projectId = 1;
        var types = ['商圈贷', '车辆抵押', '个人信用贷', '典当融资租赁'];
        var type = Math.floor(Math.random() * 4);
        var duration = Math.floor(Math.random() * 20 + 2);
        var project = {
            projectId: projectId,
            projectName: '个人信用贷款-' + projectId,
            projectType: type,
            projectTypeName: types[type],
            repaymentMode: 1,
            repaymentModeName: Math.floor(Math.random() * 3) == 1 ?  "等额本息" : "一次性还本付息",
            planAmount: 1000000,
            amount: 360000,
            rate: 65,
            status: [3, 5, 7][projectId % 3],
            statusName: Math.floor(Math.random() * 3) == 1 ?  "立即投资":"还款中",
            annualizedRate: Math.floor(Math.random() * 20) * 0.01,
            borrowersUser: 'D*s*d*s',
            projectDuration: duration,
            startingAmount: [100, 1000][Math.floor(Math.random() * 2)],
            //biddingDeadline: '2015-09-05',
            projectIntroduce: 'some text一些介绍',
            useMethod: '资金周转',
            transferCode: 3,
            transferConstraint: '投资后3天可转让',
            riskInfo: '<h2>项目风险保障方案</h2><p>专业尽调团队对核心企业和必要的融资项目进行360度实地尽职调查，调查报告的数据包括实地调查数据、人民银行征信系统数</p>',
            aboutFiles: (function () {
                var i = 0, f = [];
                while (i++ < 9)f.push('/images/example/about-file-' + i + '.png');
                return f;
            })(),
            investmentCount: 100,
            isNewUser:Math.floor(Math.random() * 2) == 1 ? '0' : '1',
            isRecommend:Math.floor(Math.random() * 2) == 1 ? '0' : '1',
            isUseTicket:Math.floor(Math.random() * 2) == 1 ? '0' : '1',
            isCanAssign:Math.floor(Math.random() * 2) == 1 ? '0' : '1'
        };
        return project;
    }

});






