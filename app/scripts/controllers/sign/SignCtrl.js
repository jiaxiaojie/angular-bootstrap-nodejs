'use strict';
(function (angular, hsWechatControllers) {

    SignCtrl.$inject = ['$window', '$http', '$scope', '$state', '$interval', 'Account', 'SmsCode', 'Navbar', 'Tip', 'Common'];
    function SignCtrl($window, $http, $scope, $state, $interval, Account, SmsCode, Navbar, Tip, Common) {
        //填写手机号
        $scope.mobile = "";
        $scope.isMobile = isMobile;
        $scope.goMobileNextState = function () {
            Common.isMobile($scope.mobile).then(function () {
                Account.hasRegistered($scope.mobile).then(function (res) {
                    //已注册到输入密码页面
                    $state.go('sign.up', {mobile: $scope.mobile}, {location: false});
                }, function (reason) {
                    if (reason.status == 499) {
                        if (reason.data === '未注册') {
                            //未注册到注册页面
                            $state.go('sign.in', {mobile: $scope.mobile}, {location: false});
                        } else {
                            Tip.show(reason.data, 3000, '#mobile');
                        }
                    } else {
                        Tip.show('服务器忙，请稍候再试。', 3000, '#mobile');
                    }
                });
            }, function (res) {
                Tip.show(res.data, 3000, '#mobile');
            });
        };
    }

    hsWechatControllers.controller('SignCtrl', SignCtrl);


    SignInCtrl.$inject = ['$window', '$http', '$scope', '$state', '$stateParams', '$interval', 'Account', 'SmsCode', 'Tip', 'Navbar', 'Common'];
    function SignInCtrl($window, $http, $scope, $state, $stateParams, $interval, Account, SmsCode, Tip, Navbar, Common) {
        $scope.mobile = $stateParams.mobile;

        if (!isMobile($scope.mobile)) {
            $state.go('sign.main');
        }
        $scope.password = "";
        $scope.confirmPassword = "";
        $scope.smsCode = "";
        $scope.inviteCode = "";
        $scope.canRegister = function () {
            //return $scope.password.length > 0 && $scope.password == $scope.confirmPassword && $scope.smsCode.length > 0;
            if ($scope.mobile == $scope.inviteCode) {
                Tip.show('您不能推荐自己哦', 3000, '#smsCode');
                return false;
            }

            return /^\w{6,16}$/.test($scope.password) && $scope.smsCode.length > 0;
        };

        $scope.register = register;
        function register() {
            var lotteryInfo = Common.getLotteryInfo();
            Account.register($scope.mobile, $scope.password, $scope.smsCode, $scope.inviteCode, Common.getChannel(), Common.getChannelUserId(), lotteryInfo ? lotteryInfo.token : null).then(function (res) {
                //注册成功
                Account.refreshAccountInfo().then(function () {
                    $state.go('sign.success', {mobile: $scope.mobile}, {location: false});
                });
            }, function (reason) {
                if (reason.status == 499) {
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
            if ($scope.remainSeconds > 0) return;

            var maxRemainSeconds = 60;
            if ($scope.remainSeconds <= 0) {
                SmsCode.sendSmsCode($scope.mobile).then(function (res) {
                    if (res === true) {
                        //添加一个wifi落地页全局参数，需要添加在WIFI落地页LINK（发送验证码）这个按钮上。
                        if (Common.getChannel() == '29849a9a-a487-42a2-b26b-71c6936115c6') {
                            $scope.cyUrl = 'http://sammix.adsame.com/t?z=sammix&id=1216866&' + new Date().getTime();
                        }
                        //发送成功
                        $scope.remainSeconds = maxRemainSeconds;
                        $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                        var interFun = $interval(function () {
                            $scope.remainSeconds--;
                            $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                            if ($scope.remainSeconds <= 0) {
                                $scope.remainSeconds = 0;
                                $scope.tipsSendSmsCodeText = "发送验证码";
                                $interval.cancel(interFun);
                            }
                        }, 1000);
                    } else {
                        Tip.show(res, 3000, '#smsCode');
                    }
                }, function (reason) {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                });
            }
        }

        sendSmsCode(); //默认发送验证码

        /*
         //密码输入框焦点移出事件
         $scope.passwordBlur = function() {
         if($scope.password != $scope.confirmPassword && $scope.confirmPassword.length > 0) {
         Tip.show('确认密码输入不一致', 3000, '#registerBtn');
         }
         };
         //确认密码输入框焦点移出事件
         $scope.confirmPasswordBlur = function() {
         if($scope.password != $scope.confirmPassword) {
         Tip.show('确认密码输入不一致', 3000, '#registerBtn');
         }
         };
         */
    }

    hsWechatControllers.controller('SignInCtrl', SignInCtrl);


    SignUpCtrl.$inject = ['$window', '$http', '$rootScope', '$scope', '$state', '$stateParams', '$interval', 'Account', 'Navbar', 'Tip', 'SmsCode', 'Common'];
    function SignUpCtrl($window, $http, $rootScope, $scope, $state, $stateParams, $interval, Account, Navbar, Tip, SmsCode, Common) {
        $scope.mobile = $stateParams.mobile;
        if (!isMobile($scope.mobile)) {
            $state.go('sign.main');
        }
        $scope.data = {
            password: '',
            smsCode: ''
        };
        $scope.canLogin = function () {
            return $scope.data.password.length >= 6;
        };
        $scope.canLoginBySmsCode = function () {
            return $scope.data.smsCode.length >= 6;
        };

        //密码登录
        $scope.login = login;
        function login() {
            Account.loginPassword($scope.mobile, $scope.data.password).then(function (res) {
                //登录成功
                $scope.data.password = "";
                $rootScope.$broadcast('signUpSuccess');

                Account.refreshAccountInfo().then(function () {
                    if (Navbar.canPop(2)) {
                        Navbar.pop(2);
                    } else {
                        $state.go('account.main');
                    }
                });
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#password');
                } else {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#password');
                }
            });
        }

        //验证码登录
        $scope.loginSmsCode = loginSmsCode;
        function loginSmsCode() {
            Account.loginSmsCode($scope.mobile, $scope.data.smsCode).then(function (res) {
                //登录成功
                $scope.data.smsCode = "";
                $rootScope.$broadcast('signUpSuccess');

                Account.refreshAccountInfo().then(function () {
                    if (Navbar.canPop(2)) {
                        Navbar.pop(2);
                    } else {
                        $state.go('account.main');
                    }
                });
            }, function (reason) {
                if (reason.status == 499) {
                    Tip.show(reason.data, 3000, '#smsCode');
                } else {
                    Tip.show('验证码错误', 3000, '#smsCode');
                }
            });
        }

        //发送验证码
        $scope.cyUrl = '';
        $scope.tipsSendSmsCodeText = "发送验证码";
        $scope.remainSeconds = 0;
        $scope.sendSmsCode = sendSmsCode;
        function sendSmsCode() {
            if ($scope.remainSeconds > 0) return;
            var maxRemainSeconds = 60;
            if ($scope.remainSeconds <= 0) {
                SmsCode.sendSmsCode($scope.mobile).then(function (res) {
                    if (res === true) {
                        //添加一个wifi落地页全局参数，需要添加在WIFI落地页LINK（发送验证码）这个按钮上。
                        if (Common.getChannel() == '29849a9a-a487-42a2-b26b-71c6936115c6') {
                            $scope.cyUrl = 'http://sammix.adsame.com/t?z=sammix&id=1216866&' + new Date().getTime();
                        }
                        //发送成功
                        $scope.hasSendSmsCode = true;
                        $scope.remainSeconds = maxRemainSeconds;
                        $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                        var interFun = $interval(function () {
                            $scope.remainSeconds--;
                            $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                            if ($scope.remainSeconds <= 0) {
                                $scope.remainSeconds = 0;
                                $scope.tipsSendSmsCodeText = "发送验证码";
                                $interval.cancel(interFun);
                            }
                        }, 1000);
                    } else {
                        Tip.show(res, 3000, '#smsCode');
                    }
                }, function (reason) {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                });
            }
        }

        $scope.signState = true;
        $scope.changeSignState = function () {
            if ($scope.signState == true) {
                $scope.signState = false;
                Navbar.setTitle('请输入验证码');
                sendSmsCode();
            } else {
                $scope.signState = true;
                Navbar.setTitle('请输入登录密码');
            }
        };
    }

    hsWechatControllers.controller('SignUpCtrl', SignUpCtrl);


    SignPassCtrl.$inject = ['$window', '$http', '$scope', '$state', '$stateParams', '$interval', 'Account', 'SmsCode', 'Navbar', 'Tip', 'Common'];
    function SignPassCtrl($window, $http, $scope, $state, $stateParams, $interval, Account, SmsCode, Navbar, Tip, Common) {
        $scope.mobile = $stateParams.mobile;
        $scope.hasSendSmsCode = false;
        if (!isMobile($scope.mobile)) {
            $state.go('sign.main');
        }
        $scope.smsCode = "";
        $scope.newPassword = "";
        var pwdReg = /^[a-zA-Z\d]{6,16}$/;
        $scope.canResetPassword = function () {
            return $scope.newPassword.length > 0 && $scope.smsCode.length > 0 && pwdReg.test($scope.newPassword);
        };
        $scope.resetPassword = resetPassword;
        function resetPassword() {
            Account.resetPassword($scope.mobile, $scope.smsCode, $scope.newPassword).then(function (res) {
                if (res === true) {
                    //重置密码成功
                    Tip.show('重置密码成功', 1000, '#resetPasswordBtn');
                    Navbar.pop(1);
                } else {
                    Tip.show(res, 3000, '#smsCode');
                }
            }, function (reason) {
                Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
            });
        }

        //新密码输入框焦点移出事件
        $scope.newPasswordBlur = function () {
            if (!pwdReg.test($scope.newPassword)) {
                Tip.show('密码为6-16位数字或英文字母', 3000, '#resetPasswordBtn');
            }
        };

        //发送验证码
        $scope.cyUrl = '';
        $scope.tipsSendSmsCodeText = "发送验证码";
        $scope.remainSeconds = 0;
        $scope.sendSmsCode = sendSmsCode;
        function sendSmsCode() {
            if ($scope.remainSeconds > 0) return;
            var maxRemainSeconds = 60;
            if ($scope.remainSeconds <= 0) {
                SmsCode.sendSmsCode($scope.mobile).then(function (res) {
                    if (res === true) {
                        //添加一个wifi落地页全局参数，需要添加在WIFI落地页LINK（发送验证码）这个按钮上。
                        if (Common.getChannel() == '29849a9a-a487-42a2-b26b-71c6936115c6') {
                            $scope.cyUrl = 'http://sammix.adsame.com/t?z=sammix&id=1216866&' + new Date().getTime();
                        }
                        //发送成功
                        $scope.hasSendSmsCode = true;
                        $scope.remainSeconds = maxRemainSeconds;
                        $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                        var interFun = $interval(function () {
                            $scope.remainSeconds--;
                            $scope.tipsSendSmsCodeText = $scope.remainSeconds + '秒后重发';
                            if ($scope.remainSeconds <= 0) {
                                $scope.remainSeconds = 0;
                                $scope.tipsSendSmsCodeText = "发送验证码";
                                $interval.cancel(interFun);
                            }
                        }, 1000);
                    } else {
                        Tip.show(res, 3000, '#smsCode');
                    }
                }, function (reason) {
                    Tip.show('服务器忙，请稍候再试。', 3000, '#smsCode');
                });
            }
        }

        sendSmsCode();
    }

    hsWechatControllers.controller('SignPassCtrl', SignPassCtrl);


    SignSuccessCtrl.$inject = ['$scope', '$state', '$stateParams', 'Tip'];
    function SignSuccessCtrl($scope, $state, $stateParams, Tip) {
        $scope.mobile = $stateParams.mobile;
        //是否要判断手机号是否已注册
        if (!isMobile($scope.mobile)) {
            $state.go('sign.main');
        } else {
            Tip.showNovice(1);
        }
    }

    hsWechatControllers.controller('SignSuccessCtrl', SignSuccessCtrl);

    function isMobile(mobile) {
        //var telReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        //return telReg.test(mobile+'');
        return mobile.length >= 11;
    }
})(angular, hsWechatControllers);