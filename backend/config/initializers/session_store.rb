# frozen_string_literal: true

# config/initializers/session_store.rb
Rails.application.config.session_store :cookie_store,
                                       key: '_app_session',
                                       same_site: :lax, # クロスサイトなら :none
                                       secure: Rails.env.production?
