import showModal from 'discourse/lib/show-modal';
import ApplicationRoute from 'discourse/routes/application';
import ComposerView from 'discourse/views/composer';
import { onToolbarCreate } from 'discourse/components/d-editor';

export default {
	name: 'featured',
	initialize(container) {
		Discourse.Composer.serializeOnCreate('featured_image');
 		Discourse.Composer.serializeToTopic('featured_image', 'topic.featured_image');
		const siteSettings = container.lookup('site-settings:main');

		if (siteSettings.featured_enabled) {
			if (typeof Discourse.ComposerEditorComponent === "undefined") {
				ApplicationRoute.reopen({
					actions: {
						showfeatured: function(composerView) {
							showModal('featured');
							this.controllerFor('featured').setProperties({
								composerViewOld: composerView
							});
						}
					}
				});

				ComposerView.reopen({
					initEditor: function() {
						// overwrite and wrap.
						this._super();
						var view = this;
						var button_text = I18n.t("featured.composer_button_text");
						var btn = $('<button class="wmd-button wmd-featured-button" title="' + button_text + '" aria-label="' + button_text + '"></button>');
						btn.click(function() {
							view.get("controller").send("showfeatured", view);
						});
						$("#wmd-button-row,.wmd-button-row").append(btn);
					}
				});
			} else {
				Discourse.DEditorComponent.reopen({
					actions: {
						showfeatured: function() {
							showModal('featured').setProperties({
								composerView: this
							});
						}
					}
				});

				onToolbarCreate(toolbar => {
					toolbar.addButton({
						id: "featured_button",
						group: "extras",
						icon: "picture-o",
						action: 'showfeatured'
					});
				});
			}
		}
	}
};
