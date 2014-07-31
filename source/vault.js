/*
Compression Tools:
http://www.cssdrive.com/index.php/main/csscompressor
http://javascriptcompressor.com/
http://htmlcompressor.com/compressor.html
*/

function onEnterKey(object, f){
  object.onkeypress = function(e){
    if (e.which == 13){
      f();
    }
  };
}

function $(e){return document.getElementById(e);}

var Vault = {
  templates: {
    keyForm: "<div><label>Log in with</label><select id='login'><option>Password</option><option>Key Pair</option></select></div><div id='loginform'></div>",
    loginPassword: "<label for='key'>Key</label><input type='password' id='key' />",
    loginKeypair: "<div><label for='key1'>Key 1</label><input type='input' id='key1' /></div><div><label for='key2'>Key 2</label><input type='input' id='key2' /></div><input type='hidden' id='key' />",
    setKeyForm: "<div><label for='key'>Key</label><input type='password' id='key' /></div><div><label for='keyConfirm'>Confirm</label><input type='password' id='keyConfirm' /></div><div><label>&nbsp;</label><button id='createVault'>Create Vault</button></div>",
    changeKeyForm: "<div><label for='key'>Key</label><input type='password' id='key' /></div><div><label for='keyConfirm'>Confirm</label><input type='password' id='keyConfirm' /></div><div><label>&nbsp;</label><button id='changeKey'>Change Key</button></div>",
    siteSelector: "<div><label>&nbsp;</label><select id='siteSelect'><option>--Add New--</option><option>--Change Key--</option><option>--Generate Key Pair--</option>{sites}</select></div><div id='siteData'></div>",
    lockedSiteSelector:"<div><label>&nbsp;</label><select id='siteSelect'>{sites}</select></div><div id='siteData'></div>",
    siteData: "<div><label>&nbsp;</label>&nbsp;<span id='siteLink'></span></div><div><label>Username:</label>&nbsp;{username}</div><div id='hiddenPassword'><label>Password:</label><button id='selectPassword'>Select</button><span class='password' id='password'>{password}</span></div><div id='plainTextPassword'><label>Password:</label>&nbsp;{password}</div><div><label>Email:</label>&nbsp;{email}</div><div><label>Notes:</label>&nbsp;{notes}</div><div><label>&nbsp;</label></div><div><button id='edit'>Edit</button></div><div><label>&nbsp;</label><button id='showPassword'>Show Password</button><button id='hidePassword'>Hide Password</button></div><div><label>&nbsp;</label><button id='delete'>Delete</button></div></div>",
    lockedSiteData: "<div><label>&nbsp;</label>&nbsp;<span id='siteLink'></span></div><div><label>Username:</label>&nbsp;{username}</div><div id='hiddenPassword'><label>Password:</label><button id='selectPassword'>Select</button><span class='password' id='password'>{password}</span></div><div id='plainTextPassword'><label>Password:</label>&nbsp;{password}</div><div><label>Email:</label>&nbsp;{email}</div><div><label>Notes:</label>&nbsp;{notes}</div><div><label>&nbsp;</label><button id='showPassword'>Show Password</button><button id='hidePassword'>Hide Password</button></div></div>",
    siteLink: "<a href='{link}' target='_blank'>Link</a>",
    editSiteForm: "<div><label for='siteName'>Site</label><input type='text' id='siteName' value='{site}' /><input type='hidden' id='originalSite' value='{site}' /></div><div><label for='link'>Link</label><input type='text' id='link' value='{link}' /></div><div><label for='username'>Username</label><input type='text' id='username' value='{username}' /></div><div><label for='password'>Password</label><input type='password' id='password' value='{password}' /></div><div><label>&nbsp;</label><button id='generate' class='short'>Random</button><button id='showHide' class='short'>Show</button><button id='select' class='short'>Select</button><span id='hiddenPassword' class='password'></span></div><div><label for='email'>Email</label><input type='text' id='email' value='{email}' /></div><div><label for='notes'>Notes</label><textarea id='notes'>{notes}</textarea></div><div><label>&nbsp;</label><button id='saveNew'>Save</button></div>",
    siteOption: "<option>{siteName}</option>",
    saveForm: "<div><label>1: </label><a href='{link}'>Right Click</a> -&gt; 'Save as'</div><div><label>2: </label>Save as 'vault.txt'</div><div><label>3: </label><button id='saved'>Done</button></div>",
    keyPair: "<div><label>Key 1:</label>{k0}</div><div><label>Key 2:</label>{k1}</div>",
    build: function(template, data){
      var token, templateString = Vault.templates[template];
      while( token = Vault.templates._getToken.exec(templateString) ){
        var tokenValue = data[Vault.templates._extractToken.exec(token)];
        if (tokenValue === undefined) tokenValue = "";
        templateString = templateString.replace(new RegExp(token,"g"), tokenValue);
      }
      return templateString;
    },
    _getToken: new RegExp("\{[a-zA-Z0-9_]+\}"),
    _extractToken: new RegExp("[a-zA-Z0-9_]+")
  },
  init: function(){
    try{
      Vault.encrypted = vault;
      Vault.locked = locked;
      Vault.show.keyForm();
    }catch(e){
      Vault.show.setKeyForm();
    }
  },
  show:{
    keyForm: function(){
      $("container").innerHTML = Vault.templates.build("keyForm");
      $("login").onchange = Vault.show.loginForm;
      Vault.show.loginForm();
    },
    loginForm: function(){
      var login = $("login").value;
      if (login === "Password"){
        $("loginform").innerHTML = Vault.templates.build("loginPassword");
        var keyInput = $("key");
        onEnterKey(keyInput, Vault.decryptVault);
        keyInput.focus();
      } else if (login === "Key Pair") {
        $("loginform").innerHTML = Vault.templates.build("loginKeypair");
        var key1 = $("key1");
        onEnterKey(key1, function(){
          $("key2").focus();
        });
        key1.focus();
        onEnterKey($("key2"), Vault.keypairLogin);
      }
    },
    setKeyForm: function(){
      $("container").innerHTML = Vault.templates.build("setKeyForm");
      $("createVault").onclick = Vault.setKey;
      onEnterKey($("keyConfirm"), Vault.setKey);
      $("key").focus();
    },
    siteSelector: function(){
      var sites = [];
      for(var site in Vault.decrypted){
        sites.push( Vault.templates.build("siteOption",{"siteName" : Vault.esc(site)}) );
      }
      sites.sort(Vault.sort);
      if (Vault.locked){
        $("container").innerHTML = Vault.templates.build("lockedSiteSelector", {"sites" : sites.join("")});
      } else {
        $("container").innerHTML = Vault.templates.build("siteSelector", {"sites" : sites.join("")});
      }
      $("siteSelect").onchange = Vault.show.siteData;
      Vault.show.siteData();
      $("siteSelect").focus();
    },
    newSiteForm: function(){
      $("siteData").innerHTML = Vault.templates.build("editSiteForm", {});
      Vault.setupEditForm();
    },
    save: function(){
      var enc = 'data:text/plain,' + escape('var vault="' + GibberishAES.enc(JSON.stringify(Vault.decrypted), Vault.key).replace(/\n/g,"")) +'", locked = false;';
      $("container").innerHTML = Vault.templates.build("saveForm", {"link": enc});
      $("saved").onclick = Vault.show.siteSelector;
    },
    siteData: function(){
      var site = $("siteSelect").value;
      if (site == "--Add New--"){
        Vault.show.newSiteForm();
      } else if (site == "--Change Key--"){
        Vault.show.changeKeyForm();
      } else if (site == "--Generate Key Pair--"){
        Vault.show.keyPair();
      } else {
        if (Vault.locked){
          $("siteData").innerHTML = Vault.templates.build("lockedSiteData", Vault.decrypted[site]);
        } else {
          $("siteData").innerHTML = Vault.templates.build("siteData", Vault.decrypted[site]);
          $("edit").onclick = Vault.show.editSite;
          $("delete").onclick = Vault.deleteSite;
        }
        if (Vault.decrypted[site].link != ""){
          $("siteLink").innerHTML = Vault.templates.build("siteLink", {"link": Vault.addhttp(Vault.decrypted[site].link)});
        }
        $("selectPassword").onclick = Vault.selectPassword;
        $("showPassword").onclick = Vault.showPassword;
        $("hidePassword").onclick = Vault.hidePassword;
      }
    },
    changeKeyForm: function(){
      $("siteData").innerHTML = Vault.templates.build("changeKeyForm");
      onEnterKey($("keyConfirm"),Vault.changeKey);
      $("changeKey").onclick = Vault.changeKey;
    },
    keyPair: function(){
      $("siteData").innerHTML = Vault.templates.build("keyPair", Vault.generateKeyPair(Vault.key));
    },
    editSite: function(){
      $("siteData").innerHTML = Vault.templates.build("editSiteForm", Vault.decrypted[$("siteSelect").value]);
      Vault.setupEditForm();
    }
  },
  decryptVault: function(){
    try{
      var tryKey = $("key").value;
      Vault.decrypted = JSON.parse(GibberishAES.dec(Vault.encrypted, tryKey));
      Vault.key = tryKey;
      Vault.show.siteSelector();
    } catch(e){
      alert("Bad Key");
    }
  },
  keypairLogin: function(){
    $("key").value = Vault.passwordFromKeyPair($("key1").value, $("key2").value);
    Vault.decryptVault();
  },
  setKey: function(){
    var key1 = $("key").value;
    var key2 = $("keyConfirm").value;
    if (key1 == key2){
      Vault.key = key1;
      if (Vault.decrypted == undefined) Vault.decrypted = {};
      if (Vault.locked == undefined) Vault.locked = false;
      Vault.show.siteSelector();
    } else {
      alert("Keys do not match");
    }
  },
  saveSite: function(){
    var site = $("siteName").value;
    if (site === ""){
      alert("Site is required");
    } else {
      var originalSite = $("originalSite").value;
      if (originalSite != "" && originalSite != site) delete Vault.decrypted[originalSite];
      var password = Vault.esc($("password").value);
      if (password == "") password = Vault.generatePassword();
      Vault.decrypted[site] = {
        "link" : Vault.esc($("link").value),
        "username" : Vault.esc($("username").value),
        "password" : password,
        "email" : Vault.esc($("email").value),
        "notes" : Vault.esc($("notes").value),
        "site" : Vault.esc(site)
      };
      Vault.show.save();
    }
  },
  changeKey: function(){
    var newKey = $("key").value;
    if (newKey != $("keyConfirm").value ){
      alert("Keys do not match");
    } else {
      Vault.key = newKey;
      Vault.show.save();
    }
  },
  deleteSite: function(){
    var site = $("siteSelect").value;
    if (confirm("Are you sure you want to delete " + site)){
      delete Vault.decrypted[site];
      Vault.show.save();
    }
  },
  showPassword: function(){
    $("plainTextPassword").style.display = "block";
    $("hiddenPassword").style.display = "none";
    $("showPassword").style.display = "none";
    $("hidePassword").style.display = "inline";
  },
  hidePassword: function(){
    $("plainTextPassword").style.display = "none";
    $("hiddenPassword").style.display = "block";
    $("showPassword").style.display = "inline";
    $("hidePassword").style.display = "none";
  },
  setupEditForm: function(){
    $("generate").onclick = Vault.populatePassword;
    $("showHide").onclick = Vault.editShowHide;
    $("password").onkeyup = Vault.updateHiddenPassword;
    $("select").onclick = function(){ Vault.fnSelect("hiddenPassword"); };
    $("saveNew").onclick = Vault.saveSite;
  },
  selectPassword: function(){
    Vault.fnSelect("password");
  },
  addhttp: function(url) {
    if (!/^(f|ht)tps?:\/\//.test(url)) url = "http://" + url;
    return url;
  },
  generatePassword: function(){
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()\/+-!";
    var randomPassword = "";
    for(var i=0; i<20; i++){
      randomPassword += chars[ Math.floor(Math.random()*chars.length)];
    }
    return randomPassword;
  },
  populatePassword: function(){
    $("password").value = Vault.generatePassword();
    $("hiddenPassword").innerHTML = $("password").value;
  },
  editShowHide: function(){
    if ($("showHide").innerHTML === "Show"){
      $("showHide").innerHTML = "Hide";
      $("password").type = "text";
    } else {
      $("showHide").innerHTML = "Show";
      $("password").type = "password";
    }
  },
  updateHiddenPassword: function(){
    $("hiddenPassword").innerHTML = $("password").value;
  },
  esc: function(s){
    var escape = [
      ["'","&#39;"],
      ['"',"&#34;"],
      [">","&gt;"],
      ["<","&lt;"]
    ];
    for(var i=0; i<escape.length; i++){
      s = s.replace(escape[i][0], escape[i][1]);
    }
    return s;
  },
  sort: function(a,b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if( a == b) return 0;
    if( a > b) return 1;
    return -1;
  },
  fnSelect: function(objId) {
    if (document.selection) {
      document.selection.empty();
      var range = document.body.createTextRange();
      range.moveToElementText(document.getElementById(objId));
      range.select();
    } else if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById(objId).firstChild);
      window.getSelection().addRange(range);
    }
  },
  hex: function(str){
    var hex = [], l = str.length, i;
    for(i=0; i<l; i+=1){
      hex.push(str.charCodeAt(i).toString(16));
    }
    return hex;
  },
  generateKeyPair: function(password){
    var hex = Vault.hex(password);
    var l = hex.length;
    var keys = [[],[]];
    var ll, i, j, r;
    for(i=0; i<l; i+=1){
      ll = hex[i].length;
      keys[0].push("");
      keys[1].push("");
      for(j=0; j<ll; j+=1){
        r = Math.floor(Math.random()*16);
        keys[0][i] += r.toString(16);
        keys[1][i] += (parseInt(hex[i][j],16) ^ r).toString(16);
      }
    }
    return {"k0": keys[0].join(), "k1":keys[1].join()};
  },
  passwordFromKeyPair: function(key1, key2){
    key1 = key1.split(",");
    key2 = key2.split(",");
    if (key1.length !== key2.length) return;
    var l = key1.length;
    var password = "";
    var i;
    for(i=0; i<l; i+=1){
      password += String.fromCharCode( parseInt(key1[i], 16) ^ parseInt(key2[i], 16) );
    }
    return password;
  }
};

window.onload = Vault.init;