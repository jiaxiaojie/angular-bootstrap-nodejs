describe("用户相关服务", function() {
    var localStorageService, AccountService, ConfigService, $httpBackend, scope, reqHandler, reqError;


    beforeEach(module('hsWechat'));

    beforeEach(inject(function($injector){
        AccountService = $injector.get('Account');
        ConfigService = $injector.get('Config');
        localStorageService = $injector.get('localStorageService');
        $httpBackend = $injector.get('$httpBackend');
        scope = $injector.get('$rootScope');
    }));

    describe('判断用户是否注册', function () {
        beforeEach(function () {
            reqHandler = undefined;
            reqError = undefined;
        });

        it('能解析用户已注册', function(){
            var mobile = '13566667777';
            $httpBackend.expectPOST(ConfigService.apiPath.account.hasRegistered).respond({
                code: 0,
                text: "已注册"
            });

            var result;
            AccountService.hasRegistered(mobile).then(function (res) {
                result = res;
            });

            $httpBackend.flush();

            expect(result).toBe(true);
        });

        it('能解析用户未注册', function(){
            var mobile = '13566667777';
            $httpBackend.expectPOST(ConfigService.apiPath.account.hasRegistered).respond({
                code: -1,
                text: "未注册"
            });

            var result;
            AccountService.hasRegistered(mobile).then(function (res) {
                result = res;
            },function(reason){
                reqError = reason
            });

            $httpBackend.flush();

            expect(reqError.data).toBe("未注册");
        });
    });

    describe('执行登录', function() {
        var result;
        var successMobile = '13566667777';
        var failMobile = '131111111111';
        var token = "2435135345623413";

        beforeEach(function() {
            $httpBackend.whenPOST(ConfigService.apiPath.account.login, function(data) {
                data = $j.deserialize(data);
                return data.mobile == successMobile;
            }).respond({
                code : 0,
                text : '登录成功',
                data : {token : token}
            });
            $httpBackend.whenPOST(ConfigService.apiPath.account.login, function(data) {
                data = $j.deserialize(data);
                return data.mobile != successMobile;
            }).respond({
                code : -1,
                text : '登录失败'
            });
            var accountInfo = createTestAccountInfo();
            $httpBackend.whenPOST(ConfigService.apiPath.account.my).respond({
                code: 0,
                text: 'ok',
                data: accountInfo
            });
        });

        it('能执行密码登录成功', function() {
            AccountService.loginPassword(successMobile, '123123').then(function(res) {
                result = res;
            });
            $httpBackend.flush();

            expect(result).toBe(true);
            expect(localStorageService.get('account.token')).toBe(token);
        });

        it('能执行密码登录失败', function() {
            AccountService.loginPassword(failMobile, '123123').then(function(res) {
                result = res;
            }, function(reason) {
                reqError = reason;
            });
            $httpBackend.flush();

            expect(reqError.data).toEqual("登录失败");
        });
        it('能执行验证码登录成功', function() {
            AccountService.loginSmsCode(successMobile, '123123').then(function(res) {
                result = res;
            });
            $httpBackend.flush();

            expect(result).toBe(true);
            expect(localStorageService.get('account.token')).toBe(token);
        });

        it('能执行验证码登录失败', function() {
            AccountService.loginSmsCode(failMobile, '123123').then(function(res) {
                result = res;
            }, function(reason) {
                reqError = reason;
            });
            $httpBackend.flush();

            expect(result).toEqual("登录失败");
        });
    });

    describe('执行登出', function() {
        var result;
        var respError;
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.logout);
            AccountService.logout().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });
        it('登出成功', function() {
            reqHandler.respond({
                code : 0,
                text : '登出成功'
            });
            $httpBackend.flush();

            expect(localStorageService.get('account.token')).toBeNull();
        });
    });

    function createTestLackFieldAccountInfo() {
        return {
            accountId: 5,
            avatar:"https://www.hsbank360.com/upload_files/avatar/20151013105933_792.jpg",
            netAssets:"189000",
            sumProfit:"38000",
            willProfit:"2324",
            availableBalance:"10000",
            hasSigned:Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasRemindOfMsg:Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasRemindOfTicket:Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasRemindOfReward:Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasOpenThirdAccount:Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            hasBindBankCard:Math.floor(Math.random() * 2) == 1 ? "true" : "false",
            nickname: '小二hahaha',
            //customerName: '王小二',
            certNum: '234567198878763526',
            mobile: '13566667777',
            email:'34523452@ww.com',
            bankCardNo:'622223334545667'
        };
    }
    function createTestAccountInfo() {
        var accountInfo = createTestLackFieldAccountInfo();
        accountInfo.customerName = '小二hahaha';
        return accountInfo;
    }
    describe('执行获取用户信息', function() {
        var result;
        var respError;
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.my);

            localStorageService.remove('account.info');
            AccountService.getAccountInfo().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            })
        });

        it('能正确获取', function() {
            var accountInfo = createTestAccountInfo();
            reqHandler.respond({
                code : 0,
                text : "ok",
                data : accountInfo
            });
            $httpBackend.flush();

            expect(result.customerName).toEqual(accountInfo.customerName);
        });
        it('获取数据字段不完整时能抛出异常', function() {
            //localStorageService.remove('account.info');
            if(!localStorageService.get('account.info')) {
                console.log("refresh");
            }else {
                console.log("get from storage");
            }
            reqHandler.respond({
                code : 0,
                text : "ok",
                data : createTestLackFieldAccountInfo()
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });
        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code : -1,
                text : "获取失败"
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

    describe('执行注册', function () {
        var registerResult;
        var token = 'something';
        var mobile = '13564335614';
        beforeEach(function () {
            var accountInfo = createTestAccountInfo();
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.register);
            $httpBackend.whenPOST(ConfigService.apiPath.account.my).respond({
                code: 0,
                text: 'ok',
                data: accountInfo
            });
            AccountService.register(mobile, '123456', '000000').then(function (res) {
                registerResult = res;
            });
        });

        it('注册成功', function(){
            reqHandler.respond({
                code : 0,
                text : "注册成功",
                data : {token : token}
            });
            $httpBackend.flush();

            expect(registerResult).toBe(true);
            expect(localStorageService.get('account.token')).toBe(token);
        });
    });

    function createInvestmentProjects() {
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
                amount: 1000000,
                receivedProfit: 36000,
                willProfit: 64000,
                status: [3, 5, 7][start % 3],//project status constant:3-PROJECT_STATUS_INVESTMENT,5-PROJECT_STATUS_REPAYMENTING,7-PROJECT_STATUS_END
                statusName: ["立即投资","还款中","已结束"][start % 3],
                annualizedRate: Math.floor(Math.random() * 20) * 0.01,
                isNewUser:['0','1'][start % 2],
                isRecommend:['0','1'][start % 2],
                remainingDays:55
            });
            start++;
            limit--;
        }
        return projects;
    }
    function createLackFieldInvestmentProjects() {
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
                //amount: 1000000,
                receivedProfit: 36000,
                willProfit: 64000,
                status: [3, 5, 7][start % 3],//project status constant:3-PROJECT_STATUS_INVESTMENT,5-PROJECT_STATUS_REPAYMENTING,7-PROJECT_STATUS_END
                statusName: ["立即投资","还款中","已结束"][start % 3],
                annualizedRate: Math.floor(Math.random() * 20) * 0.01,
                isNewUser:['0','1'][start % 2],
                isRecommend:['0','1'][start % 2]
            });
            start++;
            limit--;
        }
        return projects;
    }
    describe('执行获取用户投资列表', function() {
        var result;
        var respError;

        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.myInvestment);
            AccountService.getMyInvestment().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            })
        });


        it('获取成功', function() {
            var investmentProjects = createInvestmentProjects();
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: {
                    totalInvestment: 87800,
                    receiveMoney: 988,
                    tipMsg: '距下期收款还有2天, 金额10.22元',
                    projectList: investmentProjects
                }
            });
            $httpBackend.flush();

            expect(result.projectList.length).toEqual(investmentProjects.length);
        });

        it('能处理获取数据字段不完整情况', function() {
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: {
                    totalInvestment: 87800,
                    receiveMoney: 988,
                    tipMsg: '距下期收款还有2天, 金额10.22元',
                    projectList: createLackFieldInvestmentProjects()
                }
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });

        it('获取失败', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
    });

    describe('执行获取用户某月还款日历', function() {
        var result;
        var respError;
        var year = '2015';
        var month = '10';
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.repaymentCalendar);
            AccountService.getRepaymentCalendar({year:year,month:month}).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能处理获取成功', function() {
            var data = [
                {day:5,amount:3500,status:1},
                {day:8,amount:500,status:1},
                {day:12,amount:100,status:1},
                {day:15,amount:10200,status:0},
                {day:25,amount:3500,status:0}
            ];
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result.length).toEqual(data.length);
        });

        it('能处理获取数据字段不完整情况', function() {
            var code = 0;
            var text = "ok";
            reqHandler.respond({
                code: code,
                text: text,
                data: [
                    {day:5,amount:3500,status:1},
                    {day:8,amount:500,status:1},
                    {day:12,amount:100,status:1},
                    {day:15,amount:10200,status:0},
                    {day:25,amount:3500}
                ]
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });

        it('能处理获取失败', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
    });

    describe('执行重置密码',function() {
        var result;
        var respError;
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.resetPassword);
            AccountService.resetPassword({
                mobile: "1311111111",
                password: "1111111111",
                smsCode: "123123"
            }).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能处理重置成功', function() {
            reqHandler.respond({
                code : 0,
                text : 'success'
            });
            $httpBackend.flush();

            expect(result).toBe(true);
        });

        it('能处理重置失败', function() {
            reqHandler.respond({
                code : -1,
                text : '短信验证码错误'
            });
            $httpBackend.flush();

            expect(result).toEqual('短信验证码错误');
        });

        it('能处理重置时发生异常', function() {
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();

            expect(respError).toBeDefined();
        });
    });

    describe('执行保存Email', function() {
        var result;
        var respError;
        beforeEach(function() {
            var accountInfo = createTestAccountInfo();
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.saveEmail);
            $httpBackend.whenPOST(ConfigService.apiPath.account.my).respond({
                code: 0,
                text: 'ok',
                data: accountInfo
            });
            AccountService.saveEmail('ydt@fdjf.net').then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能执行保存成功', function() {
            reqHandler.respond({
                code: 0,
                text: 'ok'
            });
            $httpBackend.flush();

            expect(result).toBe(true);
        });

        it('能执行保存失败', function() {
            reqHandler.respond({
                code: -1,
                text: 'email已被使用'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('email已被使用');
        });
    });

    describe('执行保存昵称', function() {
        var result;
        var respError;
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.saveNickName);
            AccountService.saveNickName('ydt').then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能执行保存成功', function() {
            reqHandler.respond({
                code: 0,
                text: 'ok'
            });
            $httpBackend.flush();

            expect(result).toBe(true);
        });

        it('能执行保存失败', function() {
            reqHandler.respond({
                code: -1,
                text: '昵称已被使用'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('昵称已被使用');
        });
    });

    describe('执行获取交易记录分页列表', function() {
        var result;
        var respError;
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.transactionRecord);
            AccountService.getTransactionRecord(10, 1).then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能执行获取成功', function() {
            var data = [
                {opDt:'2015-10-19 11:01:01',changeType:1,changeTypeName:'充值',changeVal:'+10000'},
                {opDt:'2015-10-12 11:01:01',changeType:2,changeTypeName:'投资',changeVal:'-500'},
                {opDt:'2015-10-09 11:01:01',changeType:3,changeTypeName:'收益',changeVal:'+10'},
                {opDt:'2015-10-09 11:01:01',changeType:4,changeTypeName:'提现',changeVal:'-100'},
                {opDt:'2015-09-09 11:01:01',changeType:5,changeTypeName:'提现手续费',changeVal:'-2'}
            ];
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result.length).toEqual(data.length);
        });

        it('能执行获取数据缺少字段抛出异常', function() {
            var data = [
                {opDt:'2015-10-19 11:01:01',changeType:1,changeTypeName:'充值',changeVal:'+10000'},
                {opDt:'2015-10-12 11:01:01',changeType:2,changeTypeName:'投资',changeVal:'-500'},
                {opDt:'2015-10-09 11:01:01',changeType:3,changeTypeName:'收益',changeVal:'+10'},
                {opDt:'2015-10-09 11:01:01',changeType:4,changeTypeName:'提现',changeVal:'-100'},
                {opDt:'2015-09-09 11:01:01',changeType:5,changeTypeName:'提现手续费'}
            ];
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(respError).toEqual('system error');
        });


        it('能执行获取失败', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('获取失败');
        });
    });

    describe('执行获取用户提现信息', function() {
        var result,respError;
        beforeEach(function() {
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.beforeWithdraw);
            AccountService.getWithdrawInfo().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });
        it('能正确获取数据', function() {
            var data = {
                cardNo:"23452134523463456",
                cardStatusCode:"VERIFIED",
                bankCode:"NJYH",
                bankName:"东亚银行",
                bankLogo:"http://pic.58pic.com/58pic/12/38/92/34i58PICVNP.jpg",
                amount:1345,
                ticketCount:5
            };
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : data
            });
            $httpBackend.flush();

            expect(result.cardNo).toEqual(data.cardNo);
        });
        it('获取的数据不完整时能抛出异常', function() {
            var data = {
                //cardNo:"23452134523463456",
                cardStatusCode:"VERIFIED",
                bankCode:"NJYH",
                bankName:"东亚银行",
                bankLogo:"http://pic.58pic.com/58pic/12/38/92/34i58PICVNP.jpg",
                amount:1345,
                ticketCount:5
            };
            reqHandler.respond({
                code : 0,
                text : 'ok',
                data : data
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
        })
    });

    describe('执行签到', function() {
        var result;
        var respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.sign);
            AccountService.sign().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能成功签到并获取签到获取的积分值', function() {
            var data = -20;
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result).toEqual(data);
        });
        it('签到失败时能抛出异常', function() {
            reqHandler.respond({
                code: -1,
                text: '签到失败'
            });
            $httpBackend.flush();

            expect(respError.data).toEqual('签到失败');
        });
        it('服务器非200返回时能抛出异常', function() {
            reqHandler.respond(401, 'error msg');
            $httpBackend.flush();

            expect(respError).toBeDefined();
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
                statusName: ["正常","已使用","过期"][start % 3],
                invalidDt:"2015-10-22"
            });
            start++;
            limit--;
        }
        return tickets;
    }
    describe('获取用户优惠券', function() {
        var result;
        var respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.myTickets);
            AccountService.getAccountInvestmentTickets().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能成功获取数据', function() {
            var tickets = createTestTickets();
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: tickets
            });
            $httpBackend.flush();

            expect(result.length).toEqual(tickets.length);
        });
        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
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

    describe('获取奖励现金列表', function() {
        var result;
        var respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.myEarningPageList);
            AccountService.getMyEarningPageList().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能成功获取数据', function() {
            var data = [
                {"opDt":"2015-10-19 11:01:01","changeType":1,"changeTypeName":"推荐好友投资返利","changeVal":"+10000"},
                {"opDt":"2015-10-12 11:01:01","changeType":2,"changeTypeName":"首次充值送现金","changeVal":"-500"},
                {"opDt":"2015-10-09 11:01:01","changeType":3,"changeTypeName":"首次充值送现金","changeVal":"+10"},
                {"opDt":"2015-10-09 11:01:01","changeType":4,"changeTypeName":"中秋国庆双节投资返利","changeVal":"-100"},
                {"opDt":"2015-09-09 11:01:01","changeType":5,"changeTypeName":"中秋国庆双节投资返利","changeVal":"-2"}
            ];
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result.length).toEqual(data.length);
        });

        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
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


    describe('奖励投资券列表', function() {
        var result;
        var respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.myEarningTicketPageList);
            AccountService.getMyEarningTicketPageList().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能成功获取数据', function() {
            var data = [
                {"opDt":"2015-10-19 11:01:01","changeType":1,"changeTypeName":"推荐好友投资返利","changeVal":"+10000"},
                {"opDt":"2015-10-12 11:01:01","changeType":2,"changeTypeName":"首次充值送现金","changeVal":"-500"},
                {"opDt":"2015-10-09 11:01:01","changeType":3,"changeTypeName":"首次充值送现金","changeVal":"+10"},
                {"opDt":"2015-10-09 11:01:01","changeType":4,"changeTypeName":"中秋国庆双节投资返利","changeVal":"-100"},
                {"opDt":"2015-09-09 11:01:01","changeType":5,"changeTypeName":"中秋国庆双节投资返利","changeVal":"-2"}
            ];

            var data = [
                {"ticketId":0,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":1,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":2,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":3,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":4,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":5,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":6,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":7,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":8,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":9,"amount":10,"getDt":"2015-10-22","getRemark":"推荐好友奖励"}
            ];
            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result.length).toEqual(data.length);
        });

        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
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


    describe('我的投资券', function() {
        var result;
        var respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.myEarningTicketPageList);
            AccountService.getMyEarningTicketPageList().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能成功获取数据', function() {
            var data = [
               {"ticketId":0,"type":0,"typeName":"投资券","useInfo":"满1000元可用","useLimit":462,"amount":10,"status":0,"statusName":"正常","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":1,"type":1,"typeName":"投资券","useInfo":"满1000元可用","useLimit":925,"amount":10,"status":1,"statusName":"已使用","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":2,"type":2,"typeName":"投资券","useInfo":"满1000元可用","useLimit":278,"amount":10,"status":2,"statusName":"过期","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":3,"type":3,"typeName":"投资券","useInfo":"满1000元可用","useLimit":456,"amount":10,"status":0,"statusName":"正常","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":4,"type":4,"typeName":"投资券","useInfo":"满1000元可用","useLimit":920,"amount":10,"status":1,"statusName":"已使用","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":5,"type":0,"typeName":"投资券","useInfo":"满1000元可用","useLimit":717,"amount":10,"status":2,"statusName":"过期","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":6,"type":1,"typeName":"投资券","useInfo":"满1000元可用","useLimit":805,"amount":10,"status":0,"statusName":"正常","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":7,"type":2,"typeName":"投资券","useInfo":"满1000元可用","useLimit":677,"amount":10,"status":1,"statusName":"已使用","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":8,"type":3,"typeName":"投资券","useInfo":"满1000元可用","useLimit":443,"amount":10,"status":2,"statusName":"过期","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"},
                {"ticketId":9,"type":4,"typeName":"投资券","useInfo":"满1000元可用","useLimit":780,"amount":10,"status":0,"statusName":"正常","invalidDt":"2015-10-22","getRemark":"推荐好友奖励"}
            ];

            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result.length).toEqual(data.length);
        });

        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
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


    describe('投资券统计', function() {
        var result;
        var respError;
        beforeEach(function() {
            result = undefined;
            respError = undefined;
            reqHandler = $httpBackend.expectPOST(ConfigService.apiPath.account.myEarningTicketPageList);
            AccountService.getMyEarningTicketPageList().then(function(res) {
                result = res;
            }, function(reason) {
                respError = reason;
            });
        });

        it('能成功获取数据', function() {
            var data = {"registerCount":100,"nameAuthCount":80,"investAccount":50,"earningAmount":300,"earningTicketAmount":300};

            reqHandler.respond({
                code: 0,
                text: 'ok',
                data: data
            });
            $httpBackend.flush();

            expect(result).toBeDefined();
        });

        it('获取失败时能抛出异常', function() {
            reqHandler.respond({
                code: -1,
                text: '获取失败'
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