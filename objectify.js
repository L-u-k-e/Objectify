function register(instance, element_type, properties){  
  instance.element = document.createElement(element_type);
  instance.element.object_ = instance;
  for(var key in properties){ 
    instance.element[key] = properties[key]; 
  }
}

//function to recursively tether an element and all of its children to 
//an object. This function will NOT overwrite predefined object trees. 
function __tether(instance, element){
  if(element.object_){ instance = element.object_; }
  element.object_ = instance;
  //console.log(element + ' has been tethered to: ' + instance);
  for(var i=0; i<element.children.length; i++){
    __tether(instance, element.children[i]);
  }
}

//observe body for addition of new nodes and assign them the proper
//object_ property if applicable.
var __observer = new MutationObserver(function(mutations){
  mutations.forEach(function(mutation){
    var new_nodes = mutation.addedNodes;
    for(var i=0; i<new_nodes.length; i++){
      var element = new_nodes[i];
      if(element.object_){ __tether(element.object_, element); }
      else{
        var parent = element.parentElement;
        if(parent && parent.object_){ __tether(parent.object_, element); }
      }
    }
  });
});
var __config = { subtree: true, childList: true };
__observer.observe(document, __config);
