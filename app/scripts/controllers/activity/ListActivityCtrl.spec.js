/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("活动列表", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    describe("活动列表", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('ListActivityCtrl', { $scope: $scope });
        });
    });
});
