/**
 * Created by pc on 2015/11/11.
 * @author chenran
 */

describe("活动明细", function () {

    beforeEach(module('hsWechat'));

    beforeEach(inject(function(_$controller_){
        $controller = _$controller_;
    }));

    beforeEach(inject(function($injector){
        $sce = $injector.get('$sce');
    }));

    describe("活动明细", function () {

        beforeEach(function () {
            $scope = {};
            controller = $controller('DetailActivityCtrl', { $scope: $scope });
        });
    });
});
