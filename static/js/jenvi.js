var labelType, useGradients, nativeTextSupport, animate;
var rootNodeName;
var st;

(function() {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport 
        && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
  elem: false,
  write: function(text){
    if (!this.elem) 
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

function translateColour(colour) {
  switch(colour) {
    case "blue":
      return "#0f0";
      break;
    case "blue_anime":
      return "#aaf";
      break;  
    case "red":
      return "#f00";
      break;
    case "red_anime":
      return "#f80";
      break;
    case "yellow":
      return "#ff0";
      break;
    case "yellow_anime":
      return "#ff0";
      break;  
    default:
      return "#aaa";
  }
}

var nodeWidth = 100;
var nodeHeight = 40;

function createLabel(label, node){
    label.id = node.id;            
    label.innerHTML = node.name + ' #' + '<span>' + node.data.buildNumber + '</span>';
    label.onclick = function(){
  	  st.onClick(node.id);
    };
    //set label styles
    var style = label.style;
    style.width = nodeWidth + 'px';
    style.height = nodeHeight + 'px';            
    style.cursor = 'pointer';
    style.color = '#333';
    style.fontSize = '0.8em';
    style.textAlign= 'center';
    style.paddingTop = '3px';
}

function createSpaceTree() {
   return new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
        //set duration for the animation
        duration: 800,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 50,
        levelsToShow: 4,

        orientation: "right",
        align: "center",
        offsetX: -340,

        //enable panning
        Navigation: {
          enable:true,
          panning:true
        },
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: nodeHeight,
            width: nodeWidth,
            type: 'rectangle',
            color: '#aaa',
            overridable: true
        },
      
        Edge: {
            type: 'bezier',
            overridable: true
        },
      
        onBeforeCompute: function(node){
            Log.write("loading " + node.name);
        },
      
        onAfterCompute: function(){
            Log.write("done");
        },
      
        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel: createLabel,
      
        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function(node){
          node.data.$color = translateColour(node.data.status)
        },
      
        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = "#eed";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
}

function createRootNode(project) {
  rootNodeName = project.displayName;
  return convertProjectToNode(project);
}
function convertProjectToNode(project) {
  return {
    "id" : project.displayName,
    "name" : project.displayName,
    "data" : { 
      "status" : project.color,
      "buildNumber" : project.lastCompletedBuild.number,
      },
    "children" : []
  }
}

function retrieveJobInfo(project, node) {
  $.getJSON(project.url + 'api/json?jsonp=?', function(data) {
    var newNode = convertProjectToNode(data);
    node.children.push(newNode);
    $.each(data.upstreamProjects, function(index, project) {
      retrieveJobInfo(project, newNode);
    });
  });
}

function buildItemList(data) {
    var items = [];
    items.push('<li>' + data.displayName + '</li>');
    items.push('<li>' + data.color + '</li>');
    items.push('<li>#' + data.lastCompletedBuild.number + '</li>');
    items.push('<li>Upstream builds:<ul>');
    $.each(data.upstreamProjects, function(key, value) {
      items.push('<li>' + value.name + ' : ' + value.color + '</li>');
    });
    items.push('</ul></li>');
    items.push('<li>Downstream builds:<ul>');
    $.each(data.downstreamProjects, function(key, value) {
      items.push('<li>' + value.name + ' : ' + value.color + '</li>');
    });
    items.push('</ul></li>');
    
    $('<ul/>', {
      'class': 'my-new-list',
      html: items.join('')
    }).appendTo('#stuff');
}

function buildTree(st, jobUrl, onComplete) {
  $.getJSON(jobUrl + '/api/json?jsonp=?', function(data) {
    
    rootNode = createRootNode(data);
    var upstreamProjects = data.upstreamProjects;
    $.each(upstreamProjects, function(index, project) {
      retrieveJobInfo(project, rootNode);
    });
    
    buildItemList(data);
  });  
}

function init() {
  st = createSpaceTree();
  
  //Add event handlers to switch spacetree orientation.
  var top = $jit.id('r-top'), 
      left = $jit.id('r-left'), 
      bottom = $jit.id('r-bottom'), 
      right = $jit.id('r-right'),
      normal = $jit.id('s-normal');

  function changeHandler() {
      if(this.checked) {
          top.disabled = bottom.disabled = right.disabled = left.disabled = true;
          st.switchPosition(this.value, "animate", {
              onComplete: function(){
                  top.disabled = bottom.disabled = right.disabled = left.disabled = false;
              }
          });
      }
  };

  top.onchange = left.onchange = bottom.onchange = right.onchange = changeHandler;
  //end
  
  
  var addButton = document.getElementById('loadPipeline');
  var jobUrlField = document.getElementById('jobUrl');
  addButton.onclick = function() {
    buildTree(st, jobUrlField.value);
  };
  
  var refreshButton = document.getElementById('showTree');
  refreshButton.onclick = function() {
     //load json data
     st.loadJSON(rootNode);
     //compute node positions and layout
     st.compute();
     //optional: make a translation of the tree
     st.geom.translate(new $jit.Complex(-200, 0), "current");
     //emulate a click on the root node.
     st.onClick(st.root);
     //end
  };
};