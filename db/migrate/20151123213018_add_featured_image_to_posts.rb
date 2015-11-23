class AddDeletedAtToPosts < ActiveRecord::Migration
  def change
    add_column :topics, :featured_image, :string
  end
end
