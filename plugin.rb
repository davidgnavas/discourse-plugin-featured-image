# name: discourse-plugin-featured-image
# about: Add Featured Image Support
# version: 0.1
# authors: Emanuele Tonello
# url: https://github.com/

enabled_site_setting :featured_enabled

after_initialize do
  FEATURED_FIELD_NAME = 'featured_image'

  module ::FeaturedImage
    FEATURED_FIELD_NAME = 'featured_image'
    class Engine < ::Rails::Engine
      engine_name 'discourse-plugin-featured-image'
      isolate_namespace FeaturedImage
    end
  end

# use routes?
#   FeaturedImage::Engine.routes.draw do
#     put '/:topic_id/featured_image' => 'feautred_image#update'
# end

  require_dependency 'application_controller'

  # Add a `tags` reader to the Topic model for easy reading of tags
  add_to_class :topic, :featured_image do
    result = custom_fields[FEATURED_FIELD_NAME]
  end

  PostRevisor.track_topic_field(:featured_image) do |tc, featured_image|
    puts 'PostRevisor'
    tc.record_change(FEATURED_FIELD_NAME, tc.topic.custom_fields[FEATURED_FIELD_NAME], featured_image)
    tc.topic.custom_fields.update(FEATURED_FIELD_NAME => featured_image)
  end

  on(:topic_created) do |topic, params, _user|
    topic.custom_fields[FEATURED_FIELD_NAME] = params[:featured_image]
    topic.image_url = params[:featured_image]
    topic.save
  end

  TopicViewSerializer.attributes_from_topic(:featured_image)
end
