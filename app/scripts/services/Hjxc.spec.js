/**
 * Created by Administrator on 2015/9/28.
 */
describe('合计小菜相关服务测试', function () {
    var  hjxcService,ConfigService, $httpBackend, reqHandler;

    //mock the app
    beforeEach(module('hsWechat'));

    //inject the ProjectService and $httpBackend;
    beforeEach(inject(function ($injector) {
        hjxcService = $injector.get('Hjxc');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
        $window = $injector.get('$window');
    }));

    describe('发卷接口测试', function () {
        var result;
        var respError;
        var mobile = '12300010001';
        var agreeCode = '12345';
        var channelCode = '';
        var timestamp = new Date().getTime();
        var verifyCodeGrant = md5.createHash(mobile + '' + agreeCode + '' + channelCode + '' + timestamp);
        beforeEach(function () {
            reqHandler = $httpBackend.expectPOST($window.SERVERCONF.hjxc.grantTicket);
            hjxcService.grantTicket(mobile, channelCode, timestamp, verifyCodeGrant).then(function (res) {
                result = res;
            }, function (reason) {
                respError = reason;
            });
        });

        it('获取成功', function () {
            reqHandler.respond({
                code: 1,
                message: '发放优惠券成功',
                data: {
                    ticketCode: 'HJXC201512YXOIUO',//优惠券号码
                    createDt: '2015-12-03 10:39:21',//优惠券创建时间
                    status: '1' //0未发放，1已发放，2已核销，3已兑付

                }
            });
            $httpBackend.flush();
            expect(result.ticketCode).toEqual('HJXC201512YXOIUO');
            expect(result.createDt).toEqual('2015-12-03 10:39:21');
        });

        it('重复获取', function () {
            reqHandler.respond({
                code: 0,
                message: '手机号13320825017已经领取过优惠券'
            });
            $httpBackend.flush();
            expect(respError.data).toEqual('手机号13320825017已经领取过优惠券');
        });

        it('服务器非200返回时能抛出异常', function() {
            respError = undefined;
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();
            expect(respError).toBeDefined();
        });


    });

    describe('获取卷详情接口测试', function () {
        var result;
        var respError;
        var mobile = '12300010001';
        var agreeCode = '12345';
        var timestamp = new Date().getTime();
        var verifyCodeQuery = md5.createHash(mobile + '' + agreeCode + '' + timestamp);
        beforeEach(function () {
            reqHandler = $httpBackend.expectPOST($window.SERVERCONF.hjxc.queryTicketInfosByMobile);
            hjxcService.queryTicketInfosByMobile(mobile, timestamp, verifyCodeQuery).then(function (res) {
                result = res;
            }, function (reason) {
                respError = reason;
            });
        });

        it('获取成功', function () {
            reqHandler.respond({
                code: 1,
                data: {
                    "grantDate":"2015-12-03 11:05:33",//发放时间
                    "usedDate":"2015-12-03 12:05:33",//核销时间
                    "ticketCode":"HJXC20151*****XK",//优惠券号码
                    "customerMobile":"13320825017",//客户手机
                    "status":"3" //0未发放，1已发放，2已核销，3已兑付
                }
            });
            $httpBackend.flush();
            expect(result.grantDate).toEqual('2015-12-03 11:05:33');
            expect(result.usedDate).toEqual('2015-12-03 12:05:33');
            expect(result.ticketCode).toEqual('HJXC20151*****XK');
            expect(result.customerMobile).toEqual('13320825017');
        });

        it('获取失败', function () {
            reqHandler.respond({
                code: 0,
                message: '查询优惠券信息失败'
            });
            $httpBackend.flush();
            expect(respError.data).toEqual('查询优惠券信息失败');
        });

        it('服务器非200返回时能抛出异常', function() {
            respError = undefined;
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();
            expect(respError).toBeDefined();
        });


    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});