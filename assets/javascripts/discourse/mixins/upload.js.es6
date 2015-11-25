import UploadMixin from "discourse/mixins/upload";

export default Em.Component.extend(UploadMixin, {

  composer_model: Ember.computed.alias('controllers.composer.model'),

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
