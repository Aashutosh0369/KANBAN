const addRef = document.querySelector('.action-wrapper .add') ;
const removeRef = document.querySelector('.action-wrapper .delete') ;
const modelRef = document.querySelector('.model') ; 
const textareaRef =document.querySelector('.model .left-section textarea') ;
const taskWrapperRef = document.querySelector('.task-wrapper') ; 
const rightCategorySelection = document.querySelectorAll('.right-section .category') ;
const headerCategoryFilterWrapper = document.querySelector('header .category-wrapper') ;
const taskSearchRef = document.querySelector(".task-search input") ;

const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');//ask

addRef.addEventListener('click' ,function(e){
    toggleModel() ;
} ) ;

function defaultCategorySelection() {
    removeAllCategorySelection() ;    
    const firstCategory = document.querySelector('.right-section .category.p1') ;
    firstCategory.classList.add('selected') ;
}

// function defaultCategorySelection() {
//     removeAllCategorySelection();
//     const selectedCategory = document.querySelector('.right-section .category');
//     if (selectedCategory) {
//         selectedCategory.classList.add('selected');
//     }
// }

function toggleModel(){
    const isHidden = modelRef.classList.contains('hide') ;
       if(isHidden) {
            modelRef.classList.remove('hide') ;
       }else {
            defaultCategorySelection() ; 
            modelRef.classList.add('hide') ;  
       }
}

function renderTaskList() {
    tasks.forEach((task) => {
        createTask(task) ;
    })
}

renderTaskList() ;

function addTaskInData(newTask) {
    tasks.push(newTask) ;
    localStorage.setItem('tasks' , JSON.stringify(tasks)) ;
}

textareaRef.addEventListener('keydown', function (e) {
    if (e.key == "Enter") {
        const rightSelectedCategory = document.querySelector('.right-section .category.selected');
        const selectedCategoryName = rightSelectedCategory.getAttribute('data-category');   
        const newTask = {
            id: Math.random(),
            title: e.target.value,
            category: selectedCategoryName,
        };        
        addTaskInData(newTask) ;
        e.target.value = "";
        toggleModel();
        createTask(newTask); 
    }
});

function createTask(task) {
    const taskRef = document.createElement('div') ;
    taskRef.className = 'task' ;
    // taskRef.setAttribute('data-id' , task.id) ;
    taskRef.dataset.id = task.id ;
    taskRef.innerHTML = `
        <div class="task-category" data-priority = "${task.category}"></div>
        <div class="task-id">${task.id}</div>
        <div class="task-title"><textarea>${task.title}</textarea></div>
        <div class="task-delete-icon"><i class="fa-solid fa-trash"></i></div> 
    ` ;
    taskWrapperRef.appendChild(taskRef) ;
    const textareaRef = taskRef.querySelector('.task-title textarea') ;
    textareaRef.addEventListener('change' , function(e) {
        const updatedTitle = e.target.value ;
        const currentTaskId = task.id ;
        updatedTitleInData(updatedTitle , currentTaskId) ;
    });
    //can a eventlistener like change which on textare can that be puton parentlevel -- will it bubble or not
}

rightCategorySelection.forEach(function(categoryRef) {
    categoryRef.addEventListener('click' , function(e) {

        removeAllCategorySelection() ;
        e.target.classList.add("selected") ;
    })
});

// rightCategorySelection.forEach(function(categoryRef) {
//     categoryRef.addEventListener('click' , function(e) {
//         removeAllCategorySelection();
//         e.target.classList.add("selected");
//         defaultCategorySelection(); // Add this line to set the default color
//     })
// });

function removeAllCategorySelection() {
    rightCategorySelection.forEach(function(categoryRef) {
        categoryRef.classList.remove('selected') ;
    });
}

function updatedTitleInData(updatedTitle , taskId){
    const selectedTaskIdx = tasks.findIndex((task) => Number(task.id) === Number(taskId)) ;
    
    //Option 1  :
    const selectedTask = tasks[selectedTaskIdx] ;
    selectedTask.title = updatedTitle ; 
    
    
    // //Option 2 :
    // const selectedTask = {...tasks[selectedTaskIdx]} ;
    // selectedTask.title = updatedTitle ;
    // const updatedTasks = {...tasks} ;
    // updatedTasks.splice(selectedTaskIdx , 1 , selectedTask) ;
    // tasks = updatedTasks;

    localStorage.setItem('tasks' , JSON.stringify(tasks)) ;
}

function deleteTaskFromData(taskId){
    const selectedTaskIdx = tasks.findIndex((task) => Number(task.id) === Number(taskId)) ;
    tasks.splice(selectedTaskIdx , 1) ;
    localStorage.setItem('tasks' , JSON.stringify(tasks)) ;
} 

taskWrapperRef.addEventListener('click' , function(e) {
    // console.log(e.target.classList.contains('fa-trash')) ;    
    if(e.target.classList.contains('fa-trash')) {
        const currentTaskRef = e.target.closest('.task') ;
        currentTaskRef.remove() ;
        const taskId = currentTaskRef.dataset.id ;
        deleteTaskFromData(taskId) ;
        console.log(tasks) ;
    }
    // console.log(e.target.classList.contains("task"))
    if(e.target.classList.contains('task-category')){
        const currentPriority = e.target.dataset.priority ;
        const nextPriority = getNextPriority(currentPriority) ;
        console.log(nextPriority) ;
        e.target.dataset.priority = nextPriority ; 
        const taskId = Number(e.target.closest('.task').dataset.id);// this will get current parent i.e task 
        updatePriorityInData(taskId, nextPriority);
    }
})

function updatePriorityInData(taskId, nextPriority) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    tasks[taskIndex].category = nextPriority;
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function getNextPriority(currentPriority) {
    const priorityList = ['p1' , 'p2', 'p3' , 'p4'] ;
    const currentPriorityIdx = priorityList.findIndex((p) =>  p === currentPriority) ;

    const nextPriorityIdx = (currentPriorityIdx + 1) % 4 ;
    
    return priorityList[nextPriorityIdx] ;
}

headerCategoryFilterWrapper.addEventListener('click', function(e) {
    if (e.target.classList.contains('category')) {
        const selectedPriority = e.target.dataset.priority;
        const taskListRef = document.querySelectorAll('.task');
        taskListRef.forEach(taskRef => {
            taskRef.classList.remove('hide');
            const currentTaskPriority = taskRef.querySelector('.task-category').dataset.priority;
            if (currentTaskPriority !== selectedPriority) {
                taskRef.classList.add('hide');
            }
        })

    }
})

removeRef.addEventListener('click', function(e) {
    const isDeleteEnabled = e.target.classList.contains('enabled');
    if (isDeleteEnabled) {
        e.target.classList.remove('enabled');
        taskWrapperRef.dataset.deleteDisabled = true;
    } else {
        e.target.classList.add('enabled');
        taskWrapperRef.dataset.deleteDisabled = false;
    }
})


// function toggleDeleteIcon(visible) {
//     const allDeleteRef = document.querySelectorAll('.task-delete--icon') ;
//     allDeleteRef.forEach(deleteIconRef => {
//         deleteIconRef.style.display = visible ? "block" : "none" ;
//     })
// }

taskSearchRef.addEventListener("keyup" , function(e) {    
    // console.log(e.target.value) ; 
    taskWrapperRef.innerHTML = "" ;
    //In-memory data

    // const filteredTasks = tasks.filter(task => {
        // const currentTitle = task.title.toLowerCase() ;
        // const searchText = e.target.value.toLowerCase() ;
        // return currentTitle.startsWith(searchText) ;

    // })
    // console.log(filteredTasks) ;
    tasks.forEach((task) => {
        const currentTitle = task.title.toLowerCase() ;
        const searchText = e.target.value.toLowerCase() ;
        const taskId = String(task.id) ;
        if( searchText.trim() === "" ||currentTitle.includes(searchText) || taskId.includes(searchText) ) {//startWith >> contains
            createTask(task) ;
        }        
    })


    //DOM Refrence


})