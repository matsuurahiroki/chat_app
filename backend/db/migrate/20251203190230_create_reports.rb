class CreateReports < ActiveRecord::Migration[7.2]
  def change
    create_table :reports do |t|
      t.integer :reporter_id
      t.integer :reported_id
      t.integer :room_id
      t.integer :message_id
      t.text :reason

      t.timestamps
    end
  end
end
