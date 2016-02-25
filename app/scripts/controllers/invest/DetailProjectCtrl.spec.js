/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("项目列表明细测试", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe("项目列表明细测试", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('DetailProjectCtrl', {$scope: $scope});
        });

        it('获取项目列表明细测试', function () {
            var project = createTestProject();
            $scope.project = project;
            expect($scope.project.projectId).toEqual(5);
            if(project.isNewUser != '0' && $scope.project.isNewUser == '0') {
                expect($scope.canInvestNewUserProject).toBe(true);
            }
        });

        it('获取投资记录测试', function () {
            var investorList = createTestInvestmentRecords();
            $scope.investorList = investorList;
            expect($scope.investorList.length).toEqual(10);
        });

        it('还款计划测试', function () {
            var projectRepayPlanList = createTestRepaymentPlan();
            $scope.projectRepayPlanList = projectRepayPlanList;
            expect($scope.projectRepayPlanList.length).toEqual(10);
        });

        it('计算收益测试', function () {
            $scope.cal = {calculateAmount:"1.11", interest:0};
            expect($scope.canCalculate()).toBe(true);
        });
    });


    describe("购买项目列表明细测试", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('BuyProjectCtrl', {$scope: $scope});
        });

        it('获取购买项目列表明细测试', function () {
            var project = createTestProject();
            $scope.project = project;
            expect($scope.project.projectId).toEqual(5);
        });

        it('获取用户信息测试', function () {
            var accountInfo = createTestAccountInfo();
            $scope.accountInfo = accountInfo;
            expect($scope.accountInfo.accountId).toEqual(5);
        });

        it('投资测试', function () {
            $scope.ticketIds = [];
            $scope.ticketAmount = 0;
            $scope.canUseInvestmentTickets = [];
            $scope.isShowSelectTicket = false;
            var investmentTickets = createTestTickets();
            for(var i in investmentTickets) {
                $scope.canUseInvestmentTickets = $scope.canUseInvestmentTickets.concat(investmentTickets[i]);
            }
            expect($scope.canUseInvestmentTickets.length).toEqual(10);
        });

        it('判断amount测试', function () {
            $scope.amount = "2.00";
            expect($scope.isAmount()).toBe(true);
        });

        it('购买状态测试0', function () {
            $scope.amount = 2;
            $scope.ticketIds = [];
            $scope.ticketAmount = 0;
            $scope.accountInfo.availableBalance = "";
            $scope.ticketAmount = 0;
            expect($scope.buyState() == 0);
        });
        it('购买状态测试1', function () {
            $scope.amount = "200.00";
            $scope.ticketIds = [];
            $scope.ticketAmount = "2.00";
            $scope.accountInfo.availableBalance = "10.00";
            $scope.ticketAmount = 0;
            expect($scope.buyState() == 1);
        });
        it('购买状态测试2', function () {
            $scope.amount = 200000000;
            $scope.ticketIds = [];
            $scope.ticketAmount = 0;
            $scope.accountInfo.availableBalance = "";
            $scope.ticketAmount = 0;
            expect($scope.buyState() == 2);
        });

        it('投资按钮是否可点击', function () {
            //投资按钮是否可点击。要求投资金额正确，账户可用余额大于等于应付金额、投资金额大于等于起投金额或项目可投金额小于等于起投金额
            $scope.accountInfo.availableBalance = 1000;
            $scope.amount = 100;
            $scope.ticketAmount = 0;
            $scope.project.amount = 2000;
            $scope.project.startingAmount = 50;
            expect($scope.canInvest()).toBe(true);
        });

        it('检查优惠券是否合理', function () {
            $scope.amount = 100;
            $scope.ticketAmountRate = 0.5;
            $scope.ticketAmount = 50;
            expect($scope.amount * $scope.ticketAmountRate >= $scope.ticketAmount);
        });

        it('判断投资券是否被选中', function () {
            var ticketId = 1;
            $scope.ticketIds = createTestTickets();
            $scope.isInSelectTicketIds(ticketId);
            expect($scope.ticketIds.indexOf(ticketId) >= 0);
        });

        it('展开选择投资券界面', function () {
            $scope.isShowSelectTicket = "";
            $scope.selectTicket();
            expect($scope.isShowSelectTicket).toBe(true);
        });

        it('隐藏选择投资券界面', function () {
            $scope.isShowSelectTicket = "";
            $scope.finishedSelectTicket();
            expect($scope.isShowSelectTicket).toBe(false);
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
            projectId: 5,
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

});
