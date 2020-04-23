<template>
	<div id="app" class="uk-container uk-margin">
		<h3 class="uk-text-left">
			<router-link class="uk-link-reset uk-grid uk-grid-collapse uk-flex-middle" to="/Todo">
				<span uk-icon="home" class="cursor-pointer uk-margin-small-right"></span>
				<span>Главная</span>
			</router-link>
		</h3>
		<router-view />
	</div>
</template>

<script>
export default {
	name: "App"
};
</script>

<style>
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
.cursor-pointer {
	cursor: pointer;
}
.text-danger {
	color: red;
}
.text-success {
	color: #09f;
}
.task--done {
	text-decoration: line-through;
	color: #999;
}
.todo-container--revert-icon {
	cursor: pointer;
	color: #09f;
}
.todo-container--delete-icon {
	cursor: pointer;
	color: red;
}
.todo--checkbox {
	width: 17px;
	margin-right: 10px;
}
#new-task--todo {
	padding-right: 75px !important;
}
</style>
