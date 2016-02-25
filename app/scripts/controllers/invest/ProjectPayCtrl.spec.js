/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("支付项目", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));

    describe("支付项目", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('InvestProjectPayCtrl', {$scope: $scope});
        });


    });

});
