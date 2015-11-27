import UploadSelector from 'discourse/controllers/upload-selector';

export default UploadSelector.extend({
  needs: ['upload-selector', 'composer'],

  composer_model: Ember.computed.alias('controllers.composer.model'),

  actions: {
    upload() {
      if (this.get('local')) {
        $('.wmd-controls').fileupload('add', {
          fileInput: $('#filename-input')
        });
        this.get("composer_model").set("isfeatured", true);
        this.set("isfeatured", true);
        this.get("composer_model").update({
          isfeatured: true
        });
      } else {
        const imageUrl = this.get('imageUrl') || '';
        const imageLink = this.get('imageLink') || '';

        this.get("composer_model").set("featured_image", imageUrl);

        this.set("featured_image", imageUrl);
        this.get("composer_model").update({
          featured_image: imageUrl
        });
      }

      this.send('closeModal');
    }
  }
});
