class DropRoomBansAndReports < ActiveRecord::Migration[7.2]
  def change
    drop_table :room_bans, if_exists: true
    drop_table :reports, if_exists: true
  end
end
