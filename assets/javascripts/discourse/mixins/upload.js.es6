import UploadMixin from "discourse/mixins/upload";

export default Em.Component.extend(UploadMixin, {

  composer_model: Ember.computed.alias('controllers.composer.model'),
  // type: "topic-image",
  // classNames: ["topic-image-uploader"],
  //
  // backgroundStyle: function() {
  // 	let topic = this.get('model').get('topic')
  // 	const imageUrl = this.get("imageUrl") || (topic && topic.topic_image_thumbnail);
  //
  // 	if (typeof(imageUrl) == 'undefined') {
  // 		return false;
  // 	}
  // 	if (Em.isNone(imageUrl)) {
  // 		return false
  // 	}
  //
  // 	return ("background-image: url(" + imageUrl + ")").htmlSafe();
  //
  // }.property("imageUrl"),
  _initialize: function() {
    this.messageBus.subscribe("/uploads/" + this.get("type"), upload => {
      if (upload && upload.url) {
        this.get("composer_model").set("featured_image", upload.url);
        this.get("composer_model").update({
          featured_image: upload.url
        });
      } else {
        Discourse.Utilities.displayErrorForUpload(upload);
      }
      reset();
    });
  }.on("didInsertElement"),

  uploadDone(upload) {
    const model = this.get('model')

    model.set('featured_image', upload.url);

    this.set("featured_image", upload.url);

    this.get("composer_model").set("featured_image", upload.url);
    this.get("composer_model").update({
      featured_image: upload.url
    });
  }
});
