var daterangepicker_separator = ' 至 ';
if (getCookie("userLanguage")) {
    if (getCookie("userLanguage") == 'en-US') {
    	daterangepicker_separator = ' to '
    }else if(getCookie("userLanguage") == 'pt-PT'){
    	daterangepicker_separator = ' a '
    }
}
var daterangepicker_option = {
	startDate: moment().subtract(1, 'days'),
	endDate: moment(),
	minDate: moment().subtract(6, 'year'),
	timePicker: false,
	timePickerIncrement: 1,
	timePicker12Hour: false,
	ranges: {
//		'不限': [''],
		'Today': [moment(), moment()],
//		'昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		'Last 7 Days': [moment().subtract(7, 'days'), moment()],
		'Last 30 Days': [moment().subtract(1, 'months'), moment()],
		'Last 3 Months': [moment().subtract(3, 'months'), moment()],
	},
	opens: 'right',
	buttonClasses: ['btn btn-default'],
	applyClass: 'btn-small btn-primary',
	cancelClass: 'btn-small',
	separator : daterangepicker_separator,
	locale: {
		format: 'YYYY-MM-DD',
		applyLabel: 'Confirm',
		cancelLabel: 'Close',
		fromLabel: 'From',
		toLabel: 'To',
		customRangeLabel: 'Custom Range',
		daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augt', 'Sep', 'Oct', 'Nov', 'Dec'],
		firstDay: 1
	}
}
var daterangepicker_option_left = function () {
	$('#time_1').prop("readonly","readonly").css({'background':'#fcfcfc',cursor: 'pointer'})
	var obj = {
		startDate: moment().subtract(1, 'days'),
		endDate: moment(),
		minDate: moment().subtract(6, 'year'),
		timePicker: false,
		timePickerIncrement: 1,
		timePicker12Hour: false,
		ranges: {
	//		'不限': [''],
			'Today': [moment(), moment()],
	//		'昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Last 7 Days': [moment().subtract(7, 'days'), moment()],
			'Last 30 Days': [moment().subtract(1, 'months'), moment()],
			'Last 3 Months': [moment().subtract(3, 'months'), moment()],
		},
		opens: 'left',
		buttonClasses: ['btn btn-default'],
		applyClass: 'btn-small btn-primary',
		cancelClass: 'btn-small',
		separator : daterangepicker_separator,
		locale: {
			format: 'YYYY-MM-DD',
			applyLabel: 'Confirm',
			cancelLabel: 'Close',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom Range',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augt', 'Sep', 'Oct', 'Nov', 'Dec'],
			firstDay: 1
		}
	}
	return obj;
}

var daterangepicker_minute = function (s_times,e_times) {
	$('#time_2').prop("readonly","readonly").css({'background':'#fcfcfc',cursor: 'pointer'})
	var obj = {
        startDate: s_times,
        endDate: moment(),
        minDate: s_times,
        maxDate: e_times,
		timePickerIncrement: 1,
		 "timePicker": true,
	    "timePicker12Hour": false,
		timePickerSeconds:true,
		ranges: {
			'Today': [moment().format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
			'Last 7 Days': [moment().subtract(7, 'days'), moment()],
			'Last 30 Days': [moment().subtract(1, 'months'), moment()],
			'Last 3 Months': [moment().subtract(3, 'months'), moment()],
		},
		"alwaysShowCalendars": true,
		opens:'right',
		buttonClasses: ['btn btn-default'],
		applyClass: 'btn-small btn-primary',
		cancelClass: 'btn-small',	
		separator : daterangepicker_separator,
		"format": "YYYY-MM-DD HH:mm:ss",
		locale: {
			"format": "YYYY-MM-DD HH:mm:ss",
			applyLabel: 'Confirm',
			cancelLabel: 'Close',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom Range',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augt', 'Sep', 'Oct', 'Nov', 'Dec'],
			firstDay: 1
		}
	}
	return obj;
}
var daterangepicker_minute_max = function (s_times,e_times) {
	$('#time_2').prop("readonly","readonly").css({'background':'#fcfcfc',cursor: 'pointer'})
	var obj = {
		startDate: moment().format("YYYY-MM-DD 00:00:00"),
		endDate: moment().format("YYYY-MM-DD 23:59:59"),
		minDate: s_times,
		//maxDate: e_times,
		timePickerIncrement: 1,
		"timePicker": true,
		"timePicker12Hour": false,
		timePickerSeconds:true,
		ranges: {
			'Today': [moment().format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
			'Last 7 Days': [moment().subtract(7, 'days').format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
			'Last 30 Days': [moment().subtract(1, 'months').format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
			'Last 3 Months': [moment().subtract(3, 'months').format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
		},
		"alwaysShowCalendars": true,
		opens:'right',
		buttonClasses: ['btn btn-default'],
		applyClass: 'btn-small btn-primary',
		cancelClass: 'btn-small',	
		separator : daterangepicker_separator,
		"format": "YYYY-MM-DD HH:mm:ss",
		locale: {
			"format": "YYYY-MM-DD HH:mm:ss",
			applyLabel: 'Confirm',
			cancelLabel: 'Close',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom Range',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augt', 'Sep', 'Oct', 'Nov', 'Dec'],
			firstDay: 1
		}
	}
	return obj;
}


var daterangepicker_minute_minDate = function () {
	$('#time_2').prop("readonly","readonly").css({'background':'#fcfcfc',cursor: 'pointer'})
	var obj = {
		startDate: moment(),
		endDate: moment(),
		minDate: moment(),
		timePickerIncrement: 1,
		 "timePicker": true,
	    "timePicker12Hour": false,
		timePickerSeconds:true,
		ranges: {
			'Today': [moment().format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
			'Last 7 Days': [moment().subtract(7, 'days'), moment()],
			'Last 30 Days': [moment().subtract(1, 'months'), moment()],
			'Last 3 Months': [moment().subtract(3, 'months'), moment()],
		},
		"alwaysShowCalendars": true,
		opens:'right',
		buttonClasses: ['btn btn-default'],
		applyClass: 'btn-small btn-primary',
		cancelClass: 'btn-small',	
		separator : daterangepicker_separator,
		"format": "YYYY-MM-DD HH:mm:ss",
		locale: {
			"format": "YYYY-MM-DD HH:mm:ss",
			applyLabel: 'Confirm',
			cancelLabel: 'Close',
			fromLabel: 'From',
			toLabel: 'To',
			customRangeLabel: 'Custom Range',
			daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augt', 'Sep', 'Oct', 'Nov', 'Dec'],
			firstDay: 1
		}
	}
	return obj;
}

var daterangepicker_minute_left = {
	startDate: moment().subtract(1, 'days'),
	endDate: moment(),
	minDate: moment().subtract(6, 'year'),
	timePickerIncrement: 1,
	 "timePicker": true,
    "timePicker12Hour": false,
	timePickerSeconds:true,
	ranges: {
//		'不限': [''],
		'Today': [moment().format("YYYY-MM-DD 00:00:00"), moment().format("YYYY-MM-DD 23:59:59")],
//		'昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		'Last 7 Days': [moment().subtract(7, 'days'), moment()],
		'Last 30 Days': [moment().subtract(1, 'months'), moment()],
		'Last 3 Months': [moment().subtract(3, 'months'), moment()],
	},
	"alwaysShowCalendars": true,
	opens:'left',
	buttonClasses: ['btn btn-default'],
	applyClass: 'btn-small btn-primary',
	cancelClass: 'btn-small',	
	separator : daterangepicker_separator,
	"format": "YYYY-MM-DD HH:mm:ss",
	locale: {
		"format": "YYYY-MM-DD HH:mm:ss",
		applyLabel: 'Confirm',
		cancelLabel: 'Close',
		fromLabel: 'From',
		toLabel: 'To',
		customRangeLabel: 'Custom Range',
		daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
		monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Augt', 'Sep', 'Oct', 'Nov', 'Dec'],
		firstDay: 1
	}
}

function init30Days(){
	var start_ = moment().subtract(1, 'months');
	var end_ = moment();
	return start_.format('YYYY-MM-DD HH:mm:ss')+daterangepicker_separator+end_.format('YYYY-MM-DD HH:mm:ss')
}

function init7Days(){
	var start_ = moment().subtract(7, 'days');
	var end_ = moment();
	return start_.format('YYYY-MM-DD HH:mm:ss')+daterangepicker_separator+end_.format('YYYY-MM-DD HH:mm:ss')
}


var daterangepicker_callback = function(start, end, label) {
					if (label == 'Unlimited') {
						$('#adopt_time_adopt_8 span').html('');
					} else {
						if (label == 'Custom Range' && stime != etime) {
							$(".one_day_search").hide();
						} else {
							$(".one_day_search").show();
						}
						$('#adopt_time_adopt_8 span').html(start.format('YYYY-MM-DD') + '至' + end.format('YYYY-MM-DD'));
					}
				}