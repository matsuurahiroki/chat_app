// src/lib/auth/errorMessages.ts

export const errorMessages = (code?: string) => {
  switch (code) {
    case "email_not_confirmed":
      return "メール確認が必要です。確認メールのリンクを開いてください。";

    case "invalid_credentials":
    case "CredentialsSignin":
      return "メールアドレスまたはパスワードが正しくありません。";

    case "REGISTER_OK":
      return "確認メールを送信しました。メール内リンクを開いてからログインしてください。";

    case "missing_name":
      return "ユーザー名を入力してください。";

    case "missing_email":
      return "メールアドレスを入力してください。";

    case "missing_password":
      return "パスワードを入力してください。";

    case "email_duplication":
      return "このメールアドレスは既に登録されています。";

    case "invalid_email_format":
      return "メールアドレスの形式が正しくありません。";

    case "password_too_short":
      return "パスワードは6文字以上である必要があります。";

    case "password_complexity_invalid":
      return "パスワードは英字と数字をそれぞれ1文字以上含めてください。";

    case "validation_error":
      return "入力内容に誤りがあります。";

    case "Request body must be JSON":
      return "送信データの形式が不正です。";

    case "BACKEND_API_URL undefined":
      return "サーバー設定エラーです。";

    case "BFF internal error":
      return "サーバー内部エラーが発生しました。";

    case "password_invalid_multiple":
      return "パスワードは6文字以上且つ英字と数字をそれぞれ1文字以上含めてください。";

    default:
      return "登録またはログインに失敗しました。";
  }
};
