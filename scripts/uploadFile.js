function checkUploadSpeed( iterations, update ) {
    var average = 0,
        index = 0,
        timer = window.setInterval( check, 1000 ); //check every 5 seconds
    check();
    
    function check() {
        var xhr = new XMLHttpRequest(),
            url = '?cache=' + Math.floor( Math.random() * 10000 ), //prevent url cache
            data = getRandomString( 1 ), //1 meg POST size handled by all servers
            startTime,
            speed = 0;
        xhr.onreadystatechange = function ( event ) {
            if( xhr.readyState == 4 ) {
                speed = Math.round( 1024 / ( ( new Date() - startTime ) / 1000 ) );
                average == 0 
                    ? average = speed 
                    : average = Math.round( ( average + speed ) / 2 );
                update( speed, average );
                index++;
                if( index == iterations ) {
                    window.clearInterval( timer );
                };
            };
        };
        xhr.open( 'POST', url, true );
        startTime = new Date();
        xhr.send( data );
    };
    
    function getRandomString( sizeInMb ) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]\{}|;':,./<>?", //random data prevents gzip effect
            iterations = sizeInMb * 1024 * 1024, //get byte count
            result = '';
        for( var index = 0; index < iterations; index++ ) {
            result += chars.charAt( Math.floor( Math.random() * chars.length ) );
        };     
        return result;
    };
};

function changeValue(id, value) { document.getElementById(id).innerHTML = value; }

function addLinkToDB(imgName, imgDescription, fileType, imgHash, link, hash){
    let user = Moralis.User.current();

    const Monster = Moralis.Object.extend("USER_IPFS");
    const monster = new Monster();
            
    monster.set("address", user.get("ethAddress"));
    monster.set("link_ipfs", link);
    monster.set("hash_ipfs", hash);
    monster.set("ImgName", imgName);
    monster.set("ImgDescription", imgDescription);
    monster.set("ImgHash", imgHash);
    monster.set("fileType", fileType);
    monster.setACL(new Moralis.ACL(Moralis.User.current()));

    monster.save().then(
        (monster) => {
            // Execute any logic that should take place after the object is saved.
            alert("File caricato!");
            location.reload();
        },
        (error) => {
            alert("Errore nel caricamento del file. Riprovare.");
        }
    );
}

uploadImage = async () => {
    const nameImg = document.getElementById("nameImg").value;
    const fileInput = document.getElementById("image");
    const data = fileInput.files[0];
    const file = new Moralis.File(nameImg, data);
    await file.saveIPFS();

    console.log(file.ipfs(), file.hash())

    return file.hash();
}

uploadMetadata = async (imageHash) => {
    const nameImg = document.getElementById("nameImg").value;
    const description = document.getElementById("description").value;
    const fileType = document.getElementById("fileType").value;

    const metadata = {
        "name": nameImg, 
        "description": description, 
        "type": fileType,
        //"file": "https://gateway.moralisipfs.com/ipfs/" + imageHash
        "file": imageHash
    };

    //changeValue("result", new String(metadata));

    const file = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(metadata)),
    });

    console.log(file);

    await file.saveIPFS();

    console.log(file.ipfs(), file.hash());
    
    addLinkToDB(nameImg, description, fileType, imageHash, file.ipfs(), file.hash());

    var res = "File caricato correttamente!";
    // var res = "<br>IPFS: <a href = '" + file.ipfs() + "' target = '_blank'>link</a>";
    // res += "<br>HASH: " + file.hash();

    changeValue("result", res);
}

async function checkIfExist(){
    const data = image.files[0];
    const file = new Moralis.File(data.name, data);
    await file.saveIPFS();

    let user = Moralis.User.current();

    const Monster = Moralis.Object.extend("USER_PHOTO");
    const query = new Moralis.Query(Monster);

    query.equalTo("address", user.get("ethAddress"));

    const results = await query.find();
        //alert(results.length);

    if(results.length === 0) {
    
        const monster = new Monster();
                    
        monster.set("address", user.get("ethAddress"));   
        monster.setACL(new Moralis.ACL(Moralis.User.current()));

        monster.save().then(
            (monster) => {
                    // Execute any logic that should take place after the object is saved.
                console.log("Account aggiunto a USER_PHOTO");
            },
            (error) => {
                console.log("Errore - Account non aggiunto a USER_PHOTO");
            }
        );
    } else {
        console.log("Account già presente in USER_PHOTO");
    }
}
    
uploadAll = async () => {
    const fileInput = document.getElementById("image");

    checkIfExist();

    const bar = "<div class='progress'><div id = 'bar' style = 'width: 0%;' class = 'progress-bar progress-bar-striped bg-warning' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100'></div></div>";

    if(fileInput.files.length != 0 && document.getElementById("fileType").value !== "Tipo" && document.getElementById("nameImg").value !== ""){

        changeValue("result", bar);
        
        var timer = setInterval(function (){
            var rap = 1 / (filesize + 10) * 100;
            console.log("rap: " + rap);
        
            percentuale += rap;
            console.log("percentuale: " + percentuale);
            
            document.getElementById("bar").style.width = percentuale + "%";
        }, 1000);

        try{
            const image = await uploadImage();
            await uploadMetadata(image);
        } catch (error){
            console.log(error);
            window.clearInterval(timer);
        }

    } else {
        changeValue("result", "Devi compilare tutti i campi!");
    }
    
}

document.getElementById("upload").onclick = uploadAll;

var percentuale = 0;
var filesize = 0;
console.log("filesize: " + filesize);

document.getElementById("image").onchange = () => {
    filesize = document.getElementById("image").files[0].size / 1000000;  //QUESTA MERDA è IN KILOBYTE
    console.log("filesize: " + filesize + " MB");
   //alert((filesize / 1000) + "MB");
}




