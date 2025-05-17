FROM ubuntu:24.04

# Pythonのモジュールなどをインストール
RUN apt-get update && apt-get install -y netcat-openbsd \
    python3 python3-pip python3-venv python3-dev \
    default-libmysqlclient-dev zlib1g-dev build-essential \
    libssl-dev cron && apt-get clean

# 仮想環境を作成
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# タイムゾーン設定
ENV TZ=Asia/Tokyo

# UID 1010 のユーザー appuser を作成
RUN groupadd -g 1010 appgroup && useradd -m -u 1010 -g appgroup appuser

# アプリケーションフォルダを環境変数として設定
ENV APP_HOME=/app
WORKDIR $APP_HOME

# 環境変数ファイルを適切な場所に配置
COPY backend/.env.production $APP_HOME/.env.production

# pipアップグレード & 依存インストール
COPY backend/requirements.txt $APP_HOME/requirements.txt

RUN /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install --no-cache-dir -r $APP_HOME/requirements.txt

# プロジェクト本体のコピー
COPY backend $APP_HOME

# 実行権限を付与
COPY backend/start.sh $APP_HOME/start.sh
RUN chmod +x $APP_HOME/start.sh

# 必ずキャッシュ用のディレクトリを作っておくこと→ Fargateの場合ずっとキャッシュが残ることになる
# 必要なディレクトリを作成（キャッシュ用）
RUN mkdir -p /tmp/cache && \
    mkdir -p /tmp/sessions && \
    chown -R appuser:appgroup /tmp/cache /tmp/sessions

# 環境変数でキャッシュパスを設定
ENV CACHE_DIR=/tmp/cache

# 書き込み権限を与える
RUN chown -R appuser:appgroup $APP_HOME

#ユーザー指定
USER appuser

#ポートを設定
EXPOSE 8000

# コンテナ起動時に uwsgi を実行
CMD ["/app/start.sh"]