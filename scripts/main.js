function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

console.log("user: ");
console.log(Moralis.User.current());

function getLinkIpfs(hash) {
    var url = "https://gateway.moralisipfs.com/ipfs/" + hash;
    return url;
}

checkUser();

async function getProfileData(user) {
    const Monster = Moralis.Object.extend("USER_PHOTO");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();


    const object = results[0];
    var ris = "";

    try {
        if (object.get("image_hash") !== 'undefined') {
            var linkImg = getLinkIpfs(object.get("image_hash"));
            ris += "<img style = 'width: 100px; height: 100px; border-radius: 50px;' src = '" + linkImg + "' alt='Foto profilo'>";
        }


        if (object.get("username") !== 'undefined')
            ris += "<br><p>" + object.get("username") + "</p>";

        changeValue("profileData", ris);

    } catch (error) {
        console.log(error.code + " " + error.message);
    }
}