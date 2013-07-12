var ComboAutoBox = {
	// constructor
    addTo: function (container, options) {
		
		// generatea an ID based on current time
		var generateAnId = function(prefix) {
			var now = new Date().getTime();;
			while ($("#" + prefix +"-" + now).length != 0) {
				now++;
			}

			return "combo-auto-box-" + now;
		};
		
		// binds autocomplete to text field
		var bindAutoComplete = function (inputId) {
			$('#' + inputId).keypress(function(e) {
				if (e.which === 13) {
					if (options.type == 'full') {
						$('#' + inputId).autocomplete( "close" );
						selectData($('#' + inputId).val());
					} else if (options.type == 'multiple') {
						$('#' + inputId).autocomplete( "close" );
						addItem(inputId, $('#' + inputId).val());
						$('#' + inputId).val('');
					}
					return false;		
				}
			});
						
			$('#' + inputId).autocomplete({
				source: setAutoCompleteSource(inputId),
				select: function(event, ui) {
					if (options.type == 'simple') {
						return selectData(ui.item.id);
					} else if (options.type == 'full') {
						return selectData($('#' + inputId).val());
					} else if (options.type == 'multiple') {
						$('#' + inputId).val('');
						addItem(inputId, ui.item.label);
						return false;
					}
				}
			});
		};
		
		// set autocomplete source
		var setAutoCompleteSource = function (inputId) {
			if (typeof options.source == 'string') {
				return function(request, response) {
					var term = 'term=' + $('#' + inputId).val();
					var params = (options.data == null) ? term : options.data + '&' + term;
					return $.getJSON(options.source + '?' + params, response);
				};
			} else {
				return options.source;
			}
		};
		
		// generates text field with html options
		var generateInputTag = function () {
			var html = 'input type="text"';
			if (options.html != null) {
				$.each(options.html, function(key, value) {
			    	html = html + ' '+ key +'="' + value + '"';
				});
			}

			if ((options.html == null) || (options.html.id == null)) {
			    html = html + ' id="' + generateAnId('combo-auto-box') + '"';
			}

	        return '<' + html + '>';
		};

		// On click opens modal image tag inside "i" tag through css
		var generateImageTag = function () {
	        return '<span class="expand"><i></i></span>';
		};

		// Global div for combo auto box
		var generateDivTag = function () {
			var multiple = ''
			if (options.type == 'multiple') {
				multiple = ' multiple'
			}
			
	        return '<div class="container-combo-auto-box' + multiple + '">' + generateInputTag() + '</div>';
		};

		// dialog modal
		var generateDivDialogModal = function (modalDialogId) {
	        $('<div id="'+ modalDialogId +'" class="dialog-modal"><div class="head"><span class="label">' + options.label + '</span><span class="close" title="Close">X</span></div><div class="list"><ul></ul></div></div>').appendTo('#' + container);
	
			$('#' + modalDialogId + ' > div.head > span.close').click(function() {
				$('#' + modalDialogId).dialog('close');
			});

			$('#' + modalDialogId).dialog({
				width: 500,
				height: 400,
				modal: true,
				closeOnEscape: true,
				autoOpen: false,
			});

			getListForModalDialog(modalDialogId);
			
			$("#" + modalDialogId).siblings('div.ui-dialog-titlebar').remove();
			
			$('#' + container + ' > div.container-combo-auto-box > span.expand').click(function() { 
				openModalDialog(modalDialogId) 
			});
		};

		// Selects an item form modal dialog when clicked on
		var selectValueFromModalDialog = function (value) {
			$('#' + container + ' > div.container-combo-auto-box > input').val(value);
			selectData(value);
		};
		
		// generates list for modal dialog
		var getListForModalDialog = function (modalDialogId) {
			if (typeof options.source == 'string') {
				var term = 'term=';
				var params = (options.data == null) ? term : options.data + '&' + term;

				$.getJSON(options.source + '?' + params, function(data) {
					setListForModalDialog(modalDialogId, data);
				});
			} else {
				setListForModalDialog(modalDialogId, options.source);
			}
		};
		
		// set list for modal dialog
		var setListForModalDialog = function (modalDialogId, data) {
			var items = [];
			
			$.each(data, function(index){
				items.push('<li><span class="combo-auto-box-item-id">' + data[index].id +'</span><span class="combo-auto-box-item-label">'+ data[index].label + '</span></li>');
			});
			
			$('#' + modalDialogId + ' > div.list').css('height', ($('#' + modalDialogId).dialog("option", "height") - 60) + 'px');
			$('#' + modalDialogId + ' > div.list > ul').html(items.join(''));
			$('#' + modalDialogId + ' > div.list > ul > li').click(function() {
				$('#' + modalDialogId).dialog('close');
				$('#' + container + ' > div.container-combo-auto-box > input').val($(this).children('span.combo-auto-box-item-label').text());
				selectData($(this).children('span.combo-auto-box-item-id').text());
			});			
		};

		// opens modal dialog
		var openModalDialog = function (modalDialogId) {
	        $('#' + modalDialogId).dialog("open");
		};
		
		// starting generate modial dialog
		var generateModalDialog = function (textField) {
			$(generateImageTag()).prependTo('#' + container + ' > div.container-combo-auto-box');

			spanTag = $('#' + container + ' > div.container-combo-auto-box > span.expand');
			var paddingRight = 1;
			try {
				paddingRight = parseInt(textField.css('padding-right').replace(/px/, ''));
			} catch (error) {
				paddingRight = 1;
			}
			spanTag.css('margin', '2px 0px 0px ' + (paddingRight + textField.width() + 9).toString() + 'px');
			
			generateDivDialogModal(generateAnId('model-dialog'));			
		};

		// add item
		var addItem = function (inputId, selectedData) {
			if (selectedData != '') {
				var id = generateAnId('item');
				$('#' + inputId).before('<div class="item" title="Remove Item" id="' + id + '">'+ selectedData +'<span>x</span></div>');

				$('#' + id + ' > span').click(function() {
					$(this).parent().remove();
				});

			}
		};
				
		// on select data
		var selectData = function (selectedData) {
			if (options.complete != null) {
				options.complete(selectedData);
			}
		};

		// main
		if (options == null) {
			options = {};
		}
		
		if ((options.type == null) || ((options.type != 'simple') && (options.type != 'full') && (options.type != 'multiple'))) {
			options.type = 'simple';
		}

		$('#' + container).html(generateDivTag());
		
		textField = $('#' + container + ' > div.container-combo-auto-box > input');
		bindAutoComplete(textField.attr('id'));
		
		if (options.type == 'simple') {
			generateModalDialog(textField);
		}
    }

}