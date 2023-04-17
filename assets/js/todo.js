let tasks = [];
const taskList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const addTaskButton = document.getElementById('add-task-button');
const alltasksCounter = document.getElementById('all-tasks-counter');
const completedtasksCounter = document.getElementById('completed-tasks-counter');
const uncompletedtasksCounter = document.getElementById('uncompleted-tasks-counter');
const listSelect=document.getElementsByClassName('tasks-list-tab')[0]
const addButtonContainer=document.getElementById('addtask-button-container');



let currentList='all-tasks'

console.log('Working');




//Server interaction functionality(async Tasks) renderList()(form the server) and pushList() 
async function fetchList(){

	try{
		const response=await fetch('https://jsonplaceholder.typicode.com/todos');
		const data=await response.json()
		tasks=data.slice(0,10);
		renderList(currentList);
	}
	catch(error){
		console.log("Error :",error )
	}
	
	
}



function renderList (type='all-tasks') {

	taskList.innerHTML='';
	let completedCount=0;
	

	if(type==='completed-tasks'){
		tasks.map((task)=>{
			
			if(task.completed){
				let li=createListElement(task);
				taskList.prepend(li);
				completedCount++;
			}
			return
		})
		completedtasksCounter.innerHTML=completedCount;
		uncompletedtasksCounter.innerHTML=tasks.length-completedCount;
		
	}
	else if(type==='uncompleted-tasks'){
		tasks.map((task)=>{
			
			if(!(task.completed)){
				let li=createListElement(task);
				taskList.prepend(li);
			}
			else{
				completedCount++;
			}
			return
		})
		completedtasksCounter.innerHTML=completedCount;
		uncompletedtasksCounter.innerHTML=tasks.length-completedCount;
	}
	else{
		tasks.map((task)=>{

			let li=createListElement(task);
			taskList.prepend(li);
			if(task.completed){
				completedCount++
			}
			return
		})
		completedtasksCounter.innerHTML=completedCount;
		uncompletedtasksCounter.innerHTML=tasks.length-completedCount;
	}
	
	alltasksCounter.innerHTML=tasks.length;
	document.getElementById(currentList).setAttribute('data-Selected',true);
	
}




async function pushList(){

	//should push task list to the Server

}



// const searchForListItem=(taskId)=>{
	

// 	console.log("In searchForListItem function")
// 	let listItems=Array.from(taskList.children);

// 	listItems.forEach(element => {
// 		console.log("data-id for item is"+ element.firstChild.getAttribute('data-id'))
// 	  if (element.firstChild.getAttribute('data-id') === taskId) {
// 	  	console.log("Matches");
// 	  	console.log(element);
// 	    return element;
// 	  }
// 	  else{
// 	  	console.log("Does not match")
// 	  }
// 	});
// }


function markTaskAsComplete (taskId) {
	//search for children<li> of taskList with taskId


	//alter in tasks array element
	let status; 
	tasks.forEach(element=>{
		if(element.id===taskId){
			console.log(element);
				status=!element.completed
				element.completed=status;


				//element.getId ,element.getText etc not working.Why???????????
				
		}
	})


	//alter the HTML content
	renderList(currentList);

	//checkbox checked for this element
	if(status){
		showNotification("You may now remove this task",{appearance:'success'});
	}
	


	//pushList()

}









function deleteTask (taskId) {
	//search for children<li> of taskList with taskId
	//let elem=searchForListItem(taskId);

	//alter in tasks array
	
	console.log(taskId)
	let newTasks=[];
	tasks.forEach((task)=>{
		if(task.id!==taskId){
			console.log("Pushed item :", task.getId )
			newTasks.push(task);
		}
	})



	tasks=newTasks;

	console.log(tasks);
	
	
	renderList(currentList);



	showNotification("Task removed.....(Undo operation)",{appearance:'error'});
}














// const Task=class{
// 	constructor(id,text,completed){			//id
// 		this.id=id;
// 		this.title=text;
// 		this.completed=completed;
// 		console.log("New task created with id , text: ", id, text);
// 	}
// 	get getId(){
// 		return this.id;
// 	}
// 	get getText(){
// 		return this.title;
// 	}
// 	get getCompleteStatus(){
// 		return this.completed;
// 	}
// 	setCompleteStatus(val){
// 		this.completed=val;
// 	} 
// }

const createId=(()=>{					//an IIFE closure function
	var startId=Date.now();
	return ()=>{
		console.log("New Task created with Id: ",startId)
		return (startId++) ;
	}
})();
const createListElement=(task)=>{

	console.log("creating list item for task: ",task)
	let li=document.createElement("li");		//input,label ,img as children
	//
	let input=document.createElement("input");
	input.type="checkbox";
	input.setAttribute('id' , "task"+task.id);
	input.setAttribute('data-id' , task.id);
	input.classList.add("custom-checkbox")
	if(task.completed===true){
		input.setAttribute('checked',true)
	}

	li.appendChild(input);

	let label=document.createElement("label");
	label.setAttribute('for' , input.id);
	
	const textnode = document.createTextNode(task.title);
	label.appendChild(textnode);

	li.appendChild(label);

	let img=document.createElement("img");
	img.setAttribute('src' , "static/bin.png");
	img.classList.add("delete");
	img.setAttribute('data-id' , input.getAttribute('data-id'));
	
	li.appendChild(img);



	//Method2:
	// li.innerHTML=` <input type="checkbox" id=""task"+${task.id}" data-id="${task.id}" class="custom-checkbox" ${task.complete? "checked":""}>
	// <label for=" "task"+${task.id} ">${task.title}</label>
	// <img src="./static/bin.png" class="delete" data-id="${task.id}" /> `;

	return li;

}

const createTask=(text)=>{
	
	//let task=new Task(createId(),text,false);
	return {
		id:createId(),
		title:text,
		completed:false
	};
}


function addTask (task) {
	
	tasks.push(task);
	
	renderList(currentList);



}









function showNotification(text,{appearance}) {
	//window.alert(text);
	const notification=document.createElement('div')
	notification.classList.add(`notification-${appearance}`);
	notification.append(document.createTextNode(text))
	document.body.appendChild(notification)
	setTimeout(()=>{document.body.removeChild(notification)},3000)

}





const handleAddTaskClick=(e)=>{
		const text=addTaskInput.value;

		
			
			if(!text){
				showNotification("Task title cannot be empty!!  Add something",{appearance:'error'})
			}
			else
			{
				addTask(createTask(text));
				if(currentList==="completed-tasks"){
					showNotification("Task added. Check incomplete task list.",{appearance:'success'})
				}
				else{
					showNotification("Task added ",{appearance:'success'})
				}
				
			}
			
}



const taskTrigger=(e)=>{
	console.log("Mousclick occured")
	if(e.target.tagName==="IMG"){
		const taskId=e.target.getAttribute('data-id');	//or target.dataset.id
		deleteTask(Number(taskId))
	}
	if(e.target.tagName==="INPUT"){
		const taskId=e.target.getAttribute('data-id'); //or target.dataset.id
		markTaskAsComplete(Number(taskId));
	}

	//Below code is redundant since label and its input box gets checked simultaneously

	// if(e.target.tagName==="LABEL"){
	// 	const id=e.target.getAttribute('for');
	// 	markTaskAsComplete(id.splice(3));
	// }
	

}

const selectListType=(e)=>{
	e.preventDefault()
	if(e.target.tagName==='A'){
		const newList=e.target.getAttribute('id');
		if(currentList!==newList){
			
			document.getElementById(currentList).removeAttribute('data-Selected')
			currentList=newList
			renderList(currentList)
			
		}
		
	
	}
}




(function intializeApp(){

//pull data from the server
fetchList();

//create Task when user presses Enter

addTaskButton.addEventListener('click',handleAddTaskClick);

taskList.addEventListener('click',taskTrigger)

listSelect.addEventListener('click',selectListType);

})();
