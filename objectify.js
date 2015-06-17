/**************************************************************************
  Objectify.js  version: 1.0.1                                          
                                                                        
  Author: Lucas Parzych                                                 
  MIT License: You are free to use this code however you want. Have Fun!
**************************************************************************/



/*
Description:
  This is the function you call to register your object. 

Parameters:
  instance     {object}: The object you need to reference from your
                         DOM elements.
  element_type {string}: Tag name to be passed to document.createElement()
  properties   {object}: A hash that holds property names/values you want to
                         assign to the containing element. 

Behaviour:
  An element of type $element_type will be created with the properties 
  specified in $properties. It will also have an 'object_' property, which
  points to $instance. A property called 'element' will be added to $instance,
  which points to the newly created element.

Hints:
  The argument passed as $instance should usually be 'this' and the function 
  should usually be called at the top of a class definition.

Example:
  function MyClass(){
    register(this, 'div', {className: 'my-class'});
    
    console.log(this.element);           // [HTMLDivElement]
    console.log(this.element.object_);   // (this)
    console.log(this.element.className); // 'my-class' 
  }   
*/   
function register(instance, element_type, properties){  
  instance.element = document.createElement(element_type);
  instance.element.object_ = instance;
  for(var key in properties){ 
    instance.element[key] = properties[key]; 
  }
}









// Observe document for the addition of new nodes.
// Assign them the proper object_ property if applicable.
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



// Recursively tether an element and all of its children to object. 
// This function will NOT overwrite predefined object trees. 
function __tether(instance, element){
  if(element.object_){ instance = element.object_; }
  element.object_ = instance;
  //console.log(element + ' has been tethered to: ' + instance);
  for(var i=0; i<element.children.length; i++){
    __tether(instance, element.children[i]);
  }
}