(function(angular, hsLib){

    /**
     * @ngdoc service
     * @name hsWechat.services.Log
     * @description
     *  ConfigProvide
     */
    ConfigProvider.$inject = [];
    function ConfigProvider() {
        this.apiPath = {
            account:{
                hasRegistered:'/account/hasRegistered',
                resetPassword:'/account/resetPassword',
                changePassword:'/account/changePassword',
                logout:'/account/logout',
                register:'/account/register',
                login:'/account/login',
                sendSmsCode:'/account/sendSmsCode',
                my:'/account/my',
                myInvestment:'/account/myInvestment',
                myInvestmentDetail:'/account/myInvestmentDetail',
                repaymentCalendar:'/account/repaymentCalendar',
                saveEmail:'/account/saveEmail',
                saveNickName:'/account/saveNickName',
                beforeWithdraw:'/account/beforeWithdraw',
                transactionRecord:'/account/transactionRecord',
                sign:'/account/sign',
                myTickets:'/account/myTickets',
                myEarningPageList:'/account/myEarningPageList',
                myEarningTicketPageList:'/account/myEarningTicketPageList',
                myInvitationPageList:'/account/myInvitationPageList',
                myInvitationStat:'/account/myInvitationStat',
                myIntegralPageList : '/account/myIntegralPageList',
                repaymentPlan : '/account/repaymentPlan',
                customerAddressAdd : '/account/customerAddressAdd',
                customerAddressDelete : '/account/customerAddressDelete',
                customerAddressEdit : '/account/customerAddressEdit',
                customerAddressPageList : '/account/customerAddressPageList',
                orderConfirm : '/account/orderConfirm',
                orderPageList : '/account/orderPageList'
            },
            event:{
                recommend:'/event/carousel',
                lottery:'/event/lottery',
                lotteryPrizeList:'/event/lotteryPrizeList',
                investmentList:'/event/investmentList'
            },
            project:{
                recommend:'/project/recommend',
                detail:'/project/detail',
                investmentRecords:'/project/investmentRecords',
                pageList:'/project/pageList',
                repaymentPlan:'/project/repaymentPlan',
                interestCalculation:'/project/interestCalculation'
            },
            yeepay:{
                toRegister:'/yeepay/toRegister',
                toBindBankCard:'/yeepay/toBindBankCard',
                toRecharge:'/yeepay/toRecharge',
                toWithdraw:'/yeepay/toWithdraw',
                toInvest:'/yeepay/toInvest',
                toCurrentInvest:'/yeepay/toCurrentInvest',
                toUnBindBankCard:'/yeepay/toUnBindBankCard'
            },
            more: {
                activityPageList:'/more/activityPageList'
            },
            common:{
                isMobile:'/common/isMobile'
            },
            wechat:{
                jsSignature:'/wechat/jsSignature'
            },
            mall:{
                productPageList:'/mall/productPageList',
                productDetail:'/mall/productDetail'
            },
            current:{
                detail:'/current/detail',
                interestCalculation:'/current/interestCalculation',
                myCurrent:'/current/myCurrent',
                myCurrentDetail:'/current/myCurrentDetail',
                myCurrentInterestPageList:'/current/myCurrentInterestPageList',
                myCurrentPrincipalPageList:'/current/myCurrentPrincipalPageList',
                pageList:'/current/pageList',
                redeemInterest:'/current/redeemInterest',
                redeemPrincipal:'/current/redeemPrincipal'
            },
            agreement:{
                investment:'/agreement/investment',
                current:'/agreement/current'
            },
            message:{
                accountMessagePageList:'/message/accountMessagePageList',
                systemMessagePageList:'/message/systemMessagePageList',
                read:'/message/read'
            }
        };

        /**
         * @ngdoc function
         * @name hsWechat.services.Config#pathIsApi
         * @methodOf hsWechat.services.Config
         *
         * @description
         * 判断路径是否是API路径
         *
         * @return {bool} true or false
         */
        function pathIsApi(path){
            var match = false;
            angular.forEach(this.apiPath, function (service) {
                angular.forEach(service, function (item) {
                    if(path.search(item) >=0 && !/^.*[.]html$/.test(path)){
                        match = true;
                    }
                });
            });
            return match;
        }

        this.$get = $get;
        $get.$inject = [];
        function $get() {
            return {
                pathIsApi: pathIsApi,
                apiPath : this.apiPath,
                constants : {
                    page : {
                        defaultPageNumber : 1,
                        defaultPageSize : 10
                    },
                    useTicketAmountRate : 0.005     //用券比例
                }
            }
        }
    }
    hsLib.provider('Config', ConfigProvider);
})(angular, hsLib);