/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("Yeepay充值测试", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe("Yeepay充值测试", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('YeepayCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            var accountInfo = createTestAccountInfo();
            $scope.accountInfo = accountInfo;
            expect($scope.accountInfo.accountId).toEqual(5);
        });

    });

    describe("Yeepay提现测试", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('YeepayWithdrawCtrl', {$scope: $scope});
        });

        it('成功更新并返回用户信息', function () {
            var accountInfo = createTestAccountInfo();
            $scope.accountInfo = accountInfo;
            expect($scope.accountInfo.accountId).toEqual(5);
        });

        it('获取用户提现信息', function () {
            var withdrawInfo = {
                cardNo:"23452134523463456",
                cardStatusCode:"VERIFIED",
                bankCode:"NJYH",
                bankName:"东亚银行",
                bankLogo:"http://pic.58pic.com/58pic/12/38/92/34i58PICVNP.jpg",
                amount:1345,
                ticketCount:5
            };
            $scope.withdrawInfo = withdrawInfo;
            expect($scope.withdrawInfo.cardNo).toEqual("23452134523463456");
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

});
