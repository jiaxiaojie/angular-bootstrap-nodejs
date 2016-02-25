(function (angular, hsWechatServices) {

    /**
     * @ngdoc service
     * @name hsWechat.services.WechatJSSDK
     *
     * @requires $q
     * @requires $http
     * @description
     * 微信JSSDK相关的服务
     */
    WechatJSSDK.$inject = ['$http', '$q', 'localStorageService', 'Config', '$window', '$rootScope'];
    function WechatJSSDK($http, $q, localStorageService, Config, $window, $rootScope) {
        var isFirst = true;
        var url = encodeURIComponent($window.location.href.split('#')[0]);
        $http.post(Config.apiPath.wechat.jsSignature, {url: url}).then(function (res) {
            if ($window.wx) {
                $window.wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: res.appId, // 必填，公众号的唯一标识
                    timestamp: res.timestamp, // 必填，生成签名的时间戳
                    nonceStr: res.nonceStr, // 必填，生成签名的随机串
                    signature: res.signature,// 必填，签名
                    jsApiList: [// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        'onMenuShareTimeline',//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
                        'onMenuShareAppMessage',// 获取“分享给朋友”按钮点击状态及自定义分享内容接口
                        'onMenuShareQQ',// 获取“分享到QQ”按钮点击状态及自定义分享内容接口
                        'onMenuShareWeibo',// 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
                        'onMenuShareQZone',// 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口
                        'chooseImage',// 拍照或从手机相册中选图接口
                        'previewImage',//预览图片接口
                        'uploadImage',//上传图片接口
                        'downloadImage',//下载图片接口
                        'scanQRCode',//调起微信扫一扫接口
                        'openLocation',//使用微信内置地图查看位置接口
                        'getLocation',//获取地理位置接口
                        'closeWindow'//关闭当前网页窗口接口
                    ]
                });
            }
        }, function (reason) {
        });


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#setAllShareParams
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 设置所有分享参数
         *
         * @param {title} 分享标题
         * @param {link} 分享链接
         * @param {desc} 分享描述
         * @param {imgUrl} 分享图标
         *
         * <pre>
         *   WechatJSSDK.setAllShareParams(title, desc, link, imgUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * 备注：加入wx.ready(function () {})原因是为了解决首次进入页面不加载分享参数问题，详情见微信JSSDK官方文档。
         * 文档链接：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
         *
         * config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操
         * 作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发
         * 时才调用的接口，则可以直接调用，不需要放在ready函数中。
         *
         * @returns {promise} promise true for success
         *
         */
        this.setAllShareParams = setAllShareParams;
        function setAllShareParams(title, desc, link, imgUrl) {
            var setAll = function () {
                onMenuShareTimeline(title, link, imgUrl);
                onMenuShareAppMessage(title, desc, link, imgUrl);
                onMenuShareQQ(title, desc, link, imgUrl);
                onMenuShareWeibo(title, desc, link, imgUrl);
                onMenuShareQZone(title, desc, link, imgUrl);
            };
            if ($window.wx) {
                if (isFirst) {
                    $window.wx.ready(function () {
                        setAll();
                        isFirst = false;
                    });
                } else {
                    setAll();
                }
            }
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#onMenuShareTimeline
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“分享到朋友圈”，按钮点击、自定义分享内容及分享结果接口
         *
         * @param {title} 分享标题
         * @param {link} 分享链接
         * @param {imgUrl} 分享图标
         *
         * <pre>
         *   WechatJSSDK.onMenuShareTimeline(title, link, imgUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */

        this.onMenuShareTimeline = onMenuShareTimeline;
        function onMenuShareTimeline(title, link, imgUrl) {
            $window.wx.onMenuShareTimeline({
                title: title,
                link: link,
                imgUrl: imgUrl,
                success: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareTimelineSuccess', title, link, imgUrl);
                },
                cancel: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareTimelineCancel', title, link, imgUrl);
                },
                fail: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareTimelineFail', title, link, imgUrl);
                }
            });
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#onMenuShareAppMessage
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口
         *
         * @param {title} 分享标题
         * @param {desc} 分享描述
         * @param {link} 分享链接
         * @param {imgUrl} 分享图标
         * @param {type}  分享类型,music、video或link，不填默认为link
         * @param {dataUrl}  如果type是music或video，则要提供数据链接，默认为空
         *
         * <pre>
         *   WechatJSSDK.onMenuShareAppMessage(title,desc,link,imgUrl,type,dataUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         * 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
         */
        this.onMenuShareAppMessage = onMenuShareAppMessage;
        function onMenuShareAppMessage(title, desc, link, imgUrl) {
            $window.wx.onMenuShareAppMessage({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareAppMessageSuccess', title, desc, link, imgUrl);
                },
                cancel: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareAppMessageCancel', title, desc, link, imgUrl);
                },
                fail: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareAppMessageFail', title, desc, link, imgUrl);
                }
            });
        }

        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#onMenuShareQQ
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“分享到QQ”，按钮点击、自定义分享内容及分享结果接口
         *
         * @param {title} 分享标题
         * @param {desc} 分享描述
         * @param {link} 分享链接
         * @param {imgUrl} 分享图标
         *
         * <pre>
         *   WechatJSSDK.onMenuShareQQ(title,desc,link,imgUrl,type,dataUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         * 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
         */
        this.onMenuShareQQ = onMenuShareQQ;
        function onMenuShareQQ(title, desc, link, imgUrl) {
            $window.wx.onMenuShareQQ({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareQQSuccess', title, desc, link, imgUrl);
                },
                cancel: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareQQCancel', title, desc, link, imgUrl);
                },
                fail: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareQQFail', title, desc, link, imgUrl);
                }
            });
        }

        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#onMenuShareWeibo
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“分享到微博”，按钮点击、自定义分享内容及分享结果接口
         *
         * @param {title} 分享标题
         * @param {desc} 分享描述
         * @param {link} 分享链接
         * @param {imgUrl} 分享图标
         *
         * <pre>
         *   WechatJSSDK.onMenuShareWeibo(title,desc,link,imgUrl,type,dataUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.onMenuShareWeibo = onMenuShareWeibo;
        function onMenuShareWeibo(title, desc, link, imgUrl) {
            $window.wx.onMenuShareWeibo({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareWeiboSuccess', title, desc, link, imgUrl);
                },
                cancel: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareWeiboCancel', title, desc, link, imgUrl);
                },
                fail: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareWeiboFail', title, desc, link, imgUrl);
                }
            });
        }

        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#onMenuShareQZone
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“分享到QQ空间”，按钮点击、自定义分享内容及分享结果接口
         *
         * @param {title} 分享标题
         * @param {desc} 分享描述
         * @param {link} 分享链接
         * @param {imgUrl} 分享图标
         *
         * <pre>
         *   WechatJSSDK.onMenuShareQZone(title,desc,link,imgUrl,type,dataUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.onMenuShareQZone = onMenuShareQZone;
        function onMenuShareQZone(title, desc, link, imgUrl) {
            $window.wx.onMenuShareQZone({
                title: title,
                desc: desc,
                link: link,
                imgUrl: imgUrl,
                success: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareQZoneSuccess', title, desc, link, imgUrl);
                },
                cancel: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareQZoneCancel', title, desc, link, imgUrl);
                },
                fail: function () {
                    $rootScope.$broadcast('wechatShareOnMenuShareQZoneFail', title, desc, link, imgUrl);
                }
            });
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#chooseImage
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“拍照或从手机相册中选图接口”，按钮点击
         *
         * @param {count} 照片张数：默认9
         * @param {sizeType} 照片清晰度类型：['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         * @param {sourceType} 照片来源：['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         *
         * <pre>
         *   WechatJSSDK.chooseImage().then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.chooseImage = chooseImage;
        function chooseImage() {
            var d = $q.defer();
            $window.wx.chooseImage({
                //count: 9, // 默认9
                //sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                //sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    d.resolve(res);// 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    $rootScope.$broadcast('wechatChooseImageSuccess');
                }
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#previewImage
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“预览照片”，按钮点击
         *
         * @param {current} 当前显示图片的http链接
         * @param {urls} 需要预览的图片http链接列表
         *
         * <pre>
         *   WechatJSSDK.previewImage(current,urls).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.previewImage = previewImage;
        function previewImage(current, urls) {
            $window.wx.previewImage({
                current: current, // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            });
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#uploadImage
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“上传照片”，按钮点击
         *
         * @param {localId} // 需要上传的图片的本地ID，由chooseImage接口获得
         *
         * <pre>
         *   WechatJSSDK.uploadImage(localId).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.uploadImage = uploadImage;
        function uploadImage(localId) {
            var d = $q.defer();
            $window.wx.uploadImage({
                localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                    d.resolve(res); // 返回图片的服务器端ID
                    $rootScope.$broadcast('wechatUploadImageSuccess', localId);
                }
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#downloadImage
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“下载照片”，按钮点击
         *
         * @param {localId} // 需要上传的图片的本地ID，由chooseImage接口获得
         *
         * <pre>
         *   WechatJSSDK.downloadImage(serverId).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.downloadImage = downloadImage;
        function downloadImage(serverId) {
            var d = $q.defer();
            $window.wx.downloadImage({
                serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                isShowProgressTips: 1,  // 默认为1，显示进度提示
                success: function (res) {
                    d.resolve(res); // 返回图片下载后的本地ID
                    $rootScope.$broadcast('wechatDownloadImageSuccess', serverId);
                }
            });
            return d.promise;
        }


        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#getLocation
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“获取当前地理位置”，按钮点击
         *
         * <pre>
         *   WechatJSSDK.getLocation().then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.getLocation = getLocation;
        function getLocation() {
            var d = $q.defer();
            $window.wx.getLocation({
                success: function (res) {
                    d.resolve(res);
                    $rootScope.$broadcast('wechatGetLocationSuccess');
                }
            });
            return d.promise;
        }

        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#openLocation
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“查看地理位置”，按钮点击
         *
         * @param {latitude} // 纬度，浮点数，范围为90 ~ -90
         * @param {longitude} // 经度，浮点数，范围为180 ~ -180
         * @param {name} // 位置名
         * @param {address} // 地址详情说明
         * @param {scale} // 地图缩放级别,整形值,范围从1~28。默认为最大
         * @param {infoUrl} // 在查看位置界面底部显示的超链接,可点击跳转
         *
         * <pre>
         *   WechatJSSDK.openLocation(latitude,longitude,name,address,scale,infoUrl).then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.openLocation = openLocation;
        function openLocation(latitude, longitude, name, address, scale, infoUrl) {
            $window.wx.openLocation({
                latitude: latitude,
                longitude: longitude,
                name: name,
                address: address,
                scale: scale,
                infoUrl: infoUrl
            });
        }

        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#closeWindow
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“关闭当前窗口”，按钮点击
         *
         * <pre>
         *   WechatJSSDK.closeWindow().then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.closeWindow = closeWindow;
        function closeWindow() {
            $window.wx.closeWindow();
        }

        /**
         * @ngdoc function
         * @name hsWechat.service.WechatJSSDK#scanQRCode
         * @methodOf hsWechat.service.WechatJSSDK
         *
         * @description
         * 2.1 监听“扫一扫”，按钮点击
         *
         * @param {needResult} // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
         *
         * <pre>
         *   WechatJSSDK.scanQRCode().then(function(res) {
         *      //res = {}
         *   });
         * </pre>
         *
         * @returns {promise} promise true for success
         *
         */
        this.scanQRCode = scanQRCode;
        function scanQRCode(needResult) {
            var d = $q.defer();
            $window.wx.scanQRCode({
                needResult: needResult,
                success: function (res) {
                    d.resolve(res);// 当needResult 为 1 时，扫码返回的结果
                    $rootScope.$broadcast('wechatScanQRCodeSuccess', needResult);
                }
            });
            return d.promise;
        }


    }


    hsWechatServices.service('WechatJSSDK', WechatJSSDK);
})(angular, hsWechatServices);