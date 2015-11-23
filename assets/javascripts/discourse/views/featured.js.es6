import UploadView from 'discourse/views/upload-selector';

export default UploadView.extend({
	title: function() {
		return I18n.t("featured.modal_title");
	}.property()
});
