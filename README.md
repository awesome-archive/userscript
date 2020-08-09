GM 脚本
========

- [个人主页 - github][ywzhaiqi_github]
- [个人主页 - greasyfork.org][ywzhaiqi_greasyfork]
- [个人主页 - userscripts.org][ywzhaiqi_userscripts]

**注意：**
- 部分脚本可能并不通用。
- 新脚本采用 webpack + js 或 typescript 开发，可能引入了 react 全家桶。

脚本一览（原创或修改版）
---------------

### 文件夹

- [MyNovelReader](scripts/MyNovelReader.user.js)：小说阅读脚本
  - 从 6.0.0（2017-8-23）开始，改成 `import` 构建（可能旧浏览器不支持，待解决）。Opera 12 及旧版本浏览器用户暂时先用以前的版本。
  - 旧版本 [My Novel Reader 5.6.9](https://greasyfork.org/zh-CN/scripts/292-my-novel-reader?version=213022)
  - 支持起点 vip 阅读，如果无效，可能需要在 `Tampermonkey` 中设置 `@connect 模式:` 为 `宽松` 模式。
- ~~[BaiduPanDownloadHelper](scripts/BaiduPanDownloadHelper)：批量导出百度盘的下载链接。~~
- ~~[BaiduSearchNoJump](scripts/BaiduSearchNoJump)：百度搜索反跳转（修改版）。~~
- [Mouseover Popup Image Viewer](scripts/Mouseover Popup Image Viewer)：在图片上鼠标悬停放大，这里是一些自写的规则。
- [NextPage](scripts/NextPage)：Next Page By Sunwan 修改增强版。
- ~~[Readability 中文增强版](scripts/Readability 中文增强版)：已弃用。~~
- [Super_preloaderPlus](scripts/Super_preloaderPlus)：Super_preloader 修正增强版。
- ~~[verycdShowLink](scripts/verycdShowLink)：verycd页面无需登入也能显示 ed2k 链接。~~
- [威锋电子书批量下载](scripts/威锋电子书批量下载)：批量导出 [iPad 电子书资源分享区 - 威锋论坛][] 附件的下载地址。
- [.修改版](.修改版)
	- [Blacklist_Blocker_Rule.user.js](.修改版/Blacklist_Blocker_Rule.user.js)，原作者写的只支持 Firefox。
	- [Google Images direct link.user.js](.修改版/Google Images direct link.user.js)
	- [Manga_OnlineViewer_CE.user.js](.修改版/Manga_OnlineViewer_CE.user.js)
	- [PanLinkCheck.user.js](.修改版/PanLinkCheck.user.js)
	- [TiebaNojump.user.js](.修改版/TiebaNojump.user.js)
	- [TxtReader.user.js](.修改版/TxtReader.user.js)
	- [Video_wipe_ADs.user.js](.修改版/Video_wipe_ADs.user.js)
	- [doubanIMDb.user.js](.修改版/doubanIMDb.user.js)
	- [quick-view-douban 修正版.user.js](.修改版/quick-view-douban 修正版.user.js)

### 单文件

- [booklinkme.user.js](scripts/booklinkme.user.js)：增强 [BookLink.Me:小说搜索引擎][]，一键打开所有未读链接
- ~~[ceilme.user.js](scripts/ceilme.user.js)，已失效：[ceil.me 杂志下载网站][] 直接下载，避免多次点击~~
- [DoubanDownloadSearch.user.js](scripts/DoubanDownloadSearch.user.js)：增加豆瓣图书、电影的搜索链接。
- [itpubnet.user.js](scripts/itpubnet.user.js)：ITPUB论坛（电子图书与IT文档资料）免登入下载
- [noNoticetitleflashOnBBS.user.js](scripts/noNoticetitleflashOnBBS.user.js)：卡饭、若人、游侠等论坛去除标题闪烁提醒，其它论坛需自己添加。
- [shooter.user.js](scripts/shooter.user.js)：在 shooter.cn 搜索页面按下载按钮直接下载。语言、发行着色。[shooter.cn 直接下载 - greasyfork.org][0]
- [userscripts.user.js](scripts/userscripts.user.js)：在 userscripts、greasyfork、userscripts-mirror 脚本页面只显示中文脚本，支持 AutoPager 和其它翻页脚本。
- ~~[smzdm.user.js](scripts/smzdm.user.js)，已失效~~
- [youku_调整显示列数.user.js](scripts/youku_调整显示列数.user.js)：把优酷从2列改成3列，适用于个人显示器。

## 开发

详见 [dev.md](doc/dev.md)


一些脚本的链接
-------------

### 按类别分类

- Google
    - [stopGoogleRedirection][1]，全局包含这点很不爽，需要手动修改下。
    - [replace goog tracking url][2]
    - [Google site: Tool (Site results / Exclude sites)][3]：并不支持 google.com 和 google.com.hk
    - 更多搜索：['google' user scripts on Greasy Fork][4]
- 百度
    - 百度搜索
        - [BaiduMonkeyW][5]
        - [百度搜索反跳转][6]
    - 百度贴吧
        - [Tieba Preload][7]
        - [tiebaAllsign][8]
        - [Tieba Advanced][9]
        - [Tieba_Markdown][10]：为百度贴吧添加Markdown支持。
        - 更多搜索：['tieba' user scripts on Greasy Fork][11]
    - 百度网盘
        - [BaiduPanDownloadHelper][12]
        - [百度网盘助手][13]
        - [网盘工具箱][14]
        - [百度网盘导出工具][15]，导出 Aria2rpc, Aria2, Wget, IDM 。不支持 Scriptish，Greasemonkey 导出不会弹出对话框（2014-4-24）
        - [DUChan_Assistant][16]，Yet another ThunderAssistant copy apply to Baidupan。
        - [仓库用度盘投稿助手][17]
    - 更多搜索：['baidu' user scripts on Greasy Fork][18]
- 咨询新闻类
    - [InoReader Full Feed][19]
    - [Feedly Full Feed][20]
- 图片类
    - [nolazyload][21]
    - [Mouseover Popup Image Viewer][22]
    - [MiniblogImgPop - 微博浮图][23]
    - [新浪微博之我要看大图 Weibo Larger Pics][24]
- 下载辅助类
    - **[ThunderLixianExporter][25]**
    - [XuanFengEx][26]，QQ旋风网页版离线下载增强，[github.org][27]。
    - [LiuLang/monkey-videos][28]，常用视频网站的油㺅脚本，解析得到视频地址。
    - [Chrome 扩展下载助手][29]：[greasyfork 地址][30]
- 漫画
    - [Manga OnlineViewer][31]
    - [Manga Loader][32]
    - 更多搜索：['manga' user scripts on Greasy Fork][33]
- [眼不见心不烦（新浪微博）][34]
- [Yet Another Weibo Filter][35]
- [Xiami Scrobbler(GM)][36]
- 后台优酷视频自动暂停 - 加强版

### 按作者分类

- [文科 profile][37]：里面有一些人的主页。
- 七星庐
    - [博客主页][38]，[userscripts 主页][39]，[greasyfork 主页][40]，[github 主页][41]
    - [七星庐 - 基于黑名单的内容屏蔽脚本][42]
    - [Netease Music Download][43]，可能需要的修正 [失效？][44]
- [NLF][45]
    - [search_engineJump][46]
    - [picViewer][47]，围观图。
    - [flashViewer][48]
    - [YoukuSS][49]
    - [Super_preloader][50]，[Super_preloader.db][51]
- [binux][52] / [ThunderLixianExporter][53]
- yulei
    - [userscripts 主页][54]
    - [Share easy downloads helper][55]
    - [Crack Url Wait Code Login][56]
    - [Music liker for Beauty][57]
    - [True URL downloads 2(Ⅱ)][58]
- JixunMoe
    - [greasyfork 主页][59]，[userscripts 主页][60]，[github 主页][61]
    - [Bypass Wait, Code, & Login For GM 2 (Beta)][62]
    - [Bypass Wait, Code, & Login For Chrome][63]：以前名叫 [Crack Url Wait Code Login For Chrome][64]，有删节。
    - [Userscripts.org 风险脚本过滤器][65]
    - [网盘自动填写提取密码][66]
    - [网盘死链检查][67]
    - [仓库用度盘投稿助手][68]
    - [贴吧免跳转链][69]
    - [Simple 163 Music Dl Helper][70]
- 有一份田 (youyifentian)
    - [git.oschina.net][71]，[userscripts.org][72]，[greasyfork.org][73]
    - [百度网盘助手][74]
    - [百度音乐助手][75]：[git.oschina.net][76]，[直接打开地址][77]
    - [虾米音乐助手][78]
- lkytal
    - [greasyfork 主页][79]
    - [Popup Search][80]：选中文字翻译或搜索
    - [Text To link][81]：把文字链接转换为可点击链接。
    - [Google Image Search Context Menu][82]
- Gerald（寂寞的原子）：暴力猴作者，贴吧相关的脚本
    - [greasyfork 主页][83]，[个人主页][84]，[github 主页][85]
- 网络孤独行客
    - [linusyu/userScripts][86]
- trespassersW
    - [greasyfork 主页][87]
    - [google cache comeback][88]
    - [userstyles.org css highlighter][89]
    - [uso-mirror][90]
- [langren1353/GM_script: 我就是来分享脚本玩玩的](https://github.com/langren1353/GM_script)
- [iMyon/gm_scripts][91]
- [CL1024 - 草榴社区][92]，[greasyfork.org][93]
- [cnbeta-comments][94]
- [Douban Book Shopping Helper][95]，为各大购书网站的界面添加豆瓣评分与链接，并提供价格对比 。
- [doubanIMDb][96]，在豆瓣电影的页面显示IMDb评分, 烂番茄指数。**2014-7-29，dirtyacc 修正烂番茄 ApiKey**
- [tiebaAllsign][97]
- [YouTube Center ][98]，[greasyfork.org][99]
- [yyets.com get douban ][100]， 在 yyets.com 影视详情页面显示该电影的豆瓣搜索结果，看评分。如果登录了豆瓣可以看到自己是否“看过”。
- [豆藤 Bean vine ][101]，需要自己修改下 @include。
- [legnaleurc/nopicads][102]

### 其它

- 计算输入了多少字 http://gavinsharp.com/scripts/TextAreaCharCount.user.js


[ywzhaiqi_github]: https://github.com/ywzhaiqi/userscript
[ywzhaiqi_greasyfork]: https://greasyfork.org/users/145-ywzhaiqi
[ywzhaiqi_userscripts]: http://userscripts.org/users/138842/scripts
[Manga_OnlineViewer_CE.user.js]: https://github.com/ywzhaiqi/userscript/blob/master/.%E4%BF%AE%E6%94%B9%E7%89%88/Manga_OnlineViewer_CE.user.js

[BookLink.Me:小说搜索引擎]: http://booklink.me/
[iPad 电子书资源分享区 - 威锋论坛]: http://bbs.feng.com/thread-htm-fid-224.html
[ceil.me 杂志下载网站]: http://www.ceil.me/

[0]: https://greasyfork.org/scripts/304
[1]: http://userscripts.org/scripts/show/186798
[2]: https://greasyfork.org/scripts/2283-replace-goog-tracking-url
[3]: https://greasyfork.org/scripts/1679-google-site-tool-site-results-exclude-sites
[4]: https://greasyfork.org/scripts/search?q=google
[5]: http://userscripts.org/scripts/show/131861
[6]: http://userscripts.org/scripts/show/161812
[7]: http://userscripts.org/scripts/show/423917
[8]: http://userscripts.org/scripts/show/141939
[9]: http://userscripts.org/scripts/show/152918
[10]: https://greasyfork.org/scripts/1921-tieba-markdown
[11]: https://greasyfork.org/scripts/search?q=tieba
[12]: http://userscripts.org/scripts/show/162138
[13]: https://greasyfork.org/scripts/986-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B
[14]: http://userscripts.org/scripts/show/159911
[15]: http://userscripts.org/scripts/show/178301
[16]: http://userscripts.org/scripts/show/141767
[17]: https://greasyfork.org/scripts/3285-%E4%BB%93%E5%BA%93%E7%94%A8%E5%BA%A6%E7%9B%98%E6%8A%95%E7%A8%BF%E5%8A%A9%E6%89%8B
[18]: https://greasyfork.org/scripts/search?q=baidu
[19]: https://greasyfork.org/scripts/897-inoreader-full-feed
[20]: https://greasyfork.org/scripts/896-feedly-full-feed
[21]: http://userscripts.org/scripts/show/151249
[22]: http://userscripts.org/scripts/show/109262
[23]: http://userscripts.org/scripts/show/83994
[24]: http://userscripts.org/scripts/show/173273
[25]: http://binux.github.io/ThunderLixianExporter/
[26]: https://greasyfork.org/scripts/354-xuanfengex
[27]: https://github.com/rhyzx/xuanfeng-userscript
[28]: https://github.com/LiuLang/monkey-videos
[29]: http://userscripts.org/scripts/show/156472
[30]: https://greasyfork.org/scripts/778-chrome%E6%89%A9%E5%B1%95%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B
[31]: https://greasyfork.org/scripts/1319-manga-onlineviewer
[32]: https://greasyfork.org/scripts/692-manga-loader
[33]: https://greasyfork.org/scripts/search?q=manga
[34]: https://greasyfork.org/scripts/1708-%E7%9C%BC%E4%B8%8D%E8%A7%81%E5%BF%83%E4%B8%8D%E7%83%A6-%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A/
[35]: https://greasyfork.org/scripts/3249-yet-another-weibo-filter
[36]: https://greasyfork.org/scripts/2626-xiami-scrobbler-gm
[37]: https://greasyfork.org/users/54-%E6%96%87%E7%A7%91
[38]: http://qixinglu.com/
[39]: http://userscripts.org/users/78308/scripts
[40]: https://greasyfork.org/users/1359-muzuiget
[41]: https://github.com/muzuiget/greasemonkey-scripts
[42]: http://qixinglu.com/post/blacklist_blocker_greasemonkey_script.html
[43]: https://greasyfork.org/scripts/1099-netease-music-download
[44]: https://greasyfork.org/forum/discussion/531/%E5%A4%B1%E6%95%88#latest
[45]: http://userscripts.org/users/202260/scripts
[46]: http://userscripts.org/scripts/show/84970
[47]: http://userscripts.org/scripts/show/105741
[48]: http://userscripts.org/scripts/show/187351
[49]: http://userscripts.org/scripts/show/84972
[50]: http://userscripts.org/scripts/show/84937
[51]: http://userscripts.org/scripts/show/93080
[52]: https://github.com/binux
[53]: https://github.com/binux/ThunderLixianExporter
[54]: http://userscripts.org/users/494707/scripts
[55]: http://userscripts.org/scripts/show/155175
[56]: http://userscripts.org/scripts/show/153190
[57]: http://userscripts.org/scripts/show/161719
[58]: http://userscripts.org/scripts/show/157556
[59]: https://greasyfork.org/users/44-jixunmoe
[60]: http://userscripts.org/users/474953/scripts
[61]: https://github.com/JixunMoe
[62]: https://greasyfork.org/scripts/2600-bypass-wait-code-login-for-gm-2-beta
[63]: https://greasyfork.org/scripts/125-bypass-wait-code-login-for-chrome
[64]: http://userscripts.org/scripts/show/157621
[65]: http://userscripts.org/scripts/show/164600
[66]: https://greasyfork.org/scripts/1002-%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%8F%90%E5%8F%96%E5%AF%86%E7%A0%81
[67]: https://greasyfork.org/scripts/1262-%E7%BD%91%E7%9B%98%E6%AD%BB%E9%93%BE%E6%A3%80%E6%9F%A5
[68]: https://greasyfork.org/scripts/3285-%E4%BB%93%E5%BA%93%E7%94%A8%E5%BA%A6%E7%9B%98%E6%8A%95%E7%A8%BF%E5%8A%A9%E6%89%8B
[69]: https://greasyfork.org/scripts/126-%E8%B4%B4%E5%90%A7%E5%85%8D%E8%B7%B3%E8%BD%AC%E9%93%BE
[70]: https://greasyfork.org/scripts/2733-simple-163-music-dl-helper
[71]: http://git.oschina.net/youyifentian
[72]: http://userscripts.org/users/528225/scripts
[73]: https://greasyfork.org/users/297-%E6%9C%89%E4%B8%80%E4%BB%BD%E7%94%B0
[74]: https://greasyfork.org/scripts/986-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%8A%A9%E6%89%8B
[75]: https://greasyfork.org/scripts/483-%E7%99%BE%E5%BA%A6%E9%9F%B3%E4%B9%90%E5%8A%A9%E6%89%8B
[76]: http://git.oschina.net/youyifentian/script_baidumusic
[77]: http://git.oschina.net/youyifentian/script_baidumusic/raw/master/baidumusicscript.js
[78]: https://greasyfork.org/scripts/987-%E8%99%BE%E7%B1%B3%E9%9F%B3%E4%B9%90%E5%8A%A9%E6%89%8B
[79]: https://greasyfork.org/users/152-lkytal
[80]: https://greasyfork.org/scripts/340-popup-search
[81]: https://greasyfork.org/scripts/342-text-to-link
[82]: https://greasyfork.org/scripts/344-google-image-search-context-menu
[83]: https://greasyfork.org/users/48-gerald
[84]: http://geraldl.ml/
[85]: https://github.com/gera2ld
[86]: https://github.com/linusyu/userScripts
[87]: https://greasyfork.org/users/5-trespassersw
[88]: https://greasyfork.org/scripts/725-google-cache-comeback
[89]: https://greasyfork.org/scripts/41-userstyles-org-css-highlighter
[90]: https://greasyfork.org/scripts/2222-uso-mirror
[91]: https://github.com/iMyon/gm_scripts
[92]: http://userscripts.org/scripts/show/151695
[93]: https://greasyfork.org/scripts/1983-cl1024
[94]: http://userscripts.org/scripts/show/152818
[95]: http://userscripts.org/scripts/show/172327
[96]: http://userscripts.org/scripts/show/103552
[97]: https://greasyfork.org/scripts/152-tiebaallsign
[98]: http://userscripts.org/scripts/show/114002
[99]: https://greasyfork.org/scripts/943-youtube-center
[100]: http://userscripts.org/scripts/show/131503
[101]: http://userscripts.org/scripts/show/49911
[102]: https://github.com/legnaleurc/nopicads
