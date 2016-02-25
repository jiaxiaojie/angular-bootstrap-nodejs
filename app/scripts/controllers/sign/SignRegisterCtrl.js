'use strict';
(function (angular, hsWechatControllers) {
    SignRegisterCtrl.$inject = ['$scope', '$stateParams','$state', '$interval', 'Account', 'Common','Tip','Navbar','SmsCode','Log'];
    function SignRegisterCtrl($scope, $stateParams,$state, $interval, Account, Common,Tip,Navbar,SmsCode,Log){
        $scope.mobile = '';
        $scope.inviteCode = '';
        $scope.smsCode = '';
        $scope.password = '';
        //MTU4MDA4MDQ2MDk=  -- 15800804609
        var inviteMobile =  Common.getDecodeInviteMobile();
        if(inviteMobile){
            Common.isMobile(inviteMobile).then(function(){
                $scope.inviteCode  = inviteMobile;
            });
        }

        //MTU4MDA4MDQ2MDk=  -- 15800804609
        var reg =  Common.decodeBase64(Common.getRegm());
        if(reg){
            Log.info("regm :"+reg);
            Common.isMobile(reg).then(function(){
                $scope.mobile  = reg;
            });
        }

        $scope.canRegister = function() {
            return $scope.mobile.length>=11 && /^\w{6,16}$/.test($scope.password) && $scope.smsCode.length > 0;
        };

        $scope.register = register;
        function register() {
            if($scope.mobile == $scope.inviteCode){
                Tip.show('您不能推荐自己哦', 3000, '#smsCode');
                return;
            }
            Common.isMobile($scope.mobile).then(function(){
                if(!$scope.inviteCode){
                    AccountRegister();
                }else{
                    Common.isMobile($scope.inviteCode).then(function(){
                        AccountRegister();
                    },function(reason){
                        if(reason.status == 499) {
                            Tip.show(reason.data, 3000, '#smsCode');
                        } else {
                            Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                        }
                    });
                }
            },function(reason){
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#smsCode');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                }
            });
        }

        function AccountRegister(){
            var lotteryInfo = Common.getLotteryInfo();
            Account.register($scope.mobile, $scope.password, $scope.smsCode, $scope.inviteCode,Common.getChannel(),Common.getChannelUserId(),lotteryInfo ? lotteryInfo.token : null).then(function(res) {
                var config = Common.getServerConfig();
                var channel = Common.getChannel();
                if(channel == config.channel.ios || channel == config.channel.android){ //app页面
                    $state.go('event.download2');
                }else{
                    //注册成功
                    Account.refreshAccountInfo().then(function() {
                        $state.go('sign.success', {mobile:$scope.mobile}, {location:false});
                        Common.removeLotteryInfo();
                    });
                }
            }, function(reason) {
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#smsCode');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                }
            });
        }

        //发送验证码
        $scope.cyUrl = '';
        $scope.tipsSendSmsCodeText = "发送验证码";
        $scope.remainSeconds = 0;
        $scope.sendSmsCode = sendSmsCode;
        function sendSmsCode() {
            if($scope.remainSeconds > 0 ) return;
            Common.isMobile($scope.mobile).then(function(){
                Account.hasRegistered($scope.mobile).then(function(res) {
                    Tip.show('手机号码已注册', 3000, '#smsCode');
                }, function(reason) {
                    if(reason.status == 499) {
                        if(reason.data === '未注册') {
                            var maxRemainSeconds = 60;
                            if($scope.remainSeconds <= 0) {
                                SmsCode.sendSmsCode($scope.mobile).then(function(res) {
                                    if(res === true) {
                                        //添加一个wifi落地页全局参数，需要添加在WIFI落地页LINK（发送验证码）这个按钮上。
                                        if (Common.getChannel()=='29849a9a-a487-42a2-b26b-71c6936115c6') {
                                            $scope.cyUrl = 'http://sammix.adsame.com/t?z=sammix&id=1216866&' + new Date().getTime();
                                        }
                                        //发送成功
                                        $scope.remainSeconds = maxRemainSeconds;
                                        $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                                        var interFun = $interval(function () {
                                            $scope.remainSeconds --;
                                            $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                                            if($scope.remainSeconds <= 0) {
                                                $scope.remainSeconds = 0;
                                                $scope.tipsSendSmsCodeText = "发送验证码";
                                                $interval.cancel(interFun);
                                            }
                                        }, 1000);
                                    } else {
                                        Tip.show(res, 3000, '#smsCode');
                                    }
                                }, function(reason) {
                                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                                });
                            }
                        } else {
                            Tip.show(reason.data, 3000, '#mobile');
                        }
                    } else {
                        Tip.show('服务器忙，请稍候再试。', 3000, '#mobile');
                    }
                });
            },function(reason){
                if(reason.status == 499) {
                    Tip.show(reason.data, 3000, '#smsCode');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                }
            });
        }
    }

    hsWechatControllers.controller('SignRegisterCtrl', SignRegisterCtrl);
})(angular, hsWechatControllers);