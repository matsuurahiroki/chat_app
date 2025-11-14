# frozen_string_literal: true

class AddDeviseFieldsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :email, :string, null: false, default: ''
    add_column :users, :encrypted_password, :string, null: false, default: ''

    add_index :users, :email, unique: true
  end
end
