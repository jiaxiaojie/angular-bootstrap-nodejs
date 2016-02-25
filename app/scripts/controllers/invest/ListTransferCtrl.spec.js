/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("Transfer列表测试", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe("Transfer列表测试", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('InvestListTransferCtrl', {$scope: $scope});
        });


    });

});
