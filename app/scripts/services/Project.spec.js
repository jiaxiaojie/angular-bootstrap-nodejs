describe("项目和债权服务", function() {
    var ProjectService, ConfigService, $httpBackend, $http, scope, reqHandler;

    var createTestProjects = function() {
        var start = 0;
        var limit = 10;
        var projects = [];
        var max = 35;
        var types = ['商圈贷', '车辆抵押', '个人信用贷', '典当融资租赁'];
        while (start < max && limit > 0) {
            var type = Math.floor(Math.random() * 4);
            projects.push({
                projectId: start,
                projectName: types[type] + '-' + start,
                projectType: type,
                projectTypeName: types[type],
                repaymentMode: 1,
                repaymentModeName:  ["等额本息","先息后本","一次性还本付息"][start % 3],
                startingAmount:100,
                amount: 1000000,
                rate: 36,
                status: [3, 5, 7][start % 3],
                statusName: ["立即投资","还款中","已结束"][start % 3],
                annualizedRate: Math.floor(Math.random() * 20) * 0.01,
                projectDuration: 5,
                safeguardMode:2,
                safeguardModeName: "本息保障",
                isNewUser:['0','1'][start % 2],
                isRecommend:['0','1'][start % 2],
                isUseTicket:['0','1'][start % 2],
                isCanAssign:['0','1'][start % 2]
            });
            start++;
            limit--;
        }
        return projects;
    };
    var createTestLackFieldProjects = function() {
        var start = 0;
        var limit = 10;
        var projects = [];
        var max = 35;
        var types = ['商圈贷', '车辆抵押', '个人信用贷', '典当融资租赁'];
        while (start < max && limit > 0) {
            var type = Math.floor(Math.random() * 4);
            projects.push({
                projectId: start,
                //projectName: types[type] + '-' + start,
                projectType: type,
                projectTypeName: types[type],
                repaymentMode: 1,
                repaymentModeName:  ["等额本息","先息后本","一次性还本付息"][start % 3],
                startingAmount:100,
                amount: 1000000,
                rate: 36,
                status: [3, 5, 7][start % 3],
                statusName: ["立即投资","还款中","已结束"][start % 3],
                annualizedRate: Math.floor(Math.random() * 20) * 0.01,
                projectDuration: 5,
                safeguardMode:2,
                safeguardModeName: "本息保障",
                isNewUser:['0','1'][start % 2],
                isRecommend:['0','1'][start % 2],
                isUseTicket:['0','1'][start % 2],
                isCanAssign:['0','1'][start % 2]
            });
            start++;
            limit--;
        }
        return projects;
    };

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

    function createTestProject() {
        var project = createTestLackFieldProject();
        project.biddingDeadline = '2015-09-05';
        return project;
    }

    //mock the app
    beforeEach(module('hsWechat'));

    //inject the ProjectService and $httpbackend
    beforeEach(inject(function($injector){
        ProjectService = $injector.get('Project');
        ConfigService = $injector.get('Config');
        $httpBackend = $injector.get('$httpBackend');
        scope = $injector.get('$rootScope');
    }));

    //describe the recommended projects
    describe('执行获取推荐项目', function(){
        var result, respError;
        beforeEach(function(){
            reqHandler = $httpBackend.whenPOST(ConfigService.apiPath.project.recommend);

            ProjectService.getRecommendProjects().then(function(res){
                result = res;
            },function(reason){
                respError = reason;
            });
        });
        it('能正确获取数据', function() {
            var projects = createTestProjects();
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : projects
            });
            $httpBackend.flush();

            expect(result.length).toEqual(projects.length);
        });
        it('返回结果不为数组时能抛出异常', function() {
            var projects = createTestProjects();
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : projects[0]
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });
        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code : -1,
                text : '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
        it('能处理服务器非200返回', function(){
            respError = undefined;
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();
            expect(respError).toBeDefined();
        });
    });

    //describe the all projects list
    describe('执行获取项目列表', function(){
        var result;
        var respError;

        beforeEach(function(){

            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.project.pageList);
            ProjectService.getProjectsPageList().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能正确获取数据', function() {
            var projects = createTestProjects();
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: projects
            });
            $httpBackend.flush();

            expect(result.length).toEqual(projects.length);
        });
        it('获取数据不为数组时能抛出异常', function() {
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: createTestProjects()[0]
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });
        it('获取数据字段不完整时能抛出异常', function() {
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: createTestLackFieldProjects()
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });

        it('能处理获取失败', function(){
            reqHandler.respond({
                code: -1,
                text: '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
    });

    //describe the project detail
    describe('项目详情', function(){
        var result, respError;
        beforeEach(function(){
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.project.detail, function(data) {
                data = $j.deserialize(data);
                return !isNaN(data.projectId);
            });
        });
        it('能正确获取数据', function() {
            ProjectService.getProjectDetail(1).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
            var project = createTestProject();
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : project
            });
            $httpBackend.flush();

            expect(result.projectId).toEqual(project.projectId);
        });
        it('获取数据缺少字段时能抛出异常', function() {
            ProjectService.getProjectDetail(1).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : createTestLackFieldProject()
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });
        it('获取失败时能抛出异常', function() {
            ProjectService.getProjectDetail(1).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
            reqHandler.respond({
                code : -1,
                text : '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
        it('参数错误时能抛出异常', function() {
            ProjectService.getProjectDetail("a1a").then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });

            scope.$apply();//deal the promise

            $httpBackend.resetExpectations();

            expect(respError).toEqual('arg error');
        });
        it('服务器非200返回时能抛出异常', function(){
            ProjectService.getProjectDetail(1).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();

            expect(respError).toBeDefined();
        });
    });

    function createTestLackFieldRepaymentPlan() {
        var dt = '2015-11-11';
        var records = [];
        var limit = 10;
        while (limit-- > 0) {
            records.push({
                //planDate: dt,
                planMoney: 100,
                principal: 90,
                interest: 10,
                remainingPrincipal: 1000,
                status: Math.floor(Math.random() * 4)
            });
        }
        return records;
    }

    function createTestRepaymentPlan() {
        var dt = '2015-11-11';
        var records = [];
        var limit = 10;
        while (limit-- > 0) {
            records.push({
                planDate: dt,
                planMoney: 100,
                principal: 90,
                interest: 10,
                remainingPrincipal: 1000,
                status: Math.floor(Math.random() * 4)
            });
        }
        return records;
    }
    //describe the project repayment plan
    describe('执行项目还款计划', function(){
        var result, respError;
        describe('参数错误', function() {
            it("参数错误时能抛出异常", function() {
                ProjectService.getProjectRepaymentPlan("1a").then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });

                scope.$apply();
                $httpBackend.resetExpectations();

                expect(respError).toEqual('arg error');
            });
        });
        describe('参数正常', function() {
            beforeEach(function() {
                reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.project.repaymentPlan);
                ProjectService.getProjectRepaymentPlan(1).then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });
            });
            it('能正确获取数据', function() {
                var repaymentPlan = createTestRepaymentPlan();
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : repaymentPlan
                });
                $httpBackend.flush();

                expect(result.length).toEqual(repaymentPlan.length);
            });
            it('获取的数据缺少字段时能抛出异常', function() {
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : createTestLackFieldRepaymentPlan()
                });
                $httpBackend.flush();

                expect(respError).toEqual('system error');
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
    });

    function createTestLackFieldInvestmentRecords() {
        var start = 0;
        var limit = 10;
        var records = [];
        var max = 35;
        while (start < max && limit > 0) {
            records.push({
                //investmentUser: 'a*b*c*d',
                opTerm: 'iPhone客户端',
                opDt: '2015-08-29',
                amount: [100, 1000, 50, 10500, 6700, 5][Math.floor(Math.random() * 6)]
            });
            start++;
            limit--;
        }
        return records;
    }

    function createTestInvestmentRecords() {
        var start = 0;
        var limit = 10;
        var records = [];
        var max = 35;
        while (start < max && limit > 0) {
            records.push({
                investmentUser: 'a*b*c*d',
                opTerm: 'iPhone客户端',
                opDt: '2015-08-29',
                amount: [100, 1000, 50, 10500, 6700, 5][Math.floor(Math.random() * 6)]
            });
            start++;
            limit--;
        }
        return records;
    }
    //describe the project invest records
    describe('项目投资记录', function(){
        var result, respError;
        describe('参数错误', function() {
            it("参数错误时能抛出异常", function() {
                ProjectService.getInvestmentRecords("1a").then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });

                scope.$apply();
                $httpBackend.resetExpectations();

                expect(respError).toEqual('arg error');
            });
        });
        describe('参数正常', function() {
            beforeEach(function() {
                reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.project.investmentRecords);
                ProjectService.getInvestmentRecords(1).then(function(res) {
                    result = res;
                }, function(reason) {
                    respError = reason;
                });
            });
            it('能正确获取数据', function() {
                var investmentRecords = createTestInvestmentRecords();
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : investmentRecords
                });
                $httpBackend.flush();

                expect(result.length).toEqual(investmentRecords.length);
            });
            it('获取的数据缺少字段时能抛出异常', function() {
                reqHandler.respond({
                    code : 0,
                    text : 'ok',
                    data : createTestLackFieldInvestmentRecords()
                });
                $httpBackend.flush();

                expect(respError).toEqual('system error');
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
    });

    describe('收益计算', function() {
        var result, respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.project.interestCalculation);
            ProjectService.interestCalculation(1, 1000).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });
        it('能正确获取数据', function() {
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : 1000
            });
            $httpBackend.flush();

            expect(result).toEqual(1000);
        });
        it('获取失败时能抛出异常', function() {
            var investmentRecords = createTestInvestmentRecords();
            reqHandler.respond({
                code : -1,
                text : '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
        it('服务器非200返回时能抛出异常', function() {
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