import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {Tasks} from '../../api/tasks';
import { Meteor } from 'meteor/meteor';

import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.hideCompleted = false;

    this.helpers({
      tasks(){
        const selector = {};
        if (this.getReactively('hideCompleted')) {
          selector.checked = {
            $ne: true
          };
        }
        return Tasks.find(selector, {
          sort: {
            createdAt: -1
          }
        });
      },
      incompleteCount() {
        return Tasks.find({
          checked: {
            $ne: true
          }
        }).count();
      },
      currentUser() {
        return Meteor.user();
      }
    })
  }
  addTask(newTask) {
    // Insert a task into the collection
    Meteor.call('tasks.insert', newTask);
 
    // Clear form
    this.newTask = '';
  }
  
  setChecked(task) {
    Meteor.call('tasks.setChecked', task._id, !task.checked);
  }

  removeTask(task){
    Meteor.call('tasks.remove', task._id);
  }
}
 
export default angular.module('todosList', [
  angularMeteor
])
  .component('todosList', {
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });