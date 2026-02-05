# frozen_string_literal: true

# backend/config/puma.rb

threads_count = ENV.fetch('RAILS_MAX_THREADS', 3)
threads threads_count, threads_count

port = Integer(ENV.fetch('PORT', 8000))
bind "tcp://0.0.0.0:#{port}"
bind_host = ENV.fetch('PUMA_BIND_HOST', '127.0.0.1')
bind "tcp://#{bind_host}:#{port}"

plugin :tmp_restart
pidfile ENV['PIDFILE'] if ENV['PIDFILE']
