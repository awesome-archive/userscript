import Setting from './Setting'
import config from './config'
import Rule from './rule'
import tpl_mainHtml from './res/main.html'
import Parser from './parser'
import {
    C, L_getValue, L_setValue, L_removeValue, parseHTML,
    toRE, $x
} from './lib'
import UI from './UI'
import { isWindows } from './lib'
import downloader from './downloader'
import { runVue } from './app/index'
import bus, { APPEND_NEXT_PAGE, SHOW_SPEECH } from './app/bus'

var App = {
    isEnabled: false,
    parsedPages: {},
    pageNum: 1,
    paused: false,
    curPageUrl: location.href,
    requestUrl: null,
    iframe: null,
    remove: [],
    // 滚动激活相关
    curFocusElement: null,
    curFocusIndex: 1,

    init: function() {
        if (["mynovelreader-iframe", "superpreloader-iframe"].indexOf(window.name) != -1) { // 用于加载下一页的 iframe
            return;
        }

        // 手动调用
        var readx = function() {
            // 防止 unsafeWindow cannot call: GM_getValue
            setTimeout(function() {
                App.launch();
            }, 0);
        };
        try {
            exportFunction(readx, unsafeWindow, {defineAs: "readx"});
        } catch(ex) {
            console.error('无法定义 readx 函数');
        }


        App.loadCustomSetting();
        App.site = App.getCurSiteInfo();

        if (App.site.startLaunch) {
            App.site.startLaunch($(document));
        }

        var autoLaunch = App.isAutoLaunch();

        if (autoLaunch === -1) {
            return;
        } else if (autoLaunch) {
            if (App.site.mutationSelector) { // 特殊的启动：等待js把内容生成完毕
                App.addMutationObserve(document, App.launch);
            } else if (App.site.timeout) { // 延迟启动
                setTimeout(App.launch, App.site.timeout);
            } else { // NoScript 下 setTimeout 没用？
                App.launch();
            }
        } else {
            UI.addButton();
        }
    },
    loadCustomSetting: function() {
        var customRules;
        try {
            customRules = eval(Setting.customSiteinfo);
        } catch (e) {
            console.error('载入自定义站点配置错误', e);
        }

        if (_.isArray(customRules)) {
            Rule.customRules = customRules;
            C.log('载入自定义站点规则成功', customRules);
        }

        // load custom replace rules
        Rule.customReplace = Rule.parseCustomReplaceRules(Setting.customReplaceRules);

        C.log('载入自定义替换规则成功', Rule.customReplace);
    },
    getCurSiteInfo: function() {
        var rules = Rule.customRules.concat(Rule.specialSite);
        var locationHref = location.href;

        var info = _.find(rules, function(x) {
            return toRE(x.url).test(locationHref);
        });

        if (!info) {
            info = {};
            C.log("没有找到规则，尝试自动模式。");
        } else {
            C.log("找到规则：", info);
        }
        return info;
    },
    isAutoLaunch: function() {
        var locationHref = window.location.href,
            locationHost = location.host,
            referrer = document.referrer;

        switch (true) {
            case L_getValue("mynoverlreader_disable_once") == 'true':
                L_removeValue("mynoverlreader_disable_once");
                return false;
            // case location.hostname == 'www.fkzww.net' && !document.title.match(/网文快讯/):  // 啃书只自动启用一个地方
            //     return false;
            case Setting.booklink_enable && /booklink\.me/.test(referrer):
                return true;
            case locationHost == 'tieba.baidu.com':
                var title = $('.core_title_txt').text();
                if (title.match(Rule.titleRegExp)) {
                    return false;
                } else {
                    return -1;
                }
            case Setting.getDisableAutoLaunch():
                return false;
            case GM_getValue("auto_enable"):
            case config.soduso && /www\.sodu\.so/.test(referrer):
                return true;
            default:
                return false;
        }
    },
    addMutationObserve: function(doc, callback) {
        var shouldAdd = false;
        var $doc = $(doc);

        var contentSize = $doc.find(App.site.contentSelector).size();
        if (contentSize && !App.site.mutationSelector) {
            shouldAdd = false;
        } else {
            var mutationSelector = App.site.mutationSelector;
            var target = $doc.find(mutationSelector)[0];
            if (target) {
                C.log(`target.children.length = ${target.children.length}`, target)
                if (App.site.mutationChildText) {
                    if (target.textContent.indexOf(App.site.mutationChildText) > -1) {
                        shouldAdd = true;
                    }
                } else {
                    var childCount = App.site.mutationChildCount;
                    if (childCount === undefined || target.children.length <= childCount) {
                        shouldAdd = true;
                    }
                }
            }
        }

        if (shouldAdd) {
            var observer = new MutationObserver(function(mutations) {
                var nodeAdded = mutations.some(function(x) {
                    return x.addedNodes.length > 0;
                });

                if (nodeAdded) {
                    observer.disconnect();
                    callback();
                }
            });

            observer.observe(target, {
                childList: true
            });

            C.log("添加 MutationObserve 成功：", mutationSelector);
        } else {
            callback();
        }
    },
    launch: function() {
        // 只解析一次，防止多次重复解析一个页面
        if (document.body && document.body.getAttribute("name") == "MyNovelReader") {
            return App.toggle();
        }

        if (!App.site) {
            App.site = App.getCurSiteInfo();
        }

        if (App.site.startFilter) {
            try {
                App.site.startFilter();
                C.log('run startFilter function success');
            } catch (ex) {
                console.error('运行 startFilter function 错误', ex);
            }
        }

        var parser = new Parser(App.site, document);
        var hasContent = !!parser.hasContent();
        if (hasContent) {
            document.body.setAttribute("name", "MyNovelReader");
            App.parsedPages[window.location.href] = true;
            parser.getAll(function(parser) {
                App.processPage(parser);
            });
        } else {
            console.error("当前页面没有找到内容");
        }

        // 初始化, 取消页面限制等
        if (App.site.fInit)
            App.site.fInit();
    },
    processPage: function(parser) {
        // 对 Document 进行处理
        document.body.innerHTML = '';
        App.prepDocument();
        App.initDocument(parser);

        runVue();

        // cache vars
        App.$doc = $(document);
        App.$menuBar = App.$doc.find("#menu-bar");
        App.$menu = App.$doc.find("#menu");
        App.$content = App.$doc.find("#mynovelreader-content");
        App.$loading = App.$doc.find("#loading");
        App.$preferencesBtn = App.$doc.find("#preferencesBtn");

        App.$menuHeader = App.$menu.find("#chapter-list");
        App.$chapterList = App.$menu.find("#chapter-list");

        App.indexUrl = parser.indexUrl;
        App.prevUrl = parser.prevUrl; // 第一个上一页

        App.oArticles = [];  // 原始的内容，用于替换的无需刷新
        App.parsers = [];

        // 加入上一章的链接
        if (parser.prevUrl) {
            $("<li>")
                .addClass('chapter')
                .append(
                    $("<div>")
                    .attr({
                        "realHref": parser.prevUrl,
                        "onclick": "return false;"
                    })
                    .text("上一章".uiTrans())
                )
                .prependTo(App.$chapterList);
        }

        // 插入站点样式
        if (App.site.style) {
            GM_addStyle(App.site.style);
        }

        App.appendPage(parser, true);

        App.registerControls();

        // UI 的初始化
        UI.init();

        App.curFocusElement = $("article:first").get(0); // 初始化当前关注的 element
        App.requestUrl = parser.nextUrl;
        App.isTheEnd = parser.isTheEnd;

        App.isEnabled = true;
        UI.addButton();

        // // 如果已经把当前焦点链接添加到历史记录，则滚动到顶部
        // if (Setting.addToHistory) {
        //     window.scrollTo(0, 0);
        // }

        // 有些图片网站高度随着图片加载而变长
        setTimeout(App.scroll, 1000);

        App.cleanAgain();

        if (config.PRELOADER) {
            App.doRequest();
        }
    },
    prepDocument: function() {
        window.onload = window.onunload = function() {};

        // 破解右键限制
        var doc = document;
        var bd = doc.body;
        bd.onclick = bd.ondblclick = bd.onselectstart = bd.oncopy = bd.onpaste = bd.onkeydown = bd.oncontextmenu = bd.onmousemove = bd.onselectstart = bd.ondragstart = doc.onselectstart = doc.oncopy = doc.onpaste = doc.onkeydown = doc.oncontextmenu = null;
        doc.onclick = doc.ondblclick = doc.onselectstart = doc.oncontextmenu = doc.onmousedown = doc.onkeydown = function() {
            return true;
        };

        doc = document.wrappedJSObject || document;
        doc.onmouseup = null;
        doc.onmousedown = null;
        doc.oncontextmenu = null;

        var arAllElements = document.getElementsByTagName('*');
        for (var i = arAllElements.length - 1; i >= 0; i--) {
            var elmOne = arAllElements[i];
            elmOne = elmOne.wrappedJSObject || elmOne;
            elmOne.onmouseup = null;
            elmOne.onmousedown = null;
        }

        $(document).unbind("keypress");
        $(document).unbind("keydown");

        // remove body style
        $('link[rel="stylesheet"], script').remove();
        $('body')
            .removeAttr('style')
            .removeAttr('bgcolor');

        $('style:not(.noRemove)').filter(function() {
            var $style = $(this);
            if($style.text().indexOf('#cVim-link-container') != -1) {  // chrome 的 cVim 扩展
                return false;
            }
            return true;
        }).remove();
    },
    initDocument: function(parser) {
        document.title = parser.docTitle;

        document.body.innerHTML = $.nano(tpl_mainHtml.uiTrans(), parser);
    },
    clean: function() {
        $('body > *:not("#container, .readerbtn, .noRemove, #reader_preferences, #uil_blocker,iframe[name=\'mynovelreader-iframe\']")').remove();
        $('link[rel="stylesheet"]:not(.noRemove)').remove();
        $('body, #container').removeAttr('style').removeAttr('class');

        if (unsafeWindow.jQuery && location.host.indexOf('qidian') > 0) {
            unsafeWindow.jQuery(document).off("selectstart").off("contextmenu");
        }
    },
    cleanAgain: function() {
        // var host = location.host;
        // if (!host.match(/qidian\.com|zongheng\.com/)) {  // 只在起点、纵横等网站运行
        //     return;
        // }

        // 再次移除其它不相关的，起点，纵横中文有时候有问题
        setTimeout(App.clean, 2000);
        setTimeout(App.clean, 5000);
        setTimeout(App.clean, 8000);
        // TM 用 addEventListener('load') 有问题
        window.onload = function() {
            App.clean();
            setTimeout(App.clean, 500);
        };
    },
    toggle: function() {
        if (App.isEnabled) { // 退出
            GM_setValue("auto_enable", false);
            L_setValue("mynoverlreader_disable_once", true);

            location.href = App.activeUrl;
        } else {
            GM_setValue("auto_enable", true);
            L_removeValue("mynoverlreader_disable_once");
            App.isEnabled = true;
            App.launch();
        }
    },
    removeListener: function() {
        C.log("移除各种事件监听");
        App.remove.forEach(function(_remove) {
            _remove();
        });
    },
    appendPage: function(parser, isFirst) {
        var chapter = $("article:last");
        if (chapter.length && parser.isSection) { // 每次获取的不是一章，而是一节
            var lastText = chapter.find("p:last").remove().text().trim();
            var newPage = parser.content.replace(/<p>\s+/, "<p>" + lastText);

            chapter
                .find(".chapter-footer-nav").remove()
                .end()
                .append(newPage);

            if (!Setting.hide_footer_nav) {
                chapter.append($.nano(UI.tpl_footer_nav, parser));
            }

        } else {
            chapter = $("<article>")
                .attr("id", "page-" + App.pageNum)
                .append(
                    $("<h1>").addClass("title").text(parser.chapterTitle)
                )
                .append(parser.content)
                .appendTo(App.$content);

            if (!Setting.hide_footer_nav) {
                chapter.append($.nano(UI.tpl_footer_nav, parser));
            }

            // App.fixImageFloats(chapter.get(0));

            // 添加到章节列表
            var chapterItem = $("<li>")
                .addClass('chapter')
                .append(
                    $("<div>")
                    .attr({
                        href: "#page-" + App.pageNum,
                        "realHref": parser.curPageUrl,
                        onclick: "return false;",
                        title: parser.chapterTitle
                    })
                    .text(parser.chapterTitle)
                )
                .prependTo(App.$chapterList);

            if (isFirst) {
                chapterItem.addClass('active');
            }

            App.pageNum += 1;
            App.resetCache();
        }

        App.oArticles.push(chapter[0].outerHTML);
        App.parsers.push(parser);

        bus.$emit(APPEND_NEXT_PAGE)
    },
    resetCache: function() {  // 更新缓存变量
        App.menuItems = App.$chapterList.find("div");
        App.scrollItems = $("article");
    },
    registerControls: function() {
        // 内容滚动
        var throttled = _.throttle(App.scroll, 200);
        $(window).scroll(throttled);

        App.registerKeys();

        if (Setting.dblclickPause) {
            App.$content.on("dblclick", function() {
                App.pauseHandler();
            });
        }

        // 左侧章节列表
        App.$menuHeader.click(function() {
            App.copyCurTitle();
        });

        App.$menuBar.click(function() {
            UI.hideMenuList();
        });

        App.$doc.on("mousedown", "#chapter-list div", function(event) {
            switch (event.which) {
                case 1:
                    var href = $(this).attr("href");
                    if (href) {
                        App.scrollToArticle($(href));
                    } else {
                        location.href = $(this).attr("realHref");
                    }
                    break;
                case 2: // middle click
                    L_setValue("mynoverlreader_disable_once", true);
                    App.openUrl($(this).attr("realHref"));
                    break;
            }
        });

        $("#preferencesBtn").click(function(event) {
            event.preventDefault();
            UI.preferencesShow();
        });

        GM_registerMenuCommand("小说阅读脚本设置".uiTrans(), UI.preferencesShow.bind(UI));
    },
    registerKeys: function() {
        key('enter', function(event) {
            if (UI.$prefs) {
                return;
            }

            App.openUrl(App.indexUrl, "主页链接没有找到".uiTrans());
            App.copyCurTitle();

            event.stopPropagation();
            event.preventDefault();
        });

        key('left', function(event) {
            var scrollTop = $(window).scrollTop();
            if (scrollTop === 0) {
                location.href = App.prevUrl;
            } else {
                var offsetTop = $(App.curFocusElement).offset().top;
                // 在视野窗口内
                if (offsetTop > scrollTop && offsetTop < (scrollTop + $(window).height())) {
                    App.scrollToArticle(App.curFocusElement.previousSibling || 0);
                } else {
                    App.scrollToArticle(App.curFocusElement);
                }
            }
            return false;
        });

        key('right', function(event) {
            if (App.getRemain() === 0) {
                location.href = App.lastRequestUrl || App.requestUrl;
            } else {
                App.scrollToArticle(App.curFocusElement.nextSibling || App.$doc.height());
            }

            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        key('esc', function(){
            if (UI.$prefs) {
                UI.hide();
                return false;
            }
        });

        key('shift+/', function() {
            UI.openHelp();
            return false;
        });

        key(Setting.quietModeKey, function(){
            UI.toggleQuietMode();
            return false;
        });

        key(Setting.hideMenuListKey, function(){
            UI.hideMenuList();
            return false;
        });

        key(Setting.openPreferencesKey, function(){
            UI.preferencesShow();
            return false;
        });

        key(Setting.openSpeechKey, function() {
            bus.$emit(SHOW_SPEECH)
            return false;
        });

        // PageUp
        key(',', function() {
            let { scrollX, scrollY, innerHeight } = window
            window.scrollTo(scrollX, scrollY - innerHeight * .9)
        });
        // PageDown
        key('.', function() {
            let { scrollX, scrollY, innerHeight } = window
            window.scrollTo(scrollX, scrollY + innerHeight * .9)
        });
    },
    copyCurTitle: function() {
        if (Setting.copyCurTitle) {
            var title = $(App.curFocusElement).find(".title").text()
                .replace(/第?\S+章/, "").trim();

            GM_setClipboard(title, "text");
        }
    },
    scrollToArticle: function(elem) {
        var offsetTop;
        if (typeof elem == "number") {
            offsetTop = elem;
        } else {
            offsetTop = $(elem).offset().top - parseInt($(elem).css("margin-top"), 10);
        }

        if (Setting.scrollAnimate) {
            $("html, body").stop().animate({
                scrollTop: offsetTop
            }, 750, "easeOutExpo");
        } else {
            $("html, body").stop().scrollTop(offsetTop);
        }
    },
    openUrl: function(url, errorMsg) {
        if (url) {
            // ff30 Greasemonkey 会报错：Greasemonkey 访问违规：unsafeWindow 无法调用 GM_openInTab。新建脚本采用按键调用也这样。
            setTimeout(function() {
                GM_openInTab(url, false);
            }, 0);
        } else if (errorMsg) {
            UI.notice(errorMsg);
        }
    },
    pauseHandler: function() {
        App.paused = !App.paused;
        if (App.paused) {
            UI.notice('<b>状态</b>:自动翻页<span style="color:red!important;"><b>暂停</b></span>'.uiTrans());
            App.$loading.html('自动翻页已经<span style="color:red!important;"><b>暂停</b></span>'.uiTrans()).show();
        } else {
            UI.notice('<b>状态</b>:自动翻页<span style="color:red!important;"><b>启用</b></span>'.uiTrans());
            App.scroll();
        }
    },
    scroll: function() {
        if (!App.paused && !App.working && App.getRemain() < Setting.remain_height) {
            App.scrollForce()
        }

        if (App.isTheEnd) {
            App.$loading.html("已到达最后一页...".uiTrans()).show();
        }

        App.updateCurFocusElement();
    },
    scrollForce: function() {
        if (App.tmpDoc) {
            App.loaded(App.tmpDoc);
        } else {
            App.doRequest();
        }
    },
    updateCurFocusElement: function() { // 滚动激活章节列表
        // Get container scroll position
        var fromTop = $(window).scrollTop() + $(window).height() / 2;

        // Get id of current scroll item
        var cur = App.scrollItems.map(function() {
            if ($(this).offset().top < fromTop)
                return this;
        });
        // Get the id of the current element
        App.curFocusIndex = cur.length - 1
        cur = cur[cur.length - 1];
        var id = cur ? cur.id : "";

        if (App.lastId !== id) {
            App.lastId = id;

            var activeItem = App.menuItems.filter("[href=#" + id + "]"),
                activeTitle = activeItem.text(),
                activeUrl = activeItem.attr("realHref");

            // Set/remove active class
            App.menuItems.parent().removeClass("active");
            activeItem.parent().addClass("active");

            App.curFocusElement = cur;
            App.activeUrl = activeUrl;

            if (Setting.addToHistory) {
                var curNum = id.match(/\d+/)[0] - 1;  // 当前是第几个
                var curTitle = App.parsers[curNum].docTitle;
                document.title = curTitle;

                // 有域名的限制，起点过渡到 vip 章节无法生效
                var url = activeUrl.replace('http://read.qidian.com', '');
                try {
                    unsafeWindow.history.pushState(null, curTitle, url);
                } catch (e) {
                    console.error('添加下一页到历史记录失败', e);
                }
            }
        }
    },
    getRemain: function() {
        var scrollHeight = Math.max(document.documentElement.scrollHeight,
            document.body.scrollHeight);
        var remain = scrollHeight - window.innerHeight - window.scrollY;
        return remain;
    },
    doRequest: function() {
        App.working = true;
        var nextUrl = App.requestUrl;
        App.lastRequestUrl = App.requestUrl;

        if (nextUrl && !App.isTheEnd && !(nextUrl in App.parsedPages)) {
            App.parsedPages[nextUrl] = 0;
            App.curPageUrl = App.requestUrl;
            App.requestUrl = null;

            var useiframe = App.site.useiframe;

            App.$loading
                .show()
                .html("")
                .append($("<img>").attr("src", "data:image/gif;base64,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"))
                .append("<a href='" + nextUrl + "' title='点击打开下一页链接'>正在载入下一页".uiTrans() + (useiframe ? "(iframe)" : "") + "...</a>");

            setTimeout(function() {
                if (useiframe) {
                    App.iframeRequest(nextUrl);
                } else {
                    App.httpRequest(nextUrl, App.httpRequestDone);
                }
            }, App.site.nDelay || 0);
        } else {
            // App.$loading.html("<a href='" + App.curPageUrl  + "'>无法使用阅读模式，请手动点击下一页</a>").show();
        }
    },
    httpRequest: function(nextUrl, callback) {
        if (!_.isFunction(callback)) {
            callback = function() {}
        }

        C.log("获取下一页: " + nextUrl);
        App.parsedPages[nextUrl] += 1;

        GM_xmlhttpRequest({
            url: nextUrl,
            method: "GET",
            overrideMimeType: "text/html;charset=" + document.characterSet,
            timeout: config.xhr_time,
            onload: function(res) {
                var doc = parseHTML(res.responseText);
                callback(doc, nextUrl);
            },
            ontimeout: function() {
                callback(null, nextUrl);
            }
        });
    },
    httpRequestDone: function(doc, nextUrl) {
        if (doc) {
            App.beforeLoad(doc);
            return;
        }

        if (App.parsedPages[nextUrl] >= 3) {
            console.error('同一个链接已获取3次', nextUrl)
            App.$loading.html("<a href='" + nextUrl  + "'>无法获取下一页，请手动点击</a>").show();
            return;
        }

        // 无内容再次尝试获取
        console.error('连接超时, 再次获取');
        App.httpRequest(nextUrl, App.httpRequestDone);
    },
    iframeRequest: function(nextUrl) {
        C.log("iframeRequest: " + nextUrl);
        if (!App.iframe) {
            var i = document.createElement('iframe');
            App.iframe = i;
            i.name = 'mynovelreader-iframe';
            i.width = '100%';
            i.height = '0';
            i.frameBorder = "0";
            i.style.cssText = '\
                margin:0!important;\
                padding:0!important;\
                visibility:hidden!important;\
            ';
            i.src = nextUrl;
            i.addEventListener('load', App.iframeLoaded, false);
            App.remove.push(function() {
                i.removeEventListener('load', App.iframeLoaded, false);
            });
            document.body.appendChild(i);
        } else {
            App.iframe.contentDocument.location.replace(nextUrl);
        }
    },
    iframeLoaded: function() {
        var iframe = this;
        var body = iframe.contentDocument.body;

        if (body && body.firstChild) {
            var win = iframe.contentWindow
            var doc = iframe.contentDocument;

            // 滚动最后
            win.scrollTo(0, doc.body.scrollHeight)

            if (App.site.startLaunch) {
                App.site.startLaunch($(doc));
            }

            var mutationSelector = App.site.mutationSelector;
            if (mutationSelector) {
                App.addMutationObserve(doc, function() {
                    App.beforeLoad(doc);
                });
            } else {
                var timeout = App.site.timeout || 0;

                setTimeout(function() {
                    App.beforeLoad(doc);
                }, timeout);
            }
        }
    },
    beforeLoad: function(htmlDoc) {
        if (config.PRELOADER) {
            App.tmpDoc = htmlDoc;
            App.working = false;
            App.scroll();

            // 预读图片
            var existSRC = {};
            $(App.tmpDoc).find('img').each(function() {
                var isrc = $(this).attr('src');
                if (!isrc || existSRC[isrc]) {
                    return;
                } else {
                    existSRC[isrc] = true;
                }
                var img = document.createElement('img');
                img.src = isrc;
            });
        } else {
            App.loaded(htmlDoc);
        }
    },
    loaded: function(doc) {
        var parser = new Parser(App.site, doc, App.curPageUrl);
        parser.getAll(function() {
            App.addNextPage(parser);
        });
        App.tmpDoc = null;
    },
    addNextPage: function(parser) {
        if (parser.content) {
            App.appendPage(parser);

            App.$loading.hide();
            App.requestUrl = parser.nextUrl;
            App.isTheEnd = parser.isTheEnd;

            App.afterLoad();
        } else {
            App.removeListener();

            var msg = (parser.isTheEnd == 'vip') ?
                'vip 章节，需付费。' :
                '错误：没有找到下一页的内容。';
            App.$loading.html(
                '<a href="' + App.curPageUrl + '">' + msg + '点此打开下一页。</a>'.uiTrans())
                .show();
        }

        App.working = false;
    },
    afterLoad: function() {
        App.tmpDoc = null;

        if (config.PRELOADER) {
            setTimeout(function(){
                App.doRequest();
            }, 200);
        }
    },
    fixImageFloats: function(articleContent) {
        if (!config.fixImageFloats) return;

        articleContent = articleContent || document;

        var imageWidthThreshold = Math.min(articleContent.offsetWidth, 800) * 0.55,
            images = articleContent.querySelectorAll('img:not(.blockImage)');

        for (var i = 0, il = images.length; i < il; i += 1) {
            var image = images[i];

            if (image.offsetWidth > imageWidthThreshold) {
                image.className += " blockImage";
            }
        }
    },

    isSaveing: false,
    saveAsTxt: function() {
        if (App.site.useiframe) {
            UI.notice('暂不支持', 3000);
            return;
        }

        if (App.isSaveing) {
            alert('正在保存中，请稍后');
            return;
        }

        App.isSaveing = true;

        downloader(App.parsers, function() {
            App.isSaveing = false;
        });
    }
};

export default App