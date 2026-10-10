function kids(s){return [].slice.call(s.children);}
var MCF={
 'cover':function(s,h){if(h.mv){mo(h.mv,50);h.mv._o={fit:'resize',min:440,max:980};}},
 'men-haqimda':function(s,h){kids(s).forEach(function(el){var d=el._d||{};if(el.matches('[data-b="scale"]'))el.classList.add('m-keep');if(d.h===220)el.classList.add('m-stat');});},
 'ai-nima':function(s,h){if(h.mv)h.mv._o={fit:'resize',min:360};},
 'tugiladi':function(s,h){if(h.mv)h.mv._o={fit:'resize',min:250};},
 'charchamaydi':function(s,h){if(h.mv)mo(h.mv,moOf(h.head)+5);},
 'qirq-foiz':function(s,h){if(h.mv)h.mv._o={fit:'resize',ar:.66,min:400};},
 'ish-orinlari':function(s,h){if(h.mv){mo(h.mv,moOf(h.head)+5);h.mv._o={lw:1000,lh:390};}},
 'kasblar':function(s,h){var o=h.t('O‘SADI');kids(s).forEach(function(el){if(el.matches('[data-b="left"],[data-b="right"]'))el.classList.add('m-list');});if(h.mv&&o){mo(h.mv,moOf(o)-5);h.mv._o={fit:'resize',ar:.26,min:130,max:190};}},
 'yangi-kasblar':function(s,h){if(h.mv){mo(h.mv,moOf(h.head)+5);h.mv._o={fit:'resize',ar:.33,min:200,max:220};[h.t('ish beruvchilar'),h.t('asosiy ko')].forEach(function(e,i){if(e){e.classList.add('m-half','m-ring');mo(e,moOf(h.head)+6+i);}});}},
 'mk-cover':function(s,h){var ag=h.t('KUN TARTIBI');if(ag){mo(ag,900);ag.classList.add('m-agenda');}},
 'mk-amaliyot':function(s,h){kids(s).forEach(function(el){var d=el._d||{};if(d.w===40&&d.h===40)el.classList.add('m-hide');if(d.h===240)el.classList.add('m-step');if(d.h===300)el.classList.add('m-box');});},
 'prompt':function(s,h){if(h.mv)h.mv._o={vmin:.45};},
 'yakun':function(s,h){if(h.mv){mo(h.mv,50);h.mv._o={fit:'resize',min:360,max:760};}}
};
