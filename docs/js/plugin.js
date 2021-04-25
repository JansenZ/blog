var ReactSkeleton = require("./react-skeleton");
var fs = require("fs");

function createPreloaderJS(options) {
    var skeleton = ReactSkeleton.create(
        options.skeletonConfig,
        options.appSrc
    );
    var JsUtils = options.JsUtils;

    var preloader = fs.readFileSync(options.preloader, "utf8");

    preloader = preloader
        .replace("`skeleton`", skeleton)
        .replace("`mainjs`", JSON.stringify(options.bundle))
        .replace(/\bprocess\.env\.NODE_ENV\s?===?\s?('|")SNAPSHOT\1/g, "true")
        .replace(/('|")SNAPSHOT\1\s?===?\s?process\.env\.NODE_ENV/g, "true")
        .replace(/\bprocess\.env\.NODE_ENV\s?!==?\s?('|")SNAPSHOT\1/g, "false")
        .replace(/('|")SNAPSHOT\1\s?!==?\s?process\.env\.NODE_ENV/g, "false");

    return process.env.NODE_ENV === "development"
        ? preloader
        : JsUtils
            ? JsUtils.minify(JsUtils.toES5(preloader))
            : preloader;
}

var config = {};
var debugPreloader = false;

/**
 * html骨架+预渲染插件
 * @param {Object} options 配置
 * @param {Object} options.skeleton 骨架路由配置，如: { '/home': HomeComponent, '/product/:id': ProductComponent }
 * @param {String} options.appSrc 应用src文件夹地址
 * @param {String} options.preloader preloader js模版的路径
 * @param {String} [options.bundleLevel="low"] bundle js加载优先级, `high`表示和图片等资源一同加载，否则等图片等资源加载完成再加载
 */
function HtmlPreRenderWebpackPlugin(options) {
    this.options = options;

    config.skeletonConfig = options.skeleton;
    config.appSrc = options.appSrc;
    config.preloader = options.preloader;
    config.JsUtils = options.JsUtils;
    config.bundle = [];
}

HtmlPreRenderWebpackPlugin.debugPreloader = function() {
    debugPreloader = true;
    return function(req, res, next) {
        if (req.path === "/__PRELOADER_AND_SKELETON__.js") {
            res.send(createPreloaderJS(config));
        } else {
            next();
        }
    };
};

HtmlPreRenderWebpackPlugin.prototype.apply = function(compiler) {
    var self = this;

    compiler.hooks.emit.tap(
        "HtmlPreRenderWebpackPlugin",
        (compilation, callback) => {
            var asset = compilation.assets["index.html"];

            if (asset) {
                var html = asset.source();
                var bundleLevel = self.options.bundleLevel || 'low';
                var replaceOnce = "%__PRELOADER_AND_SKELETON__%";

                html = html
                    .replace(
                        /<script (?:type="text\/javascript"\s+)?src="([^"]*(?:static\/js\/(bundle|main|vendors)[\w~.]*\.js))"><\/script>/g,
                        (match, bundlejs, bundleName) => {
                            var replacement = replaceOnce;
                            replaceOnce = "";

                            if (bundleLevel !== "low") {
                                replacement += match;
                                config.bundle = "";
                            } else {
                                config.bundle.push({ url: bundlejs, name: bundleName });
                            }

                            return replacement;
                        }
                    )
                    .replace("%__PRELOADER_AND_SKELETON__%", function() {
                        if (debugPreloader) {
                            return '<script type="text/javascript" src="__PRELOADER_AND_SKELETON__.js"></script>';
                        } else {
                            return (
                                "<script>" +
                                createPreloaderJS(config) +
                                "</script>"
                            );
                        }
                    });

                compilation.assets["index.html"] = {
                    source: function() {
                        return html;
                    },
                    size: function() {
                        return html.length;
                    }
                };
            }

            callback && callback();
        }
    );
};

module.exports = HtmlPreRenderWebpackPlugin;
