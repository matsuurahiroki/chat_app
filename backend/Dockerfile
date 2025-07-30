FROM ruby:3.3.8

# 必要パッケージをインストール
RUN apt-get update -qq && \
    apt-get install -y \
    postgresql-client \
    build-essential \
    nodejs \
    libpq-dev \
    libssl-dev \
    libyaml-dev \
    zlib1g-dev \
    libgmp-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリ
ENV APP_HOME=/app
WORKDIR $APP_HOME

# Gemfile と Gemfile.lock をコピー
COPY backend/Gemfile backend/Gemfile.lock ./

# Gem install
RUN bundle install
RUN gem install rails

# start.sh を先にコピーして実行権限付与
COPY backend/start.sh ./start.sh

# envファイルをコピー
COPY backend/.env.production /app/.env.production

# アプリケーション全体をコピー
COPY backend/ .

# 権限付与
RUN chmod +x ./start.sh

# ポート開放
EXPOSE 8000

# 起動
ENTRYPOINT ["bash", "./start.sh"]