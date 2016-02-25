'use strict';
(function (angular, hsWechatControllers) {

    moreDetailCtrl.$inject = ['$http', '$scope', '$state', '$stateParams', 'Project', 'Account', 'Yeepay', 'Config', 'Tip', 'Navbar'];
    function moreDetailCtrl($http, $scope, $state, $stateParams, Project, Account, Yeepay, Config, Tip, Navbar) {
        $scope.projectId = $stateParams.projectId;
        $scope.canInvestNewUserProject = true;
        $scope.project = {};
        $scope.accountInfo = {};
        getProjectDetail();

        function getProjectDetail() {
            Project.getProjectDetail($scope.projectId).then(function (res) {
                $scope.project = res;
                if (Account.hasLogin()) {
                    Account.refreshAccountInfo().then(function (_res) {
                        $scope.accountInfo = _res;
                        if (_res.isNewUser != '0' && $scope.project.isNewUser == '0') {
                            $scope.canInvestNewUserProject = false;
                        }
                    });
                }
                if ($scope.project.startingAmount >= $scope.project.amount) {
                    $scope.cal.calculateAmount = $scope.project.amount;
                }
            }, function (reason) {
            });
        }
    }

    hsWechatControllers.controller('moreDetailCtrl', moreDetailCtrl);

    projectPlanCtrl.$inject = ['$http', '$scope', '$state', '$stateParams', 'Project', 'Account', 'Yeepay', 'Config', 'Tip', 'Navbar'];
    function projectPlanCtrl($http, $scope, $state, $stateParams, Project, Account, Yeepay, Config, Tip, Navbar) {
        $scope.projectId = $stateParams.projectId;
        //还款计划
        $scope.projectRepayPlanList = [];
        Project.getProjectRepaymentPlan($scope.projectId).then(function (res) {
            $scope.projectRepayPlanList = res;
        }, function (reason) {

        });
    }

    hsWechatControllers.controller('projectPlanCtrl', projectPlanCtrl);

    projectInvestor.$inject = ['$http', '$scope', '$state', '$stateParams', 'Project', 'Account', 'Yeepay', 'Config', 'Tip', 'Navbar'];
    function projectInvestor($http, $scope, $state, $stateParams, Project, Account, Yeepay, Config, Tip, Navbar) {
        $scope.projectId = $stateParams.projectId;
        $scope.investorList = [];
        Project.getInvestmentRecords($scope.projectId).then(function (res) {
            $scope.investorList = res;
            for (var i in $scope.investorList) {
                $scope.investorList[i].opDt = $scope.investorList[i].opDt.substr(0, 16);
            }
        }, function (reason) {

        });
    }

    hsWechatControllers.controller('projectInvestor', projectInvestor);


    DetailProjectCtrl.$inject = ['$http', '$scope', '$state', '$stateParams', 'Project', 'Account', 'Yeepay', 'Config', 'Tip', 'Navbar', 'Loading'];
    function DetailProjectCtrl($http, $scope, $state, $stateParams, Project, Account, Yeepay, Config, Tip, Navbar, Loading) {
        $scope.projectId = $stateParams.projectId;
        $scope.canInvestNewUserProject = true;
        $scope.project = {};
        $scope.accountInfo = {};
        getProjectDetail();

        function getProjectDetail() {
            Loading.mask(function () {
                Project.getProjectDetail($scope.projectId).then(function (res) {
                    $scope.project = res;
                    Navbar.setTitle(res.projectName);
                    if (Account.hasLogin()) {
                        Account.refreshAccountInfo().then(function (_res) {
                            $scope.accountInfo = _res;
                            if (_res.isNewUser != '0' && $scope.project.isNewUser == '0') {
                                $scope.canInvestNewUserProject = false;
                            }
                        }).finally(function () {
                            Loading.hideMask();
                        });
                    } else {
                        Loading.hideMask();
                    }
                    if ($scope.project.startingAmount >= $scope.project.amount) {
                        $scope.cal.calculateAmount = $scope.project.amount;
                    }
                }, function (reason) {
                    Loading.hideMask();
                });
            });
        }

        //计算收益
        $scope.cal = {calculateAmount: "", interest: 0};
        $scope.canCalculate = function () {
            return !isNaN($scope.cal.calculateAmount) && parseInt($scope.cal.calculateAmount) > 0;
        };
        $scope.canBuy = function () {
            return $scope.cal.calculateAmount > 0 && ($scope.project.amount < $scope.project.startingAmount || ($scope.canCalculate() && $scope.cal.calculateAmount >= $scope.project.startingAmount &&
                ($scope.accountInfo.isNewUser == 0 ? $scope.cal.calculateAmount <= 10000 : true) ));
        };

        $scope.nextBuy = function () {
            $scope.cal.calculateAmount = $scope.cal.calculateAmount.toString().substr(0, 9);
            if ($scope.project.amount > $scope.project.startingAmount && $scope.cal.calculateAmount > $scope.project.amount) {
                Tip.show('投资金额大于可投金额', 3000, '#tipMsg');
            } else {
                $state.go("invest.item.projectBuy", {
                    projectId: $scope.project.projectId,
                    amount: $scope.cal.calculateAmount
                });
            }
        };

        $scope.calculate = function () {
            $scope.cal.calculateAmount = $scope.cal.calculateAmount.toString().substr(0, 9);
            Project.interestCalculation($scope.projectId, $scope.cal.calculateAmount).then(function (res) {
                $scope.cal.interest = res;
            }, function (reason) {

            });
        };
    }

    hsWechatControllers.controller('DetailProjectCtrl', DetailProjectCtrl);


    BuyProjectCtrl.$inject = ['$window', '$scope', '$state', '$stateParams', '$sce', '$base64', 'Project', 'Account', 'Yeepay', 'Config', 'Tip', 'Navbar','Loading'];
    function BuyProjectCtrl($window, $scope, $state, $stateParams, $sce, $base64, Project, Account, Yeepay, Config, Tip, Navbar,Loading) {
        $scope.projectId = $stateParams.projectId;
        //项目信息
        $scope.project = {};
        Project.getProjectDetail($scope.projectId).then(function (res) {
            $scope.project = res;
        }, function (reason) {

        });
        //投资
        $scope.accountInfo = {};

        function getAccountInfo() {
            Loading.mask(function () {
                Account.refreshAccountInfo().then(function (res) {
                    $scope.accountInfo = res;
                }, function (reason) {

                }).finally(function () {
                    Loading.hideMask();
                });
            });
        }

        getAccountInfo();

        $scope.amount = $stateParams.amount ? $stateParams.amount : '';
        $scope.isShowInvestIframe = false;
        $scope.investIframeSrc = "";
        $scope.ticketIds = [];
        $scope.ticketAmount = 0;
        //投资券
        //状态(0, 1, 2)  状态名称(正常,已使用,过期)
        $scope.canUseInvestmentTickets = [];
        //可使用投资券金额比例
        $scope.ticketAmountRate = Config.constants.useTicketAmountRate;
        var rateAmount = $scope.amount * $scope.ticketAmountRate;
        //是否显示选择投资券界面
        $scope.isShowSelectTicket = false;

        Account.getAccountInvestmentTickets().then(function (investmentTickets) {
            for (var i in investmentTickets) {
                if (investmentTickets[i].status == 0) {
                    $scope.canUseInvestmentTickets = $scope.canUseInvestmentTickets.concat(investmentTickets[i]);
                }
            }
        }, function (reason) {

        });

        $scope.isAmount = function () {
            return !isNaN($scope.amount) && parseInt($scope.amount) > 0;
        };

        $scope.buyState = function () {
            var amount = $scope.amount - 0;
            if (!isNaN(amount)) {
                if (amount <= 100000000) { //1亿
                    if (!checkInvestTicket()) {
                        $scope.ticketIds = [];
                        $scope.ticketAmount = 0;
                    }

                    if ($scope.accountInfo.availableBalance - amount + $scope.ticketAmount < 0) {
                        return 1;
                    }
                } else {
                    return 2;
                }
            }
            return 0;
        }


        //投资按钮是否可点击。要求投资金额正确，账户可用余额大于等于应付金额、投资金额大于等于起投金额或项目可投金额小于等于起投金额
        $scope.canInvest = function () {
            return ($scope.project.amount < $scope.project.startingAmount && $scope.amount > 0 && $scope.project.amount == $scope.amount) ||
                (($scope.accountInfo.availableBalance - $scope.amount + $scope.ticketAmount >= 0) && ($scope.amount <= $scope.project.amount)
                && ($scope.amount >= $scope.project.startingAmount));
        };


        $scope.getInvestUrl = function () {
            var callbackUrl = $base64.encode($window.SERVERCONF.appRootUrl + '/#/account/invest/1' + ($scope.accountInfo.isNewUser == 0 ? '?level=4' : ''));
            Yeepay.getInvestUrl($scope.projectId, '0', $scope.amount, $scope.ticketIds.toString(), $scope.ticketAmount, 0, "1", callbackUrl).then(function (res) {
                $window.location.href = res;
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#amount');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#amount');
                }
            });
        };

        //检查优惠券是否合理
        function checkInvestTicket() {
            return $scope.amount * $scope.ticketAmountRate >= $scope.ticketAmount;
        }

        //点击投资券  被选中或者不能被选中
        $scope.clickTicket = function (ticketId) {
            var ticket = findTicket(ticketId);
            if (ticket.status == 0) {
                if (!isInSelectTicketIds(ticketId)) {
                    if (($scope.ticketAmount + ticket.amount <= $scope.amount * $scope.ticketAmountRate) && (ticket.useLimit <= $scope.amount)) {
                        $scope.ticketIds = $scope.ticketIds.concat(ticketId);
                        $scope.ticketAmount += ticket.amount;
                    } else {
                        Tip.show('亲您的投资最多可用' + ($scope.amount * $scope.ticketAmountRate).toFixed(1) + '元投资券哦', 3000, '#selectTicketBtn');
                    }
                } else {            //表示已选中的投资券被点击后变成未选中状态
                    $scope.ticketIds.splice($scope.ticketIds.indexOf(ticketId), 1);
                    $scope.ticketAmount -= ticket.amount;
                }
            } else if (ticket.status == 1) {
                Tip.show('亲您的投资券已使用', 3000, '#selectTicketBtn');
            } else if (ticket.status == 2) {
                Tip.show('亲您的投资券已过期', 3000, '#selectTicketBtn');
            }
        };
        //根据ticketId查找ticket信息
        function findTicket(ticketId) {
            for (var i in $scope.canUseInvestmentTickets) {
                if (ticketId == $scope.canUseInvestmentTickets[i].ticketId) {
                    return $scope.canUseInvestmentTickets[i];
                }
            }
        }

        //判断投资券是否被选中
        $scope.isInSelectTicketIds = isInSelectTicketIds;
        function isInSelectTicketIds(ticketId) {
            return $scope.ticketIds.indexOf(ticketId) >= 0;
        }

        //展开选择投资券界面
        $scope.selectTicket = function () {
            $scope.isShowSelectTicket = true;
            Navbar.setTitle('选择现金券');
        };
        //隐藏选择投资券界面
        $scope.finishedSelectTicket = function () {
            Navbar.setTitle('投资金额');
            $scope.isShowSelectTicket = false;
        };

        angular.element($window).on('message', function (e) {
            if (e.data.event == 'investSuccess') {
                Account.refreshAccountInfo().then(function () {
                    Tip.show('投资成功', 3000);
                    $state.go('account.invest');
                });
            }
        });
        //移除多余br标签
        $scope.removeBr = function (content) {
            return content.replace('<br/>', '');
        };
    }

    hsWechatControllers.controller('BuyProjectCtrl', BuyProjectCtrl);


    AccountInvestAgreementCtrl.$inject = ['$scope', '$stateParams', 'Project'];
    function AccountInvestAgreementCtrl($scope, $stateParams, Project) {
        /**
         * 将数值四舍五入(保留2位小数)后格式化成金额形式
         *
         * @param num 数值(Number或者String)
         * @return 金额格式的字符串,如'1,234,567.45'
         * @type String
         */
        function formatCurrency(num) {
            var cents, sign;
            num = num.toString().replace(/\$|\,/g, '');
            if (isNaN(num))
                num = "0";
            sign = (num == (num = Math.abs(num)));
            num = Math.floor(num * 100 + 0.50000000001);
            cents = num % 100;
            num = Math.floor(num / 100).toString();
            if (cents < 10)
                cents = "0" + cents;
            for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                    num.substring(num.length - (4 * i + 3));
            return (((sign) ? '' : '-') + num + '.' + cents);
        }

        //获取借款协议
        $scope.projectId = $stateParams.projectId;
        $scope.amount = formatCurrency($stateParams.amount);
        Project.getAgreement($scope.projectId, $scope.amount).then(function (res) {
            $scope.agreement = res;
            $scope.agreement.loanAmount = formatCurrency(res.loanAmount);
        }, function (reason) {

        });
    }

    hsWechatControllers.controller('AccountInvestAgreementCtrl', AccountInvestAgreementCtrl);


    //风控信息
    RiskInfoProjectCtrl.$inject = ['$scope', '$rootElement', '$timeout'];
    function RiskInfoProjectCtrl($scope, $rootElement, $timeout) {
        $scope.next = next;

        function next(i) {
            var indicators = $rootElement[0].querySelectorAll('.riskControl .carousel-indicators li');
            $timeout(function () {
                angular.element(indicators[i]).triggerHandler('click');
            });
        }
    }

    hsWechatControllers.controller('RiskInfoProjectCtrl', RiskInfoProjectCtrl);



    //相关文件
    DocumentsProjectCtrl.$inject = ['$scope','$stateParams','SharedState','Project'];
    function DocumentsProjectCtrl($scope,$stateParams,SharedState,Project) {

        //获取相关文件图片URL
        $scope.projectId = $stateParams.projectId;
        Project.getProjectDetail($scope.projectId).then(function (res) {
            $scope.imgArray = res.aboutFiles;
        }, function (reason) {
        });

        $scope.viewBigImg=function(index){
            $scope.index=index;
            SharedState.turnOn('hspopup');
        };

        $scope.swipe=function(i){
            $scope.index+=i;
            if($scope.index===$scope.imgArray.length){
                $scope.index=0;
            }else if($scope.index === -1){
                $scope.index=$scope.imgArray.length - 1;
            }
        }
    }

    hsWechatControllers.controller('DocumentsProjectCtrl', DocumentsProjectCtrl);
})(angular, hsWechatControllers);