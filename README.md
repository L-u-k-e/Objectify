# What is Objectify?
Objectify is a leightweight library that aims to clean up event listeners and eliminate boilerplate code in class definitions. 

#What problem does it solve?
Many aspects of GUI programming (and Javascript in general) lend themselves to an object oriented approach. You can define a class that churns out objects which are represented by elements in the DOM and implement event listeners that delegate all their work to instance methods (which have useful instance variables, and also other methods, at their disposal).

The problem left to solve when implementing the above approach is as follows: users interact with (and event listeners deal with) elements in the DOM, but your precious instance methods belong to an instance of a class that you created.  So, you need to create a link between your object and, not only the containing element that represents it, but also all of the children of that element that are ultimately going to be referenced via `event.target` 
###Enter Objectify!
**`Objectify`** instantiates a [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) object that listens for the addition of new nodes in the DOM. Whenever you add an element that is a child of an element that you have registered via the `register` method, a property, named `object_`, that holds a reference to the instance of your class, is automatically added to that element. 

The end result is event listeners that look like this:

```javascript
$('body').on('click', '.my-objects-class>[...]>button', function(event){
  event.target.object_.instanceMethod();
}
```
Rather than this:

```javascript
$('body').on('click', '.my-objects-class>[...]>button', function(event){
  $(event.target).parents('.my-objects-class')[0].object_.instanceMethod();
}
```
The above example is even assuming that you have [`jQuery`](https://jquery.com/) included in your project and that you can identify the element that you tethered your object to with a css selector. If this is not the case, things can get messy and regardless, it's not something you want to repeat in multiple event listeners. 

You could also manually insert the `object_` property on the elements that you need it on when you create them inside your class definition, but neither approach is very DRY.

By implementing constrained heredity on the DOM elements themselves, **`Objectify`** lifts you up above the slime and allows you to work on a higher level of abstraction.  

#How do I use it? 

These are the three variables you need to know about:
 - `register` is a function that you use to register your objects when they are first instantiated. It's just a helper function that sets up the initial linking. Rather than trying to explain with words, here's the code itself:

 ```javascript
  register: function(instance, element_type, properties){  
    instance.element = document.createElement(element_type);
    instance.element.object_ = instance;
    for(var key in properties){
      instance.element[key] = properties[key];
    }
  }
```

 - `object_` is the property that holds a reference to your object. This property will automatically be added to all children of `instance.element`. This includes both the children it comes with when it is originally added to the DOM and any children you decide to add later on. (Don't worry, you can nest objects and everything will still work the way you want it to).
 - `element` is an instance variable that is added to your object, so you can reference the containing element from within the class.  
 
#Example:

```javascript
function MyClass(){
  OBJECTIFY.register(this, 'div', {className: 'my-class'});
  
  this.div1 = document.createElement('div');
  this.element.appendChild(this.div1);
  this.div2 = document.createElement('div');
  this.div1.appendChild(this.div2);
  
  this.button = document.createElement('button');
  this.div2.appendChild(this.button);
  
  return this.element;
}
MyClass.prototype.sayHi = function(){
  console.log('Hi from inside MyClass!');
};
```

-----------------

```javascript
var div = new MyClass();
document.body.appendChild(div);
console.log(div); //[HTMLDivElement]  
console.log(div.object_); //MyClass {element:[HTMLDivElement], div1:[HTMLDivElement], div2:[HTMLDivElement], button:[HTMLButtonElement]}
```

-----------------

```javascript
$('body').on('click','.my-class>div>div>button', function(event){
  event.target.object_.sayHi(); //Hi from inside MyClass!
});
```

