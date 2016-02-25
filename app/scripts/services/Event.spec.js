describe("活动相关服务", function() {
    var EventService, ConfigService, $httpBackend;

    var createEventList = function(){
        var events = [];
        _.forEach([2,3,4,5,6,7], function (i) {
            events.push({
                img:'https://www.hsbank360.com/static/modules/front/images/index/banner-0' + i + '.jpg',
                title: 'slide'+i,
                type: [1,2][i % 2],
                target: [1,2][i % 2] == 1 ? "https://www.hsbank360.com/f/activity/invitation" : "1"
            });
        });
        var res = {};
        res.code = 0;
        res.text = 'ok';
        res.data = events;
        return res;
    };

    //mock the app
    beforeEach(module('hsWechat'));

    //inject the ProjectService and $httpbackend
    beforeEach(inject(function($injector){
        EventService = $injector.get('Event');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
    }));

    //describe the recommended projects
    describe('推荐活动', function(){
        var reqHandler, events, reqError;
        beforeEach(function(){
            reqHandler = $httpBackend.whenPOST(ConfigService.apiPath.event.recommend);

            reqError = undefined;//clear

            EventService.getRecommendEvents().then(function(data){
                //data
                events = data;
            },function(reason){
                //some error
                reqError = reason;
            });
        });

        it('处理正常返回', function () {
            reqHandler.respond(createEventList());
            $httpBackend.flush();

            expect(events.length).toEqual(createEventList().data.length);
            expect(reqError).not.toBeDefined();
        });
    });


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});