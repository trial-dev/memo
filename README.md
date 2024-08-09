簡単なメモを作成した。
講義でやった内容に削除ボタンを追加し、一度入力した内容を簡単に消せるようにしたことで買い物リストやtodoリストとして利用できるようにした。

index.ejsでは削除ボタンを追加した。
<form action="/api/user/<%= user %>/delete" method="POST" style="display:inline;">
          <button type="submit" class="delete-button">削除</button>
        </form>

このコードによって指定されたユーザー名それぞれで削除リクエストを送信するボタンを作成した。ボタンはユーザー名の右側にそれぞれ表示される。    

app.post('/api/user/:user/delete', async (req, res) => {
    const userName = req.params.user;
    await db.collection('user').deleteOne({ name: userName });
    res.redirect('/');
  });
index.jsではこれで削除のリクエストを処理するルートを追加した。

さらに、見やすくするためにpublicにstyles.cssを作成した。
これによってフォントサイズ、字体、字の色や背景色などを設定した。ボタンはカーソルを重ねた時に色が変化するようにした。

項目を追加したい時にはその内容を入力してから追加ボタンを押してリロードするとその項目が追加される。
削除したい場合にはその項目の右側にある削除ボタンをクリックするとその項目が消える。
