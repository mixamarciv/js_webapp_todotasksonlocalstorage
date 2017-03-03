'use strict'

function loadTasks(){
    var tasks = {
        tasks: {},
        cnt: 0,
        cntComplete: 0,
        new_task_id: function(){
            var id = localStorage['last_task_id']
            if(!id) id = 0;
            localStorage['last_task_id'] = ++id;
            return id
        },

        count: function(){return this.cnt;},
        countComplete: function(){return this.cntComplete;},
        getTask: function(key){return this.tasks[key];},
        addTask: _add_task,       //arguments ({title}) result task
        removeTask: _remove_task, //arguments (key) 
        updateTask: _update_task, //arguments (key,{title,complete_time})
        completeTask: _complete_task,
        showTasks: _show_tasks    //call opt.viewTaskFn for all tasks by filter/options arguments ({viewTaskFn,sortFn})
    }
    

    for(var key in localStorage){
        if( key.substr(0,4) == "task" ){
            var taskdata = 0;
            try{
                taskdata = JSON.parse(localStorage[key]);
            } catch (e) {
                alert(localStorage[key] + "\n" + e);
            }
            if(!taskdata) continue;

            tasks.cnt++;
            if(taskdata.complete_time>0) tasks.cntComplete++;
            tasks.tasks[key] = _create_task(key,taskdata)
        }
    }
    
    return tasks
}

function _create_task(taskkey, taskdata){
    var task = jQuery.extend({key: taskkey}, taskdata);

    task.update = function(opt) {
        this.title = opt.title;
        this.complete_time = opt.complete_time;

        //update localStorage task data
        var taskdata = {
            title: this.title,
            start_time: this.start_time,
            complete_time: this.complete_time
        }
        localStorage[this.key] = JSON.stringify(taskdata);
    }

    task.getKey = function() {return this.key;}
    task.getTitle = function() {return this.title;}
    task.getStartTime = function() {return this.start_time;}
    task.getStartTimeStr = function() {return new Date(this.start_time).toUTCString();}
    task.isComplete = function() {return !!this.complete_time;}
    task.getCompleteTime = function() {return this.complete_time;}
    task.getCompleteTimeStr = function() {return new Date(this.complete_time).toUTCString();}

    return task
}

function _add_task(opt){
    var taskkey = "task"+this.new_task_id();
    var taskdata = {
        title: opt.title,
        start_time: new Date().getTime(),
        complete_time: 0
    }
    localStorage[taskkey] = JSON.stringify(taskdata);
    var task = _create_task(taskkey,taskdata);
    
    this.tasks[taskkey] = task;
    this.cnt++;

    return task
}

function _remove_task(key){
    var task = this.tasks[key];
    if(!task) return alert("ERROR: not found task key '"+key+"'")
    if(task.isComplete()) this.cntComplete--;
    this.cnt--;
    delete this.tasks[key];
    delete localStorage[key];
    return this
}
function _update_task(key,opt){
    var task = this.tasks[key];
    if(!task) return alert("ERROR: not found task key '"+key+"'")
    task.update(opt)
    return this
}
function _complete_task(key){
    var task = this.tasks[key];
    if(!task) return alert("ERROR: not found task key '"+key+"'")
    task.complete_time = new Date().getTime()
    task.update(task)
    this.cntComplete++;
    return this
}


//defaut options for tasks.showTasks:
var _default_opt_show_tasks = {
    viewTaskFn: _default_view_task_fn,
    sortFn: _default_sort_tasks_fn
}
function _default_view_task_fn(task){
    return "["+task.getKey()+"] "+task.getTitle()+" [start time: "+task.getStartTime()+"] complete: "+task.getCompleteTime();
}
function _default_sort_tasks_fn(task1,task2){
	if(task1.getTitle() >  task2.getTitle()) return 1;
	if(task1.getTitle() == task2.getTitle()) return 0;
	return -1;
}

function _show_tasks(opt) {
    if(!opt) opt = _default_opt_show_tasks;
    if(typeof opt.viewTaskFn != "function") opt.viewTaskFn = _default_opt_show_tasks.viewTaskFn;
    if(typeof opt.sortFn != "function") opt.sortFn = _default_opt_show_tasks.sortFn;

    var arr_tasks = [];
    for(var key in this.tasks){
        arr_tasks.push(this.tasks[key])
    }
    arr_tasks.sort(opt.sortFn)

    for(var key in arr_tasks){
        opt.viewTaskFn(arr_tasks[key])
    }
}


