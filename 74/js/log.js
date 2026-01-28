function displayDrinks()
{
    let sortBy = document.getElementById("sortBy").value;
    let drinkList = document.getElementById("drinkList");

    //すべてのカテゴリのお酒の表示を一旦クリア
    let allItems = drinkList.querySelectorAll(".items");
    for(let items of allItems)
    {
        while(items.firstChild)
        {
            items.removeChild(items.firstChild);
        }
    }

    //ローカルストレージからデータを取得（なければ空の配列）
    let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

    //降順ソート
    drinks.sort(function(a,b)
    {
        return b[sortBy] - a[sortBy];
    });
    
    //既存のカテゴリごとに振り分け
    for(let i = 0; i < drinks.length; i++)
    {
        let drink = drinks[i];
        let index = i;

        //data-categoryで一致するdivを探す
        let selector = "[data-category='" + drink.category + "']";
        let categoryDiv = drinkList.querySelector(".category" + selector);
        let itemsContainer = categoryDiv.querySelector(".items");

        //アコーディオンの外枠作成
        let accordion = document.createElement("div");
        accordion.className = "accordion";

        //アコーディオンの見出し作成
        let header = document.createElement("div");
        header.className = "accordionHeader";
        header.textContent = drink.name;

        //アコーディオンの中
        let content = document.createElement("div");
        content.className = "accordionContent";

        //アコーディオンの中の表示内容
        let pSweet = document.createElement("p");
        pSweet.textContent = "甘さ: " + drink.sweetness;

        let stars1 = document.createElement("span");
        attachStarsBar(stars1, drink.sweetness, 10);
        pSweet.appendChild(stars1);


        let pPref = document.createElement("p");
        pPref.textContent = "好み: " + drink.preference;

        let stars2 = document.createElement("span");
        attachStarsBar(stars2, drink.preference, 10);
        pPref.appendChild(stars2);

        let pMemo = document.createElement("p");
        let memoText;
        if(drink.memo)
        {
            memoText = drink.memo;
        }
        else
        {
            memoText = "－";
        }
        pMemo.textContent = "メモ: " + memoText;

        //削除、編集ボタンの実装
        let actionBtn = document.createElement("div");
        actionBtn.className = "actionBtn";

        let editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "btn small";
        editBtn.textContent = "編集";
        editBtn.onclick = function()
        {
            editDrink(drink.id);
        };

        let delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn small danger";
        delBtn.textContent = "削除";
        delBtn.onclick = function()
        {
            deleteDrink(drink.id);
        };

        actionBtn.appendChild(editBtn);
        actionBtn.appendChild(delBtn);

        content.appendChild(pSweet);
        content.appendChild(pPref);
        content.appendChild(pMemo);
        content.appendChild(actionBtn);

        //開閉イベント
        header.onclick = function()
        {
            content.classList.toggle("show");
        };

        accordion.appendChild(header);
        accordion.appendChild(content);
        itemsContainer.appendChild(accordion);
    }
}

window.onload = displayDrinks;

//星表示のために値（割合）をセットする
function attachStarsBar(el, val, max = 10)
{
    let n = Math.max(0, Math.min(max, Number(val)));
    let pct = (n / max) * 100;
    el.classList.add("starsbar");
    el.style.setProperty("--pct", pct);
}

//削除機能
function deleteDrink(id)
{
    if(id == undefined || id == null)
    {
        alert("IDが取得できませんでした");
        return;
    }

    let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

    let target = null;
    for(let i = 0; i < drinks.length; i++)
    {
        if(drinks[i].id === id)
        {
            target = drinks[i];
            break;
        }
    }

    let answer = confirm(target.name + "を本当に削除しますか？");
    if(answer == false)
    {
        return;
    }
    
    var newDrinks = [];
    for(let j = 0; j < drinks.length; j++)
    {
        if(drinks[j].id !== id)
        {
            newDrinks.push(drinks[j]);
        }
    }

    localStorage.setItem("drinks", JSON.stringify(newDrinks));

    displayDrinks();
    alert("削除しました");
}

//編集機能
function editDrink(id)
{
    if(id == undefined || id == null)
    {
        alert("IDが取得できませんでした");
        return;
    }

    let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

    let drinkIndex = -1;
    for(let i = 0; i < drinks.length; i++)
    {
        if(drinks[i].id == id)
        {
            drinkIndex = i;
            break;
        }
    }

    if(drinkIndex == -1)
    {
        alert("対象が見つかりません");
        return;
    }

    let drink = drinks[drinkIndex];
    
    let newName = prompt("お酒の名前を編集", drink.name);
    if(newName == null)
    {
        return;
    }

    let newCategory = prompt("カテゴリを編集（変更しない場合はそのままEnter）\n 現在の値: " + drink.category, drink.category);
    if(newCategory == null)
    {
        return;
    }
    if(newCategory.trim() !== "" && newCategory.trim() !== drink.category)
    {
        // 存在するか確認
        let exists = document.querySelector(".category[data-category='" + newCategory.trim() + "']");
        if(!exists)
        {
            alert("入力されたカテゴリは存在しません。元のままにします。");
            newCategory = drink.category;
        }
    }
    else if(newCategory.trim() == "")
    {
        newCategory = drink.category;
    }

    let newMemo = prompt("メモを編集", drink.memo || '');

    let newSweetnessStr = prompt("甘さ (1-10) 　※半角数字で入力", drink.sweetness);
    let newSweetness = parseInt(newSweetnessStr, 10);

    let newPreferenceStr = prompt("好み (1-10) 　※半角数字で入力", drink.preference);
    let newPreference = parseInt(newPreferenceStr, 10);

    if(isNaN(newSweetness) || isNaN(newPreference))
    {
        alert("数値を正しく入力してください");
        return;
    }

    //更新
    drinks[drinkIndex] =
    {
        id: drink.id,
        name: newName.trim() || drink.name,
        category: newCategory.trim(),
        sweetness: newSweetness,
        preference: newPreference,
        memo: newMemo.trim()
    };

    localStorage.setItem("drinks", JSON.stringify(drinks));
    displayDrinks();
    alert("編集を保存しました");
}