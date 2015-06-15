# What is Objectify?
Objectify is a leightweight framework that aims to clean up event listeners and eliminate boilerplate code in class definitions. 

#What problem does it solve?
Many aspects of GUI programming (and indeed Javascript in general) lend themselves to an OOP approach. You can define a class that churns out widgets and implement event listeners that delegate all their work to instance methods (which have useful instance variables, and also other methods/functions, at their disposal).

The problem left to solve when implementing the above approach is as follows: users interact with (and event listeners deal with) elements in the DOM, but your precious instance methods belong to an instance of a class that you created.  So, you need to create a link between your object and, not only the containing element that represents it, but also all of the children of that element that are ultimately going to be referenced via `event.target` 
#####Enter Objectify!
**`Objectify`** instantiates a [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) object that listens for the addition of new nodes in the DOM. Whenever you add an element that is a child of an element that you have registered via the `register` method, a property, named `object_`, that holds a reference to the instance of your class, is automatically added to that element. 

The end result is event listeners that look like this:

```
$(body).on('click', '.my-objects-class>.....>button', function(event){
  event.target.object_.instanceMethod();
}
```
Rather than this:

```
$('.my-objects-class').on('click', '.my-objects-class>.....>button', function(event){
  $(event.target).parents('.my-objects-class')[0].object_.instanceMethod();
}
```

This is even assuming that you have jquery included in your project and that you can identify the element that you tethered your object to with a css selector. If this is not the case, things can get messy and regardless, its not something you want to repeat in muiltiple event listeners. 

You could also manually insert the `object_` property on the elements that you need it on when you create them inside your class definition, but neither approach is very DRY.

By implementing a constrained heredity on the DOM elements themselves, **`Objectify`** lifts you up above the slime and allows you to work on a higher level of abstraction.  

#How do I use it? 

These are the three variables you need to know about:
 - `register` is a function that you use to register your objects when they are first instantiated. Its just a helper function that sets up the initial linking. Rather than try to explain with words, this the code itself:

 ```javascript
  function register(instance, element_type, properties){  
    instance.element = document.createElement(element_type);
    instance.element.object_ = instance;
    for(var key in properties){
      instance.element[key] = properties[key];
    }
  }
```

 - `object_` is the property that holds a reference to your object. This property will automatically be added to all children of `instance.element`(don't worry you can nest objects and everything will still work the way you want it to).
 - `element` is an instance vaiable that is added to your object, so you can reference it from within the class.  
 
