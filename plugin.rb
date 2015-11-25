# name: discourse-plugin-featured-image
# about: Add Featured Image to the Topic
# version: 0.4
# authors: Emanuele Tonello
# url: https://github.com/startsat60/discourse-plugin-featured-image

enabled_site_setting :featured_enabled

register_asset 'stylesheets/featured.scss'

after_initialize do
  FEATURED_FIELD_NAME = 'featured_image'

# to handle the edge case of this post processor class that even if apparently gets called only
# on the RSpec suite, it will override the selected featured image
  require_dependency 'cooked_post_processor'
  CookedPostProcessor.class_eval do
    FEATURED_FIELD_NAME = 'featured_image'
      def update_topic_image
        if !@post.topic.custom_fields[FEATURED_FIELD_NAME].present?
          if @post.is_first_post?
            img = extract_images_for_topic.first
            @post.topic.update_column(:image_url, img["src"][0...255]) if img["src"].present?
          end
        end
      end
  end

  add_to_class :topic, :featured_image do
    result = custom_fields[FEATURED_FIELD_NAME]
  end

# handling image update
  PostRevisor.track_topic_field(:featured_image) do |tc, featured_image|
    tc.topic.custom_fields.update(FEATURED_FIELD_NAME => featured_image)
    tc.topic.image_url = featured_image
    tc.topic.save
  end

# populating field on topic creation
  on(:topic_created) do |topic, params, _user|
    topic.custom_fields[FEATURED_FIELD_NAME] = params[:featured_image]
    topic.image_url = params[:featured_image]
    topic.save
  end

# adding the field to the serializer, to be able to use it in the injected template
  TopicViewSerializer.attributes_from_topic(:featured_image)
end
