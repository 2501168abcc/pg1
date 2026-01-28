let nameInput = document.getElementById("name");
let categorySelect = document.getElementById("category");
let saveBtn = document.getElementById("saveButton");
let nameError = document.getElementById("nameErrorMessage");
let categoryError = document.getElementById("categoryErrorMessage");

//必須項目入力のための関数を呼ぶ
nameInput.addEventListener("input", validationCheck);
categorySelect.addEventListener("change", validationCheck);

//必須項目の入力チェック
function validationCheck()
{
    let isValid = true;

    if(nameInput.value.trim() === "")
    {
        nameError.textContent = "*お酒の名前を入力してください";
        nameError.style.color = "red";
        isValid = false;
    }
    else
    {
        nameError.textContent = "";
    }

    if(categorySelect.value === "")
    {
        categoryError.textContent = "*カテゴリーを選択してください";
        categoryError.style.color = "red";
        isValid = false;
    }
    else
    {
        categoryError.textContent = "";
    }

    saveBtn.disabled = !isValid;
}

//甘さのスライダーの入力値をリアルタイムに反映
document.getElementById("sweetness").addEventListener("input", function()
{
    document.getElementById("sweetnessValue").textContent = "現在の入力値　" + this.value;
});

//好みのスライダーの入力値をリアルタイムに反映
document.getElementById("preference").addEventListener("input", function()
{
    document.getElementById("preferenceValue").textContent = "現在の入力値　" + this.value;
});

//ボタンクリックで入力データをローカルストレージに保存
function saveDrink()
{
    let name = document.getElementById("name").value.trim();
    let category = document.getElementById("category").value;
    let sweetness = Number(document.getElementById("sweetness").value);
    let preference = Number(document.getElementById("preference").value);
    let memo = document.getElementById("memo").value;

    //ローカルストレージから既存のデータを取得（なければ空配列）
    let drinks = JSON.parse(localStorage.getItem("drinks")) || [];

    drinks.push
    ({
        id : Date.now(),
        name : name,
        category : category,
        sweetness : sweetness,
        preference : preference,
        memo : memo
    });

    localStorage.setItem("drinks", JSON.stringify(drinks));

    alert(name + "が記録されました");

    //フォームの入力をリセット
    document.getElementById("name").value = "";
    document.getElementById("category").value = "";
    document.getElementById("sweetness").value = 5;
    document.getElementById("sweetnessValue").textContent = "5";
    document.getElementById("preference").value = 5;
    document.getElementById("preferenceValue").textContent = "5";
    document.getElementById("memo").value = "";

    validationCheck();
};