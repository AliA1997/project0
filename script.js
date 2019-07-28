
const classNames = {
  TODO_ITEM: 'todo-container',
  TODO_CHECKBOX: 'todo-checkbox',
  TODO_TEXT: 'todo-text',
  TODO_DELETE: 'todo-delete',
}

//Assign elements to your variables.
const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const addButton = document.getElementById('add-todo-button');
const deleteButton = document.getElementById('delete-todo-button');

//On click of the deleteButton remove mulitple items based if they are checked or not.
deleteButton.onclick = function() {
  list.childNodes.removeMultipleItems();
}

// HTMLButtonElement.prototype.setText = function() {
//   if(parseInt(checkedCountSpan.textContent) > 1) {

//     this.textContent = 'Delete Todo\'s'; 
  
//   } else {

//     this.textContent = 'Delete Todo';
  
//   }
// }


addButton.innerHTML += `<span class='add-button'>+</span>`;

//Prototype Function for your NodeList
////////////////////////////////////////////////////////////////////////////////////////////////////
//Prototype method for removing a single item.
NodeList.prototype.removeItem = function(index) {
  //Assign the textContent of the count of the current number of items in the page.
  //Convert the textCOntent to a number and -1 from it, if it is less than zero set it to zero to prevent negative numbers.
  //Else have your current count - 1;
  itemCountSpan.textContent = parseInt(itemCountSpan.textContent) - 1 < 0 ? 0 : parseInt(itemCountSpan.textContent) - 1;
  //THen set the style of the currentItem deleted to null.
  this[index].style = null;
  //And also set it's innerHTML to null.
  this[index].innerHTML = null;
}

//Prototype method for removing multiple items.
NodeList.prototype.removeMultipleItems = function() {
  //Have a counter indicating the number of items to delete to remove from the current count.
  var itemsDeleted = 0;
  var list = this;
  setTimeout(function() {
    //Loop through the nodelist 
    list.forEach((item, i) => {
      //If the nodelist have children or the innerHtml of the item is not null, then check if the checkbox is checked.
      if(item.children.length) {
        const checkbox = item.children[0].children[0];
        if(checkbox.checked === true) {
          //THen add one to the item's deleted.
          itemsDeleted += 1;
          //THen remove that item using it's index.
          list.removeItem(i);
          //Then check the number of items.
          list.checkedItems();
        }

      }
    });
  })
  //Use the counter to delete from count of the current # of items.
  decrementMultiple(itemsDeleted);
}

//Enable a onclick event handler for everytime a user clicks on a checkbox.
NodeList.prototype.addCheckboxFunctionality = function() {
  this.forEach(item => {
    
    if(item.children.length && item.children[0] && item.children[0].children[0]) {
      
      const checkbox = item.children[0].children[0];

      checkbox.onclick = function() {
          //Everytime you click a checkbox check the # of items checked or not checked.
          list.childNodes.checkedItems();

      }

    }
    //Then return out of the forEach callback argument.
    return;
  });
  //REturn out of the prototype method.
}

//Check the # of valid items, and unchecked items in the list.
NodeList.prototype.checkedItems = function() {
  //Reset the uncheck item count.
  uncheckedCountSpan.textContent = 0;
  //Have a counter for the number of validitems.
  let validItems = 0;
  this.forEach(item => {
    //If it is a valid item then increment the counter by 1.
    if(item.children.length && item.children[0] && item.children[0].children[0]) {

      validItems += 1;
      
      //Assign the checkbox variable to the checkbox 
      const checkbox = item.children[0].children[0];
      
      //If the checkbox is checked user yoour decrement function to decrement the unchecked span
      if(checkbox.checked === true) {
        decrement('unchecked');
      } else {
        //Else use the increment function to increment the unchecked span.
        increment('unchecked');
      }

    }
    return;
  })
  //Assign the count for the # of items to the counter variable indicating how many are valid or thier html is not null.
  itemCountSpan.textContent = validItems;
}


//Utility FUnctions
/////////////////////////////////////////////////////////////////////////////////////////////////////
//Define a function for keep copying objects.
const deepCopy = function(obj) {
  //Define a variable that will be returned which would be your new object.
  const newObj = {};

  //Then define a variable retrieving all the keys of the object passed in.
  const keys = Object.keys(obj);

  //Loop through the keys and if it is an object recursive call the function to copy that object.
  for(let i = 0; i < keys.length; i++) {
    //Assign a variable called key.
    const key = keys[i];
    //If the object value is a object then recursivaly call using that object key.
    if(typeof obj[key] === 'object')
      newObj[key] = deepCopy(obj[key]);
    else 
    //Else just assign that property to that object's property.
      newObj[key] = obj[key];
  }
  //Then return the new object.
  return newObj;

}


//Define styles for elements.
function styleGenerator(element, stylesArg) {

  const styles = deepCopy(stylesArg);
  
  //Look through the keys, and assign each element style attribtue to that style key.
  Object.keys(styles).forEach(key => {

    element.style[key] = styles[key];

  });

  //Then return the element.
  return element;

}

//We will define a series of closures to break down our code so we can breakdown complex problems to small ones.
function createNewElement(typeArg, stylesArg) {

  //Element to be returned.
  let returnedTag;


  //Have closure for create a nonButton element.
  //Which takes a type and styles object.
  function createNonButton(type, stylesObj) {

    //Based on the type argument will create a new element 
    //So for h1 it will create a h1 tag
    //For li it will create a li tag.
    if(type === 'h1') 
      returnedTag = document.createElement('h1');
    else if(type == 'li') 
      returnedTag = document.createElement('li');
    else {
      //Else it will create a div tag with a  checkbox.
      returnedTag = document.createElement('div');
      returnedTag.innerHTML += `
        <input type="checkbox"  />
      `;
    }
    //Reassign the returnedTag to the styleGenerator function using your returnedTag, and stylesObject.
    returnedTag = styleGenerator(returnedTag, stylesObj);
  
    if(type == 'li')
      returnedTag.id = `li-${itemCountSpan.textContent}`;

    //Then return the styled element.
    return returnedTag;
  
  }
  
  //Have another closure for creating a button element.
  //That create's a close and add button based on it's type.
  function createButton(buttonType) {

    returnedTag = document.createElement('button');

    returnedTag = styleGenerator(returnedTag, {
      backgroundColor: 'white',
      border: 'none'
    });


    //Define a method for creating a close button within your createButton function.
    function createCloseButton() {
      
      //Create a span tag with it styled.
      let closedButton = document.createElement('span');

      closedButton = styleGenerator(closedButton, {
                                                    borderRadius: '50%',
                                                    border: '1px solid black',
                                                    backgroundColor: 'red',
                                                    color: 'white',
                                                    width: '20%'
                                                  });

      //And give it a textCOntext of X.
      closedButton.textContent = 'X';
      
      //Assign an index converted to the number using the textContent of the # of items.
      var index = parseInt(itemCountSpan.textContent)

      //Add a event handler removing that specific item when click on that button.
      closedButton.onclick = function() {
        if(list.childNodes.length > 1) {
          setTimeout(function() {            
            list.childNodes.removeItem(index);      
            list.childNodes.checkedItems();      
          });
          //If there is just one item set the list's innerHtml to null.   
        } else {
          list.innerHTML = null;
          setTimeout(function() {
            list.childNodes.checkedItems();      
          });
        }

      }

      //Then return the button.
      return closedButton;
      
    }

    //Define a method for creating a add button within your createButton function.
    function createAddButton() {
              
      let addButton = document.createElement('span');

      addButton = styleGenerator(addButton, {
                                              borderRadius:'50%',
                                              border:'2px solid black',
                                              boxShadow:'2px 4px 2px black',
                                              backgroundColor:'green',
                                              color:'white',
                                              width:'20%'
                                            });
      
      addButton.textContent = '+';

      return addButton;
      
    }
    
    
    //If the buttonType is close append to the returnedTag the close button.
    if(buttonType.includes('close')) 
    returnedTag.appendChild(createCloseButton());
    //If the buttonType is close append to the returnedTag the add button.
    else 
    returnedTag.appendChild(createAddButton());
    
    //After the conditionals indicating if it is for adding or deleting item, return the resulting element.
    return returnedTag;
    
  }

  //If the type does not include button create a non-button eleement
  if(!typeArg.includes('button')) 
    return createNonButton(typeArg, stylesArg);
  else 
    return createButton(typeArg);

}



//Define a way of calculating totals.
function increment() {
  //Use the argument array which would be used to indicate if we passed an argument, and if we did, it will be calculating just unchecked items.
  if(arguments[0]) {

      uncheckedCountSpan.textContent = parseInt(uncheckedCountSpan.textContent) + 1;

  } else {
      //Else calculate the number of total items, and unchecked items.
      itemCountSpan.textContent = parseInt(itemCountSpan.textContent) + 1;
      uncheckedCountSpan.textContent = parseInt(uncheckedCountSpan.textContent) + 1;
  }
}

function decrement() {
  //Use the arguments array which would be used to indicate if we passed an argument, and if we did, it will calculate just the unchecked items.
  if(arguments[0]) {
  
    uncheckedCountSpan.textContent = parseInt(uncheckedCountSpan.textContent) - 1 < 0 ? 0 : parseInt(uncheckedCountSpan.textContent) - 1;

  } else {

    itemCountSpan.textContent = parseInt(itemCountSpan.textContent) - 1;
    uncheckedCountSpan.textContent = parseInt(uncheckedCountSpan.textContent) - 1;
   
  }
}

//Pass a number to remove from the # of unchecked items, and # of total items.
function decrementMultiple(itemsDeleted) {
  uncheckedCountSpan.textContent = parseInt(uncheckedCountSpan.textContent) - itemsDeleted < 0 ? 0 : parseInt(uncheckedCountSpan.textContent) - itemsDeleted;
  itemCountSpan.textContent = parseInt(itemCountSpan.textContent) - itemsDeleted < 0 ? 0 : parseInt(itemCountSpan.textContent) - itemsDeleted;
}

//Define function responsible for creating each single todo item.
function createTodo(todo) {


  //You will create a li tag with styles accordingly.
  const todoItem = createNewElement('li', {
    width: '90%',
    backgroundColor: 'white',
    margin: '50px',
    color: '#000',
    fontFamily: 'monospace',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid black',
    boxShadow: '2px 2px 2px lightgrey',
  });

  //Then append a div
  todoItem.appendChild(createNewElement('div', {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }));

  //Then append a h1 
  todoItem.appendChild(createNewElement('h1', {
      fontFamily: 'monospace',
      color: 'blue',
  }));

  //Then append a close button.
  todoItem.appendChild(createNewElement('button-close', {}));
  
  //THen append innerhtml using template strings, to pass the todo text.
  todoItem.children[0].innerHTML += `
    <div style="display: flex; flex-direction: column;">
      <p style="margin: 0;">
        Type: ${todo.type}
      </p><br/>
      <p style="margin: 0;">
        Chore: ${todo.chore}
      </p>
    </div>
   `;
  
   //Then return your todo item.
  return todoItem;
}


//For adding a todo confirm to the user that you want to create a todo.
function addTodo() {

  if(confirm('Do you want to create a todo?')) {

    //Prompt the user the type of chore and the chore itself.
    const todoType = prompt('What type of chore is your todo item?');

    const todoChore = prompt('What chore is your todo item?');

    //Then assign the newTodo object and pass it in the createTodo function.
    const newTodo = {
      type: todoType,
      chore: todoChore
    };
    
    const todoItem = createTodo(newTodo);
    
    //THen append the todoItem to the list.
    list.appendChild(todoItem);
    
    //Then increment the count or # of total items and the # of unchecked items.
    increment();
    
  }
  //Then add checkbox functionality to all the todoItems.
  list.childNodes.addCheckboxFunctionality();
  
  //Then return out of the function.
  return;

}



 
