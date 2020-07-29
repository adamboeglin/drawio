/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
Calc = function(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.labelIndex = 0;

/**
 * Returns information about the current selection.
 */
Calc.prototype.currentIndex = 0;

/**
 * Returns information about the current selection.
 */
Calc.prototype.showCloseButton = true;

/**
 * Background color for inactive tabs.
 */
Calc.prototype.inactiveTabBackgroundColor = '#f1f3f4';

/**
 * Adds the label menu items to the given menu and parent.
 */
Calc.prototype.init = function()
{
	console.log("Init calc");
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	function notifyCalculator(item, index) {
		var calculatorFrame = document.getElementById("calculatorFrame").contentWindow;

		service = item.style.match(/image=.*\/([a-z\-]*)\.svg/)[1];
		var data = {};
		data['action'] = "add";
		data['service'] = service;
		calculatorFrame.postMessage(data, "*");
	} 

	this.update = mxUtils.bind(this, function(sender, evt)
	{
		// this.clearSelectionState();
		console.log("Got Event: ");
		console.log(evt);

				// Look for the service name in the item that was added to the canvas
		if (evt.properties.hasOwnProperty('cells')) {
			evt.properties.cells.forEach(notifyCalculator);
		}

		//this.refresh();
	});

	graph.addListener(mxEvent.CELLS_ADDED, this.update);
	graph.addListener(mxEvent.CELLS_REMOVED, this.update);
	// graph.getSelectionModel().addListener(mxEvent.CHANGE, this.update);
	// graph.addListener(mxEvent.EDITING_STARTED, this.update);
	// graph.addListener(mxEvent.EDITING_STOPPED, this.update);
	// graph.getModel().addListener(mxEvent.CHANGE, this.update);
	graph.addListener(mxEvent.ROOT, mxUtils.bind(this, function()
	{
		this.refresh();
	}));
	
	editor.addListener('autosaveChanged', mxUtils.bind(this, function()
	{
		this.refresh();
	}));
	
	this.refresh();
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.clearSelectionState = function()
{
	this.selectionState = null;
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.getSelectionState = function()
{
	if (this.selectionState == null)
	{
		this.selectionState = this.createSelectionState();
	}
	
	return this.selectionState;
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.createSelectionState = function()
{
	var cells = this.editorUi.editor.graph.getSelectionCells();
	var result = this.initSelectionState();
	
	for (var i = 0; i < cells.length; i++)
	{
		this.updateSelectionStateForCell(result, cells[i], cells);
	}
	
	return result;
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.initSelectionState = function()
{
	return {vertices: [], edges: [], x: null, y: null, width: null, height: null, style: {},
		containsImage: false, containsLabel: false, fill: true, glass: true, rounded: true,
		autoSize: false, image: true, shadow: true, lineJumps: true, resizable: true,
		table: false, cell: false, row: false, movable: true, rotatable: true};
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.updateSelectionStateForCell = function(result, cell, cells)
{
	var graph = this.editorUi.editor.graph;
	
	if (graph.getModel().isVertex(cell))
	{
		result.resizable = result.resizable && graph.isCellResizable(cell);
		result.rotatable = result.rotatable && graph.isCellRotatable(cell);
		result.movable = result.movable && graph.isCellMovable(cell) &&
			!graph.isTableRow(cell) && !graph.isTableCell(cell);
		result.table = result.table || graph.isTable(cell);
		result.cell = result.cell || graph.isTableCell(cell);
		result.row = result.row || graph.isTableRow(cell);
		result.vertices.push(cell);
		var geo = graph.getCellGeometry(cell);
		
		if (geo != null)
		{
			if (geo.width > 0)
			{
				if (result.width == null)
				{
					result.width = geo.width;
				}
				else if (result.width != geo.width)
				{
					result.width = '';
				}
			}
			else
			{
				result.containsLabel = true;
			}
			
			if (geo.height > 0)
			{
				if (result.height == null)
				{
					result.height = geo.height;
				}
				else if (result.height != geo.height)
				{
					result.height = '';
				}
			}
			else
			{
				result.containsLabel = true;
			}
			
			if (!geo.relative || geo.offset != null)
			{
				var x = (geo.relative) ? geo.offset.x : geo.x;
				var y = (geo.relative) ? geo.offset.y : geo.y;
				
				if (result.x == null)
				{
					result.x = x;
				}
				else if (result.x != x)
				{
					result.x = '';
				}
				
				if (result.y == null)
				{
					result.y = y;
				}
				else if (result.y != y)
				{
					result.y = '';
				}
			}
		}
	}
	else if (graph.getModel().isEdge(cell))
	{
		result.edges.push(cell);
		result.resizable = false;
		result.rotatable = false;
		result.movable = false;
	}

	var state = graph.view.getState(cell);
	
	if (state != null)
	{
		result.autoSize = result.autoSize || this.isAutoSizeState(state);
		result.glass = result.glass && this.isGlassState(state);
		result.rounded = result.rounded && this.isRoundedState(state);
		result.lineJumps = result.lineJumps && this.isLineJumpState(state);
		result.image = result.image && this.isImageState(state);
		result.shadow = result.shadow && this.isShadowState(state);
		result.fill = result.fill && this.isFillState(state);
		
		var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
		result.containsImage = result.containsImage || shape == 'image';
		
		for (var key in state.style)
		{
			var value = state.style[key];
			
			if (value != null)
			{
				if (result.style[key] == null)
				{
					result.style[key] = value;
				}
				else if (result.style[key] != value)
				{
					result.style[key] = '';
				}
			}
		}
	}
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isFillState = function(state)
{
	return state.view.graph.model.isVertex(state.cell) ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'arrow' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'filledEdge' ||
		mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null) == 'flexArrow';
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isGlassState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape == 'label' || shape == 'rectangle' || shape == 'internalStorage' ||
			shape == 'ext' || shape == 'umlLifeline' || shape == 'swimlane' ||
			shape == 'process');
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isRoundedState = function(state)
{
	return (state.shape != null) ? state.shape.isRoundable() :
		mxUtils.indexOf(this.roundableShapes, mxUtils.getValue(state.style,
		mxConstants.STYLE_SHAPE, null)) >= 0;
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isLineJumpState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	var curved = mxUtils.getValue(state.style, mxConstants.STYLE_CURVED, false);
	
	return !curved && (shape == 'connector' || shape == 'filledEdge');
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isAutoSizeState = function(state)
{
	return mxUtils.getValue(state.style, mxConstants.STYLE_AUTOSIZE, null) == '1';
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isImageState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape == 'label' || shape == 'image');
};

/**
 * Returns information about the current selection.
 */
Calc.prototype.isShadowState = function(state)
{
	var shape = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
	
	return (shape != 'image');
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Calc.prototype.clear = function()
{
	this.container.innerHTML = '';
	
	// Destroy existing panels
	if (this.panels != null)
	{
		for (var i = 0; i < this.panels.length; i++)
		{
			this.panels[i].destroy();
		}
	}
	
	this.panels = [];
};

/**
 * Adds the label menu items to the given menu and parent.
 */
Calc.prototype.refresh = function()
{
	console.log("Refreshing panel");

	// Performance tweak: No refresh needed if not visible
	if (this.container.style.width == '0px')
	{
		return;
	}

	this.clear();
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	var div = document.createElement('div');
	div.style.whiteSpace = 'nowrap';
	div.style.color = 'rgb(112, 112, 112)';
	div.style.textAlign = 'left';
	div.style.cursor = 'default';
	// div.innerHTML = "Hello World";
	
	var label = document.createElement('div');
	label.className = 'geCalcSection';
	label.style.textAlign = 'center';
	label.style.fontWeight = 'bold';
	label.style.paddingTop = '8px';
	label.style.fontSize = '13px';
	label.style.borderWidth = '0px 0px 1px 1px';
	label.style.borderStyle = 'solid';
	label.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
	label.style.height = (mxClient.IS_QUIRKS) ? '34px' : '25px';
	label.style.overflow = 'hidden';
	label.style.width = '100%';
	this.container.appendChild(div);
	
	// Prevents text selection
    mxEvent.addListener(label, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
        mxUtils.bind(this, function(evt)
	{
		evt.preventDefault();
	}));
	
	// if (graph.isSelectionEmpty())
	// {
	mxUtils.write(label, "Pricing Calculator");
	label.style.borderLeftWidth = '0px';
	
	// Adds button to hide the format panel since
	// people don't seem to find the toolbar button
	// and the menu item in the format menu
	if (this.showCloseButton)
	{
		var img = document.createElement('img');
		img.setAttribute('border', '0');
		img.setAttribute('src', Dialog.prototype.closeImage);
		img.setAttribute('title', mxResources.get('hide'));
		img.style.position = 'absolute';
		img.style.display = 'block';
		img.style.right = '0px';
		img.style.top = '8px';
		img.style.cursor = 'pointer';
		img.style.marginTop = '1px';
		img.style.marginRight = '17px';
		img.style.border = '1px solid transparent';
		img.style.padding = '1px';
		img.style.opacity = 0.5;
		label.appendChild(img)
		
		mxEvent.addListener(img, 'click', function()
		{
			ui.actions.get('calcPanel').funct();
		});
	}
	
	div.appendChild(label);
	this.panels.push(new DiagramCalcPanel(this, ui, div));
	// }
	// else if (graph.isEditing())
	// {
	// 	mxUtils.write(label, mxResources.get('text'));
	// 	div.appendChild(label);
	// 	this.panels.push(new TextCalcPanel(this, ui, div));
	// }
	// else
	// {
	// 	var containsLabel = this.getSelectionState().containsLabel;
	// 	var currentLabel = null;
	// 	var currentPanel = null;
		
	// 	var addClickHandler = mxUtils.bind(this, function(elt, panel, index)
	// 	{
	// 		var clickHandler = mxUtils.bind(this, function(evt)
	// 		{
	// 			if (currentLabel != elt)
	// 			{
	// 				if (containsLabel)
	// 				{
	// 					this.labelIndex = index;
	// 				}
	// 				else
	// 				{
	// 					this.currentIndex = index;
	// 				}
					
	// 				if (currentLabel != null)
	// 				{
	// 					currentLabel.style.backgroundColor = this.inactiveTabBackgroundColor;
	// 					currentLabel.style.borderBottomWidth = '1px';
	// 				}
	
	// 				currentLabel = elt;
	// 				currentLabel.style.backgroundColor = '';
	// 				currentLabel.style.borderBottomWidth = '0px';
					
	// 				if (currentPanel != panel)
	// 				{
	// 					if (currentPanel != null)
	// 					{
	// 						currentPanel.style.display = 'none';
	// 					}
						
	// 					currentPanel = panel;
	// 					currentPanel.style.display = '';
	// 				}
	// 			}
	// 		});
			
	// 		mxEvent.addListener(elt, 'click', clickHandler);
			
	// 		// Prevents text selection
	// 	    mxEvent.addListener(elt, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown',
	//         	mxUtils.bind(this, function(evt)
	//     	{
	// 			evt.preventDefault();
	// 		}));
			
	// 		if (index == ((containsLabel) ? this.labelIndex : this.currentIndex))
	// 		{
	// 			// Invokes handler directly as a workaround for no click on DIV in KHTML.
	// 			clickHandler();
	// 		}
	// 	});
		
	// 	var idx = 0;

	// 	label.style.backgroundColor = this.inactiveTabBackgroundColor;
	// 	label.style.borderLeftWidth = '1px';
	// 	label.style.cursor = 'pointer';
	// 	label.style.width = (containsLabel) ? '50%' : '33.3%';
	// 	label.style.width = (containsLabel) ? '50%' : '33.3%';
	// 	var label2 = label.cloneNode(false);
	// 	var label3 = label2.cloneNode(false);

	// 	// Workaround for ignored background in IE
	// 	label2.style.backgroundColor = this.inactiveTabBackgroundColor;
	// 	label3.style.backgroundColor = this.inactiveTabBackgroundColor;
		
	// 	// Style
	// 	if (containsLabel)
	// 	{
	// 		label2.style.borderLeftWidth = '0px';
	// 	}
	// 	else
	// 	{
	// 		label.style.borderLeftWidth = '0px';
	// 		mxUtils.write(label, mxResources.get('style'));
	// 		div.appendChild(label);
			
	// 		var stylePanel = div.cloneNode(false);
	// 		stylePanel.style.display = 'none';
	// 		this.panels.push(new StyleCalcPanel(this, ui, stylePanel));
	// 		this.container.appendChild(stylePanel);

	// 		addClickHandler(label, stylePanel, idx++);
	// 	}
		
	// 	// Text
	// 	mxUtils.write(label2, mxResources.get('text'));
	// 	div.appendChild(label2);

	// 	var textPanel = div.cloneNode(false);
	// 	textPanel.style.display = 'none';
	// 	this.panels.push(new TextCalcPanel(this, ui, textPanel));
	// 	this.container.appendChild(textPanel);
		
	// 	// Arrange
	// 	mxUtils.write(label3, mxResources.get('arrange'));
	// 	div.appendChild(label3);

	// 	var arrangePanel = div.cloneNode(false);
	// 	arrangePanel.style.display = 'none';
	// 	this.panels.push(new ArrangePanel(this, ui, arrangePanel));
	// 	this.container.appendChild(arrangePanel);
		
	// 	addClickHandler(label2, textPanel, idx++);
	// 	addClickHandler(label3, arrangePanel, idx++);
	// }
};

/**
 * Base class for format panels.
 */
BaseCalcPanel = function(format, editorUi, container)
{
	this.format = format;
	this.editorUi = editorUi;
	this.container = container;
	this.listeners = [];
};

/**
 * 
 */
BaseCalcPanel.prototype.buttonBackgroundColor = 'white';

/**
 * Adds the given color option.
 */
BaseCalcPanel.prototype.getSelectionState = function()
{
	var graph = this.editorUi.editor.graph;
	var cells = graph.getSelectionCells();
	var shape = null;

	for (var i = 0; i < cells.length; i++)
	{
		var state = graph.view.getState(cells[i]);
		
		if (state != null)
		{
			var tmp = mxUtils.getValue(state.style, mxConstants.STYLE_SHAPE, null);
			
			if (tmp != null)
			{
				if (shape == null)
				{
					shape = tmp;
				}
				else if (shape != tmp)
				{
					return null;
				}
			}
			
		}
	}
	
	return shape;
};

/**
 * Install input handler.
 */
BaseCalcPanel.prototype.installInputHandler = function(input, key, defaultValue, min, max, unit, textEditFallback, isFloat)
{
	unit = (unit != null) ? unit : '';
	isFloat = (isFloat != null) ? isFloat : false;
	
	var ui = this.editorUi;
	var graph = ui.editor.graph;
	
	min = (min != null) ? min : 1;
	max = (max != null) ? max : 999;
	
	var selState = null;
	var updating = false;
	
	var update = mxUtils.bind(this, function(evt)
	{
		var value = (isFloat) ? parseFloat(input.value) : parseInt(input.value);

		// Special case: angle mod 360
		if (!isNaN(value) && key == mxConstants.STYLE_ROTATION)
		{
			// Workaround for decimal rounding errors in floats is to
			// use integer and round all numbers to two decimal point
			value = mxUtils.mod(Math.round(value * 100), 36000) / 100;
		}
		
		value = Math.min(max, Math.max(min, (isNaN(value)) ? defaultValue : value));
		
		if (graph.cellEditor.isContentEditing() && textEditFallback)
		{
			if (!updating)
			{
				updating = true;
				
				if (selState != null)
				{
					graph.cellEditor.restoreSelection(selState);
					selState = null;
				}
				
				textEditFallback(value);
				input.value = value + unit;
	
				// Restore focus and selection in input
				updating = false;
			}
		}
		else if (value != mxUtils.getValue(this.format.getSelectionState().style, key, defaultValue))
		{
			if (graph.isEditing())
			{
				graph.stopEditing(true);
			}
			
			graph.getModel().beginUpdate();
			try
			{
				var cells = graph.getSelectionCells();
				graph.setCellStyles(key, value, cells);

				// Handles special case for fontSize where HTML labels are parsed and updated
				if (key == mxConstants.STYLE_FONTSIZE)
				{
					graph.updateLabelElements(graph.getSelectionCells(), function(elt)
					{
						elt.style.fontSize = value + 'px';
						elt.removeAttribute('size');
					});
				}
				
				for (var i = 0; i < cells.length; i++)
				{
					if (graph.model.getChildCount(cells[i]) == 0)
					{
						graph.autoSizeCell(cells[i], false);
					}
				}
				
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
						'values', [value], 'cells', cells));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
		
		input.value = value + unit;
		mxEvent.consume(evt);
	});

	if (textEditFallback && graph.cellEditor.isContentEditing())
	{
		// KNOWN: Arrow up/down clear selection text in quirks/IE 8
		// Text size via arrow button limits to 16 in IE11. Why?
		mxEvent.addListener(input, 'mousedown', function()
		{
			if (document.activeElement == graph.cellEditor.textarea)
			{
				selState = graph.cellEditor.saveSelection();
			}
		});
		
		mxEvent.addListener(input, 'touchstart', function()
		{
			if (document.activeElement == graph.cellEditor.textarea)
			{
				selState = graph.cellEditor.saveSelection();
			}
		});
	}
	
	mxEvent.addListener(input, 'change', update);
	mxEvent.addListener(input, 'blur', update);
	
	return update;
};

/**
 * Adds the given option.
 */
BaseCalcPanel.prototype.createPanel = function()
{
	console.log("create BaseCalcPanel");

	var div = document.createElement('div');
	div.className = 'geCalcSection';
	div.style.padding = '0px 0px 0px 0px';
	
	return div;
};

/**
 * Adds the given option.
 */
BaseCalcPanel.prototype.createTitle = function(title)
{
	var div = document.createElement('div');
	div.style.padding = '0px 0px 6px 0px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.width = '200px';
	div.style.fontWeight = 'bold';
	mxUtils.write(div, title);
	
	return div;
};

/**
 * 
 */
BaseCalcPanel.prototype.createStepper = function(input, update, step, height, disableFocus, defaultValue, isFloat)
{
	step = (step != null) ? step : 1;
	height = (height != null) ? height : 8;
	
	if (mxClient.IS_QUIRKS)
	{
		height = height - 2;
	}
	else if (mxClient.IS_MT || document.documentMode >= 8)
	{
		height = height + 1;
	} 
	
	var stepper = document.createElement('div');
	mxUtils.setPrefixedStyle(stepper.style, 'borderRadius', '3px');
	stepper.style.border = '1px solid rgb(192, 192, 192)';
	stepper.style.position = 'absolute';
	
	var up = document.createElement('div');
	up.style.borderBottom = '1px solid rgb(192, 192, 192)';
	up.style.position = 'relative';
	up.style.height = height + 'px';
	up.style.width = '10px';
	up.className = 'geBtnUp';
	stepper.appendChild(up);
	
	var down = up.cloneNode(false);
	down.style.border = 'none';
	down.style.height = height + 'px';
	down.className = 'geBtnDown';
	stepper.appendChild(down);

	mxEvent.addListener(down, 'click', function(evt)
	{
		if (input.value == '')
		{
			input.value = defaultValue || '2';
		}
		
		var val = isFloat? parseFloat(input.value) : parseInt(input.value);
		
		if (!isNaN(val))
		{
			input.value = val - step;
			
			if (update != null)
			{
				update(evt);
			}
		}
		
		mxEvent.consume(evt);
	});
	
	mxEvent.addListener(up, 'click', function(evt)
	{
		if (input.value == '')
		{
			input.value = defaultValue || '0';
		}
		
		var val = isFloat? parseFloat(input.value) : parseInt(input.value);
		
		if (!isNaN(val))
		{
			input.value = val + step;
			
			if (update != null)
			{
				update(evt);
			}
		}
		
		mxEvent.consume(evt);
	});
	
	// Disables transfer of focus to DIV but also :active CSS
	// so it's only used for fontSize where the focus should
	// stay on the selected text, but not for any other input.
	if (disableFocus)
	{
		var currentSelection = null;
		
		mxEvent.addGestureListeners(stepper,
			function(evt)
			{
				// Workaround for lost current selection in page because of focus in IE
				if (mxClient.IS_QUIRKS || document.documentMode == 8)
				{
					currentSelection = document.selection.createRange();
				}
				
				mxEvent.consume(evt);
			},
			null,
			function(evt)
			{
				// Workaround for lost current selection in page because of focus in IE
				if (currentSelection != null)
				{
					try
					{
						currentSelection.select();
					}
					catch (e)
					{
						// ignore
					}
					
					currentSelection = null;
					mxEvent.consume(evt);
				}
			}
		);
	}
	
	return stepper;
};

/**
 * Adds the given option.
 */
BaseCalcPanel.prototype.createOption = function(label, isCheckedFn, setCheckedFn, listener)
{
	var div = document.createElement('div');
	div.style.padding = '6px 0px 1px 0px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.width = '200px';
	div.style.height = (mxClient.IS_QUIRKS) ? '27px' : '18px';
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.style.margin = '0px 6px 0px 0px';
	div.appendChild(cb);

	var span = document.createElement('span');
	mxUtils.write(span, label);
	div.appendChild(span);

	var applying = false;
	var value = isCheckedFn();
	
	var apply = function(newValue)
	{
		if (!applying)
		{
			applying = true;
			
			if (newValue)
			{
				cb.setAttribute('checked', 'checked');
				cb.defaultChecked = true;
				cb.checked = true;
			}
			else
			{
				cb.removeAttribute('checked');
				cb.defaultChecked = false;
				cb.checked = false;
			}
			
			if (value != newValue)
			{
				value = newValue;
				
				// Checks if the color value needs to be updated in the model
				if (isCheckedFn() != value)
				{
					setCheckedFn(value);
				}
			}
			
			applying = false;
		}
	};

	mxEvent.addListener(div, 'click', function(evt)
	{
		if (cb.getAttribute('disabled') != 'disabled')
		{
			// Toggles checkbox state for click on label
			var source = mxEvent.getSource(evt);
			
			if (source == div || source == span)
			{
				cb.checked = !cb.checked;
			}
			
			apply(cb.checked);
		}
	});
	
	apply(value);
	
	if (listener != null)
	{
		listener.install(apply);
		this.listeners.push(listener);
	}

	return div;
};

/**
 * The string 'null' means use null in values.
 */
BaseCalcPanel.prototype.createCellOption = function(label, key, defaultValue, enabledValue, disabledValue, fn, action, stopEditing)
{
	enabledValue = (enabledValue != null) ? ((enabledValue == 'null') ? null : enabledValue) : '1';
	disabledValue = (disabledValue != null) ? ((disabledValue == 'null') ? null : disabledValue) : '0';
	
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	return this.createOption(label, function()
	{
		// Seems to be null sometimes, not sure why...
		var state = graph.view.getState(graph.getSelectionCell());
		
		if (state != null)
		{
			return mxUtils.getValue(state.style, key, defaultValue) != disabledValue;
		}
		
		return null;
	}, function(checked)
	{
		if (stopEditing)
		{
			graph.stopEditing();
		}
		
		if (action != null)
		{
			action.funct();
		}
		else
		{
			graph.getModel().beginUpdate();
			try
			{
				var value = (checked) ? enabledValue : disabledValue;
				graph.setCellStyles(key, value, graph.getSelectionCells());
				
				if (fn != null)
				{
					fn(graph.getSelectionCells(), value);
				}
				
				ui.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
					'values', [value], 'cells', graph.getSelectionCells()));
			}
			finally
			{
				graph.getModel().endUpdate();
			}
		}
	},
	{
		install: function(apply)
		{
			this.listener = function()
			{
				// Seems to be null sometimes, not sure why...
				var state = graph.view.getState(graph.getSelectionCell());
				
				if (state != null)
				{
					apply(mxUtils.getValue(state.style, key, defaultValue) != disabledValue);
				}
			};
			
			graph.getModel().addListener(mxEvent.CHANGE, this.listener);
		},
		destroy: function()
		{
			graph.getModel().removeListener(this.listener);
		}
	});
};

/**
 * Adds the given color option.
 */
BaseCalcPanel.prototype.createColorOption = function(label, getColorFn, setColorFn, defaultColor, listener, callbackFn, hideCheckbox)
{
	var div = document.createElement('div');
	div.style.padding = '6px 0px 1px 0px';
	div.style.whiteSpace = 'nowrap';
	div.style.overflow = 'hidden';
	div.style.width = '200px';
	div.style.height = (mxClient.IS_QUIRKS) ? '27px' : '18px';
	
	var cb = document.createElement('input');
	cb.setAttribute('type', 'checkbox');
	cb.style.margin = '0px 6px 0px 0px';
	
	if (!hideCheckbox)
	{
		div.appendChild(cb);	
	}

	var span = document.createElement('span');
	mxUtils.write(span, label);
	div.appendChild(span);
	
	var value = getColorFn();
	var applying = false;
	var btn = null;

	var apply = function(color, disableUpdate, forceUpdate)
	{
		if (!applying)
		{
			applying = true;
			color = (/(^#?[a-zA-Z0-9]*$)/.test(color)) ? color : defaultColor;
			btn.innerHTML = '<div style="width:' + ((mxClient.IS_QUIRKS) ? '30' : '36') +
				'px;height:12px;margin:3px;border:1px solid black;background-color:' +
				mxUtils.htmlEntities((color != null && color != mxConstants.NONE) ?
				color : defaultColor) + ';"></div>';
			
			// Fine-tuning in Firefox, quirks mode and IE8 standards
			if (mxClient.IS_QUIRKS || document.documentMode == 8)
			{
				btn.firstChild.style.margin = '0px';
			}
			
			if (color != null && color != mxConstants.NONE)
			{
				cb.setAttribute('checked', 'checked');
				cb.defaultChecked = true;
				cb.checked = true;
			}
			else
			{
				cb.removeAttribute('checked');
				cb.defaultChecked = false;
				cb.checked = false;
			}
	
			btn.style.display = (cb.checked || hideCheckbox) ? '' : 'none';

			if (callbackFn != null)
			{
				callbackFn(color);
			}

			if (!disableUpdate)
			{
				value = color;
				
				// Checks if the color value needs to be updated in the model
				if (forceUpdate || hideCheckbox || getColorFn() != value)
				{
					setColorFn(value);
				}
			}
			
			applying = false;
		}
	};

	btn = mxUtils.button('', mxUtils.bind(this, function(evt)
	{
		this.editorUi.pickColor(value, function(color)
		{
			apply(color, null, true);
		});
		mxEvent.consume(evt);
	}));
	
	btn.style.position = 'absolute';
	btn.style.marginTop = '-4px';
	btn.style.right = (mxClient.IS_QUIRKS) ? '0px' : '20px';
	btn.style.height = '22px';
	btn.className = 'geColorBtn';
	btn.style.display = (cb.checked || hideCheckbox) ? '' : 'none';
	div.appendChild(btn);

	mxEvent.addListener(div, 'click', function(evt)
	{
		var source = mxEvent.getSource(evt);
		
		if (source == cb || source.nodeName != 'INPUT')
		{		
			// Toggles checkbox state for click on label
			if (source != cb)
			{
				cb.checked = !cb.checked;
			}
	
			// Overrides default value with current value to make it easier
			// to restore previous value if the checkbox is clicked twice
			if (!cb.checked && value != null && value != mxConstants.NONE &&
				defaultColor != mxConstants.NONE)
			{
				defaultColor = value;
			}
			
			apply((cb.checked) ? defaultColor : mxConstants.NONE);
		}
	});
	
	apply(value, true);
	
	if (listener != null)
	{
		listener.install(apply);
		this.listeners.push(listener);
	}
	
	return div;
};

/**
 * 
 */
BaseCalcPanel.prototype.createCellColorOption = function(label, colorKey, defaultColor, callbackFn, setStyleFn)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	return this.createColorOption(label, function()
	{
		// Seems to be null sometimes, not sure why...
		var state = graph.view.getState(graph.getSelectionCell());
		
		if (state != null)
		{
			return mxUtils.getValue(state.style, colorKey, null);
		}
		
		return null;
	}, function(color)
	{
		graph.getModel().beginUpdate();
		try
		{
			graph.setCellStyles(colorKey, color, graph.getSelectionCells());

			if (setStyleFn != null)
			{
				setStyleFn(color);
			}
			
			ui.fireEvent(new mxEventObject('styleChanged', 'keys', [colorKey],
				'values', [color], 'cells', graph.getSelectionCells()));
		}
		finally
		{
			graph.getModel().endUpdate();
		}
	}, defaultColor || mxConstants.NONE,
	{
		install: function(apply)
		{
			this.listener = function()
			{
				// Seems to be null sometimes, not sure why...
				var state = graph.view.getState(graph.getSelectionCell());
				
				if (state != null)
				{
					apply(mxUtils.getValue(state.style, colorKey, null));
				}
			};
			
			graph.getModel().addListener(mxEvent.CHANGE, this.listener);
		},
		destroy: function()
		{
			graph.getModel().removeListener(this.listener);
		}
	}, callbackFn);
};

/**
 * 
 */
BaseCalcPanel.prototype.addArrow = function(elt, height)
{
	height = (height != null) ? height : 10;
	
	var arrow = document.createElement('div');
	arrow.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
	arrow.style.padding = '6px';
	arrow.style.paddingRight = '4px';
	
	var m = (10 - height);
	
	if (m == 2)
	{
		arrow.style.paddingTop = 6 + 'px';
	}
	else if (m > 0)
	{
		arrow.style.paddingTop = (6 - m) + 'px';
	}
	else
	{
		arrow.style.marginTop = '-2px';
	}
	
	arrow.style.height = height + 'px';
	arrow.style.borderLeft = '1px solid #a0a0a0';
	arrow.innerHTML = '<img border="0" src="' + ((mxClient.IS_SVG) ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHBJREFUeNpidHB2ZyAGsACxDRBPIKCuA6TwCBB/h2rABu4A8SYmKCcXiP/iUFgAxL9gCi8A8SwsirZCMQMTkmANEH9E4v+CmsaArvAdyNFI/FlQ92EoBIE+qCRIUz168DBgsU4OqhinQpgHMABAgAEALY4XLIsJ20oAAAAASUVORK5CYII=' :
		IMAGE_PATH + '/dropdown.png') + '" style="margin-bottom:4px;">';
	mxUtils.setOpacity(arrow, 70);
	
	var symbol = elt.getElementsByTagName('div')[0];
	
	if (symbol != null)
	{
		symbol.style.paddingRight = '6px';
		symbol.style.marginLeft = '4px';
		symbol.style.marginTop = '-1px';
		symbol.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
		mxUtils.setOpacity(symbol, 60);
	}

	mxUtils.setOpacity(elt, 100);
	elt.style.border = '1px solid #a0a0a0';
	elt.style.backgroundColor = this.buttonBackgroundColor;
	elt.style.backgroundImage = 'none';
	elt.style.width = 'auto';
	elt.className += ' geColorBtn';
	mxUtils.setPrefixedStyle(elt.style, 'borderRadius', '3px');
	
	elt.appendChild(arrow);
	
	return symbol;
};

/**
 * 
 */
BaseCalcPanel.prototype.addUnitInput = function(container, unit, right, width, update, step, marginTop, disableFocus, isFloat)
{
	marginTop = (marginTop != null) ? marginTop : 0;
	
	var input = document.createElement('input');
	input.style.position = 'absolute';
	input.style.textAlign = 'right';
	input.style.marginTop = '-2px';
	input.style.right = (right + 12) + 'px';
	input.style.width = width + 'px';
	container.appendChild(input);
	
	var stepper = this.createStepper(input, update, step, null, disableFocus, null, isFloat);
	stepper.style.marginTop = (marginTop - 2) + 'px';
	stepper.style.right = right + 'px';
	container.appendChild(stepper);

	return input;
};

/**
 * 
 */
BaseCalcPanel.prototype.createRelativeOption = function(label, key, width, handler, init)
{
	width = (width != null) ? width : 44;
	
	var graph = this.editorUi.editor.graph;
	var div = this.createPanel();
	div.style.paddingTop = '10px';
	div.style.paddingBottom = '10px';
	mxUtils.write(div, label);
	div.style.fontWeight = 'bold';
	
	var update = mxUtils.bind(this, function(evt)
	{
		if (handler != null)
		{
			handler(input);
		}
		else
		{
			var value = parseInt(input.value);
			value = Math.min(100, Math.max(0, (isNaN(value)) ? 100 : value));
			var state = graph.view.getState(graph.getSelectionCell());
			
			if (state != null && value != mxUtils.getValue(state.style, key, 100))
			{
				// Removes entry in style (assumes 100 is default for relative values)
				if (value == 100)
				{
					value = null;
				}
				
				graph.setCellStyles(key, value, graph.getSelectionCells());
				this.editorUi.fireEvent(new mxEventObject('styleChanged', 'keys', [key],
					'values', [value], 'cells', graph.getSelectionCells()));
			}
	
			input.value = ((value != null) ? value : '100') + ' %';
		}
		
		mxEvent.consume(evt);
	});

	var input = this.addUnitInput(div, '%', 20, width, update, 10, -15, handler != null);

	if (key != null)
	{
		var listener = mxUtils.bind(this, function(sender, evt, force)
		{
			if (force || input != document.activeElement)
			{
				var ss = this.format.getSelectionState();
				var tmp = parseInt(mxUtils.getValue(ss.style, key, 100));
				input.value = (isNaN(tmp)) ? '' : tmp + ' %';
			}
		});
		
		mxEvent.addListener(input, 'keydown', function(e)
		{
			if (e.keyCode == 13)
			{
				graph.container.focus();
				mxEvent.consume(e);
			}
			else if (e.keyCode == 27)
			{
				listener(null, null, true);
				graph.container.focus();
				mxEvent.consume(e);
			}
		});
		
		graph.getModel().addListener(mxEvent.CHANGE, listener);
		this.listeners.push({destroy: function() { graph.getModel().removeListener(listener); }});
		listener();
	}

	mxEvent.addListener(input, 'blur', update);
	mxEvent.addListener(input, 'change', update);
	
	if (init != null)
	{
		init(input);
	}

	return div;
};

/**
 * 
 */
BaseCalcPanel.prototype.addLabel = function(div, title, right, width)
{
	width = (width != null) ? width : 61;
	
	var label = document.createElement('div');
	mxUtils.write(label, title);
	label.style.position = 'absolute';
	label.style.right = right + 'px';
	label.style.width = width + 'px';
	label.style.marginTop = '6px';
	label.style.textAlign = 'center';
	div.appendChild(label);
};

/**
 * 
 */
BaseCalcPanel.prototype.addKeyHandler = function(input, listener)
{
	mxEvent.addListener(input, 'keydown', mxUtils.bind(this, function(e)
	{
		if (e.keyCode == 13)
		{
			this.editorUi.editor.graph.container.focus();
			mxEvent.consume(e);
		}
		else if (e.keyCode == 27)
		{
			if (listener != null)
			{
				listener(null, null, true);				
			}

			this.editorUi.editor.graph.container.focus();
			mxEvent.consume(e);
		}
	}));
};

/**
 * 
 */
BaseCalcPanel.prototype.styleButtons = function(elts)
{
	for (var i = 0; i < elts.length; i++)
	{
		mxUtils.setPrefixedStyle(elts[i].style, 'borderRadius', '3px');
		mxUtils.setOpacity(elts[i], 100);
		elts[i].style.border = '1px solid #a0a0a0';
		elts[i].style.padding = '4px';
		elts[i].style.paddingTop = '3px';
		elts[i].style.paddingRight = '1px';
		elts[i].style.margin = '1px';
		elts[i].style.width = '24px';
		elts[i].style.height = '20px';
		elts[i].className += ' geColorBtn';
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
BaseCalcPanel.prototype.destroy = function()
{
	if (this.listeners != null)
	{
		for (var i = 0; i < this.listeners.length; i++)
		{
			this.listeners[i].destroy();
		}
		
		this.listeners = null;
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel = function(format, editorUi, container)
{
	BaseCalcPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(ArrangePanel, BaseCalcPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
ArrangePanel.prototype.init = function()
{
	var graph = this.editorUi.editor.graph;
	var ss = this.format.getSelectionState();

	// this.container.appendChild(this.addLayerOps(this.createPanel()));
	// Special case that adds two panels
	// this.addGeometry(this.container);
	// this.addEdgeGeometry(this.container);

	// if (!ss.containsLabel || ss.edges.length == 0)
	// {
	// 	this.container.appendChild(this.addAngle(this.createPanel()));
	// }
	
	// if (!ss.containsLabel && ss.edges.length == 0 &&
	// 	ss.style.shape != 'rectangle' &&
	// 	ss.style.shape != 'label')
	// {
	// 	this.container.appendChild(this.addFlip(this.createPanel()));
	// }
	
	// if (ss.vertices.length > 1)
	// {
	// 	this.container.appendChild(this.addAlign(this.createPanel()));
	// 	this.container.appendChild(this.addDistribute(this.createPanel()));
	// }
	
	// if (graph.isTable(ss.vertices[0]) ||
	// 	graph.isTableRow(ss.vertices[0]) ||
	// 	graph.isTableCell(ss.vertices[0]))
	// {
	// 	this.container.appendChild(this.addTable(this.createPanel()));
	// }
	
	// this.container.appendChild(this.addGroupOps(this.createPanel()));
	
	// if (ss.containsLabel)
	// {
	// 	// Adds functions from hidden style format panel
	// 	var span = document.createElement('div');
	// 	span.style.width = '100%';
	// 	span.style.marginTop = '0px';
	// 	span.style.fontWeight = 'bold';
	// 	span.style.padding = '10px 0 0 18px';
	// 	mxUtils.write(span, mxResources.get('style'));
	// 	this.container.appendChild(span);
			
	// 	new StyleCalcPanel(this.format, this.editorUi, this.container);
	// }
};

/**
 * 
 */
ArrangePanel.prototype.addTable = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	var ss = this.format.getSelectionState();
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '10px';

	var span = document.createElement('div');
	span.style.marginTop = '2px';
	span.style.marginBottom = '8px';
	span.style.fontWeight = 'bold';
	mxUtils.write(span, mxResources.get('table'));
	div.appendChild(span);
	
	var panel = document.createElement('div');
	panel.style.position = 'relative';
	panel.style.paddingLeft = '0px';
	panel.style.borderWidth = '0px';
	panel.className = 'geToolbarContainer';

	var btns = [
        ui.toolbar.addButton('geSprite-insertcolumnbefore', mxResources.get('insertColumnBefore'),
 		mxUtils.bind(this, function()
		{
			try
			{
				graph.insertTableColumn(ss.vertices[0], true);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		}), panel),
		ui.toolbar.addButton('geSprite-insertcolumnafter', mxResources.get('insertColumnAfter'),
		mxUtils.bind(this, function()
		{
			try
			{
				graph.insertTableColumn(ss.vertices[0], false);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		}), panel),
		ui.toolbar.addButton('geSprite-deletecolumn', mxResources.get('deleteColumn'),
		mxUtils.bind(this, function()
		{
			try
			{
				graph.deleteTableColumn(ss.vertices[0]);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		}), panel),
		ui.toolbar.addButton('geSprite-insertrowbefore', mxResources.get('insertRowBefore'),
		mxUtils.bind(this, function()
		{
			try
			{
				graph.insertTableRow(ss.vertices[0], true);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		}), panel),
		ui.toolbar.addButton('geSprite-insertrowafter', mxResources.get('insertRowAfter'),
		mxUtils.bind(this, function()
		{
			try
			{
				graph.insertTableRow(ss.vertices[0], false);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		}), panel),
		ui.toolbar.addButton('geSprite-deleterow', mxResources.get('deleteRow'),
		mxUtils.bind(this, function()
		{
			try
			{
				graph.deleteTableRow(ss.vertices[0]);
			}
			catch (e)
			{
				ui.handleError(e);
			}
		}), panel)];
	this.styleButtons(btns);
	div.appendChild(panel);
	btns[2].style.marginRight = '9px';
	
	return div;
};

/**
 * 
 */
ArrangePanel.prototype.addLayerOps = function(div)
{
	var ui = this.editorUi;
	
	var btn = mxUtils.button(mxResources.get('toFront'), function(evt)
	{
		ui.actions.get('toFront').funct();
	})
	
	btn.setAttribute('title', mxResources.get('toFront') + ' (' + this.editorUi.actions.get('toFront').shortcut + ')');
	btn.style.width = '100px';
	btn.style.marginRight = '2px';
	div.appendChild(btn);
	
	var btn = mxUtils.button(mxResources.get('toBack'), function(evt)
	{
		ui.actions.get('toBack').funct();
	})
	
	btn.setAttribute('title', mxResources.get('toBack') + ' (' + this.editorUi.actions.get('toBack').shortcut + ')');
	btn.style.width = '100px';
	div.appendChild(btn);
	
	return div;
};


/**
 * 
 */
ArrangePanel.prototype.addAlign = function(div)
{
	var graph = this.editorUi.editor.graph;
	div.style.paddingTop = '6px';
	div.style.paddingBottom = '12px';
	div.appendChild(this.createTitle(mxResources.get('align')));
	
	var stylePanel = document.createElement('div');
	stylePanel.style.position = 'relative';
	stylePanel.style.paddingLeft = '0px';
	stylePanel.style.borderWidth = '0px';
	stylePanel.className = 'geToolbarContainer';
	
	if (mxClient.IS_QUIRKS)
	{
		div.style.height = '60px';
	}
	
	var left = this.editorUi.toolbar.addButton('geSprite-alignleft', mxResources.get('left'),
		function() { graph.alignCells(mxConstants.ALIGN_LEFT); }, stylePanel);
	var center = this.editorUi.toolbar.addButton('geSprite-aligncenter', mxResources.get('center'),
		function() { graph.alignCells(mxConstants.ALIGN_CENTER); }, stylePanel);
	var right = this.editorUi.toolbar.addButton('geSprite-alignright', mxResources.get('right'),
		function() { graph.alignCells(mxConstants.ALIGN_RIGHT); }, stylePanel);

	var top = this.editorUi.toolbar.addButton('geSprite-aligntop', mxResources.get('top'),
		function() { graph.alignCells(mxConstants.ALIGN_TOP); }, stylePanel);
	var middle = this.editorUi.toolbar.addButton('geSprite-alignmiddle', mxResources.get('middle'),
		function() { graph.alignCells(mxConstants.ALIGN_MIDDLE); }, stylePanel);
	var bottom = this.editorUi.toolbar.addButton('geSprite-alignbottom', mxResources.get('bottom'),
		function() { graph.alignCells(mxConstants.ALIGN_BOTTOM); }, stylePanel);
	
	this.styleButtons([left, center, right, top, middle, bottom]);
	right.style.marginRight = '6px';
	div.appendChild(stylePanel);
	
	return div;
};


BaseCalcPanel.prototype.getUnit = function()
{
	var unit = this.editorUi.editor.graph.view.unit;
	
	switch(unit)
	{
		case mxConstants.POINTS:
			return 'pt';
		case mxConstants.INCHES:
			return '"';
		case mxConstants.MILLIMETERS:
			return 'mm';
	}
};

BaseCalcPanel.prototype.inUnit = function(pixels)
{
	return this.editorUi.editor.graph.view.formatUnitText(pixels);
};

BaseCalcPanel.prototype.fromUnit = function(value)
{
	var unit = this.editorUi.editor.graph.view.unit;
	
	switch(unit)
	{
		case mxConstants.POINTS:
			return value;
		case mxConstants.INCHES:
			return value * mxConstants.PIXELS_PER_INCH;
		case mxConstants.MILLIMETERS:
			return value * mxConstants.PIXELS_PER_MM;
	}
};

BaseCalcPanel.prototype.isFloatUnit = function()
{
	return this.editorUi.editor.graph.view.unit != mxConstants.POINTS;
};

BaseCalcPanel.prototype.getUnitStep = function()
{
	var unit = this.editorUi.editor.graph.view.unit;
	
	switch(unit)
	{
		case mxConstants.POINTS:
			return 1;
		case mxConstants.INCHES:
			return 0.1;
		case mxConstants.MILLIMETERS:
			return 0.5;
	}
};

/**
 * Adds the label menu items to the given menu and parent.
 */
TextCalcPanel = function(format, editorUi, container)
{
	BaseCalcPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(TextCalcPanel, BaseCalcPanel);

/**
 * Adds the label menu items to the given menu and parent.
 */
TextCalcPanel.prototype.init = function()
{
	this.container.style.borderBottom = 'none';
};


/**
 * Adds the label menu items to the given menu and parent.
 */
StyleCalcPanel = function(format, editorUi, container)
{
	BaseCalcPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(StyleCalcPanel, BaseCalcPanel);

/**
 * 
 */
StyleCalcPanel.prototype.defaultStrokeColor = 'black';

/**
 * Adds the label menu items to the given menu and parent.
 */
StyleCalcPanel.prototype.init = function()
{
	// var ui = this.editorUi;
	// var editor = ui.editor;
	// var graph = editor.graph;
	// var ss = this.format.getSelectionState();
	
	// if (!ss.containsLabel)
	// {
	// 	if (ss.containsImage && ss.vertices.length == 1 && ss.style.shape == 'image' &&
	// 		ss.style.image != null && ss.style.image.substring(0, 19) == 'data:image/svg+xml;')
	// 	{
	// 		this.container.appendChild(this.addSvgStyles(this.createPanel()));
	// 	}
		
	// 	if (!ss.containsImage || ss.style.shape == 'image')
	// 	{
	// 		this.container.appendChild(this.addFill(this.createPanel()));
	// 	}
	
	// 	this.container.appendChild(this.addStroke(this.createPanel()));
	// 	this.container.appendChild(this.addLineJumps(this.createPanel()));
	// 	var opacityPanel = this.createRelativeOption(mxResources.get('opacity'), mxConstants.STYLE_OPACITY, 41);
	// 	opacityPanel.style.paddingTop = '8px';
	// 	opacityPanel.style.paddingBottom = '8px';
	// 	this.container.appendChild(opacityPanel);
	// 	this.container.appendChild(this.addEffects(this.createPanel()));
	// }
	
	// var opsPanel = this.addEditOps(this.createPanel());
	
	// if (opsPanel.firstChild != null)
	// {
	// 	mxUtils.br(opsPanel);
	// }
	
	// this.container.appendChild(this.addStyleOps(opsPanel));
};


/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramCalcPanel = function(format, editorUi, container)
{
	BaseCalcPanel.call(this, format, editorUi, container);
	this.init();
};

mxUtils.extend(DiagramCalcPanel, BaseCalcPanel);

/**
 * Switch to disable page view.
 */
DiagramCalcPanel.showPageView = false;

/**
 * Specifies if the background image option should be shown. Default is true.
 */
DiagramCalcPanel.prototype.showBackgroundImageOption = false;

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramCalcPanel.prototype.init = function()
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;

	console.log("Init Diagram Calc Panel");
	this.container.appendChild(this.addView(this.createPanel()));

	// if (graph.isEnabled())
	// {
	// 	this.container.appendChild(this.addOptions(this.createPanel()));
	// 	this.container.appendChild(this.addPaperSize(this.createPanel()));
	// 	this.container.appendChild(this.addStyleOps(this.createPanel()));
	// }
};

/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramCalcPanel.prototype.addView = function(div)
{
	var ui = this.editorUi;
	var editor = ui.editor;
	var graph = editor.graph;
	
	var link = "https://azure-staging.microsoft.com/en-us/pricing/calculator/?debugScripts=https://localhost:8080/dest&diagramTool=true"
	var iframe = document.createElement('iframe');
	iframe.frameBorder=0;
	iframe.width="100%";
	offset = ui.getDiagramContainerOffset();
	iframe.height= (document.getElementsByClassName('geCalcContainer')[0].scrollHeight - 60) + "px";
	iframe.id="calculatorFrame";
	iframe.setAttribute("src", link);
	div.appendChild(iframe);
	// Grid
	// this.addGridOption(div);
	
	// // Page View
	// if (DiagramCalcPanel.showPageView)
	// {
	// 	div.appendChild(this.createOption(mxResources.get('pageView'), function()
	// 	{
	// 		return graph.pageVisible;
	// 	}, function(checked)
	// 	{
	// 		ui.actions.get('pageView').funct();
	// 	},
	// 	{
	// 		install: function(apply)
	// 		{
	// 			this.listener = function()
	// 			{
	// 				apply(graph.pageVisible);
	// 			};
				
	// 			ui.addListener('pageViewChanged', this.listener);
	// 		},
	// 		destroy: function()
	// 		{
	// 			ui.removeListener(this.listener);
	// 		}
	// 	}));
	// }
	
	// if (graph.isEnabled())
	// {
	// 	// Background
	// 	var bg = this.createColorOption(mxResources.get('background'), function()
	// 	{
	// 		return graph.background;
	// 	}, function(color)
	// 	{
	// 		var change = new ChangePageSetup(ui, color);
	// 		change.ignoreImage = true;
			
	// 		graph.model.execute(change);
	// 	}, '#ffffff',
	// 	{
	// 		install: function(apply)
	// 		{
	// 			this.listener = function()
	// 			{
	// 				apply(graph.background);
	// 			};
				
	// 			ui.addListener('backgroundColorChanged', this.listener);
	// 		},
	// 		destroy: function()
	// 		{
	// 			ui.removeListener(this.listener);
	// 		}
	// 	});
		
	// 	if (this.showBackgroundImageOption)
	// 	{
	// 		var btn = mxUtils.button(mxResources.get('image'), function(evt)
	// 		{
	// 			ui.showBackgroundImageDialog(null, ui.editor.graph.backgroundImage);
	// 			mxEvent.consume(evt);
	// 		})
		
	// 		btn.style.position = 'absolute';
	// 		btn.className = 'geColorBtn';
	// 		btn.style.marginTop = '-4px';
	// 		btn.style.paddingBottom = (document.documentMode == 11 || mxClient.IS_MT) ? '0px' : '2px';
	// 		btn.style.height = '22px';
	// 		btn.style.right = (mxClient.IS_QUIRKS) ? '52px' : '72px';
	// 		btn.style.width = '56px';
		
	// 		bg.appendChild(btn);
	// 	}
		
	// 	div.appendChild(bg);
	// }
	
	return div;
};



/**
 * Adds the label menu items to the given menu and parent.
 */
DiagramCalcPanel.prototype.destroy = function()
{
	BaseCalcPanel.prototype.destroy.apply(this, arguments);
	
	if (this.gridEnabledListener)
	{
		this.editorUi.removeListener(this.gridEnabledListener);
		this.gridEnabledListener = null;
	}
};
