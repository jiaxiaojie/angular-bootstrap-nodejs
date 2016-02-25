/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("用户controller", function () {
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

    describe('用户登录后', function () {
        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.my).respond({
                code: 0,
                text: 'ok',
                data: createTestAccountInfo("true")
            });
            $httpBackend.whenPOST(ConfigService.apiPath.account.transactionRecord).respond({
                code: 0,
                text: 'ok',
                data: [
                    {opDt: '2015-10-19 11:01:01', changeType: 1, changeTypeName: '充值', changeVal: '+10000'},
                    {opDt: '2015-10-12 11:01:01', changeType: 2, changeTypeName: '投资', changeVal: '-500'},
                    {opDt: '2015-10-09 11:01:01', changeType: 3, changeTypeName: '收益', changeVal: '+10'},
                    {opDt: '2015-10-09 11:01:01', changeType: 4, changeTypeName: '提现', changeVal: '-100'},
                    {opDt: '2015-09-09 11:01:01', changeType: 5, changeTypeName: '提现手续费'}
                ]
            });
            AccountMainCtrl = $controller('AccountMainCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            $httpBackend.flush();
            expect($scope.accountInfo.accountId).toEqual(createTestAccountInfo("true").accountId);
            expect($scope.hasSigned).toBe(true);
        });

        describe('修改密码', function () {
            beforeEach(function () {
                $httpBackend.whenPOST(ConfigService.apiPath.account.changePassword, function (data) {
                    data = $j.deserialize(data);
                    return data.oldPassword == 'success';
                }).respond({
                    code: 0
                });
                $httpBackend.whenPOST(ConfigService.apiPath.account.changePassword, function (data) {
                    data = $j.deserialize(data);
                    return data.oldPassword == 'fail';
                }).respond({
                    code: -1,
                    text: '密码修改失败'
                });
                $httpBackend.whenPOST(ConfigService.apiPath.account.logout).respond({
                    code: 0,
                    text: '退出成功'
                });
            });

            it('修改密码成功', function () {
                $scope.oldPassword = 'success';
                $scope.changePassword();
                $httpBackend.flush();
                var tipMsg = $rootElement.find('tip-span');
                expect(tipMsg.html()).toBe('密码修改成功');
            });

            it('修改密码失败', function () {
                $scope.oldPassword = 'fail';
                $scope.changePassword();
                $httpBackend.flush();
                var tipMsg = $rootElement.find('tip-span');
                expect(tipMsg.html()).toBe('密码修改失败');
            });

            it('验证前台传入的修改密码参数', function () {

                $httpBackend.flush();

                $scope.oldPassword = "";
                expect($scope.canChangePassword()).toBe(false);

                $scope.oldPassword = "123456";
                $scope.newPassword = "123456";
                $scope.confirmPassword = "1234561";
                expect($scope.canChangePassword()).toBe(false);

                $scope.oldPassword = "123456";
                $scope.newPassword = "12345611111  ";
                $scope.confirmPassword = "12345611111  ";
                expect($scope.canChangePassword()).toBe(false);

                $scope.oldPassword = "123456";
                $scope.newPassword = "12345611111";
                $scope.confirmPassword = "12345611111";
                expect($scope.canChangePassword()).toBe(true);
            });

            it('新密码输入框焦点移出事件', function () {

                $httpBackend.flush();

                $scope.newPassword = "123";
                $scope.newPasswordBlur();
                $rootScope.$digest();
                var tipMsg1 = $rootElement.find('tip-span');
                expect(tipMsg1.html()).toBe('密码为6-16位数字或英文字母');

                $scope.newPassword = "123456";
                $scope.confirmPassword = "111111";
                $scope.newPasswordBlur();
                $rootScope.$digest();
                var tipMsg2 = $rootElement.find('tip-span');
                expect(tipMsg2.html()).toBe('确认密码输入不一致');
            });

            it('确认密码输入框焦点移出事件', function () {

                $httpBackend.flush();

                $scope.newPassword = "123456";
                $scope.confirmPassword = "111111";
                $scope.confirmPasswordBlur();
                $rootScope.$digest();
                var tipMsg = $rootElement.find('tip-span');
                expect(tipMsg.html()).toBe('确认密码输入不一致');
            });
        });

        describe('退出', function () {

            beforeEach(function () {
                $httpBackend.whenPOST(ConfigService.apiPath.account.logout).respond({
                    code: 0,
                    text: '退出成功'
                });
            });

            it('退出成功', function () {
                $httpBackend.flush();
                $scope.logout();
                $rootScope.$digest();
                var tipMsg = $rootElement.find('tip-span');
                expect(tipMsg.html()).toBe('退出成功');
            });

        });

        describe('余额', function () {

            it('显示/隐藏用户余额', function () {

                $httpBackend.flush();

                $scope.isShowAccountMoney = true;
                $scope.changeShowAccountMoneyStatus();
                $rootScope.$digest();
                expect($scope.isShowAccountMoney).toBe(false);

                $scope.isShowAccountMoney = false;
                $scope.changeShowAccountMoneyStatus();
                $rootScope.$digest();
                expect($scope.isShowAccountMoney).toBe(true);
            });
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
                expect($scope.signValue).toEqual(10);
            });

            it('已签到时再次点击签到按钮', function () {
                $httpBackend.whenPOST(ConfigService.apiPath.account.sign).respond({
                    code: -1,
                    text: '用户已签到',
                    data: '0'
                });
                $scope.sign();
                $httpBackend.flush();
                $rootScope.$digest();
                var tipMsg = $rootElement.find('tip-span');
                expect(tipMsg.html()).toBe('用户已签到');
                expect($scope.signValue).toEqual(0);
            });

        });

        describe('绑定银行卡', function () {

            it('绑定银行卡', function () {

                $httpBackend.flush();

                $scope.accountInfo.hasOpenThirdAccount = 0;
                $scope.toBindBankCard();
                //$rootScope.$digest();
                //var tipMsg = $rootElement.find('tip-span');
                //expect(tipMsg.html()).toBe('yeepay.bindBankCard');

                $scope.accountInfo.hasOpenThirdAccount = 1;
                $scope.toBindBankCard();
                //$rootScope.$digest();
                //var tipMsg = $rootElement.find('tip-span');
                //expect(tipMsg.html()).toBe('yeepay.register');
            });
        });

    });

    describe('交易记录', function () {
        beforeEach(function () {
            $scope = {};
            $httpBackend.whenPOST(ConfigService.apiPath.account.transactionRecord).respond({
                code: 0,
                text: 'ok',
                data: data()
            });
            AccountLogCtrl = $controller('AccountLogCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            $httpBackend.flush();
            expect($scope.logPageNumber).toEqual(2);
            expect($scope.yearMonths['2015年10月'].length).toEqual(60);
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

    function data() {
        var start = 0;
        var limit = 60;
        var data = [];
        while (limit > 0) {
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


