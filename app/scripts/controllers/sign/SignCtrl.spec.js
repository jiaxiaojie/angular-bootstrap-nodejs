/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("注册登录测试", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));


    describe("密码长度验证", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('SignUpCtrl', {$scope: $scope});
        });

        it('密码长度在6位以上', function () {
            $scope.password = "123456";
            expect($scope.canLogin()).toBe(true);
        });

        it('密码长度不足6位', function () {
            $scope.password = "123";
            expect($scope.canLogin()).toBe(false);
        });

    });

    describe("重置密码验证", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('SignPassCtrl', {$scope: $scope});
        });

        it('密码长度在6位以上，验证码不为空', function () {
            $scope.newPassword = "123456";
            $scope.smsCode = "1234";
            expect($scope.canResetPassword()).toBe(true);
        });

        it('密码长度不足6位，验证码不为空', function () {
            $scope.newPassword = "123";
            $scope.smsCode = "1234";
            expect($scope.canResetPassword()).toBe(false);
        });

        it('密码长度在6位以上，验证码为空', function () {
            $scope.newPassword = "123456";
            $scope.smsCode = "";
            expect($scope.canResetPassword()).toBe(false);
        });

        it('密码长度不足6位，验证码为空', function () {
            $scope.newPassword = "123";
            $scope.smsCode = "";
            expect($scope.canResetPassword()).toBe(false);
        });

    });


});
