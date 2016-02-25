'use strict';
(function (angular, hsWechatControllers) {

    //价格格式化，增加三位分隔符
    function formatNumber(n, j) {
        var s = n + "";
        var l = s.length;
        var m = l % 3;
        if (m == l) return s;
        else if (m == 0) return (s.substring(m).match(/\d{3}/g)).join(j);
        else return [s.substr(0, m)].concat(s.substring(m).match(/\d{3}/g)).join(j);
    }

    //商品名称格式化
    function formatName(name, num) {
        if (name.length > num) {
            var sub = name.substr(num, name.length);
            return name.replace(sub, '...');
        } else {
            return name;
        }
    }

    AccountPeanutCtrl.$inject = ['$scope', '$timeout', 'SharedState', 'Account', 'Tip', 'Peanut', 'Loading'];
    function AccountPeanutCtrl($scope, $timeout, SharedState, Account, Tip, Peanut, Loading) {
        $scope.accountInfo = {};
        $scope.hasSigned = false;
        $scope.showSign = false;

        function getAccountInfo() {
            Loading.mask(function () {
                Account.refreshAccountInfo().then(function (res) {
                    $scope.accountInfo = res;
                    $scope.accountInfo.availableIntegral = formatNumber(res.availableIntegral);
                    $scope.hasSigned = res.hasSigned == 'true';
                }, function (reason) {

                }).finally(function () {
                    Loading.hideMask();
                });
            });
        }

        getAccountInfo();

        $scope.sign = function () {
            Account.sign().then(function (res) {
                getAccountInfo();
                $scope.showSign = true;
                SharedState.turnOn('bookin');
                $timeout(function () {
                    SharedState.turnOff('bookin');
                }, 1500);
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#showTip');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#showTip');
                }
            });
        };

        //获取商品列表
        $scope.pageSize = 20;
        $scope.pageNumber = 1;
        $scope.products = [];
        $scope.loading = false;
        $scope.refreshLoading = false;
        $scope.loadMore = loadMore;
        function loadMore(refresh) {
            if ($scope.refreshLoading || $scope.loading) return;
            if (refresh) {
                $scope.refreshLoading = true;
                $scope.pageNumber = 1;
            } else {
                $scope.loading = true;
            }

            Peanut.productPageList($scope.pageSize, $scope.pageNumber).then(function (page) {
                if (refresh) {
                    $scope.products = [];
                    $scope.refreshLoading = false;
                } else {
                    $scope.loading = false;
                }

                if (page.length > 0) {
                    $scope.pageNumber++;
                    $scope.products = $scope.products.concat(page);
                    for (var i in $scope.products) {
                        $scope.products[i].price = formatNumber($scope.products[i].price);
                        $scope.products[i].productName = formatName($scope.products[i].productName, 6);
                    }
                    $scope.productsMain = $scope.products.slice(0, 6);
                }
            }, function (reason) {

            });
        }

        loadMore(); //首次加载
    }

    hsWechatControllers.controller('AccountPeanutCtrl', AccountPeanutCtrl);

    AccountPeanutProductDetailCtrl.$inject = ['$scope', '$stateParams', '$state', '$sce', '$rootElement', 'Account', 'Tip', 'Peanut', 'Common'];
    function AccountPeanutProductDetailCtrl($scope, $stateParams, $state, $sce, $rootElement, Account, Tip, Peanut, Common) {
        $scope.accountInfo = {};
        $scope.hasSigned = false;
        $scope.showSign = false;

        function getAccountInfo() {
            Account.refreshAccountInfo().then(function (res) {
                $scope.accountInfo = res;
                $scope.accountInfo.peanut = res.availableIntegral;
                $scope.accountInfo.availableIntegral = formatNumber(res.availableIntegral);
                $scope.hasSigned = res.hasSigned == 'true';
            }, function (reason) {

            });
        }

        getAccountInfo();

        //查询商品详情
        $scope.productId = $stateParams.productId;
        Peanut.productDetail($scope.productId).then(function (res) {
            $scope.productDetail = res;
            $scope.productDetail.realPrice = res.price;
            $scope.productDetail.price = formatNumber(res.price);
            //$scope.productDetail.productName = formatName($scope.productDetail.productName,5);
            $scope.productDetail.introduction = $sce.trustAsHtml(res.introduction.replace(/style=['"].*['"]/g, ''));
            //$scope.productDetail.introduction = res.introduction;
            $scope.productCount = 1;//确认订单页面商品数量默认值，默认为1，库存不足时为0。
            if (res.productSurplus == 0) {
                $scope.productCount = 0;
            }
        }, function (reason) {

        });

        //数量加减按钮
        $scope.add = add;
        function add() {
            $scope.productCount++;
        }

        $scope.minus = minus;
        function minus() {
            $scope.productCount--;
        }

        //验证用户花生豆余额，是否能继续兑换
        $scope.canExchange = function () {
            return $scope.accountInfo.peanut >= $scope.productDetail.realPrice * productCount && productCount > 0;
        };


    }

    hsWechatControllers.controller('AccountPeanutProductDetailCtrl', AccountPeanutProductDetailCtrl);


    AccountPeanutConfirmOrderCtrl.$inject = ['$scope', '$stateParams', '$state', 'Account', 'Tip', 'Peanut', 'localStorageService', 'Navbar'];
    function AccountPeanutConfirmOrderCtrl($scope, $stateParams, $state, Account, Tip, Peanut, localStorageService, Navbar) {

        //刷新用户信息
        $scope.accountInfo = {};
        $scope.hasSigned = false;
        function getAccountInfo() {
            Account.refreshAccountInfo().then(function (res) {
                $scope.accountInfo = res;
                $scope.accountInfo.availableIntegral = formatNumber(res.availableIntegral);
                $scope.hasSigned = res.hasSigned == 'true';
            }, function (reason) {

            });
        }

        getAccountInfo();

        $scope.flag = true;
        $scope.productId = $stateParams.productId;
        $scope.productCount = $stateParams.productCount;
        $scope.addressId = $stateParams.addressId;

        //查询商品详情，商品类型说明，1：商品（需要收货地址），2：券（不需要收货地址）
        Peanut.productDetail($scope.productId).then(function (res) {
            $scope.productDetail = res;
            $scope.productDetail.price = formatNumber(res.price);
            $scope.productDetail.productName = formatName($scope.productDetail.productName, 5);
            $scope.productDetail.typeId = res.typeId;
        }, function (reason) {
        });

        //查询收货地址
        $scope.pageSize = 20;
        $scope.pageNumber = 1;
        $scope.addresses = [];
        $scope.loading = false;
        $scope.refreshLoading = false;
        $scope.loadMore = loadMore;
        function loadMore(refresh) {
            if ($scope.refreshLoading || $scope.loading) return;
            if (refresh) {
                $scope.refreshLoading = true;
                $scope.pageNumber = 1;
            } else {
                $scope.loading = true;
            }
            Peanut.customerAddressPageList($scope.pageSize, $scope.pageNumber).then(function (page) {
                if (refresh) {
                    $scope.addresses = [];
                    $scope.refreshLoading = false;
                } else {
                    $scope.loading = false;
                }

                if (page.length > 0) {
                    $scope.pageNumber++;
                    $scope.addresses = $scope.addresses.concat(page);
                    for (var i in $scope.addresses) {
                        if ($scope.addressId.length == 0) {
                            if ($scope.addresses[i].isDefault == 0) {
                                $scope.address = $scope.addresses[i];
                                $scope.addressId = $scope.addresses[i].addressId;
                            }
                        }
                        if ($scope.addressId.length != 0) {
                            if ($scope.addresses[i].addressId == $scope.addressId) {
                                $scope.address = $scope.addresses[i];
                            }
                        }
                    }
                    if (!$scope.address) {
                        $scope.address = $scope.addresses[0];
                        $scope.addressId = $scope.addresses[0].addressId;
                    }
                }
            }, function (reason) {
            });
        }

        loadMore(); //首次加载

        $scope.canNotConfirm = canNotConfirm;
        function canNotConfirm() {
            Tip.show('请选择一个地址', 3000, '#orderConfirmBtn');
        }

        //确认下单按钮
        $scope.orderConfirm = orderConfirm;
        function orderConfirm() {
            Peanut.orderConfirm($scope.productId, $scope.productCount, $scope.addressId).then(function (res) {
                $scope.orderCode = res.orderCode;
                $scope.createDt = res.createDt;
                $scope.flag = false;
                Navbar.setTitle('支付完成');
            }, function (reason) {
                Tip.show(reason.data, 3000, '#orderConfirmBtn');
            });
        }
    }

    hsWechatControllers.controller('AccountPeanutConfirmOrderCtrl', AccountPeanutConfirmOrderCtrl);

    AccountPeanutLogCtrl.$inject = ['$scope', 'Account', 'Loading'];
    function AccountPeanutLogCtrl($scope, Account, Loading) {
        $scope.yearMonths = {};
        $scope.logPageSize = 20;
        $scope.logPageNumber = 1;
        $scope.loadMoreLog = loadMoreLog;

        function loadMoreLog(refresh) {
            Loading.show(function () {
                if (refresh) $scope.logPageNumber = 1;
                Account.getMyIntegralPageList($scope.logPageSize, $scope.logPageNumber).then(function (page) {
                    Loading.hide();
                    if (refresh) $scope.yearMonths = {};

                    if (page.length > 0) {
                        $scope.logPageNumber++;
                        angular.forEach(page, function (_this) {
                            var year = _this.opDt.substr(0, 4);
                            var month = _this.opDt.substr(5, 2);
                            var yearMonth = year + '年' + month + '月';
                            if (angular.isUndefined($scope.yearMonths[yearMonth])) {
                                $scope.yearMonths[yearMonth] = [];
                            }
                            $scope.yearMonths[yearMonth].push(_this);
                        });
                    }
                }, function (reason) {

                });
            }, refresh);
        }

        //首次加载
        loadMoreLog('refresh');
    }

    hsWechatControllers.controller('AccountPeanutLogCtrl', AccountPeanutLogCtrl);

    AccountPeanutChangeAddressCtrl.$inject = ['$scope', '$state', '$stateParams', 'localStorageService', 'Account', 'Tip', 'Peanut', 'Navbar'];
    function AccountPeanutChangeAddressCtrl($scope, $state, $stateParams, localStorageService, Account, Tip, Peanut, Navbar) {
        $scope.productId = $stateParams.productId;
        $scope.productCount = $stateParams.productCount;
        //查询地址
        $scope.pageSize = 20;
        $scope.pageNumber = 1;
        $scope.addresses = [];
        $scope.loading = false;
        $scope.refreshLoading = false;
        $scope.loadMore = loadMore;
        $scope.addressId = $stateParams.addressId;
        function loadMore(refresh) {
            if ($scope.refreshLoading || $scope.loading) return;
            if (refresh) {
                $scope.refreshLoading = true;
                $scope.pageNumber = 1;
            } else {
                $scope.loading = true;
            }
            Peanut.customerAddressPageList($scope.pageSize, $scope.pageNumber).then(function (page) {
                if (refresh) {
                    $scope.addresses = [];
                    $scope.refreshLoading = false;
                } else {
                    $scope.loading = false;
                }

                if (page.length > 0) {
                    $scope.pageNumber++;
                    $scope.addresses = $scope.addresses.concat(page);
                    for (var i in $scope.addresses) {
                        if ($scope.addresses[i].addressId == $scope.addressId) {
                            $scope.myAddress = $scope.addresses[i];
                        }
                    }
                }
            }, function (reason) {
            });
        }

        loadMore(); //首次加载
        //验证收件人姓名，非空，只包含汉字
        $scope.showNameBlur = function () {
            var reg = /^[\u4E00-\u9FA5]+$/;
            if (!$scope.myAddress.showName || $scope.myAddress.showName.length == 0) {
                Tip.show('请填写联系人姓名', 3000, '#customerAddressEditBtn');
            } else if (!reg.test($scope.myAddress.showName)) {
                Tip.show('请填写正确的联系人姓名', 3000, '#customerAddressEditBtn');
            }
        };
        //验证手机号，非空，长度为11位
        $scope.mobileBlur = function () {
            if (!$scope.myAddress.mobile || $scope.myAddress.mobile.length == 0) {
                Tip.show('请填写手机号', 3000, '#customerAddressEditBtn');
            } else if ($scope.myAddress.mobile.length != 11) {
                Tip.show('请填写正确的手机号', 3000, '#customerAddressEditBtn');
            }
        };
        //验证收件人地址，非空
        $scope.addressBlur = function () {
            if (!$scope.myAddress.address || $scope.myAddress.address.length == 0) {
                Tip.show('请填写收货地址', 3000, '#customerAddressEditBtn');
            }
        }

        $scope.canEditAddress = function () {
            var reg = /^[\u4E00-\u9FA5]+$/;
            return reg.test($scope.myAddress.showName) &&
                $scope.myAddress.showName.length >= 0 &&
                $scope.myAddress.mobile.length == 11 &&
                $scope.myAddress.address.length != 0
        };

        //修改地址
        $scope.postCode = '';
        $scope.address = {isDefault: true};
        $scope.customerAddressEdit = customerAddressEdit;
        function customerAddressEdit() {
            Peanut.customerAddressEdit($scope.addressId, $scope.myAddress.showName, $scope.myAddress.mobile, $scope.myAddress.address, $scope.postCode, $scope.address.isDefault ? 0 : 1).then(function (res) {
                Navbar.pop(1);
            }, function (reason) {
            });
        }

        //删除地址
        $scope.deleteAddress = deleteAddress;
        function deleteAddress() {
            Peanut.customerAddressDelete($scope.addressId).then(function (res) {
                Navbar.pop(1);
            }, function (reason) {
            });
        }
    }

    hsWechatControllers.controller('AccountPeanutChangeAddressCtrl', AccountPeanutChangeAddressCtrl);

    AccountPeanutAddAddressCtrl.$inject = ['$scope', '$state', '$stateParams', '$element', 'localStorageService', 'Account', 'Tip', 'Peanut', 'Navbar'];
    function AccountPeanutAddAddressCtrl($scope, $state, $stateParams, $element, localStorageService, Account, Tip, Peanut, Navbar) {
        $scope.productId = $stateParams.productId;
        $scope.productCount = $stateParams.productCount;
        //验证收件人姓名，非空，只包含汉字
        $scope.showNameBlur = function () {
            var reg = /^[\u4E00-\u9FA5]+$/;
            if (!$scope.showName || $scope.showName.length == 0) {
                Tip.show('请填写联系人姓名', 3000, '#customerAddressAddBtn');
            } else if (!reg.test($scope.showName)) {
                Tip.show('请填写正确的联系人姓名', 3000, '#customerAddressAddBtn');
            }
        };
        //验证手机号，非空，长度为11位
        $scope.mobileBlur = function () {
            if (!$scope.mobile || $scope.mobile.length == 0) {
                Tip.show('请填写手机号', 3000, '#customerAddressAddBtn');
            } else if ($scope.mobile.length != 11) {
                Tip.show('请填写正确的手机号', 3000, '#customerAddressAddBtn');
            }
        };
        //验证收件人地址，非空
        $scope.addressBlur = function () {
            if (!$scope.accountAddress || $scope.accountAddress.length == 0) {
                Tip.show('请填写收货地址', 3000, '#customerAddressAddBtn');
            }
        };
        $scope.canAddAddress = function () {
            var reg = /^[\u4E00-\u9FA5]+$/;
            return reg.test($scope.showName) &&
                $scope.showName.length >= 0 &&
                $scope.mobile.length == 11 &&
                $scope.accountAddress.length != 0
        };
        //新增地址,0:默认地址 1：非默认地址
        $scope.postCode = '';
        $scope.address = {isDefault: true};
        $scope.customerAddressAdd = customerAddressAdd;
        function customerAddressAdd() {
            Peanut.customerAddressAdd($scope.showName, $scope.mobile, $scope.accountAddress, $scope.postCode, $scope.address.isDefault ? 0 : 1).then(function (res) {
                Navbar.pop(1);
            }, function (reason) {
            });
        }
    }

    hsWechatControllers.controller('AccountPeanutAddAddressCtrl', AccountPeanutAddAddressCtrl);

    AccountPeanutSelectAddressCtrl.$inject = ['$scope', '$stateParams', '$state', 'localStorageService', 'Account', 'Tip', 'Peanut', 'Navbar'];
    function AccountPeanutSelectAddressCtrl($scope, $stateParams, $state, localStorageService, Account, Tip, Peanut, Navbar) {

        $scope.data = {isEdit: false};
        $scope.productId = $stateParams.productId;
        $scope.productCount = $stateParams.productCount;
        //确认选择地址，编辑状态下进入修改地址页面，非编辑状态下进入确认订单页面
        $scope.confirmAddress = confirmAddress;
        function confirmAddress(addressId) {
            if ($scope.data.isEdit) {
                $state.go('account.peanut.changeAddress', {
                    productId: $scope.productId,
                    productCount: $scope.productCount,
                    addressId: addressId
                });
            } else {
                var state = Navbar.getStateByPop(1);
                state.params.addressId = addressId;
                Navbar.pop();
            }
        }

        //查询地址
        $scope.pageSize = 20;
        $scope.pageNumber = 1;
        $scope.addresses = [];
        $scope.loading = false;
        $scope.refreshLoading = false;
        $scope.loadMore = loadMore;
        function loadMore(refresh) {
            if ($scope.refreshLoading || $scope.loading) return;
            if (refresh) {
                $scope.refreshLoading = true;
                $scope.pageNumber = 1;
            } else {
                $scope.loading = true;
            }
            Peanut.customerAddressPageList($scope.pageSize, $scope.pageNumber).then(function (page) {
                if (refresh) {
                    $scope.addresses = [];
                    $scope.refreshLoading = false;
                } else {
                    $scope.loading = false;
                }

                if (page.length > 0) {
                    $scope.pageNumber++;
                    $scope.addresses = $scope.addresses.concat(page);
                    $scope.addresses.sort(function (a, b) {
                        return a.isDefault - b.isDefault;
                    });
                }
            }, function (reason) {

            });
        }

        loadMore(); //首次加载
    }

    hsWechatControllers.controller('AccountPeanutSelectAddressCtrl', AccountPeanutSelectAddressCtrl);

    AccountPeanutExchangeRecordCtrl.$inject = ['$scope', 'Account', 'Tip', 'Peanut', 'localStorageService'];
    function AccountPeanutExchangeRecordCtrl($scope, Account, Tip, Peanut, localStorageService) {
        //查询兑换记录
        $scope.pageSize = 20;
        $scope.pageNumber = 1;
        $scope.records = [];
        $scope.loading = false;
        $scope.refreshLoading = false;
        $scope.loadMore = loadMore;
        function loadMore(refresh) {
            if ($scope.refreshLoading || $scope.loading) return;
            if (refresh) {
                $scope.refreshLoading = true;
                $scope.pageNumber = 1;
            } else {
                $scope.loading = true;
            }
            Peanut.orderPageList($scope.pageSize, $scope.pageNumber).then(function (page) {
                if (refresh) {
                    $scope.records = [];
                    $scope.refreshLoading = false;
                } else {
                    $scope.loading = false;
                }
                if (page.length > 0) {
                    $scope.pageNumber++;
                    $scope.records = $scope.records.concat(page);
                    for (var i in $scope.records) {
                        $scope.records[i].price = formatNumber($scope.records[i].price);
                        $scope.records[i].productName = formatName($scope.records[i].productName, 5);
                    }
                }
            }, function (reason) {
            });
        }

        loadMore(); //首次加载
    }

    hsWechatControllers.controller('AccountPeanutExchangeRecordCtrl', AccountPeanutExchangeRecordCtrl);

})(angular, hsWechatControllers);