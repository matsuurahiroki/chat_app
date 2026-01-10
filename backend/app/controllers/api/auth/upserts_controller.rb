# frozen_string_literal: true

# app/controllers/api/auth/upserts_controller.rb
module Api
  module Auth
    class UpsertsController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :verify_bff_token!

      def create
        raw = params[:upsert].presence || params
        # ↑upsertで包まれてるverとparamsで直でくるverの両対応
        p = raw.permit(:provider, :providerSub, :email, :name)
        # ↑指定のキーのみ取得
        provider = p[:provider].to_s
        uid = p[:providerSub].to_s
        # ↑nilで落ちるのを防止のため文字列化(.to_s)
        email = p[:email].presence
        name  = p[:name].presence || '名無しユーザー'
        # ↑空の場合nilで返す(.presence)

        return render json: { error: 'bad_request' }, status: :bad_request if provider.blank? || uid.blank?

        if (idn = Identity.includes(:user).find_by(provider:, uid:))
          # ↑Identityテーブルで紐づいるuserも読み込む、provider:, uid:で検索
          return render json: { railsUserId: idn.user_id, railsUserName: idn.user.name }, status: :ok
          # ↑idn.user_idをrailsUserIdとして返す
        end

        user =
          if email && (u = User.find_by(email: email))
            u.update!(name: name) if name.present?
            u
            # 既存ユーザーがemailで見つかった場合統合する
          else
            # Devise(validatable)はパスワード必須 → ランダム付与
            pwd = SecureRandom.base58(16)
            User.create!(
              name: name,
              email: email || "oauth-#{provider}-#{uid}@example.invalid",
              password: pwd
            )
            # 新規の場合、passwordはランダム生成、emailが無ければダミーemailを設定、新規作成
          end

        Identity.create!(user:, provider:, uid:)
        render json: { railsUserId: user.id, railsUserName: user.name }, status: :created
        # ↑Identityレコード作成、user.idをrailsUserIdとして返す
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: 'validation_error', details: e.record.errors.full_messages },
               status: :unprocessable_entity
        # ↑エラー時の処理
      end

      private

      def verify_bff_token!
        expected = ENV['BFF_SHARED_TOKEN'].to_s
        provided = request.headers['X-BFF-Token'].to_s
        head :unauthorized unless expected.present? && ActiveSupport::SecurityUtils.secure_compare(expected, provided)
      end
    end
  end
end
