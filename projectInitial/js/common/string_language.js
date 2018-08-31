/*
 
 zhiyiwei;
 2017-10-16 15:09:04;
 此js主要用于项目中 字符串中 语言国际化;
 
 * 
 * */

//社交中的提及实体时间线 语音
var sm_entity_time_line = {
	language_zh: {
		"更多": "更多",
		"人物": "<i class ='fa fa-user' title ='人物'></i>",
		"地点": "<i class ='fa fa-map-marker' title ='地点'></i>",
		"组织": "<i class ='fa fa-sitemap' title ='组织'></i>"
	},
	language_pt: {
		"更多": "Mais",
		"人物": "<i class ='fa fa-user' title = 'Pessoas'></i>",
		"地点": "<i class ='fa fa-map-marker' title = 'Localização' ></i>",
		"组织": "<i class ='fa fa-sitemap' title = 'Organização' ></i>"
	},
	language_en: {
		"更多": "more",
		"人物": "<i class ='fa fa-user'title = 'People'></i>",
		"地点": "<i class ='fa fa-map-marker'title = 'Location'></i>",
		"组织": "<i class ='fa fa-sitemap' title='Organization'></i>"
	}

}


//网民情感波动
var netizens_sentiment_analysis_str = {
	flags_zh:["正面", "负面", "中立"],
	flags_pt:["positivo", "negativo", "neutro"],
	flags_en:["Positive", "Negative", "Neutrual"]
}



//noData
var $noData = "<img style='display:block;margin:0px auto 50px auto;' src='/img/my/bt-nodata-now.png' />"
