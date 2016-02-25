/**
 * Created by Administrator on 2015/9/28.
 */
describe('验证码相关服务', function() {
    var SmsCodeService, ConfigService, $httpBackend,reqHandler;

    //mock the app
    beforeEach(module('hsWechat'));

    //inject the ProjectService and $httpBackend;
    beforeEach(inject(function($injector) {
        SmsCodeService = $injector.get('SmsCode');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('执行发送验证码', function() {
        var result;
        var respError;
        var mobile = '13111111111111';
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.sendSmsCode);
            SmsCodeService.sendSmsCode(mobile).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能执行成功发送', function() {
            reqHandler.respond({
                code : 0,
                text : '发送成功'
            });
            $httpBackend.flush();

            expect(result).toBe(true);
        });

        it('能执行发送失败', function() {
            reqHandler.respond({
                code : -1,
                text : '手机号码格式错误'
            });
            $httpBackend.flush();

            expect(result).toEqual('手机号码格式错误');
        });

        it('能处理发送错误时抛出异常', function() {
            reqHandler.respond(401, 'msg error');
            $httpBackend.flush();

            expect(respError).toBeDefined();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});