describe("更多相关服务", function() {
    var MoreService, ConfigService, $httpBackend, reqHandler, result, respError;

    var createActivities = function(){
        var activities = [];
        _.forEach([2,3,4,5,6,7], function (i) {
            activities.push({
                imageUrl:'https://www.hsbank360.com/static/modules/front/images/index/banner-0' + i + '.jpg',
                title: 'slide'+i,
                type: [1,2][i % 2],
                target: [1,2][i % 2] == 1 ? "https://www.hsbank360.com/f/activity/invitation" : "1"
            });
        });
        return activities;
    };
    var createLackFieldActivities = function(){
        var activities = [];
        _.forEach([2,3,4,5,6,7], function (i) {
            activities.push({
                imageUrl:'https://www.hsbank360.com/static/modules/front/images/index/banner-0' + i + '.jpg',
                title: 'slide'+i,
                //type: [1,2][i % 2],
                target: [1,2][i % 2] == 1 ? "https://www.hsbank360.com/f/activity/invitation" : "1"
            });
        });
        return activities;
    };

    //mock the app
    beforeEach(module('hsWechat'));

    //inject the ProjectService and $httpbackend
    beforeEach(inject(function($injector){
        MoreService = $injector.get('More');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
    }));

    describe('获取活动分页列表', function(){
        beforeEach(function(){
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.more.activityPageList);
            result = undefined;//clear
            respError = undefined;//clear
            MoreService.getActivityPageList().then(function(data){
                result = data;
            },function(reason){
                respError = reason;
            });
        });

        it('处理正确获取数据', function () {
            var activities = createActivities();
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : activities
            });
            $httpBackend.flush();

            expect(result.length).toEqual(activities.length);
        });
        it('获取数据缺少字段时能抛出异常', function () {
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : createLackFieldActivities()
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });
        it('获取失败时能抛出异常', function () {
            reqHandler.respond({
                code : -1,
                text : '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
        it('服务器非200返回时能抛出异常', function () {
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();

            expect(respError).toBeDefined();
        });
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});