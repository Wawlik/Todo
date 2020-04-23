const lskey = 'tasks';
export default {
	methods: {
		confirmDelete(index, name) {
			if (window && window.UIkit) {
				let self = this;
				let txt = 'Вы уверены, что хотите удалить заметку ' + name + ' ?';
				return window.UIkit.modal.confirm(txt).then(
					function () {
						return self.deleteNote(index, lskey);
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
		async deleteNote(index, lskey) {
			let data = null;
			try {
				let str = localStorage.getItem(lskey);
				if (str) {
					data = JSON.parse(str);
					// list or local method
					let id = index || this.$route.params.id;
					data.splice(id, 1);
					let misc = JSON.stringify(data);
					localStorage.setItem(lskey, misc);
				} else {
					localStorage.setItem(lskey, []);
				}
				this.notifyOk('Вы успешно удалили заметку');
				return 200;
			} catch (error) {
				this.notifyErr('Что-то пошло не так. Попробуйте перезагрузить страницу')
				return 0;
			}
		},
		notifyOk(msg, timeout) {
			if (!msg) {
				msg = 'Операция успешно выполнена';
			}
			if (window && window.UIkit) {
				window.UIkit.notification({
					message: msg,
					status: 'success',
					timeout: timeout || 3000,
					pos: 'top-right'
				});
			}
		},
		notifyWarn(msg, timeout) {
			if (!msg) {
				msg = 'Что-то пошло не так';
			}
			if (window && window.UIkit) {
				window.UIkit.notification({
					message: msg,
					status: 'warning',
					timeout: timeout || 3000,
					pos: 'top-right'
				});
			}
		},
		notifyErr(msg, timeout) {
			if (!msg) {
				msg = 'Что-то пошло не так, попытайтесь обновить страницу';
			}
			if (window && window.UIkit) {
				window.UIkit.notification({
					message: msg,
					status: 'danger',
					timeout: timeout || 5000,
					pos: 'top-right'
				});
			}
		},
	}
};
