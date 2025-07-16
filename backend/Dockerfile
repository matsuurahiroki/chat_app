FROM ruby:3.4.4-slim

# 必要パッケージをインストール
RUN apt-get update -qq && \
    apt-get install -y \
    nodejs \
    postgresql-client \
    build-essential \
    libpq-dev \
    libssl-dev \
    libyaml-dev \
    zlib1g-dev \
    libgmp-dev

# 作業ディレクトリ設定
ENV APP_HOME=/app
WORKDIR $APP_HOME

# Gemfile をコピーして bundle install
COPY backend/Gemfile $APP_HOME/Gemfile
COPY backend/Gemfile.lock $APP_HOME/Gemfile.lock
RUN bundle install

# Rails を明示的にインストール
RUN gem install rails

# アプリ全体をコピー（start.sh含む）
COPY backend/ $APP_HOME/
RUN chmod +x $APP_HOME/start.sh

# ポートを開放
EXPOSE 8000

# 起動スクリプト
CMD ["bash", "/app/start.sh"]
