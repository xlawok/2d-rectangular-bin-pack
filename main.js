document.addEventListener("DOMContentLoaded", function(event) {
//	console.log('ready');
	//var container;
	
	//Getting container dimensions
	var container_btn = document.getElementById('add_tank');
	var container_dimensions = document.getElementById('container_dimensions');
	function write_tank_dimensions(){
		tank_w = document.getElementById('tank_w').value;
		tank_h = document.getElementById('tank_h').value;
		if(BinPackerPrepareModules.tank.build(tank_w,tank_h)){
			
			console.log(BinPackerPrepareModules.tank);
			message.innerHTML = "";
			container_dimensions.innerText = ' ' + tank_w + ' x ' + tank_h;
		}
		else{
			message.innerHTML = "Input dimension is not an integer!";
		}
	
		activate_prepare();
	}
	container_btn.addEventListener('click',write_tank_dimensions);
	//Getting container dimensions  -END-
	
	//Get all boxes
	var box_btn = document.getElementById('add_box');
	function write_boxes_dimensions(){
		box_w = document.getElementById('box_w').value;
		box_h = document.getElementById('box_h').value;
		box_name = document.getElementById('box_name').value;
		if(BinPackerPrepareModules.boxes.build(box_name,box_w,box_h))
		{
			console.log(BinPackerPrepareModules.boxes.tmpSet);
			//show_list_of_boxes();
			add_to_displayed_list_of_boxes(box_name,box_w,box_h,BinPackerPrepareModules.boxes.tmpSet.length);
			activate_prepare();
		}
		
	}
	
	box_btn.addEventListener('click',write_boxes_dimensions);
    //Get all boxes -END-

	// Show list of boxes
	var box_list_el = document.getElementById('boxes_list');
	function show_list_of_boxes(){
		box_list_el.innerHTML = "";
		for(let i = 0, len = BinPackerPrepareModules.boxes.tmpSet.length; i < len; i ++){
			
			let li = document.createElement('li');
			let box_name = BinPackerPrepareModules.boxes.tmpSet[i].name;
			let box_h = BinPackerPrepareModules.boxes.tmpSet[i].height;
			let box_w = BinPackerPrepareModules.boxes.tmpSet[i].width;
			li.setAttribute('data-box-index',i);
			li.setAttribute('id',i);
			li.setAttribute('class','b_list');
			li.innerText = 'Name: ' + box_name;
			li.innerText = '[' + box_name + '] ' + box_h + ' x ' + box_w;
			box_list_el.appendChild(li);
		}
		all_boxes_nodes = document.getElementsByClassName('b_list');
		add_event_listener_to_list(all_boxes_nodes,'click',show_hide_input,remember_last_node); //after refresh
		activate_prepare();
	}

	// Show list of boxes - END -
	// Add to displayed list
	function add_to_displayed_list_of_boxes(box_name,box_w,box_h,alternate_name){
					
		let li = document.createElement('li');
		li.setAttribute('data-box-index',alternate_name-1);
		li.setAttribute('id',alternate_name-1);
		li.setAttribute('class','b_list');
		if(!box_name){box_name = alternate_name}//name of box is not required, if not add default
		li.innerText = '[' + box_name + '] ' + box_h + ' x ' + box_w;
		box_list_el.appendChild(li);
		add_event_listener_to_list(all_boxes_nodes,'click',show_hide_input,remember_last_node); //reload event listener after adding every element
	
	}
	// Add to displayed list - END - 
	// add event listener to list
	function add_event_listener_to_list(list,event,fn){
		for(let i = 0, len = list.length; i < len; i ++ )
		{
			list[i].addEventListener(event, fn);
		}
	}
	var all_boxes_nodes = document.getElementsByClassName('b_list');
	var remember_last_node = [];
	// add event listener to list - END -
	// show input and delete link for list elements
	function show_hide_input(){
		//remember previous and current node with innerText
		let tmpObj = {node: this, t: this.innerText}
		this.removeEventListener('click',show_hide_input);
		if(remember_last_node.length==0)
		{ 
			remember_last_node.push(tmpObj);
		}
	
		if((remember_last_node.length==1&&this.id!=remember_last_node[0].node.id)||(remember_last_node.length>1&&this.id!=remember_last_node[1].node.id)) {
			
			remember_last_node[0].node.addEventListener('click',show_hide_input);
			if(remember_last_node.push(tmpObj)&&remember_last_node.length>2){ //if third node clicked
			 remember_last_node.splice(0,1);
				//there can be only previous and current clicked box	
					//delete first element of array if there are more than 2 elements
			}
		}
		
		
		
		let i = this.id;//index of list array
		//get default values of selected list element
	
		let default_values = {
			name: BinPackerPrepareModules.boxes.tmpSet[i].name,
			width: BinPackerPrepareModules.boxes.tmpSet[i].width,
			height: BinPackerPrepareModules.boxes.tmpSet[i].height,
		};
		this.innerHTML = '<input id="edit_box_name" name="b_name" value="'+default_values.name +'">'+
		'<input id="edit_box_h" name="box_h" value="'+default_values.height +'">'+
		'<input id="edit_box_w" name="box_w" value="'+default_values.width +'">'+
		' <button id="delete_box_'+i+'" name="delete_box" data-del-box="'+i+'">DEL</button>'+
		' <button id="save_box_'+i+'" name="save_box" data-save-box="'+i+'">SAVE</button>';
		
		
		
		//hide previous input if another clicked
		
			if(remember_last_node.length>1)
			{
				remember_last_node[0].node.innerHTML = '';
				remember_last_node[0].node.innerText = remember_last_node[0].t;
				console.log(remember_last_node[0].node.id + ' '+ remember_last_node[1].node.id);
			}
		
		function remove_box(){
			let box_id = this.dataset.delBox;
			this.removeEventListener('click',remove_box,true);
			remember_last_node[0].node.removeEventListener('click',show_hide_input,true);
			if(BinPackerPrepareModules.boxes.tmpSet.splice(box_id,1)){
				
				show_list_of_boxes();
				
			}
		}
		function save_box(){
			let box_id = this.dataset.saveBox;
			this.removeEventListener('click',save_box,true);
			let name = document.getElementById('edit_box_name').value;
			let height = document.getElementById('edit_box_h').value;
			let width = document.getElementById('edit_box_w').value;
			//remember_last_node[0].node.removeEventListener('click',show_hide_input,true);
			if(activate_prepare(width,height)&&width.length>0&&height.length>0){
				let name = document.getElementById('edit_box_name').value;
				if(!name){name = box_id+1;}//default incremental name if name was not set
				BinPackerPrepareModules.boxes.tmpSet[box_id].width = Number(width);
				BinPackerPrepareModules.boxes.tmpSet[box_id].height = Number(height);
				BinPackerPrepareModules.boxes.tmpSet[box_id].name = name;
				message.innerHTML = "";
			}
			else
			{
				message.innerHTML = "Input dimension is not an integer!";
			}
			
				
				show_list_of_boxes();
				activate_prepare();
			
		}
	//	setTimeout(function(){
			let del_btn = document.getElementById('delete_box_'+i);
			let save_btn = document.getElementById('save_box_'+i);
			let previous_del_btn = document.getElementById('delete_box_'+remember_last_node[0].node.id);
		//	previous_del_btn.removeEventListener('click',remove_box);
			if (del_btn) del_btn.addEventListener('click',remove_box);
			if (save_btn) save_btn.addEventListener('click',save_box);
	//	}, 2000);
	}
	
	//// show input and delete link for list elements - END -
	//sort boxes and delete oversized
	var prepare_btn = document.getElementById('prepare');
	prepare_btn.addEventListener('click',prepare_boxes);
	function prepare_boxes(){
		
		if(BinPackerPrepareModules.prepare()){
			let show_oversized = document.getElementById('oversized');
			show_list_of_oversized_boxes();
			show_list_of_boxes();
			activate_insert_btn();
		}
	}

	function activate_prepare(){
		if(BinPackerPrepareModules.boxes.tmpSet.length>0&&number_validation(BinPackerPrepareModules.tank.width,BinPackerPrepareModules.tank.height))
		{
			prepare_btn.disabled=false;
		}
		else
		{
			prepare_btn.disabled=true;
		}
	}
	function activate_insert_btn(){
		if(BinPackerPrepareModules.boxes.tmpSet.length>0&&number_validation(BinPackerPrepareModules.tank.width,BinPackerPrepareModules.tank.height))
		{
			btn_insert_boxes.disabled=false;
		}
		else
		{
			btn_insert_boxes.disabled=true;
		}
	}
	var oversized_box_list_el = document.getElementById('oversized_boxes_list');
	function show_list_of_oversized_boxes(){
		oversized_box_list_el.innerHTML = "";
		for(let i = 0, len = BinPackerPrepareModules.list_oversized.length; i < len; i ++){
			
			let li = document.createElement('li');
			let box_name = BinPackerPrepareModules.list_oversized[i].name;
			let box_h = BinPackerPrepareModules.list_oversized[i].height;
			let box_w = BinPackerPrepareModules.list_oversized[i].width;
			li.setAttribute('data-box-index',i);
			li.setAttribute('id',i);
			li.setAttribute('class','b_list');
			li.innerText = 'Name: ' + box_name;
			li.innerText = '[' + box_name + '] ' + box_h + ' x ' + box_w;
			oversized_box_list_el.appendChild(li);
		}
		
	}
	var btn_insert_boxes = document.getElementById('insert_boxes');
	btn_insert_boxes.addEventListener('click',insert_boxes);

	



  });
function number_validation(){
	    let validation, tmp;
    for (let i = 0; i < arguments.length; i++) {
		if(Number.isInteger(Number(arguments[i]))){
			tmp = 0;
		}
		else{
			tmp = 1;
		}
		tmp += tmp;
    }
    if(tmp>0){return false;}else{return true;}
	
	
}

var BinPackerPrepareModules = (function (){
	var modules = {};
	function define(name, deps, impl) {
		for (var i=0; i<deps.length; i++) {
			deps[i] = modules[deps[i]];
		}
		modules[name] = impl.apply( impl, deps );
	}
	function get(name) {
		return modules[name];
	}
	var tank = {
		width: {},
		height: {},
		build: function(width,height){
			this.x = 0;
			this.y = 0;
			if(number_validation(width,height)){
				this.width = Number(width);
				this.height = Number(height);
				return true;
			}
			else
			{
				return false;
			}
			

		}
	}
	
	//build boxes set from a form BinPackerPrepareModules.boxes.build("zz",200,100);
	// get boxes set BinPackerPrepareModules.boxes.tmpSet;
	var boxes = {
		tmpSet: [],
		build: function(name,width,height){
			let message;
			message = document.getElementById("message");
			message.innerHTML = "";
			try{
				if(number_validation(width,height)&&width.length>0&&height.length>0)
				{ 
					if(!name){name = this.tmpSet.length + 1;}//default incremental name if name was not set
					this.tmpSet.push({name: name,width: Number(width),height: Number(height)});
					message.innerHTML = "";
					return true;
				}
				else	
				{
					throw "dimension is not an integer!";
				}
			}
			catch(err){
				message.innerHTML = "Input " + err;
			}
			finally{

			}

		}
	}
	var prepare = function (){
		oversized.delOversized(boxes.tmpSet);
		sorting.saveRotated(boxes.tmpSet);
		sorting.sortDescending(boxes.tmpSet);
		return true;
		
	}
//inicjacja obiektow zapakowanych pudelek oraz jeszcze wolne
	var   usedBoxes = [],
	freeBoxes = []
	cargo = [];
	var that,tmpBoxes;
	var insertMethods = ["RectBestShortSideFit",
						"RectBestLongSideFit",
						"RectBestAreaFit",
						"RectBottomLeftRule",
						"RectContactPointRule"];
	// get boxes that are oversized 
	var oversized = {
		//oversized boxes delete from main list
		delOversized: function(obj)
		{
			
			that = this;
			boxes.tmpSet = obj.filter(that.testAndSaveOversized);
		
			
		},
		testAndSaveOversized: function(value)
		{
		
		//oversized boxes copy to oversizedList
			if(that.getOversized(value,tank) || that.getUndersized(value,tank))
				{
					that.oversizedList.push(value); 
				}
				else
				{
					return value;
				}
			},
		
		getOversized: function(value,tank)
		{
	
			if((value.width > tank.width && value.width > tank.height) || (value.height > tank.width && value.height > tank.height))
			{
			
				return true;
			}
			else
			{
			
				
				return false;
			}
		},
		getUndersized: function(obj_pack)
		{
		
			if(obj_pack.width === 0 || obj_pack.height === 0)
			{
			return true;
			}
		},
		oversizedList: [],
		
	}
	// sorting
	var sorting = {
		saveRotated: function(arr)
						{
						//rotate box so width is shorter dimension
						var r_width, r_height;
						arr = arr.map(this.rotate)
	
					},
		rotate: function (value){
						//rotating
						r_width = value.width;
						r_height = value.height;
						if(r_width > r_height)
						{
							
							value.width = r_height;
							value.height = r_width;
						}
		},
		sortDescending: function (arr)
						{
						//sort descending shorter side 
						//when two boxes are equal than longer side descending
						arr.sort(function (a, b) 
						{
							if(a.width == b.width)
							{
							return b.height - a.height;  
							}
							else
							{
							return b.width - a.width;
							}
						});
					},
	}
	
  return {
	boxes: boxes,
	tank: tank,
	define: define,
	get: get,
	prepare: prepare,
	list_oversized: oversized.oversizedList,
  };
})();
var BinPackerInsertModules = (function (){
	function insert(boxes, method)
	{
	  
	
	
		while(boxes.length > 0)
		{
	   
		  var bestScore1 = scoring.score1;
			var bestScore2 = scoring.score2;
			var bestBoxIndex = -1;
	
		  var bestNode;
	
			for (var i=0,  tot=boxes.length; i < tot; i++)
			{
		  
			  //////
		   //   var score1;
		   //   var score2;
				var newNode = ScoreBox(boxes[i].width, boxes[i].height, method,boxes[i].name);
	
				if (score1 < bestScore1 || (score1 == bestScore1 && score2 < bestScore2))
				{
				
					bestScore1 = score1;
					bestScore2 = score2;
					bestNode = newNode;
					bestBoxIndex = i;
				}
			}
	
			if (bestBoxIndex == -1){
			return;
			}
	
			  
		  PlaceBox(bestNode);
		  boxes.splice(bestBoxIndex,1);
	
		}
	}
	function ScoreBox(width,height, method,name) 
	{
		var newNode;
		score1 = scoring.score1;
		score2 = scoring.score2;
		switch(method)
		{
		  case "RectBestShortSideFit": 
			newNode = FindPositionForNewNodeBestShortSideFit(width, height, name); 
			break;
		  case "RectBottomLeftRule":
			newNode = FindPositionForNewNodeBottomLeft(width, height, name); 
			break;
		  case "RectContactPointRule": 
			newNode = FindPositionForNewNodeContactPoint(width, height, name); 
			score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
			break;
		  case "RectBestLongSideFit":
			newNode = FindPositionForNewNodeBestLongSideFit(width, height, name); 
			break;
		  case "RectBestAreaFit":
			newNode = FindPositionForNewNodeBestAreaFit(width, height, name); 
			break;
		}
	
		// Cannot fit the current rectangle.
		if (newNode.height == 0)
		{
			score1 = scoring.score1;
			score2 = scoring.score2;
		}
	
		return newNode;
	}
	
	function  CommonIntervalLength(i1start,i1end,i2start,i2end)
	{
		if (i1end < i2start || i2end < i1start)
		{	
			return 0;
		}
		return Math.min(i1end, i2end) - Math.max(i1start, i2start);
	}
	
	function ContactPointScoreNode(x,y,width,height)
	{
		var score = 0;
	
		if (x == 0 || x + width == container.width)
			score += height;
		if (y == 0 || y + height == container.height)
			score += width;
	
		for(var i=0,  tot=usedBoxes.length; i < tot; i++)
		{
			if (usedBoxes[i].x == x + width || usedBoxes[i].x + usedBoxes[i].width == x)
				score += CommonIntervalLength(usedBoxes[i].y, usedBoxes[i].y + usedBoxes[i].height, y, y + height);
			if (usedBoxes[i].y == y + height || usedBoxes[i].y + usedBoxes[i].height == y)
				score += CommonIntervalLength(usedBoxes[i].x, usedBoxes[i].x + usedBoxes[i].width, x, x + width);
		}
		return score;
	}
	function FindPositionForNewNodeContactPoint(width,height,name)
	{
		var bestNode ={};
		
	
		bestContactScore = -1;
	
		for (var i=0,  tot=freeBoxes.length; i < tot; i++)
		{
			// Try to place the rectangle in upright (non-flipped) orientation.
			if (freeBoxes[i].width >= width && freeBoxes[i].height >= height)
			{
				var score = ContactPointScoreNode(freeBoxes[i].x, freeBoxes[i].y, width, height);
				if (score > bestContactScore)
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestNode.name = name;
					bestContactScore = score;
				}
			}
			if (freeBoxes[i].width >= height && freeBoxes[i].height >= width)
			{
				var score = ContactPointScoreNode(freeBoxes[i].x, freeBoxes[i].y, height, width);
				if (score > bestContactScore)
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestNode.name = name;
					bestContactScore = score;
				}
			}
		}
		score = bestContactScore;
		return bestNode;
	}
	
	function FindPositionForNewNodeBottomLeft(width,height,name)
	{
		var bestNode ={};
		
	
		bestY = scoring.score1;
		bestX = scoring.score2;
	
		for (var i=0,  tot=freeBoxes.length; i < tot; i++)
		{
			// Try to place the rectangle in upright (non-flipped) orientation.
			if (freeBoxes[i].width >= width && freeBoxes[i].height >= height)
			{
				var topSideY = freeBoxes[i].y + height;
				if (topSideY < bestY || (topSideY == bestY && freeBoxes[i].x < bestX))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestNode.name = name;
					bestY = topSideY;
					bestX = freeBoxes[i].x;
				}
			}
			if (freeBoxes[i].width >= height && freeBoxes[i].height >= width)
			{
				var topSideY = freeBoxes[i].y + width;
				if (topSideY < bestY || (topSideY == bestY && freeBoxes[i].x < bestX))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestNode.name = name;
					bestY = topSideY;
					bestX = freeBoxes[i].x;
				}
			}
		}
		  score1 = bestX;
		score2 = bestY;
		return bestNode;
	}
	
	
	function FindPositionForNewNodeBestAreaFit(width,height,name) 
	{
		var bestNode ={};
		
	
		bestAreaFit = scoring.score1;
		bestShortSideFit = scoring.score2;
	
		for (var i=0,  tot=freeBoxes.length; i < tot; i++)
		{
			var areaFit = freeBoxes[i].width * freeBoxes[i].height - width * height;
			
	
			// Try to place the rectangle in upright (non-flipped) orientation.
			if (freeBoxes[i].width >= width && freeBoxes[i].height >= height)
			{
				var leftoverHoriz = Math.abs(freeBoxes[i].width - width);
				var leftoverVert = Math.abs(freeBoxes[i].height - height);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);
	
				if (areaFit < bestAreaFit || (areaFit == bestAreaFit && shortSideFit < bestShortSideFit))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestNode.name = name;
					bestShortSideFit = shortSideFit;
					bestAreaFit = areaFit;
				}
			}
	
			if (freeBoxes[i].width >= height && freeBoxes[i].height >= width)
			{
				var flippedLeftoverHoriz = Math.abs(freeBoxes[i].width - height);
				var flippedLeftoverVert = Math.abs(freeBoxes[i].height - width);
				var flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
				
	
				if (areaFit < bestAreaFit || (areaFit == bestAreaFit && flippedShortSideFit < bestShortSideFit))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestNode.name = name;
					bestShortSideFit = flippedShortSideFit;
					bestAreaFit = areaFit;
				}
			}
		}
	  score1 = bestShortSideFit;
		score2 = bestAreaFit;
		return bestNode;
	}
	
	function FindPositionForNewNodeBestLongSideFit(width,height,name) 
	{
		var bestNode ={};
		
		var bestShortSideFit = scoring.score1;
		var bestLongSideFit = scoring.score2;
		for (var i=0,  tot=freeBoxes.length; i < tot; i++)
		{
	
		  
		  // Try to place the rectangle in upright (non-flipped) orientation.
			if (freeBoxes[i].width >= width && freeBoxes[i].height >= height)
			{
				var leftoverHoriz = Math.abs(freeBoxes[i].width - width);
				var leftoverVert = Math.abs(freeBoxes[i].height - height);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);
				var longSideFit = Math.max(leftoverHoriz, leftoverVert);
	
				if (longSideFit < bestLongSideFit || (longSideFit == bestLongSideFit && shortSideFit < bestShortSideFit))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestNode.name = name;
					bestShortSideFit = shortSideFit;
					bestLongSideFit = longSideFit;
				}
			}
	
			if (freeBoxes[i].width >= height && freeBoxes[i].height >= width)
			{
				var flippedLeftoverHoriz = Math.abs(freeBoxes[i].width - height);
				var flippedLeftoverVert = Math.abs(freeBoxes[i].height - width);
				var flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
				var flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
	
				if (flippedLongSideFit < bestLongSideFit || (flippedLongSideFit == bestLongSideFit && flippedShortSideFit < bestShortSideFit))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestNode.name = name;
					bestShortSideFit = flippedShortSideFit;
					bestLongSideFit = flippedLongSideFit;
				}
			}
		}
	  score1 = bestShortSideFit;
	  score2 = bestLongSideFit;
		return bestNode;
	}
	function FindPositionForNewNodeBestShortSideFit(width,height,name) 
	{
		var bestNode ={};
		
		var bestShortSideFit = scoring.score1;
		var bestLongSideFit = scoring.score2;
		for (var i=0,  tot=freeBoxes.length; i < tot; i++)
		{
	
		  
		  // Try to place the rectangle in upright (non-flipped) orientation.
			if (freeBoxes[i].width >= width && freeBoxes[i].height >= height)
			{
				var leftoverHoriz = Math.abs(freeBoxes[i].width - width);
				var leftoverVert = Math.abs(freeBoxes[i].height - height);
				var shortSideFit = Math.min(leftoverHoriz, leftoverVert);
				var longSideFit = Math.max(leftoverHoriz, leftoverVert);
	
				if (shortSideFit < bestShortSideFit || (shortSideFit == bestShortSideFit && longSideFit < bestLongSideFit))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = width;
					bestNode.height = height;
					bestNode.name = name;
					bestShortSideFit = shortSideFit;
					bestLongSideFit = longSideFit;
				}
			}
	
			if (freeBoxes[i].width >= height && freeBoxes[i].height >= width)
			{
				var flippedLeftoverHoriz = Math.abs(freeBoxes[i].width - height);
				var flippedLeftoverVert = Math.abs(freeBoxes[i].height - width);
				var flippedShortSideFit = Math.min(flippedLeftoverHoriz, flippedLeftoverVert);
				var flippedLongSideFit = Math.max(flippedLeftoverHoriz, flippedLeftoverVert);
	
				if (flippedShortSideFit < bestShortSideFit || (flippedShortSideFit == bestShortSideFit && flippedLongSideFit < bestLongSideFit))
				{
					bestNode.x = freeBoxes[i].x;
					bestNode.y = freeBoxes[i].y;
					bestNode.width = height;
					bestNode.height = width;
					bestNode.name = name;
					bestShortSideFit = flippedShortSideFit;
					bestLongSideFit = flippedLongSideFit;
				}
			}
		}
	  score1 = bestShortSideFit;
	  score2 = bestLongSideFit;
		return bestNode;
	}
	
	function PlaceBox(box)
	{
		   tot=freeBoxes.length;
	
		for (var i=0; i < tot; i++)
		{
		
	   
		 
			if (SplitFreeNode(freeBoxes[i], box))
			{
			  freeBoxes.splice(i, 1);
			  i--;
			  tot--;
	
			}
		}
	
		PruneFreeList();
	
		usedBoxes.push(box);
	 
		
	}
	function PruneFreeList()
	{
		
	
		/// Go through each pair and remove any rectangle that is redundant.
		for (var i=0,  tot=freeBoxes.length; i < tot; i++)
	   {   
			for(var j= i + 1; j < freeBoxes.length; j++)
			{
				
			  
		  if (IsContainedIn(freeBoxes[i], freeBoxes[j]))
				{
					freeBoxes.splice(i,1);
					i--;
					break;
				}
				if (IsContainedIn(freeBoxes[j], freeBoxes[i]))
				{
					freeBoxes.splice(j,1);
					j--;
				}
			}
	}
	}
	function IsContainedIn(a, b)
	{
		return a.x >= b.x && a.y >= b.y 
			&& a.x+a.width <= b.x+b.width 
			&& a.y+a.height <= b.y+b.height;
	}
	function SplitFreeNode(freeNode,usedNode)
	{
		
	
		// Test with SAT if the rectangles even intersect.
		if (usedNode.x >= freeNode.x + freeNode.width || usedNode.x + usedNode.width <= freeNode.x ||
			usedNode.y >= freeNode.y + freeNode.height || usedNode.y + usedNode.height <= freeNode.y)
			{ 
			  return false;
		   }
	
		if (usedNode.x < freeNode.x + freeNode.width && usedNode.x + usedNode.width > freeNode.x)
		{
		
		  // New node at the top side of the used node.
			if (usedNode.y > freeNode.y && usedNode.y < freeNode.y + freeNode.height)
			{
			
		  newNode = Object.assign({},freeNode);
				newNode.height = usedNode.y - newNode.y;
				freeBoxes.push(newNode);
			}
	
			// New node at the bottom side of the used node.
			if (usedNode.y + usedNode.height < freeNode.y + freeNode.height)
			{
				
		  newNode =  Object.assign({},freeNode);
				newNode.y = usedNode.y + usedNode.height;
				newNode.height = freeNode.y + freeNode.height - (usedNode.y + usedNode.height);
				freeBoxes.push(newNode);
			}
		}
	
		if (usedNode.y < freeNode.y + freeNode.height && usedNode.y + usedNode.height > freeNode.y)
		{
	
		  // New node at the left side of the used node.
			if (usedNode.x > freeNode.x && usedNode.x < freeNode.x + freeNode.width)
			{
				newNode =  Object.assign({},freeNode);
				newNode.width = usedNode.x - newNode.x;
				freeBoxes.push(newNode);
			}
	
			// New node at the right side of the used node.
			if (usedNode.x + usedNode.width < freeNode.x + freeNode.width)
			{
				newNode =  Object.assign({},freeNode);
				newNode.x = usedNode.x + usedNode.width;
				newNode.width = freeNode.x + freeNode.width - (usedNode.x + usedNode.width);
				freeBoxes.push(newNode);
			}
		}
	  
	  //freeBoxes.push(newNode);
	  //freeBoxes.push(newNode2);
	 
		return true;
	}
	return {
		insert: insert,
	}
})();


//inicjacja wszystkich pudel
function Boxes(boxes){
	this.Boxes = boxes.slice(0);
}



//init
var   usedBoxes = [],
	  freeBoxes = []
	  cargo = [];
var that,tmpBoxes;
var insertMethods = ["RectBestShortSideFit",
										"RectBestLongSideFit",
										"RectBestAreaFit",
										"RectBottomLeftRule",
										"RectContactPointRule"];
var scoring = {
	score1: Number.MAX_SAFE_INTEGER,
	score2: Number.MAX_SAFE_INTEGER,
	



}
var container = BinPackerPrepareModules.tank;
function insert_boxes(){
	for (var i=0;  i<insertMethods.length;  i++)
	{

		//clean usedBoxes if not empty
		if (usedBoxes.length>0){usedBoxes.length = 0;}
		//init free space
		if (freeBoxes.length>0)
		{
			freeBoxes.length = 0; 
			freeBoxes.push(container);
		}
		else
		{
			freeBoxes.push(container);
		}
		tmpBoxes = new Boxes(BinPackerPrepareModules.boxes.tmpSet);
		
		BinPackerInsertModules.insert(tmpBoxes.Boxes,insertMethods[i]);
		cargo[i] = {insertMethod:insertMethods[i],usedBoxes: usedBoxes.slice(0), freeBoxes: freeBoxes.slice(0), container: container};
		
	}
	show_cargo(cargo[0].usedBoxes);
	show_select();
	document.getElementById("select-method").disabled=false;	
}	
function show_select(){
	let html_output;
	for (let i=0;  i<insertMethods.length;  i++)
	{
		html_output += '<option value="'+i+'">'+insertMethods[i]+'</option>';
	}
	
	document.getElementById("select-method").innerHTML = html_output;
}
