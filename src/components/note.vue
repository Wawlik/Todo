<template>
	<div class="uk-card uk-card-default uk-padding-small uk-border-rounded uk-width-1-1 uk-width-3-5@m uk-width-1-2@l">
		<div class="uk-grid uk-grid-collapse uk-flex-between uk-text-emphasis uk-margin-small">
			<span>Редактирование заметки:</span>
			<div>
				<span
					uk-tooltip="Отменить все изменения"
					uk-icon="history"
					class="uk-margin-small-right todo-container--revert-icon"
					@click="unsetChanges()"
				></span>
				<span
					uk-tooltip="Отменить последнее изменение"
					uk-icon="reply"
					class="uk-margin-small-right todo-container--revert-icon"
					@click="getStageChange(step-1)"
				></span>
				<span
					uk-tooltip="Повторить отмененное изменение"
					uk-icon="forward"
					class="uk-margin-small-right todo-container--revert-icon"
					@click="getStageChange(step+1)"
				></span>
				<span
					uk-tooltip="Удалить заметку"
					uk-icon="trash"
					class="uk-margin-small-right todo-container--delete-icon"
					@click="getConfirm(null, head)"
				></span>
			</div>
		</div>
		<input
			placeholder="Введите название"
			v-model="head"
			type="text"
			id="new-task--name"
			class="uk-input"
		/>
		<div class="uk-inline uk-width-1-1 uk-margin-small">
			<a
				uk-tooltip="Добавить"
				class="uk-form-icon uk-form-icon-flip uk-margin-medium-right"
				uk-icon="icon: check"
				@click="addNewTodo()"
			></a>
			<a
				uk-tooltip="Очистить"
				class="uk-form-icon uk-form-icon-flip"
				uk-icon="icon: close"
				@click="ctask = ''"
			></a>
			<input
				placeholder="Добавьте пункт"
				v-model="ctask"
				type="text"
				id="new-task--todo"
				class="uk-input"
				v-on:keyup.13="addNewTodo"
			/>
		</div>
		<ul class="uk-list">
			<li
				class="uk-text-left uk-text-truncate uk-grid uk-grid-collapse uk-flex-middle uk-flex-between"
				v-for="(one, index2) in todos"
				:key="one+'-note-'+index2"
			>
				<input
					type="checkbox"
					class="uk-checkbox uk-width-auto todo--checkbox"
					v-model="one.done"
				/>
				<div class="uk-inline uk-width-expand">
					<a
						uk-tooltip="Очистить"
						class="uk-form-icon uk-form-icon-flip"
						uk-icon="icon: close"
						@click="todos.splice(index2, 1)"
					></a>
					<input
						v-model="one.name"
						type="text"
						id="current-task--todo"
						class="uk-input uk-width-expand"
					/>
				</div>
				<div style="width:40px;">
					<span v-if="index2" uk-icon="arrow-up" class="" uk-tooltip="Поднять" @click="todoMove(index2, -1)"></span>
					<span v-else>&nbsp;&nbsp;&nbsp;&nbsp;</span>
					<span v-if="index2 < todos.length - 1" uk-icon="arrow-down" class="" uk-tooltip="Опустить" @click="todoMove(index2, 1)"></span>
				</div>
			</li>
		</ul>
		<button class="uk-button uk-button-small uk-button-primary" @click="saveTask()">Сохранить</button>
		<button class="uk-button uk-button-small uk-button-default" @click="confirmCancelEditing()">Отменить</button>
	</div>
</template>

<script>
import _mixins from "../_mixins.js";

export default {
	name: "note",
	mixins: [_mixins],
	data() {
		return {
			head: "",
			todos: "",
			lskey: "tasks",
			ctask: "",
			savedTask: null, // object before changes,
			stageChange: null,
			step: 0
		};
	},
	methods: {
		todoMove(k1, k2){
			let temp1 = this.todos[k1];
			let temp2 = this.todos[k2+k1];
			this.todos.splice(k1,1,temp2);
			this.todos.splice(k2+k1,1,temp1);
			// this.$set(this, 'todos', misc);	
		},
		confirmCancelEditing(){
			if (window && window.UIkit) {
				let self = this;
				let txt = 'Вы уверены, что хотите отменить редактирование и перейти на главную?';
				window.UIkit.modal.confirm(txt).then(
					function () {
						self.$router.push('/Todo/');
					},
					function () {
						return 0;
						// Canceled
					}
				);
			} else {
				this.notifyErr('Что-то пошло не так. Возможны вы не в сети. Попробуйте перезагрузить страницу')
			}
		},
		async getConfirm(index, name) {
			let a = await this.confirmDelete(index, name);
			if (a) {
				// move to main
				this.$router.push("/Todo/");
			} else {
				// declined
			}
		},
		setStageChange(step = this.step) {
			if (!this.stageChange) {
				this.stageChange = [];
			}
			this.stageChange[step] = JSON.parse(
				JSON.stringify({ name: this.head, todo: this.todos })
			);
			this.step++;
		},
		getStageChange(num) {
			if (num || (num === 0 && this.stageChange)) {
				if (this.stageChange[num]) {
					if (num < this.step) {
						this.stageChange[this.step] = JSON.parse(
							JSON.stringify({ name: this.head, todo: this.todos })
						);
						this.head = JSON.parse(JSON.stringify(this.stageChange[num].name));
						this.todos = JSON.parse(JSON.stringify(this.stageChange[num].todo));
						this.step = num;
					} else {
						this.head = JSON.parse(JSON.stringify(this.stageChange[num].name));
						this.todos = JSON.parse(JSON.stringify(this.stageChange[num].todo));
						this.step = num;
					}
				}
			}
		},
		unsetChanges() {
			if (window && window.UIkit) {
				let self = this;
				let txt = "Вы уверены, что хотите отменить все изменения?";
				window.UIkit.modal.confirm(txt).then(
					function() {
						// store change
						self.setStageChange();
						self.head = JSON.parse(JSON.stringify(self.savedTask.name));
						self.todos = JSON.parse(JSON.stringify(self.savedTask.todo));
						// save initial stage
						self.saveTask();
					},
					function() {
						// Canceled
					}
				);
			}
		},
		saveTask(upd = true) {
			let data = null;
			let obj = { name: this.head, todo: this.todos };
			try {
				this.setStageChange();
				let str = localStorage.getItem(this.lskey);
				if (str) {
					data = JSON.parse(str);
					let id = this.$route.params.id;
					data.splice(id, 1, obj);
					let misc = JSON.stringify(data);
					localStorage.setItem(this.lskey, misc);
				} else {
					data = JSON.stringify([obj]);
					localStorage.setItem(this.lskey, data);
				}
				this.notifyOk("Изменения успешно сохранены");
			} catch (error) {
				console.error(error);
				this.notifyErr(
					"Что-то пошло не так. Попробуйте перезагрузить страницу"
				);
			}
			// if(upd){
			// 	this.savedTask = JSON.parse(JSON.stringify(obj));
			// }
		},
		addNewTodo() {
			if (this.ctask) {
				this.setStageChange();
				this.todos.unshift({ name: this.ctask, done: false });
				this.ctask = "";
			} else {
				this.notifyWarn("Опишите задачу");
			}
		},
		getCtask() {
			if (
				this.$route &&
				this.$route.params &&
				typeof (+this.$route.params.id === "number")
			) {
				let id = this.$route.params.id;
				try {
					let str = localStorage.getItem(this.lskey);
					if (str) {
						let tasks = JSON.parse(str);
						if (tasks[id]) {
							this.savedTask = JSON.parse(JSON.stringify(tasks[id]));
							this.head = tasks[id].name;
							this.todos = tasks[id].todo;
						}
					}
				} catch (error) {
					console.error(error);
				}
			} else {
				this.head = "Неверный номер заметки";
			}
		}
	},
	mounted() {
		this.getCtask();
	}
};
</script>

<style>
</style>
