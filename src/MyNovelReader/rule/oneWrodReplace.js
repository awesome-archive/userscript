// import _ from 'underscore'

// 单字替换，可能会误替换，所以需要特殊处理
var oneWordReplace = {
  "b[āà]ng":"棒","bào":"爆","bà":"吧","bī":"逼","bō":"波", "biàn":"便",
  "cāo":"操", "cǎo":"草", "cào":"操", "chāng":"娼", "chang":"娼", "cháo":"潮", "chā":"插", "chéng":"成", "chōu":"抽", "chuáng":"床", "chún":"唇", "chūn":"春", "cuō":"搓", "cū":"粗",
  "dǎng":"党", "dàng":"荡", "dāo":"刀", "dòng":"洞", "diao":"屌", "diǎn":"点",
  "fǎ":"法", "féi":"肥", "fù":"妇",
  "guān":"官",
  "hán":"含", "hóu":"喉", "hòu":"后", "h(u)?ā":"花", "huá":"华", "huì":"会", "huò":"惑", "hùn":"混", "hún":"魂",
  "jiǔ":"九", "j[īi]ng":"精", "jìn":"禁", "jǐng":"警", "jiāng":"江", "jiān":"奸", "jiāo":"交", "jūn":"军", "jū":"拘", "jú":"局", "jī":"激", "激ān":"奸",
  "kù":"裤", "kàn":"看",
  "[1l]àng":"浪", "liáo":"撩", "liú":"流", "lì":"莉", "liè":"烈", "[1l]uàn":"乱", "lún":"伦", "luǒ":"裸", "lòu":"露", "[l1]ù":"露", "lǜ":"绿", "liàn":"练",
  "mǎi":"买", "mài":"卖", "máo":"毛", "mā":"妈", "méng":"蒙", "mén":"门", "miè":"灭", "mí":"迷", "mì":"蜜", "mō":"摸", "miàn":"面",
  "nǎi":"奶", "nèn":"嫩", "niào":"尿", "niē":"捏", "nòng":"弄", "nǚ":"女",
  "pào":"炮", "piàn":"片", "pò":"破",
  "qi[āa]ng":"枪", "qíng":"情", "qīn":"亲", "qiú":"求", "quán":"全", "qù":"去",
  "rén":"人", "r[ìi]":"日", "rǔ":"乳",

  // s
  "sǎ":"洒", "sāo":"骚", "sǎo":"骚", "sè":"色", "se":"色", "shā":"杀",
  "shēn":"身", "shēn":"呻",   // 2个重复的，误替换且是单字怎么办
  "shén":"神", "shè":"射", "shǐ":"屎", "shì":"侍", "sǐ":"死", "sī":"私", "shǔn":"吮", "sǔn":"吮", "sū":"酥", "shào":"绍",

  "tān":"贪", "tiǎn":"舔", "t[ǐi]ng":"挺", "tǐ":"体", "tǒng":"捅", "tōu":"偷", "tou":"偷", "tuǐ":"腿", "tūn":"吞", "tún":"臀", "tiáo":"调", "tài":"态", "tào":"套",
  "wēn":"温", "wěn":"吻",
  "xiǎo":"小", "xiào":"笑", "xìng":"性", "xing":"性", "xiōng":"胸", "xī":"吸", "xí":"习", "xì":"系", "xìn":"信", "xué":"穴", "xuè":"穴", "xùe":"穴",  "xuan":"宣", "xiàng":"象",
  "yāng":"央", "yàn":"艳", "yīn":"阴", "yào":"药", "yé":"爷", "yòu":"诱", "zàng":"脏", "y[ùu]":"欲", "yín":"淫", "yì":"意", "yà":"讶",
  "zhēn":"针", "zēn":"针", "zhà":"炸", "zhèng":"政", "zǒu":"走", "zuì":"罪", "zuò":"做", "zhōng":"中",
};

var replaceFix = {
  // ===误替换还原===
  "碧欲":"碧玉", "美欲":"美玉","欲石":"玉石","惜欲":"惜玉","宝欲":"宝玉",
  "品性":"品行", "德性":"德行",
  "波ok":"book", "波SS":"BOSS",

  // ===其他修正===
  "弥俩":"你俩",
  "妳":"你",
  // "圞|垩|卝|龘":"",
  "大6":"大陆",
};

export function extendRule(replaceRule) {
  _.each(oneWordReplace, function(value, key) {
    // 这个替换会把 yùn 替换为 yù
    // replace['\\b' + key + '(?:\\b|\\s*)'] = value;

    // 这个不会替换 rén： shā rén偿命 => 杀 rén偿命
    // replaceRule['([^a-z\\s])' + key + '(?![a-z])'] = '$1' + value;

    replaceRule['\\b' + key + '(?![a-z])'] = value;
  });

  _.extend(replaceRule, replaceFix);
}


function test() {
  let text = '好事者称之为“shā rén偿命，欠债还钱”'
  let rule = {}
  extendRule(rule)
  for (let key in rule) {
    text = text.replace(new RegExp(key, 'ig'), rule[key])
  }

  console.log('replace test', text)
}
// test()