# app/models/report.rb
# frozen_string_literal: true

class Report < ApplicationRecord
  belongs_to :reporter, class_name: 'User', foreign_key: 'reporter_id'
  belongs_to :reported, class_name: 'User', foreign_key: 'reported_id'
  belongs_to :room, optional: true
  belongs_to :message, optional: true

  validates :reason, presence: true

  validates :reported_id,
            uniqueness: {
              scope: %i[reporter_id room_id],
              message: 'はこのルームではすでに通報済みです'
            }
end

# reports テーブルの reporter_id カラムは、users テーブルの id を指す、という関連。
# belongs_to :reporter
# → report.reporter で「通報した人（User）」が取れるようになる。
# class_name: 'User'
# → 関連先のモデルクラスは User ですよ、という指定。
# foreign_key: 'reporter_id'
# → この関連に使うカラム名は reporter_id ですよ、という指定。
# optional: true
# → reporter_id が nil（未設定）でもレコードを保存できるようにする（NOT NULL制約にはしない）
