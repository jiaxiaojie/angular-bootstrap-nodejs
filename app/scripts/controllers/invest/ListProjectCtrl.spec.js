/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("项目列表测试", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe("项目列表测试", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('AccountMainCtrl', {$scope: $scope});
        });

        it('获取项目列表', function () {
            var page = createTestProjects();
            $scope.projectList = page;
            expect($scope.projectList.length).toEqual(10);
        });

        it('向下取整', function () {
            $scope.round = round;
            function round(number) {
                return Math.round(number);
            }
            var number = 1.12;
            expect(round(number)).toEqual(1);
        });

        it('截断字符串并加上省略号', function () {
            $scope.subString = subString;
            function subString(str, length) {
                return str.length <= length ? str : str.substr(0, length) + '...';
            }
            var str = "testString";
            var length = 4;
            expect(subString(str, length)).toEqual("test...");
        });
    });


    var createTestProjects = function () {
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
                repaymentModeName: ["等额本息", "先息后本", "一次性还本付息"][start % 3],
                startingAmount: 100,
                amount: 1000000,
                rate: 36,
                status: [3, 5, 7][start % 3],
                statusName: ["立即投资", "还款中", "已结束"][start % 3],
                annualizedRate: Math.floor(Math.random() * 20) * 0.01,
                projectDuration: 5,
                safeguardMode: 2,
                safeguardModeName: "本息保障",
                isNewUser: ['0', '1'][start % 2],
                isRecommend: ['0', '1'][start % 2],
                isUseTicket: ['0', '1'][start % 2],
                isCanAssign: ['0', '1'][start % 2]
            });
            start++;
            limit--;
        }
        return projects;
    };

});
