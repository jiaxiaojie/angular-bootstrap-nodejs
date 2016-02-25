describe("易宝相关服务", function() {
    var YeepayService, ConfigService, $httpBackend, reqHandler, result, respError, scope;


    beforeEach(module('hsWechat'));

    beforeEach(inject(function ($injector) {
        YeepayService = $injector.get('Yeepay');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
        scope = $injector.get('$rootScope');
    }));

    describe('执行获取易宝绑定银行卡url', function() {
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.yeepay.toBindBankCard);
            YeepayService.getBindBankCardUrl().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });
        it('能正确获取', function() {
            var url = "https://www.hsbank360.com/f/customer/account/bankCard";
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : url
            });
            $httpBackend.flush();

            expect(result).toEqual(url);
        });
        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code : -1,
                text : '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
        it('服务器非200返回时能抛出异常', function() {
            respError = undefined;
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();

            expect(respError).toBeDefined();
        });
    });

    describe('执行获取易宝充值url', function() {
        describe('参数正确', function() {
            beforeEach(function() {
                reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.yeepay.toRecharge);
                YeepayService.getRechargeUrl(100).then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });
            });
            it('能正确获取', function() {
                var url = "https://www.hsbank360.com/f/customer/capital/recharge";
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : url
                });
                $httpBackend.flush();

                expect(result).toEqual(url);
            });
            it('获取失败时能抛出异常', function() {
                reqHandler.respond({
                    code : -1,
                    text : '获取失败'
                });
                $httpBackend.flush();

                expect(respError.data).toEqual('获取失败');
            });

            it('服务器非200返回时能抛出异常', function() {
                respError = undefined;
                reqHandler.respond(401, 'error msg');
                $httpBackend.flush();

                expect(respError).toBeDefined();
            });
        });
        describe('参数错误', function() {
            it('参数错误时能抛出异常', function() {
                YeepayService.getRechargeUrl("100a").then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });

                scope.$apply();
                $httpBackend.resetExpectations();

                expect(respError).toEqual('arg error');
            });
        });
    });

    describe('执行获取易宝注册url', function() {
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.yeepay.toRegister);
            YeepayService.getRegisterUrl('温强','1225234523451','13564335614').then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });
        it('能正确获取', function() {
            var url = "https://www.hsbank360.com/f/register";
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : url
            });
            $httpBackend.flush();

            expect(result).toEqual(url);
        });
        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code : -1,
                text : '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
        it('服务器非200返回时能抛出异常', function() {
            respError = undefined;
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();

            expect(respError).toBeDefined();
        });
    });

    describe('执行获取易宝提现url', function() {
        describe('参数正确时', function() {
            beforeEach(function() {
                reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.yeepay.toWithdraw);
                YeepayService.getWithdrawUrl(100).then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });
            });
            it('能正确获取', function() {
                var url = "https://www.hsbank360.com/f/customer/capital/withdraw";
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : url
                });
                $httpBackend.flush();

                expect(result).toEqual(url);
            });
            it('获取失败时能抛出异常', function() {
                reqHandler.respond({
                    code : -1,
                    text : '获取失败'
                });
                $httpBackend.flush();

                expect(respError.data).toEqual('获取失败');
            });
            it('服务器非200返回时能抛出异常', function() {
                respError = undefined;
                reqHandler.respond(401, 'error msg');
                $httpBackend.flush();

                expect(respError).toBeDefined();
            });
        });
        describe('参数错误', function() {
            it('参数错误时能抛出异常', function() {
                YeepayService.getWithdrawUrl("100a").then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });

                scope.$apply();
                $httpBackend.resetExpectations();

                expect(respError).toEqual('arg error');
            });
        });
    });

    describe('执行获取易宝投资url', function() {
        describe('参数正确时', function() {
            beforeEach(function() {
                result = undefined;
                respError = undefined;
                reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.yeepay.toInvest);
                YeepayService.getInvestUrl('1','0','100','1,2','100','0','1').then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });
            });
            it('能正确获取', function() {
                var url = "https://www.hsbank360.com/f/project_buy?id=1030&type=1&amount=1111";
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : url
                });
                $httpBackend.flush();

                expect(result).toEqual(url);
            });
            it('获取失败时能抛出异常', function() {
                reqHandler.respond({
                    code : -1,
                    text : '获取失败'
                });
                $httpBackend.flush();

                expect(respError.data).toEqual('获取失败');
            });
            it('服务器非200返回时能抛出异常', function() {
                respError = undefined;
                reqHandler.respond(401, 'error msg');
                $httpBackend.flush();

                expect(respError).toBeDefined();
            });
        });
        describe('参数错误', function() {

        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});