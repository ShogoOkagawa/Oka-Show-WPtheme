# OKA-SHOW WordPress テーマ — 導入手順

このフォルダ（`oka-show`）が WordPress オリジナルテーマ本体です。
**このフォルダごと** `wp-content/themes/` に入れて使います（`wp-theme/` は入れません）。

---

## 1. テーマを設置する（MAMP）

1. MAMP の WordPress の場所を開く
   例）`/Applications/MAMP/htdocs/（サイト名）/wp-content/themes/`
2. この `oka-show` フォルダを **`themes/` 直下にコピー**
   → `wp-content/themes/oka-show/style.css` になる形
3. 管理画面 → **外観 → テーマ** → 「OKA-SHOW」を**有効化**

## 2. パーマリンク設定（重要）

管理画面 → **設定 → パーマリンク** → 「**投稿名**」を選択 → 保存
（CPT「制作実績」の URL `/works/` を有効にするため。保存するだけでOK）

## 3. お問い合わせ（Contact Form 7）

1. **プラグイン → 新規追加** → 「Contact Form 7」をインストール・有効化
2. **お問い合わせ → コンタクトフォーム** → 新規追加し、フォーム欄に
   下記「CF7 フォーム雛形」を貼り付けて保存
3. 生成された**ショートコード**（例 `[contact-form-7 id="123" ...]`）をコピー
4. **固定ページ → 新規追加**
   - タイトル: `Contact`
   - **パーマリンク（スラッグ）: `contact`** ← これが必須
   - 右側「ページ属性 → テンプレート」で **「お問い合わせ」** を選択
   - 本文に**ショートコードを貼り付け** → 公開

## 4. トップページ

`front-page.php` があるため、**ホームは自動的にこのデザイン**になります。
（必要なら 設定 → 表示設定 で固定ページをホームに指定してもOK）

## 5. 制作実績を追加する（投稿するだけ）

管理画面 → **制作実績 → 新規追加**
- **タイトル**：作品名（例: LamuRe）
- **カテゴリ**：WEB / SYSTEM / DRONE / VIDEO から選択（一覧フィルタに連動）
- **アイキャッチ画像**：一覧サムネ＆詳細ページ上部の大画像に使用
- **本文**：詳細ページの説明文（見出し・段落OK）
- **制作実績の詳細情報**（本文下のメタ欄）：
  - CLIENT / YEAR / ROLE / EQUIPMENT / 動画URL（YouTube・Vimeo）
  - **ギャラリー画像**：「画像を選択/追加」で複数選択（詳細ページ下部に表示）
- **公開** → 一覧・詳細ページ・前後ナビが自動生成されます

> 並び順は「ページ属性 → 順序」（数値）で調整可能（小さいほど先頭）。

---

## 6. プライバシーポリシー固定ページ

1. **固定ページ → 新規追加**
   - タイトル：`プライバシーポリシー`
   - **スラッグ：`privacy`**（フッター・フォームの同意リンク先がこれ）
   - テンプレートは**「デフォルトテンプレート」のまま**でOK（`page.php` が自動でオンブランド表示）
2. 本文に、同梱の **`privacy-policy.html` の中身を貼り付け**
   （ブロックエディタなら「カスタムHTML」ブロック、クラシックなら「テキスト」モード）
3. **公開**
   - フッターの「プライバシーポリシー」、お問い合わせフォームの同意リンクから `/privacy/` に繋がります
   - 事業者情報（所在地・連絡先など）は実際の内容に書き換えてください

---

## CF7 フォーム雛形（手順3-2で貼り付け）

```
<div class="form-grid">
  <div class="field"><label>お名前 <span class="req">*</span></label>[text* your-name placeholder "山田 太郎"]</div>
  <div class="field"><label>会社名・屋号</label>[text your-company placeholder "任意"]</div>
  <div class="field"><label>メールアドレス <span class="req">*</span></label>[email* your-email placeholder "you@example.com"]</div>
  <div class="field"><label>電話番号</label>[tel your-tel placeholder "任意"]</div>
  <div class="field full"><label>ご依頼内容 <span class="req">*</span></label>[select* your-type "Web制作" "システム開発" "ドローン空撮" "動画制作" "複数/その他"]</div>
  <div class="field full"><label>ご予算感</label>[select your-budget "未定/相談したい" "〜10万円" "10〜30万円" "30〜50万円" "50万円〜"]</div>
  <div class="field full"><label>メッセージ <span class="req">*</span></label>[textarea* your-message placeholder "内容・公開時期・参考サイトなど、わかる範囲でご記入ください。"]</div>
  <label class="privacy">[acceptance privacy-consent] <a href="/privacy/">プライバシーポリシー</a>に同意の上、送信します。[/acceptance]</label>
  <div class="form-foot">
    <p class="form-note">2〜3営業日以内にご返信します。</p>
    [submit class:btn "送信する"]
  </div>
</div>
```

「メール」タブで下記「メール設定」を入力してください。

---

## CF7 メール設定（手順3-2の「メール」タブ）

Contact Form 7 の編集画面 →「メール」タブで設定します。
`your-domain.com` は実際のドメイン、送信先は受信したいアドレス（例: info@oka-show.site）に置き換えてください。

### ■ メール（通知用 / 自分が受け取る）

| 項目 | 入力内容 |
|---|---|
| 宛先 (To) | `info@oka-show.site` |
| 送信元 (From) | `OKA-SHOW <wordpress@your-domain.com>` |
| 題名 (Subject) | `【お問い合わせ】[your-type] / [your-name] 様（OKA-SHOW）` |
| 追加ヘッダー | `Reply-To: [your-email]` |
| メッセージ本文 | 下記 |

```
OKA-SHOW サイトのお問い合わせフォームから送信がありました。

──────────────────────────────
■ お名前　　：[your-name]
■ 会社名・屋号：[your-company]
■ メール　　：[your-email]
■ 電話番号　：[your-tel]
■ ご依頼内容：[your-type]
■ ご予算感　：[your-budget]
──────────────────────────────
■ メッセージ
[your-message]
──────────────────────────────

送信日時：[_date] [_time]
送信元ページ：[_url]
送信者IP：[_remote_ip]
```

> ※「Reply-To: [your-email]」を入れておくと、受信メールでそのまま「返信」すれば
> お客様に直接返信できます。From を送信者アドレスにすると迷惑メール判定されやすいため、
> From は自ドメインのアドレスにするのが推奨です。

### ■ メール (2)（自動返信用 / お客様へ届く）

「メール」タブ下部の **「メール (2) を使用」にチェック**して設定します。

| 項目 | 入力内容 |
|---|---|
| 宛先 (To) | `[your-email]` |
| 送信元 (From) | `OKA-SHOW <info@oka-show.site>` |
| 題名 (Subject) | `【OKA-SHOW】お問い合わせありがとうございます` |
| 追加ヘッダー | `Reply-To: info@oka-show.site` |
| メッセージ本文 | 下記 |

```
[your-name] 様

この度は OKA-SHOW にお問い合わせいただき、誠にありがとうございます。
以下の内容で受け付けいたしました。2〜3営業日以内に担当者よりご連絡いたします。
お急ぎの場合は info@oka-show.site までお電話・メールにてご連絡ください。

──────────────────────────────
■ お名前　　：[your-name]
■ 会社名・屋号：[your-company]
■ メール　　：[your-email]
■ 電話番号　：[your-tel]
■ ご依頼内容：[your-type]
■ ご予算感　：[your-budget]
──────────────────────────────
■ メッセージ
[your-message]
──────────────────────────────

なお、本メールは自動送信です。本メールにお心当たりがない場合は、
お手数ですが破棄いただきますようお願いいたします。

━━━━━━━━━━━━━━━━━━━━━━
OKA-SHOW ／ 岡川 祥伍
映像・ドローン・Web / システム開発
Web    : https://oka-show.site/
Mail   : info@oka-show.site
YouTube: https://www.youtube.com/@shogookagawa5084
━━━━━━━━━━━━━━━━━━━━━━
```

> 自動返信の本文には個人情報が含まれます。フォームに必須でないフィールド（電話番号など）が
> 空のときは行ごと消したい場合、Contact Form 7 の「条件付きフィールド（Conditional Fields）」
> アドオン等で対応できます（任意）。

---

## メモ
- **3Dエネルギーコア**：`assets/js/energy-core.js`（Three.js を CDN から読み込み）。トップのみ。
- **ショーリール動画**：`assets/video/showreel.mp4`（差し替え可）。
- **ロゴ**：`assets/img/logo.svg`。
- SNSリンク（YouTube以外）は `header.php` / `footer.php` の `#` を実URLに置き換えてください。
- 静的プロトタイプ（`Oka-show-new/*.html` や `.tools/`）は本番には不要です。
