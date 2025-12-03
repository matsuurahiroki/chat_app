# frozen_string_literal: true

# app/controllers/api/rooms_controller.rb

module Api
  class RoomsController < ApplicationController
    protect_from_forgery with: :null_session
    before_action :verify_bff_token!

    def index
      rooms = Room.includes(:user).order(created_at: :desc)
      render json: rooms.as_json(
        only: %i[id title user_id created_at],
        include: {
          user: {
            only: %i[id name]
          }
        }
      )
    end

    def create
      # 1. user_id からユーザーを特定
      user = User.find_by(id: params[:user_id])
      return render json: { error: 'user_not_found' }, status: :not_found unless user

      # 2. そのユーザーに紐づくルームを作成
      room = user.rooms.build(title: params[:title])

      # 3. 保存できたら 201 / ダメなら 422
      if room.save
        render json: room.as_json(only: %i[id title user_id created_at]),
               status: :created
      else
        render json: { error: room.errors.full_messages },
               status: :unprocessable_entity
      end
    end

    def show
      room = Room.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found unless room

      render json: room.as_json(only: %i[id title user_id created_at])
    end

    private

    # ※ room_params はとりあえず使わず、上で params から直接拾う
    #   強くしたくなったら後で整える
    # def room_params
    #   params.permit(:title, :user_id)
    # end

    def verify_bff_token!
      expected = ENV['BFF_SHARED_TOKEN'].to_s
      provided = request.headers['X-BFF-Token'].to_s
      head :unauthorized unless expected.present? &&
                                ActiveSupport::SecurityUtils.secure_compare(expected, provided)
    end
  end
end
