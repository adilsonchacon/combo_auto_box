var ComboAutoBox = {
	// constructor
	addTo: function (container, options) {
		// generatea an ID based on current time
		var generateShortId = function(prefix) {
			var now = 0;
			while ($('input[name*="[' + prefix +"-" + now + ']"]').length != 0) {
				now++;
			}
	
			return prefix + "-" + now;
		};

		// generatea an ID based on current time
		var generateAnId = function(prefix) {
			var now = new Date().getTime();
			while ($("#" + prefix +"-" + now).length != 0) {
				now++;
			}
	
			return prefix + "-" + now;
		};
	
		// binds autocomplete to text field
		var bindAutoComplete = function (inputId) {
			var previuosValue = '';
			$('#' + inputId).keydown(function(e) {
				if ((e.keyCode == 8) && (options.type == 'multiple') && ($('#' + inputId).val() == '')) {
					var value = $('#' + container + ' > div.multiple > div.item:last > input').val();
					var label = $('#' + container + ' > div.multiple > div.item:last').text();
					$('#' + container + ' > div.multiple > div.item:last').remove();
					unselectData(value, label);
				}
	
				if ((e.keyCode == 8) && (options.type == 'searchable') && ($('#' + inputId).val() == '')) {
					var label = $('#' + container + ' > div.searchable > div.item:last > input[name*="value"]').val();
					var attribute = $('#' + container + ' > div.searchable > div.item:last > input[name*="name"]').val();
					var condition = $('#' + container + ' > div.searchable > div.item:last > input[name*="p"]').val();
					$('#' + container + ' > div.searchable > div.item:last').remove();
					unselectData(attribute + "_" +condition, label);
				}
	
			});
		
			$('#' + inputId).keypress(function(e) {
				if (e.which === 13) {
					if (options.type == 'full') {
						$('#' + inputId).autocomplete( "close" );
						selectData($('#' + inputId).val());
					} else if (options.type == 'multiple') {
						$('#' + inputId).autocomplete( "close" );
						addItem(inputId, $('#' + inputId).val(), $('#' + inputId).val());
						selectData($('#' + inputId).val());
						$('#' + inputId).val('');
					} else if ((options.type == 'searchable') && ($('#' + inputId).val()) != '') {
						try {
							var item = sourceForSearchable(inputId)[0];
							addSearchableItemForRansack(inputId, item.id, item.label);
							selectData(item.id);
							$('#' + inputId).val('');
							$('#' + inputId).autocomplete('close');
						} catch (error) {
							
						}
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
						addItem(inputId, ui.item.id, ui.item.label);
						selectData(ui.item.id);
						return false;
					} else if (options.type == 'searchable') {
						$('#' + inputId).val('');
						addSearchableItemForRansack(inputId, ui.item.id, ui.item.label);
						selectData(ui.item.id);
						return false;
					}
				},
				search: function(event, ui) {
					if (options.type == 'searchable') {
						$('#' + inputId).autocomplete("option", { source: setAutoCompleteSource(inputId) }); 
					}
				},
				change: function (event, ui) {
					if (!ui.item) {
						$(this).val('');
					}
				},
				focus: function (event, ui) {
					event.preventDefault();
				},
			});
		};
	
		// set autocomplete source
		var setAutoCompleteSource = function (inputId) {
			if (options.type == 'searchable') {
				return sourceForSearchable(inputId);
			} else if (typeof options.source == 'string') {
				return function(request, response) {
					var term = 'term=' + $('#' + inputId).val();
					var params = (options.data == null) ? term : options.data + '&' + term;
					return $.getJSON(options.source + '?' + params, response);
				};
			} else {
				return options.source;
			}
		};
		
		// source items for searchable
		var sourceForSearchable = function (inputId) {
			var new_source = new Array();
			var operators = i18nMath(options.lang);
			$.each(options.source, function(i){
				validIndexes = validSource(options.source[i]);
				$.each(operators, function(j){
					if (validIndexes.indexOf(j) >= 0) {
						new_source.push( { id: options.source[i]['id'] + '_' + operators[j]['id'], label: options.source[i]['label'] + ' ' + operators[j]['label'] + ' ' + $('#' + inputId).val()} );
					}
				});
			});
			return new_source;			
		}
	
		// get i18n math comparisons
		var i18nMath = function (language) {
			var operators = new Array();
			switch(language) {
				case 'en':
					operators = [ { id: 'cont', label: 'contains' }, { id: 'eq', label: 'equal' }, { id: 'gteq', label: 'greater or equal' }, { id: 'lteq', label: 'less or equal' } ];
				break;
				case 'pt-br':
					operators = [ { id: 'cont', label: 'contém' }, { id: 'eq', label: 'igual' }, { id: 'gteq', label: 'maior que' }, { id: 'lteq', label: 'menor que' } ];
				break;
				case 'pt':
					operators = [ { id: 'cont', label: 'contém' }, { id: 'eq', label: 'igual' }, { id: 'gteq', label: 'maior que' }, { id: 'lteq', label: 'menor que' } ];
				break;
				case 'fr':
				    operators = [ { id: 'cont', label: 'contient' }, { id: 'eq', label: 'égal' }, { id: 'gteq', label: 'supérieur ou égal' }, { id: 'lteq', label: 'inférieur ou égal' } ];
				break;
				case 'es':
					operators = [ { id: 'cont', label: 'contiene' }, { id: 'eq', label: 'igual' }, { id: 'gteq', label: 'mayor o igual' }, { id: 'lteq', label: 'menos o igual' } ];
				break;
				default:
					operators = [ { id: 'cont', label: '~=' }, { id: 'eq', label: '=' }, { id: 'gteq', label: '>=' }, { id: 'lteq', label: '<=' } ];
			}
			return operators;
		};
	
		// generates text field with html options
		var generateInputTag = function () {
			var html = 'input type="text"';
			if (options.html != null) {
				$.each(options.html, function(key, value) {
					if ((key == 'name') && ((options.type == 'multiple') || (options.type == 'searchable'))) {
						return true;
					}
		    		html = html + ' '+ key +'="' + value + '"';
				});
			}
	
			if ((options.html == null) || (options.html.id == null)) {
			    html = html + ' id="' + generateAnId('combo-auto-box') + '"';
			}
	
		        return '<' + html + '>';
		};
	
		// On click opens modal image tag inside "i" tag through css
		var generateExpander = function () {
			if (options.type == 'simple') {
		        	return '<span class="simple"><i></i></span>';
			} else if (options.type == 'multiple') {
		        	return '<span class="multiple">' + options.label + ':</span>';
			}
		};
	
		var adjustExpanderImage = function() {
			if (options.type != 'simple') {
				return false;
			}
		
			spanTag = $('#' + container + ' > div.container-combo-auto-box > span.simple');
			var paddingRight = 1;
			try {
				paddingRight = parseInt(textField.css('padding-right').replace(/px/, ''));
			} catch (error) {
				paddingRight = 1;
			}
			spanTag.css('margin', '2px 0px 0px ' + (paddingRight + textField.width() + 9).toString() + 'px');
		
			return true;
		}
	
		// Global div for combo auto box
		var generateDivTag = function () {
			var derivation = ''
			if (options.type == 'multiple') {
				derivation = ' multiple'
			} else if (options.type == 'searchable') {
				derivation = ' searchable'				
			}
		
		        return '<div class="container-combo-auto-box' + derivation + '">' + generateInputTag() + '</div>';
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
		
			$('#' + container + ' > div.container-combo-auto-box > span.' + options.type).click(function() { 
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
				var thisId = $(this).children('span.combo-auto-box-item-id').text();
				var thisLabel = $(this).children('span.combo-auto-box-item-label').text();
			
				$('#' + modalDialogId).dialog('close');
			
				if (options.type == 'simple') {
					$('#' + container + ' > div.container-combo-auto-box > input').val(thisLabel);
					selectData(thisId);
				} else if (options.type == 'multiple') {
					$('#' + container + ' > div.container-combo-auto-box > input').val('');
					addItem($('#' + container + ' > div.container-combo-auto-box > input').attr('id'), thisLabel, thisLabel);
					$('#' + container + ' > div.container-combo-auto-box > input[type="text"]').focus();
					selectData(thisId);
				}
			});			
		};
	
		// opens modal dialog
		var openModalDialog = function (modalDialogId) {
		        $('#' + modalDialogId).dialog("open");
		};
	
		// starting generate modial dialog
		var generateModalDialog = function (textField) {
			$(generateExpander()).prependTo('#' + container + ' > div.container-combo-auto-box');
	
			adjustExpanderImage();
		
			generateDivDialogModal(generateAnId('model-dialog'));			
		};
	
		// add item
		var addItem = function (inputId, selectedId, selectedData) {
			if (selectedData != '') {
				var id = generateAnId('item');
				$('#' + inputId).before('<div class="item" id="' + id + '">'+ htmlSafe(selectedData) +'<span title="Remove Item">x</span><input type="hidden" name="'+ options.html.name +'[]" value="'+ selectedId +'"></div>');
	
				$('#' + id + ' > span').click(function() {
					$(this).parent().remove();
					unselectData(selectedId, selectedData);
				});
			}
		};
	
		// add searchable item for ransack
		var addSearchableItemForRansack = function (inputId, selectedId, selectedData) {
			if (selectedData != '') {
				var ransackId = generateShortId('r');
				predicate = getSearchablePredicate(selectedId);
				if (getSearchableValue(selectedData) == null) {
					selectedData = predicate['full'] + ' ' + selectedData;
				}
				fieldAttribute = '<input type="hidden" name="q[g]['+ predicate['attribute'] +'][c]['+ ransackId +'][a][0][name]"  value="'+ predicate['attribute'] +'">';
				fieldCondition = '<input type="hidden" name="q[g]['+ predicate['attribute'] +'][c]['+ ransackId +'][p]"           value="'+ predicate['condition'] +'">';
				fieldValue =     '<input type="hidden" name="q[g]['+ predicate['attribute'] +'][c]['+ ransackId +'][v][0][value]" value="'+ getSearchableValue(selectedData) +'">';
				var id = generateAnId('item');
				$('#' + inputId).before('<div class="item" id="' + id + '">'+ htmlSafe(selectedData) +'<span title="Remove Item">x</span>'+ fieldAttribute + fieldCondition + fieldValue +'</div>');
	
				$('#' + id + ' > span').click(function() {
					$(this).parent().remove();
					unselectData(selectedId, selectedData);
				});
			}
		};
	
		// add searchable item
		var addSearchableItem = function (inputId, selectedId, selectedData) {			
			if (selectedData != '') {
				var id = generateAnId('item');
				$('#' + inputId).before('<div class="item" id="' + id + '">'+ htmlSafe(selectedData) +'<span title="Remove Item">x</span><input type="hidden" name="'+ options.html.name +'['+ selectedId +'][]" value="'+ getSearchableValue(selectedData) +'"></div>');
	
				$('#' + id + ' > span').click(function() {
					$(this).parent().remove();
					unselectData(selectedId, selectedData);
				});
	
			}
		};
				
		// return json with attribute and condition
		var getSearchablePredicate = function (selectedId) {
			var fields = $.map(options.source, function(val, i) { return val['id']}).join('|');
			var maths = $.map(i18nMath(options.lang), function(val, i) { return val['id']}).join('|');
			var pattern = new RegExp('(' + fields + ')_(' + maths + ')');
			var matched = selectedId.match(pattern);
			var full = getSearchableLabelForAttributeId(matched[1]) + ' ' + getSearchableLabelForConditionId(matched[2]);
			return { attribute: matched[1], condition: matched[2], full: full };
		}
	
		// get only the value from selected Data
		var getSearchableValue = function (selectedData) {
			var fields = $.map(options.source, function(val, i) { return val['label']}).join('|');
			var maths = $.map(i18nMath(options.lang), function(val, i) { return val['label']}).join('|');
			var pattern = new RegExp('(' + fields + ') (' + maths + ') (.*)');
			try {
				return selectedData.match(pattern)[3];
			} catch (error) {
				return null;
			}
		}
		
		var getSearchableLabelForAttributeId = function (attibuteId) {
			for(var i=0; i<options.source.length;i++) {
				if (options.source[i]['id'] == attibuteId) {
					return options.source[i]['label'];
				}
			}
		}

		var getSearchableLabelForConditionId = function (conditionId) {
			var conditions = i18nMath(options.lang);
			for(var i=0; i<conditions.length;i++) {
				if (conditions[i]['id'] == conditionId) {
					return conditions[i]['label'];
				}
			}
		}
		
		var htmlSafe = function(html) {
			html = html.replace(/\&/, '&amp;');
			html = html.replace(/\</, '&lt;');
			html = html.replace(/\>/, '&gt;');
			html = html.replace(/\"/, '&quot;');
			html = html.replace(/\'/, '&#x27;');
			html = html.replace(/\//, '&#x2F;');
			
			return html;
		}
			
		//  Bind click on div for multiple or searchble
		var bindContainerClick = function(inputId) {
			$('#' + container + ' > div.multiple').click(function() {
				$('#' + inputId).focus();
			});			
	
			$('#' + container + ' > div.searchable').click(function() {
				$('#' + inputId).focus();
			});			
		};
		
		var normalizeStyles = function(inputId) {
			$('#' + container).css('background-color', $('#' + inputId).css('background-color'));
			$('#' + inputId).css('border', '0px');
		}
			
		// on select data
		var selectData = function (selectedData) {
			if (options.complete != null) {
				options.complete(selectedData);
			} else if (options.select != null) {
				options.select(selectedData);
			}

		};
		
		// on unselect data
		var unselectData = function (selectedId, selectedData) {
			if (options.unselect != null) {
				options.unselect(selectedId, selectedData);
			}
		};
	
		// valid language or set 'en' as default
		var validLanguage = function () {
			var langs = ['math', 'en', 'pt-br', 'pt', 'es', 'fr'];
			for(var i=0; i<langs.length;i++) {
				if (options.lang == langs[i]) {
					return true;
				}
			}
		
			options.lang = 'en';
			return true;
		};
	
		// valid language or set 'en' as default
		var validType = function () {
			var types = ['simple', 'full', 'multiple', 'searchable'];
			for(var i=0; i<types.length;i++) {
				if (options.type == types[i]) {
					return true;
				}
			}
		
			options.type = 'simple';
			return true;
		};
	
		// valid sources for only and except
		var validSource = function (source) {
			operators = i18nMath('math');
			validIndexes = new Array();
		
			if (((source['only'] != null) && (source['except'] != null)) || ((source['only'] == null) && (source['except'] == null))) {
				for(var i=0; i<operators.length;i++) {
					validIndexes.push(i);
				}
			} else if (source['only'] != null) {
				for(var i=0; i<operators.length;i++) {
					if ((source['only'].indexOf(operators[i]['id']) + source['only'].indexOf(operators[i]['label'])) >= -1) {
						validIndexes.push(i);
					}
				}				
			} else if (source['except'] != null) {
				for(var i=0; i<operators.length;i++) {
					if ((source['except'].indexOf(operators[i]['id']) + source['except'].indexOf(operators[i]['label'])) == -2) {
						validIndexes.push(i);
					}
				}
			}
		
			return validIndexes;
		}
	
		// main
		if (options == null) {
			options = {};
		}
	
		validLanguage();
		validType();
	
		$('#' + container).html(generateDivTag());
	
		textField = $('#' + container + ' > div.container-combo-auto-box > input');
		bindAutoComplete(textField.attr('id'));
	
		if ((options.type == 'simple') || (options.type == 'multiple')) {
			generateModalDialog(textField);
		}
	
		if ((options.type == 'multiple') || (options.type == 'searchable')) {
			bindContainerClick(textField.attr('id'));
			normalizeStyles(textField.attr('id'));
		}
		
		if ((options.type == 'multiple') && (options.initials != null)) {
			$.each(options.initials, function(index){
				addItem(textField.attr('id'), options.initials[index]['id'], options.initials[index]['label']);
			}); 
		}

		if ((options.type == 'searchable') && (options.initials != null)) {
			$.each(options.initials, function(index){
				addSearchableItemForRansack(textField.attr('id'), options.initials[index]['id'], options.initials[index]['label']);
			}); 
		}

	}
}

