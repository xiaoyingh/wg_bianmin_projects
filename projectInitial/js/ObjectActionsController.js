
!function ($) {

	"use strict"; // jshint ;_;

	var ObjectActions = function (element, options) {
		this.init(element, options);
	};

	ObjectActions.prototype = {

		constructor: ObjectActions,

		init: function (element, options) {
			this.$element = $(element);
			this.options = options;
			this.beforeOnClick = $.extend({}, typeof options.onBeforeClick === 'object' && options.onBeforeClick);
			this.onClick = {};
			this.onClick['story-fetch'] = $ObjectActionsController.fetchStory;
			this.onClick['story-hold'] = $ObjectActionsController.holdStory;
			this.onClick['story-edit'] = $ObjectActionsController.editStory;
			this.onClick['story-deliver'] = $ObjectActionsController.deliverStory;
			this.onClick['story-submit'] = $ObjectActionsController.submitStory;
			this.onClick['story-submit-undo'] = $ObjectActionsController.undoSubmitStory;
			this.onClick['story-assign'] = $ObjectActionsController.assignStory;
			this.onClick['story-collate'] = $ObjectActionsController.collateStory;
			this.onClick['story-ratify'] = $ObjectActionsController.ratifyStory;
			this.onClick['story-prepublish'] = $ObjectActionsController.prepublishStory;
			this.onClick['story-prepublish-pass'] = $ObjectActionsController.passPrepublishStory;
			this.onClick['story-prepublish-deny'] = $ObjectActionsController.denyPrepublishStory;
			this.onClick['story-prepublish-undo'] = $ObjectActionsController.undoPrepublishStory;
			this.onClick['story-republish'] = $ObjectActionsController.republishStory;
			this.onClick['story-checkin'] = $ObjectActionsController.checkinStory;
			this.onClick['story-checkin-undo'] = $ObjectActionsController.undoCheckinStory;
			this.onClick['story-retract'] = $ObjectActionsController.retractStory;
			this.onClick['story-delete'] = $ObjectActionsController.deleteStory;
			this.onClick['story-restore'] = $ObjectActionsController.restoreStory
			this.onClick['planning-delete'] = $ObjectActionsController.deletePlanning;
			this.onClick['planning-deliver'] = $ObjectActionsController.deliverPlanning;
			this.onClick['planning-destroy'] = $ObjectActionsController.destroyPlanning;
			this.onClick['planning-edit'] = $ObjectActionsController.editPlanning;
			this.onClick['planning-submit'] = $ObjectActionsController.submitPlanning;
			this.onClick['story-destroy'] = $ObjectActionsController.destroyStory;
			this.onClick['story-print'] = $ObjectActionsController.printStory;
			this.onClick['story-relate'] = $ObjectActionsController.relateStory;
			this.onClick['publish-time'] = $ObjectActionsController.publishTime;
			this.onClick['publish-sort'] = $ObjectActionsController.publishSort;
			this.onClick['story-approve'] = $ObjectActionsController.storyApprove;
			this.onClick['story-approve-pass'] = $ObjectActionsController.storyApprovePass;
			this.onClick['story-approve-deny'] = $ObjectActionsController.storyApproveDeny;
			this.onClick['story-submit-approve'] = $ObjectActionsController.submitApprove;
			this.onClick['product-story-edit'] = $ObjectActionsController.editProductStory;
			this.libraryId = options['libraryId'];
			this.storyId = options['storyId'];
		},

		load: function() {
			var actionsUrl = null;
			var data = null;
	    	if (this.storyId == null || ($.isArray(this.storyId) && this.storyId.length == 0)) {
	    		this.destroy();
	    		return;
	    	} else if($.type(this.storyId) === "string") {
	    		actionsUrl = $AppContext + "view/workflow/objects/"
				   + this.libraryId + "/" + this.storyId + "/actions/" + this.options.mode;
	    	} else {
	    		actionsUrl = $AppContext + "view/workflow/objects/"
				   + this.libraryId + "/multi-selected/actions/batch";
	    		data = {"objects" : this.storyId};
	    	}
			var $self = this;
			$Loading.ajaxOff();
			var moreButtonCss = "btn-xs";
			if(this.options.mode =='list' || this.options.mode =='grid' || this.options.mode =='batch'){
				moreButtonCss = "btn-xs";
			}else if(this.options.mode =='view' || this.options.mode =='edit'){
				moreButtonCss = "btn-sm";
			}
			this.$element.load(actionsUrl, data, function() {
				// 根据按钮容器的长度，自动将按钮隐藏到更多...中
				var containerWidth = $(this).width();
				var $moreBtnGroup = $('<div class="dropdown btn-group">'
						         	+ '    <button name="more-action" type="button" class="btn '
						         	+  moreButtonCss 
						         	+ ' btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
						         	+ '        更多...'
						         	+ '    </button>'
						         	+ '    <ul class="dropdown-menu"></ul>'
								 	+ '</div>');

				var btnCount =$(this).find('button').length;
				var totalWidth = 0;
				var hasMore = false;
				var lastButton;
				if(btnCount == 1){
					bindAction($(this).find('button'), $self);
				}else{
					$self.$element.find('button').each(function() {
						btnCount --;
						var lastBtnWidth = lastButton != null ? $(lastButton).outerWidth() : 0;
						var maxBtnWidth = $(this).outerWidth() > 70 ? $(this).outerWidth() : 70;
						if (containerWidth >= (totalWidth + lastBtnWidth + $(this).outerWidth())) {
							if (btnCount <= 0) {
								if (lastButton != null) {
									bindAction(lastButton, $self);
								}
								bindAction(this, $self);
							} else {
								if (lastButton != null) {
									bindAction(lastButton, $self);
									totalWidth += $(lastButton).outerWidth();
								}
							}
						} else {
							if (btnCount <= 0) {
								// 将最后两个合并为 More；
								if (lastButton != null){
									createMoreAction(lastButton, $self, $moreBtnGroup);
								}
								createMoreAction(this, $self, $moreBtnGroup);
								hasMore = true;
							} else {
								// 将上一个合并为 More；
								if (lastButton != null) {
									createMoreAction(lastButton, $self, $moreBtnGroup);
									hasMore = true;
								}
							}
						}
						lastButton = this;
					});
					if (hasMore) {
						$moreBtnGroup.appendTo($self.$element);
					}
				}
			});
		},

		onBeforeClick: function(action, func) {
			this.onBeforeClick[action] = func;
		},

		click: function(action, func) {
			if (jQueryObj.beforeOnClick[action]) {
				jQueryObj.beforeOnClick[action].call(btnObj, jQueryObj.libraryId, jQueryObj.storyId, jQueryObj.onClick[action]);
			} else {
				jQueryObj.onClick[action].call(btnObj, jQueryObj.libraryId, jQueryObj.storyId);
			}
		},

		destroy: function() {
			this.$element
			.removeData('objectActions')
			.empty();
		}
	}

	/* PLUGIN DEFINITION
	 * ======================= */

	$.fn.objectActions = function (option, args) {
		
		return this.each(function () {
			var $this = $(this), data = $this.data('objectActions'),
			options = $.extend({}, $.fn.objectActions.defaults, typeof option == 'object' && option);
			if (!data) $this.data('objectActions', (data = new ObjectActions(this, options)));
			if (typeof option === 'string') {
				data[option].apply(data, [].concat(args));
			} else {
				data.load();
			}
		})
	};

	$.fn.objectActions.defaults = {
		mode: 'list',
		maxCount: -1,
		order: [],
		onBeforeClick: {}
	};

	$.fn.objectActions.Constructor = ObjectActions;
	
	/* PRIVATE METHOD （辅助方法）
	* ======================= */
	// 绑定按钮事件
	function bindAction(btnObj, jQueryObj) {
		$(btnObj).click(function() {
			var action = $(btnObj).attr('name');
			$LibrarySearchController.reloadObject(jQueryObj.libraryId, jQueryObj.storyId);
			if (jQueryObj.beforeOnClick[action]) {
				jQueryObj.beforeOnClick[action].call(btnObj, jQueryObj.libraryId, jQueryObj.storyId, jQueryObj.onClick[action]);
			} else {
				jQueryObj.onClick[action].call(btnObj, jQueryObj.libraryId, jQueryObj.storyId);
			}
		});
	}
	
	// 将按钮移动到更多...中
	function createMoreAction(btnObj, jQueryObj, moreBtnGroup) {
		var action = $(btnObj).attr('name');
		$('<li><a href="javascript:void(0);" class="small"></li>')
			.appendTo(moreBtnGroup.find('.dropdown-menu'))
			.find('a')
				.html($(btnObj).html())
				.click(function() {
					if(!jQueryObj.beforeOnClick[action] 
					 || jQueryObj.beforeOnClick[action].call(this, jQueryObj.libraryId, jQueryObj.storyId)) {
						jQueryObj.onClick[action].call(this, jQueryObj.libraryId, jQueryObj.storyId);
					}
			    });
		$(btnObj).remove();
	}

}(jQuery);

;(function(global){

    /*
     * 控制器类(现在未使用)
     */
    function ObjectActionsController() {}

	// 选用
    ObjectActionsController.prototype.fetchStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择要选用的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/fetch", null, {width: 500});
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量选用稿件！");
    	}
	};

	// 编辑（稿件）
    ObjectActionsController.prototype.editStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
        	var options = {};
        	if(result.startWith("PO")){
        		options.keyboard = false;
        	}
    		$EditWindow.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/edit", {}, options);
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑稿件！");
    	}
	};
	
	// 改稿
    ObjectActionsController.prototype.editProductStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
        	var options = {};
        	if(result.startWith("PO")){
        		options.keyboard = false;
        	}
    		$EditWindow.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/product/edit", {}, options);
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑稿件！");
    	}
	};
	
	

	// 传稿
    ObjectActionsController.prototype.deliverStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要传递的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/deliver", null, {width: 800});
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量传递稿件！");
    	}
	};

	// 提交
    ObjectActionsController.prototype.submitStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要提交的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/submit", null, {width: 800});
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量提提交件！");
    	}
	};

	// 撤回提交
    ObjectActionsController.prototype.undoSubmitStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要撤回的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定撤回该稿件？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/submit/undo/process",
    						function(){
    							$Message.showInfoMessage('成功撤回已提交的稿件！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量撤回已提交的稿件！");
    	}
	};

	// 上栏
    ObjectActionsController.prototype.assignStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要上栏的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/assign", null, {width: 980});
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量上栏稿件！");
    	}
	};

	// 终校稿件
    ObjectActionsController.prototype.collateStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要自审的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定自审通过？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/collate/process",
    						function(){
    							$Message.showInfoMessage('稿件自审成功！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量审核稿件！");
    	}
	};

	// 签入
    ObjectActionsController.prototype.checkinStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要签入的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/checkin", null, {width: 600});
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量签入稿件！");
    	}
	};

	// 签入
    ObjectActionsController.prototype.undoCheckinStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要撤回签入的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定撤回该已签入的稿件？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/checkin/undo/process",
    						function(){
    							$Message.showInfoMessage('成功撤回已签入的稿件！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量撤回已签入的稿件！");
    	}
	};

	// 签发
    ObjectActionsController.prototype.ratifyStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	console.log(result);
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要签发的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/ratify", null, {width: 980});
    	} else {
        	$EditWindow.hide();
        	$EditWindow.destroyEditor();
        	$Dialog.show($AppContext + 'view/workflow/stories/' + libraryId +'/multi-selected/ratify/batch', result, {width: 980});
    	}
	};
	
	// 关联
    ObjectActionsController.prototype.relateStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要关联的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/relate", null, {width: 980});
    	} else {
        	//TODO
    		//批处理
    	}
	};
	
	// 修改发布时间
    ObjectActionsController.prototype.publishTime = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要关联的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/publish/time", null, {width:360});
    	} else {
        	//TODO
    		//批处理
    	}
	};
	
	// 调整发布顺序
    ObjectActionsController.prototype.publishSort = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要关联的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/publish/sort", null, {width: 980});
    	} else {
        	//TODO
    		//批处理
    	}
	};
	
	// 预签
    ObjectActionsController.prototype.prepublishStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	console.log(result);
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要预签的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$EditWindow.destroyEditor();
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/prepublish", null, {width: 980});
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量预签稿件！");
    	}
	};

	// 撤回预签
    ObjectActionsController.prototype.undoPrepublishStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要撤回的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定撤回该稿件？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/prepublish/undo/process",
    						function(){
    							$Message.showInfoMessage('撤回成功！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量撤回稿件！");
    	}
	};

	// 批准预签
    ObjectActionsController.prototype.passPrepublishStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要签发的稿件！");
    	} else if($.type(result) === "string") {
    		//$EditWindow.hide();
    		//$EditWindow.destroyEditor();
    		//$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/prepublish/pass", null, {width: 500});
            $Message.showConfirmDialog('确定签发该稿件？',
                    { ok: function() {
	                        //var data = {"isFinal" : isFinal};
	                        $.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + id + "/prepublish/pass/process", null,
	                        	   function(response, status ,xhr) {
	                            $Message.showInfoMessage("稿件签发成功！");
	                            $EditWindow.hide();
	                            $EditWindow.destroyEditor();
	                            if ($LibrarySearchController) {
	                                $LibrarySearchController.reloadObject(libraryId, id);
	                            }
	                        });
                          }
                    }
            );
    	} else {
        	//$EditWindow.hide();
        	//$EditWindow.destroyEditor();
        	//$Dialog.show($AppContext + 'view/workflow/stories/' + libraryId +'/multi-selected/prepublish/batch', result, {width: 980});
    		$Message.showWarnDialog("系统暂不支持批量签发稿件！");
    	}
	};

	// 退回预签
    ObjectActionsController.prototype.denyPrepublishStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要退回的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定退回该稿件？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/prepublish/deny/process",
    						function(){
    							$Message.showInfoMessage('退回成功！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量退回稿件！");
    	}
	};

	// 撤签（稿件）
    ObjectActionsController.prototype.retractStory = function(libraryId, id, channel) {
    	var data = {};
    	if (channel) {
    		data["uuid"] = channel;
    	}
    	console.log(data);
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要撤签的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定撤稿？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/retract/process",
    							data,
    						function() {
    							$Message.showInfoMessage('撤稿成功！');
    							$EditWindow.hide();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统不支持批量撤签稿件！");
    	}
	};

	// 重发（稿件）
    ObjectActionsController.prototype.republishStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要重发的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定重发该稿件？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/republish/process",
    						function(){
    							$Message.showInfoMessage('重新发布成功！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量重发稿件！");
    	}
	};

	// 删除（稿件）
    ObjectActionsController.prototype.deleteStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要删除的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定删除稿件？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/delete/process",
    						function(){
    							$Message.showInfoMessage('删除成功！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统不支持批量删除稿件！");
    	}
	};

	// 销毁（稿件）
    ObjectActionsController.prototype.destroyStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要销毁的稿件！");
    	} else if($.type(result) === "string") {
    		var type = '稿件';
    		if(id.indexOf('PL') == 0){
    			type = '策划'
    		}else if (id.indexOf('TP') == 0){
    			type = '报题'
    		}
    		$Message.showConfirmDialog('确定销毁{type}？（不可恢复）'.replace('{type}' , type),
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/destroy/process",
    						function(){
    							$Message.showInfoMessage('销毁{type}成功！'.replace('{type}' , type));
    							$EditWindow.hide();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {

    		$Message.showWarnDialog("系统不支持批量销毁稿件！");
    	}
	};

	// 恢复（稿件）
    ObjectActionsController.prototype.restoreStory = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要恢复的稿件！");
    	} else if($.type(result) === "string") {
    		var type = '稿件';
    		if(id.indexOf('PL') == 0){
    			type = '策划'
    		}else if (id.indexOf('TP') == 0){
    			type = '报题'
    		}
    		$Message.showConfirmDialog('确定恢复{type}？'.replace('{type}' , type),
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/restore/process",
    						function(){
    							$Message.showInfoMessage('{type}恢复成功！'.replace('{type}' , type));
    							$EditWindow.hide();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统不支持批量恢复稿件！");
    	}
	};

	// 编辑（报题、策划）
    ObjectActionsController.prototype.editPlanning = function(libraryId, id) {
    	var result = checkObjectId(id, "objects");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的选题策划！");
    	} else if($.type(result) === "string") {
        	var options = {};
       		options.keyboard = false;
    		$EditWindow.show($AppContext + "view/workflow/planning/" + libraryId + "/" + result + "/edit", {}, options);
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑选题策划！");
    	}
	};

	// 传递（报题、策划）
    ObjectActionsController.prototype.deliverPlanning = function(libraryId, id) {
    	var result = checkObjectId(id, "objects");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的选题策划！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$Dialog.show($AppContext + "view/workflow/planning/" + libraryId + "/" + result + "/deliver", null, {width: 800});
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑选题策划！");
    	}
	};

	// 提交（报题、策划）
    ObjectActionsController.prototype.submitPlanning = function(libraryId, id) {
    	var result = checkObjectId(id, "objects");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的选题策划！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
    		$Dialog.show($AppContext + "view/workflow/planning/" + libraryId + "/" + result + "/submit", null, {width: 800});
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑选题策划！");
    	}
	};

	// 废弃（报题、策划）
    ObjectActionsController.prototype.deletePlanning = function(libraryId, id){
    	var result = checkObjectId(id, "objects");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的选题策划！");
    	} else if($.type(result) === "string") {
    		var type = result.indexOf('PL') ==0 ? '策划':'报题'
    		$Message.showConfirmDialog('您确定要删除这个{type}么？'.replace('{type}' , type),
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/planning/" + libraryId + "/" + result + "/delete/process",
    						function(){
    							$Message.showInfoMessage('删除成功！');
    							$EditWindow.hide();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑选题策划！");
    	}
		
	};

	// 销毁（报题、策划）
    ObjectActionsController.prototype.destroyPlanning = function(libraryId, id) {
    	var result = checkObjectId(id, "objects");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要编辑的选题策划！");
    	} else if($.type(result) === "string") {
    		var type = result.indexOf('PL') ==0 ? '策划':'报题'
    		$Message.showConfirmDialog('您确定销毁这个{type}么？（不可恢复）'.replace('{type}' , type),
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/destroy/process",
    						function(){
    							$Message.showInfoMessage('销毁稿件成功！');
    							$EditWindow.hide();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统不支持批量编辑选题策划！");
    	}
	};
	
	// 销毁（报题、策划）
    ObjectActionsController.prototype.printStory = function(libraryId, id) {
    	var result = checkObjectId(id, "objects");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要打印的稿件！");
    	} else if($.type(result) === "string") {
    		$Dialog.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/print", null, {height:500,width: 800});
    	} else {
    		$Message.showWarnDialog("系统不支持批量打印稿件！");
    	}
	};
	
	// 审改（稿件）
    ObjectActionsController.prototype.storyApprove = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要审改的稿件！");
    	} else if($.type(result) === "string") {
    		$EditWindow.hide();
        	var options = {};
        	if(result.startWith("PO")){
        		options.keyboard = false;
        	}
    		$EditWindow.show($AppContext + "view/workflow/stories/" + libraryId + "/" + result + "/approve", {}, options);
    	} else {
    		$Message.showWarnDialog("系统不支持批量审改稿件！");
    	}
	};
	
	// 审核通过
	ObjectActionsController.prototype.storyApprovePass = function(libraryId, id){
		
		//do nothing
		
	};
	
	//审核驳回
	ObjectActionsController.prototype.storyApproveDeny = function(libraryId, id){
		
		//do nothing
		
	};
	
	// 稿件送审
    ObjectActionsController.prototype.submitApprove = function(libraryId, id) {
    	var result = checkObjectId(id, "stories");
    	if (result == null) {
    		$Message.showWarnDialog("请选择需要送审的稿件！");
    	} else if($.type(result) === "string") {
    		$Message.showConfirmDialog('确定要送审吗？',
    				{ ok: function(){
    					$.post($AppContext + "rest/workflow/stories/" + libraryId + "/" + result + "/submit/approve/process",
    						function(){
    							$Message.showInfoMessage('稿件送审成功！');
    							$EditWindow.hide();
    							$EditWindow.destroyEditor();
    							// 刷新页面
    							if ($LibrarySearchController) {
    								$LibrarySearchController.reloadObject(libraryId, id);
    							}
    						});
    					}
    				}
    		);
    	} else {
    		$Message.showWarnDialog("系统暂不支持批量送审稿件！");
    	}
	};
	
	// Private Method
	function checkObjectId(objectIds, key) {
		var result = null;
		if (objectIds != null) {
	    	if ($.isArray(objectIds) && objectIds.length > 1) {
	    		result = {};
	    		// Set default key.
	    		if (key == null || key == "") {
	    			key = "objects";
	    		}
	        	$.each(objectIds, function(i, item) {
	        		var data = {};
	        		data[key + "[" + i + "]"] = item;
	        		$.extend(result, data);
	        	});
	    	}

	    	if ($.isArray(objectIds) && objectIds.length == 1) {
	    		result = objectIds[0];
	    	}

	    	if ($.type(objectIds) === "string") {
	    		result = objectIds;
	    	}
		}
    	return result;
	}
	


    global.$ObjectActionsController = new ObjectActionsController();

}(this));