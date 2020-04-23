<template>
	<div>
		<div v-if="newTask">
			<h4>Создание новой заметки</h4>
			<div
				class="uk-margin-auto uk-card uk-card-default uk-padding uk-border-rounded uk-text-left uk-width-1-1 uk-width-4-5@s uk-width-3-5@m uk-width-1-2@xl"
			>
				<label for="new-task-name">Название</label>
				<input
					type="text"
					id="new-task-name"
					class="uk-input uk-margin-small-top"
					v-model="newTask.name"
				/>
				<div class="uk-margin">
					<div>
						<div class="uk-margin">
							<span>Добавьте пункт</span>
							<div class="uk-inline uk-width-1-1 uk-margin-small-top">
								<a
									class="uk-form-icon uk-form-icon-flip uk-margin-medium-right"
									uk-icon="icon: check"
									@click="addNewTodo()"
								></a>
								<a class="uk-form-icon uk-form-icon-flip" uk-icon="icon: close" @click="ctask = ''"></a>
								<input
									v-model="ctask"
									type="text"
									id="new-task--todo"
									class="uk-input"
									v-on:keyup.13="addNewTodo"
								/>
							</div>
						</div>
					</div>
					<ul class="uk-list uk-list-bullet">
						<li
							class="uk-text-left uk-text-truncate"
							v-for="(two, index2) in newTask.todo"
							:key="'newTodo-'+index2"
						>{{two.name}}</li>
					</ul>
				</div>
			</div>
			<div class="uk-margin">
				<button
					class="uk-button uk-button-small uk-button-primary"
					@click="addNewTaskToLS()"
				>Создать заметку</button>
				<button class="uk-button uk-button-small uk-button-default" @click="newTask=false">Отменить</button>
			</div>
		</div>
		<h3 v-if="tasks && tasks.length">
			Ваши заметки:
			<span uk-icon="plus-circle" class="cursor-pointer" @click="enableTaskAdd()"></span>
		</h3>
		<div v-if="tasks && tasks.length" class="uk-grid uk-grid-small">
			<router-link
				:to="'/note/'+index"
				class="uk-link-reset uk-width-1-1 uk-width-1-2@s uk-width-1-3@m uk-width-1-4@xl uk-margin-small-bottom"
				v-for="(one, index) in tasks"
				:key="one.id"
			>
				<div class="uk-card uk-card-default uk-padding-small uk-border-rounded">
					<div class="uk-grid uk-grid-collapse uk-flex-between">
						<p class="uk-text-bold uk-text-left uk-text-truncate">{{one.name}}</p>
						<span
							uk-icon="trash"
							class="cursor-pointer text-danger"
							@click.prevent="getConfirm(index, one.name)"
						></span>
					</div>
					<ul class="uk-list uk-list-bullet">
						<li
							:class="'uk-text-left uk-text-truncate ' + (two.done ? 'task--done' : '')"
							v-for="(two, index2) in one.todo.slice(0,3)"
							:key="one.id+'-note-'+index2"
						>{{two.name}}</li>
						<span v-if="one.todo.length > 3">...</span>
					</ul>
				</div>
			</router-link>
		</div>
		<div v-else-if="!newTask">
			<h3 class="cursor-pointer" @click="enableTaskAdd()">Вы со всем справились, можете перекусить</h3>

			<svg style="width:124px;height:124px" viewBox="0 0 24 24">
				<path
					fill="#333"
					d="M2,16H22V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V16M6,4H18C20.22,4 22,5.78 22,8V10H2V8C2,5.78 3.78,4 6,4M4,11H15L17,13L19,11H20C21.11,11 22,11.89 22,13C22,14.11 21.11,15 20,15H4C2.89,15 2,14.11 2,13C2,11.89 2.89,11 4,11Z"
				/>
			</svg>
			<h3 class="cursor-pointer" @click="enableTaskAdd()">
				или
				<span class="text-success">добавьте задачу</span>
				<span class="text-success" uk-icon="plus-circle"></span>
			</h3>
		</div>
	</div>
</template>

<script>
import _mixins from "../_mixins.js";

export default {
	name: "mainPage",
	mixins: [_mixins],
	data() {
		return {
			ctask: "",
			newTask: "",
			tasks: [
				{
					name: "Заметка",
					todo: [
						{
							name: "Вынести мусор",
							done: false
						},
						{
							name: "Вынести мусор",
							done: true
						},
						{
							name: "Вынести мусор",
							done: false
						},
						{
							name: "Вынести мусор",
							done: true
						}
					]
				}
			],
			lskey: "tasks"
		};
	},
	methods: {
		async getConfirm(index, name) {
			let a = await this.confirmDelete(index, name);
			if (a) {
				// refresh list
				this.getTasks();
			} else {
				// declined
			}
		},
		addNewTodo() {
			if (this.ctask) {
				this.newTask.todo.push({ name: this.ctask, done: false });
				this.ctask = "";
			} else {
				this.notifyWarn("Введите название");
			}
		},
		enableTaskAdd() {
			this.newTask = {
				name: "",
				todo: []
			};
		},
		getTasks() {
			try {
				let str = localStorage.getItem(this.lskey);
				if (str) {
					this.tasks = JSON.parse(str);
				}
			} catch (error) {
				console.error(error);
			}
		},
		addNewTaskToLS() {
			if (!this.newTask.todo.length) {
				this.notifyWarn("Добавьте хотя бы один пункт в список");
				return;
			}
			if (!this.newTask.name) {
				this.notifyWarn("Введите название");
				return;
			}
			let data = null;
			try {
				let str = localStorage.getItem(this.lskey);
				if (str) {
					data = JSON.parse(str);
					data.unshift(this.newTask);
					let misc = JSON.stringify(data);
					localStorage.setItem(this.lskey, misc);
				} else {
					data = JSON.stringify([this.newTask]);
					localStorage.setItem(this.lskey, data);
				}
				this.newTask = "";
				this.getTasks();
			} catch (error) {
				console.error(error);
			}
		}
	},
	mounted() {
		this.getTasks();
	}
};
</script>

<style>
</style>
