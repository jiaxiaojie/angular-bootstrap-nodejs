'use strict';
(function (angular, hsWechatControllers) {

    EventLotteryCtrl.$inject = ['$scope', '$state', '$sce', '$window', 'Event', 'Common', 'Account', 'RotateService', 'SharedState', 'Tip'];
    function EventLotteryCtrl($scope, $state, $sce, $window, Event, Common, Account, Rotate, SharedState, Tip) {

        var prizeList = [
            {"mobile": "13162807198", "prize": "获电动牙刷"},
            {"mobile": "13167276590", "prize": "获现金券20元"},
            {"mobile": "13162876159", "prize": "获现金18.88元"},
            {"mobile": "13162835187", "prize": "获智能手环"},
            {"mobile": "13167276915", "prize": "获现金券10元"},
            {"mobile": "13162835303", "prize": "获iPad mini 3"},
            {"mobile": "13162835157", "prize": "获现金券20元"},
            {"mobile": "13020277502", "prize": "获现金188.88元"}
        ];

        function random(max,num){
            var ns = [],d;
            if(num > max) return ns;

            for(var i = 0; i < num ; i ++){
                var j = 0;
                do{
                    d = Math.floor(Math.random() * max);
                }while(ns.indexOf(d) !== -1);
                ns.push(d);
            }
            return ns;
        }

        function randomList(list){
            var prizeList = [];
            var ns = random(list.length,list.length);
            for(var n in ns){
                prizeList.push(list[n]);
            }
            return prizeList;
        }

        $scope.lotteryPrizeList = [];
        Event.getLotteryPrizeList().then(function (res) {
            var randomPrize = randomList(prizeList).splice(0,5); //随即5条数据
            $scope.lotteryPrizeList = randomList(randomPrize.concat(res)); //list随即出现位置
        });

        $scope.trustAsHtml = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.getHeader = function (result) {
            return result ? result.match(/<span>.*<\/span>/)[0].replace(/<\/?span>/g, '') : '中奖啦';
        };

        $scope.reward = {};
        $scope.startRotate = startRotate;
        $scope.isLogin = false;
        function startRotate() {
            if (!($scope.isLogin = Account.hasLogin())) {
                var reward = Common.getLotteryInfo();
                if (!reward) { //抽奖
                    Event.lottery().then(function (res) {
                        $scope.reward = res;
                        Rotate.get('lottery').start({
                            duration: 8000, //转动时间
                            angle: 0, //默认角度
                            animateTo: 360 * 15 + (res.rotate - 0), //转动角度
                            callback: function () {
                                Common.setLotteryInfo(res);
                                $scope.$apply(function () {
                                    SharedState.turnOn('lotterytop');
                                });
                            }
                        });
                    }, function (reason) {
                        if (reason.status == 499) {
                            Tip.show(reason.data, 3000, '.lottery-02');
                        } else {
                            Tip.show('服务器忙，请稍候再试。', 3000, '.lottery-02');
                        }
                    });
                } else {
                    $scope.reward = reward;
                    SharedState.turnOn('lotterytop');
                }
            } else {
                SharedState.turnOn('lotterytop');
            }
        };
    }

    hsWechatControllers.controller('EventLotteryCtrl', EventLotteryCtrl);

    EventDownloadCtrl.$inject = ['$scope', 'Common', 'UAService'];
    function EventDownloadCtrl($scope, Common, UAService) {

        $scope.hsbank = Common.getHsbank();
        $scope.ua = {
            isWeChat: UAService.isWeChatBrowser(),
            isIOS: UAService.isIOS('ios'),
            isAndroid: !UAService.isIOS('ios'),
            isApp: !!Common.inApp()
        }
    }

    hsWechatControllers.controller('EventDownloadCtrl', EventDownloadCtrl);


    EventTopCtrl.$inject = ['$scope', 'Event', 'Account'];
    function EventTopCtrl($scope, Event, Account) {
        $scope.accountInfo = {};
        if (Account.hasLogin()) {
            Account.getAccountInfo().then(function (res) {
                $scope.accountInfo = res;
            });
        }

        $scope.investmentWeek = {};
        $scope.investmentMonth = {};
        Event.getInvestmentList('week').then(function (res) {
            $scope.investmentWeek = res;
        });
        Event.getInvestmentList('month').then(function (res) {
            $scope.investmentMonth = res;
        });
    }

    hsWechatControllers.controller('EventTopCtrl', EventTopCtrl);


    /**
     * @ngdoc controller
     * @name hsWechat.controller.event.EventCtrl
     * @requires $scope, Account, Hjxc, $window, md5, Tip
     * @description
     * 合计小菜活动controller
     */
    EventHjxcCtrl.$inject = ['$scope', '$window', 'Account', 'Hjxc', 'md5', 'Tip'];
    function EventHjxcCtrl($scope, $window, Account, Hjxc, md5, Tip) {

        //获取用户信息
        $scope.accountInfo = {};
        if (Account.hasLogin()) {
            Account.getAccountInfo().then(function (res) {
                $scope.accountInfo = res;
                queryTicket();
            });
        }
        var agreeCode = $window.SERVERCONF.hjxc.agreeCode;
        var channelCode = $window.SERVERCONF.hjxc.channelCode;
        $scope.tickets = [];

        //查询
        function queryTicket() {
            var timestamp = new Date().getTime();
            var verifyCodeQuery = md5.createHash($scope.accountInfo.mobile + '' + timestamp + channelCode + agreeCode);
            Hjxc.queryTicketInfosByMobile($scope.accountInfo.mobile, channelCode, timestamp, verifyCodeQuery).then(function (res) {
                $scope.tickets = res;
            }, function (reason) {

            });
        }

        //领券
        $scope.grantTicket = grantTicket;
        function grantTicket() {
            var timestamp = new Date().getTime();
            var verifyCodeGrant = md5.createHash($scope.accountInfo.mobile + '' + timestamp + channelCode + agreeCode);

            Hjxc.grantTicket($scope.accountInfo.mobile, channelCode, timestamp, verifyCodeGrant).then(function (res) {
                queryTicket();
                Tip.show('领取成功', 3000, '#grantTicketBtn');
            }, function (reason) {
                if (reason.code == 0) {
                    Tip.show(reason.message, 3000, '#grantTicketBtn');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#grantTicketBtn');
                }
            });
        }
    }

    hsWechatControllers.controller('EventHjxcCtrl', EventHjxcCtrl);


    EventFriendCtrl.$inject = ['$scope','$state','UAService', 'Common', 'Account', 'Snow', '$interval'];
    function EventFriendCtrl($scope,$state ,UA, Common, Account, Snow, $interval) {
        //雪花开始
        Snow.start($scope, 60);
        $scope.data = {
            isWeChat: UA.isWeChatBrowser(),
            inApp: Common.inApp(),
            hasLogin: Account.hasLogin(),
            hsBank: Common.getHsbank()
        };

        $scope.appShare = appShare;
        function appShare(){
            if($scope.data.inApp){
                var appRootUrl = Common.getServerConfig().appRootUrl;
                var data = $state.current.data;
                var link = UA.isIOS ? 'http://m.hsbank360.com/sign/register' : 'http://m.hsbank360.com/sign/register?nothing';
                var imgUrl = /^https?.*$/.test(data.$wechatShareImgUrl) ? data.$wechatShareImgUrl :  appRootUrl + data.$wechatShareImgUrl;
                Common.getHsbank().activityShare(data.$wechatShareTitle,data.$wechatShareDesc,link,imgUrl);
            }
        }
    }

    hsWechatControllers.controller('EventFriendCtrl', EventFriendCtrl);

})(angular, hsWechatControllers);